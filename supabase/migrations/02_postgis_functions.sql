-- =====================================================================
-- ServiceOS — PostGIS Spatial Dispatch & Escrow Engine Functions
-- =====================================================================

-- 1. PostGIS Find Nearest Available Certified Technicians
CREATE OR REPLACE FUNCTION find_nearest_technicians(
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    p_radius_meters INT DEFAULT 40000,
    p_trade_category VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    provider_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    trade_category VARCHAR,
    vehicle_make_model VARCHAR,
    vehicle_plate VARCHAR,
    average_rating NUMERIC,
    reviews_count INT,
    distance_miles NUMERIC,
    estimated_eta_minutes INT,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    customer_point GEOGRAPHY;
BEGIN
    customer_point := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;

    RETURN QUERY
    SELECT 
        u.id AS provider_id,
        u.first_name,
        u.last_name,
        p.trade_category,
        p.vehicle_make_model,
        p.vehicle_plate,
        p.average_rating,
        p.reviews_count,
        ROUND((ST_Distance(p.current_location, customer_point) / 1609.344)::numeric, 1) AS distance_miles,
        GREATEST(5, ROUND((ST_Distance(p.current_location, customer_point) / 1609.344 * 3.5)::numeric))::int AS estimated_eta_minutes,
        ST_Y(p.current_location::geometry) AS current_lat,
        ST_X(p.current_location::geometry) AS current_lng
    FROM provider_profiles p
    JOIN users u ON u.id = p.user_id
    WHERE p.is_online = TRUE 
      AND p.is_verified = TRUE
      AND (p_trade_category IS NULL OR p.trade_category ILIKE '%' || p_trade_category || '%')
      AND ST_DWithin(p.current_location, customer_point, LEAST(p_radius_meters, p.service_radius_meters))
    ORDER BY ST_Distance(p.current_location, customer_point) ASC
    LIMIT 10;
END;
$$;

-- 1b. Mobile RPC Alias: get_nearby_technicians (Used by Flutter SupabaseRemoteDataSource)
CREATE OR REPLACE FUNCTION get_nearby_technicians(
    user_lat DOUBLE PRECISION,
    user_lng DOUBLE PRECISION,
    radius_meters INT DEFAULT 40000
)
RETURNS TABLE (
    provider_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    trade_category VARCHAR,
    vehicle_make_model VARCHAR,
    vehicle_plate VARCHAR,
    average_rating NUMERIC,
    reviews_count INT,
    distance_miles NUMERIC,
    estimated_eta_minutes INT,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY SELECT * FROM find_nearest_technicians(user_lat, user_lng, radius_meters);
END;
$$;

-- 2. Financial Escrow Calculator (15% Platform Take Rate + 7% Sales Tax)
CREATE OR REPLACE FUNCTION calculate_booking_financials(
    p_labor_cents BIGINT,
    p_parts_cents BIGINT DEFAULT 0,
    p_is_emergency BOOLEAN DEFAULT FALSE,
    p_tax_rate_basis_points INT DEFAULT 700 -- 7.00% Florida
)
RETURNS TABLE (
    diagnostic_fee_cents BIGINT,
    emergency_surcharge_cents BIGINT,
    subtotal_cents BIGINT,
    tax_cents BIGINT,
    platform_take_cents BIGINT,
    provider_net_cents BIGINT,
    total_authorized_cents BIGINT
)
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_diag BIGINT := 2000; -- $20.00 base diagnostic
    v_emerg BIGINT := 0;
    v_subtotal BIGINT;
    v_tax BIGINT;
    v_platform BIGINT;
    v_provider_net BIGINT;
    v_total BIGINT;
BEGIN
    IF p_is_emergency THEN
        v_emerg := 4900; -- $49.00 rapid emergency dispatch
    END IF;

    v_subtotal := p_labor_cents + p_parts_cents + v_diag + v_emerg;
    v_tax := ROUND((v_subtotal * p_tax_rate_basis_points) / 10000.0);
    
    -- Platform takes 15% of labor, diag, and emergency surcharge (parts passed through 100%)
    v_platform := ROUND(((p_labor_cents + v_diag + v_emerg) * 1500) / 10000.0);
    
    -- Provider net payout is 85% of labor/surge/diag + 100% of approved parts
    v_provider_net := (p_labor_cents + v_diag + v_emerg - v_platform) + p_parts_cents;
    
    v_total := v_subtotal + v_tax;

    RETURN QUERY SELECT v_diag, v_emerg, v_subtotal, v_tax, v_platform, v_provider_net, v_total;
END;
$$;

-- 3. Arrival Geofence Verification (Must be within 250m to check in)
CREATE OR REPLACE FUNCTION verify_arrival_geofence(
    p_booking_id UUID,
    p_tech_lat DOUBLE PRECISION,
    p_tech_lng DOUBLE PRECISION
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_job_location GEOGRAPHY;
    v_tech_location GEOGRAPHY;
    v_distance_meters DOUBLE PRECISION;
BEGIN
    SELECT service_location INTO v_job_location FROM bookings WHERE id = p_booking_id;
    IF v_job_location IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    v_tech_location := ST_SetSRID(ST_MakePoint(p_tech_lng, p_tech_lat), 4326)::geography;
    v_distance_meters := ST_Distance(v_job_location, v_tech_location);

    IF v_distance_meters <= 250 THEN
        UPDATE bookings 
        SET status = 'ARRIVED', 
            actual_arrival_at = NOW(),
            updated_at = NOW()
        WHERE id = p_booking_id;
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Geofence error: Technician is % meters away. Must be within 250 meters.', ROUND(v_distance_meters::numeric);
    END IF;
END;
$$;

-- 4. Escrow Release upon Customer PIN Verification
CREATE OR REPLACE FUNCTION release_escrow_to_technician(
    p_booking_id UUID,
    p_pin_code VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_actual_pin VARCHAR;
    v_provider_id UUID;
    v_net_payout BIGINT;
BEGIN
    SELECT safety_pin, provider_id, net_payout_cents 
    INTO v_actual_pin, v_provider_id, v_net_payout
    FROM bookings 
    WHERE id = p_booking_id;

    IF v_actual_pin IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    IF v_actual_pin != p_pin_code THEN
        RAISE EXCEPTION 'Security PIN verification failed. Incorrect 4-digit PIN provided.';
    END IF;

    -- Update Booking Status
    UPDATE bookings 
    SET status = 'COMPLETED',
        escrow_status = 'RELEASED_TO_PROVIDER',
        work_completed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_booking_id;

    -- Update Technician Completed Count
    UPDATE provider_profiles
    SET completed_jobs_count = completed_jobs_count + 1,
        updated_at = NOW()
    WHERE user_id = v_provider_id;

    RETURN TRUE;
END;
$$;

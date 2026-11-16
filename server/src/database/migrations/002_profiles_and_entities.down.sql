-- Rollback: 002_profiles_and_entities.down.sql
DROP TABLE IF EXISTS customer_addresses CASCADE;
DROP TABLE IF EXISTS provider_shifts CASCADE;
DROP TABLE IF EXISTS provider_locations CASCADE;
DROP TABLE IF EXISTS provider_profiles CASCADE;
DROP TABLE IF EXISTS customer_profiles CASCADE;
DROP TABLE IF EXISTS staff_profiles CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;

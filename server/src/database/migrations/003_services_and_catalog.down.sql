-- Rollback: 003_services_and_catalog.down.sql
DROP TABLE IF EXISTS service_pricing_tiers CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;

-- Rollback: 004_bookings_and_dispatch.down.sql
DROP TABLE IF EXISTS work_order_proofs CASCADE;
DROP TABLE IF EXISTS booking_timeline_events CASCADE;
DROP TABLE IF EXISTS dispatch_broadcasts CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

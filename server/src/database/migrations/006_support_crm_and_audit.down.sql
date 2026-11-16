-- Rollback: 006_support_crm_and_audit.down.sql
DROP TABLE IF EXISTS installer_provision_logs CASCADE;
DROP TABLE IF EXISTS integration_configs CASCADE;
DROP TABLE IF EXISTS tenant_cms_configs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notification_logs CASCADE;
DROP TABLE IF EXISTS customer_reviews CASCADE;
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;

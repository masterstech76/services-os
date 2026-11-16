import { pool } from './pool.js';

export async function verifyDatabaseSchema(): Promise<{
  success: boolean;
  errors: string[];
  tablesFound: string[];
  extensions: string[];
}> {
  const errors: string[] = [];
  const requiredTables = [
    'tenants',
    'users',
    'user_sessions',
    'user_mfa_credentials',
    'permissions',
    'role_permissions',
    'admin_profiles',
    'staff_profiles',
    'customer_profiles',
    'provider_profiles',
    'provider_locations',
    'provider_shifts',
    'customer_addresses',
    'service_categories',
    'services',
    'service_pricing_tiers',
    'bookings',
    'dispatch_broadcasts',
    'booking_timeline_events',
    'work_order_proofs',
    'invoices',
    'invoice_items',
    'payment_transactions',
    'webhook_events',
    'ledger_accounts',
    'ledger_entries',
    'provider_payouts',
    'support_tickets',
    'ticket_messages',
    'customer_reviews',
    'notification_logs',
    'audit_logs',
    'tenant_cms_configs',
    'integration_configs',
    'installer_provision_logs'
  ];

  try {
    // 1. Verify Extensions
    const extRes = await pool.query<{ extname: string }>(
      'SELECT extname FROM pg_extension WHERE extname IN (\'postgis\', \'uuid-ossp\')'
    );
    const extensions = extRes.rows.map(r => r.extname);
    if (!extensions.includes('uuid-ossp')) {
      errors.push('Extension uuid-ossp is not installed');
    }
    if (!extensions.includes('postgis')) {
      errors.push('Extension postgis is not installed');
    }

    // 2. Verify Tables
    const tableRes = await pool.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );
    const tablesFound = tableRes.rows.map(r => r.table_name);

    for (const table of requiredTables) {
      if (!tablesFound.includes(table)) {
        errors.push(`Required database table missing: public.${table}`);
      }
    }

    // 3. Verify Spatial Index
    const indexRes = await pool.query<{ indexname: string }>(
      `SELECT indexname FROM pg_indexes 
       WHERE tablename = 'provider_locations' AND indexname = 'idx_provider_locations_gist'`
    );
    if (indexRes.rows.length === 0) {
      errors.push('Spatial index idx_provider_locations_gist missing on provider_locations');
    }

    // 4. Verify Zero Fake / Demo Records
    if (tablesFound.includes('users')) {
      const userCountRes = await pool.query<{ count: string }>('SELECT COUNT(*) as count FROM users');
      const count = parseInt(userCountRes.rows[0].count, 10);
      if (count > 0) {
        console.warn(`[Audit Notice] Database contains ${count} user record(s). (Verify genuine accounts vs demo data)`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
      tablesFound,
      extensions
    };
  } catch (err: any) {
    return {
      success: false,
      errors: [err.message || 'Database connection error'],
      tablesFound: [],
      extensions: []
    };
  }
}

if (process.argv[1] && process.argv[1].endsWith('verify.ts')) {
  (async () => {
    console.log('Running Database Schema Verification...');
    const result = await verifyDatabaseSchema();
    if (result.success) {
      console.log('✓ Database verification passed! All tables and PostGIS spatial extensions confirmed.');
      process.exit(0);
    } else {
      console.error('✗ Database verification failed with errors:');
      result.errors.forEach(e => console.error(`  - ${e}`));
      process.exit(1);
    }
  })();
}

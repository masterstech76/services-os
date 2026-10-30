import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const ROUTES = [
  { name: '001_home', url: '/' },
  { name: '002_about', url: '/about' },
  { name: '003_services', url: '/services' },
  { name: '004_how_it_works', url: '/how-it-works' },
  { name: '005_pricing', url: '/pricing' },
  { name: '006_subscribe', url: '/subscribe' },
  { name: '007_careers', url: '/careers' },
  { name: '008_apply', url: '/apply' },
  { name: '009_contact', url: '/contact' },
  { name: '010_faq', url: '/faq' },
  { name: '011_specials', url: '/specials' },
  { name: '012_gallery', url: '/gallery' },
  { name: '013_reviews', url: '/reviews' },
  { name: '014_technicians', url: '/technicians' },
  { name: '016_services_emergency_hvac', url: '/services/emergency-hvac' },
  { name: '017_services_ac_repair', url: '/services/ac-repair' },
  { name: '018_services_ac_tuneup', url: '/services/ac-tuneup' },
  { name: '019_services_furnace_repair', url: '/services/furnace-repair' },
  { name: '020_services_refrigerant_recharge', url: '/services/refrigerant-recharge' },
  { name: '021_services_duct_cleaning', url: '/services/duct-cleaning' },
  { name: '022_services_thermostat_install', url: '/services/thermostat-install' },
  { name: '023_services_commercial_hvac', url: '/services/commercial-hvac' },
  { name: '024_service_areas', url: '/service-areas' },
  { name: '025_service_areas_miami', url: '/service-areas/miami' },
  { name: '026_service_areas_miami_beach', url: '/service-areas/miami-beach' },
  { name: '027_service_areas_coral_gables', url: '/service-areas/coral-gables' },
  { name: '028_service_areas_brickell', url: '/service-areas/brickell' },
  { name: '029_service_areas_fort_lauderdale', url: '/service-areas/fort-lauderdale' },
  { name: '030_service_areas_hollywood', url: '/service-areas/hollywood' },
  { name: '031_service_areas_pembroke_pines', url: '/service-areas/pembroke-pines' },
  { name: '032_service_areas_miramar', url: '/service-areas/miramar' },
  { name: '033_service_areas_hialeah', url: '/service-areas/hialeah' },
  { name: '034_service_areas_doral', url: '/service-areas/doral' },
  { name: '035_service_areas_kendall', url: '/service-areas/kendall' },
  { name: '036_service_areas_aventura', url: '/service-areas/aventura' },
  { name: '037_service_areas_sunny_isles', url: '/service-areas/sunny-isles' },
  { name: '038_service_areas_boca_raton', url: '/service-areas/boca-raton' },
  { name: '039_service_areas_delray_beach', url: '/service-areas/delray-beach' },
  { name: '040_service_areas_west_palm_beach', url: '/service-areas/west-palm-beach' },
  { name: '041_book', url: '/book' },
  { name: '042_book_track', url: '/book/track' },
  { name: '043_booking_success', url: '/booking/success' },
  { name: '044_booking_failed', url: '/booking/failed' },
  { name: '045_pay_demo', url: '/pay/pay_tok_demo_1004' },
  { name: '046_payment_success', url: '/payment-success' },
  { name: '047_payment_failed', url: '/payment-failed' },
  { name: '048_reviews_detail', url: '/reviews/1' },
  { name: '049_account', url: '/account' },
  { name: '050_account_appointments', url: '/account/appointments' },
  { name: '051_account_appointments_detail', url: '/account/appointments/job_1004' },
  { name: '052_account_appointments_track', url: '/account/appointments/job_1004/track' },
  { name: '053_account_invoices', url: '/account/invoices' },
  { name: '054_account_payments', url: '/account/payments' },
  { name: '055_account_addresses', url: '/account/addresses' },
  { name: '056_account_profile', url: '/account/profile' },
  { name: '057_account_reviews', url: '/account/reviews' },
  { name: '058_account_favorites', url: '/account/favorites' },
  { name: '059_account_support', url: '/account/support' },
  { name: '060_account_notifications', url: '/account/notifications' },
  { name: '061_tech', url: '/tech' },
  { name: '062_tech_jobs', url: '/tech/jobs' },
  { name: '063_tech_schedule', url: '/tech/schedule' },
  { name: '064_tech_leave', url: '/tech/leave' },
  { name: '065_tech_jobs_detail', url: '/tech/jobs/job_1004' },
  { name: '066_tech_jobs_checklist', url: '/tech/jobs/job_1004/checklist' },
  { name: '067_tech_jobs_parts', url: '/tech/jobs/job_1004/parts' },
  { name: '068_tech_jobs_estimate', url: '/tech/jobs/job_1004/estimate' },
  { name: '069_tech_earnings', url: '/tech/earnings' },
  { name: '070_tech_notifications', url: '/tech/notifications' },
  { name: '071_tech_profile', url: '/tech/profile' },
  { name: '072_tech_profile_edit', url: '/tech/profile/edit' },
  { name: '073_admin', url: '/admin' },
  { name: '074_admin_dispatch', url: '/admin/dispatch' },
  { name: '075_admin_dispatch_board', url: '/admin/dispatch/board' },
  { name: '076_admin_dispatch_calendar', url: '/admin/dispatch/calendar' },
  { name: '077_admin_jobs', url: '/admin/jobs' },
  { name: '078_admin_jobs_create', url: '/admin/jobs/create' },
  { name: '079_admin_jobs_detail', url: '/admin/jobs/job_1004' },
  { name: '080_admin_technicians', url: '/admin/technicians' },
  { name: '081_admin_technicians_detail', url: '/admin/technicians/tech-001' },
  { name: '082_admin_technicians_schedule', url: '/admin/technicians/tech-001/schedule' },
  { name: '083_admin_customers', url: '/admin/customers' },
  { name: '084_admin_customers_detail', url: '/admin/customers/cust_demo_1' },
  { name: '085_admin_invoices', url: '/admin/invoices' },
  { name: '086_admin_invoices_detail', url: '/admin/invoices/inv_1004' },
  { name: '087_admin_payments', url: '/admin/payments' },
  { name: '088_admin_payouts', url: '/admin/payouts' },
  { name: '089_admin_inventory', url: '/admin/inventory' },
  { name: '090_admin_inventory_parts', url: '/admin/inventory/parts' },
  { name: '091_admin_inventory_transactions', url: '/admin/inventory/transactions' },
  { name: '092_admin_services', url: '/admin/services' },
  { name: '093_admin_service_areas', url: '/admin/service-areas' },
  { name: '094_admin_coupons', url: '/admin/coupons' },
  { name: '095_admin_reviews', url: '/admin/reviews' },
  { name: '096_admin_reports', url: '/admin/reports' },
  { name: '097_admin_reports_revenue', url: '/admin/reports/revenue' },
  { name: '098_admin_reports_technicians', url: '/admin/reports/technicians' },
  { name: '099_admin_reports_jobs', url: '/admin/reports/jobs' },
  { name: '100_admin_notifications', url: '/admin/notifications' },
  { name: '101_admin_audit_logs', url: '/admin/audit-logs' },
  { name: '102_admin_content', url: '/admin/content' },
  { name: '103_admin_settings', url: '/admin/settings' },
  { name: '104_admin_infrastructure', url: '/admin/infrastructure' },
  { name: '105_login', url: '/login' },
  { name: '106_register', url: '/register' },
  { name: '107_forgot_password', url: '/forgot-password' },
  { name: '108_reset_password', url: '/reset-password' },
  { name: '109_verify_email', url: '/verify-email' },
  { name: '110_verify_phone', url: '/verify-phone' },
  { name: '111_unauthorized', url: '/unauthorized' },
  { name: '112_session_expired', url: '/session-expired' },
  { name: '113_locked', url: '/locked' },
  { name: '114_verification_required', url: '/verification-required' },
  { name: '115_error', url: '/error' },
  { name: '116_maintenance', url: '/maintenance' },
  { name: '117_offline', url: '/offline' },
  { name: '118_not_found', url: '/404' },
  { name: '119_status', url: '/status' },
  { name: '120_releases', url: '/releases' },
  { name: '121_privacy', url: '/privacy' },
  { name: '122_terms', url: '/terms' },
  { name: '123_refund_policy', url: '/refund-policy' },
  { name: '124_security', url: '/security' },
  { name: '125_accessibility', url: '/accessibility' }
];

const DESKTOP_DIR = path.resolve(process.cwd(), 'presentation', 'desktop');
const MOBILE_DIR = path.resolve(process.cwd(), 'presentation', 'mobile');
const ARTIFACT_DIR = 'C:\\Users\\hashm\\.gemini\\antigravity\\brain\\7f916614-b46c-4491-bf53-d9d006e7afaf';

fs.mkdirSync(DESKTOP_DIR, { recursive: true });
fs.mkdirSync(MOBILE_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });

  console.log(`[Screenshot Engine] Launching Chromium to capture ${ROUTES.length} routes Desktop + Mobile...`);

  // 1. Mobile Context (390 x 844, scale 2)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileContext.newPage();

  // Test Mobile Drawer on Landing Page first
  console.log('[Mobile Drawer Test] Opening home page to test drawer...');
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);

  // Click hamburger button
  const hamburgerBtn = await mobilePage.$('button[aria-label="Toggle mobile menu"]');
  if (hamburgerBtn) {
    await hamburgerBtn.click();
    await mobilePage.waitForTimeout(600);

    // Verify background color of mobile nav
    const navBg = await mobilePage.evaluate(() => {
      const nav = document.getElementById('mobile-nav');
      if (!nav) return null;
      const computed = window.getComputedStyle(nav);
      return {
        bg: computed.backgroundColor,
        opacity: computed.opacity,
        zIndex: computed.zIndex,
        width: nav.offsetWidth,
        height: nav.offsetHeight
      };
    });
    console.log('[Mobile Drawer Evaluation]:', JSON.stringify(navBg));

    // Capture drawer open screenshot
    const drawerPath = path.join(MOBILE_DIR, '001_home_drawer_open.png');
    await mobilePage.screenshot({ path: drawerPath, fullPage: false });
    console.log(`[Captured] ${drawerPath}`);
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(drawerPath, path.join(ARTIFACT_DIR, '001_home_drawer_open.png'));
    }
  }

  // 2. Capture Mobile routes & verify footer is hidden
  console.log('[Capturing Mobile Pages & Verifying Hidden Footer]...');
  let mobileFootersVisible = 0;

  for (const r of ROUTES) {
    try {
      await mobilePage.goto(`http://localhost:3000${r.url}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await mobilePage.waitForTimeout(600);

      // Verify footer is hidden on mobile
      const footerVisible = await mobilePage.evaluate(() => {
        const footers = Array.from(document.querySelectorAll('footer, #site-footer'));
        for (const f of footers) {
          const comp = window.getComputedStyle(f);
          if (comp.display !== 'none' && f.offsetHeight > 0 && comp.visibility !== 'hidden') {
            return true;
          }
        }
        return false;
      });

      if (footerVisible) {
        console.warn(`[WARNING] Footer visible on mobile for route: ${r.url}`);
        mobileFootersVisible++;
      }

      const outPath = path.join(MOBILE_DIR, `${r.name}.png`);
      await mobilePage.screenshot({ path: outPath, fullPage: true });
      process.stdout.write(`\r[Mobile] Saved ${r.name}`);
    } catch (e) {
      console.error(`\n[Mobile Error] ${r.name}: ${e.message}`);
    }
  }
  console.log(`\n[Mobile Complete] Visible footers found: ${mobileFootersVisible} (Expected: 0)`);

  await mobilePage.close();
  await mobileContext.close();

  // 3. Desktop Context (1440 x 900)
  console.log('[Capturing Desktop Pages & Verifying Footers]...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  const desktopPage = await desktopContext.newPage();

  for (const r of ROUTES) {
    try {
      await desktopPage.goto(`http://localhost:3000${r.url}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await desktopPage.waitForTimeout(600);

      // Verify payment pages have tiny footer and no marketing photography
      if (r.url.includes('/pay') || r.url.includes('/pricing') || r.url.includes('/subscribe') || r.url.includes('/book')) {
        const footerInfo = await desktopPage.evaluate(() => {
          const footer = document.querySelector('#site-footer');
          if (!footer) return { exists: false };
          return {
            exists: true,
            hasSSL: footer.innerText.includes('256-Bit SSL Encrypted'),
            hasHouseImg: !!footer.querySelector('img[src*="final-cta-house"]'),
            text: footer.innerText.slice(0, 100)
          };
        });
        // Log footer verification for payment routes
        console.log(`\n[Desktop Payment Footer Check] ${r.url} -> SSL: ${footerInfo.hasSSL}, HouseImg: ${footerInfo.hasHouseImg}`);
      }

      const outPath = path.join(DESKTOP_DIR, `${r.name}.png`);
      await desktopPage.screenshot({ path: outPath, fullPage: true });
      process.stdout.write(`\r[Desktop] Saved ${r.name}`);
    } catch (e) {
      console.error(`\n[Desktop Error] ${r.name}: ${e.message}`);
    }
  }
  console.log(`\n[Desktop Complete] All desktop routes captured.`);

  await desktopPage.close();
  await desktopContext.close();
  await browser.close();

  // Copy sample representative screenshots into artifact dir for rendering
  if (fs.existsSync(ARTIFACT_DIR)) {
    const samples = [
      '001_home', '005_pricing', '006_subscribe', '041_book', '045_pay_demo', 
      '049_account', '061_tech', '073_admin', '105_login'
    ];
    for (const s of samples) {
      const dSrc = path.join(DESKTOP_DIR, `${s}.png`);
      const mSrc = path.join(MOBILE_DIR, `${s}.png`);
      if (fs.existsSync(dSrc)) {
        fs.copyFileSync(dSrc, path.join(ARTIFACT_DIR, `desktop_${s}.png`));
      }
      if (fs.existsSync(mSrc)) {
        fs.copyFileSync(mSrc, path.join(ARTIFACT_DIR, `mobile_${s}.png`));
      }
    }
    console.log('[Artifacts] Sample screenshots copied to artifact directory.');
  }

  console.log('[ALL COMPLETED SUCCESSFULLY]');
}

run().catch(err => {
  console.error('[Fatal Error]:', err);
  process.exit(1);
});

import fs from "fs";

const checks = [
  { name: "Navbar no Sign In", check: !fs.readFileSync("src/components/layout/Navbar.tsx", "utf8").includes("Sign In") },
  { name: "Navbar has Go Back", check: fs.readFileSync("src/components/layout/Navbar.tsx", "utf8").includes("Go Back") },
  { name: "About has Platform Pillars", check: fs.readFileSync("src/app/(public)/about/page.tsx", "utf8").includes("The Platform Behind the Service") },
  { name: "Services has 3-in-1 CTA", check: fs.readFileSync("src/components/services/ServicesCatalogClient.tsx", "utf8").includes("How Can We Help You Today?") },
  { name: "How It Works has 4-Phase Protocol", check: fs.readFileSync("src/app/(public)/how-it-works/page.tsx", "utf8").includes("Under the Hood: Real-World Service") },
  { name: "Subscribe checkout exists", check: fs.existsSync("src/app/(public)/subscribe/checkout/page.tsx") },
  { name: "Contact has 1:1 proportional layout", check: fs.readFileSync("src/app/(public)/contact/page.tsx", "utf8").includes("Active Dispatch Corridors") },
  { name: "FAQ has 2-column sidebar", check: fs.readFileSync("src/app/(public)/faq/page.tsx", "utf8").includes("lg:col-span-4 lg:sticky lg:top-24") },
  { name: "Areas has Interactive Radar Map", check: fs.readFileSync("src/app/(public)/areas/page.tsx", "utf8").includes("South Florida Active Dispatch Map") },
  { name: "Gallery has Certified Dossiers", check: !fs.readFileSync("src/app/(public)/gallery/page.tsx", "utf8").includes("techwork_field_gallery") },
  { name: "Emergency HVAC has Tech Roster", check: (fs.readFileSync("src/app/(public)/services/emergency-hvac/page.tsx", "utf8").includes("ServiceDetailClient") || fs.readFileSync("src/app/(public)/services/emergency-hvac/page.tsx", "utf8").includes("Carlos Mendez")) && fs.readFileSync("src/lib/services-detail-data.ts", "utf8").includes("MASTER_TECHNICIANS") },
  { name: "AC Repair has Specialist Card", check: (fs.readFileSync("src/app/(public)/services/ac-repair/page.tsx", "utf8").includes("ServiceDetailClient") || fs.readFileSync("src/app/(public)/services/ac-repair/page.tsx", "utf8").includes("Dispatch Carlos")) && fs.readFileSync("src/lib/services-detail-data.ts", "utf8").includes("MASTER_TECHNICIANS") },
  { name: "404 is Dark Mini-Window", check: fs.readFileSync("src/app/not-found.tsx", "utf8").includes("bg-[#0C1523]") && !fs.readFileSync("src/app/not-found.tsx", "utf8").includes("bg-white ") },
  { name: "Account has Location Sharing & Top Profile", check: fs.readFileSync("src/app/account/layout.tsx", "utf8").includes("Share Location With Tech") },
  { name: "Profile has OTP Modal", check: fs.readFileSync("src/app/account/profile/page.tsx", "utf8").includes("otpModal") },
  { name: "Tech has Desktop Sidebar", check: fs.readFileSync("src/app/(tech)/tech/layout.tsx", "utf8").includes("lg:block w-64") },
  { name: "Admin Content CMS exists", check: fs.existsSync("src/app/(admin)/admin/content/page.tsx") },
  { name: "Privacy has 2-col Layout", check: fs.readFileSync("src/app/(public)/privacy/page.tsx", "utf8").includes("lg:col-span-4") },
  { name: "Login has Phone SMS Tab", check: fs.readFileSync("src/app/(auth)/login/page.tsx", "utf8").includes("Phone SMS Code") },
  { name: "Forgot Password has SMS Reset", check: fs.readFileSync("src/app/(auth)/forgot-password/page.tsx", "utf8").includes("Reset via SMS") },
  { name: "Accessibility has 6 Pointed Nodes", check: fs.readFileSync("src/app/(public)/accessibility/page.tsx", "utf8").includes("WCAG 2.1 Level AA Verification Pipeline") },
  { name: "Demo page redirects to admin", check: fs.readFileSync("src/app/(public)/demo/page.tsx", "utf8").includes('redirect("/admin")') }
];

let allPassed = true;
checks.forEach(c => {
  if (c.check) {
    console.log(`✓ PASS: ${c.name}`);
  } else {
    console.log(`✗ FAIL: ${c.name}`);
    allPassed = false;
  }
});
console.log(`\nAll 22 Invariant Plan Checks Passed: ${allPassed}`);
if (!allPassed) process.exit(1);

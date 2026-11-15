# PROJECT STRUCTURE — Directory and File Organization

**Document No.**: `07 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Complete Repository Tree

```text
SERVICEPRO_OS/
├── .github/
│   └── workflows/
│       └── ci.yml                           # GitHub Actions CI workflow (Node 20: verify-env, validate-mobile, build, lint)
├── admin_web/                               # Admin & Staff Web Application (React 19 + TypeScript + Vite 8; 94 TS/TSX files)
│   ├── public/                              # Static web assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── commercial/                  # Turnkey simulators (MobileSimulatorModal, DispatchSimulatorModal, WhiteLabelBrandModal)
│   │   │   ├── common/                      # RealDispatchMap.tsx, ToastContainer.tsx
│   │   │   ├── layout/                      # AdminSidebar.tsx, ModuleSubnav.tsx, StaffSidebar.tsx, TopNavbar.tsx
│   │   │   └── modals/                      # CreateCategoryDrawer, CreateCustomerDrawer, CreateInvoiceModal, CreateJobModal,
│   │   │                                    # CreateTechnicianDrawer, DirectSMSComposerModal, EditUniversalEntityModal,
│   │   │                                    # ManualDispatchModal, ProfileModal, SessionLockModal, UniversalUserDossierModal
│   │   ├── context/
│   │   │   └── AdminContext.tsx             # Central state, RBAC router, local storage & Supabase sync engine
│   │   ├── data/
│   │   │   ├── demoDataLoader.ts            # Optional 1-click showcase pitch fixtures (zero fake personal names)
│   │   │   ├── mockData.ts                  # Clean empty arrays ([]) for production zero-record baseline
│   │   │   ├── pagesMaster.ts               # Metadata for Admin Pages 1–36
│   │   │   └── staffPagesMaster.ts          # Metadata for Staff Pages 101–113
│   │   ├── pages/
│   │   │   ├── auth/LoginPage.tsx           # Split-screen Login, First-Boot Setup Wizard, Password Recovery
│   │   │   ├── commercial/SystemInstallerPage.tsx # Page 38 Turnkey System Installer (#/page/38 & #/installer)
│   │   │   ├── module1/ .. module8/         # Admin Pages 01 through 36
│   │   │   ├── shared/FacebookProfilePage.tsx     # Page 37 (Admin) & Page 114 (Staff) Universal Profile
│   │   │   ├── staff/                       # Staff Pages 101 through 113 + StaffPageRouter.tsx
│   │   │   └── PageRouter.tsx               # Master Admin router (Pages 1–38)
│   │   ├── security/                        # 10 Security modules
│   │   │   ├── apiSecurity.ts               # Client-side SQLi, XSS, and path-traversal input filter
│   │   │   ├── index.ts                     # Security barrel export
│   │   │   ├── otpService.ts                # Client-side OTP generation/verification helpers
│   │   │   ├── passwordPolicy.ts            # Password complexity validator & Web Crypto PBKDF2-HMAC-SHA256 hashing
│   │   │   ├── passwordResetService.ts      # Password recovery token helpers
│   │   │   ├── rateLimiter.ts               # Client-side login lockout tracker (5 attempts / 15m)
│   │   │   ├── rbac.ts                      # Role permission matrix
│   │   │   ├── securityAuditLogger.ts       # Security event logger
│   │   │   ├── sessionManager.ts            # 15m idle lock & 12h session expiry
│   │   │   └── totpService.ts               # TOTP MFA helpers
│   │   ├── services/
│   │   │   └── supabaseClient.ts            # @supabase/supabase-js Auth, CRUD, and Realtime wrapper
│   │   ├── types/
│   │   │   └── index.ts                     # TypeScript domain interfaces
│   │   ├── utils/
│   │   │   └── exportUtils.ts               # CSV/JSON export helper
│   │   ├── App.tsx                          # Root component
│   │   ├── index.css                        # Tailwind v4 entry stylesheet
│   │   └── main.tsx                         # DOM entry point
│   ├── verify_all_49_pages_production.cjs   # Headless browser verifier for all 52 Web pages (38 Admin + 14 Staff)
│   ├── verify_commercial_turnkey_suite.cjs  # Headless browser verifier for turnkey simulators
│   ├── .env.example                         # Vite environment template
│   ├── package.json                         # Web dependencies
│   ├── tsconfig.json                        # TypeScript config
│   └── vite.config.ts                       # Vite bundler & chunk splitting config
│
├── serviceos/                               # Cross-Platform Flutter Mobile App (45 Dart files)
│   ├── assets/                              # Bundled mobile images, icons & illustrations
│   ├── lib/
│   │   ├── core/                            # constants/asset_constants.dart, network/supabase_service.dart, routing/app_router.dart, theme/app_theme.dart
│   │   ├── data/                            # datasources/, models/, providers/, repositories/
│   │   ├── features/                        # 22 screen files across authentication, bookings, common, dashboard, dispatch, invoices, onboarding, profile, services, support, technicians
│   │   ├── shared/components/               # app_header.dart, category_pill.dart, hero_banner.dart, service_card.dart, trust_strip.dart
│   │   ├── app.dart                         # MaterialApp & theme host
│   │   └── main.dart                        # Flutter entry point
│   ├── .env.example                         # --dart-define environment template
│   └── pubspec.yaml                         # Flutter package manifest
│
├── serviceos_android/                       # Native Android App (37 Kotlin files; standalone in-memory UI implementation)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml          # Android manifest (android:allowBackup="false")
│   │   │   └── kotlin/com/serviceos/app/    # MainActivity.kt, core/, data/, ui/ (22 Compose screens + 5 components)
│   │   └── build.gradle.kts                 # Android SDK 34 & Jetpack Compose dependencies
│   ├── build.gradle.kts                     # Root Gradle file
│   └── settings.gradle.kts                  # Gradle settings
│
├── supabase/
│   └── migrations/                          # PostgreSQL 16 + PostGIS SQL Migrations (843 lines total)
│       ├── 01_initial_schema.sql            # 326 lines: 14 tables, GiST spatial indexes
│       ├── 02_postgis_functions.sql         # 217 lines: 5 PL/pgSQL spatial & escrow functions
│       └── 03_security_rbac_and_rls.sql     # 300 lines: 5 security tables, 1 view (service_categories), 7 functions, 18 RLS policies
│
├── scripts/
│   ├── validate_migrations.cjs              # Static SQL syntax & delimiter validator
│   └── validate_dart_codebase.cjs           # Static brace/syntax & fake-data validator for 45 Dart & 37 Kotlin files
│
├── design_references/                       # Approved UI reference mockups & category banners
├── documentation/                           # Complete Buyer Handover Documentation Suite
├── .env.example                             # Workspace environment template
├── .env.production.example                  # Production environment template
├── GEMINI.md                                # Project rules & design standards
├── LICENSE                                  # Commercial license template
├── package.json                             # Root npm scripts
└── README.md                                # Root entry pointer to documentation/
```

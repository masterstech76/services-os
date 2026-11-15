# ServiceOS — Antigravity Vibe Coding Master Rules (`GEMINI.md`)

> **Project**: ServiceOS — International Home Services Management Platform  
> **Target Commercial Valuation**: \$20,000 – \$50,000 Turnkey Software Acquisition  
> **Client Applications**: 
> 1. **Customer Mobile App** (Flutter for Android & iOS)
> 2. **Technician Mobile App** (Flutter for Android & iOS)
> 3. **Admin Web Control** (Dedicated Web Portal / Website)
> **Cloud Database**: Free Cloud Supabase (PostgreSQL 16 + PostGIS + Storage + Realtime)  
> **Visual Design Language**: Dual-Vision Engine — **Day Vision** (Vivid Light Mode matching reference mockup) + **Night Vision** (OLED Dark Mode)

---

## 1. Golden Rules of Vibe Coding ServiceOS

1. **Strictly 2 Mobile User Personas**:
   * **Customer** and **Technician** are the ONLY two user types in the mobile apps.
   * **Admin** operates 100% of business operations via the dedicated Web Dashboard.
2. **Zero Internal/Hardcoded Demo Data**:
   * Never hardcode mock users, fake identities, or unverified credentials inside application source code.
   * Business configuration and catalogues are managed through Free Cloud Supabase or the Turnkey Admin Setup Wizard.
3. **No Random or AI-Generated Ugly UIs**:
   * All mobile screens must strictly follow the **Day Vision (Light Mode)** design system extracted from the approved master reference image (`design_references/brand/serviceos_master_ui.jpg`):
     * Pure white elevated cards (`#FFFFFF`) with `rounded-2xl` corners.
     * Soft clean slate canvas background (`#F8FAFC`).
     * Royal Purple (`#6366F1`) & Vivid Violet (`#7C3AED`) brand accents.
     * Soft pastel gradient hero banner with search pill and smiling woman graphic (*"Your Service Our Priority"*).
     * Floating circular category icon badges overlapping landscape photo banners.
     * Amber `★ 4.8` rating pills, Emerald verified pro badges, and crisp purple `Book Now →` buttons.
   * Provide an instant toggle for **Night Vision (Dark Mode)** (`#060B14` obsidian background, `#0C1523` surface cards).
4. **No Placeholder Code**:
   * Never write `// TODO: implement later` or stub methods that throw `UnimplementedError()`.
   * Write full, production-ready, compilable code with real state handling and error fallbacks.
5. **No Duplicate Components**:
   * Reusable UI widgets (cards, buttons, inputs, headers, status chips) must live exclusively in `serviceos/lib/shared/components/` and `serviceos/lib/core/widgets/`.

---

## 2. Directory & Structure Map

```
├── GEMINI.md                        # Master Antigravity project rules
├── PROJECT_OVERVIEW.md              # Complete platform mission & commercial scope
├── DESIGN_SYSTEM.md                 # Day Vision & Night Vision color, typography, elevation tokens
├── DATABASE_SCHEMA.md               # Supabase PostgreSQL + PostGIS schema definitions
├── SCREEN_INVENTORY.md              # Screen breakdown across Customer, Tech, and Admin
│
├── design_references/               # Approved visual mockups & cropped image assets
│   ├── brand/                       # Master UI reference image & brand logo
│   └── booking/                     # Cropped category banners (plumbing, cleaning, etc.)
│
├── supabase/                        # PostgreSQL 16 & PostGIS Database
│   └── migrations/                  # 01_initial_schema.sql, 02_postgis_functions.sql, 03_security_rbac_and_rls.sql
│
├── scripts/                         # Codebase & Migration Release Validators
│   ├── validate_migrations.cjs      # SQL syntax & DDL validator
│   └── validate_dart_codebase.cjs   # Flutter Dart AST structural scanner
│
├── serviceos/                       # Flutter Android & iOS Application
│   ├── assets/                      # Bundled images, icons, and illustrations
│   └── lib/
│       ├── core/                    # Constants, themes, routing, network, utils
│       ├── data/                    # Models, repositories, datasources (Supabase)
│       ├── features/                # Domain feature modules (bookings, services, dispatch...)
│       └── shared/                  # Reusable widgets, enums, extensions
│
└── admin_web/                       # Dedicated Admin Web Control Portal
```

---

## 3. Visual Review Gate
Before any backend wiring, every screen's UI must be validated against the approved visual standards.

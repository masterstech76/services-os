# SYSTEM ARCHITECTURE — Full-Stack Topology & Persistence Boundaries

**Document No.**: `06 / 25`  
**Version**: `1.0.0`  
**Last Updated**: November 15, 2026

---

## 1. Full-Stack Topology Diagram

```mermaid
flowchart TB
    subgraph Web["Web Applications (admin_web — VERIFIED in Local Mode)"]
        AW["Admin Web Console\n38 Pages (#/page/1..38)"]
        SW["Staff Operations Desk\n14 Pages (#/staff/101..114)"]
        ACTX["AdminContext.tsx\nState + Honest Local/Cloud Persistence"]
        SC["supabaseClient.ts\n(@supabase/supabase-js)"]
        LS[("Browser localStorage\n(Default Local Persistence)")]
        AW --> ACTX
        SW --> ACTX
        ACTX --> LS
        ACTX --> SC
    end

    subgraph Mobile["Mobile Applications (Static Source VERIFIED / Binary Build BLOCKED)"]
        FL["Flutter App (serviceos/)\n45 Dart Files / 22 Screens"]
        FR["SupabaseRemoteDataSource &\nBookingRepository (supabase_flutter)"]
        KT["Native Android App (serviceos_android/)\n37 Kotlin Files / 22 Screens\n(Standalone In-Memory Objects Only)"]
        FL --> FR
    end

    subgraph Cloud["Supabase Cloud Backend (Migrations Written / Live DB Execution NOT VERIFIED)"]
        AUTH["Supabase Auth (GoTrue)"]
        RLS["PostgREST + Row-Level Security\n(03_security_rbac_and_rls.sql — 5 Tables + 1 View)"]
        RPC["PostGIS & Escrow Stored Procedures\n(02_postgis_functions.sql — 5 RPCs)"]
        RT["Supabase Realtime\n(serviceos_shared_dispatch)"]
        PG[("PostgreSQL 16 + PostGIS\n(01_initial_schema.sql — 14 Tables)")]
    end

    SC -.->|"When VITE_SUPABASE_* configured"| AUTH
    SC -.->|"When VITE_SUPABASE_* configured"| RLS
    SC -.->|"When VITE_SUPABASE_* configured"| RT
    FR -.->|"When --dart-define configured"| AUTH
    FR -.->|"When --dart-define configured"| RPC
    FR -.->|"When --dart-define configured"| RT
    RLS --> PG
    RPC --> PG
    RT --> PG
```

---

## 2. Persistence Architecture & Honest Toast Reporting

A critical architectural requirement is that **no operation may falsely report a successful cloud save when only local browser state changed**.

In [`admin_web/src/context/AdminContext.tsx`](../admin_web/src/context/AdminContext.tsx), entity mutations (`addCustomer`, `updateCustomer`, `addTechnician`, `updateTechnician`, `addCategory`, `updateCategory`, `addService`, `updateService`, `deleteService`, `createBooking`, `updateBookingStatus`, `verifyBooking`) implement a strict three-branch notification contract:

1. **Branch 1 — Supabase Unconfigured (`supabaseService.isConfigured() === false`)**:
   - Data is written to `localStorage`.
   - Toast message explicitly states: `"...saved to local browser storage."` (never claims cloud persistence).
   - **Important Buyer Disclosure**: Data saved in `localStorage` resides only inside the current browser profile on that single device and is not shared with other users or mobile devices.
2. **Branch 2 — Supabase Configured & Remote Write Succeeds (`synced === true`)**:
   - Data is written to `localStorage` and awaited against `supabaseService.save*()`.
   - Only after `supabaseService.save*()` resolves `true` does the app toast: `"...created and synced to cloud database!"`.
3. **Branch 3 — Supabase Configured & Remote Write Fails (`synced === false` or rejected)**:
   - The app immediately fires a yellow warning toast: `"...saved to local browser storage only; cloud database sync failed."`

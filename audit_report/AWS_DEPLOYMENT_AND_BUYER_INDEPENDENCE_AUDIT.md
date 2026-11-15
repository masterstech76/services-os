# Report 8 — AWS Deployment & Buyer Independence Audit

> **Audit Mode**: Strict Read-Only Evidence-Based Audit  
> **Mandatory Cloud Target**: AWS (Amazon Web Services) + Buyer-Owned Supabase Project  
> **Verdict**: **ARCHITECTURALLY SELLER-INDEPENDENT, BUT ZERO AWS INFRASTRUCTURE-AS-CODE FILES EXIST IN REPO (`NOT READY`)**

---

## 1. Buyer Independence Assessment

A commercial buyer acquiring ServicePro OS for **\$20,000+** must be able to provision, configure, deploy, and operate the entire platform using **zero** seller accounts, credentials, domains, or databases.

### 1.1 Seller-Dependency Check
| Dimension | Audit Finding | Evidence | Status |
|---|---|---|---|
| **Environment Template** | All keys parameterized via placeholders | `.env.production.example` (`L1-29`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, Flutter `--dart-define`, Edge secrets (`STRIPE_*`, `TWILIO_*`, `FCM_SERVER_KEY`) | **PASS** |
| **Database Ownership** | Buyer provisions fresh Supabase project & applies `supabase/migrations/` | `supabase/migrations/` (`22` tables, `47` functions, `3` triggers, `94` active policies) + `bootstrap-first-admin` Edge Function | **PASS (Schema Portable)** |
| **Handover Cleanup** | Dedicated cleanup script exists and passes safety tests | `scripts/handover_cleanup.cjs` + `test_handover_cleanup.cjs` (`14/14` pass); not executed during read-only audit | **PASS (Dry-Run)** |
| **Pitch Demo Residue** | Pitch mode toggle & `demoDataLoader.ts` still shipped in `admin_web/src/` | `TopNavbar.tsx:124` (`Pitch Demo Active`), `AdminContext.tsx:4` (`getShowcaseDemoData`), `demoDataLoader.ts` (`5` Unsplash URLs) | **NEEDS CLEANUP / FLAG** |
| **System Installer** | `SystemInstallerPage.tsx` provides guided buyer setup | Must verify all migrations accurately rather than probing partial schema | **NEEDS VERIFICATION** |

---

## 2. AWS Deployment Readiness Audit

### 2.1 Missing Infrastructure-as-Code (Critical Commercial Gap)
A repository-wide inspection confirmed **0 AWS deployment or IaC files** exist in the repository:
- No `amplify.yml` (AWS Amplify Hosting for `admin_web/` SPA + Vite build).
- No `template.yaml` / `samconfig.toml` (AWS SAM) or `cdk.json` / CDK stack.
- No Terraform (`*.tf`) or CloudFormation (`*.yml`/`*.json`) templates for S3 + CloudFront, WAF, Route 53, or Secrets Manager.
- No `Dockerfile` / ECS Fargate / App Runner definitions (if buyer prefers containerized web hosting).
- `aws` CLI is not installed on the audit host, and no AWS deployment has been executed.

Currently, AWS deployment is only described in prose (`documentation/DEPLOYMENT_GUIDE.md` + `.env.production.example`), not codified into reproducible, buyer-executable infrastructure templates.

### 2.2 Recommended Buyer-Owned AWS Reference Architecture
To justify a turnkey **\$20,000+** valuation without introducing Render or non-AWS PaaS vendors:
1. **Admin Web Portal (`admin_web/dist`)**:
   - **AWS Amplify Hosting** (or **Amazon S3 + Amazon CloudFront** with OAC and SPA `404 -> /index.html` rewrite) connected to the buyer's own Git repository.
   - Custom domain & TLS managed via **AWS Certificate Manager (ACM)** + **Amazon Route 53**.
2. **Backend & Data Plane**:
   - Buyer-owned **Supabase Cloud** project (PostgreSQL 16 + PostGIS + Auth + Storage + Realtime + `5` Deno Edge Functions).
   - Optionally mirror/store Edge Function & CI/CD secrets in **AWS Secrets Manager** / **AWS Systems Manager Parameter Store**.
3. **Mobile Distribution**:
   - Compiled signed Android `.aab` (Google Play Console owned by buyer) and iOS `.ipa` (Apple Developer account owned by buyer), built with buyer `--dart-define` Supabase/Stripe values.
   - Optional artifact archive in private **Amazon S3** bucket.
4. **Operational Monitoring**:
   - **Amazon CloudWatch** alarms for CloudFront 5xx/4xx rates + Supabase Edge Function logs.

---

## 3. AWS & Handover Audit Conclusion

- **Zero Seller Lock-In**: No seller API keys, personal emails, or hardcoded production URLs were found in `.env.production.example` or `verify:data-env`.
- **Gap**: A buyer expecting "deploy to AWS out of the box" currently receives manual documentation rather than turnkey AWS IaC (`amplify.yml`, CloudFormation/Terraform S3+CloudFront stack, or GitHub OIDC AWS deploy workflow). Adding validated AWS IaC templates is essential before listing at **\$20,000+**.

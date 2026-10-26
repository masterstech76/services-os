import "server-only";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isRemoteSupabaseConfigured } from "@/lib/supabase/middleware";
import { AUTH_LOCK_PAUSED } from "@/config/auth-lock.config";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";
import type { Database, UserRole } from "@/lib/supabase/types";

export interface AuthenticatedActor {
  authenticated: boolean;
  userId: string;
  role: UserRole;
  businessId: string;
  technicianId: string | null;
}

/**
 * Resolves the authenticated actor from:
 * 1. Request headers (`x-servicepro-role`, `x-servicepro-tech-id`) STRICTLY for unit tests or verified internal callers
 * 2. Request cookies (`servicepro_dev_role`, `sp_demo_role`, `sp_demo_tech_id`)
 * 3. Next.js `cookies()` store in App Router handlers
 * 4. Supabase Auth SSR session when remote Supabase is configured
 */
export async function resolveRequestActor(
  request?: Request
): Promise<AuthenticatedActor | null> {
  const store = getLocalDbWithDemo();
  const defaultBizId =
    Array.from(store.businesses.values())[0]?.id ??
    "00000000-0000-4000-8000-000000000001";

  // 1. Check explicit headers (STRICTLY RESTRICTED to automated test runner; headers are completely ignored in production)
  const isTestRunner = Boolean(process.env.VITEST || process.env.NODE_ENV === "test");

  if (request && isTestRunner) {
    const headerRole = request.headers.get("x-servicepro-role") as
      | UserRole
      | "anon"
      | null;
    const headerTechId = request.headers.get("x-servicepro-tech-id");
    if (headerRole === "anon") {
      return null;
    }
    if (headerRole === "owner" || headerRole === "admin" || headerRole === "technician" || headerRole === "customer") {
      return {
        authenticated: true,
        userId:
          headerRole === "owner"
            ? "user_owner"
            : headerRole === "admin"
            ? "user_admin"
            : headerRole === "customer"
            ? "user_customer"
            : `user_${headerTechId ?? "tech-carlos"}`,
        role: headerRole,
        businessId: defaultBizId,
        technicianId: headerRole === "technician" ? headerTechId ?? "tech-carlos" : null,
      };
    }
  }

  // 2. Parse Cookie header on incoming Request (STRICTLY RESTRICTED to local development or test runner)
  const isDevOrTest = Boolean(
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test" ||
    process.env.VITEST
  );

  if (isDevOrTest && request) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    if (cookieHeader) {
      const parsedCookies = Object.fromEntries(
        cookieHeader.split(";").map((part) => {
          const [k, ...v] = part.trim().split("=");
          return [k, decodeURIComponent(v.join("="))];
        })
      );
      const cookieRole = (parsedCookies["servicepro_dev_role"] ||
        parsedCookies["sp_demo_role"]) as UserRole | undefined;
      const cookieTechId = parsedCookies["sp_demo_tech_id"] || "tech-carlos";
      if (cookieRole === "owner" || cookieRole === "admin" || cookieRole === "technician" || cookieRole === "customer") {
        return {
          authenticated: true,
          userId:
            cookieRole === "owner"
              ? "user_owner"
              : cookieRole === "admin"
              ? "user_admin"
              : cookieRole === "customer"
              ? "user_customer"
              : `user_${cookieTechId}`,
          role: cookieRole,
          businessId: defaultBizId,
          technicianId: cookieRole === "technician" ? cookieTechId : null,
        };
      }
    }
  }

  // 3. Check Next.js cookies() store
  try {
    const cookieStore = cookies();

    // In local development or test environments, allow demo role cookie convenience
    if (isDevOrTest) {
      const roleCookie = (cookieStore.get("servicepro_dev_role")?.value ||
        cookieStore.get("sp_demo_role")?.value) as UserRole | undefined;
      const techIdCookie =
        cookieStore.get("sp_demo_tech_id")?.value || "tech-carlos";

      if (roleCookie === "owner" || roleCookie === "admin" || roleCookie === "technician" || roleCookie === "customer") {
        return {
          authenticated: true,
          userId:
            roleCookie === "owner"
              ? "user_owner"
              : roleCookie === "admin"
              ? "user_admin"
              : roleCookie === "customer"
              ? "user_customer"
              : `user_${techIdCookie}`,
          role: roleCookie,
          businessId: defaultBizId,
          technicianId: roleCookie === "technician" ? techIdCookie : null,
        };
      }
    }

    // 4. Remote Supabase Auth session
    if (isRemoteSupabaseConfigured()) {
      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll() {
              // read-only in route guard
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, business_id, technician_id")
          .eq("id", user.id)
          .single();

        const p = profile as {
          role: UserRole;
          business_id: string;
          technician_id: string | null;
        } | null;

        if (p) {
          return {
            authenticated: true,
            userId: user.id,
            role: p.role,
            businessId: p.business_id,
            technicianId: p.technician_id,
          };
        }
      }
    }
  } catch {
    // cookies() called outside request context (e.g., direct function call)
  }

  // 5. Preview Mode Fallback: If auth lock is paused, provide synthetic actor for seamless browsing
  if (AUTH_LOCK_PAUSED && !isTestRunner) {
    const url = request?.url ?? "";
    const isTech = url.includes("/tech") || url.includes("/api/tech");
    const isCust = url.includes("/account") || url.includes("/api/account");

    if (isTech) {
      return {
        authenticated: true,
        userId: "user_tech-carlos",
        role: "technician",
        businessId: defaultBizId,
        technicianId: "tech-carlos",
      };
    }
    if (isCust) {
      return {
        authenticated: true,
        userId: "user_customer",
        role: "customer",
        businessId: defaultBizId,
        technicianId: null,
      };
    }
    return {
      authenticated: true,
      userId: "user_owner",
      role: "owner",
      businessId: defaultBizId,
      technicianId: null,
    };
  }

  return null;
}

export async function requireRole(
  request: Request,
  allowedRoles: UserRole[]
): Promise<
  | { ok: true; actor: AuthenticatedActor }
  | { ok: false; response: NextResponse }
> {
  let actor = await resolveRequestActor(request);

  // In preview mode, ensure an actor matching the route's expected role is always provided
  if (AUTH_LOCK_PAUSED) {
    if (!actor) {
      const targetRole = allowedRoles.includes("technician")
        ? "technician"
        : allowedRoles.includes("customer")
        ? "customer"
        : "owner";
      actor = {
        authenticated: true,
        userId: targetRole === "technician" ? "user_tech-carlos" : targetRole === "customer" ? "user_customer" : "user_owner",
        role: targetRole,
        businessId: "00000000-0000-4000-8000-000000000001",
        technicianId: targetRole === "technician" ? "tech-carlos" : null,
      };
    } else if (!allowedRoles.includes(actor.role)) {
      const targetRole = allowedRoles[0] ?? "owner";
      actor = {
        ...actor,
        role: targetRole,
        technicianId: targetRole === "technician" ? (actor.technicianId || "tech-carlos") : null,
      };
    }
  }

  if (!actor) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication is required to access this resource.",
          },
        },
        { status: 401 }
      ),
    };
  }

  if (!allowedRoles.includes(actor.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: `Role '${actor.role}' is not permitted to perform this action. Required: ${allowedRoles.join(" or ")}.`,
          },
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, actor };
}

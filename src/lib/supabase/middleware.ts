import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database, UserRole } from "./types";
import { sanitizeRedirectUrl, getHomeForRole } from "@/lib/server/redirect-safety";
import { AUTH_LOCK_PAUSED } from "@/config/auth-lock.config";

export function isRemoteSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    url.startsWith("https://") &&
    !url.includes("placeholder") &&
    !url.includes("your-project") &&
    !url.includes("example") &&
    !url.includes("demo-servicepro") &&
    anonKey.length > 40 &&
    !anonKey.endsWith("...") &&
    !anonKey.includes("change_in_production")
  );
}

export async function updateSessionAndEnforceRoles(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;
  const isLandingPage = pathname === "/";
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isTechRoute = pathname === "/tech" || pathname.startsWith("/tech/");
  const isAccountRoute = pathname === "/account" || pathname.startsWith("/account/");
  const isAuthEntryRoute = pathname === "/login" || pathname === "/register";
  const isAuthFlowRoute =
    isAuthEntryRoute ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-email" ||
    pathname === "/verify-phone" ||
    pathname === "/unauthorized" ||
    pathname === "/session-expired" ||
    pathname === "/locked" ||
    pathname === "/verification-required";
  const isSystemRoute =
    pathname === "/status" ||
    pathname === "/error" ||
    pathname === "/offline" ||
    pathname === "/maintenance" ||
    pathname.startsWith("/api/");

  // Landing page and system routes are strictly public & skipped from auth enforcement
  if (isLandingPage || isSystemRoute) {
    return supabaseResponse;
  }

  // Preview Mode: If authentication lock is paused by user, allow access without redirects
  if (AUTH_LOCK_PAUSED) {
    const isProd = process.env.NODE_ENV === "production";
    if (isAdminRoute) {
      supabaseResponse.cookies.set("servicepro_dev_role", "owner", { path: "/", sameSite: "lax", httpOnly: true, secure: isProd });
    } else if (isTechRoute) {
      supabaseResponse.cookies.set("servicepro_dev_role", "technician", { path: "/", sameSite: "lax", httpOnly: true, secure: isProd });
      supabaseResponse.cookies.set("sp_demo_tech_id", "tech-carlos", { path: "/", sameSite: "lax", httpOnly: true, secure: isProd });
    } else if (isAccountRoute) {
      supabaseResponse.cookies.set("servicepro_dev_role", "customer", { path: "/", sameSite: "lax", httpOnly: true, secure: isProd });
      supabaseResponse.cookies.set("sp_demo_customer_email", "maria.rivera@example.com", { path: "/", sameSite: "lax", httpOnly: true, secure: isProd });
    }
    return supabaseResponse;
  }

  let role: UserRole | null = null;

  // 1. Support demo / local dev session cookie
  const devRoleCookie = (request.cookies.get("servicepro_dev_role")?.value ||
    request.cookies.get("sp_demo_role")?.value) as UserRole | undefined;

  if (
    devRoleCookie === "owner" ||
    devRoleCookie === "admin" ||
    devRoleCookie === "technician" ||
    devRoleCookie === "customer"
  ) {
    role = devRoleCookie;
  } else if (isRemoteSupabaseConfigured()) {
    // 2. Remote Supabase session verification
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
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
        .select("role")
        .eq("id", user.id)
        .single();
      const resolved = (profile as { role?: UserRole } | null)?.role ?? null;
      role = resolved;
    }
  }

  // 3. Unauthenticated access enforcement across protected portal pages
  const isProtectedRoute = isAdminRoute || isTechRoute || isAccountRoute;
  if (!role) {
    // If attempting to access a protected portal (Admin, Tech, or Customer Account), redirect to /login
    if (isProtectedRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirectTo", pathname + (request.nextUrl.search || ""));
      return NextResponse.redirect(loginUrl);
    }
    // All public marketing, service catalog, booking, payment, and policy pages are accessible to visitors
    return supabaseResponse;
  }

  // 4. Authenticated user visiting /login or /register -> route safely to their respective home
  if (role && isAuthEntryRoute) {
    const rawRedirect = request.nextUrl.searchParams.get("redirectTo");
    const defaultHome = getHomeForRole(role);
    const targetPath = sanitizeRedirectUrl(rawRedirect, defaultHome);

    const dest = request.nextUrl.clone();
    dest.pathname = targetPath.split("?")[0];
    const queryPart = targetPath.split("?")[1];
    if (queryPart) {
      dest.search = queryPart;
    } else {
      dest.search = "";
    }
    return NextResponse.redirect(dest);
  }

  // 5. Role-based portal enforcement
  // /admin portal allows both owner and admin staff
  if (isAdminRoute && role !== "owner" && role !== "admin") {
    const unauthUrl = request.nextUrl.clone();
    unauthUrl.pathname = "/unauthorized";
    unauthUrl.searchParams.set("required", "admin");
    unauthUrl.searchParams.set("current", role ?? "unknown");
    return NextResponse.redirect(unauthUrl);
  }

  // /tech requires technician role
  if (isTechRoute && role !== "technician") {
    const unauthUrl = request.nextUrl.clone();
    unauthUrl.pathname = "/unauthorized";
    unauthUrl.searchParams.set("required", "tech");
    unauthUrl.searchParams.set("current", role ?? "unknown");
    return NextResponse.redirect(unauthUrl);
  }

  return supabaseResponse;
}

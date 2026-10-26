import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/server/auth-guard";
import { getLocalDbWithDemo } from "@/lib/server/demo-dataset";

const createTechSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),
  skills: z.array(z.string()).optional(),
  zipCodes: z.array(z.string()).optional(),
  commissionPct: z.number().min(0).max(100).optional(),
  color: z.string().optional(),
  days: z.array(z.number().int().min(0).max(6)).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

const patchTechSchema = z.object({
  id: z.string().min(1, "Technician ID is required"),
  name: z.string().min(1).optional(),
  phone: z.string().min(7).optional(),
  email: z.string().email().optional(),
  skills: z.array(z.string()).optional(),
  zipCodes: z.array(z.string()).optional(),
  commissionPct: z.number().min(0).max(100).optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
  addTimeOff: z
    .object({
      startsAt: z.string().min(1),
      endsAt: z.string().min(1),
      reason: z.string().min(1),
    })
    .optional(),
  removeTimeOffId: z.string().optional(),
});

export async function GET(request: Request) {
  const auth = await requireRole(request, ["owner", "admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const store = getLocalDbWithDemo();
  const technicians = Array.from(store.technicians.values()).map((t) => {
    const hours = Array.from(store.technician_hours.values())
      .filter((th) => th.technician_id === t.id)
      .sort((a, b) => a.day_of_week - b.day_of_week);
    const timeOff = Array.from(store.technician_time_off.values()).filter(
      (to) => to.technician_id === t.id
    );
    return {
      ...t,
      hours,
      timeOff,
    };
  });
  return NextResponse.json({ technicians });
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["owner", "admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const raw = await request.json().catch(() => null);
  const parsed = createTechSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
      { status: 400 }
    );
  }

  const body = parsed.data;
  const store = getLocalDbWithDemo();
  const biz = Array.from(store.businesses.values())[0];

  const id = `tech-${body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36).slice(-3)}`;
  const nowIso = new Date().toISOString();

  store.technicians.set(id, {
    id,
    business_id: biz.id,
    user_id: `user_${id}`,
    name: body.name,
    phone: body.phone,
    email: body.email,
    skills: body.skills ?? ["hvac"],
    zip_codes: body.zipCodes ?? [],
    commission_pct: body.commissionPct ?? 20,
    color: body.color ?? "#3B82F6",
    home_lat: 25.7617,
    home_lng: -80.1918,
    active: true,
    created_at: nowIso,
  });

  const days = body.days ?? [1, 2, 3, 4, 5];
  for (const d of days) {
    const thId = `th_${id}_${d}`;
    store.technician_hours.set(thId, {
      id: thId,
      business_id: biz.id,
      technician_id: id,
      day_of_week: d,
      start_time: body.startTime ?? "08:00",
      end_time: body.endTime ?? "17:00",
    });
  }

  return NextResponse.json({ technician: store.technicians.get(id) });
}

export async function PATCH(request: Request) {
  const auth = await requireRole(request, ["owner", "admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  const raw = await request.json().catch(() => null);
  const parsed = patchTechSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
      { status: 400 }
    );
  }

  const body = parsed.data;
  const store = getLocalDbWithDemo();
  const biz = Array.from(store.businesses.values())[0];

  const tech = store.technicians.get(body.id);
  if (!tech) {
    return NextResponse.json(
      { error: { code: "TECH_NOT_FOUND", message: "Technician not found" } },
      { status: 404 }
    );
  }

  if (body.name !== undefined) tech.name = body.name;
  if (body.phone !== undefined) tech.phone = body.phone;
  if (body.email !== undefined) tech.email = body.email;
  if (body.skills !== undefined) tech.skills = body.skills;
  if (body.zipCodes !== undefined) tech.zip_codes = body.zipCodes;
  if (body.commissionPct !== undefined) tech.commission_pct = body.commissionPct;
  if (body.color !== undefined) tech.color = body.color;
  if (body.active !== undefined) tech.active = body.active;

  store.technicians.set(tech.id, tech);

  if (body.addTimeOff) {
    const toId = `tto_${tech.id}_${Date.now()}`;
    store.technician_time_off.set(toId, {
      id: toId,
      business_id: biz.id,
      technician_id: tech.id,
      starts_at: body.addTimeOff.startsAt,
      ends_at: body.addTimeOff.endsAt,
      reason: body.addTimeOff.reason,
    });
  }

  if (body.removeTimeOffId) {
    store.technician_time_off.delete(body.removeTimeOffId);
  }

  return NextResponse.json({ technician: tech });
}

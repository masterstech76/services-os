import { StaffPageDef, StaffModuleDef } from '../types';

export const ALL_STAFF_PAGES: StaffPageDef[] = [
  // 1. Daily Operations & Intake (Module 1)
  {
    id: 101,
    moduleId: 1,
    moduleName: 'Daily Operations & Intake',
    name: 'Staff Operations Dashboard',
    tabName: 'Operations Dashboard',
    route: '/staff/dashboard',
    icon: 'LayoutDashboard',
    purpose: 'Daily operations overview: incoming orders, unassigned queue, active field dispatches, and SLA health.'
  },
  {
    id: 102,
    moduleId: 1,
    moduleName: 'Daily Operations & Intake',
    name: 'Order Intake Queue',
    tabName: 'Intake Queue',
    route: '/staff/intake',
    icon: 'Inbox',
    purpose: 'Review and triage newly submitted customer service requests before assigning to technicians.'
  },
  {
    id: 103,
    moduleId: 1,
    moduleName: 'Daily Operations & Intake',
    name: "Today's Work Activity",
    tabName: 'Activity & SLA',
    route: '/staff/activity',
    icon: 'Activity',
    purpose: 'Real-time event stream of order status updates, technician check-ins, and SLA timer warnings.'
  },

  // 2. Order Assignment & Dispatch (Module 2)
  {
    id: 104,
    moduleId: 2,
    moduleName: 'Order Assignment & Dispatch',
    name: 'Order Assignment Board',
    tabName: 'Assignment Board',
    route: '/staff/assignment',
    icon: 'UserCheck',
    purpose: 'Match unassigned customer orders with nearby available technicians based on skills and location.'
  },
  {
    id: 105,
    moduleId: 2,
    moduleName: 'Order Assignment & Dispatch',
    name: 'Live Dispatch Radar',
    tabName: 'Dispatch Radar',
    route: '/staff/radar',
    icon: 'Navigation',
    purpose: 'Real-time map tracking technicians en route, arrival estimations, and live GPS routes.'
  },
  {
    id: 106,
    moduleId: 2,
    moduleName: 'Order Assignment & Dispatch',
    name: 'Technician Shift Availability',
    tabName: 'Tech Availability',
    route: '/staff/availability',
    icon: 'Users',
    purpose: 'Monitor active technician roster: online, busy, on-job, or available for new assignments.'
  },
  {
    id: 107,
    moduleId: 2,
    moduleName: 'Order Assignment & Dispatch',
    name: 'Emergency Order Handover',
    tabName: 'Order Handover',
    route: '/staff/handover',
    icon: 'ArrowRightLeft',
    purpose: 'Transfer jobs to backup technicians immediately when a technician faces vehicle breakdown or emergency.'
  },

  // 3. Active Orders & Field Progress (Module 3)
  {
    id: 108,
    moduleId: 3,
    moduleName: 'Active Orders & Field Progress',
    name: 'Active In-Progress Orders',
    tabName: 'Active Orders',
    route: '/staff/active',
    icon: 'Clock',
    purpose: 'Supervise orders currently being executed on customer premises with safety PIN checks.'
  },
  {
    id: 109,
    moduleId: 3,
    moduleName: 'Active Orders & Field Progress',
    name: 'Order Schedule & Calendar',
    tabName: 'Schedule Calendar',
    route: '/staff/schedule',
    icon: 'Calendar',
    purpose: 'Multi-technician schedule grid to balance daily job loads and prevent booking overlaps.'
  },
  {
    id: 110,
    moduleId: 3,
    moduleName: 'Active Orders & Field Progress',
    name: 'Order Rescheduling Desk',
    tabName: 'Rescheduling Desk',
    route: '/staff/reschedule',
    icon: 'CalendarRange',
    purpose: 'Manage customer rescheduling requests, slot swaps, and technician calendar adjustments.'
  },

  // 4. Order Completion & Quality (Module 4)
  {
    id: 111,
    moduleId: 4,
    moduleName: 'Order Completion & Quality',
    name: 'Order Verification & Signatures',
    tabName: 'Completion & Signs',
    route: '/staff/verification',
    icon: 'CheckCircle2',
    purpose: 'Audit completed orders: inspect before/after photos, parts logged, and customer digital signatures.'
  },
  {
    id: 112,
    moduleId: 4,
    moduleName: 'Order Completion & Quality',
    name: 'Customer Communication Desk',
    tabName: 'Customer Support',
    route: '/staff/communication',
    icon: 'MessageSquare',
    purpose: 'Direct communication desk with customers regarding arrival time, gate codes, and order notes.'
  },
  {
    id: 113,
    moduleId: 4,
    moduleName: 'Order Completion & Quality',
    name: 'Daily Order Operations Report',
    tabName: 'Daily Report',
    route: '/staff/reports',
    icon: 'FileSpreadsheet',
    purpose: 'End-of-day summary of all orders handled, technician dispatch stats, and handover logs for the Main Head.'
  }
];

export const STAFF_MODULES: StaffModuleDef[] = [
  {
    id: 1,
    name: 'Daily Operations & Intake',
    icon: 'LayoutDashboard',
    pages: ALL_STAFF_PAGES.filter(p => p.moduleId === 1)
  },
  {
    id: 2,
    name: 'Dispatch & Assignment',
    icon: 'Navigation',
    pages: ALL_STAFF_PAGES.filter(p => p.moduleId === 2)
  },
  {
    id: 3,
    name: 'Field Orders & Progress',
    icon: 'Clock',
    pages: ALL_STAFF_PAGES.filter(p => p.moduleId === 3)
  },
  {
    id: 4,
    name: 'Quality & Verification',
    icon: 'CheckCircle2',
    pages: ALL_STAFF_PAGES.filter(p => p.moduleId === 4)
  }
];

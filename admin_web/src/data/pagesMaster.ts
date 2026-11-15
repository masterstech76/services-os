import { PageDef, ModuleDef } from '../types';

export const ALL_36_PAGES: PageDef[] = [
  // 1. Dashboard & Operations (5 Pages)
  { id: 1, moduleId: 1, moduleName: 'Dashboard & Operations', name: 'Main Admin Dashboard', tabName: 'Overview', route: '/dashboard', icon: 'LayoutDashboard', purpose: 'Complete executive overview of business performance, jobs, services and technicians.' },
  { id: 2, moduleId: 1, moduleName: 'Dashboard & Operations', name: 'Live Operations Dashboard', tabName: 'Live Operations', route: '/dashboard/operations', icon: 'Compass', purpose: 'Real-time GPS map with active technician tracking and live status updates.' },
  { id: 3, moduleId: 1, moduleName: 'Dashboard & Operations', name: "Today's Activity", tabName: 'Activity Stream', route: '/dashboard/activity', icon: 'Activity', purpose: 'Live stream of operational events, technician check-ins and payments.' },
  { id: 4, moduleId: 1, moduleName: 'Dashboard & Operations', name: 'Pending Work Overview', tabName: 'Pending Queue', route: '/dashboard/pending', icon: 'Clock', purpose: 'Queue of unassigned jobs, pending approvals and SLA countdowns.' },
  { id: 5, moduleId: 1, moduleName: 'Dashboard & Operations', name: 'Critical Alerts Centre', tabName: 'Critical Alerts', route: '/dashboard/alerts', icon: 'AlertTriangle', purpose: 'Urgent system, security, gateway and geofence breach notifications.' },

  // 2. Bookings & Dispatch (7 Pages)
  { id: 6, moduleId: 2, moduleName: 'Bookings & Dispatch', name: 'All Bookings', tabName: 'All Bookings', route: '/bookings', icon: 'Briefcase', purpose: 'Complete filterable table of all customer service jobs with bulk actions.' },
  { id: 7, moduleId: 2, moduleName: 'Bookings & Dispatch', name: 'New Booking Requests', tabName: 'New Requests', route: '/bookings/new', icon: 'PlusCircle', purpose: 'Newly submitted booking requests awaiting auto-dispatch or approval.' },
  { id: 8, moduleId: 2, moduleName: 'Bookings & Dispatch', name: 'Active Bookings', tabName: 'Active Jobs', route: '/bookings/active', icon: 'Radio', purpose: 'Real-time monitoring of in-progress technician work and safety PIN verification.' },
  { id: 9, moduleId: 2, moduleName: 'Bookings & Dispatch', name: 'Booking Details', tabName: 'Job Dossier', route: '/bookings/details', icon: 'FileText', purpose: 'Complete job dossier with customer, technician, GPS geofence map and itemized invoice.' },
  { id: 10, moduleId: 2, moduleName: 'Bookings & Dispatch', name: 'Booking Rescheduling', tabName: 'Rescheduling', route: '/bookings/reschedule', icon: 'CalendarDays', purpose: 'Slot rescheduling calendar with automated customer SMS notification.' },
  { id: 11, moduleId: 2, moduleName: 'Bookings & Dispatch', name: 'Dispatch Board', tabName: 'Dispatch Board', route: '/dispatch/board', icon: 'Kanban', purpose: 'Live dispatch map combined with weekly technician shift schedule board.' },
  { id: 12, moduleId: 2, moduleName: 'Bookings & Dispatch', name: 'Manual Dispatch & Job Handover', tabName: 'Manual Dispatch & Handover', route: '/dispatch/handover', icon: 'Share2', purpose: 'Handle unassigned jobs, AI match ranking, force assignments and emergency job handover.' },

  // 3. Services & Pricing (5 Pages)
  { id: 13, moduleId: 3, moduleName: 'Services & Pricing', name: 'All Services', tabName: 'All Services', route: '/services', icon: 'Layers', purpose: 'Master catalogue of all services with pricing, duration and active toggles.' },
  { id: 14, moduleId: 3, moduleName: 'Services & Pricing', name: 'Service Categories', tabName: 'Categories', route: '/services/categories', icon: 'Grid', purpose: '17 Master home service categories with icons and service volume.' },
  { id: 15, moduleId: 3, moduleName: 'Services & Pricing', name: 'Add / Edit Service', tabName: 'Add / Edit Service', route: '/services/manage', icon: 'FilePlus', purpose: 'Multi-step service creator and pricing configurator with media uploads.' },
  { id: 16, moduleId: 3, moduleName: 'Services & Pricing', name: 'Service Details', tabName: 'Service Specs', route: '/services/details', icon: 'CheckSquare', purpose: 'Preview customer-facing service screens, analytics and technician roster.' },
  { id: 17, moduleId: 3, moduleName: 'Services & Pricing', name: 'Pricing Management', tabName: 'Pricing & Surge', route: '/services/pricing', icon: 'DollarSign', purpose: 'Base rates, hourly fee structures, minimum inspection fees and dynamic surge rules.' },

  // 4. Customer Management (4 Pages)
  { id: 18, moduleId: 4, moduleName: 'Customer Management', name: 'All Customers', tabName: 'All Customers', route: '/customers', icon: 'Users', purpose: 'Comprehensive directory of registered customers, bookings and lifetime spend.' },
  { id: 19, moduleId: 4, moduleName: 'Customer Management', name: 'Customer Profile', tabName: 'Customer Profile', route: '/customers/profile', icon: 'UserCheck', purpose: 'Customer profile dossier, verified contact badges, saved GPS coordinates and wallet.' },
  { id: 20, moduleId: 4, moduleName: 'Customer Management', name: 'Customer Booking History', tabName: 'Booking History', route: '/customers/history', icon: 'History', purpose: 'Chronological timeline of past bookings, payments, assigned techs and reviews.' },
  { id: 21, moduleId: 4, moduleName: 'Customer Management', name: 'Customer Support Tickets', tabName: 'Support Tickets', route: '/customers/tickets', icon: 'LifeBuoy', purpose: 'Customer inquiries, dispute logs and two-way messaging threads.' },

  // 5. Technician Management (4 Pages)
  { id: 22, moduleId: 5, moduleName: 'Technician Management', name: 'All Technicians', tabName: 'All Technicians', route: '/technicians', icon: 'HardHat', purpose: 'Technician roster with specialization, live status, rating and action controls.' },
  { id: 23, moduleId: 5, moduleName: 'Technician Management', name: 'Technician Profile', tabName: 'Pro Dossier', route: '/technicians/profile', icon: 'Award', purpose: 'Detailed pro dossier, licenses, background verification and tool inventory.' },
  { id: 24, moduleId: 5, moduleName: 'Technician Management', name: 'Technician Availability & Working Hours', tabName: 'Shifts & Hours', route: '/technicians/availability', icon: 'Clock', purpose: 'Weekly shift schedule, working hours, on-call status and vacation requests.' },
  { id: 25, moduleId: 5, moduleName: 'Technician Management', name: 'Technician Performance', tabName: 'Performance Leaderboard', route: '/technicians/performance', icon: 'TrendingUp', purpose: 'Scorecard: completion rates, on-time arrival SLA, ratings and rankings.' },

  // 6. Finance & Payments (5 Pages)
  { id: 26, moduleId: 6, moduleName: 'Finance & Payments', name: 'Financial Dashboard', tabName: 'Financial Overview', route: '/finance', icon: 'Landmark', purpose: 'Executive revenue overview, gross margins, platform net take and payouts.' },
  { id: 27, moduleId: 6, moduleName: 'Finance & Payments', name: 'Transaction History', tabName: 'Payment Ledger', route: '/finance/transactions', icon: 'Receipt', purpose: 'Master financial payment ledger with transaction IDs, fees and gateway statuses.' },
  { id: 28, moduleId: 6, moduleName: 'Finance & Payments', name: 'Customer Invoices', tabName: 'Customer Invoices', route: '/finance/invoices', icon: 'FileSpreadsheet', purpose: 'Itemized invoice repository with PDF downloads and receipt resending.' },
  { id: 29, moduleId: 6, moduleName: 'Finance & Payments', name: 'Technician Payouts', tabName: 'Technician Payouts', route: '/finance/payouts', icon: 'CreditCard', purpose: 'Weekly earnings, 15% platform commission deductions and batch transfers.' },
  { id: 30, moduleId: 6, moduleName: 'Finance & Payments', name: 'Refund Management', tabName: 'Refund Arbitration', route: '/finance/refunds', icon: 'RefreshCcw', purpose: 'Customer refund requests, dispute evidence review, and 1-click approvals.' },

  // 7. Support & Reviews (3 Pages)
  { id: 31, moduleId: 7, moduleName: 'Support & Reviews', name: 'Support Ticket Dashboard', tabName: 'Ticket Queue', route: '/support', icon: 'HelpCircle', purpose: 'Support queue, SLA first-response timers, and CSAT customer satisfaction metrics.' },
  { id: 32, moduleId: 7, moduleName: 'Support & Reviews', name: 'Ticket Details & Conversation', tabName: 'Live Chat Studio', route: '/support/details', icon: 'MessageCircle', purpose: 'Two-way support studio with customer chat history, canned responses and notes.' },
  { id: 33, moduleId: 7, moduleName: 'Support & Reviews', name: 'Customer Reviews Management', tabName: 'Reviews & Feedback', route: '/support/reviews', icon: 'Star', purpose: 'Customer reviews feed, 5-star ratings breakdown, photo moderation and replies.' },

  // 8. Website & Platform Settings (3 Pages)
  { id: 34, moduleId: 8, moduleName: 'Website & Platform Settings', name: 'Website Content Management', tabName: 'Content CMS', route: '/settings/cms', icon: 'Globe', purpose: 'Manage hero banners, mobile app discovery feeds, promotional text and FAQs.' },
  { id: 35, moduleId: 8, moduleName: 'Website & Platform Settings', name: 'General Platform Settings', tabName: 'General Settings', route: '/settings/general', icon: 'Settings', purpose: 'Company info, master timezone, default currency (₹ / $), and maintenance mode.' },
  { id: 36, moduleId: 8, moduleName: 'Website & Platform Settings', name: 'Payment & Notification Configuration', tabName: 'Integrations & API', route: '/settings/integrations', icon: 'BellRing', purpose: 'Stripe, Razorpay, Twilio SMS, SendGrid and push notification gateway keys.' }
];

export const MODULES_8: ModuleDef[] = [
  { id: 1, name: 'Dashboard & Operations', icon: 'LayoutDashboard', pages: ALL_36_PAGES.filter(p => p.moduleId === 1) },
  { id: 2, name: 'Bookings & Dispatch', icon: 'Compass', pages: ALL_36_PAGES.filter(p => p.moduleId === 2) },
  { id: 3, name: 'Services & Pricing', icon: 'Layers', pages: ALL_36_PAGES.filter(p => p.moduleId === 3) },
  { id: 4, name: 'Customer Management', icon: 'Users', pages: ALL_36_PAGES.filter(p => p.moduleId === 4) },
  { id: 5, name: 'Technician Management', icon: 'HardHat', pages: ALL_36_PAGES.filter(p => p.moduleId === 5) },
  { id: 6, name: 'Finance & Payments', icon: 'Landmark', pages: ALL_36_PAGES.filter(p => p.moduleId === 6) },
  { id: 7, name: 'Support & Reviews', icon: 'HelpCircle', pages: ALL_36_PAGES.filter(p => p.moduleId === 7) },
  { id: 8, name: 'Platform Settings', icon: 'Settings', pages: ALL_36_PAGES.filter(p => p.moduleId === 8) }
];

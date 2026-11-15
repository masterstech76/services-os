export type UserRole = 'ADMIN' | 'STAFF';

export interface PageDef {
  id: number;
  moduleId: number;
  moduleName: string;
  name: string;
  tabName?: string;
  route: string;
  icon: string;
  purpose: string;
}

export interface ModuleDef {
  id: number;
  name: string;
  icon: string;
  pages: PageDef[];
}

export interface StaffPageDef {
  id: number;
  moduleId: number;
  moduleName: string;
  name: string;
  tabName?: string;
  route: string;
  icon: string;
  purpose: string;
}

export interface StaffModuleDef {
  id: number;
  name: string;
  icon: string;
  pages: StaffPageDef[];
}

export type BookingStatus = 'Completed' | 'In Progress' | 'Pending' | 'Scheduled' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Unpaid';
export type JobPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Booking {
  id: string;
  jobNo: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceName: string;
  category: string;
  technicianName: string;
  technicianId: string;
  scheduleDate: string;
  scheduleTime: string;
  estimate: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  priority: JobPriority;
  lat: number;
  lng: number;
  customerId?: string;
  serviceId?: string;
  notes?: string;
  isVerified?: boolean;
}

export type TechnicianStatus = 'Available' | 'On Job' | 'Busy' | 'On Leave' | 'Offline';

export interface Technician {
  id: string;
  name: string;
  photo: string;
  phone: string;
  specialization: string;
  status: TechnicianStatus;
  rating: number;
  jobsCompleted: number;
  onTimeRate: number;
  currentJobsCount: number;
  workingHours: string;
  lat: number;
  lng: number;
  matchScore?: number;
}

export interface Customer {
  id: string;
  name: string;
  photo?: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  totalBookings: number;
  lifetimeSpend: number;
  rating: number;
  status: 'Active' | 'Suspended';
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  photo: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  shiftHours: string;
  status: 'Online' | 'Busy' | 'Offline';
  activeQueueCount: number;
  totalOrdersHandled: number;
  joinedDate: string;
  territory: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  durationMinutes: number;
  isPopular: boolean;
  status: 'Active' | 'Draft';
  description: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  serviceCount: number;
  color: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  customerName: string;
  serviceName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface SupportTicket {
  id: string;
  ticketNo: string;
  customerName: string;
  subject: string;
  category: string;
  priority: 'Urgent' | 'High' | 'Normal';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  lastReply: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  photo?: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface Incident {
  id: string;
  severity: 'Critical' | 'High' | 'Moderate';
  category: 'Safety' | 'Vehicle' | 'Escrow' | 'SLA' | 'Rating';
  title: string;
  description: string;
  timestamp: string;
  bookingNo: string;
  technicianName?: string;
  customerName?: string;
  resolved: boolean;
  address?: string;
}

export interface PricingConfig {
  commissionRate: number; // e.g. 15.0 (%)
  surgeMultiplier: number; // e.g. 1.25
  minCalloutFee: number; // e.g. 49.0
  nightSurcharge: number; // e.g. 35.0
  surgeActive: boolean;
}

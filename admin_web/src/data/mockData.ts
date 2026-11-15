import { 
  Booking, 
  Technician, 
  Customer, 
  ServiceItem, 
  ServiceCategory, 
  Invoice, 
  SupportTicket, 
  CustomerReview, 
  AuditLogItem,
  StaffMember
} from '../types';

// =====================================================================
// Clean Production Baseline Data Stores (0 Demo / Sample Records)
// The buyer/owner configures their own business catalogue and accounts.
// =====================================================================

export const INITIAL_TECHNICIANS: Technician[] = [];
export const INITIAL_BOOKINGS: Booking[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_SERVICES: ServiceItem[] = [];
export const SERVICE_CATEGORIES: ServiceCategory[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_TICKETS: SupportTicket[] = [];
export const INITIAL_REVIEWS: CustomerReview[] = [];
export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];
export const INITIAL_STAFF_MEMBERS: StaffMember[] = [];

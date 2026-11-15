/**
 * ServiceOS — Commercial Showcase & Demonstration Engine
 * Dynamically loads clean commercial showcase fixtures for investor/buyer pitches,
 * with 1-click instant purge to 100% production clean mode.
 * Contains zero fake personal identities and zero fictitious names.
 */

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
  Incident
} from '../types';

export interface ShowcaseDataPackage {
  bookings: Booking[];
  technicians: Technician[];
  customers: Customer[];
  services: ServiceItem[];
  categories: ServiceCategory[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  reviews: CustomerReview[];
  auditLogs: AuditLogItem[];
  incidents: Incident[];
}

export function getShowcaseDemoData(): ShowcaseDataPackage {
  const categories: ServiceCategory[] = [
    { id: 'cat-1', name: 'Plumbing Services', iconName: 'Wrench', serviceCount: 24, color: '#6366F1' },
    { id: 'cat-2', name: 'Electrical & Smart Home', iconName: 'Zap', serviceCount: 18, color: '#EC4899' },
    { id: 'cat-3', name: 'HVAC & Climate Control', iconName: 'Wind', serviceCount: 16, color: '#3B82F6' },
    { id: 'cat-4', name: 'Appliance Repair', iconName: 'Tv', serviceCount: 20, color: '#10B981' },
    { id: 'cat-5', name: 'Deep Cleaning & Sanitization', iconName: 'Sparkles', serviceCount: 14, color: '#F59E0B' },
    { id: 'cat-6', name: 'Locksmith & Security', iconName: 'Shield', serviceCount: 10, color: '#8B5CF6' },
    { id: 'cat-7', name: 'Carpentry & Handyman', iconName: 'Hammer', serviceCount: 22, color: '#14B8A6' },
    { id: 'cat-8', name: 'Roofing & Gutter Care', iconName: 'Home', serviceCount: 8, color: '#EF4444' }
  ];

  const services: ServiceItem[] = [
    { id: 'srv-1', name: 'Emergency Drain Unclogging & Snaking', category: 'Plumbing Services', basePrice: 149.00, durationMinutes: 75, isPopular: true, status: 'Active', description: 'Professional mechanical snaking and sewer drain unclogging.' },
    { id: 'srv-2', name: 'Main Water Shutoff Valve Replacement', category: 'Plumbing Services', basePrice: 280.00, durationMinutes: 120, isPopular: false, status: 'Active', description: 'Complete main valve isolation and high-pressure brass replacement.' },
    { id: 'srv-3', name: 'Smart Thermostat Installation & Setup', category: 'Electrical & Smart Home', basePrice: 99.00, durationMinutes: 45, isPopular: true, status: 'Active', description: 'C-wire configuration, mounting, and mobile app integration.' },
    { id: 'srv-4', name: 'EV Charger Dedicated Circuit 240V', category: 'Electrical & Smart Home', basePrice: 380.00, durationMinutes: 180, isPopular: true, status: 'Active', description: 'Level 2 EV fast charger conduit, breaker panel, and NEMA socket.' },
    { id: 'srv-5', name: 'Central AC Refrigerant Recharge & Leak Test', category: 'HVAC & Climate Control', basePrice: 165.00, durationMinutes: 90, isPopular: true, status: 'Active', description: 'Freon level diagnostic, manifold gauge inspection, and refrigerant top-up.' },
    { id: 'srv-6', name: 'Furnace Comprehensive Safety Tune-Up', category: 'HVAC & Climate Control', basePrice: 135.00, durationMinutes: 60, isPopular: false, status: 'Active', description: 'Burner flame sensor cleaning, heat exchanger inspection, and safety check.' },
    { id: 'srv-7', name: 'Refrigerator Compressor Diagnostic', category: 'Appliance Repair', basePrice: 110.00, durationMinutes: 60, isPopular: true, status: 'Active', description: 'Starter relay, capacitor testing, and condenser fan repair.' },
    { id: 'srv-8', name: 'Whole House Deep Cleaning (3-Bedroom)', category: 'Deep Cleaning & Sanitization', basePrice: 220.00, durationMinutes: 240, isPopular: true, status: 'Active', description: 'Hospital-grade sanitization, baseboards, grout, kitchen and baths.' },
    { id: 'srv-9', name: 'High-Security Deadbolt Re-Key & Install', category: 'Locksmith & Security', basePrice: 125.00, durationMinutes: 45, isPopular: false, status: 'Active', description: 'ANSI Grade 1 cylinder re-keying and strike plate reinforcement.' },
    { id: 'srv-10', name: 'Drywall Repair & Texture Matching', category: 'Carpentry & Handyman', basePrice: 185.00, durationMinutes: 120, isPopular: false, status: 'Active', description: 'Patching, mudding, sanding, and seamless orange peel texture match.' }
  ];

  const technicians: Technician[] = [
    {
      id: 'tech_01',
      name: 'Master Plumber (Pro #101)',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      phone: '+1 (305) 800-1001',
      specialization: 'Master Plumber • Commercial & Residential',
      status: 'On Job',
      rating: 4.98,
      jobsCompleted: 1420,
      onTimeRate: 98.7,
      currentJobsCount: 1,
      workingHours: '08:00 AM - 06:00 PM',
      lat: 25.7743,
      lng: -80.1937,
      matchScore: 98
    },
    {
      id: 'tech_02',
      name: 'Master Electrician (Pro #102)',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      phone: '+1 (305) 800-1002',
      specialization: 'Master Electrician • Smart Home & EV',
      status: 'Available',
      rating: 4.96,
      jobsCompleted: 1890,
      onTimeRate: 99.2,
      currentJobsCount: 0,
      workingHours: '07:30 AM - 05:30 PM',
      lat: 25.7812,
      lng: -80.1415,
      matchScore: 95
    },
    {
      id: 'tech_03',
      name: 'Certified HVAC Pro (Pro #103)',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      phone: '+1 (305) 800-1003',
      specialization: 'Certified HVAC & Heat Pump Specialist',
      status: 'On Job',
      rating: 4.89,
      jobsCompleted: 980,
      onTimeRate: 96.5,
      currentJobsCount: 1,
      workingHours: '08:00 AM - 07:00 PM',
      lat: 25.7617,
      lng: -80.1918,
      matchScore: 92
    },
    {
      id: 'tech_04',
      name: 'Commercial Hygiene Pro (Pro #104)',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      phone: '+1 (305) 800-1004',
      specialization: 'Commercial Hygiene & Eco Deep Cleaning',
      status: 'Available',
      rating: 4.99,
      jobsCompleted: 2150,
      onTimeRate: 99.8,
      currentJobsCount: 0,
      workingHours: '09:00 AM - 06:00 PM',
      lat: 25.7554,
      lng: -80.2089,
      matchScore: 97
    },
    {
      id: 'tech_05',
      name: 'Security & Access Pro (Pro #105)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      phone: '+1 (305) 800-1005',
      specialization: 'Locksmith & Access Control',
      status: 'Available',
      rating: 4.94,
      jobsCompleted: 840,
      onTimeRate: 97.4,
      currentJobsCount: 0,
      workingHours: '24/7 Emergency Dispatch',
      lat: 25.7905,
      lng: -80.1301,
      matchScore: 91
    }
  ];

  const customers: Customer[] = [
    {
      id: 'cust_01',
      name: 'Residential Client Account #101',
      email: 'client.101@servicepro-accounts.com',
      phone: '+1 (305) 800-2001',
      city: 'Metro Zone',
      address: 'Primary Residential Zone, Suite 4B',
      totalBookings: 14,
      lifetimeSpend: 2480.00,
      rating: 5.0,
      status: 'Active'
    },
    {
      id: 'cust_02',
      name: 'Commercial Facility Account #102',
      email: 'facility.102@servicepro-accounts.com',
      phone: '+1 (305) 800-2002',
      city: 'Central District',
      address: '240 Central Parkway, Suite 300',
      totalBookings: 8,
      lifetimeSpend: 1650.00,
      rating: 4.9,
      status: 'Active'
    },
    {
      id: 'cust_03',
      name: 'Property Management Account #103',
      email: 'management.103@servicepro-accounts.com',
      phone: '+1 (305) 800-2003',
      city: 'Business Corridor',
      address: '882 Bayfront Plaza, Floor 2',
      totalBookings: 22,
      lifetimeSpend: 4210.00,
      rating: 5.0,
      status: 'Active'
    }
  ];

  const bookings: Booking[] = [
    {
      id: 'book_1001',
      jobNo: 'SVC-2026-1001',
      customerName: 'Residential Client Account #101',
      customerPhone: '+1 (305) 800-2001',
      customerAddress: 'Primary Residential Zone, Suite 4B',
      serviceName: 'Emergency Drain Unclogging & Snaking',
      category: 'Plumbing Services',
      technicianName: 'Master Plumber (Pro #101)',
      technicianId: 'tech_01',
      scheduleDate: new Date().toISOString().split('T')[0],
      scheduleTime: '10:30 AM',
      estimate: 187.50,
      paymentStatus: 'Paid',
      status: 'In Progress',
      priority: 'Critical',
      lat: 25.7743,
      lng: -80.1937,
      notes: 'Gate Code #4892. Ring intercom upon arrival.',
      isVerified: true
    },
    {
      id: 'book_1002',
      jobNo: 'SVC-2026-1002',
      customerName: 'Commercial Facility Account #102',
      customerPhone: '+1 (305) 800-2002',
      customerAddress: '240 Central Parkway, Suite 300',
      serviceName: 'Central AC Refrigerant Recharge & Leak Test',
      category: 'HVAC & Climate Control',
      technicianName: 'Certified HVAC Pro (Pro #103)',
      technicianId: 'tech_03',
      scheduleDate: new Date().toISOString().split('T')[0],
      scheduleTime: '02:15 PM',
      estimate: 165.00,
      paymentStatus: 'Paid',
      status: 'In Progress',
      priority: 'High',
      lat: 25.7617,
      lng: -80.1918,
      notes: 'Rooftop unit access key with security desk.',
      isVerified: true
    },
    {
      id: 'book_1003',
      jobNo: 'SVC-2026-1003',
      customerName: 'Property Management Account #103',
      customerPhone: '+1 (305) 800-2003',
      customerAddress: '882 Bayfront Plaza, Floor 2',
      serviceName: 'Smart Thermostat Installation & Setup',
      category: 'Electrical & Smart Home',
      technicianName: 'Master Electrician (Pro #102)',
      technicianId: 'tech_02',
      scheduleDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduleTime: '11:00 AM',
      estimate: 99.00,
      paymentStatus: 'Paid',
      status: 'Scheduled',
      priority: 'Medium',
      lat: 25.7812,
      lng: -80.1415,
      notes: 'Concierge check-in with technician ID.',
      isVerified: true
    },
    {
      id: 'book_1004',
      jobNo: 'SVC-2026-1004',
      customerName: 'Residential Client Account #101',
      customerPhone: '+1 (305) 800-2001',
      customerAddress: 'Primary Residential Zone, Suite 4B',
      serviceName: 'Whole House Deep Cleaning (3-Bedroom)',
      category: 'Deep Cleaning & Sanitization',
      technicianName: 'Commercial Hygiene Pro (Pro #104)',
      technicianId: 'tech_04',
      scheduleDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      scheduleTime: '09:00 AM',
      estimate: 220.00,
      paymentStatus: 'Paid',
      status: 'Completed',
      priority: 'Medium',
      lat: 25.7554,
      lng: -80.2089,
      notes: 'Completed. 5-star customer review logged.',
      isVerified: true
    }
  ];

  const invoices: Invoice[] = [
    {
      id: 'inv_1001',
      invoiceNo: 'INV-2026-001',
      customerName: 'Residential Client Account #101',
      serviceName: 'Emergency Drain Unclogging & Snaking',
      amount: 187.50,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid'
    },
    {
      id: 'inv_1002',
      invoiceNo: 'INV-2026-002',
      customerName: 'Commercial Facility Account #102',
      serviceName: 'Central AC Refrigerant Recharge & Leak Test',
      amount: 165.00,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid'
    },
    {
      id: 'inv_1003',
      invoiceNo: 'INV-2026-003',
      customerName: 'Residential Client Account #101',
      serviceName: 'Whole House Deep Cleaning (3-Bedroom)',
      amount: 220.00,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      status: 'Paid'
    }
  ];

  const tickets: SupportTicket[] = [
    {
      id: 'tick_101',
      ticketNo: 'TICK-901',
      customerName: 'Residential Client Account #101',
      subject: 'Question regarding replacement parts warranty',
      priority: 'Normal',
      status: 'Open',
      createdAt: '10m ago',
      category: 'Warranty & Parts',
      lastReply: 'Inquiry regarding warranty documentation for installed components.'
    },
    {
      id: 'tick_102',
      ticketNo: 'TICK-902',
      customerName: 'Commercial Facility Account #102',
      subject: 'Requesting PDF receipt with company GSTIN',
      priority: 'Normal',
      status: 'Resolved',
      createdAt: '2 hours ago',
      category: 'Invoicing & Tax',
      lastReply: 'Receipt delivered via email with corporate tax registration details.'
    }
  ];

  const reviews: CustomerReview[] = [
    {
      id: 'rev_101',
      customerName: 'Residential Client Account #101',
      rating: 5,
      date: 'Today',
      serviceName: 'Emergency Drain Unclogging & Snaking',
      comment: 'Technician arrived promptly, diagnosed the issue clearly, and completed the repair under estimate. Clean and professional.',
      isVerified: true
    },
    {
      id: 'rev_102',
      customerName: 'Property Management Account #103',
      rating: 5,
      date: 'Yesterday',
      serviceName: 'Whole House Deep Cleaning',
      comment: 'Excellent execution on commercial property turnover. Worksite cleaned thoroughly and on schedule.',
      isVerified: true
    }
  ];

  const auditLogs: AuditLogItem[] = [
    {
      id: 'aud_1',
      timestamp: new Date().toISOString(),
      user: 'Operations Dispatcher',
      role: 'ADMIN',
      action: 'DISPATCH_BROADCAST_ACCEPTED',
      module: 'Dispatch Radar',
      details: 'Dispatched via spatial geofence algorithm. Accepted in 24 seconds.',
      ipAddress: '172.16.0.42'
    },
    {
      id: 'aud_2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'Billing Gateway',
      role: 'SYSTEM',
      action: 'ESCROW_PAYMENT_AUTHORIZED',
      module: 'Stripe Escrow',
      details: 'Escrow Pre-Auth $187.50 authorized on card.',
      ipAddress: '198.51.100.14'
    }
  ];

  const incidents: Incident[] = [
    {
      id: 'inc_1',
      bookingNo: 'SVC-2026-1001',
      category: 'Safety',
      severity: 'Moderate',
      title: 'Geofence Arrival Verification',
      description: 'Technician verified arrival via GPS 250m geofence.',
      timestamp: new Date().toISOString(),
      resolved: true
    }
  ];

  return {
    bookings,
    technicians,
    customers,
    services,
    categories,
    invoices,
    tickets,
    reviews,
    auditLogs,
    incidents
  };
}

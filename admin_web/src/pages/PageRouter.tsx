import React from 'react';
import { useAdmin } from '../context/AdminContext';

// Module 1: Dashboard & Operations (1-5)
import { Page01MainDashboard } from './module1/Page01MainDashboard';
import { Page02LiveOperations } from './module1/Page02LiveOperations';
import { Page03TodayActivity } from './module1/Page03TodayActivity';
import { Page04PendingWork } from './module1/Page04PendingWork';
import { Page05CriticalAlerts } from './module1/Page05CriticalAlerts';

// Module 2: Bookings & Dispatch (6-12)
import { Page06AllBookings } from './module2/Page06AllBookings';
import { Page07NewBookingRequests } from './module2/Page07NewBookingRequests';
import { Page08ActiveBookings } from './module2/Page08ActiveBookings';
import { Page09BookingDetails } from './module2/Page09BookingDetails';
import { Page10BookingRescheduling } from './module2/Page10BookingRescheduling';
import { Page11DispatchBoard } from './module2/Page11DispatchBoard';
import { Page12ManualDispatchHandover } from './module2/Page12ManualDispatchHandover';

// Module 3: Services & Pricing (13-17)
import { Page13AllServices } from './module3/Page13AllServices';
import { Page14ServiceCategories } from './module3/Page14ServiceCategories';
import { Page15AddEditService } from './module3/Page15AddEditService';
import { Page16ServiceDetails } from './module3/Page16ServiceDetails';
import { Page17PricingManagement } from './module3/Page17PricingManagement';

// Module 4: Customer Management (18-21)
import { Page18AllCustomers } from './module4/Page18AllCustomers';
import { Page19CustomerProfile } from './module4/Page19CustomerProfile';
import { Page20CustomerBookingHistory } from './module4/Page20CustomerBookingHistory';
import { Page21CustomerSupportTickets } from './module4/Page21CustomerSupportTickets';

// Module 5: Technician Management (22-25)
import { Page22AllTechnicians } from './module5/Page22AllTechnicians';
import { Page23TechnicianProfile } from './module5/Page23TechnicianProfile';
import { Page24TechnicianAvailability } from './module5/Page24TechnicianAvailability';
import { Page25TechnicianPerformance } from './module5/Page25TechnicianPerformance';

// Module 6: Finance & Payments (26-30)
import { Page26FinancialDashboard } from './module6/Page26FinancialDashboard';
import { Page27TransactionHistory } from './module6/Page27TransactionHistory';
import { Page28CustomerInvoices } from './module6/Page28CustomerInvoices';
import { Page29TechnicianPayouts } from './module6/Page29TechnicianPayouts';
import { Page30RefundManagement } from './module6/Page30RefundManagement';

// Module 7: Support & Reviews (31-33)
import { Page31SupportTicketDashboard } from './module7/Page31SupportTicketDashboard';
import { Page32TicketDetailsConversation } from './module7/Page32TicketDetailsConversation';
import { Page33CustomerReviewsManagement } from './module7/Page33CustomerReviewsManagement';

// Module 8: Website & Platform Settings (34-36)
import { Page34WebsiteContentManagement } from './module8/Page34WebsiteContentManagement';
import { Page35GeneralPlatformSettings } from './module8/Page35GeneralPlatformSettings';
import { Page36PaymentNotificationConfig } from './module8/Page36PaymentNotificationConfig';

// Dedicated Facebook Profile Screen
import { FacebookProfilePage } from './shared/FacebookProfilePage';
import { SystemInstallerPage } from './commercial/SystemInstallerPage';
import { canAccessPage } from '../security/rbac';
import { recordSecurityEvent } from '../security/securityAuditLogger';
import { ShieldAlert } from 'lucide-react';

export const PageRouter: React.FC = () => {
  const { currentPageId, currentRole, session } = useAdmin();

  if (!canAccessPage(currentRole, currentPageId)) {
    recordSecurityEvent(
      'PRIVILEGE_ELEVATION_DENIED',
      session?.user?.email || 'staff-session',
      currentRole,
      'CRITICAL',
      `Restricted page access denied for Admin resource #${currentPageId}`
    );

    return (
      <div className="p-8 my-8 max-w-xl mx-auto bg-rose-50 border-2 border-rose-200 rounded-3xl text-center shadow-lg animate-in fade-in">
        <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        </div>
        <h3 className="text-xl font-black text-rose-950">Administrative Clearance Required</h3>
        <p className="text-sm text-rose-700 mt-2">
          Your current user role (<span className="font-mono font-bold">{currentRole}</span>) is restricted from viewing Page #{currentPageId}.
          This incident has been securely recorded to the platform audit log.
        </p>
      </div>
    );
  }

  switch (currentPageId) {
    // Module 1
    case 1:
      return <Page01MainDashboard />;
    case 2:
      return <Page02LiveOperations />;
    case 3:
      return <Page03TodayActivity />;
    case 4:
      return <Page04PendingWork />;
    case 5:
      return <Page05CriticalAlerts />;

    // Module 2
    case 6:
      return <Page06AllBookings />;
    case 7:
      return <Page07NewBookingRequests />;
    case 8:
      return <Page08ActiveBookings />;
    case 9:
      return <Page09BookingDetails />;
    case 10:
      return <Page10BookingRescheduling />;
    case 11:
      return <Page11DispatchBoard />;
    case 12:
      return <Page12ManualDispatchHandover />;

    // Module 3
    case 13:
      return <Page13AllServices />;
    case 14:
      return <Page14ServiceCategories />;
    case 15:
      return <Page15AddEditService />;
    case 16:
      return <Page16ServiceDetails />;
    case 17:
      return <Page17PricingManagement />;

    // Module 4
    case 18:
      return <Page18AllCustomers />;
    case 19:
      return <Page19CustomerProfile />;
    case 20:
      return <Page20CustomerBookingHistory />;
    case 21:
      return <Page21CustomerSupportTickets />;

    // Module 5
    case 22:
      return <Page22AllTechnicians />;
    case 23:
      return <Page23TechnicianProfile />;
    case 24:
      return <Page24TechnicianAvailability />;
    case 25:
      return <Page25TechnicianPerformance />;

    // Module 6
    case 26:
      return <Page26FinancialDashboard />;
    case 27:
      return <Page27TransactionHistory />;
    case 28:
      return <Page28CustomerInvoices />;
    case 29:
      return <Page29TechnicianPayouts />;
    case 30:
      return <Page30RefundManagement />;

    // Module 7
    case 31:
      return <Page31SupportTicketDashboard />;
    case 32:
      return <Page32TicketDetailsConversation />;
    case 33:
      return <Page33CustomerReviewsManagement />;

    // Module 8
    case 34:
      return <Page34WebsiteContentManagement />;
    case 35:
      return <Page35GeneralPlatformSettings />;
    case 36:
      return <Page36PaymentNotificationConfig />;

    // Facebook-Style Social Profile Screen
    case 37:
      return <FacebookProfilePage />;

    // Turnkey Commercial System Health & Migrations
    case 38:
      return <SystemInstallerPage />;

    default:
      if (typeof window !== 'undefined' && window.location.hash.includes('installer')) {
        return <SystemInstallerPage />;
      }
      return <Page01MainDashboard />;
  }
};

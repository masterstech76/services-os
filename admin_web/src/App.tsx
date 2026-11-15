import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { StaffSidebar } from './components/layout/StaffSidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { ModuleSubnav } from './components/layout/ModuleSubnav';
import { PageRouter } from './pages/PageRouter';
import { StaffPageRouter } from './pages/staff/StaffPageRouter';
import { ManualDispatchModal } from './components/modals/ManualDispatchModal';
import { CreateJobModal } from './components/modals/CreateJobModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { UniversalUserDossierModal } from './components/modals/UniversalUserDossierModal';
import { EditUniversalEntityModal } from './components/modals/EditUniversalEntityModal';
import { DirectSMSComposerModal } from './components/modals/DirectSMSComposerModal';
import { CreateCustomerDrawer } from './components/modals/CreateCustomerDrawer';
import { CreateTechnicianDrawer } from './components/modals/CreateTechnicianDrawer';
import { CreateCategoryDrawer } from './components/modals/CreateCategoryDrawer';
import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
import { SessionLockModal } from './components/modals/SessionLockModal';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginPage } from './pages/auth/LoginPage';
import { MobileSimulatorModal } from './components/commercial/MobileSimulatorModal';
import { DispatchSimulatorModal } from './components/commercial/DispatchSimulatorModal';
import { WhiteLabelBrandModal } from './components/commercial/WhiteLabelBrandModal';

const AppContent: React.FC = () => {
  const { 
    isAuthenticated, 
    currentRole,
    isMobileSimulatorOpen,
    setIsMobileSimulatorOpen,
    isDispatchSimulatorOpen,
    setIsDispatchSimulatorOpen,
    isWhiteLabelModalOpen,
    setIsWhiteLabelModalOpen
  } = useAdmin();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F7FB] text-slate-800 font-sans antialiased">
      {/* Dynamic Left Sidebar: AdminSidebar when Main Head (ADMIN), StaffSidebar when Operations (STAFF) */}
      {currentRole === 'ADMIN' ? <AdminSidebar /> : <StaffSidebar />}

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar with User Profile & Secure Sign Out */}
        <TopNavbar />

        {/* Clean Horizontal Navigation Buttons */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-0 bg-[#F4F7FB]">
          <ModuleSubnav />
        </div>

        {/* Scrollable Page Body Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8 bg-[#F4F7FB]">
          <div className="max-w-7xl mx-auto">
            {currentRole === 'ADMIN' ? <PageRouter /> : <StaffPageRouter />}
          </div>
        </main>
      </div>

      {/* Global Modals & Toast System */}
      <ManualDispatchModal />
      <CreateJobModal />
      <ProfileModal />
      <UniversalUserDossierModal />
      <EditUniversalEntityModal />
      <DirectSMSComposerModal />
      <CreateCustomerDrawer />
      <CreateTechnicianDrawer />
      <CreateCategoryDrawer />
      <CreateInvoiceModal />
      <SessionLockModal />
      <MobileSimulatorModal 
        isOpen={isMobileSimulatorOpen} 
        onClose={() => setIsMobileSimulatorOpen(false)} 
      />
      <DispatchSimulatorModal 
        isOpen={isDispatchSimulatorOpen} 
        onClose={() => setIsDispatchSimulatorOpen(false)} 
      />
      <WhiteLabelBrandModal 
        isOpen={isWhiteLabelModalOpen} 
        onClose={() => setIsWhiteLabelModalOpen(false)} 
      />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
};

export default App;

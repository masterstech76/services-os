import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { StaffDashboard } from './StaffDashboard';
import { StaffOrderIntake } from './StaffOrderIntake';
import { StaffActivityStream } from './StaffActivityStream';
import { StaffOrderAssignment } from './StaffOrderAssignment';
import { StaffLiveDispatch } from './StaffLiveDispatch';
import { StaffTechAvailability } from './StaffTechAvailability';
import { StaffEmergencyHandover } from './StaffEmergencyHandover';
import { StaffActiveOrders } from './StaffActiveOrders';
import { StaffScheduleCalendar } from './StaffScheduleCalendar';
import { StaffRescheduleDesk } from './StaffRescheduleDesk';
import { StaffJobVerification } from './StaffJobVerification';
import { StaffCustomerComm } from './StaffCustomerComm';
import { StaffDailyReport } from './StaffDailyReport';
import { FacebookProfilePage } from '../shared/FacebookProfilePage';

export const StaffPageRouter: React.FC = () => {
  const { currentStaffPageId } = useAdmin();

  switch (currentStaffPageId) {
    case 101:
      return <StaffDashboard />;
    case 102:
      return <StaffOrderIntake />;
    case 103:
      return <StaffActivityStream />;
    case 104:
      return <StaffOrderAssignment />;
    case 105:
      return <StaffLiveDispatch />;
    case 106:
      return <StaffTechAvailability />;
    case 107:
      return <StaffEmergencyHandover />;
    case 108:
      return <StaffActiveOrders />;
    case 109:
      return <StaffScheduleCalendar />;
    case 110:
      return <StaffRescheduleDesk />;
    case 111:
      return <StaffJobVerification />;
    case 112:
      return <StaffCustomerComm />;
    case 113:
      return <StaffDailyReport />;
    case 114:
      return <FacebookProfilePage />;
    default:
      return <StaffDashboard />;
  }
};

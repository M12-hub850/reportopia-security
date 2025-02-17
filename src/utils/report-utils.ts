
export const getReportTitle = (type: string) => {
  const titles: Record<string, string> = {
    'supervisor_weekly': 'SUPERVISOR WEEKLY REPORT',
    'manager_monthly': 'MANAGER MONTHLY REPORT',
    'event_incident': 'INCIDENT REPORT',
    'vehicle_handover': 'VEHICLE HANDOVER REPORT'
  };
  return titles[type] || type.toUpperCase().replace(/_/g, ' ');
};

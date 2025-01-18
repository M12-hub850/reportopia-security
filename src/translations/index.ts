export const translations = {
  en: {
    dashboard: {
      title: "Security Monitoring Dashboard",
      subtitle: "Monitor and manage your security operations reports",
      stats: {
        weeklyVisits: {
          title: "Weekly Visits",
          description: "Supervisor site visits this week"
        },
        monthlyVisits: {
          title: "Monthly Visits",
          description: "Manager project visits this month"
        },
        incidents: {
          title: "Events & Incidents",
          description: "Total events and incidents"
        }
      },
      cards: {
        managerVisits: {
          title: "Manager Monthly Visits",
          subtitle: "Monitor project performance",
          description: "Create and track monthly project visit reports and analytics.",
          action: "Add New Report"
        },
        supervisorVisits: {
          title: "Supervisor Weekly Visits",
          subtitle: "Track site inspections and observations",
          description: "Create and manage weekly site visit reports from supervisors.",
          action: "Add New Report"
        },
        incidents: {
          title: "Events & Incidents",
          subtitle: "Record security events and incidents",
          description: "Document and track security events and incidents with detailed information.",
          action: "Add New Report"
        },
        vehicles: {
          title: "Vehicle Handovers",
          subtitle: "Record vehicle transfers",
          description: "Log vehicle transfers with photos and condition details.",
          action: "Add New Report"
        },
        archive: {
          title: "Report Archive",
          subtitle: "Access all reports",
          description: "View and download all your submitted reports in PDF format.",
          action: "View Reports"
        }
      }
    }
  },
  ar: {
    dashboard: {
      title: "لوحة مراقبة الأمن",
      subtitle: "مراقبة وإدارة تقارير عمليات الأمن",
      stats: {
        weeklyVisits: {
          title: "الزيارات الأسبوعية",
          description: "زيارات المشرف للموقع هذا الأسبوع"
        },
        monthlyVisits: {
          title: "الزيارات الشهرية",
          description: "زيارات مدير المشروع هذا الشهر"
        },
        incidents: {
          title: "الأحداث والحوادث",
          description: "إجمالي الأحداث والحوادث"
        }
      },
      cards: {
        managerVisits: {
          title: "زيارات المدير الشهرية",
          subtitle: "مراقبة أداء المشروع",
          description: "إنشاء وتتبع تقارير الزيارات الشهرية وتحليلها.",
          action: "إضافة تقرير جديد"
        },
        supervisorVisits: {
          title: "زيارات المشرف الأسبوعية",
          subtitle: "تتبع عمليات التفتيش والملاحظات",
          description: "إنشاء وإدارة تقارير الزيارات الأسبوعية من المشرفين.",
          action: "إضافة تقرير جديد"
        },
        incidents: {
          title: "الأحداث والحوادث",
          subtitle: "تسجيل الأحداث والحوادث الأمنية",
          description: "توثيق وتتبع الأحداث والحوادث الأمنية مع معلومات مفصلة.",
          action: "إضافة تقرير جديد"
        },
        vehicles: {
          title: "تسليم المركبات",
          subtitle: "تسجيل نقل المركبات",
          description: "تسجيل عمليات نقل المركبات مع الصور وتفاصيل الحالة.",
          action: "إضافة تقرير جديد"
        },
        archive: {
          title: "أرشيف التقارير",
          subtitle: "الوصول إلى جميع التقارير",
          description: "عرض وتحميل جميع تقاريرك بتنسيق PDF.",
          action: "عرض التقارير"
        }
      }
    }
  }
};

export type Language = 'en' | 'ar';
export type TranslationKey = keyof typeof translations.en;
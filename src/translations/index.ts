export const translations = {
  en: {
    common: {
      cancel: "Cancel",
      submit: "Submit",
      loading: "Loading...",
      success: "Success!",
      error: "Error",
      back: "Back",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      noData: "No data available",
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      createAccount: "Create an Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      continueWith: "Or continue with",
      googleSignIn: "Sign in with Google",
      githubSignIn: "Sign in with Github",
    },
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
    },
    reports: {
      manager: {
        title: "Manager Monthly Report",
        subtitle: "Complete the monthly assessment for security staff performance",
        staffAssessment: "Staff Assessment",
        additionalInfo: "Additional Information",
        description: "Description",
        descriptionPlaceholder: "Enter detailed observations and comments",
        photoEvidence: "Photo Evidence",
        successMessage: "Manager report submitted successfully",
        errorMessage: "Failed to submit manager report",
        notificationTitle: "Monthly Report Submitted",
        notificationMessage: "Monthly report submitted with {count} staff assessments"
      },
      supervisor: {
        title: "Supervisor Weekly Report",
        subtitle: "Complete the weekly assessment for security staff performance",
        staffInfo: "Staff Information",
        staffName: "Staff Name",
        shift: "Shift",
        ratings: {
          attendance: "Attendance Rating",
          duties: "Duties Rating",
          uniform: "Uniform Rating",
          presence: "Presence Rating"
        },
        successMessage: "Supervisor report submitted successfully",
        errorMessage: "Failed to submit supervisor report"
      },
      incidents: {
        title: "Events and Incidents",
        subtitle: "Record events and incidents",
        guardInfo: "Guard Information",
        incidentDetails: "Incident Details",
        description: "Description",
        actionTaken: "Action Taken",
        reportingPerson: "Reporting Person",
        successMessage: "Event/incident report submitted successfully",
        errorMessage: "Failed to submit event/incident report"
      },
      vehicles: {
        title: "Vehicle Handover Form",
        subtitle: "Document vehicle transfers and conditions",
        vehicleInfo: "Vehicle Information",
        plateNumber: "Plate Number",
        model: "Model",
        type: "Type",
        brand: "Brand",
        mileage: "Mileage",
        location: "Location",
        contents: "Vehicle Contents",
        observations: "Observations",
        successMessage: "Vehicle handover report submitted successfully",
        errorMessage: "Failed to submit vehicle handover report"
      }
    }
  },
  ar: {
    common: {
      cancel: "إلغاء",
      submit: "إرسال",
      loading: "جاري التحميل...",
      success: "تم بنجاح!",
      error: "خطأ",
      back: "رجوع",
      save: "حفظ",
      delete: "حذف",
      edit: "تعديل",
      view: "عرض",
      noData: "لا توجد بيانات متاحة",
    },
    auth: {
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      createAccount: "إنشاء حساب جديد",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      dontHaveAccount: "ليس لديك حساب؟",
      continueWith: "أو المتابعة باستخدام",
      googleSignIn: "تسجيل الدخول باستخدام جوجل",
      githubSignIn: "تسجيل الدخول باستخدام جيثب",
    },
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
    },
    reports: {
      manager: {
        title: "تقرير المدير الشهري",
        subtitle: "إكمال التقييم الشهري لأداء موظفي الأمن",
        staffAssessment: "تقييم الموظفين",
        additionalInfo: "معلومات إضافية",
        description: "الوصف",
        descriptionPlaceholder: "أدخل الملاحظات والتعليقات التفصيلية",
        photoEvidence: "الصور التوثيقية",
        successMessage: "تم تقديم تقرير المدير بنجاح",
        errorMessage: "فشل في تقديم تقرير المدير",
        notificationTitle: "تم تقديم التقرير الشهري",
        notificationMessage: "تم تقديم التقرير الشهري مع {count} تقييمات للموظفين"
      },
      supervisor: {
        title: "تقرير المشرف الأسبوعي",
        subtitle: "إكمال التقييم الأسبوعي لأداء موظفي الأمن",
        staffInfo: "معلومات الموظف",
        staffName: "اسم الموظف",
        shift: "المناوبة",
        ratings: {
          attendance: "تقييم الحضور",
          duties: "تقييم الواجبات",
          uniform: "تقييم الزي الرسمي",
          presence: "تقييم التواجد"
        },
        successMessage: "تم تقديم تقرير المشرف بنجاح",
        errorMessage: "فشل في تقديم تقرير المشرف"
      },
      incidents: {
        title: "الأحداث والحوادث",
        subtitle: "تسجيل الأحداث والحوادث",
        guardInfo: "معلومات الحارس",
        incidentDetails: "تفاصيل الحادث",
        description: "الوصف",
        actionTaken: "الإجراء المتخذ",
        reportingPerson: "الشخص المبلغ",
        successMessage: "تم تقديم تقرير الحادث بنجاح",
        errorMessage: "فشل في تقديم تقرير الحادث"
      },
      vehicles: {
        title: "نموذج تسليم المركبة",
        subtitle: "توثيق عمليات نقل المركبات وحالتها",
        vehicleInfo: "معلومات المركبة",
        plateNumber: "رقم اللوحة",
        model: "الموديل",
        type: "النوع",
        brand: "الماركة",
        mileage: "المسافة المقطوعة",
        location: "الموقع",
        contents: "محتويات المركبة",
        observations: "الملاحظات",
        successMessage: "تم تقديم تقرير تسليم المركبة بنجاح",
        errorMessage: "فشل في تقديم تقرير تسليم المركبة"
      }
    }
  }
};

export type Language = 'en' | 'ar';
export type TranslationKey = keyof typeof translations.en;

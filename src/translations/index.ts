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
        guardName: "Name of Guard on Duty",
        guardNamePlaceholder: "Enter guard name",
        shift: "Shift",
        shiftPlaceholder: "Enter shift details",
        incidentDetails: "Incident Details",
        location: "Location",
        locationPlaceholder: "Enter incident location",
        date: "Date",
        pickDate: "Pick a date",
        reportingTime: "Time of Reporting",
        timePlaceholder: "Enter reporting time",
        description: "Description",
        descriptionPlaceholder: "Enter detailed description",
        actionTaken: "Action Taken",
        actionTakenPlaceholder: "Describe actions taken",
        reportingPerson: "Name of the Reporting Person",
        reportingPersonPlaceholder: "Enter name of reporting person",
        photoEvidence: "Photo Evidence",
        successMessage: "Event/incident report submitted successfully",
        errorMessage: "Failed to submit event/incident report"
      },
      vehicles: {
        title: "Vehicle Handover Form",
        subtitle: "Document vehicle transfers and conditions",
        vehicleInfo: "Vehicle Information",
        plateNumber: "Plate Number",
        plateNumberPlaceholder: "Enter plate number",
        model: "Model",
        modelPlaceholder: "Enter model",
        type: "Type",
        typePlaceholder: "Enter vehicle type",
        brand: "Brand",
        brandPlaceholder: "Enter brand",
        mileage: "Current Mileage",
        mileagePlaceholder: "Enter mileage",
        location: "Location",
        locationPlaceholder: "Enter location",
        contents: "Vehicle Contents",
        spareTire: "Spare Tire",
        jackHandle: "Jack Handle",
        safetyKit: "Safety Kit",
        fireExtinguisher: "Fire Extinguisher",
        dashCam: "Dash Camera",
        other: "Other",
        otherSpecification: "Other Specification",
        otherSpecificationPlaceholder: "Please specify other contents",
        observations: "Observations",
        receiverInfo: "Receiver Information",
        receiverName: "Receiver Name",
        receiverNamePlaceholder: "Enter receiver's name",
        receiverPhone: "Receiver Phone",
        receiverPhonePlaceholder: "Enter receiver's phone",
        receiverId: "Receiver ID",
        receiverIdPlaceholder: "Enter receiver's ID",
        receiverIdImage: "Receiver ID Image",
        drivingLicenseImage: "Driving License Image",
        supervisorName: "Supervisor Name",
        supervisorNamePlaceholder: "Enter supervisor's name",
        date: "Date",
        time: "Time",
        carImages: "Car Condition Images",
        takeCarPhoto: "Take Car Photo",
        mileageImage: "Mileage Meter Image",
        takeMileagePhoto: "Take Mileage Photo",
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
        guardName: "اسم الحارس المناوب",
        guardNamePlaceholder: "أدخل اسم الحارس",
        shift: "المناوبة",
        shiftPlaceholder: "أدخل تفاصيل المناوبة",
        incidentDetails: "تفاصيل الحادث",
        location: "الموقع",
        locationPlaceholder: "أدخل موقع الحادث",
        date: "التاريخ",
        pickDate: "اختر تاريخ",
        reportingTime: "وقت الإبلاغ",
        timePlaceholder: "أدخل وقت الإبلاغ",
        description: "الوصف",
        descriptionPlaceholder: "أدخل وصف مفصل",
        actionTaken: "الإجراء المتخذ",
        actionTakenPlaceholder: "صف الإجراءات المتخذة",
        reportingPerson: "اسم الشخص المبلغ",
        reportingPersonPlaceholder: "أدخل اسم الشخص المبلغ",
        photoEvidence: "الصور التوثيقية",
        successMessage: "تم تقديم تقرير الحادث بنجاح",
        errorMessage: "فشل في تقديم تقرير الحادث"
      },
      vehicles: {
        title: "نموذج تسليم المركبة",
        subtitle: "توثيق عمليات نقل المركبات وحالتها",
        vehicleInfo: "معلومات المركبة",
        plateNumber: "رقم اللوحة",
        plateNumberPlaceholder: "أدخل رقم اللوحة",
        model: "الموديل",
        modelPlaceholder: "أدخل الموديل",
        type: "النوع",
        typePlaceholder: "أدخل نوع المركبة",
        brand: "الماركة",
        brandPlaceholder: "أدخل الماركة",
        mileage: "المسافة المقطوعة",
        mileagePlaceholder: "أدخل المسافة المقطوعة",
        location: "الموقع",
        locationPlaceholder: "أدخل الموقع",
        contents: "محتويات المركبة",
        spareTire: "إطار احتياطي",
        jackHandle: "رافعة",
        safetyKit: "حقيبة الإسعافات",
        fireExtinguisher: "طفاية حريق",
        dashCam: "كاميرا السيارة",
        other: "أخرى",
        otherSpecification: "تحديد أخرى",
        otherSpecificationPlaceholder: "يرجى تحديد المحتويات الأخرى",
        observations: "الملاحظات",
        receiverInfo: "معلومات المستلم",
        receiverName: "اسم المستلم",
        receiverNamePlaceholder: "أدخل اسم المستلم",
        receiverPhone: "هاتف المستلم",
        receiverPhonePlaceholder: "أدخل رقم هاتف المستلم",
        receiverId: "رقم هوية المستلم",
        receiverIdPlaceholder: "أدخل رقم هوية المستلم",
        receiverIdImage: "صورة هوية المستلم",
        drivingLicenseImage: "صورة رخصة القيادة",
        supervisorName: "اسم المشرف",
        supervisorNamePlaceholder: "أدخل اسم المشرف",
        date: "التاريخ",
        time: "الوقت",
        carImages: "صور حالة السيارة",
        takeCarPhoto: "التقط صورة للسيارة",
        mileageImage: "صورة عداد المسافة",
        takeMileagePhoto: "التقط صورة للعداد",
        successMessage: "تم تقديم تقرير تسليم المركبة بنجاح",
        errorMessage: "فشل في تقديم تقرير تسليم المركبة"
      }
    }
  }
};

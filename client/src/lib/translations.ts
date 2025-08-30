export type Language = 'fr' | 'ar' | 'en';

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      courses: "Formations",
      about: "À propos",
      contact: "Contact",
      signup: "S'inscrire",
      admin: "Admin"
    },
    hero: {
      title: "Inscription ouverte — École de technologies InnoVision",
      subtitle: "Formez-vous aux technologies d'avenir avec nos experts. Robotique, IA, Cybersécurité, et plus encore.",
      cta1: "S'inscrire",
      cta2: "Télécharger la brochure",
      address: "Blida, Rue Mohamed Ouali, Blida"
    },
    features: {
      title: "Nos Formations",
      robotics: {
        title: "Robotique",
        description: "Construction et programmation de robots intelligents"
      },
      cybersecurity: {
        title: "Cybersécurité",
        description: "Protection des systèmes et certification CISCO"
      },
      ai: {
        title: "Intelligence Artificielle",
        description: "Python et développement d'IA avancée"
      },
      printing3d: {
        title: "Impression 3D",
        description: "Conception et fabrication d'objets 3D"
      },
      webmobile: {
        title: "Web & Mobile",
        description: "Développement d'applications modernes"
      },
      video: {
        title: "Montage Vidéo",
        description: "Production et édition vidéo professionnelle"
      },
      design: {
        title: "Design Graphique",
        description: "Création visuelle et identité de marque"
      },
      chess: {
        title: "Club d'Échecs",
        description: "Développement de la stratégie et de la logique"
      }
    },
    stats: {
      title: "Pourquoi nous choisir ?",
      placement: "Taux de placement",
      placementDesc: "De nos diplômés trouvent un emploi",
      experience: "Années d'expérience",
      experienceDesc: "Dans la formation technologique",
      students: "Étudiants formés",
      studentsDesc: "Avec succès depuis notre création"
    },
    form: {
      title: "Inscription",
      fullName: "Nom & Prénom",
      email: "Email",
      birthDate: "Date de naissance",
      wilaya: "Wilaya",
      phone: "Numéro de téléphone",
      course: "Formation choisie",
      submit: "S'inscrire",
      ageError: "Âge minimum 8 ans",
      selectCourse: "Sélectionnez une formation",
      selectWilaya: "Sélectionnez votre wilaya",
      processing: "Traitement en cours...",
      success: "Inscription réussie ! Vous recevrez un email de confirmation.",
      consent: "J'accepte que mes données personnelles soient traitées conformément à la politique de confidentialité pour traiter ma demande d'inscription.",
      ageDisplay: "ans",
      phonePlaceholder: "+213 7XX XX XX XX",
      courseNote: "Les formations disponibles dépendent de votre âge"
    },
    testimonials: {
      title: "Témoignages",
      student1: {
        name: "Ahmed B.",
        role: "Étudiant en Cybersécurité",
        text: "Excellente formation avec des instructeurs compétents. J'ai obtenu ma certification CISCO et trouvé un emploi immédiatement."
      },
      student2: {
        name: "Fatima Z.",
        role: "Étudiante en IA",
        text: "Les projets pratiques m'ont permis de maîtriser Python et l'IA. Très satisfaite de ma formation."
      },
      student3: {
        name: "Yacine M.",
        role: "Étudiant en Robotique",
        text: "Infrastructure moderne et encadrement personnalisé. Je recommande vivement cette école."
      }
    },
    faq: {
      title: "Questions Fréquentes",
      q1: {
        question: "Quels sont les prérequis pour s'inscrire ?",
        answer: "Les formations sont ouvertes selon l'âge : 8-17 ans pour les formations kids, 18+ pour les formations adultes. Aucun prérequis technique n'est nécessaire."
      },
      q2: {
        question: "Quelle est la durée des formations ?",
        answer: "Les formations varient de 3 à 12 mois selon le programme choisi. Nous proposons des formats flexibles adaptés à votre emploi du temps."
      },
      q3: {
        question: "Les certifications sont-elles reconnues ?",
        answer: "Oui, nous préparons aux certifications internationales comme CISCO pour la cybersécurité. Nos diplômes sont reconnus par les entreprises du secteur."
      },
      q4: {
        question: "Y a-t-il un accompagnement après la formation ?",
        answer: "Nous offrons un suivi personnalisé avec aide à la recherche d'emploi, réseau d'entreprises partenaires et support technique continu."
      }
    },
    footer: {
      description: "École de technologies d'excellence à Blida. Formations professionnelles en technologies d'avenir.",
      contact: "Contact",
      social: "Suivez-nous",
      whatsapp: "WhatsApp",
      copyright: "© 2024 InnoVision School. Tous droits réservés."
    },
    admin: {
      login: {
        title: "Connexion Administrateur",
        email: "Email",
        password: "Mot de passe",
        remember: "Se souvenir",
        submit: "Se connecter",
        error: "Identifiants invalides"
      },
      dashboard: {
        title: "Tableau de Bord",
        logout: "Déconnexion",
        totalApplicants: "Total des candidatures",
        todayApplicants: "Candidatures aujourd'hui",
        weekApplicants: "Cette semaine",
        conversionRate: "Taux de conversion",
        applicants: "Candidatures",
        search: "Rechercher...",
        filters: "Filtres",
        allWilayas: "Toutes les wilayas",
        allCourses: "Toutes les formations",
        allAges: "Tous les âges",
        kids: "Enfants (8-17)",
        adults: "Adultes (18+)",
        export: "Exporter",
        resendEmail: "Renvoyer email",
        downloadPdf: "Télécharger PDF",
        courseDistribution: "Répartition par formation",
        wilayaDistribution: "Répartition par wilaya",
        dailySignups: "Inscriptions quotidiennes",
        loading: "Chargement...",
        noData: "Aucune donnée disponible",
        emailSent: "Email renvoyé avec succès"
      }
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      courses: "التكوينات",
      about: "حولنا",
      contact: "اتصل بنا",
      signup: "التسجيل",
      admin: "الإدارة"
    },
    hero: {
      title: "التسجيل مفتوح — مدرسة إنوفيجن للتكنولوجيا",
      subtitle: "تدرب على تقنيات المستقبل مع خبرائنا. الروبوتات، الذكاء الاصطناعي، الأمن السيبراني، والمزيد.",
      cta1: "التسجيل",
      cta2: "تحميل الكتيب",
      address: "البليدة، شارع محمد والي، البليدة"
    },
    features: {
      title: "تكويناتنا",
      robotics: {
        title: "الروبوتات",
        description: "بناء وبرمجة الروبوتات الذكية"
      },
      cybersecurity: {
        title: "الأمن السيبراني",
        description: "حماية الأنظمة وشهادة سيسكو"
      },
      ai: {
        title: "الذكاء الاصطناعي",
        description: "بايثون وتطوير الذكاء الاصطناعي المتقدم"
      },
      printing3d: {
        title: "الطباعة ثلاثية الأبعاد",
        description: "تصميم وتصنيع الأشياء ثلاثية الأبعاد"
      },
      webmobile: {
        title: "الويب والهاتف",
        description: "تطوير التطبيقات الحديثة"
      },
      video: {
        title: "مونتاج الفيديو",
        description: "الإنتاج والتحرير الاحترافي للفيديو"
      },
      design: {
        title: "التصميم الجرافيكي",
        description: "الإبداع البصري وهوية العلامة التجارية"
      },
      chess: {
        title: "نادي الشطرنج",
        description: "تطوير الاستراتيجية والمنطق"
      }
    },
    stats: {
      title: "لماذا تختارنا؟",
      placement: "معدل التوظيف",
      placementDesc: "من خريجينا يجدون وظيفة",
      experience: "سنوات الخبرة",
      experienceDesc: "في التدريب التكنولوجي",
      students: "الطلاب المتدربون",
      studentsDesc: "بنجاح منذ تأسيسنا"
    },
    form: {
      title: "التسجيل",
      fullName: "الاسم واللقب",
      email: "البريد الإلكتروني",
      birthDate: "تاريخ الميلاد",
      wilaya: "الولاية",
      phone: "رقم الهاتف",
      course: "التكوين المختار",
      submit: "التسجيل",
      ageError: "الحد الأدنى للسن 8 سنوات",
      selectCourse: "اختر تكوين",
      selectWilaya: "اختر ولايتك",
      processing: "جاري المعالجة...",
      success: "تم التسجيل بنجاح! ستستلم إيميل تأكيد.",
      consent: "أوافق على معالجة بياناتي الشخصية وفقاً لسياسة الخصوصية لمعالجة طلب التسجيل.",
      ageDisplay: "سنة",
      phonePlaceholder: "+213 7XX XX XX XX",
      courseNote: "التكوينات المتاحة تعتمد على عمرك"
    },
    testimonials: {
      title: "الشهادات",
      student1: {
        name: "أحمد ب.",
        role: "طالب أمن سيبراني",
        text: "تدريب ممتاز مع مدربين أكفاء. حصلت على شهادة سيسكو ووجدت وظيفة فوراً."
      },
      student2: {
        name: "فاطمة ز.",
        role: "طالبة ذكاء اصطناعي",
        text: "المشاريع العملية ساعدتني على إتقان بايثون والذكاء الاصطناعي. راضية جداً عن التدريب."
      },
      student3: {
        name: "ياسين م.",
        role: "طالب روبوتات",
        text: "بنية تحتية حديثة وإشراف شخصي. أنصح بشدة بهذه المدرسة."
      }
    },
    faq: {
      title: "الأسئلة الشائعة",
      q1: {
        question: "ما هي المتطلبات المسبقة للتسجيل؟",
        answer: "التكوينات مفتوحة حسب العمر: 8-17 سنة للتكوينات للأطفال، 18+ للتكوينات للبالغين. لا توجد متطلبات تقنية مسبقة."
      },
      q2: {
        question: "ما هي مدة التكوينات؟",
        answer: "تختلف التكوينات من 3 إلى 12 شهر حسب البرنامج المختار. نقدم صيغ مرنة تتناسب مع جدولك الزمني."
      },
      q3: {
        question: "هل الشهادات معترف بها؟",
        answer: "نعم، نحضر للشهادات الدولية مثل سيسكو للأمن السيبراني. شهاداتنا معترف بها من قبل شركات القطاع."
      },
      q4: {
        question: "هل هناك مرافقة بعد التكوين؟",
        answer: "نقدم متابعة شخصية مع مساعدة في البحث عن وظيفة، شبكة شركات شريكة ودعم تقني مستمر."
      }
    },
    footer: {
      description: "مدرسة تقنيات متميزة في البليدة. تدريب مهني في تقنيات المستقبل.",
      contact: "اتصل بنا",
      social: "تابعونا",
      whatsapp: "واتساب",
      copyright: "© 2024 مدرسة إنوفيجن. جميع الحقوق محفوظة."
    },
    admin: {
      login: {
        title: "دخول المشرف",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        remember: "تذكرني",
        submit: "تسجيل الدخول",
        error: "بيانات اعتماد غير صحيحة"
      },
      dashboard: {
        title: "لوحة التحكم",
        logout: "تسجيل الخروج",
        totalApplicants: "إجمالي المتقدمين",
        todayApplicants: "متقدمون اليوم",
        weekApplicants: "هذا الأسبوع",
        conversionRate: "معدل التحويل",
        applicants: "المتقدمون",
        search: "البحث...",
        filters: "المرشحات",
        allWilayas: "جميع الولايات",
        allCourses: "جميع التكوينات",
        allAges: "جميع الأعمار",
        kids: "أطفال (8-17)",
        adults: "بالغون (18+)",
        export: "تصدير",
        resendEmail: "إعادة إرسال الإيميل",
        downloadPdf: "تحميل PDF",
        courseDistribution: "التوزيع حسب التكوين",
        wilayaDistribution: "التوزيع حسب الولاية",
        dailySignups: "التسجيلات اليومية",
        loading: "جاري التحميل...",
        noData: "لا توجد بيانات متاحة",
        emailSent: "تم إرسال الإيميل بنجاح"
      }
    }
  },
  en: {
    nav: {
      home: "Home",
      courses: "Courses",
      about: "About",
      contact: "Contact",
      signup: "Sign Up",
      admin: "Admin"
    },
    hero: {
      title: "Open Enrollment — InnoVision Technology School",
      subtitle: "Train in future technologies with our experts. Robotics, AI, Cybersecurity, and more.",
      cta1: "Sign Up",
      cta2: "Download Brochure",
      address: "Blida, Mohamed Ouali Street, Blida"
    },
    features: {
      title: "Our Courses",
      robotics: {
        title: "Robotics",
        description: "Building and programming intelligent robots"
      },
      cybersecurity: {
        title: "Cybersecurity",
        description: "System protection and CISCO certification"
      },
      ai: {
        title: "Artificial Intelligence",
        description: "Python and advanced AI development"
      },
      printing3d: {
        title: "3D Printing",
        description: "Design and manufacturing of 3D objects"
      },
      webmobile: {
        title: "Web & Mobile",
        description: "Modern application development"
      },
      video: {
        title: "Video Editing",
        description: "Professional video production and editing"
      },
      design: {
        title: "Graphic Design",
        description: "Visual creation and brand identity"
      },
      chess: {
        title: "Chess Club",
        description: "Strategy and logic development"
      }
    },
    stats: {
      title: "Why Choose Us?",
      placement: "Placement Rate",
      placementDesc: "Of our graduates find employment",
      experience: "Years Experience",
      experienceDesc: "In technology training",
      students: "Students Trained",
      studentsDesc: "Successfully since our founding"
    },
    form: {
      title: "Registration",
      fullName: "Full Name",
      email: "Email",
      birthDate: "Birth Date",
      wilaya: "Wilaya",
      phone: "Phone Number",
      course: "Selected Course",
      submit: "Register",
      ageError: "Minimum age 8 years",
      selectCourse: "Select a course",
      selectWilaya: "Select your wilaya",
      processing: "Processing...",
      success: "Registration successful! You will receive a confirmation email.",
      consent: "I agree that my personal data will be processed in accordance with the privacy policy to process my registration request.",
      ageDisplay: "years old",
      phonePlaceholder: "+213 7XX XX XX XX",
      courseNote: "Available courses depend on your age"
    },
    testimonials: {
      title: "Testimonials",
      student1: {
        name: "Ahmed B.",
        role: "Cybersecurity Student",
        text: "Excellent training with competent instructors. I got my CISCO certification and found a job immediately."
      },
      student2: {
        name: "Fatima Z.",
        role: "AI Student",
        text: "The practical projects helped me master Python and AI. Very satisfied with my training."
      },
      student3: {
        name: "Yacine M.",
        role: "Robotics Student",
        text: "Modern infrastructure and personalized supervision. I highly recommend this school."
      }
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: {
        question: "What are the prerequisites for enrollment?",
        answer: "Courses are open by age: 8-17 years for kids courses, 18+ for adult courses. No technical prerequisites required."
      },
      q2: {
        question: "What is the duration of the courses?",
        answer: "Courses vary from 3 to 12 months depending on the chosen program. We offer flexible formats adapted to your schedule."
      },
      q3: {
        question: "Are the certifications recognized?",
        answer: "Yes, we prepare for international certifications like CISCO for cybersecurity. Our diplomas are recognized by industry companies."
      },
      q4: {
        question: "Is there support after training?",
        answer: "We offer personalized follow-up with job search assistance, partner company network and continuous technical support."
      }
    },
    footer: {
      description: "Excellence technology school in Blida. Professional training in future technologies.",
      contact: "Contact",
      social: "Follow Us",
      whatsapp: "WhatsApp",
      copyright: "© 2024 InnoVision School. All rights reserved."
    },
    admin: {
      login: {
        title: "Admin Login",
        email: "Email",
        password: "Password",
        remember: "Remember me",
        submit: "Sign In",
        error: "Invalid credentials"
      },
      dashboard: {
        title: "Dashboard",
        logout: "Logout",
        totalApplicants: "Total Applicants",
        todayApplicants: "Today's Applicants",
        weekApplicants: "This Week",
        conversionRate: "Conversion Rate",
        applicants: "Applicants",
        search: "Search...",
        filters: "Filters",
        allWilayas: "All Wilayas",
        allCourses: "All Courses",
        allAges: "All Ages",
        kids: "Kids (8-17)",
        adults: "Adults (18+)",
        export: "Export",
        resendEmail: "Resend Email",
        downloadPdf: "Download PDF",
        courseDistribution: "Course Distribution",
        wilayaDistribution: "Wilaya Distribution",
        dailySignups: "Daily Signups",
        loading: "Loading...",
        noData: "No data available",
        emailSent: "Email sent successfully"
      }
    }
  }
} as const;

export type TranslationKey = 
  | 'nav.home' | 'nav.courses' | 'nav.about' | 'nav.contact' | 'nav.signup' | 'nav.admin'
  | 'hero.title' | 'hero.subtitle' | 'hero.cta1' | 'hero.cta2' | 'hero.address'
  | 'features.title' | 'features.robotics.title' | 'features.robotics.description'
  | 'features.cybersecurity.title' | 'features.cybersecurity.description'
  | 'features.ai.title' | 'features.ai.description'
  | 'features.printing3d.title' | 'features.printing3d.description'
  | 'features.webmobile.title' | 'features.webmobile.description'
  | 'features.video.title' | 'features.video.description'
  | 'features.design.title' | 'features.design.description'
  | 'features.chess.title' | 'features.chess.description'
  | 'stats.title' | 'stats.placement' | 'stats.placementDesc'
  | 'stats.experience' | 'stats.experienceDesc'
  | 'stats.students' | 'stats.studentsDesc'
  | 'form.title' | 'form.fullName' | 'form.email' | 'form.birthDate' 
  | 'form.wilaya' | 'form.phone' | 'form.course' | 'form.submit'
  | 'form.ageError' | 'form.selectCourse' | 'form.selectWilaya'
  | 'form.processing' | 'form.success' | 'form.consent' | 'form.ageDisplay'
  | 'form.phonePlaceholder' | 'form.courseNote'
  | 'testimonials.title' | 'testimonials.student1.name' | 'testimonials.student1.role' | 'testimonials.student1.text'
  | 'testimonials.student2.name' | 'testimonials.student2.role' | 'testimonials.student2.text'
  | 'testimonials.student3.name' | 'testimonials.student3.role' | 'testimonials.student3.text'
  | 'faq.title' | 'faq.q1.question' | 'faq.q1.answer'
  | 'faq.q2.question' | 'faq.q2.answer' | 'faq.q3.question' | 'faq.q3.answer'
  | 'faq.q4.question' | 'faq.q4.answer'
  | 'footer.description' | 'footer.contact' | 'footer.social' | 'footer.whatsapp' | 'footer.copyright'
  | 'admin.login.title' | 'admin.login.email' | 'admin.login.password' | 'admin.login.remember' | 'admin.login.submit' | 'admin.login.error'
  | 'admin.dashboard.title' | 'admin.dashboard.logout' | 'admin.dashboard.totalApplicants' | 'admin.dashboard.todayApplicants'
  | 'admin.dashboard.weekApplicants' | 'admin.dashboard.conversionRate' | 'admin.dashboard.applicants'
  | 'admin.dashboard.search' | 'admin.dashboard.filters' | 'admin.dashboard.allWilayas' | 'admin.dashboard.allCourses'
  | 'admin.dashboard.allAges' | 'admin.dashboard.kids' | 'admin.dashboard.adults' | 'admin.dashboard.export'
  | 'admin.dashboard.resendEmail' | 'admin.dashboard.downloadPdf' | 'admin.dashboard.courseDistribution'
  | 'admin.dashboard.wilayaDistribution' | 'admin.dashboard.dailySignups' | 'admin.dashboard.loading'
  | 'admin.dashboard.noData' | 'admin.dashboard.emailSent';

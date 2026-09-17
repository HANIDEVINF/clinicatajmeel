import { Treatment, InstagramStoryItem, InstagramPost, BeforeAfterCase, DoctorProfile } from '../types';

export const CLINIC_CONTACT = {
  name: 'Tadjmeel Clinica',
  taglineFr: 'Clinique de Médecine Esthétique & Laser de Référence',
  taglineAr: 'عيادة الطب التجميلي والليزر الرائدة بالجزائر',
  taglineEn: 'Premier Aesthetic Medicine & Medical Laser Clinic',
  address: 'Birkhadem, Alger (Gué de Constantine), Algérie',
  googleMapsUrl: 'https://maps.google.com/?q=Birkhadem+Alger',
  instagramHandle: '@tadjmeel_clinica',
  instagramUrl: 'https://www.instagram.com/tadjmeel_clinica/?hl=en',
  whatsappNumber: '+213552907956',
  whatsappUrl: 'https://wa.me/213552907956?text=Bonjour%20Clinique%20Tadjmeel,%20je%20souhaite%20prendre%20un%20rendez-vous%20pour%20une%20consultation.',
  phones: {
    laser: { display: '0552 90 79 56', raw: '+213552907956', labelFr: 'Pôle Épilation Laser' },
    facial: { display: '0558 45 56 82', raw: '+213558455682', labelFr: 'Soins Visage & Rajeunissement' },
    hair: { display: '0798 55 88 38', raw: '+213798558838', labelFr: 'Soins Capillaires & PRP' }
  },
  openingHours: {
    weekdays: 'Samedi – Jeudi : 09h00 – 18h30',
    friday: 'Vendredi : Fermé (Consultations d\'urgence sur demande)'
  }
};

export const TREATMENTS: Treatment[] = [
  {
    id: 'laser-splendor-x',
    category: 'laser',
    name: 'Épilation Laser SPLENDOR X™',
    arabicName: 'إزالة الشعر بالليزر المتطور SPLENDOR X',
    shortDesc: 'Technologie révolutionnaire BLEND X™ combinant simultanément Alexandrite (755nm) et Nd:YAG (1064nm) pour tous types de peau.',
    fullDesc: 'La clinique Tadjmeel met à votre disposition le SPLENDOR X de Lumenis, doté d\'un spot carré unique au monde garantissant zéro chevauchement et une couverture rapide et uniforme. Système de refroidissement Cryo-Touch & Cryo-Air pour une séance quasi indolore.',
    equipment: 'Lumenis SPLENDOR X™ (USA)',
    duration: '15 à 45 min',
    recommendedSessions: '5 à 8 séances espacées de 4 à 6 semaines',
    benefits: [
      'Spot carré sans chevauchement ni zone oubliée',
      'Double longueur d\'onde simultanée (Alex + Nd:YAG)',
      'Compatible peaux claires, mates et foncées (Phototypes I à VI)',
      'Double système d\'aspiration de fumée et refroidissement cryo'
    ],
    zones: ['Visage complet', 'Aisselles', 'Maillot intégral', 'Demi-jambes / Jambes entières', 'Bras', 'Corps complet'],
    image: '/src/assets/images/splendor_laser_session_1789666936190.jpg',
    isPopular: true
  },
  {
    id: 'hydrafacial-md',
    category: 'visage',
    name: 'HydraFacial MD® Signature Glow',
    arabicName: 'علاج الهيدرافيشل الطبي لنضارة البشرة',
    shortDesc: 'Le soin médico-esthétique n°1 mondial qui nettoie en profondeur, exfolie, extrait les impuretés et hydrate intensément.',
    fullDesc: 'Une technologie brevetée Vortex-Fusion qui déloge le sébum et les comédons sans rougeurs, tout en infusant des sérums concentrés en acide hyaluronique, antioxydants et peptides botaniques pour un teint éclatant immédiat.',
    equipment: 'HydraFacial MD® Elite Tower',
    duration: '45 à 60 min',
    recommendedSessions: '1 séance par mois pour maintien du glow',
    benefits: [
      'Élimination immédiate des points noirs et comédons',
      'Teint illuminé dès la fin de la séance (Effet Glass Skin)',
      'Resserrement visible des pores dilatés',
      'Sans éviction sociale : reprise immédiate des activités'
    ],
    zones: ['Visage', 'Cou & Décolleté', 'Dos'],
    image: '/src/assets/images/clinic_facial_care_1789666948966.jpg',
    isPopular: true
  },
  {
    id: 'lifu-linearz',
    category: 'corps',
    name: 'Lifting Médical Sans Chirurgie LifU LinearZ™',
    arabicName: 'شد الوجه والرقبة بالموجات فوق الصوتية LifU LinearZ',
    shortDesc: 'Ultrasons focalisés haute intensité (HIFU nouvelle génération) pour raffermir l\'ovale du visage et retendre le cou.',
    fullDesc: 'Le LifU LinearZ cible la couche SMAS profonde (4.5mm et 3.0mm) afin de stimuler une néocollagenèse puissante. Redessine la jawline, estompe le double menton et rehausse les pommettes sans aucune incision ni aiguille.',
    equipment: 'LifU LinearZ HIFU (Technologie Linéaire)',
    duration: '45 à 60 min',
    recommendedSessions: '1 à 2 séances par an',
    benefits: [
      'Redéfinition de l\'angle mandibulaire (Jawline)',
      'Réduction visible du double menton',
      'Effet lift naturel progressif sur 3 mois',
      'Technologie Linear ultra-rapide et confortable'
    ],
    zones: ['Bas du visage & Ovale', 'Double menton', 'Cou & Décolleté', 'Paupières & Regard'],
    image: '/src/assets/images/tadjmeel_clinic_hero_1789666924355.jpg',
    isPopular: true
  },
  {
    id: 'injectables-acide-hyaluronique',
    category: 'injectable',
    name: 'Injections Acide Hyaluronique & Botox',
    arabicName: 'حقن الفيلر والبوتوكس التجميلية الطبيعية',
    shortDesc: 'Sublimation harmonieuse et naturelle des volumes : lèvres russes douces, comblement des cernes, rhinoplastie médicale.',
    fullDesc: 'Réalisé exclusivement par nos médecins diplômés en esthétique médicale. Utilisation de produits certifiés CE et FDA (Juvéderm, Teosyal, Restylane) pour préserver l\'expressivité et l\'harmonie de vos traits.',
    equipment: 'Micro-canules atraumatiques & Acides Hyaluroniques Premium',
    duration: '30 à 45 min',
    recommendedSessions: '1 séance avec retouche à 15 jours (tenue 9 à 18 mois)',
    benefits: [
      'Résultats sur mesure et subtils sans aspect figé',
      'Lèvres hydratées, ourlées et proportionnées',
      'Effacement des rides d\'expression (front, ride du lion, patte d\'oie)',
      'Protocole d\'asepsie rigoureux en salle médicale dédiée'
    ],
    zones: ['Lèvres (Russian Lips / Hydratation)', 'Cernes & Pommettes', 'Sillon nasogénien', 'Jawline & Menton', 'Front & Pattes d\'oie'],
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1000&q=80',
    isPopular: true
  },
  {
    id: 'carbon-peel-laser',
    category: 'visage',
    name: 'Hollywood Carbon Peel Laser & Éclat',
    arabicName: 'التقشير الكربوني بالليزر لتفتيح ونضارة البشرة',
    shortDesc: 'Masque au charbon actif activé par laser Q-Switched pour désincruster les pores, purifier et unifier le grain de peau.',
    fullDesc: 'Le carbone pénètre dans les pores puis est pulvérisé par le faisceau laser, emportant impuretés, cellules mortes et excès de sébum tout en stimulant la production de collagène.',
    duration: '30 à 40 min',
    recommendedSessions: '3 à 5 séances pour un résultat durable',
    benefits: [
      'Pores resserrés et teint lumineux immédiat',
      'Action antibactérienne idéale pour les peaux acnéiques',
      'Traitement non douloureux sans temps d\'arrêt'
    ],
    zones: ['Visage complet', 'Dos'],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'prp-meso-cheveux',
    category: 'cheveux',
    name: 'Mésothérapie & PRP Capillaire',
    arabicName: 'علاج تساقط الشعر بالميزوثيرابي والبلازما الغنية بالصفائح',
    shortDesc: 'Régénération du bulbe capillaire, ralentissement de la chute et densification de la chevelure par facteurs de croissance autologues.',
    fullDesc: 'Protocole médical de pointe combinant le plasma riche en plaquettes (PRP) préparé par centrifugation stérile et des cocktails vitaminiques de mésothérapie pour réactiver les follicules en dormance.',
    duration: '45 min',
    recommendedSessions: '4 à 6 séances à 3 semaines d\'intervalle',
    benefits: [
      'Freine drastiquement la chute de cheveux',
      'Stimule la repousse et augmente l\'épaisseur du cheveu',
      'Améliore la vascularisation du cuir chevelu'
    ],
    zones: ['Cuir chevelu (Tempes, Ligne frontale, Vertex)'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80'
  }
];

export const INSTAGRAM_STORIES: InstagramStoryItem[] = [
  {
    id: 'story-splendor-x',
    title: 'Splendor X Laser',
    highlightCategory: 'Épilation Laser',
    thumbnail: '/src/assets/images/splendor_laser_session_1789666936190.jpg',
    mediaUrl: '/src/assets/images/splendor_laser_session_1789666936190.jpg',
    caption: 'Démonstration en direct de la technologie BLEND X™ : Alexandrite & Nd:YAG combinés pour une séance sans douleur et une efficacité maximale.',
    date: 'Mis à jour cette semaine',
    likesCount: 1420,
    instagramUrl: 'https://www.instagram.com/tadjmeel_clinica/?hl=en'
  },
  {
    id: 'story-hydrafacial',
    title: 'Hydrafacial Glow',
    highlightCategory: 'Soins Visage',
    thumbnail: '/src/assets/images/clinic_facial_care_1789666948966.jpg',
    mediaUrl: '/src/assets/images/clinic_facial_care_1789666948966.jpg',
    caption: 'Les 3 étapes clés du protocole HydraFacial MD® chez Tadjmeel Clinica : Nettoyage + Peeling doux + Extraction Vortex + Infusion Peptides.',
    date: 'Story à la une',
    likesCount: 980,
    instagramUrl: 'https://www.instagram.com/tadjmeel_clinica/?hl=en'
  },
  {
    id: 'story-rejuvenation',
    title: 'Avant / Après',
    highlightCategory: 'Résultats Cliniques',
    thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    caption: 'Transformation spectaculaire de la texture de peau après 3 séances combinées Carbon Peel et soin rénovateur éclat.',
    date: 'Story à la une',
    likesCount: 2150,
    instagramUrl: 'https://www.instagram.com/stories/highlights/17968988105869327/?hl=fr'
  },
  {
    id: 'story-lifu',
    title: 'LifU LinearZ',
    highlightCategory: 'Lifting Sans Chirurgie',
    thumbnail: '/src/assets/images/tadjmeel_clinic_hero_1789666924355.jpg',
    mediaUrl: '/src/assets/images/tadjmeel_clinic_hero_1789666924355.jpg',
    caption: 'Redessiner la ligne de la mâchoire et défroisser le décolleté avec les ultrasons focalisés de dernière génération.',
    date: 'Story à la une',
    likesCount: 1120,
    instagramUrl: 'https://www.instagram.com/tadjmeel_clinica/?hl=en'
  },
  {
    id: 'story-avis',
    title: 'Avis & Témoignages',
    highlightCategory: 'Confiance Patientes',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    caption: '« Merci à toute l\'équipe de Tadjmeel pour l\'accueil chaleureux, la propreté irréprochable et les résultats incroyables du laser dès la 2ème séance ! »',
    date: 'Avis vérifiés',
    likesCount: 1680,
    instagramUrl: 'https://www.instagram.com/stories/highlights/17972714143555304/?hl=fr'
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'post-1',
    imageUrl: '/src/assets/images/splendor_laser_session_1789666936190.jpg',
    caption: 'Pourquoi le spot carré de notre laser SPLENDOR X™ change tout pour votre épilation ? Couverture 100% homogène, aucune bande oubliée et vitesse record. Réservez votre bilan laser.',
    tags: ['#SplendorX', '#LaserAlger', '#TadjmeelClinica', '#EpilationLaser', '#Birkhadem'],
    likes: 1845,
    comments: 132,
    url: 'https://www.instagram.com/tadjmeel_clinica/?hl=en',
    type: 'reel'
  },
  {
    id: 'post-2',
    imageUrl: '/src/assets/images/clinic_facial_care_1789666948966.jpg',
    caption: 'Un teint net et hydraté en 45 minutes chrono avec le protocole HydraFacial MD®. Adieu points noirs et teint terne ! Votre peau respire enfin la fraîcheur.',
    tags: ['#HydraFacial', '#GlowSkin', '#SoinsVisageAlger', '#Tadjmeel', '#BeauteAlgerie'],
    likes: 2130,
    comments: 98,
    url: 'https://www.instagram.com/tadjmeel_clinica/?hl=en',
    type: 'post'
  },
  {
    id: 'post-3',
    imageUrl: '/src/assets/images/tadjmeel_clinic_hero_1789666924355.jpg',
    caption: 'Bienvenue au sein de notre espace médicalisé à Birkhadem, pensé pour vous offrir confort, discrétion et excellence médicale dans un cadre raffiné et apaisant.',
    tags: ['#CliniqueAlger', '#EsthetiqueAlger', '#MedecineEsthetique', '#Birkhadem'],
    likes: 2790,
    comments: 164,
    url: 'https://www.instagram.com/tadjmeel_clinica/?hl=en',
    type: 'post'
  },
  {
    id: 'post-4',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    caption: 'Subtilité et harmonie : découvrez nos techniques d\'embellissement des lèvres par acide hyaluronique. Respect des proportions naturelles de votre visage.',
    tags: ['#InjectionsAlger', '#RussianLips', '#FillerLips', '#TadjmeelClinica'],
    likes: 1950,
    comments: 115,
    url: 'https://www.instagram.com/tadjmeel_clinica/?hl=en',
    type: 'reel'
  }
];

export const BEFORE_AFTER_CASES: BeforeAfterCase[] = [
  {
    id: 'case-laser',
    treatmentName: 'Épilation Laser SPLENDOR X™',
    area: 'Aisselles & Jambes (Phototype III/IV)',
    sessions: 4,
    description: 'Réduction de 90% de la pilosité, disparition des poils sous-cutanés et folliculites, peau adoucie et lissée.',
    beforeImage: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    disclaimer: 'Résultats cliniques observés. Le nombre de séances dépend de la nature du poil et du profil hormonal de chaque patient(e).'
  },
  {
    id: 'case-hydrafacial',
    treatmentName: 'HydraFacial MD® + Carbon Peel',
    area: 'Zone T & Pommettes',
    sessions: 2,
    description: 'Pores nettement resserrés, élimination des microkystes et comédons ouverts, régulation du sébum et éclat immédiat.',
    beforeImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    disclaimer: 'Résultat visible après protocole complet. Entretien mensuel conseillé.'
  },
  {
    id: 'case-lifu',
    treatmentName: 'LifU LinearZ™ Ovale du Visage',
    area: 'Jawline & Menton',
    sessions: 1,
    description: 'Remise en tension des tissus sous-cutanés, affinement du bas du visage et effet tenseur progressif sur 90 jours.',
    beforeImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    disclaimer: 'Action sur le collagène profond. Évaluation médicale préalable obligatoire.'
  }
];

export const DOCTORS: DoctorProfile[] = [
  {
    name: 'Dr. Inès B.',
    role: 'Médecin Coordinatrice & Esthétique Médicale',
    specialty: 'Diplômée en Médecine Morphologique & Anti-Âge, experte en injectables et lasers dermatologiques.',
    languages: ['Français', 'Arabe', 'Anglais'],
    experience: '12 ans d\'expérience',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Dr. Karim A.',
    role: 'Dermatologue Spécialiste',
    specialty: 'Pathologies cutanées, diagnostic des lésions pigmentaires et supervision des protocoles laser.',
    languages: ['Français', 'Arabe'],
    experience: '15 ans d\'expérience',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Sarah M.',
    role: 'Praticienne Laser & Dermo-Thérapeute',
    specialty: 'Spécialiste certifiée Splendor X™ et HydraFacial MD®, experte en paramétrage des phototypes méditerranéens.',
    languages: ['Français', 'Arabe'],
    experience: '8 ans d\'expérience',
    image: 'https://images.unsplash.com/photo-1594824813511-37d45c553d1a?auto=format&fit=crop&w=800&q=80'
  }
];

export const CLINIC_STATS = [
  { value: '5 000+', labelFr: 'Patients Satisfaits', labelAr: 'مريض راضٍ', labelEn: 'Satisfied Patients' },
  { value: '100%', labelFr: 'Équipements Médicaux Certifiés CE/FDA', labelAr: 'أجهزة طبية معتمدة', labelEn: 'FDA/CE Certified Tech' },
  { value: '3', labelFr: 'Pôles Spécialisés (Laser, Visage, Cheveux)', labelAr: 'أقطاب علاجية متخصصة', labelEn: 'Specialized Centers' },
  { value: '98%', labelFr: 'Recommandation Patientes', labelAr: 'نسبة رضا المرضى', labelEn: 'Patient Satisfaction' }
];

export const FAQS = [
  {
    qFr: 'L\'épilation au laser Splendor X est-elle douloureuse ?',
    qAr: 'هل إزالة الشعر بليزر Splendor X مؤلمة؟',
    qEn: 'Is laser hair removal with Splendor X painful?',
    aFr: 'Grâce au double système de refroidissement intégré (Cryo-Air pulsé en continu et embout réfrigéré Cryo-Touch), la sensation est grandement atténuée par rapport aux anciens lasers traditionnels. La plupart des patientes décrivent un simple picotement très supportable.',
    aAr: 'بفضل نظام التبريد المزدوج المتقدم (تبريد الهواء المستمر وتقنية Cryo-Touch)، يتم تقليل الإحساس بالحرارة بشكل كبير مقارنة بأجهزة الليزر القديمة، لتكون الجلسة مريحة وسريعة جداً.',
    aEn: 'Thanks to the dual cooling system (Cryo-Air and refrigerated tip), discomfort is dramatically reduced compared to older lasers. Most patients feel only a mild sensation with maximum comfort.'
  },
  {
    qFr: 'Le laser convient-il aux peaux bronzées ou mates algériennes ?',
    qAr: 'هل الليزر مناسب للبشرة الحنطية والسمراء؟',
    qEn: 'Is the laser safe for tanned or darker Algerian skin tones?',
    aFr: 'Oui, absolument. Le Splendor X™ dispose de la longueur d\'onde Nd:YAG (1064nm) qui pénètre en profondeur sans brûler la mélanine de surface. Il est parfaitement sécuritaire pour tous les phototypes méditerranéens et foncés (I à VI).',
    aAr: 'نعم بالتأكيد. جهاز Splendor X يدمج تقنية Nd:YAG الآمنة جداً على البشرة الحنطية والسمراء والداكنة دون خطر الحروق أو التصبغات.',
    aEn: 'Yes! Splendor X features dual wavelengths including Nd:YAG 1064nm, which safely treats Mediterranean, olive, and darker skin tones without burning surface melanin.'
  },
  {
    qFr: 'Comment préparer sa séance d\'épilation laser ?',
    qAr: 'كيف أستعد لجلسة إزالة الشعر بالليزر؟',
    qEn: 'How should I prepare for my laser hair removal session?',
    aFr: 'Il faut raser la zone au rasoir classique 24 heures avant la séance (ne pas épiler à la cire ni à la pince pendant les 4 semaines précédentes). Évitez l\'exposition solaire directe 7 jours avant et prévenez l\'équipe en cas de prise de médicaments photosensibilisants.',
    aAr: 'يجب حلاقة المنطقة بالشفرة قبل 24 ساعة من الجلسة (تجنب الشمع أو الحلاوة لمدة شهر قبلها)، وتجنب التعرض المباشر للشمس.',
    aEn: 'Shave the treatment area with a standard razor 24 hours prior (avoid waxing or plucking for 4 weeks before). Avoid excessive sun exposure prior to treatment.'
  },
  {
    qFr: 'Quels sont les avantages de l\'HydraFacial par rapport à un soin classique ?',
    qAr: 'ما الذي يميز الهيدرافيشل عن تنظيف البشرة التقليدي؟',
    qEn: 'What are the advantages of HydraFacial over classic facials?',
    aFr: 'Contrairement au nettoyage manuel avec tire-comédons qui traumatise les pores, HydraFacial utilise une aspiration vortex sous vide indolore qui extrait le sébum tout en injectant des cocktails d\'acide hyaluronique et peptides. Aucun rougissement marqué.',
    aAr: 'الهيدرافيشل يعتمد تقنية الشفط الدوامي غير المؤلم لإزالة الشوائب والدهون مع حقن سيرومات مغذية ومضادات أكسدة، مما يعطي نضارة فورية دون أي احمرار أو ألم.',
    aEn: 'HydraFacial uses patented vortex suction to extract impurities painlessly while infusing medical-grade antioxidants and hyaluronic acid, leaving skin radiant with zero downtime.'
  }
];

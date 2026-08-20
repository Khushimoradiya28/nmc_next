export const activitiesData = [
  // ── BY CLUB ──
  {
    id: "shakespeare-day",
    categoryId: "club",
    subCategoryId: "nucleus-club",
    clubName: "Nucleus Club [B.A. English]",
    title: "B.A. Shakespeare Day",
    shortDescription: "Celebrate the works and legacy of William Shakespeare with poetry recitations and drama play enactments.",
    fullDescription: "The Nucleus Club organized Shakespeare Day to celebrate standard English classics. Students participated in live enactments of Macbeth and Hamlet, followed by a sonnet writing contest judged by literature specialists.",
    date: "2026-04-23",
    time: "10:00 AM - 01:00 PM",
    location: "College Auditorium",
    thumbnail: "/assets/home/hero/1.jpg",
    gallery: ["/assets/home/hero/1.jpg", "/assets/home/hero/2.jpg"],
    status: "past",
    coordinator: "Prof. Anjali Sharma",
    venue: "Main Campus Auditorium"
  },
  {
    id: "creative-writing-workshop",
    categoryId: "club",
    subCategoryId: "creative-club",
    clubName: "Creative Club [M.Com]",
    title: "Creative Content Writing Seminar",
    shortDescription: "Master the art of copywriting, blogging, and creative academic storytelling.",
    fullDescription: "An interactive session mapping character development, plot structure, and professional web copywriting. Designed for M.Com and senior business students looking to enter digital marketing.",
    date: "2026-08-15",
    time: "11:00 AM - 02:00 PM",
    location: "Seminar Hall A",
    thumbnail: "/assets/home/hero/2.jpg",
    gallery: ["/assets/home/hero/2.jpg", "/assets/home/hero/3.jpg"],
    status: "past",
    coordinator: "Dr. Kirti Mehta",
    venue: "Block B Seminar Hall"
  },
  {
    id: "insurance-role-play",
    categoryId: "club",
    subCategoryId: "expert-club",
    clubName: "Expert Club [B.Com]",
    title: "B.Com General Insurance Role Play",
    shortDescription: "Role play simulation covering claims adjusting, client counseling, and agent communications.",
    fullDescription: "A hands-on workshop preparing banking and commerce students for client-facing corporate roles in insurance. Teams enacted real-world policy scenarios, claims audits, and risk assessment audits.",
    date: "2026-09-10",
    time: "09:30 AM - 12:30 PM",
    location: "Commerce Lab",
    thumbnail: "/assets/home/hero/3.jpg",
    gallery: ["/assets/home/hero/3.jpg", "/assets/home/hero/4.jpg"],
    status: "upcoming",
    coordinator: "Prof. Rajesh Patel",
    venue: "Central Commerce Lab"
  },
  {
    id: "photoshop-bootcamp",
    categoryId: "club",
    subCategoryId: "it-techno-spark",
    clubName: "IT Techno Spark",
    title: "Graphic Design & Photoshop Workshop",
    shortDescription: "Interactive bootcamp detailing Photoshop layer management, vector masks, and creative branding.",
    fullDescription: "The IT Techno Spark club organized a hands-on graphic design workshop. Students worked on live UI mocks, custom branding flyers, and digital posters, learning industry-grade vector techniques.",
    date: "2026-10-12",
    time: "09:00 AM - 04:00 PM",
    location: "Computer Lab 3",
    thumbnail: "/assets/home/hero/4.jpg",
    gallery: ["/assets/home/hero/4.jpg", "/assets/home/hero/5.jpg"],
    status: "upcoming",
    coordinator: "Dr. Hiren Jadav",
    venue: "Main IT Wing, Lab 3"
  },

  // ── BY DEPARTMENT ──
  {
    id: "bca-coding-contest",
    categoryId: "department",
    subCategoryId: "bca",
    clubName: "B.C.A. Department",
    title: "Debugging & Coding Speedrun",
    shortDescription: "Fast-paced logic resolution and syntax debugging challenge for computing students.",
    fullDescription: "B.C.A students competed in multiple stages of time-constrained debugging challenges, fixing logic errors in C++, Java, and Python scripts within the sandbox environment.",
    date: "2026-09-18",
    time: "10:00 AM - 01:00 PM",
    location: "IT Center",
    thumbnail: "/assets/home/hero/5.jpg",
    gallery: ["/assets/home/hero/5.jpg", "/assets/home/hero/1.jpg"],
    status: "upcoming",
    coordinator: "Prof. Nitin Vaja",
    venue: "Lab 2, First Floor"
  },

  // ── ORIENTATION PROGRAMS ──
  {
    id: "miracle-milestone",
    categoryId: "orientation",
    subCategoryId: "miracle-to-milestone",
    clubName: "Orientation Program",
    title: "Miracle to Milestone: First-Year Induction",
    shortDescription: "The premier induction program welcoming first-year students to the academic term.",
    fullDescription: "A comprehensive motivational and academic program helping new admissions bridge the transition from school to higher education milestones.",
    date: "2026-06-20",
    time: "08:30 AM - 02:00 PM",
    location: "College Main Ground",
    thumbnail: "/assets/home/hero/1.jpg",
    gallery: ["/assets/home/hero/1.jpg"],
    status: "past",
    coordinator: "Dr. Neha Shah",
    venue: "Main Campus Auditorium"
  },

  // ── SPORTS & FITNESS ──
  {
    id: "annual-sports-meet",
    categoryId: "sports",
    subCategoryId: "annual-sports-meet",
    clubName: "Sports & Fitness",
    title: "Annual Sports Meet 2026",
    shortDescription: "Celebrate athletics excellence with track, field, and sprint challenges.",
    fullDescription: "A college-wide multi-event tournament covering standard sprint races, long jump, shot put, and traditional relays. Medals and trophies awarded to individual stream champions.",
    date: "2026-12-15",
    time: "08:00 AM - 05:00 PM",
    location: "Sports Stadium",
    thumbnail: "/assets/home/hero/3.jpg",
    gallery: ["/assets/home/hero/3.jpg", "/assets/home/hero/2.jpg"],
    status: "upcoming",
    coordinator: "Coach Manoj Gohil",
    venue: "Bhavnagar Athletic Arena"
  },

  // ── NSS & SOCIAL IMPACT ──
  {
    id: "nss-blood-donation",
    categoryId: "nss",
    subCategoryId: "blood-donation-drive",
    clubName: "NSS & Social Impact",
    title: "NSS Blood Donation Drive",
    shortDescription: "Support local health centers by donating blood. Organized in association with Red Cross.",
    fullDescription: "NSS volunteers led a community blood donation drive. Over 200 bags of blood were collected and sent to local government hospitals, supporting critical operations.",
    date: "2026-09-24",
    time: "09:00 AM - 03:00 PM",
    location: "College Assembly Hall",
    thumbnail: "/assets/home/hero/4.jpg",
    gallery: ["/assets/home/hero/4.jpg"],
    status: "upcoming",
    coordinator: "Prof. Dilip Savaliya",
    venue: "Auditorium Lounge"
  }
];

export const getEventsByCategory = (categoryId) => {
  return activitiesData.filter(event => event.categoryId === categoryId);
};

export const getEventsBySubCategory = (categoryId, subCategoryId) => {
  const safeSubId = subCategoryId ? subCategoryId.toLowerCase().replace(/%20| /g, '-') : '';
  return activitiesData.filter(event => event.categoryId === categoryId && event.subCategoryId === safeSubId);
};

export const getEventById = (id) => {
  return activitiesData.find(event => event.id === id);
};

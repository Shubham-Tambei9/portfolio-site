export const EDUCATION_ITEMS = [
  {
    institution: "Vishwakarma Institute of Technology, Pune",
    degree: "Bachelor of Technology (B.Tech)",
    field: "Information Technology",
    year: "2022 — 2026",
    status: "Final Year Graduate (2026)",
    icon: 'GraduationCap',
    glowClass: "btech-glow"
  },
  {
    institution: "Shramik Junior College, Sangamner",
    degree: "Higher Secondary Education (HSC)",
    field: "Science",
    year: "2020 — 2022",
    icon: 'BookOpen',
    glowClass: "hsc-glow"
  },
  {
    institution: "B.G.P Sahyadri Vidyalaya, Sangamner",
    degree: "Secondary School Certificate (SSC)",
    field: "General Education",
    year: "2017 — 2020",
    icon: 'School',
    glowClass: "ssc-glow"
  }
];

export const EDUCATION = {
  coursework: [
    "Data Structures & Algorithms",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks",
    "Machine Learning",
    "Data Science",
    "Artificial Intelligence",
    "Software Engineering",
    "Web Technologies",
    "Internet of Things (IoT)",
  ],
};

export const ACHIEVEMENTS = [
  "Successfully completed B.Tech Information Technology program requirements.",
  "Developed multiple projects in AI/ML, IoT, Web Development, and Software Engineering.",
  "Participated in UI/UX design and software development projects.",
];


/* The same ten courses, grouped so the block is scannable instead of a flat wall
   of pills. Grouping is presentational — no course is added or renamed. */
export const COURSEWORK_GROUPS = [
  {
    label: 'Core computer science',
    items: [
      'Data Structures & Algorithms',
      'Operating Systems',
      'Computer Networks',
      'Software Engineering',
    ],
  },
  {
    label: 'Data & intelligence',
    items: [
      'Machine Learning',
      'Artificial Intelligence',
      'Data Science',
      'Database Management Systems',
    ],
  },
  {
    label: 'Applied systems',
    items: ['Web Technologies', 'Internet of Things (IoT)'],
  },
];

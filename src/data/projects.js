/* Ported verbatim from the previous portfolio build, including the link audit:
   repos that 404'd were set to null rather than shipped as dead "Source" buttons,
   and three "Website" links that only pointed at the GitHub profile were removed. */
export const PROJECTS = [
  {
    n: "01",
    name: "Medical Image Analysis using Deep Learning",
    domain: "AI / ML",
    description:
      "Deep learning-based biomedical image analysis system for medical image classification and prediction.",
    stack: ["Python", "TensorFlow/Keras", "OpenCV", "NumPy", "Pandas"],
    github: null,
    website: null,
    category: "mldl",
    image: '/assets/medical_analysis.png',
    period: "Jan 2025 - May 2025"
  },
  {
    n: "02",
    name: "Compare It — Price Comparison Website",
    domain: "Web / Data",
    description:
      "Web scraping platform that compares product prices across multiple e-commerce websites.",
    stack: ["Python", "Django", "BeautifulSoup", "Requests", "MongoDB", "HTML/CSS"],
    github: null,
    website: null,
    category: "web",
    image: '/assets/compare_it.png',
    period: "Mar 2024 - Jun 2024"
  },
  {
    n: "03",
    name: "Smart Cup Coaster Using Arduino & IoT",
    domain: "IoT / Hardware",
    description:
      "IoT-enabled smart coaster that monitors beverage temperature and sends data through Wi-Fi.",
    stack: ["Arduino Uno", "NodeMCU (ESP8266)", "MLX90614", "Blynk", "Arduino IDE"],
    github: null,
    website: null,
    category: "web",
    image: '/assets/smart_coaster.png',
    period: "Sep 2024 - Dec 2024"
  },
  {
    n: "04",
    name: "Hospital Path Finder",
    domain: "Algorithms",
    description:
      "Smart hospital recommendation system using graph algorithms to identify the nearest hospital.",
    stack: ["Java", "Dijkstra's Algorithm", "Data Structures", "Swing"],
    github: null,
    website: null,
    category: "data",
    placeholderIcon: 'Cpu',
    period: "Oct 2023 - Nov 2023"
  },
  {
    n: "05",
    name: "Notes Sharing Platform",
    domain: "Web",
    description:
      "Web application allowing students to upload, manage, and download academic notes.",
    stack: ["Python", "Flask", "SQLAlchemy", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/Shubham-Tambei9/Profound-Insight-Notes-Sharing-Platform",
    website: null,
    category: "web",
    placeholderIcon: 'Code2',
    period: "Feb 2024 - Apr 2024"
  },
  {
    n: "06",
    name: "Tourism Management System",
    domain: "Desktop App",
    description:
      "Desktop application for tourism management with booking and destination management features.",
    stack: ["Java", "Swing", "MySQL", "JDBC"],
    github: null,
    website: null,
    category: "web",
    placeholderIcon: 'Database',
    period: "Aug 2023 - Oct 2023"
  },
  {
    n: "07",
    name: "Central Bank Mobile App — UI/UX Redesign",
    domain: "Design",
    description:
      "Modern UI/UX redesign focused on improving usability and accessibility of mobile banking.",
    stack: ["Figma", "UI/UX Design", "Prototyping"],
    github: null,
    isDesign: true,
    website: "https://www.figma.com/@Shubham_Techi9",
    category: "design",
    image: '/assets/central_bank.png',
    period: "Dec 2024 - Jan 2025"
  },
  {
    n: "08",
    name: "E-commerce Platform",
    domain: "Web / Full-Stack",
    description:
      "A full-stack e-commerce platform built with modern technologies for a seamless online shopping experience.",
    stack: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB"],
    github: null,
    website: null,
    category: "web",
    image: '/assets/ecommerce_platform.png',
    period: "Feb 2025 - Present"
  },
  {
    n: "09",
    name: "Heart Disease Prediction System",
    domain: "ML / Healthcare",
    description:
      "A machine learning system that predicts the likelihood of heart disease using patient clinical data.",
    stack: ["Python", "Scikit-Learn", "Pandas", "Matplotlib", "Flask"],
    github: null,
    website: null,
    category: "mldl",
    placeholderIcon: 'Brain',
    period: "May 2025 - Jun 2025"
  },
  {
    n: "10",
    name: "Crypto Dashboard UI/UX Design",
    domain: "UI/UX Design",
    description:
      "A modern and elegant Cryptocurrency Dashboard UI/UX designed for tracking crypto assets, analytics, and exchanges.",
    stack: ["Figma", "UI/UX Design", "Prototyping"],
    github: "https://github.com/Shubham-Tambei9/Cryptodashboard-UI",
    website: null,
    isDesign: true,
    category: "design",
    image: "https://github.com/user-attachments/assets/9d585302-b802-4fc0-be53-926c489b9c86",
    period: "Jan 2025"
  },
  {
    n: "11",
    name: "Healthcare Dashboard UI/UX Design",
    domain: "UI/UX Design",
    description:
      "A modern and clean Healthcare Management Dashboard UI/UX designed for hospitals and clinics.",
    stack: ["Figma", "UI/UX Design", "Prototyping"],
    github: "https://github.com/Shubham-Tambei9/HealthCareDashboard-UI-Design",
    website: null,
    isDesign: true,
    category: "design",
    image: "https://github.com/user-attachments/assets/2d668496-0b1e-4ee9-b428-dc400b9c8d47",
    period: "Feb 2025"
  },
  {
    n: "12",
    name: "Trainer Portfolio Dashboard UI",
    domain: "UI/UX Design",
    description:
      "A modern, minimal, and user-friendly Trainer Portfolio Dashboard UI designed for online learning platforms.",
    stack: ["Figma", "UI/UX Design", "Prototyping"],
    github: "https://github.com/Shubham-Tambei9/Modern-Classic-Trainee-Porfolio-UI-design",
    website: null,
    isDesign: true,
    category: "design",
    image: "https://github.com/user-attachments/assets/048110a8-ad1e-42b3-be71-d576676c21d3",
    period: "Mar 2025"
  },
  {
    n: "13",
    name: "Thumblify — AI Thumbnail Generator",
    domain: "Web / AI",
    description:
      "A full-stack AI-powered thumbnail generator built with the MERN stack and Google Gemini API, allowing users to create stunning YouTube thumbnails from text prompts.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Google Gemini API"],
    github: "https://github.com/Shubham-Tambei9/Thumblify---Thumbnail-Generation-Website",
    website: null,
    category: "web",
    image: "https://github.com/user-attachments/assets/fdf1ee68-ee04-4858-b9d2-c2436e83569f",
    period: "Feb 2025"
  },
  {
    n: "14",
    name: "House Rent Management System",
    domain: "Web / Full-Stack",
    description:
      "A full-stack MERN web application for exploring rental properties, posting listings, and managing bookings with role-based access.",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    github: "https://github.com/Shubham-Tambei9/HouseRent",
    website: null,
    category: "web",
    image: "https://github.com/user-attachments/assets/96c8c130-6d1f-4cdb-9587-bbc53f3a221e",
    period: "Nov 2024"
  },
  {
    n: "15",
    name: "API HawkEye — AI Anomaly Detector",
    domain: "Web / Security",
    description:
      "An AI-powered monitoring and anomaly detection system for multi-API distributed software platforms, detecting response time spikes and error rate anomalies.",
    stack: ["Python", "ELK Stack", "Kafka", "Docker", "OpenTelemetry"],
    github: "https://github.com/Shubham-Tambei9/API-HawkEye---API-Call-Analysis-and-Alert-System-using-AI",
    website: null,
    category: "web",
    placeholderIcon: 'Brain',
    period: "Dec 2024"
  },
  {
    n: "16",
    name: "Hospital Analysis Dashboard — Papollo Healthcare",
    domain: "Data Analysis / Healthcare",
    description:
      "A detailed Power BI analytical dashboard tracking hospital admissions, diagnosis trends, billing patterns, and staff feedback to optimize operations.",
    stack: ["Power BI", "Excel", "Data Visualization", "Healthcare Analytics"],
    github: "https://github.com/Shubham-Tambei9/HealthCare_DataAnalysis_Visualization",
    website: null,
    category: "data",
    image: "https://github.com/user-attachments/assets/50b9772b-ed70-47fb-b54c-14ecb0943dc2",
    period: "Aug 2024"
  },
  {
    n: "17",
    name: "Ola Ride Data Analysis Project",
    domain: "Data Analysis",
    description:
      "An analytical study of Ola Cabs' booking data, cancellation rates, customer trends, and payment preferences using SQL queries and Power BI visualizations.",
    stack: ["SQL", "Power BI", "Data Analysis", "Data Visualization", "Excel"],
    github: "https://github.com/Shubham-Tambei9/Ride_hailing_Companies_Data_Analysis_Visualization",
    website: null,
    category: "data",
    image: "https://github.com/user-attachments/assets/4359d768-8277-4b13-b3c3-a2d93cc3d143",
    period: "Jul 2024"
  },
  {
    n: "18",
    name: "Telecom Churn Prediction",
    domain: "Data Analysis / ML",
    description:
      "A predictive model for customer churn in the telecom industry using Random Forest and Decision Trees in R, featuring SMOTE class balancing and entropy analysis.",
    stack: ["R Language", "Random Forest", "Decision Tree", "ggplot2", "Machine Learning"],
    github: "https://github.com/Shubham-Tambei9/Teleco-Churn-Prediction",
    website: null,
    category: "data",
    image: '/assets/telecom_churn_analytics.png',
    period: "Oct 2024"
  },
  {
    n: "19",
    name: "Shopping Trends Analysis",
    domain: "Data Analysis / EDA",
    description:
      "Exploratory Data Analysis (EDA) on customer shopping trends to identify purchase behavior, demographics, and actionable retail recommendations using Python libraries.",
    stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    github: "https://github.com/Shubham-Tambei9/Identifying-Shopping-Trends-Using-Data-Analysis",
    website: null,
    category: "data",
    image: '/assets/shopping_trends_analysis.png',
    period: "Sep 2024"
  },
  {
    n: "20",
    name: "API Monitor — Enterprise Management & System Analytics Dashboard UI/UX",
    domain: "UI/UX Design / System Monitoring",
    description:
      "A high-fidelity Enterprise API Monitoring & System Analytics Dashboard UI/UX design. Features real-time log analysis, latency heatmaps, response time distribution, AI-driven anomaly predictions, multi-cloud environment benchmarking, and configurable alert thresholds.",
    stack: ["Figma", "UI/UX Design", "Design Systems", "Dashboard Architecture", "Prototyping"],
    github: "https://github.com/Shubham-Tambei9/API-Monitor-UI-UX-Design",
    website: null,
    isDesign: true,
    category: "design",
    image: '/assets/api_monitor_ui.png',
    period: "Mar 2025"
  },
  {
    n: "21",
    name: "KRISHI RAKSHA — Crop Disease Detection & Advisory App UI/UX",
    domain: "UI/UX Design / Agritech",
    description:
      "A mobile app UI/UX design built for Smart India Hackathon (SIH). Features AI-powered crop disease scanning, voice/text/multilingual diagnosis, Krishi AI chatbot, treatment recommendations, community disease reports, and weather warning dashboards.",
    stack: ["Figma", "UI/UX Design", "Mobile App Design", "Design Systems", "Prototyping"],
    github: "https://github.com/Shubham-Tambei9/Krishi-Raksha-Crop-Disease-Detection-UI-UX",
    website: null,
    isDesign: true,
    category: "design",
    placeholderIcon: 'Brain',
    period: "Feb 2025"
  }
];

export const CATEGORY_META = {
  mldl: { label: 'ML & DL', color: '#a855f7' },
  web: { label: 'Web Development', color: '#3b82f6' },
  data: { label: 'Data Analysis', color: '#eab308' },
  design: { label: 'UI/UX Design', color: '#f472b6' },
};

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'mldl', label: 'ML & DL' },
  { id: 'web', label: 'Web' },
  { id: 'data', label: 'Data' },
  { id: 'design', label: 'Design' },
];

export const getProject = (n) => PROJECTS.find((p) => p.n === n);

export const DATA = {
  // TODO: Replace this URL with the path to your actual uploaded photo.
  // Since I cannot directly access the attached image file's URL, I've used a placeholder.
  // You can place your image in the 'public' folder (e.g., 'public/profile.jpg') and change this to '/profile.jpg'
  image: '/image.jpg',
  
  name: "SRINIVASAN.A",
  title: "Software Engineer & Innovator",
  github: "https://github.com/SRINIVASANashok",
  linkedin: "https://linkedin.com/in/srinivasan-a-412283312/",
  resume: "/Srinivasan_Resume.pdf",
  
  bio: "I am a passionate software engineer with a strong foundation in building scalable applications. I thrive in dynamic environments and love solving complex problems with elegant solutions. My personal brand is built on continuous learning, innovation, and a relentless drive to create impactful technology that makes a difference.",
  
  internships: [
    {
      role: "Web Development Intern",
      company: "SAI INFOTECH",
      duration: "May 2024",
      description: "Completed my internship at SAI INFOTECH over a period of 14 days focusing on full-stack Web Development domain.",
      image: "/sai-infotech.jpeg"
    },
    {
      role: "Summer Intern",
      company: "EDUFYI X IBM",
      duration: "May 2026",
      description: "Selected to pursue Summer Internship with EDUFYI X IBM in May 2026, focusing on enterprise software and cloud applications.",
      image: "/offer-letter-edufyi.jpg"
    },
    {
      role: "Data Analytics Intern",
      company: "UNLOX ACADEMY",
      duration: "August 2026",
      description: "Officially confirmed and enrolled into the Data Analytics program at Unlox Academy, working on live projects, AI-powered Smart Labs, and data modeling.",
      image: "/unlox-intern-confirmation.jpg"
    },
    {
      role: "Campus Ambassador",
      company: "UNLOX ACADEMY",
      duration: "August 2026 - Present",
      description: "Appointed as Campus Ambassador for Unlox Academy representing the brand, leading student community outreach, and driving the Job Bridge Program.",
      image: "/unlox-campus-ambassador.jpg"
    }
  ],

  documents: [
    {
      title: "OpenEnv AI Hackathon Grand Finale",
      issuer: "Meta × Hugging Face × Scaler",
      date: "Bangalore Finale | April 2026",
      type: "Hackathon Finalist Award",
      image: "/openenv-finalist.jpg",
      description: "Selected as Top 800 Finalist out of 31,000+ teams nationwide for India's Biggest AI Hackathon (Team D3CDRS)."
    },
    {
      title: "Data Analytics Internship Confirmation",
      issuer: "UNLOX ACADEMY (DPIIT Startup India)",
      date: "August 2026",
      type: "Official Enrollment Letter",
      image: "/unlox-intern-confirmation.jpg",
      description: "Official shortlist and confirmation letter for the Data Analytics program, smart labs, and Blu AI mentor access."
    },
    {
      title: "Campus Ambassador Appointment",
      issuer: "UNLOX ACADEMY",
      date: "August 2026",
      type: "Official Appointment Letter",
      image: "/unlox-campus-ambassador.jpg",
      description: "Appointment letter as official Campus Ambassador for brand representation, university outreach, and Job Bridge program."
    },
    {
      title: "Summer Internship Offer Letter",
      issuer: "EDUFYI X IBM",
      date: "May 2026",
      type: "Offer Letter",
      image: "/offer-letter-edufyi.jpg",
      description: "Official summer internship offer letter from EDUFYI in collaboration with IBM."
    },
    {
      title: "Web Development Internship Certificate",
      issuer: "SAI INFOTECH",
      date: "May 2024",
      type: "Completion Certificate",
      image: "/sai-infotech.jpeg",
      description: "Internship completion certificate for full-stack web development domain at SAI Infotech."
    }
  ],
  
  hackathons: {
    finalists: [
      {
        name: "OPENENV HACKATHON",
        organizers: "Meta × Hugging Face × Scaler",
        award: "Top 800 Finalist (Out of 31,000+ Teams)",
        project: "Team D3CDRS • India's Biggest AI Hackathon",
        description: "Selected for the Grand Finale in Bangalore among the top 800 finalists out of 31,000+ registered teams nationwide.",
        image: "/openenv-finalist.jpg"
      }
    ],
    won: [
      {
        name: "MEDAITHON",
        award: "6th Place Winner - ₹5,000 Cash Prize",
        project: "AI Healthcare Solution",
        image: "/medi-flow.jpg"
      }
    ],
    participated: [
      "NOOB HACKFEST",
      "BYTE-BEAT",
      "RGF"
    ]
  },
  
  projects: [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard.",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      image: "/e-commerce.jpg"
    },
    {
      title: "APEX HQ",
      description: "AI-Driven Centralized Smart Surveillance & Emergency Alert System that connects thousands of CCTV cameras to detect incidents in real-time and automatically alert authorities.",
      tech: ["AI/ML", "Computer Vision", "Real-time Analytics", "IoT"],
      image: "/urban-sentinel.jpg"
    },
    {
      title: "MEDI-FLOW",
      description: "An intelligent hospital management system that streamlines patient journeys from entry to exit, enhanced with AI-powered assistance to improve efficiency and care quality.",
      tech: ["AI", "Healthcare Systems", "Workflow Automation", "React"],
      image: "/medi-flow.jpg"
    },
    {
      title: "Portfolio Website",
      description: "A stunning 3D interactive portfolio website built with modern web technologies to showcase skills and experience.",
      tech: ["React", "Framer Motion", "Tailwind CSS"],
      image: "/portfolio.jpg"
    }
  ],
  
  skills: [
    { name: "Frontend Development (React, Vue)", level: 95 },
    { name: "Backend Development (Node.js, Python)", level: 85 },
    { name: "UI/UX Design & Prototyping", level: 80 },
    { name: "Cloud Architecture (AWS, GCP)", level: 75 },
    { name: "Database Management (SQL, NoSQL)", level: 85 },
  ],
  
  characteristics: [
    { title: "Problem Solver", description: "Approaches challenges with a logical, analytical, and creative mindset." },
    { title: "Team Player", description: "Collaborates effectively, communicates clearly, and elevates the entire team." },
    { title: "Adaptable", description: "Quick to learn new technologies and thrive in rapidly changing environments." },
    { title: "Detail-Oriented", description: "Ensures high quality, precision, and polish in every line of code written." }
  ]
};

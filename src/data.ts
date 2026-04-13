export const DATA = {
  // TODO: Replace this URL with the path to your actual uploaded photo.
  // Since I cannot directly access the attached image file's URL, I've used a placeholder.
  // You can place your image in the 'public' folder (e.g., 'public/profile.jpg') and change this to '/profile.jpg'
  image: '/image.jpg',
  
  name: "SRINIVASAN.A",
  title: "Software Engineer & Innovator",
  github: "https://github.com/madarasrini",
  linkedin: "https://linkedin.com/in/srinivasan-a-412283312/",
  resume: "/Srinivasan_Resume.pdf",
  
  bio: "I am a passionate software engineer with a strong foundation in building scalable applications. I thrive in dynamic environments and love solving complex problems with elegant solutions. My personal brand is built on continuous learning, innovation, and a relentless drive to create impactful technology that makes a difference.",
  
  internships: [
    {
      role: "Web Development Intern",
      company: "SAI INFOTECH",
      duration: "May 2024",
      description: "Completed my intern at SAI INFOTECH with a period of time 14 days by working on WEB DEVLOPMENT as Domain.",
      image: "/SAI INFOTECH.jpeg"
    },
    {
      role: "Summer Intern",
      company: "EDUFYI X IBM",
      duration: "May 2026",
      description: "Going to pursue my intern with EDUFYI X IBM Summer Internship in May 2026.",
      image: "/offer letter for edufyi.jpg"
    }
  ],
  
  hackathons: {
    participated: [
      "NOOB HACKFEST",
      "BYTE-BEAT",
      "RGF"
    ],
    won: [
      {
        name: "MEDAITHON",
        award: "6th Place Winner - ₹5,000 Cash Prize",
        project: "Hackathon Project"
      }
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

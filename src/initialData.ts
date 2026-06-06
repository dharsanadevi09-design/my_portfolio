import { PortfolioData } from "./types";

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "Aravind Kumar",
    title: "Full Stack Engineer & Web Designer",
    headline: "Building high-performance web applications with exceptional user interfaces.",
    bio: "I am a passionate software engineer specializing in building modern web applications. With expertise in React, TypeScript, and Node.js, I bridge the gap between polished design and clean, scalable code. I enjoy turning complex problems into elegant, simple solutions.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    resumeUrl: "https://example.com/resume.pdf",
    email: "aravind.kumar@example.com",
    location: "Chennai, Tamil Nadu, India",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://twitter.com",
    consultationRate: 1500,
    consultationCurrency: "₹",
    upiId: "aravind@okaxis",
    heroImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
    animeTheme: "matrix",
    qrImageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=aravind@okaxis%26pn=Aravind%20Kumar%26am=1500%26cu=INR"

  },
  skills: [
    {
      id: "cat-1",
      name: "Frontend Development",
      items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux Toolkit", "Framer Motion"]
    },
    {
      id: "cat-2",
      name: "Backend & Database",
      items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL"]
    },
    {
      id: "cat-3",
      name: "Development Tools",
      items: ["Git & GitHub", "Docker", "Vite", "ESLint", "Postman", "CI/CD"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Clarity - Project Management Tool",
      category: "SaaS Platform",
      description: "A collaborative project management application with real-time kanban boards, task lists, team workspaces, and detailed timeline charts for tracking progress.",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Express", "MongoDB"],
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
      featured: true
    },
    {
      id: "proj-2",
      title: "Apex - Multi-currency E-Commerce",
      category: "E-Commerce",
      description: "A high-conversion e-commerce platform featuring instantaneous search filters, sliding cart previews, customized checkout, and local billing integrations.",
      techStack: ["React", "Next.js", "Stripe API", "Tailwind CSS", "PostgreSQL"],
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      featured: true
    },
    {
      id: "proj-3",
      title: "Aura - Ambient Noise Generator",
      category: "Productivity App",
      description: "A minimalism productivity workspace that mixes natural soundscapes (rain, waves, wind, campfire) to help developers stay in focus mode.",
      techStack: ["React", "Tailwind CSS", "Web Audio API", "Framer Motion"],
      demoUrl: "https://example.com",
      githubUrl: "https://github.com",
      imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop",
      featured: false
    }
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Senior Full Stack Dev",
      company: "Cognizant Solutions",
      location: "Chennai, TN",
      duration: "2024 - Present",
      description: "Leading a feature team of front-end and back-end engineers to rebuild client portals. Improved web accessibility indices by 40% and page load speeds by 25% using code splitting and optimization strategies.",
      current: true
    },
    {
      id: "exp-2",
      role: "Software Developer",
      company: "PixelCraft Agency",
      location: "Remote / Bengaluru",
      duration: "2022 - 2024",
      description: "Implemented customer-facing user interfaces using React and modern CSS. Built core web elements, dashboard graphs, and custom drag-and-drop report builders with high fidelity.",
      current: false
    }
  ],
  educations: [
    {
      id: "edu-1",
      degree: "B.Tech in Information Technology",
      school: "Anna University, Chennai",
      duration: "2018 - 2022",
      description: "Specialized in Web Software Systems and Data Architectures. Participated in national web dev hackathons and achieved CGPA of 8.5/10.",
      grade: "8.5 CGPA"
    }
  ],
  certificates: [
    {
      id: "cert-1",
      title: "Google UX Design Professional Certificate",
      issuer: "Coursera",
      issueDate: "2023-04",
      credentialUrl: "https://example.com/cred1"
    },
    {
      id: "cert-2",
      title: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services (AWS)",
      issueDate: "2023-11",
      credentialUrl: "https://example.com/cred2"
    }
  ],
  services: [
    {
      id: "ser-1",
      title: "UI/UX Design Consultation",
      description: "Comprehensive review of your application design, focusing on accessibility, typographic rhythm, and performance.",
      price: 1500
    },
    {
      id: "ser-2",
      title: "Full Stack Web Development",
      description: "End-to-end web application development using React, Node.js and Tailwind CSS with pristine pixel accuracy.",
      price: 5000
    },
    {
      id: "ser-3",
      title: "Performance Optimization Audit",
      description: "Deep dive audit to optimize Web Vitals, speed up rendering and bundle sizing, and improve Google lighthouse scoring.",
      price: 3000
    }
  ],
  consultationTopics: [
    "SaaS Architecture",
    "Front-end Audit",
    "Full-stack Integration",
    "UI & Typography Strategy"
  ],
  socialLinks: [
    { id: "soc-1", platform: "GitHub", url: "https://github.com" },
    { id: "soc-2", platform: "LinkedIn", url: "https://linkedin.com" },
    { id: "soc-3", platform: "Twitter", url: "https://twitter.com" }
  ]
};

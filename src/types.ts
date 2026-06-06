export interface ProfileInfo {
  name: string;
  title: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  email: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  consultationRate: number;
  consultationCurrency: string;
  upiId?: string;
  heroImageUrl?: string;
  animeTheme?: string;
  qrImageUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  duration: string;
  description: string;
  grade?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
  isBooking?: boolean;
  bookingAmountPaid?: number;
}

export interface PortfolioData {
  profile: ProfileInfo;
  skills: SkillCategory[];
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  certificates: Certificate[];
  services: Service[];
  consultationTopics?: string[];
  socialLinks?: SocialLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}


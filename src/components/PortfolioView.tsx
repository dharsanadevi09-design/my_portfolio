import React, { useState, useEffect } from "react";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin, 
  ExternalLink, 
  ArrowRight, 
  Send, 
  Clock, 
  Briefcase, 
  Layers, 
  FileDown,
  User,
  GraduationCap,
  Award,
  Calendar,
  X,
  Plus,
  HelpCircle,
  Laptop,
  Terminal,
  Sparkles,
  Facebook,
  Instagram,
  Youtube,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData, ContactMessage } from "../types";

// Import generated background safely
// @ts-ignore
import computerBg from "../assets/images/computer_bg_1780565236671.png";

interface PortfolioViewProps {
  data: PortfolioData;
  onSubmitMessage: (message: Omit<ContactMessage, "id" | "timestamp" | "read">) => void;
  activeSection: string;
}

export default function PortfolioView({ data, onSubmitMessage, activeSection }: PortfolioViewProps) {
  const { profile, skills, projects, experiences, educations, certificates, services = [], consultationTopics = [] } = data;

  const [formState, setFormState] = useState({
    senderName: "",
    senderEmail: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<"form" | "payment">("form");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    hours: 1,
    topic: "Consulting",
    notes: ""
  });

  // Keep topic selection updated when options change
  useEffect(() => {
    if (consultationTopics.length > 0 && !consultationTopics.includes(bookingForm.topic)) {
      setBookingForm(prev => ({ ...prev, topic: consultationTopics[0] }));
    }
  }, [consultationTopics]);
  const [upiTrxRef, setUpiTrxRef] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Service Checkout Modal State
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [serviceBookingForm, setServiceBookingForm] = useState({
    name: "",
    email: "",
    notes: ""
  });
  const [serviceStep, setServiceStep] = useState<"form" | "payment">("form");
  const [serviceTrxRef, setServiceTrxRef] = useState("");
  const [serviceSuccess, setServiceSuccess] = useState(false);

  const handleServicePaymentConfirm = (trxRef: string) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmitMessage({
        senderName: serviceBookingForm.name,
        senderEmail: serviceBookingForm.email,
        subject: `💼 PAID Service Order: ${selectedService?.title || "Specialist Order"}`,
        message: `💼 PAID SPECIALIST SERVICE ORDER RECEIVED
=========================================
CLIENT DETAILS:
- Name: ${serviceBookingForm.name}
- Email Contact Address: ${serviceBookingForm.email}

ORDER PARAMETERS:
- Ordered Service: ${selectedService?.title || "N/A"}
- Service ID Reference: ${selectedService?.id || "N/A"}
- Calculated Total Deliverable Amount: ${profile.consultationCurrency || "₹"}${(selectedService?.price || 0).toLocaleString("en-IN")}

UPI TRANSACTION AUDIT DETAILS:
- Transferred UPI Target: ${profile.upiId || "aravind@okaxis"}
- Customer Reference Ref ID / UTR: ${trxRef || "SIMULATED_UTR_Z572918"}
- Verification Status: CLEAR & CONFIRMED STATUS

CLIENT PROJECT GUIDELINES:
"${serviceBookingForm.notes || "None"}"`
      });

      setServiceSuccess(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        setServiceSuccess(false);
        setSelectedService(null);
        setServiceStep("form");
        setServiceBookingForm({
          name: "",
          email: "",
          notes: ""
        });
        setServiceTrxRef("");
      }, 5000);
    }, 1200);
  };


  // Tab state for hero right side container (Interactive Logs vs Creative Portrait image)
  const [rightSideTab, setRightSideTab] = useState<"terminal" | "image">("image");

  // Clipboard copy state for payment simulation (Tamil: direct upi copy option)
  const [copiedUpi, setCopiedUpi] = useState(false);
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(profile.upiId || "aravind@okaxis");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.senderName || !formState.senderEmail || !formState.message) {
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      onSubmitMessage({
        senderName: formState.senderName,
        senderEmail: formState.senderEmail,
        subject: formState.subject || "Collaboration",
        message: formState.message
      });
      
      setFormState({
        senderName: "",
        senderEmail: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 800);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) return;
    setBookingStep("payment");
  };

  const handlePaymentConfirm = (trxRef: string) => {
    setIsSubmitting(true);
    setPaymentVerified(true);
    
    setTimeout(() => {
      // Direct integration into messaging log so the admin receives booking request inside CMS Inbox!
      onSubmitMessage({
        senderName: bookingForm.name,
        senderEmail: bookingForm.email,
        subject: `📅 PAID Booking: ${bookingForm.topic} (${bookingForm.hours} hrs)`,
        message: `📅 PAID VIP CONSULTATION BOOKING RECEIVED
=========================================
CLIENT DATA METRICS:
- Name: ${bookingForm.name}
- Email Contact Address: ${bookingForm.email}

SESSION PARAMETERS:
- Requested Hours: ${bookingForm.hours} hour(s)
- Consultation Core Topic: ${bookingForm.topic}
- Calculated Billable Total: ${data.profile.consultationCurrency}${bookingForm.hours * data.profile.consultationRate} (${bookingForm.hours} hrs @ ${data.profile.consultationCurrency}${data.profile.consultationRate}/hr)

UPI TRANSACTION AUDIT DETAILS:
- Transferred to UPI Target: ${data.profile.upiId || "aravind@okaxis"}
- Customer Reference Ref ID / UTR: ${trxRef || "SIMULATED_UTR_X57291843"}
- Payment Verification State: CLEARED & CONFIRMED STATUS

CLIENT CONTEXT BRIEFING:
"${bookingForm.notes || "None"}"`
      });

      setBookingSuccess(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        setBookingSuccess(false);
        setShowBookingModal(false);
        setBookingStep("form");
        setBookingForm({
          name: "",
          email: "",
          hours: 1,
          topic: "Consulting",
          notes: ""
        });
        setUpiTrxRef("");
        setPaymentVerified(false);
      }, 5000);
    }, 1200);
  };

  // Anime Floating Elements Loop (continuous looping animation array)
  const animeFloatingIcons = [
    { text: "const developer = true;", delay: 0, x: "15%", y: "20%", duration: 12 },
    { text: "npm run dev", delay: 3, x: "75%", y: "15%", duration: 15 },
    { text: "<div>👨‍💻</div>", delay: 1, x: "80%", y: "60%", duration: 18 },
    { text: "<Portfolio />", delay: 5, x: "10%", y: "70%", duration: 14 },
    { text: "style='black & white'", delay: 2, x: "85%", y: "35%", duration: 16 },
    { text: "git commit -m 'build'", delay: 4, x: "20%", y: "45%", duration: 13 }
  ];

  // Render theme-based background animation loop components (Tamil translation: loop and theme settings)
  const renderBackgroundLoop = () => {
    const theme = profile.animeTheme || "matrix";
    
    if (theme === "matrix") {
      // Columns of matrix scrolling numbers/binaries
      const columns = Array.from({ length: 15 });
      return (
        <div className="absolute inset-x-0 top-0 bottom-0 select-none overflow-hidden pointer-events-none opacity-[0.09] flex justify-around -z-10">
          {columns.map((_, colIdx) => {
            const delay = colIdx * 0.45;
            const duration = 10 + (colIdx % 5) * 3;
            // Generate standard strings of binaries
            const binaryChars = Array.from({ length: 22 }, () => Math.round(Math.random()).toString());
            return (
              <motion.div
                key={colIdx}
                className="font-mono text-[10px] sm:text-xs text-black font-black flex flex-col space-y-1.5 select-none"
                initial={{ y: -450 }}
                animate={{ y: ["100vh", "-100%"] }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay,
                }}
              >
                {binaryChars.map((char, charIdx) => (
                  <span key={charIdx} className="font-extrabold">{char}</span>
                ))}
              </motion.div>
            );
          })}
        </div>
      );
    }
    
    if (theme === "stars") {
      const stars = Array.from({ length: 25 });
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 -z-10">
          {stars.map((_, idx) => {
            const x = `${(idx * 19) % 94}%`;
            const y = `${(idx * 11) % 86}%`;
            const duration = 2.5 + (idx % 3) * 1.5;
            const delay = (idx % 4) * 0.4;
            return (
              <motion.div
                key={idx}
                className="absolute w-1.5 h-1.5 bg-black rotate-45"
                style={{ left: x, top: y }}
                animate={{
                  opacity: [0.1, 0.9, 0.1],
                  scale: [0.7, 1.4, 0.7],
                  rotate: [45, 225, 45]
                }}
                transition={{
                  duration: duration,
                  delay: delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
      );
    }
    
    if (theme === "particles") {
      const particles = Array.from({ length: 12 });
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06] -z-10">
          {particles.map((_, idx) => {
            const x = `${(idx * 21) % 92}%`;
            const y = `${(idx * 17) % 84}%`;
            const size = 30 + (idx % 3) * 60;
            const duration = 18 + (idx % 2) * 12;
            return (
              <motion.div
                key={idx}
                className="absolute border border-black rounded-full"
                style={{ 
                  left: x, 
                  top: y, 
                  width: size, 
                  height: size 
                }}
                animate={{
                  x: [0, 50, -50, 0],
                  y: [0, -70, 70, 0],
                  scale: [1, 1.2, 0.85, 1]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
      );
    }
    
    // Default mode: Original active floating coder keyword statements
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {animeFloatingIcons.map((item, idx) => (
          <motion.div
            key={idx}
            className="absolute font-mono text-xs font-black text-neutral-300 pointer-events-none tracking-widest uppercase py-1 px-2 border border-neutral-100 bg-white/50 select-none hidden md:block"
            style={{ top: item.y, left: item.x }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.95, 1.05, 0.95]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </div>
    );
  };

  // Scroll to top of window when activeSection switches
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  return (
    <div className="pt-8 pb-24 bg-white text-black min-h-screen relative overflow-hidden selection:bg-black selection:text-white">
      {/* Dynamic continuous background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-20 opacity-40"></div>

      {/* Background Computer Image */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.06] flex items-center justify-center">
        <img 
          src={computerBg} 
          alt="workstation wireframe background" 
          referrerPolicy="no-referrer"
          className="w-full max-w-7xl object-contain object-center scale-105"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 min-h-[75vh]">
        <AnimatePresence mode="wait">
          
          {/* HOMEPAGE / HERO SECTION */}
          {activeSection === "home" && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="min-h-[75vh] flex items-center pt-4 sm:pt-8 pb-12 relative"
            >
              {/* Continuous Infinite Anime Loop in Background (Dynamic config from profile.animeTheme) */}
              {renderBackgroundLoop()}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
                {/* Intro & Custom B&W CTA buttons */}
                <div className="lg:col-span-7 space-y-8 text-left">
                  <div className="inline-flex items-center gap-2 border-2 border-black px-4 py-1.5 font-mono text-xs font-black uppercase tracking-widest bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    <span className="w-2.5 h-2.5 bg-black animate-square-ping"></span>
                    SYSTEM ACTIVE // ONLINE
                  </div>

                  <div className="space-y-4">
                    <h1 className="font-sans font-black text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-black uppercase leading-none">
                      {profile.name}
                    </h1>
                    <p className="font-sans text-xl sm:text-2xl font-black text-neutral-700 tracking-tight flex items-center gap-3">
                      <Laptop className="w-6 h-6 text-black flex-shrink-0" />
                      {profile.title}
                    </p>
                  </div>

                  <p className="font-sans text-lg text-neutral-600 leading-relaxed font-medium border-l-4 border-black pl-5 max-w-2xl">
                    "{profile.headline}"
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <span className="flex items-center gap-2 border border-black/30 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider bg-white">
                      <MapPin className="w-3.5 h-3.5" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-2 border border-black/30 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider bg-white">
                      <Mail className="w-3.5 h-3.5" />
                      {profile.email}
                    </span>
                  </div>

                  {/* TWO REQUIRED BUTTONS IN HERO CONTAINER - Stark Black and White */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 pt-4">
                    {/* 1st Button: Consult With rate */}
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="px-6 py-4 border-2 border-black bg-black text-white text-sm font-black uppercase tracking-widest shadow-[4px_4px_0_0_rgba(200,200,200,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <span>Book Consultation Session</span>
                      <span className="border-l border-white/40 pl-3 text-neutral-300 text-xs font-mono font-bold tracking-tight">
                        {profile.consultationCurrency}{profile.consultationRate}/hr
                      </span>
                    </button>

                    {/* 2nd Button: Resume with file link */}
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-4 border-2 border-black bg-white text-black text-sm font-black uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <FileDown className="w-4.5 h-4.5" />
                      <span>View Resume File</span>
                    </a>
                  </div>

                  {/* Social networking anchors */}
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-neutral-100">
                    <span className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest mr-2">Digital Nodes:</span>
                    {(data.socialLinks || []).map((link) => {
                      const platform = link.platform.trim().toLowerCase();
                      let IconComponent = Globe;
                      if (platform.includes("github")) IconComponent = Github;
                      else if (platform.includes("linkedin")) IconComponent = Linkedin;
                      else if (platform.includes("twitter") || platform.includes("x")) IconComponent = Twitter;
                      else if (platform.includes("facebook")) IconComponent = Facebook;
                      else if (platform.includes("instagram")) IconComponent = Instagram;
                      else if (platform.includes("youtube")) IconComponent = Youtube;
                      else if (platform.includes("website") || platform.includes("portfolio")) IconComponent = Globe;

                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                          aria-label={`${link.platform} Link`}
                          title={link.platform}
                        >
                          <IconComponent className="w-5 h-5" />
                        </a>
                      );
                    })}
                    {(data.socialLinks || []).length === 0 && (
                      <span className="text-xs text-neutral-400 italic">No nodes configured.</span>
                    )}
                  </div>
                </div>

                {/* Right Side Portrait image ONLY (Removed Console/Terminal state completely) */}
                <div className="lg:col-span-12 xl:col-span-5 flex justify-center w-full">
                  <div className="relative w-full max-w-md group p-1.5 bg-black border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-none flex flex-col">
                    {/* Minimalist layout segment tags */}
                    <div className="flex bg-black text-white text-[10px] font-mono border-b border-neutral-900 pb-2 mb-3 items-center justify-between px-1">
                      <div className="flex items-center space-x-1.5 font-bold uppercase tracking-widest text-neutral-400">
                        <span className="w-2 h-2 bg-white inline-block animate-pulse"></span>
                        <span>DEVELOPER // IDENTITY PORTRAIT</span>
                      </div>
                    </div>

                    <div className="border border-white/10 bg-white p-4 space-y-4 flex-1 flex flex-col justify-between text-left">
                      <div className="relative border-2 border-black aspect-[4/3] bg-neutral-50 overflow-hidden group shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                        <img 
                          src={profile.heroImageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=850"} 
                          alt="Workspace portrait photography" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale contrast-110 saturate-0 transition-all duration-500 hover:scale-105 hover:contrast-125"
                        />
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black text-white font-mono text-[8px] uppercase tracking-widest font-black border border-white">
                          HERO PORTRAIT
                        </div>
                      </div>
                      
                      <div className="border-t border-dashed border-black/20 pt-3 space-y-1">
                        <p className="font-sans font-black text-xs text-black uppercase tracking-tight">
                          {profile.name} // WORKSPACE ART
                        </p>
                        <p className="font-mono text-[9px] text-neutral-500 leading-normal font-semibold">
                          Aesthetic workspace portrait illustration. Real image loaded dynamically as configured from CMS Profile Settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ABOUT SECTION (Monochromatic Layout) */}
          {activeSection === "about" && (
            <motion.section
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5 space-y-6 text-left">
                  <span className="font-mono text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 inline-block">01 // THE NARRATIVE</span>
                  <h2 className="font-sans font-black text-4xl uppercase tracking-tighter text-black">
                    About & Service
                  </h2>
                  <p className="font-sans text-neutral-600 leading-relaxed font-semibold">
                    {profile.bio}
                  </p>

                  {/* Big decorative slogan */}
                  <div className="bg-black text-white p-6 rounded-none space-y-1.5 border border-black shadow-[4px_4px_0_0_rgba(180,180,180,1)]">
                    <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">AESTHETIC CORE</p>
                    <p className="font-sans font-black text-lg uppercase tracking-tight">"DESIGN IS INTELLIGENCE MADE VISIBLE."</p>
                  </div>
                </div>

                {/* Skills categorizations in B&W */}
                <div className="lg:col-span-7 space-y-8">
                  <span className="font-mono text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 inline-block text-left w-full lg:w-auto">02 // CAPABILITIES</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
                    {skills.map((category) => (
                      <div 
                        key={category.id} 
                        className="border-2 border-black p-5 bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
                      >
                        <h3 className="font-sans font-black text-base uppercase tracking-tight border-b-2 border-black pb-2 mb-4">
                          {category.name}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                          {category.items.map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1.5 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-none"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SERVICES CATALOG & BILLING REGISTRY */}
              <div className="border-t-4 border-black pt-12 mt-12 text-left">
                <span className="font-mono text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 inline-block">03 // CERTIFIED SERVICES CATALOG</span>
                
                <p className="font-sans text-neutral-600 font-semibold max-w-2xl mt-4 leading-relaxed text-sm">
                  Pre-packaged technological services and creative deliverables configured through master CMS settings with strict zero-delay execution protocols. Select a service package below to trigger secure checkout.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {services && services.map((service) => (
                    <div 
                      key={service.id}
                      className="border-4 border-black p-6 bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b-2 border-black/10">
                          <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-0.5 uppercase tracking-widest">
                            {service.id.toUpperCase()}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-neutral-400">
                            UNIT-01 // ACTIVE
                          </span>
                        </div>
                        <h3 className="font-sans font-black text-lg text-black uppercase tracking-tight">
                          {service.title}
                        </h3>
                        <p className="font-sans text-xs text-neutral-500 font-semibold leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-6 border-t font-mono flex flex-col gap-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-neutral-400 font-black uppercase">PRICE POINT *</span>
                          <span className="font-sans font-black text-xl text-black">
                            {profile.consultationCurrency || "₹"}{service.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setServiceStep("form");
                            setServiceBookingForm({ name: "", email: "", notes: "" });
                            setServiceTrxRef("");
                            setServiceSuccess(false);
                          }}
                          className="w-full py-3 bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase text-xs tracking-widest transition-colors cursor-pointer text-center shadow-[2px_2px_0_0_rgba(150,150,150,1)] hover:shadow-none"
                        >
                          Book Service Deliverable
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!services || services.length === 0) && (
                    <div className="col-span-3 p-6 border-2 border-dashed border-black/30 bg-neutral-50 text-center">
                      <p className="text-xs text-neutral-400 italic">No professional service packages declared in database.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          )}

          {/* PROJECTS SECTION */}
          {activeSection === "projects" && (
            <motion.section
              key="projects"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="space-y-10 text-left">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-2 border-black pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-neutral-600">03 // SELECTED EXPERIMENTAL ARCHIVES</span>
                    <h2 className="font-sans font-black text-4xl uppercase tracking-tighter text-black">
                      Projects Grid
                    </h2>
                  </div>
                  <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest font-black">
                    TOTAL ARCHIVES: {projects.length} RECORDS
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((proj) => (
                    <div 
                      key={proj.id}
                      className="border-2 border-black bg-white flex flex-col group shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                      {/* High contrast thumbnail image with strict rules */}
                      <div className="relative aspect-video bg-neutral-100 overflow-hidden border-b-2 border-black flex items-center justify-center">
                        {proj.imageUrl ? (
                          <img 
                            src={proj.imageUrl} 
                            alt={proj.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale contrast-125 transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800";
                            }}
                          />
                        ) : (
                          <Layers className="w-10 h-10 text-neutral-400" />
                        )}

                        {proj.featured && (
                          <span className="absolute top-2 left-2 px-2.5 py-1 bg-black text-white border border-white text-[9px] font-black tracking-widest uppercase font-mono">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] font-black text-neutral-400 uppercase tracking-wider block">
                            {proj.category}
                          </span>
                          <h3 className="font-sans font-black text-lg text-black uppercase tracking-tight group-hover:underline">
                            {proj.title}
                          </h3>
                          <p className="font-sans text-neutral-500 text-xs font-semibold leading-relaxed line-clamp-3">
                            {proj.description}
                          </p>
                        </div>

                        <div className="space-y-4 pt-3 border-t border-neutral-150">
                          <div className="flex flex-wrap gap-1.5">
                            {proj.techStack.map((tech, index) => (
                              <span 
                                key={index}
                                className="px-2 py-0.5 border border-black font-mono text-[9px] text-black bg-neutral-50 font-bold uppercase"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider font-mono">
                            {proj.demoUrl && (
                              <a 
                                href={proj.demoUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-black hover:underline"
                              >
                                Live Demo
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a 
                                href={proj.githubUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-neutral-500 hover:text-black hover:underline"
                              >
                                Source Code
                                <Github className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* EDUCATION & CERTIFICATE ON ONE PAGE (Unified layout) */}
          {activeSection === "education-certificates" && (
            <motion.section
              key="education-certificates"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="space-y-10 text-left">
                <div className="border-b-2 border-black pb-4">
                  <span className="font-mono text-xs font-black uppercase tracking-widest text-neutral-600">04 // CREDENTIALS & EDUCATION</span>
                  <h2 className="font-sans font-black text-4xl uppercase tracking-tighter text-black">
                    Education & Certificates
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 font-sans">
                  
                  {/* Left Column: Education details */}
                  <div className="space-y-6">
                    <h3 className="font-sans font-black text-xl uppercase tracking-wider flex items-center gap-2 pb-2 border-b-2 border-black">
                      <GraduationCap className="w-5 h-5 text-black" />
                      Education History
                    </h3>

                    <div className="space-y-6">
                      {educations.map((edu) => (
                        <div 
                          key={edu.id}
                          className="border-2 border-black p-5 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-left"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 uppercase tracking-wider self-start sm:self-auto">
                              {edu.duration}
                            </span>
                            {edu.grade && (
                              <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                GRADE: {edu.grade}
                              </span>
                            )}
                          </div>

                          <h4 className="font-sans font-black text-base text-black uppercase">
                            {edu.degree}
                          </h4>
                          <p className="text-neutral-500 text-xs font-extrabold uppercase tracking-wide mb-3">
                            {edu.school}
                          </p>
                          <p className="text-neutral-600 text-xs font-medium leading-relaxed">
                            {edu.description}
                          </p>
                        </div>
                      ))}

                      {educations.length === 0 && (
                        <p className="text-xs text-neutral-400 italic">No academic logs registered in CMS database.</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Professional Certificates */}
                  <div className="space-y-6">
                    <h3 className="font-sans font-black text-xl uppercase tracking-wider flex items-center gap-2 pb-2 border-b-2 border-black">
                      <Award className="w-5 h-5 text-black" />
                      Certificates List
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {certificates.map((cert) => (
                        <div 
                          key={cert.id}
                          className="border-2 border-black p-4 bg-white flex flex-col justify-between hover:bg-neutral-50 transition-colors text-left"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[9px] font-black uppercase text-neutral-500 tracking-widest">
                                {cert.issueDate}
                              </span>
                              <span className="w-2 h-2 bg-black"></span>
                            </div>
                            <h4 className="font-sans font-black text-xs text-black uppercase leading-tight">
                              {cert.title}
                            </h4>
                            <p className="font-mono text-[10px] font-bold text-neutral-400 uppercase">
                              by {cert.issuer}
                            </p>
                          </div>

                          {cert.credentialUrl && cert.credentialUrl !== "#" && (
                            <a 
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase text-black hover:underline tracking-widest pt-2 border-t border-neutral-100"
                            >
                              Verify Credential
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}

                      {certificates.length === 0 && (
                        <p className="text-xs text-neutral-400 italic col-span-2">No credential certifications declared yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.section>
          )}

          {/* EXPERIENCE TIMELINE SECTION */}
          {activeSection === "experience" && (
            <motion.section
              key="experience"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="space-y-10 text-left">
                <div className="border-b-2 border-black pb-4">
                  <span className="font-mono text-xs font-black uppercase tracking-widest text-neutral-600">05 // WORK MILESTONES</span>
                  <h2 className="font-sans font-black text-4xl uppercase tracking-tighter text-black">
                    Job Experiences
                  </h2>
                </div>

                <div className="max-w-4xl mx-auto relative pl-6 md:pl-0">
                  {/* Monochromatic center timeline bar */}
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-black transform md:-translate-x-1/2"></div>

                  <div className="space-y-12">
                    {experiences.map((exp, index) => {
                      const isLeft = index % 2 === 0;
                      return (
                        <div 
                          key={exp.id}
                          className={`relative flex flex-col md:flex-row items-stretch ${
                            isLeft ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          {/* stark solid dot */}
                          <div className="absolute left-4 md:left-1/2 w-6 h-6 border-4 border-black bg-white transform -translate-x-2.5 md:-translate-x-3 z-10">
                            {exp.current && (
                              <span className="absolute -inset-1 border border-black animate-ping"></span>
                            )}
                          </div>

                          <div className="w-full md:w-1/2 md:px-8 pl-10 md:pl-0">
                            <div className="border-2 border-black p-6 bg-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] relative text-left">
                              <span className="inline-block px-3 py-1 bg-black text-white font-mono text-[9px] font-black uppercase tracking-widest mb-3">
                                {exp.duration}
                              </span>

                              <h3 className="font-sans font-black text-base text-black uppercase">
                                {exp.role}
                              </h3>

                              <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase font-black border-b border-black/10 pb-2 mb-3 mt-1">
                                <span>{exp.company}</span>
                                <span>{exp.location}</span>
                              </div>

                              <p className="text-neutral-600 text-xs leading-relaxed font-semibold">
                                {exp.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {experiences.length === 0 && (
                      <p className="text-xs text-neutral-400 italic text-center py-6">No historical work records registered.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* CONTACT SECTION */}
          {activeSection === "contact" && (
            <motion.section
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start text-left">
                <div className="space-y-6">
                  <span className="font-mono text-xs font-black uppercase tracking-widest text-neutral-600">06 // DIRECT DISPATCH</span>
                  <h2 className="font-sans font-black text-4xl uppercase tracking-tighter text-black">
                    Send Message
                  </h2>
                  <p className="font-sans text-neutral-600 leading-relaxed font-semibold">
                    Use this monochromatic connection terminal to discuss new software architectures, digital designs, contracting setups, or consultancy requests.
                  </p>

                  <div className="border-2 border-black p-5 bg-neutral-50 space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-black shrink-0" />
                      <span className="font-black">EMAIL: {profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-black shrink-0" />
                      <span className="font-black">LOCATION: {profile.location}</span>
                    </div>
                  </div>
                </div>

                {/* Stark Monochromatic Contact Form */}
                <div className="border-2 border-black p-6 sm:p-8 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-left">
                  <h3 className="font-sans font-black text-lg uppercase tracking-tight mb-6 pb-2 border-b-2 border-black">
                    Write Statement
                  </h3>

                  {showSuccess && (
                    <div className="mb-6 p-4 bg-black text-white text-xs font-mono font-black border border-black uppercase tracking-wider">
                      &gt;&gt; Statement transmitted successfully.
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs font-bold uppercase">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-black">Name *</label>
                        <input
                          type="text"
                          name="senderName"
                          required
                          value={formState.senderName}
                          onChange={handleInputChange}
                          placeholder="e.g. John Doe"
                          className="w-full px-3 py-2 border-2 border-black rounded-none text-xs focus:outline-none focus:bg-neutral-50 bg-white text-black"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-black">Email *</label>
                        <input
                          type="email"
                          name="senderEmail"
                          required
                          value={formState.senderEmail}
                          onChange={handleInputChange}
                          placeholder="e.g. email@domain..."
                          className="w-full px-3 py-2 border-2 border-black rounded-none text-xs focus:outline-none focus:bg-neutral-50 bg-white text-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-black">Subject Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formState.subject}
                        onChange={handleInputChange}
                        placeholder="e.g. Partnership"
                        className="w-full px-3 py-2 border-2 border-black rounded-none text-xs focus:outline-none focus:bg-neutral-50 bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-black">Message Body *</label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formState.message}
                        onChange={handleInputChange}
                        placeholder="Insert message body text here..."
                        className="w-full px-4 py-2 border-2 border-black rounded-none text-xs focus:outline-none focus:bg-neutral-50 bg-white text-black resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-black bg-black text-white hover:bg-white hover:text-black hover:shadow-none transition-all font-sans font-black uppercase text-xs tracking-widest cursor-pointer"
                    >
                      {isSubmitting ? "TRANSMITTING..." : "DISPATCH STATEMENT"}
                    </button>
                  </form>
                </div>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </div>

      {/* BOOKING CONSULTATION MODAL GATEWAY (WITH AMOUNT SETTING) */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-black w-full max-w-lg p-6 sm:p-8 rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative text-black"
            >
              {/* Close Button Button */}
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 p-1 border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6 text-left">
                {/* Header */}
                <div className="border-b-2 border-black pb-3">
                  <h3 className="font-sans font-black text-xl uppercase tracking-tight">
                    Book Consultation
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    Direct integration channel with {profile.name}
                  </p>
                </div>

                {bookingSuccess ? (
                  <div className="p-5 border-2 border-black bg-black text-white text-xs font-mono font-bold leading-relaxed uppercase space-y-3">
                    <p className="text-sm font-black border-b border-neutral-800 pb-2 text-emerald-400">&gt;&gt; PAYMENT VERIFIED & CONFIRMED STATUS</p>
                    <p>&gt; Connection established with {profile.name}.</p>
                    <p>&gt; Booking Request transmitted to Admin CMS messages database catalog.</p>
                    <p>&gt; Paid amount committed: {profile.consultationCurrency}{bookingForm.hours * profile.consultationRate} total ({bookingForm.hours} hr @ {profile.consultationCurrency}{profile.consultationRate}/hr)</p>
                    <p>&gt; Client reference ID: {upiTrxRef || "SIMULATED_UTR_X94827"}</p>
                    <p>&gt; Automatically resetting portal console screen...</p>
                  </div>
                ) : bookingStep === "payment" ? (
                  <div className="space-y-5 font-mono text-xs">
                    {/* Step bar */}
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-black/15 pb-2">
                      <span className="text-neutral-400">Step 1: Details</span>
                      <span className="text-black bg-black text-white px-2 py-0.5 font-extrabold">Step 2: UPI Safe Checkout</span>
                    </div>

                    <p className="text-neutral-600 font-sans tracking-tight leading-relaxed font-semibold normal-case">
                      Please transfer the consultation aggregate total via UPI to secure the slot reservation. Enter transaction UTR to dispatch.
                    </p>

                    {/* PAYMENT INFO BOX */}
                    <div className="border-2 border-black p-4 bg-neutral-50 text-left space-y-2.5">
                      <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="font-bold text-neutral-500 uppercase text-[10px]">Merchant/Payee:</span>
                        <span className="font-black text-black uppercase">{profile.name}</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="font-bold text-neutral-500 uppercase text-[10px]">Developer UPI ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-black">{profile.upiId || "aravind@okaxis"}</span>
                          <button
                            onClick={handleCopyUpi}
                            type="button"
                            className="px-1.5 py-0.5 border border-black text-[9px] bg-white text-black font-bold uppercase tracking-wider hover:bg-black hover:text-white cursor-pointer"
                          >
                            {copiedUpi ? "COPIED" : "COPY"}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="font-bold text-neutral-500 uppercase text-[10px]">Consultation Bill:</span>
                        <span className="font-mono text-[10px] text-neutral-500 font-black">
                          {bookingForm.hours} hr(s) @ {profile.consultationCurrency}{profile.consultationRate}/hr
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="font-black text-xs text-black uppercase">Final Payable Balance:</span>
                        <span className="font-sans font-black text-sm text-black underline bg-neutral-200 px-2 py-0.5">
                          {profile.consultationCurrency}{bookingForm.hours * profile.consultationRate}
                        </span>
                      </div>
                    </div>

                    {/* QR CODE DYNAMIC VISUALIZER */}
                    <div className="border-2 border-black p-4 bg-white flex flex-col items-center justify-center text-center space-y-3 relative group overflow-hidden">
                      {/* Laser scanning lines custom overlay */}
                      <div className="absolute inset-x-0 h-0.5 bg-black/60 top-0 animate-laser-move pointer-events-none"></div>

                      {profile.qrImageUrl ? (
                        <div className="w-32 h-32 border-2 border-black bg-white flex items-center justify-center relative">
                          <img
                            src={profile.qrImageUrl}
                            alt="Scan to pay"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fall back in case image fails
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 border-4 border-black p-1 bg-white relative flex flex-wrap content-start">
                          {/* Beautiful QR Code simulation look with styled black/white geometric items */}
                          <div className="w-8 h-8 border-4 border-black bg-white m-1"></div>
                          <div className="w-10 h-3 bg-black m-1"></div>
                          <div className="w-8 h-8 border-4 border-black bg-white m-1 absolute top-1 right-1"></div>
                          <div className="w-8 h-8 border-4 border-black bg-white m-1 absolute bottom-1 left-1"></div>
                          
                          {/* Scatter points representing data chunks */}
                          <div className="absolute inset-6 grid grid-cols-5 gap-1 p-1 opacity-80">
                            <div className="bg-black w-2.5 h-2.5"></div>
                            <div className="bg-white w-2.5 h-2.5"></div>
                            <div className="bg-black w-2.5 h-1.5"></div>
                            <div className="bg-black w-1.5 h-2.5"></div>
                            <div className="bg-black w-2.5 h-2.5"></div>
                            <div className="bg-white w-2.5 h-2.5"></div>
                            <div className="bg-black w-2.5 h-2.5"></div>
                            <div className="bg-black w-2.5 h-1.5"></div>
                            <div className="bg-white w-2.5 h-2.5"></div>
                            <div className="bg-black w-2.5 h-2.5"></div>
                          </div>

                          {/* UPI logo center marker icon */}
                          <div className="absolute inset-0 m-auto w-8 h-8 bg-black flex items-center justify-center text-[8px] font-sans font-bold text-white uppercase tracking-tighter border border-white">
                            UPI
                          </div>
                        </div>
                      )}

                      <p className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                        Scan with your preferred UPI app to simulate transfer
                      </p>
                    </div>

                    {/* SANDBOX SIMULATE SUCCESS TRIGGER */}
                    <div className="p-3 bg-neutral-100 border border-black flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                      <div>
                        <p className="font-black text-[9px] uppercase tracking-wider text-black">TESTING SANDBOX TERMINAL</p>
                        <p className="font-sans text-[10px] text-neutral-500 normal-case">Instantly simulate a successful UPI transaction.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const randRef = Date.now().toString().slice(-12);
                          setUpiTrxRef(randRef);
                          handlePaymentConfirm(randRef);
                        }}
                        className="px-3 py-1.5 bg-black text-white text-[9px] font-mono font-black uppercase hover:bg-neutral-800 transition-colors cursor-pointer text-center shrink-0 block w-full sm:w-auto font-bold animate-pulse"
                      >
                        ⚡ INSTANT SIMULATE PAYMENT
                      </button>
                    </div>

                    {/* MANUAL CONFIRM FORM INPUT */}
                    <div className="space-y-2 text-left">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600 font-mono">
                        Manually Verify Transaction Ref ID / UTR (12 Digits) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          maxLength={12}
                          value={upiTrxRef}
                          onChange={(e) => setUpiTrxRef(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="e.g. 394205819742"
                          className="flex-1 px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black font-mono font-bold"
                        />
                        <button
                          type="button"
                          disabled={upiTrxRef.length < 12 || isSubmitting}
                          onClick={() => handlePaymentConfirm(upiTrxRef)}
                          className="px-4 py-2 bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs font-sans font-black uppercase tracking-wider disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white cursor-pointer"
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBookingStep("form")}
                      className="w-full text-center text-xs font-mono font-extrabold uppercase hover:underline text-neutral-500 mt-2 block"
                    >
                      &lt;&lt; BACK TO DETAILS FORM
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4 font-mono text-xs font-bold uppercase">
                    <p className="text-neutral-500 font-sans tracking-tight leading-relaxed font-semibold normal-case">
                      You are establishing a direct consulting session. The hourly fee is <strong className="text-black font-black">{profile.consultationCurrency}{profile.consultationRate} per hour</strong>.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-black">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black text-left"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-black">Your Email *</label>
                        <input
                          type="email"
                          required
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                          placeholder="e.g. john@domain.com"
                          className="w-full px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black text-left"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-black">Consultation Length (Hours) *</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={8}
                          value={bookingForm.hours}
                          onChange={(e) => setBookingForm({ ...bookingForm, hours: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-full px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black text-left"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-black">Consulting Topic *</label>
                        <select
                          value={bookingForm.topic}
                          onChange={(e) => setBookingForm({ ...bookingForm, topic: e.target.value })}
                          className="w-full px-3 py-1.5 border-2 border-black rounded-none text-xs bg-white text-black"
                        >
                          {consultationTopics.map((topic, index) => (
                            <option key={index} value={topic}>{topic}</option>
                          ))}
                          {consultationTopics.length === 0 && (
                            <option value="Consulting">Consulting</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-black">Notes & Goals</label>
                      <textarea
                        rows={2}
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                        placeholder="Discuss target deliverable objectives..."
                        className="w-full px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black resize-none text-left font-sans"
                      />
                    </div>

                    {/* PRICE SUMMARY MODULE */}
                    <div className="p-4 border-2 border-black bg-neutral-50 text-left space-y-2">
                      <div className="flex justify-between text-xs text-neutral-500 font-bold">
                        <span>Hourly rate:</span>
                        <span>{profile.consultationCurrency}{profile.consultationRate} / hr</span>
                      </div>
                      <div className="flex justify-between text-xs text-neutral-500 font-bold">
                        <span>Hours:</span>
                        <span>{bookingForm.hours} hr(s)</span>
                      </div>
                      <div className="border-t border-black/10 pt-2 flex justify-between font-black text-sm text-black">
                        <span>Total Consultation Price:</span>
                        <span>{profile.consultationCurrency}{bookingForm.hours * profile.consultationRate}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-sans font-black uppercase tracking-widest text-xs cursor-pointer"
                    >
                      {isSubmitting ? "COMMITTING GATEWAY..." : "CONFIRM & SIMULATE BOOKING"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SERVICE BOOKING & PAY MODAL */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-4 border-black w-full max-w-lg p-6 sm:p-8 rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative text-black"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-1 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6 text-left">
                {/* Header */}
                <div className="border-b-2 border-black pb-3">
                  <h3 className="font-sans font-black text-xl uppercase tracking-tight">
                    Order Specialist Service
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    Direct delivery portal for: {selectedService.title}
                  </p>
                </div>

                {serviceSuccess ? (
                  <div className="p-5 border-2 border-black bg-black text-white text-xs font-mono font-bold leading-relaxed uppercase space-y-3">
                    <p className="text-sm font-black border-b border-neutral-800 pb-2 text-emerald-400">&gt;&gt; PAYMENT VERIFIED & SECURED STATUS</p>
                    <p>&gt; Order for "{selectedService.title}" successfully committed.</p>
                    <p>&gt; Request logged in Admin CMS message database log.</p>
                    <p>&gt; Total paid: {profile.consultationCurrency || "₹"}{selectedService.price.toLocaleString("en-IN")}</p>
                    <p>&gt; Audit Reference ID / UTR: {serviceTrxRef || "SIMULATED_UTR_Z572918"}</p>
                    <p>&gt; Standard dispatcher will contact you within 24 working hours.</p>
                  </div>
                ) : serviceStep === "payment" ? (
                  <div className="space-y-5 font-mono text-xs">
                    {/* Step bar */}
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-black/15 pb-2">
                      <span className="text-neutral-400">Step 1: Contact Details</span>
                      <span className="text-black bg-black text-white px-2 py-0.5 font-extrabold">Step 2: UPI Safe Gateway</span>
                    </div>

                    <p className="text-neutral-600 font-sans tracking-tight leading-relaxed font-semibold normal-case text-xs">
                      Please transfer the deliverable amount via UPI to start work allocation. Specifying the transaction Reference Ref ID / UTR activates development.
                    </p>

                    {/* PAYMENT INFO BOX */}
                    <div className="border-2 border-black p-4 bg-neutral-50 text-left space-y-2.5">
                      <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="font-bold text-neutral-500 uppercase text-[10px]">Recipient Merchant:</span>
                        <span className="font-black text-black uppercase">{profile.name}</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="font-bold text-neutral-500 uppercase text-[10px]">Merchant UPI ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-black">{profile.upiId || "aravind@okaxis"}</span>
                          <button
                            onClick={handleCopyUpi}
                            type="button"
                            className="px-1.5 py-0.5 border border-black text-[9px] bg-white text-black font-bold uppercase tracking-wider hover:bg-black hover:text-white cursor-pointer"
                          >
                            {copiedUpi ? "COPIED" : "COPY"}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="font-black text-xs text-black uppercase font-sans">Deliverable value:</span>
                        <span className="font-sans font-black text-sm text-black underline bg-neutral-200 px-2 py-0.5">
                          {profile.consultationCurrency || "₹"}{selectedService.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* QR CODE SCANNING VISUAL */}
                    <div className="border-2 border-black p-4 bg-white flex flex-col items-center justify-center text-center space-y-3 relative group overflow-hidden">
                      {/* Laser scanning lines custom overlay */}
                      <div className="absolute inset-x-0 h-0.5 bg-black/60 top-0 animate-laser-move pointer-events-none"></div>

                      {profile.qrImageUrl ? (
                        <div className="w-32 h-32 border-2 border-black bg-white flex items-center justify-center relative">
                          <img
                            src={profile.qrImageUrl}
                            alt="Scan to pay"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 border-4 border-black p-1 bg-white relative flex flex-wrap content-start">
                          <div className="w-8 h-8 border-4 border-black bg-white m-1"></div>
                          <div className="w-10 h-3 bg-black m-1"></div>
                          <div className="w-8 h-8 border-4 border-black bg-white m-1 absolute top-1 right-1"></div>
                          <div className="w-8 h-8 border-4 border-black bg-white m-1 absolute bottom-1 left-1"></div>
                          
                          <div className="absolute inset-6 grid grid-cols-5 gap-1 p-1 opacity-80">
                            <div className="bg-black w-2.5 h-2.5"></div>
                            <div className="bg-white w-2.5 h-2.5"></div>
                            <div className="bg-black w-2.5 h-1.5"></div>
                            <div className="bg-black w-1.5 h-2.5"></div>
                            <div className="bg-black w-2.5 h-2.5"></div>
                          </div>
                        </div>
                      )}

                      <p className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                        Scan with your preferred UPI app to simulate transfer
                      </p>
                    </div>

                    {/* SANDBOX SIMULATE SUCCESS TRIGGER */}
                    <div className="p-3 bg-neutral-100 border border-black flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                      <div>
                        <p className="font-black text-[9px] uppercase tracking-wider text-black">TESTING SANDBOX TERMINAL</p>
                        <p className="font-sans text-[10px] text-neutral-500 normal-case">Instantly simulate a successful UPI transaction.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const randRef = Date.now().toString().slice(-12);
                          setServiceTrxRef(randRef);
                          handleServicePaymentConfirm(randRef);
                        }}
                        className="px-3 py-1.5 bg-black text-white text-[9px] font-mono font-black uppercase hover:bg-neutral-800 transition-colors cursor-pointer text-center shrink-0 block w-full sm:w-auto font-bold animate-pulse"
                      >
                        ⚡ INSTANT SIMULATE PAYMENT
                      </button>
                    </div>

                    {/* MANUAL CONFIRM FORM INPUT */}
                    <div className="space-y-2 text-left">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600 font-mono">
                        Manually Verify Transaction Ref ID / UTR (12 Digits) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          maxLength={12}
                          value={serviceTrxRef}
                          onChange={(e) => setServiceTrxRef(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="e.g. 540294817502"
                          className="flex-1 px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black font-mono font-bold"
                        />
                        <button
                          type="button"
                          disabled={serviceTrxRef.length < 12 || isSubmitting}
                          onClick={() => handleServicePaymentConfirm(serviceTrxRef)}
                          className="px-4 py-2 bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs font-sans font-black uppercase tracking-wider disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white cursor-pointer"
                        >
                          SUBMIT
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setServiceStep("form")}
                      className="w-full text-center text-xs font-mono font-extrabold uppercase hover:underline text-neutral-500 mt-2 block"
                    >
                      &lt;&lt; BACK TO DETAILS FORM
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setServiceStep("payment");
                    }} 
                    className="space-y-4 font-mono text-xs font-bold uppercase"
                  >
                    <p className="text-neutral-500 font-sans tracking-tight leading-relaxed font-semibold normal-case">
                      Configure your details to submit your specialist ordering parameters. Service fee is <strong className="text-black font-black">{profile.consultationCurrency || "₹"}{selectedService.price.toLocaleString("en-IN")} total</strong>.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-black">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={serviceBookingForm.name}
                          onChange={(e) => setServiceBookingForm({ ...serviceBookingForm, name: e.target.value })}
                          placeholder="e.g. Jane Doe"
                          className="w-full px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black bg-stone-50"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-black">Your Email *</label>
                        <input
                          type="email"
                          required
                          value={serviceBookingForm.email}
                          onChange={(e) => setServiceBookingForm({ ...serviceBookingForm, email: e.target.value })}
                          placeholder="e.g. john@domain.com"
                          className="w-full px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black bg-stone-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-black">Project Description & Requirements</label>
                      <textarea
                        rows={3}
                        required
                        value={serviceBookingForm.notes}
                        onChange={(e) => setServiceBookingForm({ ...serviceBookingForm, notes: e.target.value })}
                        placeholder="Provide details about feature scope, deadlines, and project details..."
                        className="w-full px-3 py-2 border-2 border-black rounded-none text-xs bg-white text-black resize-none text-left font-sans bg-stone-50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-sans font-black uppercase tracking-widest text-xs cursor-pointer"
                    >
                      CONTINUE TO PAYMENT SIMULATOR
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

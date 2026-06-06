import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PortfolioView from "./components/PortfolioView";
import AdminCMS from "./components/AdminCMS";
import { PortfolioData, ContactMessage } from "./types";
import { initialPortfolioData } from "./initialData";

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Lazy load data from LocalStorage to ensure robust persistent states
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem("portfolio_cms_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new subfields like educations or certificates exist
        if (!parsed.educations) parsed.educations = initialPortfolioData.educations;
        if (!parsed.certificates) parsed.certificates = initialPortfolioData.certificates;
        if (!parsed.services) parsed.services = initialPortfolioData.services;
        if (!parsed.consultationTopics) parsed.consultationTopics = initialPortfolioData.consultationTopics;
        if (!parsed.socialLinks) {
          parsed.socialLinks = initialPortfolioData.socialLinks || [
            { id: "soc-1", platform: "GitHub", url: parsed.profile.githubUrl || "https://github.com" },
            { id: "soc-2", platform: "LinkedIn", url: parsed.profile.linkedinUrl || "https://linkedin.com" },
            { id: "soc-3", platform: "Twitter", url: parsed.profile.twitterUrl || "https://twitter.com" }
          ];
        }
        if (parsed.profile) {
          if (parsed.profile.consultationRate === undefined) parsed.profile.consultationRate = initialPortfolioData.profile.consultationRate;
          if (parsed.profile.consultationCurrency === undefined) parsed.profile.consultationCurrency = initialPortfolioData.profile.consultationCurrency;
          if (parsed.profile.upiId === undefined) parsed.profile.upiId = initialPortfolioData.profile.upiId;
          if (parsed.profile.heroImageUrl === undefined) parsed.profile.heroImageUrl = initialPortfolioData.profile.heroImageUrl;
          if (parsed.profile.animeTheme === undefined) parsed.profile.animeTheme = initialPortfolioData.profile.animeTheme;
          if (parsed.profile.qrImageUrl === undefined) parsed.profile.qrImageUrl = initialPortfolioData.profile.qrImageUrl;
        }
        return parsed;
      }
      return initialPortfolioData;
    } catch (e) {
      console.error("Error reading portfolio_cms_data from localStorage", e);
      return initialPortfolioData;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem("portfolio_cms_messages");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error reading portfolio_cms_messages from localStorage", e);
      return [];
    }
  });

  // Pull active synced databases from back-end server on load
  useEffect(() => {
    // 1. Rehydrate portfolio setup from MongoDB
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setData(resData.data);
          localStorage.setItem("portfolio_cms_data", JSON.stringify(resData.data));
        }
      })
      .catch((err) => console.warn("💡 Notice: Fetching portfolio setup from server is offline:", err.message));

    // 2. Rehydrate interaction inbox archives from MongoDB
    fetch("/api/messages")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setMessages(resData.data);
          localStorage.setItem("portfolio_cms_messages", JSON.stringify(resData.data));
        }
      })
      .catch((err) => console.warn("💡 Notice: Fetching interaction logs from server is offline:", err.message));
  }, []);

  // Watch portfolio configuration edits and sync to MongoDB back-end
  useEffect(() => {
    try {
      localStorage.setItem("portfolio_cms_data", JSON.stringify(data));

      fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            console.log("☁️ Successfully backend-synced portfolio with MongoDB!");
          }
        })
        .catch((err) => console.warn("💡 Back-end sync is currently queued:", err.message));
    } catch (e) {
      console.error("Error writing portfolio_cms_data to localStorage", e);
    }
  }, [data]);

  // Keep a local copy of incoming messages in LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("portfolio_cms_messages", JSON.stringify(messages));
    } catch (e) {
      console.error("Error writing portfolio_cms_messages to localStorage", e);
    }
  }, [messages]);

  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isCmsAuthorized, setIsCmsAuthorized] = useState(false);

  // Clear password inputs and verification state when exiting admin mode
  useEffect(() => {
    if (!isAdminMode) {
      setIsCmsAuthorized(false);
      setEnteredPassword("");
      setPasswordError(false);
    }
  }, [isAdminMode]);

  // Handle message submissions and transaction logs via MongoDB & SMTP Email alerts
  const handleAddNewMessage = (newMsg: Omit<ContactMessage, "id" | "timestamp" | "read">) => {
    // Save to Mongo DB and broadcast notifications simultaneously
    fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderName: newMsg.senderName,
        senderEmail: newMsg.senderEmail,
        subject: newMsg.subject || "Collaboration Alert",
        message: newMsg.message,
        isBooking: !!newMsg.isBooking,
        bookingAmountPaid: newMsg.bookingAmountPaid || 0
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          console.log("📨 Server success:", resData.message);
          // Add to react states dynamically
          setMessages((prev) => [resData.data, ...prev]);
        } else {
          console.error("⚠️ Server returned message receipt warning:", resData.error);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to contact message database registrar endpoint:", err);
      });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword === "Devi@3072415") {
      setIsCmsAuthorized(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Setup dynamic section active state tracker on scroll (only if not in admin mode)
  useEffect(() => {
    if (isAdminMode) return;

    const handleScroll = () => {
      const sections = ["home", "about", "projects", "education-certificates", "experience", "contact"];
      const scrollPosition = window.scrollY + 200; // Offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdminMode]);

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased flex flex-col justify-between selection:bg-black selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        portfolioName={data.profile.name}
      />

      {/* 2. Visual Content Area */}
      <main className="flex-1 mt-16">
        {isAdminMode ? (
          !isCmsAuthorized ? (
            /* SECURE PASSWORD ENTER DESK GATEWAY */
            <div className="min-h-[75vh] flex items-center justify-center px-4">
              <div className="border-4 border-black p-6 sm:p-10 w-full max-w-md bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-left space-y-6">
                <div className="border-b-2 border-black pb-3">
                  <h2 className="font-sans font-black text-xl uppercase tracking-tighter text-black flex items-center gap-2">
                    <span className="w-3.5 h-3.5 bg-black"></span>
                    CMS SECURITY LOCK
                  </h2>
                  <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest mt-1">
                    Authenticating master administrator
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 font-mono text-xs uppercase">
                  <div className="space-y-1.5 text-left">
                    <label className="block font-black text-neutral-600">Enter Admin Passcode *</label>
                    <input
                      type="password"
                      required
                      value={enteredPassword}
                      onChange={(e) => {
                        setEnteredPassword(e.target.value);
                        if (passwordError) setPasswordError(false);
                      }}
                      placeholder="•••••••••••••••"
                      className="w-full px-3 py-3 border-2 border-black text-xs font-mono font-bold bg-white text-black selection:bg-black selection:text-white focus:outline-none"
                    />
                  </div>

                  {passwordError && (
                    <p className="text-[10px] text-black font-black bg-neutral-100 p-2.5 border border-black uppercase tracking-wider">
                      &gt;&gt; Error: Invalid passcode declaration.
                    </p>
                  )}

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-black text-white hover:bg-white hover:text-black border-2 border-black font-sans font-black uppercase text-xs tracking-widest cursor-pointer transition-colors shadow-[2px_2px_0_0_rgba(150,150,150,1)] hover:shadow-none"
                    >
                      Unlock CMS Controls
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdminMode(false)}
                      className="w-full py-2.5 bg-white text-black hover:bg-neutral-100 border-2 border-black font-sans font-bold uppercase text-[11px] tracking-wider cursor-pointer transition-colors"
                    >
                      Return to portfolio
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <AdminCMS
              data={data}
              setData={setData}
              messages={messages}
              setMessages={setMessages}
              onExit={() => setIsAdminMode(false)}
            />
          )
        ) : (
          <PortfolioView 
            data={data} 
            onSubmitMessage={handleAddNewMessage} 
            activeSection={activeSection}
          />
        )}
      </main>

      {/* 3. Pure Stark Black & White Humanistic Footer */}
      <footer className="border-t-2 border-black bg-white py-12 transition-colors text-center shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 uppercase font-mono text-xs font-black tracking-wider">
            <p>
              &copy; {new Date().getFullYear()} {data.profile.name}. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2">
              <span>SYSTEM COMPILED WITH ZERO CODES</span>
              <span className="w-2.5 h-2.5 bg-black"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from "react";
import { Eye, Settings, Menu, X, LayoutGrid, Briefcase, User, Mail, GraduationCap, Archive } from "lucide-react";

interface NavbarProps {
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  portfolioName: string;
}

export default function Navbar({
  isAdminMode,
  setIsAdminMode,
  activeSection,
  setActiveSection,
  portfolioName
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: User },
    { id: "about", label: "About & Service", icon: Archive },
    { id: "projects", label: "Projects", icon: LayoutGrid },
    { id: "education-certificates", label: "Education & Certificates", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    // Smooth scroll as well for responsive compatibility
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b-2 border-black text-black">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between h-16 items-center">
          {/* Stark Monochromatic Title */}
          <div className="flex-shrink-0 flex items-center mr-6 lg:mr-10">
            <button 
              onClick={() => handleNavClick("home")}
              className="font-sans font-black text-lg sm:text-xl tracking-tighter text-black flex items-center gap-2 cursor-pointer uppercase whitespace-nowrap"
            >
              <span className="w-3 h-3 bg-black rounded-none shrink-0"></span>
              <span className="truncate max-w-[180px] sm:max-w-none">{portfolioName || "Portfolio"}</span>
            </button>
          </div>

          {/* Desktop Navigation (Stark Black and White style) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            {!isAdminMode ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 border border-transparent font-sans text-[10px] xl:text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        isActive
                           ? "bg-black text-white border-black"
                           : "text-black hover:border-black hover:bg-neutral-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </>
            ) : (
              <span className="text-xs font-mono font-black text-white bg-black px-3 py-1 uppercase tracking-widest border border-black whitespace-nowrap">
                CMS MODE ACTIVE
              </span>
            )}

            <div className="h-6 w-px bg-neutral-300 mx-2 xl:mx-4 shrink-0"></div>

            {/* Stark CMS Toggle Button */}
            <button
              id="cms-toggle-btn"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="flex items-center gap-2 px-3 xl:px-4 py-2 border-2 border-black text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer bg-white text-black whitespace-nowrap shrink-0"
            >
              {isAdminMode ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>VIEW PUBLIC</span>
                </>
              ) : (
                <>
                  <Settings className="w-3.5 h-3.5" />
                  <span>ADMIN</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile menu and CMS controls */}
          <div className="flex items-center lg:hidden gap-3">
            <button
              id="cms-toggle-mobile-btn"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-black text-[10px] font-black uppercase tracking-wide bg-black text-white"
            >
              {isAdminMode ? <Eye className="w-3 h-3" /> : <Settings className="w-3 h-3" />}
              <span>{isAdminMode ? "PUBLIC" : "ADMIN"}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-none border border-black bg-white text-black hover:bg-neutral-150 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && !isAdminMode && (
        <div id="mobile-menu" className="lg:hidden bg-white border-b-2 border-black px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 font-sans text-xs font-black uppercase tracking-wider border transition-colors ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "text-black border-transparent hover:bg-neutral-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

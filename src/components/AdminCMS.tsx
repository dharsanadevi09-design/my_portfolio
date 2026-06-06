import React, { useState } from "react";
import { 
  User, 
  Layers, 
  Briefcase, 
  Inbox, 
  Database,
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CornerDownRight, 
  FileDown, 
  FileUp, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Check,
  EyeOff,
  GraduationCap,
  Award,
  DollarSign,
  BookOpen,
  Share2
} from "lucide-react";
import { PortfolioData, Project, Experience, ContactMessage, SkillCategory, Education, Certificate, SocialLink } from "../types";
import { initialPortfolioData } from "../initialData";

interface AdminCMSProps {
  data: PortfolioData;
  setData: (data: PortfolioData) => void;
  messages: ContactMessage[];
  setMessages: (messages: ContactMessage[]) => void;
  onExit: () => void;
}

export default function AdminCMS({ data, setData, messages, setMessages, onExit }: AdminCMSProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "skills" | "projects" | "experience" | "education" | "certificates" | "services" | "consultationTopics" | "messages" | "backup" | "socials">("profile");
  const [notification, setNotification] = useState<{ text: string; type: "success" | "info" } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // States for Adding/Editing Social Links
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialForm, setSocialForm] = useState({ platform: "GitHub", url: "" });
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  // States for Adding/Editing Consultation Topics
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [topicForm, setTopicForm] = useState("");

  // States for Adding/Editing Services
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<any>({
    title: "",
    description: "",
    price: 1500
  });

  // States for Adding/Editing Projects
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<Project, "id">>({
    title: "",
    category: "",
    description: "",
    techStack: [],
    demoUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false
  });
  const [projectTechInput, setProjectTechInput] = useState("");

  // States for Adding/Editing Experience
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [experienceForm, setExperienceForm] = useState<Omit<Experience, "id">>({
    role: "",
    company: "",
    location: "",
    duration: "",
    description: "",
    current: false
  });

  // States for Adding/Editing Education
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [educationForm, setEducationForm] = useState<Omit<Education, "id">>({
    degree: "",
    school: "",
    duration: "",
    description: "",
    grade: ""
  });

  // States for Adding/Editing Certificate
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [certificateForm, setCertificateForm] = useState<Omit<Certificate, "id">>({
    title: "",
    issuer: "",
    issueDate: "",
    credentialUrl: ""
  });

  // State for new Skill Categories
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSkillInputs, setNewSkillInputs] = useState<{ [catId: string]: string }>({});
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingSkillInfo, setEditingSkillInfo] = useState<{ catId: string; index: number } | null>(null);
  const [editingSkillName, setEditingSkillName] = useState("");

  const showNotification = (text: string, type: "success" | "info" = "success") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Profile Save
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Handle consultationRate as numeric value manually
    if (name === "consultationRate") {
      setData({
        ...data,
        profile: {
          ...data.profile,
          consultationRate: parseFloat(value) || 0
        }
      });
      return;
    }

    setData({
      ...data,
      profile: {
        ...data.profile,
        [name]: value
      }
    });
  };

  // Skill Management
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCategory: SkillCategory = {
      id: "cat-" + Date.now(),
      name: newCategoryName.trim(),
      items: []
    };

    setData({
      ...data,
      skills: [...data.skills, newCategory]
    });
    setNewCategoryName("");
    showNotification("Created new skill category: " + newCategory.name);
  };

  const handleDeleteCategory = (catId: string) => {
    setData({
      ...data,
      skills: data.skills.filter((cat) => cat.id !== catId)
    });
    showNotification("Deleted skill category", "info");
  };

  const handleAddSkillToCategory = (catId: string) => {
    const skillName = newSkillInputs[catId] || "";
    if (!skillName.trim()) return;

    setData({
      ...data,
      skills: data.skills.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            items: [...cat.items, skillName.trim()]
          };
        }
        return cat;
      })
    });

    setNewSkillInputs({
      ...newSkillInputs,
      [catId]: ""
    });
    showNotification("Skill added successfully!");
  };

  const handleDeleteSkill = (catId: string, itemIdx: number) => {
    setData({
      ...data,
      skills: data.skills.map((cat) => {
        if (cat.id === catId) {
          const updatedItems = [...cat.items];
          updatedItems.splice(itemIdx, 1);
          return {
            ...cat,
            items: updatedItems
          };
        }
        return cat;
      })
    });
    showNotification("Skill deleted", "info");
  };

  const handleEditCategoryName = (catId: string, currentName: string) => {
    setEditingCategoryId(catId);
    setEditingCategoryName(currentName);
  };

  const handleSaveCategoryName = (catId: string) => {
    if (!editingCategoryName.trim()) return;
    setData({
      ...data,
      skills: data.skills.map((cat) => 
        cat.id === catId ? { ...cat, name: editingCategoryName.trim() } : cat
      )
    });
    setEditingCategoryId(null);
    setEditingCategoryName("");
    showNotification("Skill category renamed successfully!");
  };

  const handleEditSkillName = (catId: string, index: number, currentName: string) => {
    setEditingSkillInfo({ catId, index });
    setEditingSkillName(currentName);
  };

  const handleSaveSkillName = () => {
    if (!editingSkillInfo || !editingSkillName.trim()) return;
    const { catId, index } = editingSkillInfo;

    setData({
      ...data,
      skills: data.skills.map((cat) => {
        if (cat.id === catId) {
          const updatedItems = [...cat.items];
          updatedItems[index] = editingSkillName.trim();
          return {
            ...cat,
            items: updatedItems
          };
        }
        return cat;
      })
    });

    setEditingSkillInfo(null);
    setEditingSkillName("");
    showNotification("Skill item updated successfully!");
  };

  // Projects Lifecycle
  const openEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      category: proj.category,
      description: proj.description,
      techStack: proj.techStack,
      demoUrl: proj.demoUrl,
      githubUrl: proj.githubUrl,
      imageUrl: proj.imageUrl,
      featured: proj.featured
    });
    setProjectTechInput(proj.techStack.join(", "));
    setIsAddingProject(false);
  };

  const openAddProject = () => {
    setIsAddingProject(true);
    setEditingProject(null);
    setProjectForm({
      title: "",
      category: "",
      description: "",
      techStack: [],
      demoUrl: "",
      githubUrl: "",
      imageUrl: "",
      featured: false
    });
    setProjectTechInput("");
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedTech = projectTechInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const submissionData = {
      ...projectForm,
      techStack: processedTech
    };

    if (isAddingProject) {
      const newProj: Project = {
        id: "proj-" + Date.now(),
        ...submissionData
      };
      setData({
        ...data,
        projects: [...data.projects, newProj]
      });
      showNotification(`Project "${newProj.title}" added successfully!`);
      setIsAddingProject(false);
    } else if (editingProject) {
      setData({
        ...data,
        projects: data.projects.map((p) => 
          p.id === editingProject.id ? { ...p, ...submissionData } : p
        )
      });
      showNotification(`Saved changes for "${submissionData.title}"`);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = (projId: string) => {
    const project = data.projects.find((p) => p.id === projId);
    setConfirmModal({
      isOpen: true,
      title: "Delete Curated Project",
      description: `Are you sure you want to permanently delete the project "${project?.title || "selected project"}"? This operation is irreversible inside your local states.`,
      onConfirm: () => {
        setData({
          ...data,
          projects: data.projects.filter((p) => p.id !== projId)
        });
        showNotification("Project deleted successfully.", "info");
        if (editingProject?.id === projId) setEditingProject(null);
        setConfirmModal(null);
      }
    });
  };

  // Experience Lifecycle
  const openEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setExperienceForm({
      role: exp.role,
      company: exp.company,
      location: exp.location,
      duration: exp.duration,
      description: exp.description,
      current: exp.current
    });
    setIsAddingExperience(false);
  };

  const openAddExperience = () => {
    setIsAddingExperience(true);
    setEditingExperience(null);
    setExperienceForm({
      role: "",
      company: "",
      location: "",
      duration: "",
      description: "",
      current: false
    });
  };

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingExperience) {
      const newExp: Experience = {
        id: "exp-" + Date.now(),
        ...experienceForm
      };
      setData({
        ...data,
        experiences: [...data.experiences, newExp]
      });
      showNotification(`Experience with "${newExp.company}" recorded!`);
      setIsAddingExperience(false);
    } else if (editingExperience) {
      setData({
        ...data,
        experiences: data.experiences.map((exp) => 
          exp.id === editingExperience.id ? { ...exp, ...experienceForm } : exp
        )
      });
      showNotification(`Updated experience with "${experienceForm.company}"`);
      setEditingExperience(null);
    }
  };

  const handleDeleteExperience = (expId: string) => {
    const exp = data.experiences.find((e) => e.id === expId);
    setConfirmModal({
      isOpen: true,
      title: "Delete Work History",
      description: `Are you sure you want to permanently delete your engineering/design work role "${exp?.role || "selected experience"}" at "${exp?.company || "selected company"}"? This operation cannot be undone.`,
      onConfirm: () => {
        setData({
          ...data,
          experiences: data.experiences.filter((e) => e.id !== expId)
        });
        showNotification("Work experience entry deleted.", "info");
        if (editingExperience?.id === expId) setEditingExperience(null);
        setConfirmModal(null);
      }
    });
  };

  // Education Lifecycle
  const openEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setEducationForm({
      degree: edu.degree,
      school: edu.school,
      duration: edu.duration,
      description: edu.description,
      grade: edu.grade || ""
    });
    setIsAddingEducation(false);
  };

  const openAddEducation = () => {
    setIsAddingEducation(true);
    setEditingEducation(null);
    setEducationForm({
      degree: "",
      school: "",
      duration: "",
      description: "",
      grade: ""
    });
  };

  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingEducation) {
      const newEdu: Education = {
        id: "edu-" + Date.now(),
        ...educationForm
      };
      setData({
        ...data,
        educations: [...(data.educations || []), newEdu]
      });
      showNotification(`Academic record with "${newEdu.school}" added!`);
      setIsAddingEducation(false);
    } else if (editingEducation) {
      setData({
        ...data,
        educations: (data.educations || []).map((edu) => 
          edu.id === editingEducation.id ? { ...edu, ...educationForm } : edu
        )
      });
      showNotification(`Saved academic changes for "${educationForm.degree}"`);
      setEditingEducation(null);
    }
  };

  const handleDeleteEducation = (eduId: string) => {
    const edu = (data.educations || []).find((e) => e.id === eduId);
    setConfirmModal({
      isOpen: true,
      title: "Delete Education Record",
      description: `Are you sure you want to permanently delete the academic chronicle "${edu?.degree || "degree"}" from "${edu?.school || "selected school"}"? This operation cannot be undone.`,
      onConfirm: () => {
        setData({
          ...data,
          educations: (data.educations || []).filter((e) => e.id !== eduId)
        });
        showNotification("Education record deleted.", "info");
        if (editingEducation?.id === eduId) setEditingEducation(null);
        setConfirmModal(null);
      }
    });
  };

  // Certificates Lifecycle
  const openEditCertificate = (cert: Certificate) => {
    setEditingCertificate(cert);
    setCertificateForm({
      title: cert.title,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      credentialUrl: cert.credentialUrl
    });
    setIsAddingCertificate(false);
  };

  const openAddCertificate = () => {
    setIsAddingCertificate(true);
    setEditingCertificate(null);
    setCertificateForm({
      title: "",
      issuer: "",
      issueDate: "",
      credentialUrl: ""
    });
  };

  const handleCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingCertificate) {
      const newCert: Certificate = {
        id: "cert-" + Date.now(),
        ...certificateForm
      };
      setData({
        ...data,
        certificates: [...(data.certificates || []), newCert]
      });
      showNotification(`Certificate "${newCert.title}" registered!`);
      setIsAddingCertificate(false);
    } else if (editingCertificate) {
      setData({
        ...data,
        certificates: (data.certificates || []).map((c) => 
          c.id === editingCertificate.id ? { ...c, ...certificateForm } : c
        )
      });
      showNotification(`Saved changes for Certificate: "${certificateForm.title}"`);
      setEditingCertificate(null);
    }
  };

  const handleDeleteCertificate = (certId: string) => {
    const cert = (data.certificates || []).find((c) => c.id === certId);
    setConfirmModal({
      isOpen: true,
      title: "Delete Certification Credentials",
      description: `Are you sure you want to permanently remove the certificate/achievement "${cert?.title || "achievement"}" issued by "${cert?.issuer || "issuer"}"? This operation cannot be undone.`,
      onConfirm: () => {
        setData({
          ...data,
          certificates: (data.certificates || []).filter((c) => c.id !== certId)
        });
        showNotification("Certificate removed.", "info");
        if (editingCertificate?.id === certId) setEditingCertificate(null);
        setConfirmModal(null);
      }
    });
  };

  // Services Lifecycle
  const openEditService = (service: any) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      price: service.price
    });
    setIsAddingService(false);
  };

  const openAddService = () => {
    setIsAddingService(true);
    setEditingService(null);
    setServiceForm({
      title: "",
      description: "",
      price: 1500
    });
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      title: serviceForm.title,
      description: serviceForm.description,
      price: Number(serviceForm.price) || 0
    };

    const currentServices = data.services || [];

    if (isAddingService) {
      const newService = {
        id: "ser-" + Date.now(),
        ...submissionData
      };
      setData({
        ...data,
        services: [...currentServices, newService]
      });
      showNotification(`Service "${newService.title}" created successfully!`);
      setIsAddingService(false);
    } else if (editingService) {
      setData({
        ...data,
        services: currentServices.map((s) => 
          s.id === editingService.id ? { ...s, ...submissionData } : s
        )
      });
      showNotification(`Saved changes for "${submissionData.title}"`);
      setEditingService(null);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    const service = (data.services || []).find((s) => s.id === serviceId);
    setConfirmModal({
      isOpen: true,
      title: "Delete Service Package",
      description: `Are you sure you want to permanently remove the specialized service deliverable "${service?.title || "selected package"}"? Clients will no longer be able to submit bookings for this deliverable.`,
      onConfirm: () => {
        const currentServices = data.services || [];
        setData({
          ...data,
          services: currentServices.filter((s) => s.id !== serviceId)
        });
        showNotification("Service package deleted.", "info");
        if (editingService?.id === serviceId) setEditingService(null);
        setConfirmModal(null);
      }
    });
  };

  // Consultation Topics Lifecycle Handlers
  const openEditTopic = (index: number) => {
    setEditingTopicIndex(index);
    setTopicForm(data.consultationTopics?.[index] || "");
    setIsAddingTopic(false);
  };

  const openAddTopic = () => {
    setIsAddingTopic(true);
    setEditingTopicIndex(null);
    setTopicForm("");
  };

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTopic = topicForm.trim();
    if (!cleanTopic) return;

    const currentTopics = data.consultationTopics || [];

    if (isAddingTopic) {
      setData({
        ...data,
        consultationTopics: [...currentTopics, cleanTopic]
      });
      showNotification(`Topic "${cleanTopic}" added successfully!`);
      setIsAddingTopic(false);
    } else if (editingTopicIndex !== null) {
      setData({
        ...data,
        consultationTopics: currentTopics.map((t, idx) => 
          idx === editingTopicIndex ? cleanTopic : t
        )
      });
      showNotification(`Saved changes for topic`);
      setEditingTopicIndex(null);
    }
    setTopicForm("");
  };

  const handleDeleteTopic = (index: number) => {
    const topic = data.consultationTopics?.[index];
    setConfirmModal({
      isOpen: true,
      title: "Delete Consultation Topic",
      description: `Are you sure you want to permanently delete the consultation session topic option "${topic || "selected option"}"? It will be removed from available selection menus on the scheduler form.`,
      onConfirm: () => {
        const currentTopics = data.consultationTopics || [];
        setData({
          ...data,
          consultationTopics: currentTopics.filter((_, idx) => idx !== index)
        });
        showNotification("Consultation topic deleted.", "info");
        if (editingTopicIndex === index) setEditingTopicIndex(null);
        setConfirmModal(null);
      }
    });
  };

  // Social Links Lifecycle Handlers
  const openEditSocial = (link: SocialLink) => {
    setEditingSocialId(link.id);
    setSocialForm({ platform: link.platform, url: link.url });
    setIsAddingSocial(false);
  };

  const openAddSocial = () => {
    setIsAddingSocial(true);
    setEditingSocialId(null);
    setSocialForm({ platform: "GitHub", url: "" });
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPlatform = socialForm.platform.trim();
    const cleanUrl = socialForm.url.trim();
    if (!cleanPlatform || !cleanUrl) return;

    const currentSocials = data.socialLinks || [];

    if (isAddingSocial) {
      const newLink: SocialLink = {
        id: "soc-" + Date.now(),
        platform: cleanPlatform,
        url: cleanUrl
      };
      setData({
        ...data,
        socialLinks: [...currentSocials, newLink]
      });
      showNotification(`Social connection for "${cleanPlatform}" added successfully!`);
      setIsAddingSocial(false);
    } else if (editingSocialId !== null) {
      setData({
        ...data,
        socialLinks: currentSocials.map((s) =>
          s.id === editingSocialId ? { ...s, platform: cleanPlatform, url: cleanUrl } : s
        )
      });
      showNotification(`Saved changes for social link`);
      setEditingSocialId(null);
    }
    setSocialForm({ platform: "GitHub", url: "" });
  };

  const handleDeleteSocial = (id: string) => {
    const link = (data.socialLinks || []).find((s) => s.id === id);
    setConfirmModal({
      isOpen: true,
      title: "Delete Social Link",
      description: `Are you sure you want to delete your connection to "${link?.platform || "selected network"}" (${link?.url || ""})? This will unlink it from your public portfolio view immediately.`,
      onConfirm: () => {
        const currentSocials = data.socialLinks || [];
        setData({
          ...data,
          socialLinks: currentSocials.filter((s) => s.id !== id)
        });
        showNotification("Social connect unlinked successfully.", "info");
        if (editingSocialId === id) setEditingSocialId(null);
        setConfirmModal(null);
      }
    });
  };

  // Messages Management
  const markMessageAsRead = (id: string) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
    fetch(`/api/messages/${id}/read`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true })
    }).catch((e) => console.error("Failed to sync message read status server-side:", e));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    showNotification("Message deleted from portfolio inbox", "info");
    fetch(`/api/messages/${id}`, {
      method: "DELETE"
    }).catch((e) => console.error("Failed to sync message deletion server-side:", e));
  };

  // Database Backup / Reset Actions
  const exportPortfolioData = () => {
    const backupObj = {
      version: "1.1",
      backupDate: new Date().toISOString(),
      portfolio: data,
      messages: messages
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupObj, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `portfolio_backup_${data.profile.name.toLowerCase().replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification("Backup JSON downloaded locally!");
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.portfolio) {
          setData(parsed.portfolio);
          if (parsed.messages) setMessages(parsed.messages);
          showNotification("Portfolio configuration restored successfully!", "success");
        } else {
          alert("Invalid backup schema. 'portfolio' object is missing.");
        }
      } catch (err) {
        alert("Fail to parse backup JSON file. Ensure the contents are well formed.");
      }
    };
  };

  const handleResetData = () => {
    setConfirmModal({
      isOpen: true,
      title: "Hard Reset Active System Database",
      description: "Are you sure you want to restore the entire portfolio database to raw factory defaults? This will permanently wipe out all customized bio, skills arrays, project updates, educational entries, client message logs, and certificates.",
      onConfirm: () => {
        setData(initialPortfolioData);
        setMessages([]);
        fetch("/api/messages/all", { method: "DELETE" })
          .catch((e) => console.error("Failed to sync reset to DB:", e));
        showNotification("Portfolio database completely reset to default state.", "info");
        setConfirmModal(null);
      }
    });
  };

  // Navigation Items
  const cmsTabs = [
    { id: "profile", label: "Profile Basics", icon: User },
    { id: "skills", label: "Specialized Skills", icon: Layers },
    { id: "projects", label: "Projects Database", icon: Sparkles },
    { id: "experience", label: "Job Milestones", icon: Briefcase },
    { id: "education", label: "Schooling History", icon: GraduationCap },
    { id: "certificates", label: "Certifications", icon: Award },
    { id: "services", label: "Services Catalog", icon: DollarSign },
    { id: "consultationTopics", label: "Consultation Topics", icon: BookOpen },
    { id: "socials", label: "Social Networks", icon: Share2 },
    { id: "messages", label: "Direct Inbox", count: messages.filter((m) => !m.read).length, icon: Inbox },
    { id: "backup", label: "Storage & Backup", icon: Database },
  ] as const;

  return (
    <div className="pt-20 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black bg-white">
      
      {/* Header Panel */}
      <div className="bg-white border-2 border-black p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-black text-2xl tracking-tighter uppercase">
              Dashboard Content Manager
            </h1>
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase tracking-widest border border-black">
              CMS V1.1
            </span>
          </div>
          <p className="text-neutral-500 text-xs font-mono">
            Control headlines, consult metrics, jobs, degrees, credentials, and track client request records.
          </p>
        </div>
        
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
        >
          <EyeOff className="w-4 h-4" />
          Close CMS Workspace
        </button>
      </div>

      {notification && (
        <div className="mb-6 p-4 border-2 border-black font-mono text-xs font-black bg-black text-white uppercase tracking-wider flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-white inline-block animate-ping"></span>
          {notification.text}
        </div>
      )}

      {/* Main Grid Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sub-navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] space-y-1">
            {cmsTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider border transition-all duration-150 ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "text-black border-transparent hover:bg-neutral-100 hover:border-black"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </span>
                  {"count" in tab && tab.count && tab.count > 0 ? (
                    <span className="px-2 py-0.5 bg-black text-white text-[10px] font-black border border-white animate-bounce">
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="bg-white p-4 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] space-y-1.5 text-left font-sans">
            <h4 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-black pb-1 mb-2">
              💡 System Note
            </h4>
            <p className="text-neutral-500 text-[11px] leading-relaxed font-semibold">
              Erase custom content or restore backup configurations locally in the Backup tab. All client message booking schedules automatically appear in the Direct Inbox tab with total billable costs.
            </p>
          </div>
        </div>

        {/* Editor Form Panel */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
          
          {/* PROFILE TAB PANEL */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4 text-left">
                <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Profile & Consultation Basics</h2>
                <p className="text-neutral-500 text-xs font-mono">Control landing rates, email credentials, social nodes, and bio details.</p>
              </div>

              {/* Consultation Pricing & UPI Payment Setup (Enkitta pesurathukku amount and payment upi id set pannura mathiri) */}
              <div className="p-4 border-2 border-black bg-neutral-50 text-left space-y-4">
                <h3 className="font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 text-black border-b border-black pb-1">
                  <DollarSign className="w-4 h-4" />
                  Hourly Consultation & UPI Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-600">Hourly Rate Price</label>
                    <input
                      type="number"
                      name="consultationRate"
                      value={data.profile.consultationRate}
                      onChange={handleProfileChange}
                      min={0}
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-600">Currency Symbol</label>
                    <input
                      type="text"
                      name="consultationCurrency"
                      value={data.profile.consultationCurrency || "₹"}
                      onChange={handleProfileChange}
                      placeholder="₹"
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-600">UPI ID for Direct Audits</label>
                    <input
                      type="text"
                      name="upiId"
                      value={data.profile.upiId || ""}
                      onChange={handleProfileChange}
                      placeholder="e.g. yourname@ybl"
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-600">UPI QR Scanner Image URL / Link</label>
                    <input
                      type="text"
                      name="qrImageUrl"
                      value={data.profile.qrImageUrl || ""}
                      onChange={handleProfileChange}
                      placeholder="e.g. https://api.qrserver.com/v1/... (or custom image URL)"
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black bg-stone-50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={data.profile.name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Professional Title</label>
                  <input
                    type="text"
                    name="title"
                    value={data.profile.title}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Landing Pitch Headline</label>
                <input
                  type="text"
                  name="headline"
                  value={data.profile.headline}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">In-Depth Professional Bio (Tamil / English)</label>
                <textarea
                  name="bio"
                  rows={4}
                  value={data.profile.bio}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Professional Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={data.profile.email}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Base Location</label>
                  <input
                    type="text"
                    name="location"
                    value={data.profile.location}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Profile Photo URL</label>
                  <input
                    type="text"
                    name="avatarUrl"
                    value={data.profile.avatarUrl}
                    onChange={handleProfileChange}
                    placeholder="https://unsplash..."
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                  />
                </div>

                {/* Resume URL edit (Resume pakkura mathiri link file edit) */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Resume Link / URL</label>
                  <input
                    type="text"
                    name="resumeUrl"
                    value={data.profile.resumeUrl}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                  />
                </div>
              </div>

              {/* Homepage Visual Creative Config Panel (Anime loop background and right side hero image) */}
              <div className="p-4 border-2 border-black bg-neutral-50 text-left space-y-4">
                <h3 className="font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 text-black border-b border-black pb-1">
                  <Sparkles className="w-4 h-4 text-black" />
                  Homepage Hero Settings & Background Animation Loops
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Right-side Hero Image URL</label>
                    <input
                      type="text"
                      name="heroImageUrl"
                      value={data.profile.heroImageUrl || ""}
                      onChange={handleProfileChange}
                      placeholder="Paste image web link..."
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                    />
                    {data.profile.heroImageUrl && (
                      <div className="mt-2 text-[10px] font-mono text-neutral-400 uppercase">
                        Preview:
                        <img 
                          src={data.profile.heroImageUrl} 
                          alt="Hero Preview" 
                          className="mt-1 w-20 h-10 object-cover border border-black grayscale rounded-none" 
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600">Background Animation Loop Theme</label>
                    <select
                      name="animeTheme"
                      value={data.profile.animeTheme || "matrix"}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                    >
                      <option value="matrix">💻 Digital Matrix Rain Codes</option>
                      <option value="stars">✨ Constellation Floating Starfield</option>
                      <option value="particles">🟡 Floating Soft Bubble Circles</option>
                      <option value="floating-terms">⚛️ Orbiting Active Tech Terms</option>
                    </select>
                    <p className="text-[10px] text-neutral-500 font-mono mt-1">Changes visual particle physics looping in homepage background.</p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-black pt-6 text-left">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4">Social Network Nodes</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-neutral-600 uppercase">GitHub Profile URL</label>
                    <input
                      type="text"
                      name="githubUrl"
                      value={data.profile.githubUrl}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-neutral-600 uppercase">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      name="linkedinUrl"
                      value={data.profile.linkedinUrl}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-neutral-600 uppercase">Twitter Profile URL</label>
                    <input
                      type="text"
                      name="twitterUrl"
                      value={data.profile.twitterUrl}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <div className="flex items-center gap-1.5 text-xs font-mono font-black text-white bg-black px-3 py-2 border border-black uppercase tracking-wider">
                  <Check className="w-4 h-4" />
                  <span>Caches Auto-synced!</span>
                </div>
              </div>
            </div>
          )}

          {/* SKILLS TAB PANEL */}
          {activeTab === "skills" && (
            <div className="space-y-8">
              <div className="border-b-2 border-black pb-4 text-left">
                <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Skills Matrix Desk</h2>
                <p className="text-neutral-500 text-xs font-mono">Organize technical stacks, designer elements, or software packages into categories.</p>
              </div>

              {/* Create Category Form */}
              <form onSubmit={handleAddCategory} className="border-2 border-black p-4 bg-neutral-50 flex flex-col sm:flex-row items-end gap-3 text-left">
                <div className="flex-1 space-y-1.5 w-full">
                  <label className="block text-[10px] font-black text-neutral-600 uppercase">Create New Category Name</label>
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Frontend Engineering, Databases"
                    className="w-full px-3 py-2 border-2 border-black font-mono text-xs bg-white text-black"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black rounded-none text-xs font-black uppercase tracking-wider shrink-0 h-10 w-full sm:w-auto"
                >
                  Create
                </button>
              </form>

              {/* Category Cards Workspace */}
              <div className="space-y-6">
                {data.skills.map((category) => (
                  <div
                    key={category.id}
                    className="p-5 border-2 border-black bg-white space-y-4 text-left shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                      <div className="flex-1 mr-4">
                        {editingCategoryId === category.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingCategoryName}
                              onChange={(e) => setEditingCategoryName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveCategoryName(category.id);
                                } else if (e.key === "Escape") {
                                  setEditingCategoryId(null);
                                }
                              }}
                              className="px-3 py-1 border-2 border-black font-sans font-black text-sm bg-stone-50 text-black max-w-sm"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveCategoryName(category.id)}
                              className="px-2 py-1 bg-black text-white border border-black font-mono text-[10px] uppercase font-bold cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategoryId(null)}
                              className="px-2 py-1 bg-white text-black border border-neutral-300 hover:bg-stone-50 font-mono text-[10px] uppercase font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-3.5 h-3.5 bg-black"></span>
                            <h4 className="font-sans font-black text-base uppercase">
                              {category.name}
                            </h4>
                            <span className="text-[10px] font-mono font-black text-neutral-400 uppercase">
                              ({category.items.length} tags)
                            </span>
                            <button
                              onClick={() => handleEditCategoryName(category.id, category.name)}
                              className="p-1 hover:bg-stone-100 text-neutral-500 hover:text-black rounded cursor-pointer"
                              title="Rename category"
                              type="button"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* Skill items manager */}
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill, index) => {
                        const isEditingSkill = editingSkillInfo?.catId === category.id && editingSkillInfo?.index === index;
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black font-mono text-[11px] font-semibold text-black bg-neutral-50"
                          >
                            {isEditingSkill ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={editingSkillName}
                                  onChange={(e) => setEditingSkillName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleSaveSkillName();
                                    } else if (e.key === "Escape") {
                                      setEditingSkillInfo(null);
                                    }
                                  }}
                                  className="px-1.5 py-0.5 border border-black bg-stone-50 font-mono text-xs max-w-[120px]"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={handleSaveSkillName}
                                  className="px-1.5 py-0.5 bg-black text-white border border-black text-[9px] uppercase font-bold cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSkillInfo(null)}
                                  className="px-1.5 py-0.5 bg-white text-black border border-neutral-300 text-[9px] uppercase font-bold cursor-pointer"
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <>
                                <span>{skill}</span>
                                <button
                                  onClick={() => handleEditSkillName(category.id, index, skill)}
                                  className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
                                  title="Edit skill name"
                                  type="button"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(category.id, index)}
                                  className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
                                  title="Delete skill"
                                  type="button"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </span>
                        );
                      })}

                      {category.items.length === 0 && (
                        <p className="text-xs text-neutral-400 italic">No skills cataloged in this array.</p>
                      )}
                    </div>

                    {/* Add skill item in-line */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="e.g. GraphQL, AWS..."
                        value={newSkillInputs[category.id] || ""}
                        onChange={(e) => 
                          setNewSkillInputs({
                            ...newSkillInputs,
                            [category.id]: e.target.value
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkillToCategory(category.id);
                          }
                        }}
                        className="flex-1 max-w-xs px-3 py-1.5 border border-black font-mono text-xs bg-white text-black"
                      />
                      <button
                        onClick={() => handleAddSkillToCategory(category.id)}
                        className="px-3 py-1.5 border border-black bg-black text-white hover:bg-white hover:text-black font-black text-[11px] uppercase tracking-wider cursor-pointer font-sans"
                      >
                        Insert Skill
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS TAB PANEL */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4 flex justify-between items-center text-left">
                <div>
                  <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight font-black">Curated Portfolio Projects</h2>
                  <p className="text-neutral-500 text-xs font-mono">Insert, edit, or eliminate code showcases on the timeline board.</p>
                </div>

                {!isAddingProject && !editingProject && (
                  <button
                    onClick={openAddProject}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-[2px_2px_0_0_rgba(100,100,100,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                )}
              </div>

              {/* Add/Edit Project Form Workspace */}
              {(isAddingProject || editingProject) && (
                <form onSubmit={handleProjectSubmit} className="border-2 border-black bg-neutral-50 p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-black pb-3">
                    <h3 className="font-sans font-black text-sm uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4.5 h-4.5" />
                      {isAddingProject ? "Create New Project" : `Edit Project: ${editingProject?.title}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="text-neutral-500 hover:text-black text-xs font-semibold"
                    >
                      Dismiss Form
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        placeholder="e.g. Clarity Management Tool"
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Category Tag *</label>
                      <input
                        type="text"
                        required
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        placeholder="e.g. SaaS Platform"
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left font-mono text-xs uppercase">
                    <label className="block text-[10px] font-black text-neutral-600">Description narrative *</label>
                    <textarea
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Details of what the project does..."
                      className="w-full px-3 py-2 border-2 border-black bg-white text-black resize-none"
                    />
                  </div>

                  <div className="space-y-1 text-left font-mono text-xs uppercase">
                    <label className="block text-[10px] font-black text-neutral-600">Tech Stack (comma-separated list)</label>
                    <input
                      type="text"
                      value={projectTechInput}
                      onChange={(e) => setProjectTechInput(e.target.value)}
                      placeholder="React, Tailwind, Express, PostgreSQL"
                      className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Project Image URL</label>
                      <input
                        type="text"
                        value={projectForm.imageUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        placeholder="https://unsplash..."
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Featured</label>
                      <div className="flex items-center h-10">
                        <input
                          type="checkbox"
                          id="featured-check"
                          checked={projectForm.featured}
                          onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                          className="w-4 h-4 border-2 border-black text-black focus:ring-0 rounded-none bg-white cursor-pointer"
                        />
                        <label htmlFor="featured-check" className="ml-2 font-bold text-neutral-605 cursor-pointer">
                          Display Featured Badge
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Live Demo Link</label>
                      <input
                        type="text"
                        value={projectForm.demoUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                        placeholder="https://live-website..."
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">GitHub Code Link</label>
                      <input
                        type="text"
                        value={projectForm.githubUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                        placeholder="https://github.com..."
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 font-sans text-xs font-black uppercase">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(false);
                        setEditingProject(null);
                      }}
                      className="px-4 py-2 border border-black hover:bg-neutral-100 uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black uppercase"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              )}

              {/* Projects List Workspace */}
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 border-2 border-black flex items-center justify-between gap-4 bg-white mt-1 text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-neutral-100 border border-black overflow-hidden flex-shrink-0">
                        {proj.imageUrl ? (
                          <img src={proj.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans font-black text-sm truncate uppercase">
                            {proj.title}
                          </h4>
                          {proj.featured && (
                            <span className="px-1.5 py-0.5 bg-black text-white text-[8px] font-black uppercase font-mono border">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-500 text-[11px] truncate font-mono">
                          {proj.category} • {proj.techStack.slice(0,3).join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditProject(proj)}
                        className="p-1.5 border border-black text-black hover:bg-neutral-100"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 border border-black text-neutral-400 hover:text-black hover:bg-neutral-100"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIMELINE HISTORY EXPERIENCE TAB PANEL */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="border-b-2 border-black pb-4 flex justify-between items-center text-left">
                <div>
                  <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Timeline Career Milestones</h2>
                  <p className="text-neutral-500 text-xs font-mono">Define organizations, roles, responsibilities, and timeline durations.</p>
                </div>

                {!isAddingExperience && !editingExperience && (
                  <button
                    onClick={openAddExperience}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider cursor-pointer animate-pulse"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Job
                  </button>
                )}
              </div>

              {/* Add/Edit Experience Form */}
              {(isAddingExperience || editingExperience) && (
                <form onSubmit={handleExperienceSubmit} className="border-2 border-black bg-neutral-50 p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-black pb-3">
                    <h3 className="font-sans font-black text-sm uppercase flex items-center gap-1.5">
                      <Briefcase className="w-4.5 h-4.5" />
                      {isAddingExperience ? "Create New Experience" : `Edit Job: ${editingExperience?.company}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingExperience(false);
                        setEditingExperience(null);
                      }}
                      className="text-neutral-500 hover:text-black text-xs font-bold"
                    >
                      Dismiss Form
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Role / Position *</label>
                      <input
                        type="text"
                        required
                        value={experienceForm.role}
                        onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={experienceForm.company}
                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Duration (e.g. 2022 - Present) *</label>
                      <input
                        type="text"
                        required
                        value={experienceForm.duration}
                        onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-black text-neutral-600">Location Base *</label>
                      <input
                        type="text"
                        required
                        value={experienceForm.location}
                        onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs uppercase">
                    <label className="block text-[10px] font-black text-neutral-600">Job DescriptionResponsibilities *</label>
                    <textarea
                      required
                      rows={3}
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black bg-white text-black resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2 font-sans text-xs font-black uppercase">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingExperience(false);
                        setEditingExperience(null);
                      }}
                      className="px-4 py-2 border border-black hover:bg-neutral-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black"
                    >
                      Save job
                    </button>
                  </div>
                </form>
              )}

              {/* Experiences list */}
              <div className="space-y-3">
                {data.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 border-2 border-black bg-white text-left flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-sans font-black text-sm uppercase">
                        {exp.role} @ {exp.company}
                      </h4>
                      <p className="font-mono text-[10px] text-neutral-500 uppercase">
                        {exp.duration} • {exp.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditExperience(exp)}
                        className="p-1.5 border border-black hover:bg-neutral-100 text-black"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-1.5 border border-black hover:bg-neutral-105 text-neutral-400 hover:text-black"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION HISTORIES WORKSPACE (NEW) */}
          {activeTab === "education" && (
            <div className="space-y-6 text-left">
              <div className="border-b-2 border-black pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Academic History Books</h2>
                  <p className="text-neutral-500 text-xs font-mono">Control schooling logs, engineering degrees, and specialized training programs.</p>
                </div>

                {!isAddingEducation && !editingEducation && (
                  <button
                    onClick={openAddEducation}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Degree
                  </button>
                )}
              </div>

              {/* Forms for Add/Edit Education */}
              {(isAddingEducation || editingEducation) && (
                <form onSubmit={handleEducationSubmit} className="border-2 border-black bg-neutral-50 p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-black pb-3">
                    <h3 className="font-sans font-black text-sm uppercase">
                      {isAddingEducation ? "Add New Degree Form" : `Edit Academic Log`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingEducation(false);
                        setEditingEducation(null);
                      }}
                      className="text-neutral-500 hover:text-black text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Degree / Diploma Title *</label>
                      <input
                        type="text"
                        required
                        value={educationForm.degree}
                        onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                        placeholder="e.g. B.Tech IT"
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">School / University Institution *</label>
                      <input
                        type="text"
                        required
                        value={educationForm.school}
                        onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Time Interval (e.g., 2018 - 2022) *</label>
                      <input
                        type="text"
                        required
                        value={educationForm.duration}
                        onChange={(e) => setEducationForm({ ...educationForm, duration: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Grades / CGPA / Rank (Optional)</label>
                      <input
                        type="text"
                        value={educationForm.grade}
                        onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })}
                        placeholder="e.g. 8.5 CGPA"
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-neutral-600 uppercase">Core description narrative *</label>
                    <textarea
                      required
                      rows={3}
                      value={educationForm.description}
                      onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black bg-white text-black resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2 font-sans text-xs font-black uppercase">
                    <button type="button" onClick={() => { setIsAddingEducation(false); setEditingEducation(null); }} className="px-4 py-2 border border-black bg-white text-black hover:bg-neutral-100">Cancel</button>
                    <button type="submit" className="px-5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black">Save Record</button>
                  </div>
                </form>
              )}

              {/* Education list desk */}
              <div className="space-y-3">
                {(data.educations || []).map((edu) => (
                  <div key={edu.id} className="p-4 border-2 border-black flex items-center justify-between bg-white text-left">
                    <div>
                      <h4 className="font-sans font-black text-sm uppercase">{edu.degree}</h4>
                      <p className="font-mono text-[10px] text-neutral-500 uppercase">{edu.school} • {edu.duration} {edu.grade ? `[${edu.grade}]` : ""}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditEducation(edu)} className="p-1.5 border border-black hover:bg-neutral-100 text-black"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteEducation(edu.id)} className="p-1.5 border border-black text-neutral-400 hover:text-black hover:bg-neutral-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {(data.educations || []).length === 0 && !isAddingEducation && (
                  <p className="text-xs text-neutral-400 italic">No academic logs currently inside the local CMS state cache.</p>
                )}
              </div>
            </div>
          )}

          {/* CERTIFICATES TAB WORKSPACE (NEW) */}
          {activeTab === "certificates" && (
            <div className="space-y-6 text-left">
              <div className="border-b-2 border-black pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Certifications Desk</h2>
                  <p className="text-neutral-500 text-xs font-mono">Input licensing metrics, technical courses, or specialized course certs.</p>
                </div>

                {!isAddingCertificate && !editingCertificate && (
                  <button
                    onClick={openAddCertificate}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Certificate
                  </button>
                )}
              </div>

              {/* Certificate forms */}
              {(isAddingCertificate || editingCertificate) && (
                <form onSubmit={handleCertificateSubmit} className="border-2 border-black bg-neutral-50 p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-black pb-3">
                    <h3 className="font-sans font-black text-sm uppercase">
                      {isAddingCertificate ? "Register New Verification" : "Edit Verification Entry"}
                    </h3>
                    <button type="button" onClick={() => { setIsAddingCertificate(false); setEditingCertificate(null); }} className="text-neutral-500 hover:text-black text-xs font-bold">Dismiss</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Certificate Title *</label>
                      <input
                        type="text"
                        required
                        value={certificateForm.title}
                        onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Issuing Issuer Authority *</label>
                      <input
                        type="text"
                        required
                        value={certificateForm.issuer}
                        onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })}
                        placeholder="e.g. AWS, Coursera"
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Issue Date *</label>
                      <input
                        type="text"
                        required
                        value={certificateForm.issueDate}
                        onChange={(e) => setCertificateForm({ ...certificateForm, issueDate: e.target.value })}
                        placeholder="e.g. Nov 2026"
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Verification URL / Credential link</label>
                      <input
                        type="text"
                        value={certificateForm.credentialUrl}
                        onChange={(e) => setCertificateForm({ ...certificateForm, credentialUrl: e.target.value })}
                        placeholder="https://verify.link/..."
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 font-sans text-xs font-black uppercase">
                    <button type="button" onClick={() => { setIsAddingCertificate(false); setEditingCertificate(null); }} className="px-4 py-2 border border-black bg-white text-black hover:bg-neutral-100">Cancel</button>
                    <button type="submit" className="px-5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black">Confirm</button>
                  </div>
                </form>
              )}

              {/* Certificates List desk */}
              <div className="space-y-3">
                {(data.certificates || []).map((c) => (
                  <div key={c.id} className="p-4 border-2 border-black flex items-center justify-between bg-white text-left">
                    <div>
                      <h4 className="font-sans font-black text-sm uppercase">{c.title}</h4>
                      <p className="font-mono text-[10px] text-neutral-500 uppercase">ISSUER: {c.issuer} • DATE: {c.issueDate}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditCertificate(c)} className="p-1.5 border border-black hover:bg-neutral-100 text-black"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCertificate(c.id)} className="p-1.5 border border-black text-neutral-400 hover:text-black hover:bg-neutral-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {(data.certificates || []).length === 0 && !isAddingCertificate && (
                  <p className="text-xs text-neutral-400 italic">No cert records discovered in the CMS.</p>
                )}
              </div>
            </div>
          )}

          {/* SERVICES CATALOG TAB WORKSPACE */}
          {activeTab === "services" && (
            <div className="space-y-6 text-left">
              <div className="border-b-2 border-black pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Services Catalog</h2>
                  <p className="text-neutral-500 text-xs font-mono">Create, organize, or remove specialized deliverables offered for booking.</p>
                </div>

                {!isAddingService && !editingService && (
                  <button
                    onClick={openAddService}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create New Service Package
                  </button>
                )}
              </div>

              {/* Service forms */}
              {(isAddingService || editingService) && (
                <form onSubmit={handleServiceSubmit} className="border-2 border-black bg-neutral-50 p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-black pb-3">
                    <h3 className="font-sans font-black text-sm uppercase">
                      {isAddingService ? "Create New Service Package Deliverable" : "Edit Service Details"}
                    </h3>
                    <button type="button" onClick={() => { setIsAddingService(false); setEditingService(null); }} className="text-neutral-500 hover:text-black text-xs font-bold">Dismiss</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                        placeholder="e.g. Full-stack Project Foundation"
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-black text-neutral-600">Price Package Fee ({data.profile.consultationCurrency || "₹"}) *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: Math.max(0, parseFloat(e.target.value) || 0) })}
                        placeholder="e.g. 5000"
                        className="w-full px-3 py-2 border-2 border-black bg-white text-black font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 font-mono text-xs uppercase">
                    <label className="block text-[10px] font-black text-neutral-600">Service Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="Discuss deliverables scope, tools or architectural standards..."
                      className="w-full px-3 py-2 border-2 border-black bg-white text-black resize-none text-left font-sans bg-stone-50"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2 font-sans text-xs font-black uppercase">
                    <button type="button" onClick={() => { setIsAddingService(false); setEditingService(null); }} className="px-4 py-2 border border-black bg-white text-black hover:bg-neutral-100">Cancel</button>
                    <button type="submit" className="px-5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black">Confirm & Commit</button>
                  </div>
                </form>
              )}

              {/* Services list */}
              <div className="space-y-3">
                {(data.services || []).map((service) => (
                  <div key={service.id} className="p-4 border-2 border-black flex items-center justify-between bg-white text-left animate-fade-in">
                    <div className="space-y-1 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <h4 className="font-sans font-black text-sm uppercase">{service.title}</h4>
                        <span className="font-mono text-[9px] bg-neutral-100 border border-black/45 px-1.5 py-0.5 font-bold text-black">
                          {data.profile.consultationCurrency || "₹"}{service.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-neutral-500 font-semibold truncate max-w-lg leading-relaxed">{service.description}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditService(service)} className="p-1.5 border border-black hover:bg-neutral-100 text-black"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteService(service.id)} className="p-1.5 border border-black text-neutral-400 hover:text-black hover:bg-neutral-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {(data.services || []).length === 0 && !isAddingService && (
                  <p className="text-xs text-neutral-400 italic">No specialist services defined inside the local CMS state cache.</p>
                )}
              </div>
            </div>
          )}

          {/* CONSULTATION TOPICS TAB WORKSPACE */}
          {activeTab === "consultationTopics" && (
            <div className="space-y-6 text-left">
              <div className="border-b-2 border-black pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Consultation Topics</h2>
                  <p className="text-neutral-500 text-xs font-mono">Add, modify, or delete custom options for client consultation sessions.</p>
                </div>

                {!isAddingTopic && editingTopicIndex === null && (
                  <button
                    onClick={openAddTopic}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create New Topic Option
                  </button>
                )}
              </div>

              {/* Topic form */}
              {(isAddingTopic || editingTopicIndex !== null) && (
                <form onSubmit={handleTopicSubmit} className="border-2 border-black bg-neutral-50 p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-black pb-3">
                    <h3 className="font-sans font-black text-sm uppercase">
                      {isAddingTopic ? "Add New Topic Option" : "Edit Topic Option Name"}
                    </h3>
                    <button type="button" onClick={() => { setIsAddingTopic(false); setEditingTopicIndex(null); }} className="text-neutral-500 hover:text-black text-xs font-bold">Dismiss</button>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs uppercase">
                    <label className="block text-[10px] font-black text-neutral-600">Topic Title *</label>
                    <input
                      type="text"
                      required
                      value={topicForm}
                      onChange={(e) => setTopicForm(e.target.value)}
                      placeholder="e.g. Next.js App Optimization"
                      className="w-full px-3 py-2.5 border-2 border-black bg-white text-black font-semibold"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2 font-sans text-xs font-black uppercase">
                    <button type="button" onClick={() => { setIsAddingTopic(false); setEditingTopicIndex(null); }} className="px-4 py-2 border border-black bg-white text-black hover:bg-neutral-100">Cancel</button>
                    <button type="submit" className="px-5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black">Confirm Topic</button>
                  </div>
                </form>
              )}

              {/* Topics list */}
              <div className="space-y-3">
                {(data.consultationTopics || []).map((topic, index) => (
                  <div key={index} className="p-4 border-2 border-black flex items-center justify-between bg-white text-left animate-fade-in hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-neutral-400 bg-neutral-100 px-2 py-0.5 border border-black/10">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-sans font-black text-sm uppercase text-black">{topic}</h4>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditTopic(index)} className="p-1.5 border border-black hover:bg-neutral-100 text-black"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteTopic(index)} className="p-1.5 border border-black text-neutral-400 hover:text-black hover:bg-neutral-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {(data.consultationTopics || []).length === 0 && !isAddingTopic && (
                  <p className="text-xs text-neutral-400 italic">No custom consulting topics defined in config system.</p>
                )}
              </div>
            </div>
          )}

          {/* SOCIAL NETWORKS TAB WORKSPACE */}
          {activeTab === "socials" && (
            <div className="space-y-6 text-left">
              <div className="border-b-2 border-black pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Social Network Manager</h2>
                  <p className="text-neutral-500 text-xs font-mono">Add, edit, or delete external platforms displayed on your portfolio website.</p>
                </div>

                {!isAddingSocial && !editingSocialId && (
                  <button
                    onClick={openAddSocial}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black text-xs font-black uppercase tracking-wider cursor-pointer font-sans"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Connect New Link
                  </button>
                )}
              </div>

              {/* Social Link Form */}
              {(isAddingSocial || editingSocialId) && (
                <form onSubmit={handleSocialSubmit} className="border-2 border-black bg-neutral-50 p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-black pb-3">
                    <h3 className="font-sans font-black text-sm uppercase">
                      {isAddingSocial ? "Connect New Network Link" : "Edit Social Network Link"}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => { setIsAddingSocial(false); setEditingSocialId(null); }} 
                      className="text-neutral-500 hover:text-black text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs uppercase">
                    <div className="space-y-1.5">
                      <label className="block font-black text-neutral-600">Platform Designation *</label>
                      <select
                        required
                        value={socialForm.platform}
                        onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                        className="w-full px-3 py-2.5 border-2 border-black bg-white font-sans text-xs focus:outline-none"
                      >
                        <option value="GitHub">GitHub</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Twitter/X">Twitter/X</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Personal Website">Personal Website</option>
                        <option value="Portfolio Profile">Portfolio Profile</option>
                        <option value="Other Node">Other Node</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="block font-black text-neutral-600">Full Network Address URL *</label>
                      <input
                        type="url"
                        required
                        value={socialForm.url}
                        onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                        placeholder="https://example.com/username"
                        className="w-full px-3 py-2.5 border-2 border-black bg-white focus:outline-none font-sans text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end text-xs font-black uppercase pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsAddingSocial(false); setEditingSocialId(null); }}
                      className="px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-100 text-black cursor-pointer font-sans"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 border border-black bg-black text-white hover:bg-white hover:text-black hover:border-black cursor-pointer font-sans"
                    >
                      {isAddingSocial ? "Connect Link" : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}

              {/* Social Channels List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.socialLinks || []).map((link) => {
                  return (
                    <div 
                      key={link.id} 
                      className="p-5 border-2 border-black bg-white flex flex-col justify-between space-y-4 text-left shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                      <div className="flex items-start justify-between pb-2 border-b border-neutral-100">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 border border-black bg-neutral-50"><Share2 className="w-4 h-4 text-black" /></span>
                          <div>
                            <h4 className="font-sans font-black text-sm uppercase text-black">{link.platform}</h4>
                            <span className="font-mono text-[9px] text-neutral-400">Node Ref ID: {link.id}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button 
                            type="button"
                            onClick={() => openEditSocial(link)} 
                            className="p-1.5 border border-black hover:bg-neutral-50 text-neutral-600 hover:text-black cursor-pointer"
                            title="Edit Connect Link"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteSocial(link.id)} 
                            className="p-1.5 border border-black text-neutral-450 hover:text-black hover:bg-stone-50 cursor-pointer"
                            title="Disconnect Connection"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-stone-500 hover:text-black" />
                          </button>
                        </div>
                      </div>

                      <div className="font-mono text-xs text-neutral-500 overflow-hidden text-ellipsis whitespace-nowrap bg-neutral-50 p-2.5 border border-black/10">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:underline hover:text-black flex items-center gap-1.5"
                        >
                          <span className="shrink-0">URL:</span> 
                          <span className="text-[11px] truncate select-all">{link.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 ml-auto" />
                        </a>
                      </div>
                    </div>
                  );
                })}

                {(data.socialLinks || []).length === 0 && !isAddingSocial && (
                  <div className="col-span-full py-8 border-2 border-dashed border-neutral-300 text-center text-neutral-400 italic bg-neutral-50 text-xs">
                    No connected platforms found in the current session. Click on "Connect New Link" to start broadcasting!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INBOX MESSAGES TAB PANEL */}
          {activeTab === "messages" && (
            <div className="space-y-6 text-left">
              <div className="border-b-2 border-black pb-4 text-left">
                <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Direct Client Correspondence Inbox</h2>
                <p className="text-neutral-500 text-xs font-mono">Review messages and consultation requests submitted by clients.</p>
              </div>

              {/* Messages list */}
              <div className="space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-5 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-left space-y-3 bg-white ${
                      !m.read ? "border-black font-extrabold" : "border-neutral-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-neutral-100 pb-2">
                      <div>
                        <span className="font-sans font-black uppercase text-sm block">{m.senderName}</span>
                        <span className="font-mono text-[10px] text-neutral-550 block lowercase font-black">&lt;{m.senderEmail}&gt;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-neutral-400 uppercase font-black">{m.timestamp}</span>
                        {!m.read && (
                          <button
                            onClick={() => markMessageAsRead(m.id)}
                            className="px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase border"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="p-1 text-neutral-400 hover:text-black"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-neutral-50 border-l-4 border-black border font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all">
                      {m.message}
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-black">
                    <p className="text-neutral-400 text-sm font-mono uppercase font-black">Your client Inbox is empty.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STORAGE TAB BACKUP */}
          {activeTab === "backup" && (
            <div className="space-y-6 text-left">
              <div className="border-b-2 border-black pb-4">
                <h2 className="font-sans font-black text-lg text-black uppercase tracking-tight">Database Storage Configuration</h2>
                <p className="text-neutral-500 text-xs font-mono">Download local copies or restore previous database backups safely.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="border-2 border-black p-5 space-y-4">
                  <h3 className="font-sans font-black text-sm uppercase">Export Active Schema</h3>
                  <p className="text-neutral-500 text-xs font-semibold leading-relaxed">
                    Download full structural state models (profile settings, skill arrays, experiences, projects, educations, certificates, and inbox logs) in an exchangeable JSON package.
                  </p>
                  <button
                    onClick={exportPortfolioData}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black tracking-wide text-xs font-black uppercase w-full cursor-pointer"
                  >
                    <FileDown className="w-4.5 h-4.5" />
                    Download JSON Backup
                  </button>
                </div>

                {/* Import Card */}
                <div className="border-2 border-black p-5 space-y-4 text-left">
                  <h3 className="font-sans font-black text-sm uppercase">Import Previous Schema</h3>
                  <p className="text-neutral-500 text-xs font-semibold leading-relaxed">
                    Restore previous database state configurations by feeding a valid schema backup file. This fully overwrites current local layouts!
                  </p>
                  <label className="relative inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-black bg-white text-black hover:bg-neutral-50 tracking-wide text-xs font-black uppercase w-full cursor-pointer text-center">
                    <FileUp className="w-4.5 h-4.5" />
                    <span>Upload JSON Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset database card */}
              <div className="p-5 border-2 border-black text-left bg-neutral-50 space-y-3">
                <h3 className="font-sans font-black text-xs uppercase tracking-wider text-black">Reset Active System Database</h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Erases all local configuration updates and loads initial mock dataset templates back into standard memory caches. There is no recovery checkpoint after deletion unless backed up.
                </p>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2.5 border border-black bg-white text-black hover:bg-black hover:text-white hover:border-black uppercase text-[10px] font-black tracking-widest cursor-pointer"
                >
                  Hard Reset Database State
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Custom Confirmation Modal wrapper */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="border-4 border-black p-6 sm:p-8 w-full max-w-md bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-left space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b-2 border-black pb-3">
              <h3 className="font-sans font-black text-lg uppercase tracking-tight flex items-center gap-2 text-black">
                <span className="w-3.5 h-3.5 bg-black animate-pulse"></span>
                {confirmModal.title}
              </h3>
              <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest mt-1">
                Security confirmation challenge
              </p>
            </div>

            <p className="font-sans text-xs font-semibold text-neutral-600 leading-relaxed">
              {confirmModal.description}
            </p>

            <div className="flex gap-3 justify-end pt-2 text-xs font-black uppercase">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border-2 border-black bg-white text-black hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

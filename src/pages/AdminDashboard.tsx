import { LayoutDashboard, Image as ImageIcon, MessageSquare, Edit3, Settings, LogOut, CheckCircle2, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useSettings } from "../contexts/SettingsContext";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Settings Form State
  const [formData, setFormData] = useState(settings);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    setTimeout(() => {
      updateSettings(formData);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 800);
  };

  const handleLogout = () => {
    /*
     * TODO: SUPABASE AUTH INTEGRATION
     * await supabase.auth.signOut();
     */
    navigate('/admin-login');
  };

  return (
    <div className="flex h-screen bg-imrc-bg-alt overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-imrc-primary text-white flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-imrc-secondary flex items-center justify-center font-bold">A</div>
          <span className="font-semibold text-lg tracking-tight">IMRC Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("Dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Dashboard" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === "Dashboard" ? "text-imrc-accent" : ""}`} /> Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab("Gallery")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Gallery" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <ImageIcon className={`w-5 h-5 ${activeTab === "Gallery" ? "text-imrc-accent" : ""}`} /> Manage Gallery
          </button>
          <button 
            onClick={() => setActiveTab("Submissions")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Submissions" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <MessageSquare className={`w-5 h-5 ${activeTab === "Submissions" ? "text-imrc-accent" : ""}`} /> View Submissions
          </button>
          <button 
            onClick={() => setActiveTab("Content")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Content" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <Edit3 className={`w-5 h-5 ${activeTab === "Content" ? "text-imrc-accent" : ""}`} /> Edit Content
          </button>
          <button 
            onClick={() => setActiveTab("Settings")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors w-full text-left font-medium ${activeTab === "Settings" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <Settings className={`w-5 h-5 ${activeTab === "Settings" ? "text-imrc-accent" : ""}`} /> Settings
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-imrc-error transition-colors rounded-[8px]">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-100 shrink-0">
          <h1 className="text-2xl font-semibold text-imrc-primary m-0">Dashboard Overview</h1>
          <Link to="/" className="text-sm font-medium text-imrc-secondary hover:text-imrc-accent transition-colors">
            View Live Site &rarr;
          </Link>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeTab !== "Dashboard" && activeTab !== "Gallery" && activeTab !== "Submissions" && activeTab !== "Settings" && (
            <div className="bg-white p-8 rounded-[12px] shadow-sm border border-gray-100 mb-8 text-center">
              <h2 className="text-xl font-semibold text-imrc-primary mb-2">{activeTab} Module</h2>
              <p className="text-imrc-muted">This module is currently in development. Full backend integration required.</p>
            </div>
          )}

          {/* Stats Overview */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${activeTab !== "Dashboard" ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-imrc-secondary/10 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6 text-imrc-secondary" />
              </div>
              <div>
                <p className="text-sm text-imrc-muted font-medium">Total Submissions</p>
                <p className="text-2xl font-bold text-imrc-primary">142</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-imrc-accent/10 flex items-center justify-center shrink-0">
                <ImageIcon className="w-6 h-6 text-imrc-accent" />
              </div>
              <div>
                <p className="text-sm text-imrc-muted font-medium">Gallery Items</p>
                <p className="text-2xl font-bold text-imrc-primary">48</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-imrc-success/10 flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-imrc-success" />
              </div>
              <div>
                <p className="text-sm text-imrc-muted font-medium">Active Users</p>
                <p className="text-2xl font-bold text-imrc-primary">3</p>
              </div>
            </div>
          </div>

          {/* Manage Gallery Section */}
          <div className={`bg-white rounded-[12px] shadow-sm border border-gray-100 mb-8 overflow-hidden ${activeTab !== "Dashboard" && activeTab !== "Gallery" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-imrc-primary m-0">Manage Gallery</h2>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-imrc-secondary hover:bg-imrc-primary text-white px-4 py-2 rounded-[8px] text-sm font-medium transition-colors"
              >
                Upload New Image
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setUploadStatus("uploading");
                    setTimeout(() => setUploadStatus("success"), 1500);
                    setTimeout(() => setUploadStatus("idle"), 4500);
                  }
                }}
              />
            </div>
            <div className="p-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-[12px] h-32 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-gray-400"
              >
                {uploadStatus === "idle" && <p className="text-sm font-medium">Drag & drop images here or click to browse</p>}
                {uploadStatus === "uploading" && <p className="text-sm font-medium text-imrc-secondary">Uploading simulated file...</p>}
                {uploadStatus === "success" && (
                  <p className="text-sm font-medium text-imrc-success flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Image successfully uploaded (Mock)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* View Submissions Section */}
          <div className={`bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden ${activeTab !== "Dashboard" && activeTab !== "Submissions" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-imrc-primary m-0">Recent Contact Submissions</h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-imrc-muted uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-imrc-muted uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-imrc-muted uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-xs font-semibold text-imrc-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* 
                   * TODO: SUPABASE DB INTEGRATION
                   * Fetch from supabase.from('contact_submissions').select()
                   */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-imrc-text whitespace-nowrap">Today, 10:42 AM</td>
                    <td className="px-6 py-4 text-sm font-medium text-imrc-primary">Elena Rodriguez</td>
                    <td className="px-6 py-4 text-sm text-imrc-muted">Victim Support & Recovery</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-imrc-accent-light text-imrc-primary">New</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-imrc-text whitespace-nowrap">Yesterday, 14:15 PM</td>
                    <td className="px-6 py-4 text-sm font-medium text-imrc-primary">James Chen</td>
                    <td className="px-6 py-4 text-sm text-imrc-muted">Institutional Partnership</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-imrc-success/20 text-imrc-success">Reviewed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Settings Section */}
          <div className={`bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden ${activeTab !== "Settings" ? "hidden" : ""}`}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-imrc-primary m-0">Global Settings</h2>
              <button 
                onClick={handleSettingsSave}
                disabled={saveStatus === "saving"}
                className="bg-imrc-secondary hover:bg-imrc-primary text-white px-4 py-2 rounded-[8px] text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {saveStatus === "saving" ? (
                  "Saving..."
                ) : saveStatus === "success" ? (
                  <><CheckCircle2 className="w-4 h-4" /> Saved</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-imrc-primary mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Headquarters Location</label>
                      <textarea 
                        rows={3}
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm resize-y" 
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-md font-semibold text-imrc-primary mb-4">Branding & Media (URLs)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Logo URL</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/logo.png"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-imrc-muted mb-1">Contact Page Hero Image</label>
                      <input 
                        type="text" 
                        placeholder="https://example.com/hero.jpg"
                        value={formData.heroImageContact}
                        onChange={(e) => setFormData({...formData, heroImageContact: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-[8px] outline-none focus:border-imrc-secondary focus:ring-1 focus:ring-imrc-secondary text-sm" 
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

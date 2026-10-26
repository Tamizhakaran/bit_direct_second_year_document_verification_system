import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import { superAdminAPI } from '../../services/api';
import {
  Users,
  Building2,
  Activity,
  UserPlus,
  PlusCircle,
  Edit,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Award,
  Sparkles,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  Eye,
  Save,
  Phone,
  Mail,
  FileText,
  Compass,
  Trophy,
  ExternalLink,
  Plus,
  Layers,
  Landmark,
  TrendingUp,
  Briefcase,
  Camera,
  X
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State: 'overview' | 'banners' | 'gallery' | 'landing' | 'departments' | 'admins' | 'audit'
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [landingContent, setLandingContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingLanding, setSavingLanding] = useState(false);
  const [achievementsListForm, setAchievementsListForm] = useState([
    { metric: '₹15 Lakhs', title: 'MSME Idea Hackathon 2.0 Grant', description: 'Awarded to student innovators for Potable Water Solutions research', badge: 'Govt. of India' },
    { metric: 'NAAC A+', title: 'Grade Accreditation', description: 'Recognized for world-class academic excellence and infrastructure', badge: 'Autonomous' },
    { metric: 'Top 100', title: 'NIRF Engineering Rank', description: 'Consistently ranked among top premier engineering institutes in India', badge: 'National Rank' },
    { metric: '98.5%', title: 'Placement Track Record', description: 'Over 300+ recruiters visit annually with top Tier-1 packages', badge: 'Industry Connect' }
  ]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modals
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showEditSeatsModal, setShowEditSeatsModal] = useState(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);

  // Campus Gallery state
  const [galleryUploadTitle, setGalleryUploadTitle] = useState('');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [editingGalleryTitle, setEditingGalleryTitle] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  // Feature Card Form
  const [featureForm, setFeatureForm] = useState({
    category: 'infrastructure',
    title: '',
    frontIcon: '🏛️',
    frontTagline: '',
    frontImageUrl: '',
    backHeading: '',
    backPoints: [],
    backBgColor: 'from-blue-600 to-indigo-700',
    active: true
  });
  const [newFeaturePoint, setNewFeaturePoint] = useState('');

  // New Admin Form
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: 'Admin@123',
    department: 'Computer Science and Engineering',
    mobileNumber: ''
  });

  // New Dept Form
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    availableSeats: 30,
    totalCapacity: 60
  });

  // Edit Seats Form
  const [editSeats, setEditSeats] = useState({ availableSeats: 30, totalCapacity: 60 });

  // Landing Page Edit Forms
  const [collegeForm, setCollegeForm] = useState({
    collegeName: '',
    collegeShortName: '',
    tagline: '',
    collegeLogo: '',
    brochureText: '',
    contactNumbers: '',
    email: ''
  });

  const [aboutForm, setAboutForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    highlights: []
  });
  const [newHighlight, setNewHighlight] = useState('');

  // New Banner Slide Form
  const [bannerForm, setBannerForm] = useState({
    achievementType: 'placement',
    companyName: '',
    companyLogo: '',
    title: '',
    highlightText: '',
    subtitle: '',
    personName: '',
    personRole: '',
    personImage: '',
    badge: '',
    bgGradient: 'from-slate-900 via-blue-900 to-indigo-950',
    link: '/register',
    active: true
  });

  // Sync tab with path
  useEffect(() => {
    if (location.pathname.includes('/banners')) {
      setActiveTab('banners');
    } else if (location.pathname.includes('/gallery')) {
      setActiveTab('gallery');
    } else if (location.pathname.includes('/landing')) {
      setActiveTab('landing');
    } else if (location.pathname.includes('/departments')) {
      setActiveTab('departments');
    } else if (location.pathname.includes('/admins')) {
      setActiveTab('admins');
    } else if (location.pathname.includes('/audit-logs')) {
      setActiveTab('audit');
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, adminsRes, deptsRes, logsRes, landingRes] = await Promise.all([
        superAdminAPI.getStats(),
        superAdminAPI.getAdmins(),
        superAdminAPI.getDepartments(),
        superAdminAPI.getAuditLogs(),
        superAdminAPI.getLandingContent()
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (adminsRes.data.success) setAdmins(adminsRes.data.admins);
      if (deptsRes.data.success) setDepartments(deptsRes.data.departments);
      if (logsRes.data.success) setAuditLogs(logsRes.data.logs);
      if (landingRes.data.success) {
        const lc = landingRes.data.landingContent;
        setLandingContent(lc);
        setCollegeForm({
          collegeName: lc.collegeName || '',
          collegeShortName: lc.collegeShortName || '',
          tagline: lc.tagline || '',
          collegeLogo: lc.collegeLogo || '',
          brochureText: lc.topAnnouncement?.brochureText || '',
          contactNumbers: lc.topAnnouncement?.contactNumbers || '',
          email: lc.topAnnouncement?.email || ''
        });
        setAboutForm({
          title: lc.aboutCampus?.title || '',
          description: lc.aboutCampus?.description || '',
          imageUrl: lc.aboutCampus?.imageUrl || '',
          highlights: lc.aboutCampus?.highlights || []
        });
        if (lc.achievementsList?.length > 0) {
          setAchievementsListForm(lc.achievementsList.map(a => ({
            metric: a.metric || '',
            title: a.title || '',
            description: a.description || '',
            badge: a.badge || ''
          })));
        }
      }
    } catch (error) {
      console.error('Error loading super admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save College Branding & Top Announcement
  const handleSaveCollegeInfo = async (e) => {
    e.preventDefault();
    setSavingLanding(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await superAdminAPI.updateLandingContent({
        collegeName: collegeForm.collegeName,
        collegeShortName: collegeForm.collegeShortName,
        tagline: collegeForm.tagline,
        collegeLogo: collegeForm.collegeLogo,
        topAnnouncement: {
          brochureText: collegeForm.brochureText,
          contactNumbers: collegeForm.contactNumbers,
          email: collegeForm.email
        }
      });
      if (res.data.success) {
        setLandingContent(res.data.landingContent);
        setMessage({ type: 'success', text: 'College branding & contact details saved successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save college details' });
    } finally {
      setSavingLanding(false);
    }
  };

  // Save About Campus details
  const handleSaveAboutCampus = async (e) => {
    e.preventDefault();
    setSavingLanding(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await superAdminAPI.updateLandingContent({
        aboutCampus: {
          title: aboutForm.title,
          description: aboutForm.description,
          imageUrl: aboutForm.imageUrl,
          highlights: aboutForm.highlights
        }
      });
      if (res.data.success) {
        setLandingContent(res.data.landingContent);
        setMessage({ type: 'success', text: 'About Campus description and photo saved successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save campus details' });
    } finally {
      setSavingLanding(false);
    }
  };

  // Save Achievements List (metric cards)
  const handleSaveAchievementsList = async (e) => {
    e.preventDefault();
    setSavingLanding(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await superAdminAPI.updateLandingContent({
        achievementsList: achievementsListForm
      });
      if (res.data.success) {
        setLandingContent(res.data.landingContent);
        setMessage({ type: 'success', text: 'Achievements metrics saved successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save achievements list' });
    } finally {
      setSavingLanding(false);
    }
  };

  const handleAchievementsListChange = (idx, field, value) => {
    setAchievementsListForm((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  // Upload Campus / Banner / Logo Photo
  const handleImageUpload = async (e, targetField) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await superAdminAPI.uploadLandingImage(formData);
      if (res.data.success) {
        if (targetField === 'about') {
          setAboutForm((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
        } else if (targetField === 'banner') {
          setBannerForm((prev) => ({ ...prev, personImage: res.data.imageUrl }));
        } else if (targetField === 'logo') {
          setCollegeForm((prev) => ({ ...prev, collegeLogo: res.data.imageUrl }));
        } else if (targetField === 'gallery') {
          // Immediately save the gallery photo
          setGalleryUploading(true);
          try {
            const gRes = await superAdminAPI.addCampusPhoto({
              imageUrl: res.data.imageUrl,
              title: galleryUploadTitle.trim() || 'Campus Facility'
            });
            if (gRes.data.success) {
              setLandingContent((prev) => ({ ...prev, campusGallery: gRes.data.campusGallery }));
              setGalleryUploadTitle('');
              setMessage({ type: 'success', text: 'Campus photo added to gallery!' });
            }
          } catch {
            setMessage({ type: 'danger', text: 'Failed to save campus photo.' });
          } finally {
            setGalleryUploading(false);
          }
          return;
        }
        setMessage({ type: 'success', text: 'Image uploaded successfully! Remember to save changes.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Image upload failed. Please try again.' });
    }
  };

  const handleDeleteGalleryPhoto = async (id) => {
    if (confirmingDeleteId !== id) {
      setConfirmingDeleteId(id);
      return;
    }
    setConfirmingDeleteId(null);
    try {
      const res = await superAdminAPI.deleteCampusPhoto(id);
      if (res.data.success) {
        setLandingContent((prev) => ({ ...prev, campusGallery: res.data.campusGallery }));
        setMessage({ type: 'success', text: 'Campus photo deleted.' });
      }
    } catch {
      setMessage({ type: 'danger', text: 'Failed to delete campus photo.' });
    }
  };

  const handleToggleGalleryActive = async (photo) => {
    try {
      const res = await superAdminAPI.updateCampusPhoto(photo._id, { active: !photo.active });
      if (res.data.success) {
        setLandingContent((prev) => ({ ...prev, campusGallery: res.data.campusGallery }));
      }
    } catch {
      setMessage({ type: 'danger', text: 'Failed to update campus photo.' });
    }
  };

  const handleSaveGalleryTitle = async (id) => {
    try {
      const res = await superAdminAPI.updateCampusPhoto(id, { title: editingGalleryTitle });
      if (res.data.success) {
        setLandingContent((prev) => ({ ...prev, campusGallery: res.data.campusGallery }));
        setEditingGalleryId(null);
        setMessage({ type: 'success', text: 'Photo title updated.' });
      }
    } catch {
      setMessage({ type: 'danger', text: 'Failed to update title.' });
    }
  };

  // Add Highlight tag to About Campus
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setAboutForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight.trim()]
    }));
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index) => {
    setAboutForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Banner Slide Handlers
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      achievementType: 'placement',
      companyName: '',
      companyLogo: '',
      title: '',
      highlightText: '₹',
      subtitle: '',
      personName: '',
      personRole: '',
      personImage: '',
      badge: '',
      bgGradient: 'from-slate-900 via-blue-900 to-indigo-950',
      link: '/register',
      active: true
    });
    setShowBannerModal(true);
  };

  const handleOpenEditBanner = (banner) => {
    setEditingBanner(banner);
    const inferredType = banner.achievementType || (
      banner.companyName || banner.highlightText?.toLowerCase().includes('lpa') || banner.title?.toLowerCase().includes('offer') || banner.title?.toLowerCase().includes('placed') || banner.title?.toLowerCase().includes('google') ? 'placement' : 'grant'
    );
    setBannerForm({
      achievementType: inferredType,
      companyName: banner.companyName || '',
      companyLogo: banner.companyLogo || '',
      title: banner.title || '',
      highlightText: banner.highlightText || '',
      subtitle: banner.subtitle || '',
      personName: banner.personName || '',
      personRole: banner.personRole || '',
      personImage: banner.personImage || '',
      badge: banner.badge || '',
      bgGradient: banner.bgGradient || (inferredType === 'placement' ? 'from-slate-900 via-blue-900 to-indigo-950' : 'from-sky-700 via-blue-600 to-indigo-800'),
      link: banner.link || '/register',
      active: banner.active !== undefined ? banner.active : true
    });
    setShowBannerModal(true);
  };

  const handleSelectAchievementType = (type) => {
    setBannerForm((prev) => ({
      ...prev,
      achievementType: type
    }));
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      let res;
      if (editingBanner) {
        res = await superAdminAPI.updateAchievementBanner(editingBanner._id, bannerForm);
      } else {
        res = await superAdminAPI.addAchievementBanner(bannerForm);
      }
      if (res.data.success) {
        setLandingContent(res.data.landingContent);
        setShowBannerModal(false);
        setMessage({ type: 'success', text: editingBanner ? 'Banner slide updated!' : 'New banner slide added to landing carousel!' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save banner slide' });
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this achievement banner slide?')) return;
    try {
      const res = await superAdminAPI.deleteAchievementBanner(bannerId);
      if (res.data.success) {
        setLandingContent(res.data.landingContent);
        setMessage({ type: 'success', text: 'Banner slide removed from carousel.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to delete banner slide.' });
    }
  };

  const handleToggleBannerActive = async (banner) => {
    try {
      const res = await superAdminAPI.updateAchievementBanner(banner._id, {
        active: !banner.active
      });
      if (res.data.success) {
        setLandingContent(res.data.landingContent);
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to toggle banner status.' });
    }
  };

  // Feature Card Handlers
  const handleOpenAddFeature = () => {
    setEditingFeature(null);
    setFeatureForm({
      category: 'infrastructure',
      title: '',
      frontIcon: '🏛️',
      frontTagline: '',
      frontImageUrl: '',
      backHeading: '',
      backPoints: [],
      backBgColor: 'from-blue-600 to-indigo-700',
      active: true
    });
    setNewFeaturePoint('');
    setShowFeatureModal(true);
  };

  const handleOpenEditFeature = (feature) => {
    setEditingFeature(feature);
    setFeatureForm({
      category: feature.category || 'infrastructure',
      title: feature.title || '',
      frontIcon: feature.frontIcon || '🏛️',
      frontTagline: feature.frontTagline || '',
      frontImageUrl: feature.frontImageUrl || '',
      backHeading: feature.backHeading || '',
      backPoints: feature.backPoints ? [...feature.backPoints] : [],
      backBgColor: feature.backBgColor || 'from-blue-600 to-indigo-700',
      active: feature.active !== undefined ? feature.active : true
    });
    setNewFeaturePoint('');
    setShowFeatureModal(true);
  };

  const handleSaveFeature = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      let res;
      if (editingFeature) {
        res = await superAdminAPI.updateFeatureCard(editingFeature._id, featureForm);
      } else {
        res = await superAdminAPI.addFeatureCard(featureForm);
      }
      if (res.data.success) {
        setLandingContent((prev) => ({
          ...prev,
          features: res.data.features
        }));
        setShowFeatureModal(false);
        setMessage({
          type: 'success',
          text: editingFeature ? 'Feature card updated successfully!' : 'New feature card added to landing page!'
        });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to save feature card' });
    }
  };

  const handleDeleteFeature = async (featureId) => {
    if (!window.confirm('Are you sure you want to delete this feature card?')) return;
    try {
      const res = await superAdminAPI.deleteFeatureCard(featureId);
      if (res.data.success) {
        setLandingContent((prev) => ({
          ...prev,
          features: res.data.features
        }));
        setMessage({ type: 'success', text: 'Feature card deleted successfully.' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to delete feature card.' });
    }
  };

  const handleToggleFeatureActive = async (feature) => {
    try {
      const res = await superAdminAPI.updateFeatureCard(feature._id, {
        active: !feature.active
      });
      if (res.data.success) {
        setLandingContent((prev) => ({
          ...prev,
          features: res.data.features
        }));
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to toggle feature card status.' });
    }
  };

  const handleAddFeaturePoint = () => {
    if (!newFeaturePoint.trim()) return;
    setFeatureForm((prev) => ({
      ...prev,
      backPoints: [...prev.backPoints, newFeaturePoint.trim()]
    }));
    setNewFeaturePoint('');
  };

  const handleRemoveFeaturePoint = (index) => {
    setFeatureForm((prev) => ({
      ...prev,
      backPoints: prev.backPoints.filter((_, i) => i !== index)
    }));
  };


  // Department & Admin Handlers
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await superAdminAPI.createAdmin(adminForm);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        setShowAdminModal(false);
        fetchAllData();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to create admin' });
    }
  };

  const handleToggleAdminStatus = async (id) => {
    try {
      const res = await superAdminAPI.toggleAdminStatus(id);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchAllData();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update admin status' });
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await superAdminAPI.createDepartment(deptForm);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        setShowDeptModal(false);
        fetchAllData();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to add department' });
    }
  };

  const handleUpdateSeats = async (deptId) => {
    try {
      const res = await superAdminAPI.updateDepartmentSeats(deptId, editSeats);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        setShowEditSeatsModal(null);
        fetchAllData();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update department seats' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading Super Admin Executive Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          
          {/* Executive Header Banner */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-xl mb-6 border border-purple-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-purple-300 text-xs font-bold uppercase tracking-wider bg-purple-500/20 px-2.5 py-1 rounded border border-purple-400/20">
                Super Admin Master Control
              </span>
              <h1 className="text-2xl font-extrabold mt-2">
                BIT DNY System Administration Hub
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Manage Landing Page Branding, Achievement Banners, Department Seat Matrix, Verifier Accounts, and Audit Trail
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/"
                target="_blank"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-600 transition-colors flex items-center space-x-1.5 shadow"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Preview Landing Page</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </Link>
              <button
                onClick={() => setShowAdminModal(true)}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Admin</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation Bar */}
          <div className="flex items-center space-x-2 border-b border-slate-200 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'overview', name: 'Executive Overview', icon: Award, path: '/superadmin/dashboard' },
              { id: 'banners', name: 'Hero Banners', icon: Trophy, path: '/superadmin/banners' },
              { id: 'gallery', name: 'Campus Gallery', icon: Camera, path: '/superadmin/gallery' },
              { id: 'landing', name: 'Landing Page Content', icon: Sparkles, path: '/superadmin/landing' },
              { id: 'departments', name: 'Department Seats', icon: Building2, path: '/superadmin/departments' },
              { id: 'admins', name: 'Faculty Verifiers', icon: Users, path: '/superadmin/admins' },
              { id: 'audit', name: 'Audit Trail', icon: Activity, path: '/superadmin/audit-logs' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    navigate(tab.path);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-xs mb-6 flex items-start space-x-2 border ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Candidates</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalStudents || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Submitted Applications</p>
                    <p className="text-2xl font-extrabold text-purple-600 mt-1">{stats?.totalAdmissions || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Faculty Verifiers</p>
                    <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats?.totalAdmins || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Engineering Depts</p>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.totalDepartments || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  onClick={() => { setActiveTab('banners'); navigate('/superadmin/banners'); }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1">Hero Banners</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Add, edit, and organize carousel slides for placements, grants, and achievements.
                  </p>
                </div>

                <div
                  onClick={() => { setActiveTab('gallery'); navigate('/superadmin/gallery'); }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1">Campus Gallery</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Upload and manage "Explore Campus" facility photos shown in the landing modal.
                  </p>
                </div>

                <div
                  onClick={() => { setActiveTab('landing'); navigate('/superadmin/landing'); }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1">Landing Page</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Update college logo, description, metrics cards, and interactive feature cards.
                  </p>
                </div>

                <div
                  onClick={() => { setActiveTab('departments'); navigate('/superadmin/departments'); }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1">Seat Matrix</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Adjust available lateral entry seats and total capacity across engineering departments.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: HERO & ACHIEVEMENT BANNERS */}
          {/* ========================================================= */}
          {activeTab === 'banners' && (
            <div className="space-y-8">
              {/* Achievement Banners Carousel Manager */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>Dynamic Achievement Banners (Landing Page Carousel)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add, edit, or toggle slides displayed in the full-width carousel on the home page.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddBanner}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Banner Slide</span>
                  </button>
                </div>

                {/* List of Banner Slides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                  {landingContent?.achievementBanners?.map((banner, index) => {
                    const isPlacement = banner.achievementType === 'placement' || (
                      !banner.achievementType && (
                        banner.companyName ||
                        banner.highlightText?.toLowerCase().includes('lpa') ||
                        banner.title?.toLowerCase().includes('offer') ||
                        banner.title?.toLowerCase().includes('google') ||
                        banner.title?.toLowerCase().includes('placed')
                      )
                    );

                    return (
                      <div
                        key={banner._id || index}
                        className={`relative rounded-2xl border p-5 shadow-sm transition-all overflow-hidden flex flex-col justify-between ${
                          banner.active ? 'border-blue-200 bg-gradient-to-br from-slate-900 to-blue-950 text-white' : 'border-slate-300 bg-slate-100 text-slate-500 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                            <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                              {isPlacement ? (
                                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                  <Briefcase className="w-3 h-3 mr-1 inline" />
                                  <span>Placement Offer</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                                  <Trophy className="w-3 h-3 mr-1 inline" />
                                  <span>{banner.achievementType || 'Grant / Award'}</span>
                                </span>
                              )}
                              {banner.badge && (
                                <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                                  {banner.badge}
                                </span>
                              )}
                            </div>

                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              banner.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {banner.active ? 'Active on Carousel' : 'Inactive'}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-sm mb-1 text-white">{banner.title}</h4>
                          
                          {(banner.highlightText || banner.companyName) && (
                            <div className="my-2 flex items-center space-x-2 flex-wrap gap-1.5">
                              {banner.highlightText && (
                                <span className="bg-amber-400 text-slate-950 font-black text-lg px-3 py-1 rounded-lg">
                                  {banner.highlightText}
                                </span>
                              )}
                              {banner.companyName && (
                                <span className="bg-blue-500/20 border border-blue-400/30 text-sky-200 text-xs font-extrabold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                                  <Building2 className="w-3.5 h-3.5 mr-1 inline text-sky-300" />
                                  <span>{banner.companyName}</span>
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-slate-300 leading-relaxed mb-3">{banner.subtitle}</p>

                          {(banner.personName || banner.personRole) && (
                            <div className="flex items-center space-x-2 text-xs font-semibold text-sky-200 pt-2 border-t border-slate-800">
                              {isPlacement ? (
                                <Briefcase className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              )}
                              <span>{isPlacement ? 'Placed Candidate:' : 'Awardee:'} {banner.personName} {banner.personRole} {banner.companyName && !banner.highlightText ? `• ${banner.companyName}` : ''}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Action Controls */}
                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                          <button
                            onClick={() => handleToggleBannerActive(banner)}
                            className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                              banner.active ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {banner.active ? 'Hide from Carousel' : 'Show on Carousel'}
                          </button>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleOpenEditBanner(banner)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                              title="Edit Slide"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner._id)}
                              className="p-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg transition-colors"
                              title="Delete Slide"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: CAMPUS GALLERY */}
          {/* ========================================================= */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              {/* Campus Gallery Manager */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-blue-500" />
                      <span>Campus Gallery (Explore Campus Photos)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload photos of campus facilities — shown when visitors click "Explore Campus" on the landing page.
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">
                    {landingContent?.campusGallery?.filter(p => p.active).length || 0} Active Photos
                  </span>
                </div>

                {/* Upload New Photo */}
                <div className="mt-5 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <p className="text-xs font-extrabold text-slate-800 mb-2">Add New Campus Photo</p>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <input
                        type="text"
                        value={galleryUploadTitle}
                        onChange={(e) => setGalleryUploadTitle(e.target.value)}
                        placeholder="Photo title (e.g. Auditorium, Gym, Mess Hall...)"
                        className="flex-1 p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                      />
                      <label className={`cursor-pointer inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl shadow transition-colors flex-shrink-0 ${
                        galleryUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                      }`}>
                        <UploadCloud className="w-4 h-4" />
                        <span>{galleryUploading ? 'Uploading...' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="*"
                          disabled={galleryUploading}
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Recommended: landscape JPG/PNG, min 800×500px. Enter a title first, then upload.</p>
                  </div>
                </div>

                {/* Gallery Photo Grid */}
                {landingContent?.campusGallery?.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...(landingContent.campusGallery)].sort((a, b) => (a.order || 0) - (b.order || 0)).map((photo, i) => (
                      <div
                        key={photo._id || i}
                        className={`relative rounded-2xl overflow-hidden border shadow-sm transition-all group ${
                          photo.active ? 'border-blue-200' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-36 object-cover"
                          onError={(e) => { e.target.style.display='none'; }}
                        />

                        {/* Active badge */}
                        <span className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          photo.active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                        }`}>
                          {photo.active ? 'Visible' : 'Hidden'}
                        </span>

                        {/* Action buttons — always visible */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => handleToggleGalleryActive(photo)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md ${
                              photo.active ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                            }`}
                            title={photo.active ? 'Hide' : 'Show'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {confirmingDeleteId === photo._id ? (
                            <>
                              <button
                                onClick={() => handleDeleteGalleryPhoto(photo._id)}
                                className="h-7 px-2 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-md text-[10px] font-bold"
                                title="Confirm Delete"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmingDeleteId(null)}
                                className="w-7 h-7 rounded-full bg-slate-400 hover:bg-slate-500 flex items-center justify-center text-white shadow-md"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setConfirmingDeleteId(photo._id)}
                              className="w-7 h-7 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white shadow-md"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Title label / edit */}
                        <div className="bg-white px-2 py-1.5 border-t border-slate-100">
                          {editingGalleryId === photo._id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editingGalleryTitle}
                                onChange={(e) => setEditingGalleryTitle(e.target.value)}
                                className="flex-1 text-[11px] border border-blue-400 rounded px-1 py-0.5 outline-none min-w-0"
                                autoFocus
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveGalleryTitle(photo._id); if (e.key === 'Escape') setEditingGalleryId(null); }}
                              />
                              <button onClick={() => handleSaveGalleryTitle(photo._id)} className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">Save</button>
                              <button onClick={() => setEditingGalleryId(null)} className="text-[10px] text-slate-400"><X className="w-3 h-3" /></button>
                            </div>
                          ) : (
                            <button
                              className="text-[11px] font-semibold text-slate-700 truncate w-full text-left hover:text-blue-600 transition-colors flex items-center gap-1"
                              onClick={() => { setEditingGalleryId(photo._id); setEditingGalleryTitle(photo.title); }}
                              title="Click to edit title"
                            >
                              <span className="truncate">{photo.title || 'Campus Facility'}</span>
                              <Edit className="w-2.5 h-2.5 flex-shrink-0 opacity-40" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(!landingContent?.campusGallery || landingContent.campusGallery.length === 0) && (
                  <div className="mt-5 text-center py-10 text-slate-400">
                    <Camera className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-xs font-semibold">No campus photos yet. Upload the first one above.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: LANDING PAGE BRANDING & SECTIONS */}
          {/* ========================================================= */}
          {activeTab === 'landing' && (
            <div className="space-y-8">

              {/* SECTION B: College Branding & Top Announcement */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="pb-4 border-b border-slate-100 mb-6">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>College Branding & Admission Hotline Notice Bar</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure institutional title, admission hotline phone numbers, and brochure announcement.
                  </p>
                </div>

                <form onSubmit={handleSaveCollegeInfo} className="space-y-4">

                  {/* College Logo Upload */}
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-shrink-0">
                      {collegeForm.collegeLogo ? (
                        <img
                          src={collegeForm.collegeLogo}
                          alt="College Logo"
                          className="w-20 h-20 rounded-2xl object-contain bg-white border border-slate-200 shadow-sm p-1"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-slate-200 flex items-center justify-center shadow-sm">
                          <ImageIcon className="w-8 h-8 text-blue-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-slate-800 mb-0.5">College Logo / Emblem</p>
                      <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">Upload the official college logo. It will appear in the Navbar, Landing Page hero section, and throughout the portal. Recommended: PNG with transparent background.</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow transition-colors">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{collegeForm.collegeLogo ? 'Replace Logo' : 'Upload Logo'}</span>
                          <input
                            id="logo-upload-input"
                            type="file"
                            accept="*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, 'logo')}
                          />
                        </label>
                        {collegeForm.collegeLogo && (
                          <button
                            type="button"
                            onClick={() => setCollegeForm((prev) => ({ ...prev, collegeLogo: '' }))}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                      {collegeForm.collegeLogo && (
                        <p className="text-[10px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Logo uploaded — click "Save College & Notice Details" to apply.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">College Full Name *</label>
                      <input
                        type="text"
                        required
                        value={collegeForm.collegeName}
                        onChange={(e) => setCollegeForm({ ...collegeForm, collegeName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                        placeholder="e.g. Bannari Amman Institute of Technology"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">College Short Name / Location *</label>
                      <input
                        type="text"
                        required
                        value={collegeForm.collegeShortName}
                        onChange={(e) => setCollegeForm({ ...collegeForm, collegeShortName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                        placeholder="e.g. BIT Sathyamangalam"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Portal Tagline / Header Subtitle</label>
                    <input
                      type="text"
                      value={collegeForm.tagline}
                      onChange={(e) => setCollegeForm({ ...collegeForm, tagline: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                      placeholder="e.g. Direct Second Year (DNY) Lateral Entry Admission Portal 2026-2027"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Top Notice Brochure Text</label>
                      <input
                        type="text"
                        value={collegeForm.brochureText}
                        onChange={(e) => setCollegeForm({ ...collegeForm, brochureText: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                        placeholder="e.g. Information Brochure 2026–2027"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Admission Contact Numbers *</label>
                      <input
                        type="text"
                        required
                        value={collegeForm.contactNumbers}
                        onChange={(e) => setCollegeForm({ ...collegeForm, contactNumbers: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                        placeholder="04295 226086 | 04295 226087 | +91 89401 26000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Admission Email</label>
                      <input
                        type="email"
                        value={collegeForm.email}
                        onChange={(e) => setCollegeForm({ ...collegeForm, email: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                        placeholder="dnyadmissions@bitsathy.ac.in"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingLanding}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingLanding ? 'Saving...' : 'Save College & Notice Details'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION C: "About the Campus" Description & Photo Manager */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="pb-4 border-b border-slate-100 mb-6">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>"About the Campus" Section & Aerial Photo</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update the campus overview narrative, aerial photograph, and institute key highlights.
                  </p>
                </div>

                <form onSubmit={handleSaveAboutCampus} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Section Title *</label>
                    <input
                      type="text"
                      required
                      value={aboutForm.title}
                      onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                      placeholder="e.g. About the Campus"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Campus Description Narrative *</label>
                    <textarea
                      rows={5}
                      required
                      value={aboutForm.description}
                      onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500 leading-relaxed"
                      placeholder="Enter detailed description about the autonomous institution, AICTE approval, Anna University affiliation, campus on river Bhavani..."
                    />
                  </div>

                  {/* Campus Photo Upload / URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Campus Aerial Photo URL</label>
                      <input
                        type="text"
                        value={aboutForm.imageUrl}
                        onChange={(e) => setAboutForm({ ...aboutForm, imageUrl: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                        placeholder="https://... or /uploads/campus.jpg"
                      />
                      <div className="mt-2">
                        <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                          <UploadCloud className="w-4 h-4 text-slate-600" />
                          <span>Upload Campus Image</span>
                          <input
                            type="file"
                            accept="*"
                            onChange={(e) => handleImageUpload(e, 'about')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Preview Thumbnail */}
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase">Image Preview</p>
                      <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-300 bg-slate-200 shadow-inner">
                        {aboutForm.imageUrl ? (
                          <img
                            src={aboutForm.imageUrl}
                            alt="Campus Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                            No Image Set
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bullet Points */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Campus Key Highlights</label>
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
                        placeholder="e.g. Scenic 180+ acre eco-friendly campus nestled on the banks of River Bhavani"
                        className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Add Highlight
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {aboutForm.highlights?.map((hl, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                          <span className="text-slate-800 font-medium">✓ {hl}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingLanding}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingLanding ? 'Saving...' : 'Save Campus Description & Highlights'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION D (new): Achievements Metrics List Editor */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="pb-4 border-b border-slate-100 mb-6">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Achievements Metrics Cards (Verified Institute Metrics)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Edit the 4 achievement metric cards shown on the landing page (₹15 Lakhs, NAAC A+, Top 100, 98.5%).
                  </p>
                </div>

                <form onSubmit={handleSaveAchievementsList} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievementsListForm.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">Card {idx + 1}</p>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Metric *</label>
                            <input
                              type="text"
                              required
                              value={item.metric}
                              onChange={(e) => handleAchievementsListChange(idx, 'metric', e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500 font-bold"
                              placeholder="e.g. ₹15 Lakhs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Badge Label *</label>
                            <input
                              type="text"
                              required
                              value={item.badge}
                              onChange={(e) => handleAchievementsListChange(idx, 'badge', e.target.value)}
                              className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500"
                              placeholder="e.g. Govt. of India"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Title *</label>
                          <input
                            type="text"
                            required
                            value={item.title}
                            onChange={(e) => handleAchievementsListChange(idx, 'title', e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500"
                            placeholder="e.g. MSME Idea Hackathon 2.0 Grant"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => handleAchievementsListChange(idx, 'description', e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500 leading-relaxed resize-none"
                            placeholder="Short description shown below the title"
                          />
                        </div>

                        {/* Live Preview mini */}
                        <div className="bg-white border border-amber-100 rounded-xl p-2.5 text-[10px] text-slate-600">
                          <span className="font-extrabold text-slate-900 text-sm">{item.metric || '—'}</span>
                          <span className="ml-2 bg-blue-50 text-blue-700 border border-blue-100 font-bold px-1.5 py-0.5 rounded-full text-[9px]">{item.badge || '—'}</span>
                          <p className="font-bold text-slate-800 mt-0.5">{item.title || '—'}</p>
                          <p className="text-slate-500">{item.description || '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingLanding}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingLanding ? 'Saving...' : 'Save Achievements Metrics'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION E: College Features (Flip Cards: Infrastructure, Placements, Achievements) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>College Features (Interactive Flip Cards: Infrastructure, Placements, Achievements)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure cards shown on the landing page. Users hover/touch on front face to reveal bullet details on the back face.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddFeature}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Feature Card</span>
                  </button>
                </div>

                {/* List of Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  {landingContent?.features?.map((feature, index) => (
                    <div
                      key={feature._id || index}
                      className={`relative rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                        feature.active ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <span>{feature.frontIcon || '🏛️'}</span>
                            <span className="capitalize">{feature.category}</span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            feature.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {feature.active ? 'Active' : 'Hidden'}
                          </span>
                        </div>

                        {/* Front Face Preview */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Front Face Preview</span>
                          <h4 className="font-extrabold text-sm text-slate-900">{feature.title}</h4>
                          {feature.frontTagline && (
                            <p className="text-xs text-slate-500 italic mt-0.5">"{feature.frontTagline}"</p>
                          )}
                        </div>

                        {/* Back Face Preview */}
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.backBgColor || 'from-blue-600 to-indigo-700'} text-white shadow-inner`}>
                          <span className="text-[10px] font-bold uppercase text-white/70 block mb-1">Back Face (Hover/Touch)</span>
                          <h5 className="font-bold text-xs">{feature.backHeading || feature.title}</h5>
                          <ul className="mt-2 space-y-1">
                            {(feature.backPoints || []).slice(0, 4).map((pt, i) => (
                              <li key={i} className="text-[11px] text-white/90 flex items-start space-x-1.5">
                                <span className="text-white/70">•</span>
                                <span className="line-clamp-1">{pt}</span>
                              </li>
                            ))}
                            {(feature.backPoints || []).length > 4 && (
                              <li className="text-[10px] text-white/60 font-semibold italic">
                                + {(feature.backPoints || []).length - 4} more points
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Card Action Controls */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => handleToggleFeatureActive(feature)}
                          className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                            feature.active ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {feature.active ? 'Hide Card' : 'Show Card'}
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditFeature(feature)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="Edit Card"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFeature(feature._id)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                            title="Delete Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DEPARTMENT SEAT MATRIX */}
          {/* ========================================================= */}
          {activeTab === 'departments' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Department Seat Matrix & Capacity Configuration</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowDeptModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Department</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                      <th className="p-4">Dept Code</th>
                      <th className="p-4">Department Name</th>
                      <th className="p-4">Available Seats</th>
                      <th className="p-4">Total Capacity</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departments.map((dept) => (
                      <tr key={dept._id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-extrabold text-blue-700">{dept.code}</td>
                        <td className="p-4 font-bold text-slate-800">{dept.name}</td>
                        <td className="p-4 font-bold text-emerald-600">{dept.availableSeats} Seats</td>
                        <td className="p-4 text-slate-600">{dept.totalCapacity} Seats</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            dept.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {dept.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setShowEditSeatsModal(dept);
                              setEditSeats({ availableSeats: dept.availableSeats, totalCapacity: dept.totalCapacity });
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center space-x-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit Seats</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: MANAGE ADMINISTRATORS */}
          {/* ========================================================= */}
          {activeTab === 'admins' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Department Faculty Verifiers (Admin Accounts)</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Verifier</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold">
                      <th className="p-4">Faculty Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Assigned Department</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4 text-right">Toggle Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-800">{admin.name}</td>
                        <td className="p-4 text-slate-600">{admin.email}</td>
                        <td className="p-4 font-semibold text-blue-700">{admin.department || 'All'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            admin.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {admin.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleToggleAdminStatus(admin._id)}
                            className={`px-3 py-1 font-bold text-[11px] rounded-lg transition-colors ${
                              admin.status === 'active' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: SYSTEM AUDIT LOGS */}
          {/* ========================================================= */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>System Security & Audit Activity Logs</span>
                </h3>
              </div>

              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs">
                {auditLogs.map((log) => (
                  <div key={log._id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{log.action}: </span>
                      <span className="text-slate-600">{log.description}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        By: {log.userName} ({log.role}) • IP: {log.ipAddress}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-4">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODALS */}
          {/* ========================================================= */}

          {/* Add / Edit Banner Modal */}
          <Modal
            isOpen={showBannerModal}
            onClose={() => setShowBannerModal(false)}
            title={editingBanner ? 'Edit Achievement Banner Slide' : 'Add New Achievement Banner Slide'}
            maxWidth="max-w-2xl"
          >
            <form onSubmit={handleSaveBanner} className="space-y-4">
              
              {/* Category / Type Selector */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Achievement Category / Type</span>
                  <span className="text-[10px] font-semibold text-blue-600 lowercase bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    select type to customize options
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectAchievementType('placement')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      bannerForm.achievementType === 'placement'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>💼 Placement Offer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAchievementType('grant')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      bannerForm.achievementType === 'grant'
                        ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <span>💰 Research Grant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAchievementType('competition')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      bannerForm.achievementType === 'competition'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>🏆 Competition</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAchievementType('academic')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      bannerForm.achievementType === 'academic'
                        ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-blue-600" />
                    <span>🎓 Academic / NIRF</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {bannerForm.achievementType === 'placement' ? 'Banner Title / Placement Headline *' : 'Banner Title / Header *'}
                </label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder={
                    bannerForm.achievementType === 'placement'
                      ? 'e.g. Manufacturing And Fabrication Lab Student Got Offer AT Google'
                      : 'e.g. Bioprospecting Research Lab student received a seed grant support of'
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Placement Specific Recruiter Company Field */}
              {bannerForm.achievementType === 'placement' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/60">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                      <span>Recruiter / Company Name</span>
                    </label>
                    <input
                      type="text"
                      value={bannerForm.companyName}
                      onChange={(e) => setBannerForm({ ...bannerForm, companyName: e.target.value })}
                      placeholder="e.g. Google / Microsoft / Amazon / Zoho"
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs outline-none focus:border-emerald-500 font-bold text-emerald-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-950 mb-1">Quick Select Top Recruiters</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['Google', 'Microsoft', 'Amazon', 'Zoho', 'TCS', 'L&T', 'Qualcomm'].map((rec) => (
                        <button
                          key={rec}
                          type="button"
                          onClick={() => setBannerForm({ ...bannerForm, companyName: rec })}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                            bannerForm.companyName === rec
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {rec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {bannerForm.achievementType === 'placement'
                      ? 'Salary Package / CTC (e.g. ₹20 LPA, ₹42 LPA)'
                      : 'Highlight Tag / Grant Amount (e.g. ₹15 Lakhs)'}
                  </label>
                  <input
                    type="text"
                    value={bannerForm.highlightText}
                    onChange={(e) => setBannerForm({ ...bannerForm, highlightText: e.target.value })}
                    placeholder={bannerForm.achievementType === 'placement' ? '₹20 LPA' : '₹15 Lakhs'}
                    className="w-full p-2.5 bg-amber-50/60 border border-amber-300 rounded-xl text-xs outline-none focus:border-amber-500 font-black text-slate-900 text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge Pill Text</label>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {bannerForm.achievementType === 'placement' ? (
                      <>
                        {['💼 Campus Placement', '⭐ Super Dream Offer', '🚀 Top Recruiter 2026', '🏢 Tier-1 Offer'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBannerForm({ ...bannerForm, badge: b })}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-all ${
                              bannerForm.badge === b
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        {['🔬 Research Grant', '🏆 Hackathon 2.0', '🎖️ Top Tier-1 Rank', '💡 Innovation Award'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBannerForm({ ...bannerForm, badge: b })}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-all ${
                              bannerForm.badge === b
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    placeholder="e.g. 💼 Campus Placement or 🔬 Research Grant"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {bannerForm.achievementType === 'placement' ? 'Job Role / Offer Description' : 'Subtitle / Competition Details'}
                </label>
                <textarea
                  rows={2}
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder={
                    bannerForm.achievementType === 'placement'
                      ? 'e.g. Bagged elite engineering role at Google Campus Drive with ₹20 LPA CTC'
                      : 'e.g. Under the Potable Water Solutions category in MSME-IDEA HACKATHON 2.0 from MSME, Govt. of India'
                  }
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {bannerForm.achievementType === 'placement' ? 'Placed Student / Candidate Name' : 'Student / Recipient Name'}
                  </label>
                  <input
                    type="text"
                    value={bannerForm.personName}
                    onChange={(e) => setBannerForm({ ...bannerForm, personName: e.target.value })}
                    placeholder="e.g. TAMIZHAKARAN K"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {bannerForm.achievementType === 'placement' ? 'Student Branch / Department' : 'Recipient Branch / Role'}
                  </label>
                  <input
                    type="text"
                    value={bannerForm.personRole}
                    onChange={(e) => setBannerForm({ ...bannerForm, personRole: e.target.value })}
                    placeholder="e.g. (Mechanical) or (CSE)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Photo (Optional)</label>
                  <input
                    type="text"
                    value={bannerForm.personImage}
                    onChange={(e) => setBannerForm({ ...bannerForm, personImage: e.target.value })}
                    placeholder="Photo URL or upload below"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500 mb-1.5"
                  />
                  <label className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer">
                    <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="*"
                      onChange={(e) => handleImageUpload(e, 'banner')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Background Gradient Theme</label>
                  <select
                    value={bannerForm.bgGradient}
                    onChange={(e) => setBannerForm({ ...bannerForm, bgGradient: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="from-slate-900 via-blue-900 to-indigo-950">Midnight Blue to Slate (Tech & Placements)</option>
                    <option value="from-sky-700 via-blue-600 to-indigo-800">Ocean Blue to Indigo (Default)</option>
                    <option value="from-emerald-800 via-teal-700 to-slate-900">Emerald Green to Teal (High Package)</option>
                    <option value="from-amber-700 via-orange-600 to-slate-900">Amber Gold to Orange (Super Dream)</option>
                    <option value="from-indigo-900 via-purple-800 to-slate-900">Deep Indigo to Purple (Research & Awards)</option>
                    <option value="from-rose-900 via-red-800 to-slate-900">Crimson Red to Slate</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={bannerForm.active}
                  onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="bannerActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Display this slide in the active carousel
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowBannerModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow">
                  {editingBanner ? 'Save Banner Slide' : 'Add to Carousel'}
                </button>
              </div>
            </form>
          </Modal>

          {/* Add / Edit Feature Card Modal */}
          <Modal
            isOpen={showFeatureModal}
            onClose={() => setShowFeatureModal(false)}
            title={editingFeature ? 'Edit Feature Card' : 'Add New College Feature Card'}
            maxWidth="max-w-2xl"
          >
            <form onSubmit={handleSaveFeature} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Feature Category *</label>
                  <select
                    value={featureForm.category}
                    onChange={(e) => setFeatureForm({ ...featureForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500 capitalize"
                  >
                    <option value="infrastructure">College Infrastructure</option>
                    <option value="placements">Placements</option>
                    <option value="achievements">Achievements</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Front Face Icon (Emoji or Symbol)</label>
                  <input
                    type="text"
                    value={featureForm.frontIcon}
                    onChange={(e) => setFeatureForm({ ...featureForm, frontIcon: e.target.value })}
                    placeholder="🏛️, 🏆, 🎖️, 💼"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Title *</label>
                <input
                  type="text"
                  required
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  placeholder="e.g. College Infrastructure, Placement, Achievements"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Front Face Tagline / Quote</label>
                <input
                  type="text"
                  value={featureForm.frontTagline}
                  onChange={(e) => setFeatureForm({ ...featureForm, frontTagline: e.target.value })}
                  placeholder="e.g. Realizing what you are good at starts with finding what you're passionate about."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="border-t border-slate-100 pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Back Face Heading (Revealed on Hover / Touch)</label>
                <input
                  type="text"
                  value={featureForm.backHeading}
                  onChange={(e) => setFeatureForm({ ...featureForm, backHeading: e.target.value })}
                  placeholder="e.g. World-Class Campus Infrastructure / Stellar Placement Record"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* Back Face Bullet Points */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Back Face Bullet Points (Features & Details)</label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFeaturePoint}
                    onChange={(e) => setNewFeaturePoint(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeaturePoint(); } }}
                    placeholder="e.g. 180+ Acre green campus on River Bhavani"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeaturePoint}
                    className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Add Point
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {featureForm.backPoints?.map((pt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <span className="text-slate-800 font-medium">✓ {pt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeaturePoint(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!featureForm.backPoints || featureForm.backPoints.length === 0) && (
                    <p className="text-[11px] text-slate-400 italic">No bullet points added yet. Type above and click "Add Point".</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Back Face Gradient Color</label>
                  <select
                    value={featureForm.backBgColor}
                    onChange={(e) => setFeatureForm({ ...featureForm, backBgColor: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="from-blue-600 to-indigo-700">Royal Blue to Indigo (Infrastructure)</option>
                    <option value="from-amber-500 to-orange-600">Amber to Orange (Placements)</option>
                    <option value="from-emerald-600 to-teal-700">Emerald Green to Teal (Achievements)</option>
                    <option value="from-purple-600 to-indigo-800">Purple to Deep Indigo</option>
                    <option value="from-rose-600 to-pink-700">Rose to Crimson</option>
                    <option value="from-slate-800 to-slate-950">Dark Slate to Midnight</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featureActive"
                    checked={featureForm.active}
                    onChange={(e) => setFeatureForm({ ...featureForm, active: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="featureActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Show active on Landing Page
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowFeatureModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow">
                  {editingFeature ? 'Save Feature Card' : 'Add Feature Card'}
                </button>
              </div>
            </form>
          </Modal>


          {/* Add Admin Modal */}
          <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} title="Create Verifier Admin Account" maxWidth="max-w-md">
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Name *</label>
                <input
                  type="text"
                  required
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  placeholder="e.g. Dr. R. K. Sharma"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address * (Must end with @bitsathy.ac.in)</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin.dept@bitsathy.ac.in"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Department *</label>
                <select
                  value={adminForm.department}
                  onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                >
                  {departments.map((d) => (
                    <option key={d._id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg shadow">Create Admin</button>
              </div>
            </form>
          </Modal>

          {/* Add Department Modal */}
          <Modal isOpen={showDeptModal} onClose={() => setShowDeptModal(false)} title="Add Engineering Department" maxWidth="max-w-md">
            <form onSubmit={handleCreateDept} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Artificial Intelligence & Data Science"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dept Code *</label>
                  <input
                    type="text"
                    required
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                    placeholder="e.g. AIDS"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Available Seats *</label>
                  <input
                    type="number"
                    required
                    value={deptForm.availableSeats}
                    onChange={(e) => setDeptForm({ ...deptForm, availableSeats: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowDeptModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow">Add Dept</button>
              </div>
            </form>
          </Modal>

          {/* Edit Seats Modal */}
          <Modal isOpen={!!showEditSeatsModal} onClose={() => setShowEditSeatsModal(null)} title={`Edit Seats for ${showEditSeatsModal?.name}`} maxWidth="max-w-md">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available Lateral Seats</label>
                <input
                  type="number"
                  value={editSeats.availableSeats}
                  onChange={(e) => setEditSeats({ ...editSeats, availableSeats: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Capacity</label>
                <input
                  type="number"
                  value={editSeats.totalCapacity}
                  onChange={(e) => setEditSeats({ ...editSeats, totalCapacity: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button onClick={() => setShowEditSeatsModal(null)} className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg">Cancel</button>
                <button onClick={() => handleUpdateSeats(showEditSeatsModal._id)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow">Save Seats Matrix</button>
              </div>
            </div>
          </Modal>

        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

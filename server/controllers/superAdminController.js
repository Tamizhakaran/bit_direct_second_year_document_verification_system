const User = require('../models/User');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');
const Admission = require('../models/Admission');
const Student = require('../models/Student');
const LandingContent = require('../models/LandingContent');
const bcrypt = require('bcryptjs');

// @desc    Get all admin users
// @route   GET /api/superadmin/admins
// @access  Private (SuperAdmin)
const getAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, admins });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new Admin user
// @route   POST /api/superadmin/admins
// @access  Private (SuperAdmin)
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, department, mobileNumber } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: 'Name, Email, Password, and Department are required' });
    }

    if (!email.toLowerCase().endsWith('@bitsathy.ac.in')) {
      return res.status(400).json({ message: 'Verifier Admin email address must end with @bitsathy.ac.in' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      department,
      mobileNumber: mobileNumber || ''
    });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'CREATE_ADMIN',
      description: `Created new verifier admin account for ${name} (${department})`
    });

    res.status(201).json({
      success: true,
      message: `Admin account for ${department} created successfully`,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Admin active/inactive status
// @route   PUT /api/superadmin/admins/:id/status
// @access  Private (SuperAdmin)
const toggleAdminStatus = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    admin.status = admin.status === 'active' ? 'inactive' : 'active';
    await admin.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'TOGGLE_ADMIN_STATUS',
      description: `Changed admin status for ${admin.name} to ${admin.status}`
    });

    res.json({
      success: true,
      message: `Admin account status changed to ${admin.status}`,
      admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all departments
// @route   GET /api/superadmin/departments
// @access  Private (Public/All Roles can fetch for dropdowns)
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().sort({ code: 1 });
    res.json({ success: true, departments });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new department
// @route   POST /api/superadmin/departments
// @access  Private (SuperAdmin)
const createDepartment = async (req, res, next) => {
  try {
    const { name, code, availableSeats, totalCapacity } = req.body;

    if (!name || !code || !availableSeats) {
      return res.status(400).json({ message: 'Department name, code, and available seats are required' });
    }

    const existingDept = await Department.findOne({
      $or: [{ name }, { code: code.toUpperCase() }]
    });

    if (existingDept) {
      return res.status(400).json({ message: 'Department with this name or code already exists' });
    }

    const department = await Department.create({
      name,
      code: code.toUpperCase(),
      availableSeats: Number(availableSeats),
      totalCapacity: Number(totalCapacity || availableSeats)
    });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'CREATE_DEPARTMENT',
      description: `Added new department ${name} (${code})`
    });

    res.status(201).json({
      success: true,
      message: 'Department added successfully',
      department
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department seats capacity
// @route   PUT /api/superadmin/departments/:id
// @access  Private (SuperAdmin)
const updateDepartmentSeats = async (req, res, next) => {
  try {
    const { availableSeats, totalCapacity, status } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (availableSeats !== undefined) department.availableSeats = Number(availableSeats);
    if (totalCapacity !== undefined) department.totalCapacity = Number(totalCapacity);
    if (status !== undefined) department.status = status;

    await department.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'UPDATE_DEPARTMENT_SEATS',
      description: `Updated seats for department ${department.code} (Available: ${department.availableSeats})`
    });

    res.json({
      success: true,
      message: 'Department seat matrix updated',
      department
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get audit logs
// @route   GET /api/superadmin/audit-logs
// @access  Private (SuperAdmin)
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get superadmin stats & metrics
// @route   GET /api/superadmin/stats
// @access  Private (SuperAdmin)
const getSuperAdminStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalAdmissions = await Admission.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalDepartments = await Department.countDocuments();

    // Department-wise application distribution
    const deptStats = await Admission.aggregate([
      { $group: { _id: '$preferredDepartment', count: { $sum: 1 } } }
    ]);

    // Status distribution
    const statusStats = await Admission.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalAdmissions,
        totalAdmins,
        totalDepartments,
        deptStats,
        statusStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get landing page content (Public / SuperAdmin)
// @route   GET /api/superadmin/landing-content
// @access  Public
const getLandingContent = async (req, res, next) => {
  try {
    let content = await LandingContent.findOne();
    if (!content) {
      // Create initial default landing content if none exists
      content = await LandingContent.create({
        collegeName: 'Bannari Amman Institute of Technology',
        collegeShortName: 'BIT Sathyamangalam',
        tagline: 'Direct Second Year (DNY) Lateral Entry Admission Portal 2026-2027',
        topAnnouncement: {
          brochureText: 'Information Brochure 2026–2027',
          brochureLink: '#',
          contactNumbers: '04295 226086 | 04295 226087 | +91 89401 26000',
          email: 'dnyadmissions@bitsathy.ac.in'
        },
        aboutCampus: {
          title: 'About the Campus',
          description: 'Bannari Amman Institute of Technology is an Autonomous, Self-financing engineering college, approved by AICTE, New Delhi and affiliated to Anna University, Chennai. Nestled on the banks of the river Bhavani, the campus provides environment for learning in harmony with nature, away from the addle of city life. The spacious and the earth-hugging buildings punctuated with landscaped courtyards and pathways are designed to emphasize the business ethics and/or characteristics of an excellent center for learning. The Campus hosts well-equipped academic blocks, computer centres, lecture halls, theater, laboratories, auditorium, specialized centers, hostels and students\' centres. The campus also houses a co-operative store, ATM facility, SBI and KVIB and a clinic to attend to the general health of the students and staff.',
          imageUrl: '',
          highlights: [
            'Autonomous Institution affiliated to Anna University, Chennai',
            'Approved by AICTE, New Delhi & Accredited with A+ Grade by NAAC',
            'Scenic 180+ acre eco-friendly campus nestled on the banks of River Bhavani',
            'State-of-the-art Specialised Research Labs, Innovation Centres & Incubation'
          ]
        },
        achievementBanners: [
          {
            title: 'Bioprospecting Research Lab student received a seed grant support of',
            highlightText: '₹15 Lakhs',
            subtitle: 'Under the Potable Water Solutions category in MSME-IDEA HACKATHON 2.0 from MSME, Govt. of India',
            personName: 'Pradeep S',
            personRole: '(BioTech)',
            badge: '🔬 Research Seed Grant',
            bgGradient: 'from-blue-700 via-sky-600 to-indigo-800',
            active: true
          }
        ]
      });
    }
    if (content && (!content.features || content.features.length === 0)) {
      content.features = [
        {
          category: 'infrastructure',
          title: 'College Infrastructure',
          frontIcon: '🏛️',
          frontTagline: 'State-of-the-art Facilities',
          frontImageUrl: '',
          backHeading: 'World-Class Campus Infrastructure',
          backPoints: [
            '180+ Acre green campus on River Bhavani',
            '50+ Advanced Labs & Innovation Centres',
            'Central Library with 1,00,000+ volumes',
            'High-speed Wi-Fi across all blocks',
            'Smart classrooms & e-learning studios',
            'Sports complex, gym & indoor courts'
          ],
          backBgColor: 'from-blue-600 to-indigo-700',
          active: true,
          order: 0
        },
        {
          category: 'placements',
          title: 'Placement',
          frontIcon: '🏆',
          frontTagline: 'Realizing what you are good at starts with finding what you\'re passionate about.',
          frontImageUrl: '',
          backHeading: 'Stellar Placement Record',
          backPoints: [
            '98.5% overall placement record',
            '300+ top recruiters visit annually',
            'Highest package: ₹42 LPA (2024)',
            'MoUs with TCS, Wipro, Infosys, HCL',
            'Dedicated Training & Placement cell',
            'Internship tie-ups with 100+ companies'
          ],
          backBgColor: 'from-amber-500 to-orange-600',
          active: true,
          order: 1
        },
        {
          category: 'achievements',
          title: 'Achievements',
          frontIcon: '🎖️',
          frontTagline: 'Every achievement is a stepping stone to a higher goal.',
          frontImageUrl: '',
          backHeading: 'National & International Recognition',
          backPoints: [
            'NAAC A+ Accreditation (highest grade)',
            'NIRF Top 100 Engineering Colleges',
            '₹15 Lakhs MSME Hackathon 2.0 Grant',
            '1,329+ Awards & Recognitions',
            'NBA Accredited programmes',
            '50+ Patents filed by students & faculty'
          ],
          backBgColor: 'from-emerald-600 to-teal-700',
          active: true,
          order: 2
        }
      ];
      await content.save();
    }
    res.json({ success: true, landingContent: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college info, about campus, and general landing content
// @route   PUT /api/superadmin/landing-content
// @access  Private (SuperAdmin)
const updateLandingContent = async (req, res, next) => {
  try {
    const {
      collegeName,
      collegeShortName,
      tagline,
      collegeLogo,
      topAnnouncement,
      aboutCampus,
      achievementsList
    } = req.body;

    let content = await LandingContent.findOne();
    if (!content) {
      content = new LandingContent();
    }

    if (collegeName !== undefined) content.collegeName = collegeName;
    if (collegeShortName !== undefined) content.collegeShortName = collegeShortName;
    if (tagline !== undefined) content.tagline = tagline;
    if (collegeLogo !== undefined) content.collegeLogo = collegeLogo;
    if (topAnnouncement) content.topAnnouncement = { ...content.topAnnouncement, ...topAnnouncement };
    if (aboutCampus) content.aboutCampus = { ...content.aboutCampus, ...aboutCampus };
    if (achievementsList) content.achievementsList = achievementsList;
    content.updatedBy = req.user._id;

    await content.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'UPDATE_LANDING_CONTENT',
      description: 'Updated college landing page settings, branding, and description.'
    });

    res.json({
      success: true,
      message: 'College Landing Page content updated successfully',
      landingContent: content
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new Achievement Banner Slide
// @route   POST /api/superadmin/landing-content/banner
// @access  Private (SuperAdmin)
const addAchievementBanner = async (req, res, next) => {
  try {
    const {
      achievementType,
      companyName,
      companyLogo,
      title,
      highlightText,
      subtitle,
      personName,
      personRole,
      personImage,
      badge,
      bgGradient,
      link,
      active
    } = req.body;

    let content = await LandingContent.findOne();
    if (!content) {
      content = new LandingContent();
    }

    content.achievementBanners.push({
      achievementType: achievementType || 'placement',
      companyName: companyName || '',
      companyLogo: companyLogo || '',
      title: title || 'Student Achievement Showcase',
      highlightText: highlightText || '',
      subtitle: subtitle || '',
      personName: personName || '',
      personRole: personRole || '',
      personImage: personImage || '',
      badge: badge || 'Special Recognition',
      bgGradient: bgGradient || 'from-blue-700 via-sky-600 to-indigo-800',
      link: link || '/register',
      active: active !== undefined ? active : true
    });

    content.updatedBy = req.user._id;
    await content.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'ADD_ACHIEVEMENT_BANNER',
      description: `Added achievement banner: ${title}`
    });

    res.status(201).json({
      success: true,
      message: 'Achievement banner added successfully',
      landingContent: content
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an Achievement Banner Slide
// @route   PUT /api/superadmin/landing-content/banner/:id
// @access  Private (SuperAdmin)
const updateAchievementBanner = async (req, res, next) => {
  try {
    const bannerId = req.params.id;
    let content = await LandingContent.findOne();
    if (!content) {
      return res.status(404).json({ message: 'Landing content not found' });
    }

    const banner = content.achievementBanners.id(bannerId);
    if (!banner) {
      return res.status(404).json({ message: 'Banner slide not found' });
    }

    const {
      achievementType,
      companyName,
      companyLogo,
      title,
      highlightText,
      subtitle,
      personName,
      personRole,
      personImage,
      badge,
      bgGradient,
      link,
      active
    } = req.body;

    if (achievementType !== undefined) banner.achievementType = achievementType;
    if (companyName !== undefined) banner.companyName = companyName;
    if (companyLogo !== undefined) banner.companyLogo = companyLogo;
    if (title !== undefined) banner.title = title;
    if (highlightText !== undefined) banner.highlightText = highlightText;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (personName !== undefined) banner.personName = personName;
    if (personRole !== undefined) banner.personRole = personRole;
    if (personImage !== undefined) banner.personImage = personImage;
    if (badge !== undefined) banner.badge = badge;
    if (bgGradient !== undefined) banner.bgGradient = bgGradient;
    if (link !== undefined) banner.link = link;
    if (active !== undefined) banner.active = active;

    content.updatedBy = req.user._id;
    await content.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'UPDATE_ACHIEVEMENT_BANNER',
      description: `Updated achievement banner: ${banner.title}`
    });

    res.json({
      success: true,
      message: 'Banner slide updated successfully',
      landingContent: content
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an Achievement Banner Slide
// @route   DELETE /api/superadmin/landing-content/banner/:id
// @access  Private (SuperAdmin)
const deleteAchievementBanner = async (req, res, next) => {
  try {
    const bannerId = req.params.id;
    let content = await LandingContent.findOne();
    if (!content) {
      return res.status(404).json({ message: 'Landing content not found' });
    }

    content.achievementBanners.pull(bannerId);
    content.updatedBy = req.user._id;
    await content.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'DELETE_ACHIEVEMENT_BANNER',
      description: `Deleted achievement banner ID: ${bannerId}`
    });

    res.json({
      success: true,
      message: 'Banner slide deleted successfully',
      landingContent: content
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload landing page image (Campus photo, Logo, or Banner image)
// @route   POST /api/superadmin/landing-content/upload-image
// @access  Private (SuperAdmin)
const uploadLandingImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a feature card (Infrastructure / Placements / Achievements)
// @route   POST /api/superadmin/landing-content/feature
// @access  Private (SuperAdmin)
const addFeatureCard = async (req, res, next) => {
  try {
    let content = await LandingContent.findOne();
    if (!content) content = await LandingContent.create({});

    const { category, title, frontIcon, frontTagline, frontImageUrl, backHeading, backPoints, backBgColor } = req.body;
    if (!category || !title) {
      return res.status(400).json({ message: 'Category and title are required' });
    }

    content.features = content.features || [];
    content.features.push({
      category,
      title,
      frontIcon: frontIcon || '🏛️',
      frontTagline: frontTagline || '',
      frontImageUrl: frontImageUrl || '',
      backHeading: backHeading || title,
      backPoints: backPoints || [],
      backBgColor: backBgColor || 'from-blue-600 to-indigo-700',
      active: true,
      order: content.features.length
    });

    content.updatedBy = req.user._id;
    await content.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'ADD_FEATURE_CARD',
      description: `Added feature card: ${title} (${category})`
    });

    res.status(201).json({ success: true, message: 'Feature card added', features: content.features });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a feature card
// @route   PUT /api/superadmin/landing-content/feature/:id
// @access  Private (SuperAdmin)
const updateFeatureCard = async (req, res, next) => {
  try {
    const content = await LandingContent.findOne();
    if (!content) return res.status(404).json({ message: 'Landing content not found' });

    const feature = content.features.id(req.params.id);
    if (!feature) return res.status(404).json({ message: 'Feature card not found' });

    const fields = ['category', 'title', 'frontIcon', 'frontTagline', 'frontImageUrl', 'backHeading', 'backPoints', 'backBgColor', 'active', 'order'];
    fields.forEach((f) => { if (req.body[f] !== undefined) feature[f] = req.body[f]; });

    content.updatedBy = req.user._id;
    await content.save();

    res.json({ success: true, message: 'Feature card updated', features: content.features });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a feature card
// @route   DELETE /api/superadmin/landing-content/feature/:id
// @access  Private (SuperAdmin)
const deleteFeatureCard = async (req, res, next) => {
  try {
    const content = await LandingContent.findOne();
    if (!content) return res.status(404).json({ message: 'Landing content not found' });

    content.features.pull(req.params.id);
    content.updatedBy = req.user._id;
    await content.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'DELETE_FEATURE_CARD',
      description: `Deleted feature card ID: ${req.params.id}`
    });

    res.json({ success: true, message: 'Feature card deleted', features: content.features });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a campus gallery photo
// @route   POST /api/superadmin/landing-content/gallery
// @access  Private (SuperAdmin)
const addCampusPhoto = async (req, res, next) => {
  try {
    const { imageUrl, title } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });

    let content = await LandingContent.findOne();
    if (!content) content = await LandingContent.create({});

    content.campusGallery = content.campusGallery || [];
    content.campusGallery.push({
      imageUrl,
      title: title || 'Campus Facility',
      order: content.campusGallery.length,
      active: true
    });
    content.updatedBy = req.user._id;
    await content.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'ADD_CAMPUS_PHOTO',
      description: `Added campus gallery photo: ${title || 'Campus Facility'}`
    });

    res.status(201).json({ success: true, message: 'Campus photo added', campusGallery: content.campusGallery });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a campus gallery photo (title / active / order)
// @route   PUT /api/superadmin/landing-content/gallery/:id
// @access  Private (SuperAdmin)
const updateCampusPhoto = async (req, res, next) => {
  try {
    const content = await LandingContent.findOne();
    if (!content) return res.status(404).json({ message: 'Landing content not found' });

    const photo = content.campusGallery.id(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Campus photo not found' });

    ['title', 'active', 'order', 'imageUrl'].forEach((f) => {
      if (req.body[f] !== undefined) photo[f] = req.body[f];
    });

    content.updatedBy = req.user._id;
    await content.save();

    res.json({ success: true, message: 'Campus photo updated', campusGallery: content.campusGallery });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a campus gallery photo
// @route   DELETE /api/superadmin/landing-content/gallery/:id
// @access  Private (SuperAdmin)
const deleteCampusPhoto = async (req, res, next) => {
  try {
    const content = await LandingContent.findOne();
    if (!content) return res.status(404).json({ message: 'Landing content not found' });

    content.campusGallery.pull(req.params.id);
    content.updatedBy = req.user._id;
    await content.save();

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      role: 'superadmin',
      action: 'DELETE_CAMPUS_PHOTO',
      description: `Deleted campus gallery photo ID: ${req.params.id}`
    });

    res.json({ success: true, message: 'Campus photo deleted', campusGallery: content.campusGallery });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdmins,
  createAdmin,
  toggleAdminStatus,
  getDepartments,
  createDepartment,
  updateDepartmentSeats,
  getAuditLogs,
  getSuperAdminStats,
  getLandingContent,
  updateLandingContent,
  addAchievementBanner,
  updateAchievementBanner,
  deleteAchievementBanner,
  uploadLandingImage,
  addFeatureCard,
  updateFeatureCard,
  deleteFeatureCard,
  addCampusPhoto,
  updateCampusPhoto,
  deleteCampusPhoto
};

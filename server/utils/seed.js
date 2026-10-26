const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Admission = require('../models/Admission');
const Document = require('../models/Document');
const Department = require('../models/Department');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const LandingContent = require('../models/LandingContent');

// Sample Document generator helper
const createDummySampleDocumentFile = (filename) => {
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `Sample BIT DNY Verification Document File: ${filename}`);
  }
  return `/uploads/${filename}`;
};

const seedData = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bit_dny_db';
    console.log(`Connecting to MongoDB for Seeding at ${connStr}...`);
    
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    }).catch(async (err) => {
      console.log('Local MongoDB unavailable for seed, using in-memory MongoDB fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
    });

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Admission.deleteMany({});
    await Document.deleteMany({});
    await Department.deleteMany({});
    await Notification.deleteMany({});
    await AuditLog.deleteMany({});
    await LandingContent.deleteMany({});

    console.log('Seeding Departments...');
    const departments = await Department.insertMany([
      { name: 'Computer Science and Engineering', code: 'CSE', availableSeats: 45, totalCapacity: 60, filledSeats: 15 },
      { name: 'Information Technology', code: 'IT', availableSeats: 38, totalCapacity: 60, filledSeats: 22 },
      { name: 'Electronics and Communication Engineering', code: 'ECE', availableSeats: 40, totalCapacity: 60, filledSeats: 20 },
      { name: 'Electrical and Electronics Engineering', code: 'EEE', availableSeats: 30, totalCapacity: 40, filledSeats: 10 },
      { name: 'Mechanical Engineering', code: 'MECH', availableSeats: 32, totalCapacity: 40, filledSeats: 8 },
      { name: 'Civil Engineering', code: 'CIVIL', availableSeats: 25, totalCapacity: 30, filledSeats: 5 }
    ]);

    const salt = await bcrypt.genSalt(10);
    const superAdminPassword = await bcrypt.hash('SuperAdmin@123', salt);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const studentPassword = await bcrypt.hash('Student@123', salt);

    console.log('Seeding Super Admin...');
    const superAdmin = await User.create({
      name: 'Super Administrator',
      email: 'superadmin@bitsathy.ac.in',
      password: superAdminPassword,
      role: 'superadmin',
      mobileNumber: '9876543210',
      status: 'active'
    });

    console.log('Seeding Custom Super Admin...');
    await User.create({
      name: 'Tamizhakaran K',
      email: 'tamizhakaran.me23@bitsathy.ac.in',
      password: superAdminPassword,
      role: 'superadmin',
      mobileNumber: '9876543219',
      status: 'active'
    });

    console.log('Seeding Verifier Admin...');
    const cseAdmin = await User.create({
      name: 'Dr. R. K. Sharma (CSE Verifier)',
      email: 'admin.cse@bitsathy.ac.in',
      password: adminPassword,
      role: 'admin',
      department: 'Computer Science and Engineering',
      mobileNumber: '9876543211',
      status: 'active'
    });

    const itAdmin = await User.create({
      name: 'Dr. S. Priya (IT Verifier)',
      email: 'admin.it@bitsathy.ac.in',
      password: adminPassword,
      role: 'admin',
      department: 'Information Technology',
      mobileNumber: '9876543212',
      status: 'active'
    });

    console.log('Seeding Sample Students...');
    // Student 1: Verified/Submitted student
    const studentUser1 = await User.create({
      name: 'Kaviyarasan M',
      email: 'student@gmail.com',
      password: studentPassword,
      role: 'student',
      registerNumber: '21DIPCS045',
      mobileNumber: '9842100001',
      status: 'active'
    });

    const studentProfile1 = await Student.create({
      userId: studentUser1._id,
      personalDetails: {
        fullName: 'Kaviyarasan M',
        dob: '2004-05-14',
        gender: 'Male',
        mobileNumber: '9842100001',
        email: 'student@gmail.com',
        aadhaarNumber: '123456789012',
        bloodGroup: 'O+positive',
        nationality: 'Indian',
        community: 'BC'
      },
      address: {
        doorNo: '42/A',
        street: 'Gandhi Road',
        city: 'Sathyamangalam',
        district: 'Erode',
        state: 'Tamil Nadu',
        pincode: '638401'
      },
      parentDetails: {
        parentName: 'Murugesan K',
        relationship: 'Father',
        parentMobile: '9842199999',
        parentEmail: 'murugesan@gmail.com',
        occupation: 'Agriculture',
        annualIncome: '1,80,000'
      },
      academicDetails: {
        diplomaCollege: 'Government Polytechnic College, Erode',
        diplomaBranch: 'Computer Engineering',
        registerNumber: '21DIPCS045',
        passingYear: '2024',
        percentageCGPA: '92.5'
      },
      profileCompletion: 100
    });

    const admission1 = await Admission.create({
      studentId: studentProfile1._id,
      userId: studentUser1._id,
      applicationNumber: 'BIT-DNY-2026-0001',
      preferredDepartment: 'Computer Science and Engineering',
      secondaryDepartment: 'Information Technology',
      academicDetails: studentProfile1.academicDetails,
      status: 'Under Verification',
      submittedAt: new Date(Date.now() - 86400000 * 2)
    });

    // Sample documents for Student 1
    const file1 = createDummySampleDocumentFile('kaviyarasan_10th_marksheet.pdf');
    const file2 = createDummySampleDocumentFile('kaviyarasan_diploma_marksheet.pdf');
    const file3 = createDummySampleDocumentFile('kaviyarasan_transfer_cert.pdf');
    const file4 = createDummySampleDocumentFile('kaviyarasan_community_cert.pdf');

    await Document.create([
      {
        studentId: studentProfile1._id,
        userId: studentUser1._id,
        documentType: '10th Mark Sheet',
        fileName: '10th_Marksheet_Kaviyarasan.pdf',
        filePath: file1,
        fileSize: 452100,
        mimeType: 'application/pdf',
        status: 'Verified',
        remarks: 'Original verified with state board database',
        verifiedBy: cseAdmin._id,
        verifiedAt: new Date()
      },
      {
        studentId: studentProfile1._id,
        userId: studentUser1._id,
        documentType: 'Diploma Mark Sheet',
        fileName: 'Diploma_Consolidated_Marksheet.pdf',
        filePath: file2,
        fileSize: 685000,
        mimeType: 'application/pdf',
        status: 'Pending',
        remarks: ''
      },
      {
        studentId: studentProfile1._id,
        userId: studentUser1._id,
        documentType: 'Transfer Certificate',
        fileName: 'TC_GovtPolytechnic.pdf',
        filePath: file3,
        fileSize: 312000,
        mimeType: 'application/pdf',
        status: 'Pending',
        remarks: ''
      },
      {
        studentId: studentProfile1._id,
        userId: studentUser1._id,
        documentType: 'Community Certificate',
        fileName: 'Community_Certificate_BC.pdf',
        filePath: file4,
        fileSize: 290000,
        mimeType: 'application/pdf',
        status: 'Verified',
        remarks: 'Verified',
        verifiedBy: cseAdmin._id,
        verifiedAt: new Date()
      }
    ]);

    // Student 2: Approved Student
    const studentUser2 = await User.create({
      name: 'Ananya S',
      email: 'ananya.s@gmail.com',
      password: studentPassword,
      role: 'student',
      registerNumber: '21DIPIT012',
      mobileNumber: '9842100002',
      status: 'active'
    });

    const studentProfile2 = await Student.create({
      userId: studentUser2._id,
      personalDetails: {
        fullName: 'Ananya S',
        dob: '2004-08-20',
        gender: 'Female',
        mobileNumber: '9842100002',
        email: 'ananya.s@gmail.com',
        aadhaarNumber: '987654321098',
        community: 'OC'
      },
      academicDetails: {
        diplomaCollege: 'PSG Polytechnic College, Coimbatore',
        diplomaBranch: 'Information Technology',
        registerNumber: '21DIPIT012',
        passingYear: '2024',
        percentageCGPA: '95.2'
      },
      profileCompletion: 100
    });

    await Admission.create({
      studentId: studentProfile2._id,
      userId: studentUser2._id,
      applicationNumber: 'BIT-DNY-2026-0002',
      preferredDepartment: 'Computer Science and Engineering',
      academicDetails: studentProfile2.academicDetails,
      status: 'Approved',
      adminRemarks: 'Application and all documents verified. Admission granted.',
      verifiedBy: cseAdmin._id,
      submittedAt: new Date(Date.now() - 86400000 * 5),
      verifiedAt: new Date()
    });

    // Student 3: Correction Required
    const studentUser3 = await User.create({
      name: 'Rajesh Kumar B',
      email: 'rajesh.b@gmail.com',
      password: studentPassword,
      role: 'student',
      registerNumber: '21DIPEC088',
      mobileNumber: '9842100003',
      status: 'active'
    });

    const studentProfile3 = await Student.create({
      userId: studentUser3._id,
      personalDetails: {
        fullName: 'Rajesh Kumar B',
        dob: '2003-11-05',
        gender: 'Male',
        mobileNumber: '9842100003',
        email: 'rajesh.b@gmail.com'
      },
      academicDetails: {
        diplomaCollege: 'Nachimuthu Polytechnic College, Pollachi',
        diplomaBranch: 'Electronics & Communication',
        registerNumber: '21DIPEC088',
        passingYear: '2024',
        percentageCGPA: '84.0'
      },
      profileCompletion: 85
    });

    await Admission.create({
      studentId: studentProfile3._id,
      userId: studentUser3._id,
      applicationNumber: 'BIT-DNY-2026-0003',
      preferredDepartment: 'Electronics and Communication Engineering',
      academicDetails: studentProfile3.academicDetails,
      status: 'Correction Required',
      adminRemarks: 'Diploma Marksheet copy is unclear. Please upload scanned original.',
      submittedAt: new Date(Date.now() - 86400000 * 1)
    });

    // Seed Initial Notifications
    await Notification.create([
      {
        userId: studentUser1._id,
        title: 'Application Under Verification',
        message: 'Your application for CSE is currently being reviewed by Dr. R. K. Sharma.',
        type: 'info'
      },
      {
        userId: studentUser2._id,
        title: '🎉 Admission Approved!',
        message: 'Congratulations! Your DNY admission application for Computer Science and Engineering has been approved.',
        type: 'success'
      },
      {
        userId: studentUser3._id,
        title: 'Action Required: Document Correction',
        message: 'Your Diploma Mark Sheet was rejected. Reason: Image blurry, re-upload clear scan.',
        type: 'warning'
      }
    ]);

    // Seed Landing Content
    console.log('Seeding Landing Content & Achievement Banners...');
    await LandingContent.create({
      collegeName: 'Bannari Amman Institute of Technology',
      collegeShortName: 'BIT Sathyamangalam',
      tagline: 'Direct Second Year (DNY) Lateral Entry Admission Portal 2026-2027',
      collegeLogo: '',
      topAnnouncement: {
        brochureText: 'Information Brochure 2026–2027',
        brochureLink: '#',
        contactNumbers: '04295 226086 | 04295 226087 | +91 89401 26000',
        email: 'dnyadmissions@bitsathy.ac.in'
      },
      aboutCampus: {
        title: 'About the Campus',
        description: 'Bannari Amman Institute of Technology is an Autonomous, Self-financing engineering college, approved by AICTE, New Delhi and affiliated to Anna University, Chennai. Nestled on the banks of the river Bhavani, the campus provides environment for learning in harmony with nature, away from the addle of city life. The spacious and the earth-hugging buildings punctuated with landscaped courtyards and pathways are designed to emphasize the business ethics and/or characteristics of an excellent center for learning. The Campus hosts well-equipped academic blocks, computer centres, lecture halls, theater, laboratories, auditorium, specialized centers, hostels and students\' centres. The campus also houses a co-operative store, ATM facility, SBI and KVIB and a clinic to attend to the general health of the students and staff.',
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
        highlights: [
          'Autonomous Institution affiliated to Anna University, Chennai',
          'Approved by AICTE, New Delhi & Accredited with A+ Grade by NAAC',
          'Scenic 180+ acre eco-friendly campus nestled on the banks of River Bhavani',
          'State-of-the-art Specialised Research Labs, Innovation Centres & Incubation'
        ]
      },
      achievementBanners: [
        {
          achievementType: 'placement',
          companyName: 'Google',
          title: 'Manufacturing And Fabrication Lab Student Got Offer AT Google',
          highlightText: '₹20 LPA',
          subtitle: 'Placed with premier engineering CTC package in Cloud & Hardware Systems at Google campus placement drive',
          personName: 'TAMIZHAKARAN K',
          personRole: '(Mechanical)',
          badge: '💼 Campus Placement',
          bgGradient: 'from-slate-900 via-blue-900 to-indigo-950',
          active: true,
          order: 1
        },
        {
          achievementType: 'grant',
          title: 'Bioprospecting Research Lab student received a seed grant support of',
          highlightText: '₹15 Lakhs',
          subtitle: 'Under the Potable Water Solutions category in MSME-IDEA HACKATHON 2.0 from MSME, Govt. of India',
          personName: 'Pradeep S',
          personRole: '(BioTech)',
          badge: '🔬 Research Grant',
          bgGradient: 'from-blue-700 via-sky-600 to-indigo-800',
          active: true,
          order: 2
        },
        {
          achievementType: 'academic',
          title: 'National Institutional Ranking Framework (NIRF) & NAAC Accreditation',
          highlightText: 'NAAC "A+" Grade',
          subtitle: 'Consistently ranked among Top 100 Premier Engineering Institutions across India with 300+ Patent Filings',
          personName: 'Research & Innovation Cell',
          personRole: 'BIT Sathyamangalam',
          badge: '🎖️ Top Tier-1 Ranking',
          bgGradient: 'from-indigo-900 via-purple-800 to-slate-900',
          active: true,
          order: 3
        },
        {
          achievementType: 'general',
          title: 'Direct Second Year Lateral Entry Admissions Open',
          highlightText: '100% Digital Flow',
          subtitle: 'Seamless online onboarding for Diploma Engineers with instant document verification and real-time status tracking',
          personName: 'Admission Directorate',
          personRole: '2026-27 Academic Session',
          badge: '📢 Admissions Open',
          bgGradient: 'from-sky-700 via-blue-600 to-indigo-800',
          active: true,
          order: 4
        }
      ],
      achievementsList: [
        {
          metric: '₹15 Lakhs',
          title: 'MSME Idea Hackathon 2.0 Grant',
          description: 'Awarded to student innovators for Potable Water Solutions research by Govt. of India',
          badge: 'Govt. of India'
        },
        {
          metric: 'NAAC A+',
          title: 'Grade Accreditation',
          description: 'Recognized for world-class academic excellence, labs, and research infrastructure',
          badge: 'Autonomous'
        },
        {
          metric: 'Top 100',
          title: 'NIRF Engineering Rank',
          description: 'Consistently ranked among top premier engineering institutes in India',
          badge: 'National Rank'
        },
        {
          metric: '98.5%',
          title: 'Placement Track Record',
          description: 'Over 300+ global corporate recruiters visit annually with premier packages',
          badge: 'Industry Connect'
        }
      ],
      campusGallery: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1567521464027-f127df144346?auto=format&fit=crop&w=800&q=80',
          title: 'Dining Hall / Mess',
          order: 0,
          active: true
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=800&q=80',
          title: 'Smart Auditorium',
          order: 1,
          active: true
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
          title: 'High-Tech Gym',
          order: 2,
          active: true
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=800&q=80',
          title: 'Sports Corner / Play Ground',
          order: 3,
          active: true
        }
      ],
      updatedBy: superAdmin._id
    });

    // System Audit Log
    await AuditLog.create({
      userId: superAdmin._id,
      userName: superAdmin.name,
      role: 'superadmin',
      action: 'SYSTEM_SEED',
      description: 'Initial system database seed completed with departments, admins, test applications, and landing content.'
    });

    console.log('✅ DATABASE SEED COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('Super Admin Login : superadmin@bitsathy.ac.in / SuperAdmin@123');
    console.log('Verifier Admin    : admin.cse@bitsathy.ac.in / Admin@123');
    console.log('Student Login     : student@gmail.com / Student@123');
    console.log('----------------------------------------------------');
    
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ SEEDING ERROR:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;

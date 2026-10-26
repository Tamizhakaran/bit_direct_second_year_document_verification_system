const mongoose = require('mongoose');

const BannerSlideSchema = new mongoose.Schema({
  achievementType: {
    type: String,
    enum: ['placement', 'grant', 'competition', 'academic', 'general'],
    default: 'placement'
  },
  companyName: {
    type: String,
    default: ''
  },
  companyLogo: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true,
    default: 'Bioprospecting Research Lab student received a seed grant support of'
  },
  highlightText: {
    type: String,
    default: '₹15 Lakhs'
  },
  subtitle: {
    type: String,
    default: 'Under the Potable Water Solutions category in MSME-IDEA HACKATHON 2.0 from MSME, Govt. of India'
  },
  personName: {
    type: String,
    default: 'Pradeep S'
  },
  personRole: {
    type: String,
    default: '(BioTech)'
  },
  personImage: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: 'Campus Placement'
  },
  bgGradient: {
    type: String,
    default: 'from-blue-700 via-sky-600 to-indigo-800'
  },
  link: {
    type: String,
    default: '/register'
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const LandingContentSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    default: 'Bannari Amman Institute of Technology'
  },
  collegeShortName: {
    type: String,
    default: 'BIT Sathyamangalam'
  },
  tagline: {
    type: String,
    default: 'Direct Second Year (DNY) Lateral Entry Admission Portal 2026-2027'
  },
  collegeLogo: {
    type: String,
    default: ''
  },
  topAnnouncement: {
    brochureText: {
      type: String,
      default: 'Information Brochure 2026–2027'
    },
    brochureLink: {
      type: String,
      default: '#'
    },
    contactNumbers: {
      type: String,
      default: '04295 226086 | 04295 226087 | +91 89401 26000'
    },
    email: {
      type: String,
      default: 'dnyadmissions@bitsathy.ac.in'
    }
  },
  aboutCampus: {
    title: {
      type: String,
      default: 'About the Campus'
    },
    description: {
      type: String,
      default: 'Bannari Amman Institute of Technology is an Autonomous, Self-financing engineering college, approved by AICTE, New Delhi and affiliated to Anna University, Chennai. Nestled on the banks of the river Bhavani, the campus provides environment for learning in harmony with nature, away from the addle of city life. The spacious and the earth-hugging buildings punctuated with landscaped courtyards and pathways are designed to emphasize the business ethics and/or characteristics of an excellent center for learning. The Campus hosts well-equipped academic blocks, computer centres, lecture halls, theater, laboratories, auditorium, specialized centers, hostels and students\' centres. The campus also houses a co-operative store, ATM facility, SBI and KVIB and a clinic to attend to the general health of the students and staff.'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    highlights: {
      type: [String],
      default: [
        'Autonomous Institution affiliated to Anna University, Chennai',
        'Approved by AICTE, New Delhi & Accredited with A+ Grade by NAAC',
        'Scenic 180+ acre eco-friendly campus nestled on the banks of River Bhavani',
        'State-of-the-art Specialised Research Labs, Innovation Centres & Incubation'
      ]
    }
  },
  achievementBanners: [BannerSlideSchema],
  achievementsList: [
    {
      metric: { type: String, default: '₹15 Lakhs' },
      title: { type: String, default: 'MSME Idea Hackathon 2.0 Grant' },
      description: { type: String, default: 'Awarded to student innovators for Potable Water Solutions research' },
      badge: { type: String, default: 'Govt. of India' }
    },
    {
      metric: { type: String, default: 'NAAC A+' },
      title: { type: String, default: 'Grade Accreditation' },
      description: { type: String, default: 'Recognized for world-class academic excellence and infrastructure' },
      badge: { type: String, default: 'Autonomous' }
    },
    {
      metric: { type: String, default: 'Top 100' },
      title: { type: String, default: 'NIRF Engineering Rank' },
      description: { type: String, default: 'Consistently ranked among top premier engineering institutes in India' },
      badge: { type: String, default: 'National Rank' }
    },
    {
      metric: { type: String, default: '98.5%' },
      title: { type: String, default: 'Placement Track Record' },
      description: { type: String, default: 'Over 300+ recruiters visit annually with top Tier-1 packages' },
      badge: { type: String, default: 'Industry Connect' }
    }
  ],
  features: {
    type: [
      {
        category: { type: String, enum: ['infrastructure', 'placements', 'achievements'], required: true },
        title: { type: String, required: true },
        frontIcon: { type: String, default: '🏛️' },
        frontTagline: { type: String, default: '' },
        frontImageUrl: { type: String, default: '' },
        backHeading: { type: String, default: '' },
        backPoints: { type: [String], default: [] },
        backBgColor: { type: String, default: 'from-blue-600 to-indigo-700' },
        active: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
      }
    ],
    default: [
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
    ]
  },
  campusGallery: {
    type: [
      {
        imageUrl: { type: String, required: true },
        title: { type: String, default: 'Campus Facility' },
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true }
      }
    ],
    default: []
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('LandingContent', LandingContentSchema);

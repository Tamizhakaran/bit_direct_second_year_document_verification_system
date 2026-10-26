import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              <span className="font-extrabold text-base tracking-tight">BIT DNY Admission</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Bannari Amman Institute of Technology (BIT), Sathyamangalam. Direct Second Year (Lateral Entry) Digital Admission & Verification System.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Quick Portal Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About DNY Admission</a></li>
              <li><a href="#process" className="hover:text-blue-400 transition-colors">6-Step Eligibility Workflow</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Security & Verification</a></li>
              <li><a href="/login" className="hover:text-blue-400 transition-colors">Student & Verifier Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Departments Available</h4>
            <ul className="space-y-2">
              <li>Computer Science & Engineering</li>
              <li>Information Technology</li>
              <li>Electronics & Communication</li>
              <li>Electrical & Electronics</li>
              <li>Mechanical & Civil Engineering</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold mb-3 uppercase tracking-wider text-[11px]">Admission Support</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Sathyamangalam, Erode, Tamil Nadu 638401</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>+91 4295 226000 / 226226</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>dnyadmissions@bitsathy.ac.in</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px]">
          <p>© 2026 Bannari Amman Institute of Technology. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for DNY Admission Onboarding & Document Verification</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

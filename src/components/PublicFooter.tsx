import React from 'react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {


  return (
    <footer className="bg-[#0F0F0F] text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-screen-2xl px-4 py-12 md:px-8 2xl:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-20">
          
          {/* Column 1 - Brand Info */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">
              couriertrackr.in
            </h2>
            <p className="text-sm leading-relaxed text-[#B0B0B0]">
              Simple and reliable digital courier tracking. <br className="hidden md:block" />
              Track your shipment status and estimated delivery time with ease.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-[#B0B0B0]">
              <li>
                <Link to="/home" className="transition-colors hover:text-orange-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-orange-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-orange-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm text-[#B0B0B0]">
              
              <li>
                <span className="mr-2">✉️</span> Email: tbsdeliverypartner@gmail.comm
              </li>
              <li>
                <span className="mr-2">⏰</span> Support: 24×7 Available
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#333333]">
        <div className="mx-auto max-w-screen-2xl px-4 py-6 md:px-8 2xl:px-10">
          <p className="text-center text-sm text-[#B0B0B0] md:text-center">
            © 2026 couriertrackr.in All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

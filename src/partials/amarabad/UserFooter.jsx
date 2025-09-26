import React from 'react';
import MeeTicketLogo from '../../images/user/logo.png';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Quick links',
    links: [
      { label: 'Home', href: '/amrabad-resort' },
      { label: 'App Download', href: 'https://play.google.com/store/apps/details?id=com.me_ticket_app&pcampaignid=web_share', target: '_blank' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help & FAQs', href: '/amrabad-resort/help-faqs' },
      { label: 'Contact Support', href: '/amrabad-resort/contact-us' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/amrabad-resort/privacy-policy' },
      { label: 'Terms & Conditions', href: '/amrabad-resort/terms-conditions' },
      { label: 'Refund & Cancellation', href: '/amrabad-resort/coming-soon' },
    ],
  },
];

function UserFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-8">
      <div className="container mx-auto px-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 pb-12">
          {/* Left: Logo and tagline */}
          <div className="flex flex-col md:flex-row md:items-start md:w-2/5 gap-3">
            <img src={MeeTicketLogo} alt="Chief Minister Logo" width={85} />
            <div>
              <div className="text-lg lg:text-xl xl:text-2xl font-normal text-black mb-2 mt-3">Quick Tickets & Easy Entry - Just Tap, Scan, and Go!</div>

              <div className="flex gap-6 mt-4 md:mt-10">
                {/* Facebook */}
                <a href="https://www.facebook.com/amrabadtigerreserve/" target='_blank' rel="noreferrer" aria-label="Facebook" className="text-black hover:text-blue-600">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" fill="currentColor" /></svg>
                </a>
                {/* Twitter */}
                <a href="https://x.com/AmrabadTiger" target='_blank' rel="noreferrer" aria-label="X (Twitter)" className="text-black hover:text-blue-400">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* Right: Links */}
          <div className="flex flex-wrap md:flex-nowrap flex-1 justify-between gap-8">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <div className="font-extrabold text-base mb-4 text-black">{col.title}</div>
                <ul className="space-y-2 text-[#6D6D6D]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} target={link.target} className="hover:underline">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Copyright bar */}
      <div className="bg-gray-200 py-6 text-center text-sm text-gray-700">
        <div className="container mx-auto">
          <span>Copyright © 2025 <span className="font-bold">MEETICKET</span> | Content owned, maintained and updated by <span className="font-bold">MEETICKET</span></span>
        </div>
      </div>
    </footer>
  );
}

export default UserFooter;
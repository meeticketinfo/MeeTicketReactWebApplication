import React from 'react';
import MeeTicketLogo from '../../images/user/logo.png';

const footerLinks = [
  {
    title: 'Quick links',
    links: [
      { label: 'Home', href: '#' },
      { label: 'Book Tickets', href: '#' },
      { label: 'Services', href: '#' },
      { label: 'App Download', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help & FAQs', href: '#' },
      { label: 'Contact Support', href: '#' },
      { label: 'Report an Issue', href: '#' },
      { label: 'Feedback', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Refund & Cancellation', href: '#' },
      { label: 'Accessibility Statement', href: '#' },
    ],
  },
];

function UserFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 pb-12">
          {/* Left: Logo and tagline */}
          <div className="flex flex-col md:flex-row md:items-start gap-3 md:w-2/5">
            <img src={MeeTicketLogo} alt="Chief Minister Logo" width={85} />
            <div>
              <div className="text-2xl md:text-2xl font-normal text-black mb-2 mt-3">Quick Tickets & Easy Entry - Just Tap, Scan, and Go!</div>

              <div className="flex gap-6 mt-14">
                {/* Facebook */}
                <a href="#" aria-label="Facebook" className="text-black hover:text-blue-600">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" fill="currentColor" /></svg>
                </a>
                {/* Twitter */}
                <a href="#" aria-label="Twitter" className="text-black hover:text-blue-400">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M22.46 6c-.793.352-1.645.59-2.54.698a4.48 4.48 0 001.963-2.475 8.94 8.94 0 01-2.828 1.082A4.48 4.48 0 0016.11 4c-2.485 0-4.5 2.015-4.5 4.5 0 .353.04.697.116 1.027C7.728 9.39 4.1 7.61 1.671 4.965c-.388.666-.61 1.44-.61 2.265 0 1.563.796 2.942 2.006 3.75a4.48 4.48 0 01-2.037-.563v.057c0 2.183 1.553 4.005 3.617 4.422a4.52 4.52 0 01-2.032.077c.573 1.788 2.236 3.09 4.207 3.125A9.01 9.01 0 012 19.54a12.73 12.73 0 006.92 2.03c8.302 0 12.846-6.876 12.846-12.846 0-.196-.004-.392-.013-.586A9.18 9.18 0 0024 4.59a8.98 8.98 0 01-2.54.698z" fill="currentColor" /></svg>
                </a>
                {/* Instagram */}
                <a href="#" aria-label="Instagram" className="text-black hover:text-pink-500">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 110 10.5 5.25 5.25 0 010-10.5zm0 1.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm6.25 1.25a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" /></svg>
                </a>
              </div>
            </div>
          </div>
          {/* Right: Links */}
          <div className="flex flex-1 justify-between gap-8">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <div className="font-extrabold text-base mb-5 text-black">{col.title}</div>
                <ul className="space-y-3 text-[#6D6D6D]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="hover:underline">{link.label}</a>
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
import React from 'react'
import UserLayout from '../../../../layouts/UserLayout'
import { Link } from 'react-router-dom'
import { SiGnuprivacyguard } from "react-icons/si";
import { MdOutlinePolicy } from "react-icons/md";

const AmrabadPrivacyPolicy = () => {
  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#304A3A] to-[#7A8F7C] text-[#FDFAF7] py-8">
          <div className="container mx-auto px-4">

            <h1 className="text-3xl flex items-center gap-2 font-bold mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
              <MdOutlinePolicy/> Privacy Policy
            </h1>
            <p className="text-[#D0D7CE]">
              Last Updated: December 2024
            </p>
            <p className="text-[#D0D7CE] mt-2">
              At Amrabad Tiger Reserve Booking Portal, we value your privacy and are committed to protecting your personal information.This Privacy Policy explains how we collect, use, and safeguard your data when you use our website, mobile app, or services.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            
            {/* Section 1 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                When you use our booking services, we may collect:
              </p>
              <ul className="space-y-2 text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                <li>• <strong>Personal Information:</strong> Name, phone number, email, address, government ID (for check-in/permits).</li>
                <li>• <strong>Booking Details:</strong> Safari date, time, resort reservation details, and payment history.</li>
                <li>• <strong>Payment Information:</strong> Securely processed through authorized payment gateways (we do not store card/UPI details).</li>
                <li>• <strong>Technical Data:</strong> IP address, browser type, device information, and cookies for better user experience.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                We use the collected information to:
              </p>
              <ul className="space-y-2 text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                <li>• Confirm and manage safari & resort bookings.</li>
                <li>• Provide customer support and updates about your reservation.</li>
                <li>• Send payment receipts, booking confirmations, and cancellation notices.</li>
                <li>• Improve our website, mobile app, and overall user experience.</li>
                <li>• Ensure compliance with forest department regulations and legal requirements.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                3. Sharing of Information
              </h2>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                We do not sell or rent your personal data. Information may be shared only with:
              </p>
              <ul className="space-y-2 text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                <li>• Forest Department Authorities (for permits and entry records).</li>
                <li>• Resort Management (for your accommodation check-in).</li>
                <li>• Authorized Service Providers (payment gateways, email/SMS services).</li>
                <li>• Law Enforcement if required by law.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                4. Data Security
              </h2>
              <ul className="space-y-2 text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                <li>• All transactions are processed using SSL encryption.</li>
                <li>• Personal data is stored securely and accessed only by authorized staff.</li>
                <li>• Sensitive information (like IDs) is handled in compliance with government norms.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                5. Cookies & Tracking
              </h2>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                Our website uses cookies to:
              </p>
              <ul className="space-y-2 text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                <li>• Remember your preferences and login details.</li>
                <li>• Improve browsing and booking experience.</li>
                <li>• Collect anonymous analytics to enhance our services.</li>
              </ul>
              <p className="text-gray-700 mt-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                You may disable cookies in your browser settings, but some features may not work properly.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                6. Your Rights
              </h2>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                <li>• Access and update your personal information.</li>
                <li>• Request deletion of your data (subject to booking and legal obligations).</li>
                <li>• Opt out of promotional emails/SMS by clicking "unsubscribe" or contacting support.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                7. Third-Party Links
              </h2>
              <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                Our website may contain links to third-party travel portals or services. We are not responsible for their privacy practices. Please review their policies before sharing personal information.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                8. Changes to This Policy
              </h2>
              <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date.
              </p>
            </div>

            {/* Contact Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                9. Contact Us
              </h2>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                For questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                  <strong>Email:</strong> privacy@amrabadresorts.com
                </p>
                <p className="text-gray-700 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                  <strong>Phone:</strong> +91-9154281766
                </p>
                <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                  <strong>Address:</strong> Amrabad Tiger Reserve Tourist Office, Achampet, Telangana, India
                </p>
              </div>
            </div>

           
          </div>
        </div>
    </div>
    </UserLayout>
  )
}

export default AmrabadPrivacyPolicy

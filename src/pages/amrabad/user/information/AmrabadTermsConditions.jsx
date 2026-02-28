import React from "react";
import UserLayout from "../../../../layouts/UserLayout";
import { Link } from "react-router-dom";

const AmrabadTermsConditions = () => {
  return (
     <UserLayout>
    <div className="min-h-screen bg-[#F2EDE7]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#304A3A] to-[#7A8F7C] text-[#FDFAF7] py-8">
        <div className="container mx-auto px-4">
          
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "Arial Nova, sans-serif" }}
          >
            Amrabad Tiger Reserve - Terms & Conditions
          </h1>
          <p className="text-[#D0D7CE]">
            Welcome to the Amrabad Tiger Reserve Booking Portal. Please read
            these terms carefully.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8">
          {/* Section 1 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              1. General
            </h2>
            <ul
              className="space-y-2 text-gray-700"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              <li>
                • This portal is managed in coordination with the Forest
                Department of Telangana and authorized resort operators.
              </li>
              <li>
                • All bookings are subject to availability and compliance with
                forest regulations.
              </li>
              <li>
                • The Forest Department reserves the right to modify Package
                booking timings or availability due to weather, safety, or
                wildlife conservation needs.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              2. Packages and Houses Bookings
            </h2>
            <ul
              className="space-y-2 text-gray-700"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              <li>
                • All bookings must be made through the official website,
                authorized counters, or recognized partners.
              </li>
              <li>
                • A valid government-issued ID is required for every booking.
                Foreign nationals must carry a passport and visa.
              </li>
              <li>
                • Entry is only permitted with a valid ticket/permit. Tickets
                are non-transferable.
              </li>
              <li>
                • Private vehicles are not allowed inside core zones; only
                authorized safari vehicles are permitted.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              3. Payments
            </h2>
            <ul
              className="space-y-2 text-gray-700"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              <li>• Full payment must be made at the time of booking.</li>
              <li>
                • We accept payments via credit/debit cards, UPI, net banking,
                and other approved gateways.
              </li>
              <li>
                • Payment details are processed securely; we do not store
                sensitive financial information.
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              4. Cancellations & Refunds
            </h2>
            <ul
              className="space-y-2 text-gray-700"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              <li>
                • Cancellations are subject to each Package booking policy.
              </li>
              <li>
                • Refunds, if applicable, will be processed within 5–7 business
                days after approval.
              </li>
              <li>• No refunds will be issued for "No-Show" bookings.</li>
              <li>
                • In case of government orders, natural calamities, or
                operational issues, the Forest Department/resort reserves the
                right to cancel bookings with appropriate refunds.
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              5. Visitor Rules & Responsibilities
            </h2>
            <ul
              className="space-y-2 text-gray-700"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              <li>
                • Visitors must follow all forest rules and the instructions of
                guides and officials.
              </li>
              <li>
                • Littering, smoking, alcohol consumption, loud music, and
                feeding animals are strictly prohibited.
              </li>
              <li>
                • Visitors are responsible for their own safety and belongings.
              </li>
              <li>
                • The reserve is a protected wildlife area; disturbing or
                harming animals/plants is a punishable offence under law.
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              6. Resort Policies
            </h2>
            <ul
              className="space-y-2 text-gray-700"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              <li>• Check-in requires valid ID proof for all guests.</li>
              <li>
                • Meals, safaris, and other inclusions vary by package; please
                check details before booking.
              </li>
              <li>
                • Guests are expected to maintain decorum and respect local
                community and eco-sensitive rules.
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              7. Liability Disclaimer
            </h2>
            <p
              className="text-gray-700 mb-2"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              The Forest Department and resort management are not liable for:
            </p>
            <ul
              className="space-y-2 text-gray-700 ml-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              <li>
                • Delays, cancellations, or changes due to weather, government
                regulations, or safety concerns.
              </li>
              <li>
                • Personal injury, loss, or damage caused due to negligence of
                visitors.
              </li>
              <li>
                • Loss of valuables or personal belongings during resort stays.
              </li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              8. Privacy
            </h2>
            <p
              className="text-gray-700 "
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              All personal information provided is handled as per our 
             <Link to="/amrabad-resort/privacy-policy" className="text-[#304A3A] ml-2 hover:text-[#2E3929]">Privacy Policy</Link>.
            </p>
          </div>

          {/* Section 9 */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              9. Modifications to Terms
            </h2>
            <ul
              className="space-y-2 text-gray-700"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              <li>
                • We reserve the right to update or modify these Terms &
                Conditions at any time.
              </li>
              <li>
                • Continued use of the portal after changes indicates acceptance
                of the revised terms.
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#304A3A] mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              10. Contact
            </h2>
            <p
              className="text-gray-700 mb-4"
              style={{ fontFamily: "Arial Nova, sans-serif" }}
            >
              For any queries regarding these Terms & Conditions, please
              contact:
            </p>
            <div className="bg-[#394D48] text-[#FDFAF7] p-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
              <p
                className=" mb-2"
                style={{ fontFamily: "Arial Nova, sans-serif" }}
              >
                <strong>Email:</strong> atrecotourism@gmail.com
              </p>
              <p
                className=" mb-2"
                style={{ fontFamily: "Arial Nova, sans-serif" }}
              >
                <strong>Phone:</strong> +91 9154281766
              </p>
              <p
                className=""
                style={{ fontFamily: "Arial Nova, sans-serif" }}
              >
                <strong>Office:</strong> Amrabad Tiger Reserve Tourist Office,
                Achampet, Telangana, India
              </p>
            </div>
          </div>

          {/* Footer Note */}
        
        </div>
      </div>
    </div>
    </UserLayout>
   
  );
};

export default AmrabadTermsConditions;

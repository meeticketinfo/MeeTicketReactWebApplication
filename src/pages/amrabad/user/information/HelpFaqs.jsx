import React from 'react'
import UserLayout from '../../../../layouts/UserLayout'
import { Link } from 'react-router-dom'

const HelpFaqs = () => {
  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#304A3A] to-[#7A8F7C] text-[#FDFAF7] py-8">
          <div className="container mx-auto px-4">
           
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
               Help & FAQs – Amrabad Tiger Reserve Forest
            </h1>
            <p className="text-orange-100">
              Find answers to common questions about visiting Amrabad Tiger Reserve and booking accommodations.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* General Information Section */}
            <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-6" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                 General Information
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: What is Amrabad Tiger Reserve?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Amrabad Tiger Reserve, located in Telangana, is one of the largest tiger reserves in India, known for its rich biodiversity, scenic landscapes, and eco-tourism experiences.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: What activities are available inside the reserve?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Jeep safaris, guided treks, birdwatching, photography tours, and nature camps are the most popular activities.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Do I need permission to enter the reserve?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Yes, entry is only allowed with a valid ticket/permit issued by the forest department or authorized operators.
                  </p>
                </div>
              </div>
            </div>

            {/* Booking & Entry Section */}
            <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-6" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                 Booking & Entry
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: How can I book a Packages ticket?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Packages tickets can be booked online through the Mee Ticket official portal or Amrabad website.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Is there a limit on the number of visitors?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Yes, the number of Packages tickets and visitors is restricted each day to protect wildlife. Early booking is recommended.
                  </p>
                </div>
              </div>
            </div>

            {/* Travel & Requirements Section */}
            <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-6" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                 Travel & Requirements
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: What should I carry for the visit?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Valid ID proof, comfortable clothing, binoculars, water bottle, sunscreen, and a camera. Avoid bright colors and strong perfumes.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Are children allowed?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Yes, children are allowed, but parental supervision is required. Some packages may have age restrictions for safety reasons.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Are private vehicles allowed inside?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: No, only designated vehicles are permitted inside the core zones.
                  </p>
                </div>
              </div>
            </div>

            {/* Rules & Safety Section */}
            <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-6" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                 Rules & Safety
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: What are the rules inside the reserve?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Littering, smoking, drinking alcohol, making loud noises, and feeding animals are strictly prohibited.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Is it safe to visit?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Yes, visits and treks are conducted with trained guides and drivers. Visitors must follow all instructions for safety.
                  </p>
                </div>
              </div>
            </div>

            {/* Resorts Section Header */}
            <div className="bg-gradient-to-r from-[#304A3A] to-[#394D48] text-[#FDFAF7] rounded-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-center" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                 Help & FAQs – Resorts in Amrabad Tiger Reserve
              </h1>
            </div>

            {/* Accommodation Section */}
            <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-6" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                 Accommodation
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: What types of resorts are available?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Eco-resorts, forest guest houses, and government-run cottages are available inside and near the reserve.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: How do I book a resort stay?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Resorts can be booked online via official websites, travel portals, or directly through the forest department.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Do the resorts provide meals?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Yes, most resorts provide vegetarian/local cuisine. Some also offer customized meal options.
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities & Facilities Section */}
            <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-6" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                🌿 Amenities & Facilities
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Do the resorts have electricity and Wi-Fi?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Basic amenities like electricity and hot water are available. Wi-Fi may be limited or unavailable due to the remote location.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Is there mobile network coverage inside the reserve?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Mobile connectivity is patchy. BSNL/Jio usually work better in this region.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Are guided activities included in the stay?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Some resort packages include activity tickets, while others require separate booking. Check inclusions before booking.
                  </p>
                </div>
              </div>
            </div>

            {/* Cancellations & Policies Section */}
            <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 mb-8">
              <h2 className="text-2xl font-bold text-[#304A3A] mb-6" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                 Cancellations & Policies
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Can I cancel my resort booking?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Yes, cancellations are subject to each resort's policy. Refunds may vary depending on how early you cancel.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    Q: Do I need to carry ID proof for check-in?
                  </h3>
                  <p className="text-gray-700" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                    A: Yes, all guests must carry valid government-issued ID proofs. Foreign tourists must carry their passport and visa.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-blue-50 border-l-4 border-blue-200 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-[#304A3A] mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                Need More Help?
              </h3>
              <p className="text-gray-700 mb-4" style={{ fontFamily: 'Arial Nova, sans-serif' }}>
                If you couldn't find the answer to your question, please contact our support team:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="font-semibold text-gray-800" style={{ fontFamily: 'Arial Nova, sans-serif' }}>Email</p>
                  <p className="text-[#304A3A]">support@amrabadresorts.com</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800" style={{ fontFamily: 'Arial Nova, sans-serif' }}>Phone</p>
                  <p className="text-[#304A3A]">+91 9154281766</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800" style={{ fontFamily: 'Arial Nova, sans-serif' }}>Office Hours</p>
                  <p className="text-[#304A3A]">9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}

export default HelpFaqs

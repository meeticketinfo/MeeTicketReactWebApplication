import React from "react";
import UserLayout from "../../../../layouts/UserLayout";
import PackageImage from "../../../../images/user/package-details-1.jpg";
import { Link } from "react-router-dom";

const packageData = {
  title: "Munnar Jungle Resort, The Tiger Stay Package",
  image: PackageImage,
  highlights: [
    {
      icon: "🦁",
      title: "Safari Ride At Farhabad",
      desc: "Explore deep into the heart of the forest and spot rare wildlife in their natural habitat.",
    },
    {
      icon: "🌲",
      title: "Guided Forest Trekking",
      desc: "Learn about diverse flora and fauna with special focus on birdwatching, led by expert guides.",
    },
    {
      icon: "🧑‍🔬",
      title: "Local Tour Guide Included",
      desc: "Get immersive stories and ecological insights from trained local naturalists.",
    },
    {
      icon: "🎁",
      title: "Complimentary Gift With Stay",
      desc: "Every booking comes with 2 complimentary eco-sets, each consisting of 1 locally crafted jute bag.",
    },
  ],
  rooms: [
    { type: "Standard Rooms", count: 6 },
    { type: "Round Chenchu Mud House", count: 1 },
    { type: "Tree House", count: 1 },
    { type: "Mud Houses", count: 2 },
    { type: "Aerocon Houses", count: 2 },
  ],
  priceNote:
    "The cost of the package for 2 people ranges from 5100 to 8500 rupees depending on the room type.",
  discounts: [
    { label: "Bookings Below ₹20,000", value: "No Discount Applicable." },
    {
      label: "Bookings Between ₹20,000 And ₹40,000",
      value: "Get 5% Discount On Total Amount.",
    },
    {
      label: "Bookings Above ₹40,000",
      value: "Get 10% Discount On Total Amount.",
    },
  ],
  itinerary: [
    {
      day: "Day-1",
      schedule: [
        {
          time: "12:30 PM",
          desc: "Arrival at Munnanur Jungle resort, Mannanur, and Check in. Please search for “Munnanur Jungle Resort, Mannanur” in Google maps for the precise location.",
        },
        {
          time: "1:00 PM - 2:00 PM",
          desc: "Lunch at Chinnaraka hall on basis of order.",
        },
        {
          time: "2:30 PM - 3:30 PM",
          desc: "Visit to Environment Educational Centre, where an Introduction to Amrabad Tiger Reserve is given through movie and picture exhibition.",
        },
        {
          time: "3:40 PM - 7:00 PM",
          desc: "All guests to leave for the Safari after completion of the wildlife orientation from the Environment Education center or shall report at reception, Munnanur Jungle resort by 3:40PM for Jungle Safari.",
        },
        {
          time: "8:00 PM - 9:00 PM",
          desc: "Dinner at Chinnaraka hall.",
        },
      ],
    },
    {
      day: "Day-2",
      schedule: [
        {
          time: "6:00 AM - 8:00 AM",
          desc: "Guests to report at Munnanur Jungle resort reception by 6:00AM for forest trekking/ hike and return back to the resort.",
        },
        {
          time: "8:00 AM - 9:00 AM",
          desc: "Breakfast at Chinnaraka hall.",
        },
        {
          time: "10:00 AM",
          desc: "Checkout",
        },
      ],
    },
  ],
  notes: [
    "In case of odd number of visitors, kindly book the immediate lower even number (E.g. book 2 rooms for 5 visitors). At the time of check-in, ₹1000 shall be charged extra for any additional person from 8 years of age onwards.",
    "Food will be charged separately on basis of order and available menu.",
    "Children’s above 6 years of age reservation is mandatory.",
    "Kindly bring your shoes for Forest Trekking.",
    "In case you forget toiletries such as toothbrush and toothpaste, the same can be purchased at our Organic store.",
  ],
};

const PackageDetail = () => {
  return (
    <UserLayout>
      <div className="h-[350px] relative mb-7">
        <img src={packageData.image} alt="Package" className="w-full h-full object-cover object-center" />
        {/* <div className="absolute top-0 left-0 w-full h-full bg-[#0A0818B2]"></div> */}
        <div className="absolute bottom-0 left-0 z-10 w-full bg-[#0A0818B2] py-4 md:py-8 backdrop-blur-sm">
          <div className="container flex flex-col md:flex-row gap-3 md:gap-6 justify-between items-start md:items-center mx-auto px-3">
            <h4 className="text-white text-xl md:text-3xl font-bold capitalize">{packageData.title}</h4>
            <Link 
              to="/amarabad/houses/munnar-jungle-resort-the-tiger-stay-package" 
              className="bg-white filter text-[#362D86] px-4 md:px-6 py-2 rounded-md hover:bg-indigo-800 hover:text-white transition duration-300 text-base md:text-xl font-bold">BOOK NOW</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto text-sm md:text-base px-3">
        <div className=" ">
          {/* Highlights */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-[#D7D5E7] to-[#F6F7FB] p-3 md:p-4  pl-6 md:pl-10 rounded-tl-[50px] mb-5 w-full md:max-w-[50%]">
              <h2 className="text-lg font-semibold text-[#271F6E]">
                Adventure Highlights
              </h2>
            </div>
            <ul className="space-y-2">
              {packageData.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-xl">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 5H11L16 12L11 19H15.5L20.5 12L15.5 5Z" fill="#362D86" />
                      <path d="M8.5 5H4L9 12L4 19H8.5L13.5 12L8.5 5Z" fill="#362D86" />
                    </svg>
                  </span>
                  <span>
                    <span className="font-semibold text-[#333333]">{item.title}:</span> &nbsp;&nbsp;
                    <span className="text-[#79797B]">{item.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Accommodation Details */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-[#D7D5E7] to-[#F6F7FB] p-3 md:p-4 pl-6 md:pl-10 rounded-tl-[50px] mb-5 w-full md:max-w-[50%]">
              <h2 className="text-lg font-semibold text-[#271F6E]">
                Accommodation Details
              </h2>
            </div>
            <div className="overflow-x-auto w-full md:max-w-[50%]  border border-gray-200 rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="px-4 py-2 text-left font-medium">Room Type</th>
                    <th className="px-4 py-2 text-left font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {packageData.rooms.map((room, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{room.type}</td>
                      <td className="px-4 py-2">{room.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Note:</span> {packageData.priceNote}
            </p>
          </section>

          {/* Discounts & Schedule */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-[#D7D5E7] to-[#F6F7FB] p-3 md:p-4 pl-6 md:pl-10 rounded-tl-[50px] mb-5 w-full md:max-w-[50%]">
              <h2 className="text-lg font-semibold text-[#271F6E]">
                Discount & Schedule Details
              </h2>
            </div>
            <div className="bg-[#EEEDFA] p-3 md:p-5 rounded-xl">

              {/* Discounts */}
              <div className="mb-5">
                <h3 className="font-semibold mb-2 text-black text-base md:text-xl font-bold">Bulk Booking Discounts</h3>

                <ul className="space-y-2">
                  {packageData.discounts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-xl">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.5 5H11L16 12L11 19H15.5L20.5 12L15.5 5Z" fill="#362D86" />
                          <path d="M8.5 5H4L9 12L4 19H8.5L13.5 12L8.5 5Z" fill="#362D86" />
                        </svg>
                      </span>
                      <span>
                        <span className="font-semibold text-[#333333]">{item.label}:</span> &nbsp;&nbsp;
                        <span className="text-[#79797B]">{item.value}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Itinerary */}
              <div>
                <h3 className="mb-4 text-black text-base md:text-xl font-bold">2-Day Itinerary Schedule</h3>

                {/* Day 1 Card */}
                <div className="bg-white rounded-lg p-3 md:p-5 mb-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="">
                      <div className="text-gray-500 text-sm md:text-base mb-1">Check-In Time:</div>
                      <div className="text-sm md:text-base font-semibold text-gray-800">12:30 PM</div>
                    </div>

                    <div className="mx-2 md:mx-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.0001 21.3327L21.3334 15.9993M21.3334 15.9993L16.0001 10.666M21.3334 15.9993L10.6667 15.9993M29.3334 15.9993C29.3334 23.3631 23.3639 29.3327 16.0001 29.3327C8.63628 29.3327 2.66675 23.3631 2.66675 15.9993C2.66675 8.63555 8.63628 2.66602 16.0001 2.66602C23.3639 2.66602 29.3334 8.63555 29.3334 15.9993Z" stroke="#BDBCC3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                      </div>
                    </div>

                    <div className="">
                      <div className="text-gray-500 text-sm md:text-base mb-1">Check-Out Time:</div>
                      <div className="text-sm md:text-base font-semibold text-gray-800">10:00 AM (Next Day)</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Schedule Table (hidden by default, can be toggled) */}
                <div className="mt-4">
                  <div className="overflow-x-auto border border-gray-200 rounded-lg text-[#1B2128]">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-white">
                          <th className="px-3 py-4 text-left font-semibold min-w-[80px]">Day</th>
                          <th className="px-3 py-4 text-left font-semibold min-w-[130px]">Time</th>
                          <th className="px-3 py-4 text-left font-semibold">Schedule</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#FFFFFF7A]">
                        {packageData.itinerary.map((day, i) =>
                          day.schedule.map((item, j) => (
                            <tr key={i + "-" + j} className="border-t">
                              {j === 0 && (
                                <td
                                  width="100px"
                                  className="px-3 py-4 font-semibold w-[100px]"
                                  rowSpan={day.schedule.length}
                                >
                                  {day.day}
                                </td>
                              )}
                              <td width="150px" className="px-3 py-4 w-[150px]">{item.time}</td>
                              <td className="px-3 py-4">{item.desc}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Notes */}
              <section className="mb-8 mt-4">
                <h3 className="mb-4 text-black text-xl font-bold">Notes:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
                  {packageData.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="flex-shrink-0" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_8676_13856)">
                          <path d="M18.0312 13.7874L20.8596 10.959C20.9533 10.8653 21.006 10.7381 21.006 10.6055C21.006 10.4729 20.9533 10.3457 20.8596 10.2519L18.0312 7.42349C17.9613 7.35334 17.8721 7.30553 17.775 7.28612C17.6779 7.2667 17.5772 7.27655 17.4857 7.31442C17.3943 7.35229 17.3161 7.41647 17.2611 7.49883C17.2061 7.58119 17.1768 7.67802 17.177 7.77704L17.1777 10.1055L0.707037 10.1048L0.707037 11.1061L17.1777 11.1054L17.177 13.4339C17.1768 13.5329 17.2061 13.6297 17.2611 13.7121C17.3161 13.7945 17.3943 13.8586 17.4857 13.8965C17.5772 13.9344 17.6779 13.9442 17.775 13.9248C17.8721 13.9054 17.9613 13.8576 18.0312 13.7874Z" fill="#362D86" />
                        </g>
                        <defs>
                          <clipPath id="clip0_8676_13856">
                            <rect width="15" height="15" fill="white" transform="translate(21.2131 10.6055) rotate(135)" />
                          </clipPath>
                        </defs>
                      </svg>{note}</li>
                  ))}
                </ul>
              </section>
            </div>
          </section>

          {/* Bookings Open Banner */}
          <div className="bg-indigo-700 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-6">
            <div className="text-white text-xl font-semibold">
              BOOKINGS ARE OPEN
            </div>
            <div className="flex gap-3">
              <Link to="/amarabad/houses/munnar-jungle-resort-the-tiger-stay-package" className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-lg hover:bg-indigo-100 transition">
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PackageDetail; 
import React from "react";
import UserLayout from "../../../../layouts/UserLayout";
import PackageImage from "../../../../images/user/package-details-1.jpg";

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
          desc: "Arrival at Munnar Jungle resort, Munnar, and Check in.",
        },
        {
          time: "1:00 PM - 2:00 PM",
          desc: "Lunch at Chinnaraka hall on basis of order.",
        },
        {
          time: "2:30 PM - 3:30 PM",
          desc: "Visit to Environment Educational Centre, movie and picture exhibition.",
        },
        {
          time: "3:40 PM - 7:00 PM",
          desc: "All guests to leave for the Safari after orientation.",
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
          desc: "Forest trekking/hike and return back to the resort.",
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
        <div className="absolute bottom-0 left-0 z-10 w-full bg-[#0A0818B2] py-8 backdrop-blur-sm">
          <div className="container flex gap-6 justify-between items-center mx-auto">
            <h4 className="text-white text-3xl font-bold capitalize">{packageData.title}</h4>
            <button className="bg-white filter text-[#362D86] px-6 py-2 rounded-md hover:bg-indigo-800 hover:text-white transition duration-300 text-xl font-bold">BOOK NOW</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto text-base">
        <div className=" ">
          {/* Highlights */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-[#D7D5E7] to-[#F6F7FB] p-4 pl-10 rounded-tl-[50px] mb-5 max-w-[50%]">
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
            <div className="bg-gradient-to-r from-[#D7D5E7] to-[#F6F7FB] p-4 pl-10 rounded-tl-[50px] mb-5 max-w-[50%]">
              <h2 className="text-lg font-semibold text-[#271F6E]">
                Accommodation Details
              </h2>
            </div>
            <div className="overflow-x-auto lg:max-w-[50%]  rounded-lg">
              <table className="min-w-full border border-gray-200">
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
            <h2 className="text-lg font-semibold text-indigo-700 mb-3">
              Discount & Schedule Details
            </h2>
            {/* Discounts */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Bulk Booking Discounts</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {packageData.discounts.map((d, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{d.label}:</span> {d.value}
                  </li>
                ))}
              </ul>
            </div>
            {/* Itinerary */}
            <div>
              <h3 className="font-semibold mb-2">2-Day Itinerary Schedule</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="px-3 py-2 text-left">Day</th>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packageData.itinerary.map((day, i) =>
                      day.schedule.map((item, j) => (
                        <tr key={i + "-" + j} className="border-t">
                          {j === 0 && (
                            <td
                              className="px-3 py-2 font-semibold"
                              rowSpan={day.schedule.length}
                            >
                              {day.day}
                            </td>
                          )}
                          <td className="px-3 py-2">{item.time}</td>
                          <td className="px-3 py-2">{item.desc}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-indigo-700 mb-3">Note:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {packageData.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </section>

          {/* Bookings Open Banner */}
          <div className="bg-indigo-700 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <div className="text-white text-xl font-semibold">
              BOOKINGS ARE OPEN
            </div>
            <div className="flex gap-3">
              <button className="bg-white text-indigo-700 font-semibold px-5 py-2 rounded-lg hover:bg-indigo-100 transition">
                BOOK NOW
              </button>
              <button className="bg-indigo-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-600 transition">
                GET DIRECTIONS
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PackageDetail; 
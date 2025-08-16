import React, { useEffect, useState } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import { Link, useParams } from "react-router-dom";
import PopupModal from "../../../../components/utils/popup_modal/PopupModal";
import { useModalStore } from "../../../../store/modalStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useUserBookingStore } from "../../../../store/amrabad/user/userBookingStore";
import PackageDetailShimmer from "../../shimmer/PackageDetailShimmer";

const PackageDetail = () => {
  const { packageId } = useParams();
  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const { fetchPackageDetail, isPackageDetailLoading, GetPackageDetail } = useUserBookingStore();

  useEffect(() => {
    fetchPackageDetail(packageId);
  }, [packageId]);

  // Show shimmer while loading
  if (isPackageDetailLoading) {
    return (
      <UserLayout>
        <PackageDetailShimmer />
      </UserLayout>
    );
  }

  // Show error state if no package detail
  if (!GetPackageDetail) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-4">Package not found</div>
            <Link to="/amrabad-resort/packages" className="text-blue-600 hover:text-blue-800 underline">
              Back to Packages
            </Link>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="h-[350px] relative mb-7">
        <img src={GetPackageDetail?.image} alt="Package" className="w-full h-full object-cover object-center" />
        {/* <div className="absolute top-0 left-0 w-full h-full bg-[#0A0818B2]"></div> */}
        <div className="absolute bottom-0 left-0 z-10 w-full bg-[#0A0818B2] py-4 md:py-8 backdrop-blur-sm">
          <div className="container flex flex-col md:flex-row gap-3 md:gap-6 justify-between items-start md:items-center mx-auto px-3">
            <h4 className="text-white text-xl md:text-3xl font-bold capitalize">{GetPackageDetail?.title}</h4>
            <Link
              to={`/amrabad-resort/houses/${packageId}`}
              className="bg-white filter text-[#362D86] px-4 md:px-6 py-2 rounded-md hover:bg-indigo-800 hover:text-white transition duration-300 text-base md:text-xl font-bold">BOOK NOW</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto text-sm md:text-base px-3">
        <div className=" ">
          {/* Highlights */}
          <section className="mb-8">
            {GetPackageDetail?.highlights?.length > 0 && <div className="bg-gradient-to-r from-[#D7D5E7] to-[#F6F7FB] p-3 md:p-4  pl-6 md:pl-10 rounded-tl-[50px] mb-5 w-full md:max-w-[50%]">
              <h2 className="text-lg font-semibold text-[#271F6E]">
                Adventure Highlights
              </h2>
            </div>}
            <ul className="space-y-2">
              {GetPackageDetail?.highlights?.map((item, idx) => (
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
            {GetPackageDetail?.rooms?.length > 0 && (
              <>
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
                      {GetPackageDetail?.rooms?.map((room, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{room.type}</td>
                          <td className="px-4 py-2">{room.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Note:</span> {GetPackageDetail?.priceNote}
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
                <h3 className="mb-2 text-black text-base md:text-xl font-bold">Bulk Booking Discounts</h3>

                <ul className="space-y-2">
                  {GetPackageDetail?.discounts?.map((item, idx) => (
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
                      <div className="text-sm md:text-base font-semibold text-gray-800"> {GetPackageDetail?.twoDayItinerarySchedule?.checkInTime}</div>
                    </div>

                    <div className="mx-2 md:mx-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.0001 21.3327L21.3334 15.9993M21.3334 15.9993L16.0001 10.666M21.3334 15.9993L10.6667 15.9993M29.3334 15.9993C29.3334 23.3631 23.3639 29.3327 16.0001 29.3327C8.63628 29.3327 2.66675 23.3631 2.66675 15.9993C2.66675 8.63555 8.63628 2.66602 16.0001 2.66602C23.3639 2.66602 29.3334 8.63555 29.3334 15.9993Z" stroke="#BDBCC3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                      </div>
                    </div>

                    <div className="">
                      <div className="text-gray-500 text-sm md:text-base mb-1">Check-Out Time:</div>
                      <div className="text-sm md:text-base font-semibold text-gray-800"> {GetPackageDetail?.twoDayItinerarySchedule?.checkOutTime}</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Schedule Table (hidden by default, can be toggled) */}
                <div className="mt-4">
                  <div className="overflow-x-auto border border-gray-200 rounded-lg text-[#1B2128]">
                    <table className="min-w-full text-xs md:text-sm">
                      <thead>
                        <tr className="bg-white">
                          <th className="px-2 md:px-3 py-2 md:py-4 text-left font-semibold min-w-[80px]">Day</th>
                          <th className="px-2 md:px-3 py-2 md:py-4 text-left font-semibold min-w-[160px]">Time</th>
                          <th className="px-2 md:px-3 py-2 md:py-4 text-left font-semibold">Schedule</th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#FFFFFF7A]">
                        {GetPackageDetail?.itinerary?.map((day, i) =>
                          day.schedule.map((item, j) => (
                            <tr key={i + "-" + j} className="border-t">
                              {j === 0 && (
                                <td
                                  width="100px"
                                  className="px-2 md:px-3 py-2 md:py-4 font-semibold w-[100px]"
                                  rowSpan={day.schedule.length}
                                >
                                  {day.day}
                                </td>
                              )}
                              <td width="150px" className="px-2 md:px-3 py-2 md:py-4 w-[150px]">{item.time}</td>
                              <td className="px-2 md:px-3 py-2 md:py-4">{item.desc}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Notes */}
              <section className="mt-4">
                {GetPackageDetail?.notes?.length > 0 && <h3 className="mb-4 text-black text-xl font-bold">Notes:</h3>}
                <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm md:text-base">
                  {GetPackageDetail?.notes?.map((note, idx) => (
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


          {/* Swiper Slider - place this just above the Policy Links section */}
          <div className="w-full mx-auto mb-6 relative">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              loop={true}
              spaceBetween={10}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 3,
                },
              }}
            >
              {GetPackageDetail?.packageImages?.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="">
                    <img
                      src={img?.imageUrl}
                      alt={`Slide ${idx + 1}`}
                      className="w-full object-cover aspect-[3.5/4]"
                      style={{ objectPosition: "center" }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* End Swiper Slider */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 font-bold">
            {GetPackageDetail?.cancellationPolicy && (
              <>
              <button
                onClick={() => setOpenModalId("cancellation-policy")}
                className="text-[#362D86] underline transition duration-300"
              >
                Cancellation Policy
              </button>
              </>
            )}
            {GetPackageDetail?.termsConditions && (
              <>
                <button
                  onClick={() => setOpenModalId("terms-conditions")}
                  className="text-[#362D86] underline transition duration-300"
                >
                  Terms & Conditions
                </button>
              </>
            )}
            {GetPackageDetail?.privacyPolicy && (
              <>
                <button
                  onClick={() => setOpenModalId("privacy-policy")}
                  className="text-[#362D86] underline transition duration-300"
                >
                  Privacy Policy
                </button>
              </>
            )}
          </div>

          {/* Bookings Open Banner */}
          <div className="mt-8 mb-6 relative">
            <img src={GetPackageDetail?.image} alt="Packages" className="w-full h-full object-cover absolute top-0 left-0 rounded-lg" />
            <div className="absolute top-0 left-0 w-full h-full bg-[#0A0818B2] rounded-lg backdrop-blur-sm" />
            <div className="relative z-10 p-6 flex flex-col items-center justify-evenly gap-4 rounded-lg min-h-[250px]">
              <div className="text-white text-xl md:text-2xl lg:text-3xl font-semibold relative z-10">
                BOOKINGS ARE OPEN
              </div>
              <div className="flex gap-3 md:gap-6 flex-col md:flex-row">
                <Link to={`/amrabad-resort/houses/${packageId}`} className="bg-white border border-white text-indigo-700 font-semibold px-5 py-2 rounded-lg hover:bg-indigo-100 transition text-center">
                  BOOK NOW
                </Link>
                <Link target="_black" to={`https://maps.google.com?q=${GetPackageDetail?.latitude},${GetPackageDetail?.longitude}`} className="text-white border border-white font-semibold px-5 py-2 rounded-lg hover:bg-white hover:text-indigo-700 transition">
                  GET DIRECTIONS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Modals */}
      <PopupModal
        popupModalId="cancellation-policy-modal"
        isOpen={openModalId === "cancellation-policy"}
        onClose={closeModal}
        title="Cancellation Policy"
        size="large"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="p-6">
          <div className="space-y-4 text-gray-700">
            <p>
              {GetPackageDetail?.cancellationPolicy}
            </p>
          </div>
        </div>
      </PopupModal>

      <PopupModal
        popupModalId="terms-conditions-modal"
        isOpen={openModalId === "terms-conditions"}
        onClose={closeModal}
        title="Terms & Conditions"
        size="large"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="p-6">
          <div className="space-y-4 text-gray-700">
            <p>
              {GetPackageDetail?.termsConditions}
            </p>
          </div>
        </div>
      </PopupModal>

      <PopupModal
        popupModalId="privacy-policy-modal"
        isOpen={openModalId === "privacy-policy"}
        onClose={closeModal}
        title="Privacy Policy"
        size="large"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="p-6">
          <p>
            {GetPackageDetail?.privacyPolicy}
          </p>
        </div>
      </PopupModal>
    </UserLayout>
  );
};

export default PackageDetail; 
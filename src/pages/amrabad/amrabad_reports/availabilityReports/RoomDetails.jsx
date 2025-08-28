import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatToStandardDate } from '../../../../utils/TypographyHelper';

const RoomDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomData = location.state;

  // If no data is passed, redirect back
  if (!roomData) {
    navigate('/amrabad-availability-report');
    return null;
  }

  const {
    bookingDate,
    packageId,
    packageName,
    roomName,
    roomsBooked,
    roomsAvailable
  } = roomData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Room Details</h1>
              <p className="mt-2 text-gray-600">
                Detailed information about room availability and bookings
              </p>
            </div>
            <button
              onClick={() => navigate('/amrabad-availability-report')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ← Back to Reports
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">Booking Date</p>
                    <p className="text-2xl font-semibold text-blue-900">
                      {formatToStandardDate(bookingDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">Package</p>
                    <p className="text-2xl font-semibold text-green-900">
                      {packageName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">Room</p>
                    <p className="text-2xl font-semibold text-purple-900">
                      {roomName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Availability Details */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Room Availability Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Rooms Booked</p>
                      <p className="text-3xl font-bold text-red-900">{roomsBooked}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-red-600">
                    These rooms are currently occupied
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Rooms Available</p>
                      <p className="text-3xl font-bold text-green-900">{roomsAvailable}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-green-600">
                    These rooms are ready for booking
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Additional Information</h3>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Package ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{packageId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Rooms</dt>
                    <dd className="mt-1 text-sm text-gray-900">{roomsBooked + roomsAvailable}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Occupancy Rate</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {((roomsBooked / (roomsBooked + roomsAvailable)) * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Availability Rate</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {((roomsAvailable / (roomsBooked + roomsAvailable)) * 100).toFixed(1)}%
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => navigate('/amrabad-availability-report')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Reports
                </button>
                <button
                  onClick={() => {
                    // You can add more actions here like booking a room, viewing detailed reports, etc.
                    console.log('Action button clicked');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Take Action
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

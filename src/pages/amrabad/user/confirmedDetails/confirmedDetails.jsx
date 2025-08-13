import { useEffect, useState } from "react";
import UserLayout from "../../../../layouts/UserLayout";
import ConfirmationBanner from "./components/ConfirmationBanner";
import CustomerDetails from "./components/CustomerDetails";
import QRDownloadSection from "./components/QRDownloadSection";
import BookingDetails from "./components/BookingDetails";
import HouseDetails from "./components/HouseDetails";
import PaymentSummary from "./components/PaymentSummary";
import CancelTicketModal from "./components/CancelTicketModal";
import CancellationSuccessModal from "./components/CancellationSuccessModal";
import { useUserBookingStore } from "../../../../store/amrabad/user/userBookingStore";
import { useParams } from "react-router-dom";

const ConfirmedDetails = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Static data
  const bookingData = {
    customer: {
      name: "Venu",
      phone: "+91 0000000521",
      email: "venu.r18@gmail.com",
    },
    booking: {
      package: "Mrunmar Jungle Resort, the Tiger Stay Package",
      checkIn: "14 JULY 2025, 12:30 PM",
      checkOut: "16 JULY 2025, 10:00 AM",
    },
    houses: [
      {
        name: "Chital and Otter",
        category: "Standard",
        price: 8450,
        bookingId: "MTI000124",
      },
      {
        name: "Fanha – Tree House",
        category: "Standard",
        price: 8250,
        bookingId: "MTI000164",
      },
    ],
    payment: {
      houseCharges: 17000,
      discount: "N/A",
      totalPaid: 11700,
    },
  };
  const { bookingId } = useParams();
  const {
    fetchTicketViewDetails,
    GetTicketViewDetails,
    isTicketViewDetailsLoading,
  } = useUserBookingStore();
  useEffect(() => {
    fetchTicketViewDetails(bookingId);
  }, []);

  console.log("GetTicketViewDetails", GetTicketViewDetails);

  // Show loading state while data is being fetched

  const handleCancelTicket = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancellation = () => {
    setShowCancelModal(false);
    setShowSuccessModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  if (
    isTicketViewDetailsLoading ||
    !GetTicketViewDetails ||
    !GetTicketViewDetails.bookingItems
  ) {
    return (
      <div className="font-manrope overflow-auto h-screen bg-gray-100 px-2 sm:px-4 py-2 sm:py-4 border">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading ticket details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <UserLayout>
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4">
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <ConfirmationBanner />

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-4 sm:space-y-6">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                <CustomerDetails customer={GetTicketViewDetails.bookingItems[0]} />
                <QRDownloadSection onCancelTicket={handleCancelTicket}  GetTicketViewDetails={GetTicketViewDetails} />
              </div>

              <BookingDetails booking={GetTicketViewDetails.bookingItems[0]} />
              <HouseDetails houses={GetTicketViewDetails} />
              <PaymentSummary payment={GetTicketViewDetails.bookingItems} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CancelTicketModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancellation}
      />

      <CancellationSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
    </UserLayout>
  );
};

export default ConfirmedDetails;

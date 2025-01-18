import { BsQrCode } from "react-icons/bs";
import PaymentQRImg from "./assets/bookingPaymentQR.jpg";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import { useModalStore } from "../../../store/modalStore";
import useAuthStore from "../../../store/authStore";
import { BsQrCodeScan } from "react-icons/bs";
export const PaymentQR = () => {
  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const { decodedTokenData } = useAuthStore();

  return (
    <>
      <button
        className="btn-edit outline-none"
        onClick={() => {
          setOpenModalId("payment-QR");
        }}
      >
        <div className="relative">
          <BsQrCodeScan className="text-2xl text-gray-600" />
        </div>
      </button>

      <PopupModal
        popupModalId="first-modal"
        isOpen={openModalId === "payment-QR"}
        onClose={closeModal}
        title={"Payment QR Code "}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="flex justify-center p-5">
          <img
            src={PaymentQRImg}
            alt="Payment QR Code"
            style={{ width: 300, height: 300 }}
          />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold">
            {decodedTokenData?.data?.ParkName}
          </h1>
        </div>
      </PopupModal>
    </>
  );
};

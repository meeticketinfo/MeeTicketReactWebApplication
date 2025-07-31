const PaymentSummary = ({ payment }) => {
  return (
    <div className="max-w-full lg:max-w-[400px]">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Payment Summary:</h2>
      <div className="text-xs sm:text-sm space-y-2">
        <div className="flex justify-between">
          <span className="font-bold text-black">House charges:</span>
          <span className="font-bold text-black">₹{payment.houseCharges.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Discount Applied:</span>
          <span className="font-bold">{payment.discount}</span>
        </div>
        <div className="flex justify-between font-bold text-sm sm:text-base border-t pt-2">
          <span className="font-bold text-black">TOTAL PAID:</span>
          <span className="font-bold text-black">₹{payment.totalPaid.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
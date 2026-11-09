/** Green Concession banner for institutional Entry discount (booking + preview). */
const InstitutionalConcessionBanner = ({ concession, className = "" }) => {
  if (!concession?.applicable) return null;

  const entryGross = Number(concession.entryGross || 0).toFixed(2);
  const percent = concession.percent;
  const discountAmount = Number(concession.discountAmount || 0).toFixed(2);
  // Final payable = Entry after discount + other facilities
  const finalAmount = Number(
    concession.grandTotal ?? concession.entryNet ?? 0
  ).toFixed(2);

  return (
    <div
      className={`w-full overflow-hidden border border-[#38761d] ${className}`}
    >
      <div className="bg-[#38761d] text-white px-3 py-2 text-sm font-semibold">
        Concession
      </div>
      <div className="bg-gray-50 px-3 py-3 text-sm space-y-1.5">
        <p className="text-gray-800 leading-relaxed">
          Discount {percent}% for {concession.institutionLabel} for Entry
          Tickets:{" "}
          <span className="text-[#38761d]">
            {entryGross} * {percent} / 100 = {discountAmount}/-
          </span>
        </p>
        <p className="text-gray-800">
          Total Amount after Discount:{" "}
          <span className="font-bold text-black">{finalAmount}/-</span>
        </p>
      </div>
    </div>
  );
};

export default InstitutionalConcessionBanner;

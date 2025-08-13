const CustomerDetails = ({ customer }) => {
  console.log("customer", customer);
  return (
    <div className="max-w-full lg:max-w-[400px] flex-1">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-black">Customer details:</h2>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600 text-sm">Name:</span>
          <span className="font-medium text-sm">{customer.fullName}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600 text-sm">Phone:</span>
          <span className="font-medium text-sm">{customer.mobileNumber}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600 text-sm">Email:</span>
          <span className="font-medium text-sm">{customer.emailId}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
// Utility functions for payment processing
export const toLocalISOString = (date = new Date()) => {
  const tzo = -date.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';
  const pad = (num) => String(Math.floor(Math.abs(num))).padStart(2, '0');

  return (
      date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      '.' + String(date.getMilliseconds()).padStart(3, '0') +
      dif + pad(tzo / 60) + ':' + pad(tzo % 60)
  );
};

// Helper function to map cart items to booking items format for initiateTransaction
export const mapCartItemsToBookingItems = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return [];

  return cartItems?.data?.map(item => ({
      packageId: item.packageId || 0,
      roomId: item.roomId || 0,
      checkIn: item.roomFromDate,
      checkOut: item.roomToDate,
      roomCount: item.roomCount,
      tariffPerDay: item.amount || 0,
      discountType: item.discountType || "",
      discountValue: item.discountAmount || 0,
      amountAfterDiscount: item.cartTotalAmount || 0
  }));
};

// Helper function to map cart items for addNewBookingDetails (includes cartItemId)
export const mapCartItemsForBookingDetails = (cartItems) => {
  if (!cartItems || cartItems.length === 0) return [];

  return cartItems?.data?.map(item => ({
      packageId: item.packageId || 0,
      roomId: item.roomId || 0,
      cartItemId: item.cartId || 0,
      checkIn: item.roomFromDate,
      checkOut: item.roomToDate,
      roomCount: item.roomCount || 1,
      tariffPerDay: item.amount || 0,
      discountType: item.discountType || "",
      discountValue: item.discountAmount || 0,
      amountAfterDiscount: item.cartTotalAmount || 0
  }));
};
# AMRABAD BOOKINGS FILTER ENDPOINTS SUMMARY

## Overview
This document summarizes the comprehensive filter endpoints and functionality that have been added to the Amrabad bookings system based on the existing form fields and requirements.

## API Endpoints Added

### 1. Core Filter Endpoints
- `GET_AMRABAD_BOOKINGS_BY_FILTERS` - Main filtered bookings endpoint
- `GET_AMRABAD_BOOKINGS_BY_DATE_RANGE` - Filter by date range
- `GET_AMRABAD_BOOKINGS_BY_PAYMENT_STATUS` - Filter by payment status
- `GET_AMRABAD_BOOKINGS_BY_BOOKING_SOURCE` - Filter by booking source (Counter/Mobile)
- `GET_AMRABAD_BOOKINGS_BY_PACKAGE` - Filter by package type (Basic/Premium/VIP)
- `GET_AMRABAD_BOOKINGS_BY_HOUSE` - Filter by house (House1/House2/House3)
- `GET_AMRABAD_BOOKINGS_BY_MOBILE` - Filter by mobile number
- `GET_AMRABAD_BOOKINGS_BY_ORDER_ID` - Filter by order/transaction ID
- `GET_AMRABAD_BOOKINGS_BY_PAYMENT_MODE` - Filter by payment mode (UPI/Card/Net Banking)
- `GET_AMRABAD_BOOKINGS_BY_BOOKING_MODE` - Filter by booking mode (Online/Offline/Counter)

### 2. Utility Endpoints for Filter Options
- `GET_AMRABAD_PACKAGE_OPTIONS` - Get available package options
- `GET_AMRABAD_HOUSE_OPTIONS` - Get available house options
- `GET_AMRABAD_PAYMENT_MODE_OPTIONS` - Get available payment mode options
- `GET_AMRABAD_BOOKING_SOURCE_OPTIONS` - Get available booking source options
- `GET_AMRABAD_PAYMENT_STATUS_OPTIONS` - Get available payment status options
- `GET_AMRABAD_BOOKING_MODE_OPTIONS` - Get available booking mode options

## Store Functionality Added

### 1. State Management
- **Filter State**: Tracks current active filters
- **Pagination State**: Manages page numbers, page size, and total counts
- **Filter Options State**: Stores available options for dropdowns

### 2. Core Functions
- `fetchAllAmrabadBookings(filters)` - Main function with comprehensive filtering
- `setFilters(filters)` - Update current filters
- `resetFilters()` - Reset all filters to defaults
- `fetchFilterOptions()` - Fetch all available filter options

### 3. Specific Filter Functions
- `fetchBookingsByDateRange(startDate, endDate)`
- `fetchBookingsByPaymentStatus(paymentStatus)`
- `fetchBookingsByBookingSource(bookingSource)`
- `fetchBookingsByPackage(packageType)`
- `fetchBookingsByHouse(house)`
- `fetchBookingsByMobile(mobileNumber)`
- `fetchBookingsByOrderId(orderId)`
- `fetchBookingsByPaymentMode(paymentMode)`
- `fetchBookingsByBookingMode(bookingMode)`

### 4. Pagination Functions
- `setPage(pageNumber)` - Navigate to specific page
- `setPageSize(newPageSize)` - Change page size

### 5. Utility Functions
- `getFilteredBookings()` - Get current filtered results
- `getCurrentFilters()` - Get current active filters
- `getPaginationInfo()` - Get pagination information
- `getFilterOptions()` - Get available filter options

## Filter Parameters Supported

### Date Filters
- `fromDate` - Start date for filtering
- `toDate` - End date for filtering

### Booking Information
- `bookingSource` - Counter or Mobile
- `modeOfBooking` - Online, Offline, or Counter
- `package` - Basic, Premium, or VIP
- `houses` - House1, House2, or House3

### Payment Information
- `paymentStatus` - Success, Pending, Failed, or Refunded
- `PaymentMode` - UPI, Credit Card, Debit Card, or Net Banking

### User Information
- `mobileNumber` - 10-digit mobile number
- `orderId` - Order or transaction ID

### Pagination
- `PageIndex` - Current page number (1-indexed)
- `pageSize` - Number of items per page

## Usage Examples

### 1. Basic Filtering
```javascript
const { fetchAllAmrabadBookings } = useAmrabadBookingStore();

// Filter by date range and payment status
fetchAllAmrabadBookings({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    paymentStatus: 'SUCCESS',
    PageIndex: 1,
    pageSize: 20
});
```

### 2. Specific Filter Functions
```javascript
const { fetchBookingsByPackage, fetchBookingsByHouse } = useAmrabadBookingStore();

// Filter by package type
fetchBookingsByPackage('Premium');

// Filter by house
fetchBookingsByHouse('House1');
```

### 3. Filter Management
```javascript
const { setFilters, resetFilters, getCurrentFilters } = useAmrabadBookingStore();

// Update specific filters
setFilters({ package: 'VIP', houses: 'House2' });

// Get current filters
const currentFilters = getCurrentFilters();

// Reset all filters
resetFilters();
```

### 4. Pagination
```javascript
const { setPage, setPageSize, getPaginationInfo } = useAmrabadBookingStore();

// Navigate to page 3
setPage(3);

// Change page size to 50
setPageSize(50);

// Get pagination info
const paginationInfo = getPaginationInfo();
```

## Integration with Existing Components

The store is designed to work seamlessly with the existing `AmrabadConsolidatedForm` component, which already includes all the necessary filter fields. The form submission will automatically call the appropriate filter functions with the user's selections.

## Error Handling

All functions include proper error handling with:
- Loading state management
- Error logging to console
- Graceful fallbacks for failed requests
- State cleanup on errors

## Performance Considerations

- Filter options are fetched once and cached in state
- Pagination is handled efficiently with proper state updates
- Query parameters are built dynamically based on active filters
- Loading states prevent multiple simultaneous requests

## Future Enhancements

The current implementation provides a solid foundation for:
- Advanced search functionality
- Filter presets and saved searches
- Export functionality for filtered results
- Real-time filter updates
- Filter analytics and usage tracking 
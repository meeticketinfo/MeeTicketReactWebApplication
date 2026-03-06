import { create } from "zustand";

import { toast } from "react-toastify";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export const useBusPassTotalTransactionStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------
  // Failed Transactions By reason
  RtcTransactionByReasonData: [],
  isRtcTransactionByReasonLoading: false,
  fetchRtcTransactionByReason: async (payload) => {
    set({ isRtcTransactionByReasonLoading: true });
    const param = `?startDate=${payload.fromDate}${payload.fromDate ? "T00:00" : ""}&endDate=${payload.toDate}${payload.toDate ? "T23:59" : ""}&phoneNumber=${payload.mobileNumber}&passTypeId=${payload.BusPassType}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_TRANSACTIONS_BY_REASON}${param}`
      );

      set({
        RtcTransactionByReasonData: response.data,
        isRtcTransactionByReasonLoading: false,
      });
    } catch (error) {
      console.log("error", error);
      set({
        error: error.message,
        RtcTransactionByReasonData: [],
        isRtcTransactionByReasonLoading: false,
      });
      toast.error(error.message);
    }
  },

  //TOTAL TRANSACTIONS
  RtcTotalTransactionsData: [],
  isRtcTotalTransactionsLoading: false,
  fetchRtcTotalTransactions: async (payload) => {
    set({ isRtcTotalTransactionsLoading: true });
    const param = `?startDate=${payload.startDate}${payload.startDate ? "T00:00" : ""}&endDate=${payload.endDate}${payload.endDate ? "T23:59" : ""}&phoneNumber=${payload.phoneNumber}&status=${payload.status}&passTypeId=${payload.BusPassType}&subCategory=${payload.subCategory}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_TOTAL_TRANSACTIONS}${param}`
      );

      set({
        RtcTotalTransactionsData: response.data,
        isRtcTotalTransactionsLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        RtcTotalTransactionsData: [],
        isRtcTotalTransactionsLoading: false,
      });
      toast.error(error.message);
    }
  },

  // GET gate way PIE CHART
  RtcGateWayPieChartData: [],
  RtcisGateWayPieChartLoading: false,

  fetchRtcGateWayPieChart: async (payload) => {
    set({ RtcisGateWayPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}${payload.fromDate ? "T00:00" : ""}&endDate=${payload.toDate}${payload.toDate ? "T23:59" : ""}&phoneNumber=${payload.mobileNumber}&passTypeId=${payload.BusPassType}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_GATEWAY_PIE_CHART}${param}`
      );

      set({
        RtcGateWayPieChartData: response.data,
        RtcisGateWayPieChartLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        RtcGateWayPieChartData: [],
        RtcisGateWayPieChartLoading: false,
      });
      toast.error(error.message);
    }
  },

  // GET Ticket not generated PIE CHART
  RtcTicketNotGeneratedPieChartData: [],
  RtcisTicketNotGeneratedPieChartLoading: false,

  fetchRtcTicketNotGeneratedPieChart: async (payload) => {
    set({ RtcisTicketNotGeneratedPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}${payload.fromDate ? "T00:00" : ""}&endDate=${payload.toDate}${payload.toDate ? "T23:59" : ""}&phoneNumber=${payload.mobileNumber}&passTypeId=${payload.BusPassType}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_TICKET_NOT_GENERATED_PIE_CHART}${param}`
      );

      set({
        RtcTicketNotGeneratedPieChartData: response.data,
        RtcisTicketNotGeneratedPieChartLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        RtcTicketNotGeneratedPieChartData: [],
        RtcisTicketNotGeneratedPieChartLoading: false,
      });
      toast.error(error.message);
    }
  },

  // GET OTHER REASONS PIE CHART
  RtcOtherReasonsPieChartData: [],
  RtcisOtherReasonsPieChartLoading: false,

  fetchRtcOtherReasonsPieChart: async (payload) => {
    set({ RtcisOtherReasonsPieChartLoading: true });
    const param = `?startDate=${payload.fromDate}${payload.fromDate ? "T00:00" : ""}&endDate=${payload.toDate}${payload.toDate ? "T23:59" : ""}&phoneNumber=${payload.mobileNumber}&passTypeId=${payload.BusPassType}`;
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_OTHER_REASON_PIE_CHART}${param}`
      );

      set({
        RtcOtherReasonsPieChartData: response.data,
        RtcisOtherReasonsPieChartLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        RtcOtherReasonsPieChartData: [],
        RtcisOtherReasonsPieChartLoading: false,
      });
      toast.error(error.message);
    }
  },
  // GET ALL BUS PASSES
  AllBusPassesData: [],
  AllBusPassesLoading: false,
  fetchAllBusPasses: async (payload) => {
    set({ AllBusPassesLoading: true });

    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.BUS_PASS.GET_ALL_BUS_PASSES}`
      );

      set({
        AllBusPassesData: response.data,
        AllBusPassesLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        AllBusPassesData: [],
        AllBusPassesLoading: false,
      });
      toast.error(error.message);
    }
  },
  // GET RTC TRACK ORDER
  RtcTransactionTrackingStatusByOrderIdData: [],
  isFetchRtcTransactionTrackingStatusByOrderId: false,
  fetchRtcTransactionTrackingStatusByOrderId: async (orderID = "") => {
    set({ isFetchRtcTransactionTrackingStatusByOrderId: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_RTC_TRACK_ORDER}?orderId=${orderID}`
      );
      set({
        RtcTransactionTrackingStatusByOrderIdData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcTransactionTrackingStatusByOrderIdData: response.data,
      });
    } finally {
      set({
        isFetchRtcTransactionTrackingStatusByOrderId: false,
      });
    }
  },

  // booking records

  RtcBusPassBookingRecordsData: [],
  isFetchRtcBusPassBookingData: false,
  fetchRtcBusPassBookingData: async (payload = {}) => {
    set({ isFetchRtcBusPassBookingData: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_BOOKING_RECORDS}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&busPassTypeId=${payload.BusPassType}&typeOfPayment=${payload.typeOfPayment}&query=${payload.transactionId}&bookingStatus=${payload.bookingStatus}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`
      );
      set({
        RtcBusPassBookingRecordsData: response.data,
        isFetchRtcBusPassBookingData: false,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcBusPassBookingRecordsData: [],
      });
      toast.error(error.message);
    } finally {
      set({
        isFetchRtcBusPassBookingData: false,
      });
    }
  },

  // Bus pass verify status
  RtcBusPassVerifyStatusData: [],
  isFetchRtcBusPassVerifyStatusData: false,
  fetchRtcBusPassVerifyStatusData: async (orderId) => {
    set({ isFetchRtcBusPassVerifyStatusData: true });
    try {
      const method = "post";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_VERIFY_STATUS}/${orderId}`
      );
      set({
        RtcBusPassVerifyStatusData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcBusPassVerifyStatusData: [],
      });
    } finally {
      set({
        isFetchRtcBusPassVerifyStatusData: false,
      });
    }
  },

  // bus pass generate pass
  RtcGeneratePassData: [],
  isFetchRtcGeneratePassData: false,
  fetchRtcGeneratePassData: async (payloadString = "{}") => {
    set({ isFetchRtcGeneratePassData: true });

    try {
      // Step 1: Parse JSON string → object
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(payloadString);
      } catch (err) {
        console.error("Invalid JSON string:", payloadString);
      }

      // Step 1.1: Determine endpoint based on RtcBusPassBookingRecordsData conditions
      let isRenewal = false; // Default to false
      let isNewPass = false; // Default to false

      // Get bpOrderId and determine endpoint from RtcBusPassBookingRecordsData
      if (!parsedPayload.bpOrderId || parsedPayload.bpOrderId === "") {
        const currentState = useBusPassTotalTransactionStore.getState();
        if (
          currentState.RtcBusPassBookingRecordsData &&
          currentState.RtcBusPassBookingRecordsData.length > 0
        ) {
          // Find the record with isRenewal set to true, or use the first record as fallback
          const renewalRecord = currentState.RtcBusPassBookingRecordsData.find(
            record => record.isRenewal === 1 || record.isRenewal === "1" || record.isRenewal === true
          );
          console.log("renewalRecord", renewalRecord);
          
          // Find the record with isGeneral set to true
          const generalRecord = currentState.RtcBusPassBookingRecordsData.find(
            record => record.isGeneral === 1 || record.isGeneral === "1" || record.isGeneral === true
          );
          console.log("generalRecord", generalRecord);
          
          const selectedRecord = renewalRecord || generalRecord || currentState.RtcBusPassBookingRecordsData;
          // console.log("selectedRecord", selectedRecord);
          if (selectedRecord && selectedRecord.orderId) {
            parsedPayload.bpOrderId = selectedRecord.orderId;
            
            // Check conditions for endpoint selection
            const isRegenerateEligible = selectedRecord.isRegenerateEligible === true;
            const isGeneral = selectedRecord.isGeneral === true;
            const isRenewalFlag = selectedRecord.isRenewal === 1 || selectedRecord.isRenewal === "1" || selectedRecord.isRenewal === true;
           

            // If isGeneral is true, call isNewPass, otherwise call isRenewal
            if (isGeneral) {
              isNewPass =  isGeneral;
              isRenewal = false;
            } else {
              isNewPass = false;
              isRenewal = isRenewalFlag;
            }

          }
        }
      } else {
        // If bpOrderId is provided, find the matching record to get conditions
        const currentState = useBusPassTotalTransactionStore.getState();
        if (
          currentState.RtcBusPassBookingRecordsData &&
          currentState.RtcBusPassBookingRecordsData.length > 0
        ) {
          const matchingRecord = currentState.RtcBusPassBookingRecordsData.find(
            (record) =>
              record.orderId === parsedPayload.bpOrderId ||
              record.orderId === parsedPayload.orderId
          );
          if (matchingRecord) {
            // Check conditions for endpoint selection
            const isRegenerateEligible = matchingRecord.isRegenerateEligible === true;
            const isGeneral = matchingRecord.isGeneral === 1 || matchingRecord.isGeneral === "1" || matchingRecord.isGeneral === true ;
            const isRenewalFlag = matchingRecord.isRenewal === 1 || matchingRecord.isRenewal === "1" || matchingRecord.isRenewal === true;
            
            // New Pass: isRegenerateEligible === true AND isGeneral === 1
            isNewPass = isRegenerateEligible && isGeneral;
            
            // Renewal: isRegenerateEligible === true AND isRenewal === 1
            isRenewal = isRegenerateEligible && isRenewalFlag;
          }
        }
      }

      // Determine endpoint based on conditions
      let endpoint;
      if (isRenewal) {
        endpoint = API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT
          .GET_BUS_PASS_GENERATE_TICKET_RENEWAL;
      } else if (isNewPass) {
        endpoint = API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT
          .GET_BUS_PASS_GENERATE_TICKET_NEW_PASS;
      }
       else {
        // Default to new pass if no conditions are met
        endpoint = API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT
          .GET_BUS_PASS_GENERATE_TICKET_NEW_PASS;
      }
      

      // Step 1.6: Set routeId to null if not provided
      if (!parsedPayload.routeId || parsedPayload.routeId === "") {
        parsedPayload.routeId = 1;
      }
      // Step 2: Prepare data for uploadFile
      let fileToUpload = null;
      const additionalData = {};
      Object.entries(parsedPayload).forEach(([key, value]) => {
        if (key === "profileImgUrl") {
          // Skip if it's an empty object or null/undefined
          if (
            !value ||
            (typeof value === "object" && Object.keys(value).length === 0)
          ) {
            return; // Skip this field
          }

          // Only process if it's a string
          if (typeof value === "string" && value.trim() !== "") {
            // Convert base64 to binary Blob
            try {
              let base64Data = value;

              // Check if it's a data URL format (data:image/...;base64,)
              if (value.startsWith("data:")) {
                base64Data = value.split(",")[1]; // Remove data:image/...;base64, prefix
              }
              // If it's just raw base64 string, use it directly

              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: "image/jpeg" }); // Adjust type as needed
              fileToUpload = blob; // Set as the file to upload
            } catch (base64Error) {
              // If conversion fails, add as regular data
              additionalData[key] = value;
            }
          } else {
            console.log("profileImgUrl is not a valid string, skipping");
          }
        } else if (key === "employeeGender") {
          // Convert gender from full text to single letter
          if (value === "Male") {
            additionalData[key] = "M";
          } else if (value === "Female") {
            additionalData[key] = "F";
          } else {
            additionalData[key] = value == null ? "" : value;
          }
        } else if (key === "passtypeId") {
          // Convert passtypeId to passTypeId
          additionalData["passTypeId"] = value == null ? "" : value;
        } else if (key === "orderId") {
          // Convert orderId to bpOrderId
          additionalData["bpOrderId"] = value == null ? "" : value;
        } else {
          additionalData[key] = value == null ? "" : value;
        }
      });

      // Add missing fields from the image
      if (!additionalData.hasOwnProperty("isPassRegenerated")) {
        additionalData["isPassRegenerated"] = "";
      }
      if (!additionalData.hasOwnProperty("isRenewal")) {
        additionalData["isRenewal"] = "true";
      }
      if (!additionalData.hasOwnProperty("transactionType")) {
        additionalData["transactionType"] = "";
      }
      if (!additionalData.hasOwnProperty("employeePhotoDocName")) {
        additionalData["employeePhotoDocName"] = "";
      }

      // Step 3: Send request based on renewal status
      let response;

      if (isRenewal) {
        // For renewal: get renewalRequestJson from matching record
        const currentState = useBusPassTotalTransactionStore.getState();
        let renewalRequestJson = null;

        if (
          currentState.RtcBusPassBookingRecordsData &&
          currentState.RtcBusPassBookingRecordsData.length > 0
        ) {
          // Find the record that matches the current orderId
          const matchingRecord = currentState.RtcBusPassBookingRecordsData.find(
            (record) =>
              record.orderId === parsedPayload.bpOrderId ||
              record.orderId === parsedPayload.orderId
          );
          if (matchingRecord && matchingRecord.renewalRequestJson) {
            renewalRequestJson = matchingRecord.renewalRequestJson;
          }
        }

        console.log("renewalRequestJson", renewalRequestJson);

        // Fallback to creating from additionalData if not found in booking records
        if (!renewalRequestJson) {
          renewalRequestJson = JSON.stringify(additionalData);
        }

        // Parse renewalRequestJson if it's a string, otherwise use as is
        let renewalRequestData;
        try {
          renewalRequestData =
            typeof renewalRequestJson === "string"
              ? JSON.parse(renewalRequestJson)
              : renewalRequestJson;
        } catch (error) {
          renewalRequestData = additionalData; // Fallback to additionalData
        }

        // Convert first letter of all field names to lowercase
        let convertedRenewalData = {};
        if (renewalRequestData) {
          Object.keys(renewalRequestData).forEach(key => {
            // Convert first letter to lowercase
            const convertedKey = key.charAt(0).toLowerCase() + key.slice(1);
            convertedRenewalData[convertedKey] = renewalRequestData[key];
          });
        }

        // Add orderId from matching record to convertedRenewalData
        const currentStateForOrderId = useBusPassTotalTransactionStore.getState();
        if (currentStateForOrderId.RtcBusPassBookingRecordsData && currentStateForOrderId.RtcBusPassBookingRecordsData.length > 0) {
          const matchingRecord = currentStateForOrderId.RtcBusPassBookingRecordsData.find(
            (record) =>
              record.orderId === parsedPayload.bpOrderId ||
              record.orderId === parsedPayload.orderId
          );
          if (matchingRecord && matchingRecord.orderId) {
            convertedRenewalData.orderId = matchingRecord.orderId;
          }
        }

        console.log("convertedRenewalData", convertedRenewalData);

        response = await apiService.post(endpoint, convertedRenewalData, {
          "Content-Type": "application/json",
        });
          console.log("response", response);

        // Step 3.1: If renewal initiate is successful, call renewal payment response API
        if (response && response.data && response.data.status === 200) {
          try {
            // Prepare renewal payment response payload using same logic as regular payment response
            const currentState = useBusPassTotalTransactionStore.getState();
            let renewalPaymentRequestJson = null;

            if (
              currentState.RtcBusPassBookingRecordsData &&
              currentState.RtcBusPassBookingRecordsData.length > 0
            ) {
              // Find the record that matches the current orderId
              const matchingRecord = currentState.RtcBusPassBookingRecordsData.find(
                (record) =>
                  record.orderId === parsedPayload.bpOrderId ||
                  record.orderId === parsedPayload.orderId
              );
              if (matchingRecord && matchingRecord.paymentRequestJson) {
                renewalPaymentRequestJson = matchingRecord.paymentRequestJson;
              }
            }

            // Fallback to creating from parsed payload if not found in booking records
            if (!renewalPaymentRequestJson) {
              renewalPaymentRequestJson = JSON.stringify(parsedPayload);
            }

            // Convert renewalPaymentRequestJson to JSON format if it's a string
            let jsonRenewalPaymentRequest = renewalPaymentRequestJson;
            if (typeof renewalPaymentRequestJson === "string") {
              try {
                jsonRenewalPaymentRequest = JSON.parse(renewalPaymentRequestJson);
              } catch (err) {
                jsonRenewalPaymentRequest = renewalPaymentRequestJson; // Use as string if parsing fails
              }
            }

            // Also add ReferenceNo from response.data if available
            if (response && response.data && response.data.referenceNo) {
              jsonRenewalPaymentRequest.ReferenceNo = response.data.referenceNo;
            }
            // console.log("jsonRenewalPaymentRequest", jsonRenewalPaymentRequest.ReferenceNo);

            if (
              jsonRenewalPaymentRequest &&
              jsonRenewalPaymentRequest.ReferenceNo &&
              jsonRenewalPaymentRequest.ReferenceNo !== ""
            ) {
              if (jsonRenewalPaymentRequest.data) {
                jsonRenewalPaymentRequest.data.ReferenceNo =
                  jsonRenewalPaymentRequest.ReferenceNo;
              }
            }

            // Also set OrderId in Data object if it exists
            if (
              jsonRenewalPaymentRequest &&
              jsonRenewalPaymentRequest.data &&
              response &&
              response.data &&
              response.data.applicationNo
            ) {
              jsonRenewalPaymentRequest.data.OrderId = response.data.applicationNo;
            }

            // Set txnAmount based on passTypeId from parsedPayload
            const passTypeId = parsedPayload.passtypeId;
            let amount = 5310; // default amount

            if (passTypeId === "179-52") {
              amount = 1200;
            } else if (passTypeId === "179-18") {
              amount = 1500;
            } else if (passTypeId === "179-15") {
              amount = 1650;
            } else if (passTypeId === "179-91") {
              amount = 1950;
            }

            // jsonRenewalPaymentRequest.Data.TxnAmount = amount;

            // Delete referenceNo and txnAmount outside of Data object
            if (jsonRenewalPaymentRequest) {
              if (jsonRenewalPaymentRequest.referenceNo) {
                delete jsonRenewalPaymentRequest.referenceNo;
              }
              if (jsonRenewalPaymentRequest.txnAmount) {
                delete jsonRenewalPaymentRequest.txnAmount;
              }
              if (jsonRenewalPaymentRequest.ReferenceNo) {
                delete jsonRenewalPaymentRequest.ReferenceNo;
              }
              if (jsonRenewalPaymentRequest.TxnAmount) {
                delete jsonRenewalPaymentRequest.TxnAmount;
              }
            }

            // Convert all keys to lowercase and send only one structure
            if (jsonRenewalPaymentRequest) {
              const convertedRequest = {};
              Object.keys(jsonRenewalPaymentRequest).forEach((key) => {
                const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
                convertedRequest[lowerKey] = jsonRenewalPaymentRequest[key];
              });

              // Handle nested Data object
              if (
                convertedRequest.data &&
                typeof convertedRequest.data === "object"
              ) {
                const convertedData = {};
                Object.keys(convertedRequest.data).forEach((key) => {
                  const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
                  convertedData[lowerKey] = convertedRequest.data[key];
                });
                convertedRequest.data = convertedData;
              }

              // Replace the original request with converted one (send only lowercase structure)
              Object.keys(jsonRenewalPaymentRequest).forEach(
                (key) => delete jsonRenewalPaymentRequest[key]
              );
              Object.assign(jsonRenewalPaymentRequest, convertedRequest);
            }

            const renewalPaymentResponse = await apiService.post(
              API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT
                .GET_BUS_PASS_GENERATE_TICKET_RENEWAL_PAYMENT_RESPONSE,
              jsonRenewalPaymentRequest
            );
            
            // Call GET_BUS_PASS_GET_TICKET_AND_PASS_DETAILS_BY_ID after renewal payment response
            try {
              // Extract applicationNo from the renewal response - use modifiedApplicationNo if available, otherwise use applicationNo
              const applicationNo = response.data.modifiedApplicationNo || response.data.applicationNo;
              
              // Extract userId from bookingRequestJson in current state
              let userId = null;
              const currentState = useBusPassTotalTransactionStore.getState();
              
              if (currentState.RtcBusPassBookingRecordsData && currentState.RtcBusPassBookingRecordsData.length > 0) {
                // Find the matching record
                const matchingRecord = currentState.RtcBusPassBookingRecordsData.find(
                  (record) =>
                    record.orderId === parsedPayload.bpOrderId ||
                    record.orderId === parsedPayload.orderId
                );
                
                if (matchingRecord && matchingRecord.bookingRequestJson) {
                  try {
                    const bookingRequestData = typeof matchingRecord.bookingRequestJson === 'string' 
                      ? JSON.parse(matchingRecord.bookingRequestJson) 
                      : matchingRecord.bookingRequestJson;
                    
                    if (bookingRequestData && bookingRequestData.createdBy) {
                      userId = bookingRequestData.createdBy;
                    }
                  } catch (parseError) {
                    console.error('Error parsing bookingRequestJson:', parseError);
                  }
                }
              }

              // Call the API if we have both applicationNo and userId
              if (applicationNo && userId) {
                const ticketDetailsResponse = await apiService.get(
                  `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_GET_TICKET_AND_PASS_DETAILS_BY_ID}?id=${applicationNo}&userId=${userId}`
                );
                
                // Merge the renewal payment response with the original response and add ticket details
                response = {
                  ...response,
                  data: {
                    ...response.data,
                    renewalPaymentResponse: renewalPaymentResponse.data,
                    ticketDetails: ticketDetailsResponse.data
                  }
                };
              } else {
                console.warn('Missing applicationNo or userId for GetTicketAndPassDetailsById API call in renewal');
                // Merge the renewal payment response with the original response
                response = {
                  ...response,
                  data: {
                    ...response.data,
                    renewalPaymentResponse: renewalPaymentResponse.data
                  }
                };
              }
            } catch (ticketDetailsError) {
              console.error('GetTicketAndPassDetailsById API error in renewal:', ticketDetailsError);
              // Merge the renewal payment response with the original response
              response = {
                ...response,
                data: {
                  ...response.data,
                  renewalPaymentResponse: renewalPaymentResponse.data
                }
              };
            }
          } catch (renewalPaymentError) {
            console.error("Renewal payment response error:", renewalPaymentError);
            // Continue with original response even if renewal payment fails
          }
        }
      } else {
        // For new pass: send using FormData with file upload
        const formData = new FormData();
        if (fileToUpload) {
          formData.append(
            "employeePhotoDoc",
            fileToUpload,
            "employeePhotoDoc.jpg"
          );
        }

        Object.keys(additionalData).forEach((key) =>
          formData.append(key, additionalData[key])
        );

        response = await apiService.post(endpoint, formData, {
          "Content-Type": "multipart/form-data",
        });
      }

      set({
        RtcGeneratePassData: response.data,
      });

      console.log("response", response.data.applicationNo);
      // Step 4: Call payment response API to get applicationNo
      // Skip regular payment response if renewal payment response was already called
      const isRenewalPayment = response.data && response.data.renewalPaymentResponse;
      
      if (!isRenewalPayment) {
        try {
        // Get paymentRequestJson from RtcBusPassBookingRecordsData
        const currentState = useBusPassTotalTransactionStore.getState();
        let paymentRequestJson = null;

        if (
          currentState.RtcBusPassBookingRecordsData &&
          currentState.RtcBusPassBookingRecordsData.length > 0
        ) {
          // Find the record that matches the current orderId
          const matchingRecord = currentState.RtcBusPassBookingRecordsData.find(
            (record) =>
              record.orderId === parsedPayload.bpOrderId ||
              record.orderId === parsedPayload.orderId
          );
          if (matchingRecord && matchingRecord.paymentRequestJson) {
            paymentRequestJson = matchingRecord.paymentRequestJson;
          }
        }

        // Fallback to creating from parsed payload if not found in booking records
        if (!paymentRequestJson) {
          paymentRequestJson = JSON.stringify(parsedPayload);
        }

        // Convert paymentRequestJson to JSON format if it's a string
        let jsonPaymentRequest = paymentRequestJson;
        if (typeof paymentRequestJson === "string") {
          try {
            jsonPaymentRequest = JSON.parse(paymentRequestJson);
          } catch (err) {
            jsonPaymentRequest = paymentRequestJson; // Use as string if parsing fails
          }
        }

        // Also add ReferenceNo from response.data if available
        if (response && response.data && response.data.referenceNo) {
          jsonPaymentRequest.data.ReferenceNo = response.data.referenceNo;
        }

        if (
          jsonPaymentRequest &&
          jsonPaymentRequest.ReferenceNo &&
          jsonPaymentRequest.ReferenceNo !== ""
        ) {
          if (jsonPaymentRequest.Data) {
            jsonPaymentRequest.Data.ReferenceNo =
              jsonPaymentRequest.ReferenceNo;
          }
        }

        // Also set OrderId in Data object if it exists
        if (
          jsonPaymentRequest &&
          jsonPaymentRequest.data &&
          response &&
          response.data &&
          response.data.applicationNo
        ) {
          jsonPaymentRequest.data.OrderId = response.data.applicationNo;
        }

        // Set txnAmount based on passTypeId from parsedPayload
        // if (jsonPaymentRequest && jsonPaymentRequest.Data) {
        const passTypeId = parsedPayload.passtypeId;
        let amount = 5310; // default amount

        if (passTypeId === "179-52") {
          amount = 1200;
        } else if (passTypeId === "179-18") {
          amount = 1500;
        } else if (passTypeId === "179-15") {
          amount = 1650;
        } else if (passTypeId === "179-91") {
          amount = 1950;
        }

        // jsonPaymentRequest.data.TxnAmount = amount;
        // }

        // Delete referenceNo and txnAmount outside of Data object
        if (jsonPaymentRequest) {
          // Delete referenceNo and txnAmount from top level
          if (jsonPaymentRequest.referenceNo) {
            delete jsonPaymentRequest.referenceNo;
          }
          if (jsonPaymentRequest.txnAmount) {
            delete jsonPaymentRequest.txnAmount;
          }
          if (jsonPaymentRequest.ReferenceNo) {
            delete jsonPaymentRequest.ReferenceNo;
          }
          if (jsonPaymentRequest.TxnAmount) {
            delete jsonPaymentRequest.TxnAmount;
          }
        }

        // Convert all keys to lowercase and send only one structure
        if (jsonPaymentRequest) {
          const convertedRequest = {};
          Object.keys(jsonPaymentRequest).forEach((key) => {
            const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
            convertedRequest[lowerKey] = jsonPaymentRequest[key];
          });

          // Handle nested Data object
          if (
            convertedRequest.data &&
            typeof convertedRequest.data === "object"
          ) {
            const convertedData = {};
            Object.keys(convertedRequest.data).forEach((key) => {
              const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
              convertedData[lowerKey] = convertedRequest.data[key];
            });
            convertedRequest.data = convertedData;
          }

          // Replace the original request with converted one (send only lowercase structure)
          Object.keys(jsonPaymentRequest).forEach(
            (key) => delete jsonPaymentRequest[key]
          );
          Object.assign(jsonPaymentRequest, convertedRequest);
        }

        // Get existing RtcGeneratePassData to use for applicationNo and referenceNo
        // const currentState = useBusPassTotalTransactionStore.getState();
        const existingRtcGeneratePassData = response.data;
        // Add applicationNo to the response data using RtcGeneratePassData
        const finalResponse = {
          ...response.data,
          applicationNo:
            existingRtcGeneratePassData?.applicationNo,
          referenceNo:
            existingRtcGeneratePassData?.referenceNo ,
        };

        set({
          RtcGeneratePassData: finalResponse,
        });

        // Call GetTicketAndPassDetailsById API after payment response
        try {
          // Extract applicationNo from the final response
          const applicationNo = finalResponse.applicationNo;
          
          // Extract userId from bookingRequestJson in current state
          let userId = null;
          const currentState = useBusPassTotalTransactionStore.getState();
          
          if (currentState.RtcBusPassBookingRecordsData && currentState.RtcBusPassBookingRecordsData.length > 0) {
            // Find the matching record
            const matchingRecord = currentState.RtcBusPassBookingRecordsData.find(
              (record) =>
                record.orderId === parsedPayload.bpOrderId ||
                record.orderId === parsedPayload.orderId
            );
            
            if (matchingRecord && matchingRecord.bookingRequestJson) {
              try {
                const bookingRequestData = typeof matchingRecord.bookingRequestJson === 'string' 
                  ? JSON.parse(matchingRecord.bookingRequestJson) 
                  : matchingRecord.bookingRequestJson;
                
                if (bookingRequestData && bookingRequestData.createdBy) {
                  userId = bookingRequestData.createdBy;
                }
              } catch (parseError) {
                console.error('Error parsing bookingRequestJson:', parseError);
              }
            }
          }

          // Call the API if we have both applicationNo and userId
          if (applicationNo && userId) {
            const ticketDetailsResponse = await apiService.get(
              `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_GET_TICKET_AND_PASS_DETAILS_BY_ID}?id=${applicationNo}&userId=${userId}`
            );
            
            // Add ticket details to the final response
            const enhancedFinalResponse = {
              ...finalResponse,
              ticketDetails: ticketDetailsResponse.data,
            };

            set({
              RtcGeneratePassData: enhancedFinalResponse,
            });

            return { response: enhancedFinalResponse };
          } else {
            console.warn('Missing applicationNo or userId for GetTicketAndPassDetailsById API call');
            return { response: finalResponse };
          }
        } catch (ticketDetailsError) {
          console.error('GetTicketAndPassDetailsById API error:', ticketDetailsError);
          // Return original response even if ticket details API fails
          return { response: finalResponse };
        }
      } catch (paymentError) {
        // Return original response even if payment response fails
        return { response: response.data };
      }
      } else {
        // For renewal payments, return the response directly without calling regular payment response
        return { response: response.data };
      }
    } catch (error) {
      set({
        error: error.message,
        RtcGeneratePassData: [],
      });
    } finally {
      set({ isFetchRtcGeneratePassData: false });
    }
  },

















  // bus pass initiate refund
  RtcBusInitiateData: [],
  isFetchRtcBusPassInitiateData: false,
  fetchRtcBusPassInitiateData: async (orderId) => {
    set({ isFetchRtcBusPassInitiateData: true });
    try {
      const method = "post";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_BUS_PASS_INITIATE_REFUND}/${orderId}`
      );
      set({
        RtcBusInitiateData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcBusInitiateData: [],
      });
      throw error;
    } finally {
      set({
        isFetchRtcBusPassInitiateData: false,
      });
    }
  },

  // view bus pass
  RtcViewBusPassData: [],
  isFetchRtcViewBusPassData: false,
  fetchRtcRtcViewBusPassData: async (payload) => {
    set({ isFetchRtcViewBusPassData: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.RTC_TOTAL_TRANSACTIONS_REPORT.GET_VIEW_BUS_PASS}?passId=${payload.passId}`
      );
      set({
        RtcViewBusPassData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      set({
        error: error.message,
        RtcViewBusPassData: [],
      });
    } finally {
      set({
        isFetchRtcViewBusPassData: false,
      });
    }
  },
}));

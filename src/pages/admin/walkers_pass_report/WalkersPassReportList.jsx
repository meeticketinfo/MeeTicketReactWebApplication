import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AgGridTable4 from "../../../components/tables/AgGridTable4";
import { formatToStandardDate, getCurrentDate } from "../../../utils/TypographyHelper";
import IntercityConsolidatedReportForm from "../../../components/rtc/rtc_reports/intercity_reports/intercity_consolidated_report/IntercityConsolidatedReportForm";
import { useIntercityConsolidateStore } from "../../../components/rtc/rtc_reports/intercity_reports/intercity_consolidated_report/IntercityConsolidateStore";
import WalkersPassReportForm from "./WalkersPassReportForm";
import { useWalkersPassReportStore } from "./WalkersPassReportStore";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import { useNavigate } from "react-router-dom";
import { useWalkerpassStore } from "../../../components/book_walker_pass/WalkerpassStore";



// Status cell renderer component
const StatusCellRenderer = (params) => {
  if (!params.value) return "N/A";

  const status = params.value.toLowerCase();
  const colorClass = status === 'confirmed' ? 'text-green-600' : status === 'expired' ? 'text-red-600' : 'text-gray-600';

  return (
    <span className={`${colorClass} font-medium`}>
      {params.value}
    </span>
  );
};
function WalkersPassReportList() {
  const navigate = useNavigate();

  const handleRegenerate = async (passData) => {
    try {
      const passUserDetailsId =
        passData?.PassUserDetailsId ||
        passData?.passUserDetailsId ||
        passData?.BookingId;

      const passResponse = await viewPass(passUserDetailsId);

      const generatedPass = passResponse?.data || passResponse;

      if (generatedPass) {
        navigate("/walker-pass-card", {
          state: {
            passUserDetailsId,
          },
        });
      }
    } catch (error) {
      console.error("Unable to regenerate/view pass:", error);
    }
  };

  const handleViewPass = (passData) => {
    navigate("/walker-pass-card", {
      state: {
        passUserDetailsId:
          passData?.PassUserDetailsId ||
          passData?.passUserDetailsId ||
          passData?.BookingId,
      },
    });
  };

  const [openRegenerateModal, setOpenRegenerateModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);
  const handleConfirmRegenerate = async () => {
    try {
      await handleRegenerate(selectedPass);

      setOpenRegenerateModal(false);
      setSelectedPass(null);
    } catch (error) {
      console.error(error);
    }
  };

  const savedFilters = JSON.parse(
    localStorage.getItem("walkers-pass-report-filters") || "{}"
  );
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const {
    fetchWalkersPassReportData,
    WalkersPassReportData,
    totalCount,
    isFetchWalkersPassReportData,
  } = useWalkersPassReportStore();

  const { viewPass } = useWalkerpassStore();

  useEffect(() => {
    // Only fetch data for pagination changes (not initial load)
    // Initial load is handled by the form component
    if (currentPage > 0) {
      const savedBookingDate = savedFilters?.purchaseOrBooking || 'Purchase';
      const isBookingDateValue = savedBookingDate === 'Booking';

      const formattedValues = {
        fromDate: !isBookingDateValue ? savedFilters?.fromDate ?? getCurrentDate() : "",
        toDate: !isBookingDateValue ? savedFilters?.toDate ?? getCurrentDate() : "",
        bookingDateFrom: isBookingDateValue ? savedFilters?.fromDate ?? getCurrentDate() : null,
        bookingDateTo: isBookingDateValue ? savedFilters?.toDate ?? getCurrentDate() : null,
        passTypeId: savedFilters?.passTypeId ?? "",
        subFacilityId: savedFilters?.subFacilityId ?? "",
        locationId: savedFilters?.locationId ?? "",
        status: savedFilters?.status ?? "CONFIRMED",
        pageNumber: currentPage + 1,
        PageSize: PAGE_LIMIT,
      };

      fetchWalkersPassReportData(formattedValues);
    }
  }, [currentPage, PAGE_LIMIT, fetchWalkersPassReportData]);

  const columnDefs = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      maxWidth: 60,
      pinned: "left",
    },
    {
      field: "sno",
      headerName: "S.No",
      maxWidth: 70,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
        const pageOffset = currentPage * PAGE_LIMIT;
        return pageOffset + params.node.rowIndex + 1;
      },
    },
    {
      field: "TransactionId",
      headerName: "Transaction ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "UserName",
      headerName: "User Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    // ------------------

    {
      field: "FacilityName",
      headerName: "Facility Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "SubFacilityName",
      headerName: "Sub Facility Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "MobileNumber",
      headerName: "Mobile Number",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "BookingDate",
      headerName: "Booking Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        try {
          return formatToStandardDate(params.value);
        } catch {
          return "N/A";
        }
      },
    },

    {
      field: "ValidityStartDate",
      headerName: "Validity Start Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        try {
          return formatToStandardDate(params.value);
        } catch {
          return "N/A";
        }
      },
    },

    {
      field: "ValidTo",
      headerName: "Validity End Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        try {
          return formatToStandardDate(params.value);
        } catch {
          return "N/A";
        }
      },
    },
    {
      field: "PassAmount",
      headerName: "Pass Amount",
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        return `₹${params.value}`;
      },
    },
    {
      field: "Status",
      headerName: "Status",
      maxWidth: 180,
      // flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: StatusCellRenderer,
    },
    {
      field: "PassType",
      headerName: "Pass Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "Mode",
      headerName: "Mode",
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      headerName: "Generate Pass",
      minWidth: 180,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const isDisabled =
          params.data?.IsEligibleForRegenerate !== 1;

        return (
          <div className="flex justify-center">
            <button
              className={`px-6 py-1.5 mt-1 text-sm font-semibold rounded-md transition-all duration-200 ${isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-v2 text-white hover:bg-blue-v1"
                }`}
              onClick={() => {
                if (!isDisabled) {
                  setSelectedPass(params.data);
                  setOpenRegenerateModal(true);
                }
              }}
              disabled={isDisabled}
            >
              Regenerate Pass
            </button>
          </div>
        );
      },
    },
    {
      headerName: "Action",
      minWidth: 180,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const isDisabled =
          !(
            params.data?.Status === "CONFIRMED" &&
            params.data?.BookingId
          );

        return (
          <div className="flex justify-center">
            <button
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${isDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-v2 text-white hover:bg-blue-v1"
                }`}
              onClick={() => {
                if (!isDisabled) {
                  handleViewPass(params.data);
                }
              }}
              disabled={isDisabled}
            >
              View Pass
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <WalkersPassReportForm
        pageNumber={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <AgGridTable4
        ExportName="Walkers Pass Report"
        rowData={WalkersPassReportData}
        columnDefs={columnDefs}
        rowSelection="multiple"
        isFetchLoading={isFetchWalkersPassReportData}
        isPagination={false}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        showTotalCount={true}
        totalCount={totalCount}
        tableHeight={WalkersPassReportData.length > 10 ? 550 : 300}
        SetcurrentPage={setCurrentPage}
        showSearch={false}
      />
      <PopupModal
        popupModalId="regenerate-pass-modal"
        isOpen={openRegenerateModal}
        onClose={() => {
          setOpenRegenerateModal(false);
          setSelectedPass(null);
        }}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            Are you sure you want to regenerate the pass for this booking?
          </h1>

          <div className="flex justify-center gap-8 mt-4 z-30">
            <button
              onClick={handleConfirmRegenerate}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              Proceed
            </button>

            <button
              onClick={() => {
                setOpenRegenerateModal(false);
                setSelectedPass(null);
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal>
    </div>
  );
}

export default WalkersPassReportList;

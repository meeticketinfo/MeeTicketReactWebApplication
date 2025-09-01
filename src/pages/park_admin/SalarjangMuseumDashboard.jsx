import React, { useEffect } from "react";
import ticket from "../../images/ticket.png";
import cash from "../../images/cash.png";
import scan from "../../images/scan.png";
import arrow from "../../images/twoWayArrow.png";
import { UseSalarjangDashboardStore } from "../../store/dashboard/salarjangDashboardStore";
import { Field, Form, Formik } from "formik";
import { getCurrentDate } from "../../utils/TypographyHelper";
import CountUp from "react-countup";

// Minimal loader component
const Loader = ({ className = "w-6 h-6" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}
  />
);

const SalarjangMuseumDashboard = () => {
  const {
    fetchSalarjungMuseumDashBoardCount,
    SalarjungMuseumDashBoardCountData,
    isSalarjungMuseumDashBoardCountLoading,
  } = UseSalarjangDashboardStore();

  useEffect(() => {
    fetchSalarjungMuseumDashBoardCount({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, []);
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchSalarjungMuseumDashBoardCount({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };

  // Download functionality
  const downloadDetailedReport = (formValues) => {
    const detailedData = generateDetailedReport(formValues);
    const blob = new Blob([detailedData], {
      type: "text/plain;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `SalarjangMuseumDashboard_Detailed_${formValues.fromDate}_to_${formValues.toDate}.txt`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateDetailedReport = (formValues) => {
    let report = `╔══════════════════════════════════════════════════════════════════════════════╗\n`;
    report += `                     SALARJANG MUSEUM DASHBOARD REPORT                        \n`;
    report += `╚══════════════════════════════════════════════════════════════════════════════╝\n\n`;

    report += `Date Range: ${formValues.fromDate} to ${formValues.toDate}\n`;
    report += `Generated On: ${new Date().toLocaleString()}\n`;
    // report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    report += `1. MEE TICKET APP REPORT\n`;
    // report += `   ═════════════════════════════════════════════════\n`;
    report += `   Total Ticket Count: ${
      SalarjungMuseumDashBoardCountData.mobileAppTotalTickets ?? 0
    }\n`;
    report += `   Total Amount: ₹${
      SalarjungMuseumDashBoardCountData.mobileAppTotalAmount ?? 0
    }\n\n`;

    report += `2. MEE TICKET COUNTER REPORT\n`;
    // report += `   ══════════════════════════════════════════════════\n`;
    report += `   Total Ticket Count: ${
      SalarjungMuseumDashBoardCountData.counterAppTotalTickets ?? 0
    }\n`;
    report += `   Total Amount: ₹${
      SalarjungMuseumDashBoardCountData.counterAppTotalAmount ?? 0
    }\n\n`;

    report += `3. TICKET REPORT BY SERVICE\n`;
    // report += `   ══════════════════════════════════════════════════\n`;
    if (SalarjungMuseumDashBoardCountData?.data) {
      SalarjungMuseumDashBoardCountData.data
        .filter((item) => item.serviceName !== "Parking")
        .forEach((service, serviceIndex) => {
          report += `   ${serviceIndex + 1}. ${service.serviceName}\n`;
          // report += `      ┌───────────────────────────────────────────┐\n`;
          service.subFacilities.forEach((subFacility, subIndex) => {
            report += `      │ ${subIndex + 1}. ${subFacility.subFacilityName}\n`;
            report += `      │    Total Tickets: ${
              subFacility.totalTickets ?? 0
            }\n`;
            report += `      │    Total Amount: ₹${
              subFacility.totalAmount ?? 0
            }\n`;
            if (subIndex < service.subFacilities.length - 1) {
              report += `      │\n`;
            }
          });
          // report += `      └───────────────────────────────────────────┘\n\n`;
        });
    }

    report += `4. SUMMARY\n`;
    report += `   ═════════════════════════════════════════════════════\n`;
    report += `   Total Transactions: ${
      SalarjungMuseumDashBoardCountData.summeryTotalBookings ?? 0
    }\n`;
    report += `   Total Tickets: ${
      SalarjungMuseumDashBoardCountData.summeryTotalTickets ?? 0
    }\n`;
    report += `   Total Amount: ₹${
      SalarjungMuseumDashBoardCountData.summeryTotalAmount ?? 0
    }\n\n`;

    return report;
  };

  const MeeTicketReportCard = [
    {
      label: "Total Ticket Count",
      icon: ticket,
      value: SalarjungMuseumDashBoardCountData.mobileAppTotalTickets ?? 0,
    },
    {
      label: "Total Amount",
      icon: cash,
      value: SalarjungMuseumDashBoardCountData.mobileAppTotalAmount ?? 0,
    },
  ];

  const MeeTicketCounterReportCard = [
    {
      label: "Total Ticket Count",
      icon: ticket,
      value: SalarjungMuseumDashBoardCountData.counterAppTotalTickets ?? 0,
    },
    {
      label: "Total Amount",
      icon: cash,
      value: SalarjungMuseumDashBoardCountData.counterAppTotalAmount ?? 0,
    },
  ];

  const SummaryCard = [
    {
      label: "Total Transactions",
      icon: arrow,
      value: SalarjungMuseumDashBoardCountData.summeryTotalBookings ?? 0,
    },
    {
      label: "Total Tickets",
      icon: ticket,
      value: SalarjungMuseumDashBoardCountData.summeryTotalTickets ?? 0,
    },
    {
      label: "Total Amount",
      icon: cash,
      value: SalarjungMuseumDashBoardCountData.summeryTotalAmount ?? 0,
    },
  ];

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="date"
                name="fromDate"
                className={`mt-1 block w-full px-2 py-1 border
          border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                // min={getCurrentDate()}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.toDate)) {
                    // Automatically update toDate if it's earlier than fromDate
                    setFieldValue("toDate", fromDateValue);
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-xs font-medium text-gray-700"
              >
                To Date
              </label>
              <Field
                type="date"
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border
             border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                disabled={isSalarjungMuseumDashBoardCountLoading}
              >
                {isSalarjungMuseumDashBoardCountLoading ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  "Search"
                )}
              </button>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => downloadDetailedReport(values)}
                className="bg-blue-v2 text-xs text-white rounded-lg px-3 py-1.5  "
                disabled={isSalarjungMuseumDashBoardCountLoading}
              >
                Download Detailed Report
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div>
        {/* Mee ticket App Report */}
        <div className="my-4">
          <h1 className="text-lg text-gray-600 font-bold mb-3">
            Mee Ticket App Report
          </h1>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
            {MeeTicketReportCard.map((item, index) => (
              <div className="flex px-6 py-4 justify-between bg-[#e3e7ff81] gap-4 items-center rounded-lg min-w-0 shadow-md">
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <h1 className="text-2xl text-black font-bold break-words">
                    {index === 1 ? "₹ " : ""}
                    {isSalarjungMuseumDashBoardCountLoading ? (
                      <Loader className="w-6 h-6" />
                    ) : (
                      <CountUp
                        end={item.value ?? 0}
                        duration={2}
                        prefix=""
                        separator=","
                      />
                    )}
                  </h1>
                  <p className="text-md font-normal text-[#6D6D6D] break-words">
                    {item.label}
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 ${
                    index === 1 ? "px-4 py-2" : "p-2"
                  } bg-[#D9DEF7] rounded-md`}
                >
                  {isSalarjungMuseumDashBoardCountLoading ? (
                    <Loader className="w-6 h-6" />
                  ) : (
                    <img src={item.icon} alt="N/A" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MEE TICKET COUNTER REPORT */}

        <div className="my-4">
          <h1 className="text-lg text-gray-600 font-bold mb-3">
            Mee Ticket Counter Report
          </h1>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
            {MeeTicketCounterReportCard.map((item, index) => (
              <div className="flex px-6 py-4 justify-between bg-[#e3e7ff81] gap-4 items-center rounded-lg min-w-0 shadow-md">
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <h1 className="text-2xl text-black font-bold break-words">
                    {index === 1 ? "₹ " : ""}
                    {isSalarjungMuseumDashBoardCountLoading ? (
                      <Loader className="w-6 h-6" />
                    ) : (
                      <CountUp
                        end={item.value ?? 0}
                        duration={2}
                        prefix=""
                        separator=","
                      />
                    )}
                  </h1>
                  <p className="text-md font-normal text-[#6D6D6D] break-words">
                    {item.label}
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 ${
                    index === 1 ? "px-4 py-2" : "p-2"
                  } bg-[#D9DEF7] rounded-md`}
                >
                  {isSalarjungMuseumDashBoardCountLoading ? (
                    <Loader className="w-6 h-6" />
                  ) : (
                    <img src={item.icon} alt="N/A" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Report */}
        <div>
          <h1 className="text-lg text-gray-600 font-bold mb-3">
            Ticket Report
          </h1>
          <div className="bg-[#e1e5fcb6] px-3 py-4 rounded-lg border border-[#E1E5FC] flex flex-col  gap-4 shadow-md">
            {isSalarjungMuseumDashBoardCountLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="w-8 h-8" />
              </div>
            ) : (
              SalarjungMuseumDashBoardCountData?.data
                ?.filter((item) => item.serviceName !== "Parking")
                .map((item, index) => {
                  return (
                    <>
                      <h1 className="text-md font-semibold  text-gray-700">
                        {item.serviceName}
                      </h1>
                      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 ">
                        {item.subFacilities.map((item, index) => {
                          return (
                            <div className="flex flex-col gap-2 bg-white px-4 py-3 rounded-xl min-w-0 shadow-lg">
                              <div className="flex gap-2 items-center min-w-0">
                                <div
                                  className={`flex-shrink-0 ${"p-2"} bg-[#D9DEF7] rounded-md`}
                                >
                                  <img src={item.icon} />
                                </div>
                                <h1 className="text-sm text-black font-semibold break-words flex-1 min-w-0">
                                  {item.subFacilityName}
                                </h1>
                              </div>
                              <div className="flex flex-col gap-2 ">
                                <div className="flex justify-between bg-[#EFF6FF] px-4 py-2 rounded-lg min-w-0">
                                  <p className="text-sm text-blue-v2 font-bold flex-shrink-0">
                                    Total Tickets
                                  </p>
                                  <h1 className="text-black font-semibold break-words ml-2">
                                    <CountUp
                                      end={item.totalTickets ?? 0}
                                      duration={2}
                                      prefix=""
                                      separator=","
                                    />
                                  </h1>
                                </div>
                                <div className="flex justify-between bg-[#EFF6FF] px-4 py-2 rounded-lg min-w-0">
                                  <p className="text-sm font-semibold text-blue-v2 flex-shrink-0">
                                    Total Amount
                                  </p>
                                  <h1 className="text-black font-bold break-words ml-2">
                                    ₹
                                    <CountUp
                                      end={item.totalAmount}
                                      duration={2}
                                      prefix=""
                                      separator=","
                                    />
                                  </h1>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="my-4 ">
          <h1 className="text-lg text-gray-600 font-bold mb-3">Summary</h1>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 ">
            {SummaryCard.map((item, index) => (
              <div className="flex px-6 py-4 justify-between bg-[#e3e7ff81] gap-4 items-center rounded-lg min-w-0 shadow-md ">
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <h1 className="text-2xl text-black font-bold break-words">
                    {index === 2 ? "₹ " : ""}
                    {item.value}
                  </h1>
                  <p className="text-md font-normal text-[#6D6D6D] break-words">
                    {item.label}
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 ${
                    index === 2 ? "px-4 py-2" : "p-2"
                  } bg-[#D9DEF7] rounded-md`}
                >
                  <img src={item.icon} alt="ticket" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SalarjangMuseumDashboard;

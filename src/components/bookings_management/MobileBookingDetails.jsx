import ITMinisterImg from "../../images/it_minister.png";
import headerLogo from "../../images/Telangana-logo.png";
import cmImg from "../../images/chief_minister.png";
import MeeTicketLogo from "../../images/ASI-logo.png";
import Qrcodeweb from "../../images/qr-code.png";
import axios from "axios";
import { useEffect, useState } from "react";
function MobileBookingDetails() {
    const [bookingDetails, setBookingDetails] = useState(null);
    const fetchMobileBookingDetails = async () => {
        try {
            const bookingId = "GET_BOOKINGS_BOOKING_ID";
            const response = await axios.get(`https://meeticketdevui.vmaxtechservices.life/parkapi/api/Transaction/GetAllBookingDetailsByBookingId/${bookingId}`)
            setBookingDetails(response.data?.bookingDetails?.[0]);
            console.log('fetchMobileBookingDetail', response.data)
        }
        catch (error) {
            console.error('Error fetching booking details:', error);
        }
 
    }

    useEffect(() => {
        fetchMobileBookingDetails();
    }, []);

    if (!bookingDetails) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="container-fluid bg-gray-200 h-auto overflow-auto">
                <div className="p-3 m-1 bg-blue-v1 rounded-[20px] text-gray-200 shadow-lg hidden md:block ">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        {/* First Column */}
                        <div className="align-middle hidden xs:block lg:flex items-center space-x-2">
                            <img alt="site-logo" src={headerLogo} width={40} height={40} />
                            <div>
                                <p className="text-lg font-semibold">Government of Telangana</p>
                                <small className="text-[10px]">ITE&C Department</small>
                            </div>
                        </div>

                        {/* Second Column */}
                        <div className="flex items-center space-x-8">
                            {/* Chief Minister Section */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold">Sri A. Revanth Reddy</p>
                                    <span className="block text-xs leading-tight">
                                        Hon'ble Chief Minister <br /> Government of Telangana
                                    </span>
                                </div>
                                <img
                                    src={cmImg}
                                    alt="CM"
                                    className="w-16 h-20 rounded-[20px] border-2 border-gray-100"
                                />
                            </div>

                            {/* IT Minister Section */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold">Sri D. Sridhar Babu</p>
                                    <span className="block text-xs leading-tight">
                                        Hon'ble Minister for IT <br /> Government of Telangana
                                    </span>
                                </div>
                                <img
                                    src={ITMinisterImg}
                                    alt="Minister"
                                    className="w-16 h-20 rounded-[20px] border-2 border-gray-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full place-items-center mt-4 mb-4">
                    <div className="md:w-4/12 w-full mx-auto">
                        <div className="bg-white rounded-[20px] px-6 py-2">
                            <div className="my-2 ">
                                <img src={MeeTicketLogo} className="w-20 m-auto rounded-lg" />
                                <h2 className="text-[#0da957] font-bold text-2xl text-center my-1">Entry Ticket</h2>
                                <img src={Qrcodeweb} className="w-48 m-auto my-4" />
                            </div>
                            <div>
                                <table className=" w-full text-left mx-auto">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 px-2  font-medium ">Facilities</td>
                                            <td className="py-1 px-2">: {bookingDetails.facilityName}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 px-2  font-medium">Sub Facility</td>
                                            <td className="py-1 px-2 "> : {bookingDetails.serviceName}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 px-2 font-medium">Ticket Type</td>
                                            <td className="py-1 px-2 "> : {bookingDetails.serviceVariantName}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 px-2 font-medium">Quantity</td>
                                            <td className="py-1 px-2 "> : {bookingDetails.quantity}</td>
                                        </tr>
                                    </tbody>
                                    <tfoot className="border border-b-0 border-l-0 border-r-0 border-[#ccc]">
                                        <tr>
                                            <th className="py-1 px-2 font-medium">Total</th>
                                            <th className="py-1 px-2 font-medium"> : {bookingDetails.totalAmount}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default MobileBookingDetails
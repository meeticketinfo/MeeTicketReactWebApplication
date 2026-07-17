import React from 'react';
import cmImg from "../../images/chief_minister.png";
import ITMinisterImg from "../../images/it_minister.png";
import meetickesTelanganaImg from "../../images/meetickets-telangana.png";
import headerLogo from "../../images/Telangana-logo.png";
import meeticketlogo from "../../images/ASI-logo.png";

function DownloadApks() {
    return (
        <>
            <div className='min-h-screen flex flex-col bg-blue-v1 p-4 '>
                {/* Header */}
                <div className="container-fluid hidden md:block p-3 bg-blue-v1 rounded-[20px] text-gray-200 shadow-lg backdrop-blur-sm bg-white/30 ">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        {/* First Column */}
                        <div className="align-middle hidden lg:flex items-center space-x-2">
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
                <h1 className='text-center text-3xl font-semibold text-white mt-6 '>Download APK's   </h1>
                <div className="flex flex-wrap justify-center gap-6">
                    {/* Card 1 */}
                    <div className="bg-white mt-5 text-center py-6 px-4 shadow-md border-blue-950 rounded-md w-80">
                        <div className="mb-4">
                            <img
                                src={meeticketlogo}
                                alt="Archaeological Survey of India Logo"
                                className="w-20 mx-auto rounded-lg"
                            />
                        </div>
                        <div className="text-xl text-blue-v1 font-medium mb-4">Download Archaeological Survey of India App</div>
                        <a
                            href="https://egovindia.in/meeticketapk/MeeTicket(1.0.9).apk"
                            className="hover:bg-blue-v1 bg-blue-v2   text-white font-semibold py-2 px-4 rounded inline-block transition duration-300"
                        >
                            Click here
                        </a>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white mt-5 text-center py-6 px-4 shadow-md border border-blue-950 rounded-md w-80">
                        <div className="mb-4">
                            <img
                                src={meeticketlogo}
                                alt="GateKeepar Logo"
                                className="w-20 mx-auto rounded-lg"
                            />
                        </div>
                        <div className="text-xl font-medium text-blue-v1 mb-4">Download GateKeper App</div>
                        <a
                            href="https://egovindia.in/meeticketapk/GateKeeper(1.0.1).apk"
                            className="hover:bg-blue-v1 bg-blue-v2  text-white font-semibold py-2 px-4 rounded inline-block transition duration-300"
                        >
                            Click here
                        </a>
                    </div>
                </div>
            </div>
        </>

    )
}

export default DownloadApks
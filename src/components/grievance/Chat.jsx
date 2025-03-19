import React, { useState, useEffect, useRef } from "react";
import { GriveanceReportStore } from "../../store/reports/GrievanceStore";
import { bouncy } from "ldrs";
import { getCurrentDate } from "../../utils/TypographyHelper";

bouncy.register();
function Chat({ Record, setOpenModal }) {
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const { saveCommentDetails, fetchOverAllReports, isSaveCommentLoading } =
    GriveanceReportStore();

  const storedUser = localStorage.getItem("OverAllFilters");
  const userObject = storedUser ? JSON.parse(storedUser) : "";

  // Ref for scrolling to the latest message
  const chatContainerRef = useRef(null);

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to the latest chat when the component mounts
  }, [Record.comments]); // Run when comments update

  const CommentSubmit = async () => {
    if (comment == "") {
      setCommentError("Cannot submit with empty message ");
      return;
    }
    const payload = {
      grievanceTrackingId: Record.grievanceTrackingId,
      comments: comment,
    };
    const res = await saveCommentDetails(payload);
    if (res.data.status === 200) {
      setOpenModal(false);
      fetchOverAllReports({
        fromDate: userObject.fromDate || getCurrentDate(),
        toDate: userObject.toDate || getCurrentDate(),
        active: false,
      });
    } else {
      console.log("Something went wrong, please try again.");
    }
    setComment("");
  };

  return (
    <>
      <div className="bg-gray-100 flex flex-col max-w-xl mx-auto">
        <div className="flex-1 p-4">
          <div
            ref={chatContainerRef}
            className="flex flex-col overflow-y-auto h-96 py-2 space-y-2"
          >
            {/* Messages go here */}
            {Record.comments.map((comment, index) => (
              <div key={index}>
                {comment.UserType === "User" && (
                  <div className="flex">
                    <div className="bg-blue-v2 text-sm text-white px-3 pt-2 pb-4 shadow-md rounded-lg max-w-xs relative">
                      <span className="text-[10px] font-thin absolute bottom-0 right-2 text-gray-200 opacity-70 tracking-wider">
                        User
                      </span>
                      {comment.Comment}
                    </div>
                  </div>
                )}

                {comment.UserType === "Admin" && (
                  <div className="flex justify-end">
                    <div className="bg-gray-200 text-sm text-black px-3 pt-2 pb-4 shadow-md rounded-lg max-w-xs relative">
                      <span className="text-[8px] font-semibold absolute bottom-0 right-1 text-blue-v1 tracking-wider">
                        Admin
                      </span>
                      {comment.Comment}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Send Message Section */}
        <div className="relative">
          <div className="bg-white sticky p-4 flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={comment}
              onChange={(e) => {
                setCommentError("");
                setComment(e.target.value);
              }}
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            />

            <button
              className="bg-blue-v2 text-white rounded-full p-2 ml-2 hover:bg-blue-600 focus:outline-none"
              onClick={CommentSubmit}
            >
              {isSaveCommentLoading ? (
                <span>
                  <l-bouncy size="25" speed="1.75" color="white"></l-bouncy>
                </span>
              ) : (
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <path
                    d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                    stroke="#ffffff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="text-red-700 text-xs text-end px-6  absolute bottom-0 right-0">
            {commentError}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;

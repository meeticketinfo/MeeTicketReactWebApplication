import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AgGridTable from "../../../components/tables/AgGridTable";
import { FiEdit } from "react-icons/fi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";

import Tippy from "@tippyjs/react";
import { useBannerStore } from "./BannerStore";

const BannerList = ({ setIsEdit, setIsBannerCreateVisible }) => {
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteModal, setdeleteModal] = useState(false);
  const [deleteBannerId, setDeleteBannerId] = useState("");
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const { fetchAllBanners, allBanners, isFetchAllBannersLoading,setCurrentBannerEditDetails,DeleteBannerDetails,DeleteBannerDetailsLoading } =
    useBannerStore();
  console.log("GetBanners", allBanners);
  useEffect(() => {
    fetchAllBanners({
      pageNumber: currentPage + 1,
      PageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

  const columnDefs = [ 
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "bannerTitle",
      headerName: "Banner Title",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },

    {
      field: "bannerDescription",
      headerName: "Banner Description",
      flex: 1,
      minWidth: 250,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "sequence",
      headerName: "Sequence",
      flex: 1,
      minWidth: 100,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "startDateAndTime",
      headerName: "Created Date & Time",
      flex: 1,
      minWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "endDateAndTime",
      headerName: "ModifiedDateTime",
      flex: 1,
      minWidth: 160,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
    field: "isActive",
      headerName: "Status",
      minWidth: 90,
      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <>
          <div
            className={`flex   font-semibold gap-2  ${
              params.value
                ? "text-green-500  text-shadow-md"
                : "text-red-400 text-shadow-md"
            }`}
          >
            <span className="">{params.value ? "Active" : "In Active"}</span>
          </div>
        </>
      ),
    },
    {
      headerName: "Actions",
      field: "actions",
      minWidth: 95,
      cellRenderer: (params) => (
        <>
          <div className={` flex items-center gap-3 py-2`}>
            {/* edit */}
            <button
              className=""
              onClick={() => {
                setIsEdit(true);
                setIsBannerCreateVisible(true);
                setCurrentBannerEditDetails(params.data);
              }}
            >
              <Tippy content="Edit" placement="top">
                <span className="">
                  <FiEdit className="text-[24px] text-blue-600 " />
                </span>
              </Tippy>
            </button>
            <button
              className=""
              onClick={() => {
                setdeleteModal(true);
                setDeleteBannerId(params.data.bannerId);
              }}
            >
              <Tippy content="Delete" placement="top">
                <span className="">
                  <MdOutlineDeleteOutline className="text-[27px] text-red-600 " />
                </span>
              </Tippy>
            </button>
          </div>
        </>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ];
  const handleDelete = async (bannerId) => {
    try {
      const res = await DeleteBannerDetails(bannerId);
      console.log("res", res);
      if (res.data.status === 200) {
        toast.success("Banner deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error(error.response?.data.title);
    }finally{
      setdeleteModal(false);
      fetchAllBanners({
        pageNumber: currentPage + 1,
        PageSize: PAGE_LIMIT,
      });
    }
  };
  return (
    <>
      <div>
        <ToastContainer />
        <AgGridTable
          ExportName="banners"
          rowData={allBanners.bannersList}
          columnDefs={columnDefs}
          isFetchLoading={isFetchAllBannersLoading}
          isPagination={false}
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          showTotalCount={true}
          totalCount={allBanners.totalRecords}
          tableHeight={allBanners.bannersList?.length > 10 ? 550 : 300}
          SetcurrentPage={setCurrentPage}
          showSearch={false}
        />
        {/* initiate refund modal */}

        <PopupModal
          popupModalId="first-modal"
          isOpen={deleteModal}
          onClose={() => setdeleteModal(false)}
          size="small"
          overlayClassName="bg-gray-800 bg-opacity-60"
          contentClassName="bg-white"
          defaultBodyPadding={true}
        >
          <div className="px-10 py-14">
            <h1 className="text-blue-v1 font-semibold">
              Are you sure you want to Delete the Record?
            </h1>

            <div className="flex justify-center gap-8 mt-4 z-30">
              <button
                onClick={async () => {
                  await handleDelete(deleteBannerId);
                }}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
              >
                {DeleteBannerDetailsLoading ? (
                  <span className="px-8">
                    <l-tailspin
                      size="15"
                      stroke="5"
                      speed="0.9"
                      color="white"
                    ></l-tailspin>
                  </span>
                ) : (
                  "Delete"
                )}
              </button>

              <button
                onClick={() => setdeleteModal(false)}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </PopupModal>
      </div>
    </>
  );
};

export default BannerList;

import React from "react";

const PackageTableLoader = () => {
  return (
    <>
      <div
        role="status"
        className="w-full mt-8  bg-white p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-xl shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
      >
        {[1, 2, 3, 4, 5].map(() => {
          return (
            <div className="flex items-center justify-between pt-2">
              {[1, 2, 3, 4, 5].map(() => {
                return (
                  <div className="">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
                  </div>
                );
              })}
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12" />
            </div>
          );
        })}

        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export default PackageTableLoader;

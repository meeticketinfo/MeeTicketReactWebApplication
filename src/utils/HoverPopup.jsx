import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const HoverPopup = ({ isHovered, data }) => {
  return (
    <div className="relative">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-100 border border-gray-200 shadow-lg rounded-lg p-4 z-10"
          >
            {/* Arrow */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-full w-3 h-3 rotate-45 bg-gray-100 border-l border-t border-gray-200 z-[-1]" />

            <h4 className="text-sm font-bold underline text-gray-800">
              Amount Details
            </h4>
            <div className="text-xs text-blue-v2 mt-1">
              <div className="flex gap-1 text-sm font-medium">
                <h2>UPI Payment:</h2>
                <span className="font-bold text-gray-700">₹{data.upiCount}</span>
              </div>
              <div className="flex gap-1 text-sm font-medium">
                <h2>Cash Payment:</h2>
                <span className="font-bold text-gray-700">₹{data.cashCount}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverPopup;

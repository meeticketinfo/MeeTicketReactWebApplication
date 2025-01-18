import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

const PopupModal = ({
  popupModalId,
  isOpen,
  onClose,
  size = "medium",
  title,
  children,
  overlayClassName = "bg-black bg-opacity-50",
  contentClassName = "bg-white rounded-lg shadow-lg",
  closeButton = true,
  titleClassName = "text-lg font-medium text-gray-900",
  defaultBodyPadding = true,
  footer,
  onExternalSubmit,
}) => {
  const sizeClasses = {
    small: "max-w-md w-full",
    medium: "max-w-4xl w-full",
    large: "max-w-6xl w-full",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <Transition
      show={isOpen}
      enter="transition-opacity ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={`fixed inset-0 ${overlayClassName} z-[99999999] flex items-center justify-center backdrop-blur-sm bg-gray-100`}
        onClick={onClose}
      >
        <Transition
          show={isOpen}
          enter="transition-transform ease-out duration-300"
          enterFrom="transform scale-95"
          enterTo="transform scale-100"
          leave="transition-transform ease-in duration-200"
          leaveFrom="transform scale-100"
          leaveTo="transform scale-95"
        >
          <div
            className={`${contentClassName} ${sizeClasses[size]} relative rounded-lg my-8`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className={titleClassName}>{title}</h3>
              </div>
            )}

            {/* Scrollable body */}
            <div
              className={`${
                defaultBodyPadding ? "" : ""
              } overflow-y-auto max-h-[60vh]`}
            >
              {children}
            </div>

            {footer && (
              <div className="px-6 py-4 border-t border-gray-200">{footer}</div>
            )}

            {closeButton && (
              <button
                className="absolute top-1 right-2 text-black font-semibold hover:text-gray-700 flex items-center content-center px-6 py-4"
                onClick={onClose}
              >
                <IoClose className="text-xl" />
              </button>
            )}
          </div>
        </Transition>
      </div>
    </Transition>,
    document.body
  );
};

export default PopupModal;

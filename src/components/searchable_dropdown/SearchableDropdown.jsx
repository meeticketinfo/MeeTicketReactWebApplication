import React, { useState, useEffect, useRef } from "react";

const SearchableDropdown = ({
  name,
  value,
  onChange,
  onSearch,
  options = [],
  displayKey = "label",
  valueKey = "value",
  placeholder = "Search...",
  minSearchLength = 2,
  debounceMs = 300,
  className = "",
  inputClassName = "mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm text-gray-900 placeholder-gray-400 caret-gray-700",
  dropdownClassName = "absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto",
  optionClassName = "px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm",
  loading = false,
  noResultsText = "No results found",
  loadingText = "Searching...",
  disabled = false,
  // Initial value props
  initialValue = null,
  initialDisplayText = "",
}) => {
  const [input, setInput] = useState(initialDisplayText || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const isInitialized = useRef(false);
  const hasInitialDisplayText = useRef(!!initialDisplayText);
  const userHasTyped = useRef(false);
  const userIsTypingRef = useRef(false);

  // Normalize option object
  const normalizeOption = (option) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    }
    return {
      label: option?.[displayKey] ?? option?.label ?? option?.name ?? "",
      value: option?.[valueKey] ?? option?.value ?? option?.id ?? null,
    };
  };

  // Set initial value when component mounts
  useEffect(() => {
    if (!isInitialized.current && initialValue !== null && initialValue !== undefined) {
      if (initialDisplayText) {
        setInput(initialDisplayText);
        onChange?.(initialValue);
        hasInitialDisplayText.current = true;
      } else if (options && options.length > 0) {
        const matchedOption = options.find(opt => {
          const normalized = normalizeOption(opt);
          return normalized.value === initialValue;
        });
        
        if (matchedOption) {
          const normalized = normalizeOption(matchedOption);
          setInput(normalized.label);
          onChange?.(normalized.label);
          hasInitialDisplayText.current = true;
        }
      }
      isInitialized.current = true;
    }
  }, [initialValue, initialDisplayText, options, onChange, normalizeOption]);

  // Sync with external value changes (for controlled component)
  useEffect(() => {
    if (userIsTypingRef.current) return;
    if (value !== undefined && value !== null && value !== initialValue) {
      const matchedOption = options.find(opt => {
        const normalized = normalizeOption(opt);
        return normalized.value === value;
      });
      
      if (matchedOption) {
        const normalized = normalizeOption(matchedOption);
        setInput(normalized.label);
        hasInitialDisplayText.current = true;
      } else if (value === "" || value === null) {
        setInput("");
        hasInitialDisplayText.current = false;
      }
    }
  }, [value, options, normalizeOption, initialValue]);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    userIsTypingRef.current = true;
    const newValue = e.target.value;
    setInput(newValue);
    userHasTyped.current = true;
    
    // Clear existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Clear existing search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set loading state
    setIsLoading(true);
    
    // Debounce the search
    debounceTimeoutRef.current = setTimeout(() => {
      if (newValue && newValue.length >= minSearchLength) {
        // Only call API if user has typed something different from initial display text
        if (!hasInitialDisplayText.current || newValue !== initialDisplayText) {
          onSearch?.(newValue);
        } else {
          // If user typed the same as initial display text, don't call API
          setIsLoading(false);
          setIsOpen(false);
        }
      } else {
        setIsOpen(false);
        setIsLoading(false);
      }
      setTimeout(() => { userIsTypingRef.current = false; }, 0);
    }, debounceMs);
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    const normalized = normalizeOption(option);
    setInput(normalized.label);
    onChange?.(normalized.label);
    setIsOpen(false);
    setIsLoading(false);
    hasInitialDisplayText.current = true;
    userHasTyped.current = true;
  };

  // Handle focus
  const handleFocus = () => {
    if (input.length >= minSearchLength && options.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle blur
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Handle clear
  const handleClear = () => {
    setInput("");
    onChange?.(null);
    setIsOpen(false);
    setIsLoading(false);
    hasInitialDisplayText.current = false;
    userHasTyped.current = true;
    inputRef.current?.focus();
  };

  // Handle key down
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Update loading state when options change - ONLY if user has typed
  useEffect(() => {
    // Only process options if user has actually typed something
    if (userHasTyped.current) {
      if (options && options.length > 0 && input && input.length >= minSearchLength) {
        setIsLoading(false);
        setIsOpen(true);
      } else if (options && options.length === 0 && input && input.length >= minSearchLength) {
        setIsLoading(false);
        setIsOpen(true);
      }
    }
  }, [options, input, minSearchLength]);

  // Handle external loading state
  useEffect(() => {
    if (loading !== undefined) {
      setIsLoading(loading);
    }
  }, [loading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          name={name}
          type="text"
          value={input}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className={inputClassName}
          autoComplete="off"
        />
        
        {/* Clear button */}
        {input && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear selection"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className={dropdownClassName}>
          {isLoading ? (
            <div className="px-3 py-2 text-gray-500 text-sm text-center">
              {loadingText}
            </div>
          ) : options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm text-center">
              {noResultsText}
            </div>
          ) : (
            <ul role="listbox" className="py-1">
              {options.map((option, index) => {
                const normalized = normalizeOption(option);
                return (
                  <li
                    key={`${name}-option-${normalized.value || index}`}
                    role="option"
                    onClick={() => handleOptionSelect(option)}
                    className={optionClassName}
                  >
                    {normalized.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
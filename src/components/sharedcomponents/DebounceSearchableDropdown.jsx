// src/components/SearchableDropdown.js
import React, { useState, useRef, useEffect } from "react";
import { useDebounce } from "./useDebounce";

/**
 * Props:
 *  - name: string
 *  - value: primitive selected value from parent
 *  - onChange: (value) => void
 *  - options: [{ label, value }, ...]
 *  - onSearch: (query) => void
 *  - placeholder, minLength, debounceMs
 */
export default function DebounceSearchableDropdown({
  name,
  value,
  onChange,
  options = [],
  onSearch,
  placeholder = "Search...",
  minLength = 2,
  debounceMs = 300,
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(input, debounceMs);
  const containerRef = useRef(null);

  // reflect parent's selected value (show label if available)
  useEffect(() => {
    const matched = options.find((o) => o.value === value);
    if (matched) setInput(matched.label);
    else if (value === "" || value == null) setInput("");
  }, [value, options]);

  useEffect(() => {
    if (debounced && debounced.length >= minLength) {
      onSearch && onSearch(debounced);

      if (options.length > 0) setOpen(true);
    } else {
      setOpen(false);
    }
  }, [debounced]);

  useEffect(() => {
    if (!options || options.length === 0) setOpen(false);
  }, [options]);

  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function handleSelect(opt) {
    setInput(opt.label);
    onChange && onChange(opt.value);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <input
        name={name}
        type="text"
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => {
          if (options && options.length > 0) setOpen(true);
        }}
        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${name}-listbox`}
      />

      {open && options && options.length > 0 && (
        <ul
          id={`${name}-listbox`}
          role="listbox"
          className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg max-h-56 overflow-auto"
        >
          {options.map((opt, i) => (
            <li
              key={opt.value ?? i}
              role="option"
              onMouseDown={(e) => {
                // ensure selection before input blur
                e.preventDefault();
                handleSelect(opt);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// src/components/DebounceSearchableDropdown.js
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "./useDebounce";

export default function DebounceSearchableDropdown({
  name,
  value,
  onChange,
  options = [],
  onSearch,
  Label = "name",
  Value = "id",
  placeholder = "Search...",
  minLength = 1,
  debounceMs = 300,
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(input, debounceMs);
  const ref = useRef(null);

  // This prevents reopening immediately after a selection
  const justSelectedRef = useRef(false);

  const normalize = (o) => ({
    label: o?.[Label] ?? o?.label ?? "",
    value: o?.[Value] ?? o?.value ?? null,
  });

  // sync input from selected value only when parent explicit value changes
  useEffect(() => {
    const matched = options.map(normalize).find((o) => o.value === value);
    if (matched) setInput(matched.label);
    // if parent clears value, leave input as-is so user can continue typing
  }, [value, options, Label, Value]);

  // call parent with debounced query
  useEffect(() => {
    if (debounced && debounced.length >= minLength) {
      onSearch && onSearch(debounced);
    } else {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // open when options arrive AND the current typed input qualifies
  useEffect(() => {
    const qualifies = debounced && debounced.length >= minLength;
    if (qualifies && options && options.length > 0) {
      // if we just selected an item, skip reopening once
      if (justSelectedRef.current) {
        justSelectedRef.current = false;
        return;
      }
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [options, debounced, minLength]);

  // close when clicking outside
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function handleSelect(o) {
    const n = normalize(o);
    setInput(n.label);
    onChange && onChange(n.value);
    justSelectedRef.current = true; // mark we selected so we won't reopen immediately
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-full">
      <input
        name={name}
        type="text"
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => {
          if (options && options.length > 0 && input.length >= minLength) {
            // don't override the justSelected behavior here
            if (!justSelectedRef.current) setOpen(true);
            else justSelectedRef.current = false;
          }
        }}
      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none  bg-white text-sm"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${name}-listbox`}
      />

      {open && options && options.length > 0 && (
        <ul
          id={`${name}-listbox`}
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-52 overflow-auto"
        >
          {options.map((o, i) => {
            const n = normalize(o);
            return (
              <li
                key={n.value ?? i}
                role="option"
                onMouseDown={(e) => {
                  e.preventDefault(); // ensure selection happens before blur
                  handleSelect(o);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {n.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

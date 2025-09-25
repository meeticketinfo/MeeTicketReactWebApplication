// src/components/DebounceSearchableDropdown.js
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "./useDebounce";

export default function DebounceSearchableDropdown({
  name,
  value,
  onChange,
  options = [],
  onSearch,
  Label = "",
  Value = "",
  placeholder = "Search...",
  minLength = 3,
  debounceMs = 200,
  uniqueId = null,
}) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(input, debounceMs);
  const ref = useRef(null);

  // prevent immediate reopen after selection
  const justSelectedRef = useRef(false);
  const justSelectedTimerRef = useRef(null);

  const normalize = (o) => ({
    label: o?.[Label] ?? o?.label ?? "",
    value: o?.[Value] ?? o?.value ?? null,
  });

  // sync input from selected value only when parent explicit value changes
  const prevValueRef = useRef(value);
  useEffect(() => {
    if (prevValueRef.current !== value) {
      const matched = options.map(normalize).find((o) => o.value === value);
      if (matched) {
        setInput(matched.label);
      } else if (value === null || value === undefined || value === "") {
        setInput("");
      }
      prevValueRef.current = value;
    }
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
      // skip reopening if we just selected an item
      if (justSelectedRef.current) return;
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [options, debounced, minLength]);

  // clear timer on unmount
  useEffect(() => {
    return () => {
      if (justSelectedTimerRef.current) {
        clearTimeout(justSelectedTimerRef.current);
        justSelectedTimerRef.current = null;
      }
    };
  }, []);

  // close when clicking outside — use 'click' so it runs after option onClick
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function handleSelect(o) {
    const n = normalize(o);
    setInput(n.label);
    onChange && onChange(n.value);

    // mark as just selected and prevent immediate reopen
    justSelectedRef.current = true;
    setOpen(false);

    if (justSelectedTimerRef.current) clearTimeout(justSelectedTimerRef.current);
    justSelectedTimerRef.current = setTimeout(() => {
      justSelectedRef.current = false;
      justSelectedTimerRef.current = null;
    }, 250);
  }

  function handleInputChange(e) {
    const newValue = e.target.value;
    setInput(newValue);

    // user typed again — don't consider 'just selected' anymore
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      if (justSelectedTimerRef.current) {
        clearTimeout(justSelectedTimerRef.current);
        justSelectedTimerRef.current = null;
      }
    }

    // If user edits the input and it no longer matches the selected label,
    // clear the parent's value so it can be replaced by a new selection.
    const currentSelected = options.map(normalize).find((o) => o.value === value);
    if (currentSelected && newValue !== currentSelected.label) {
      onChange && onChange(null);
    }
  }

  // Generate unique ID for this dropdown instance
  const dropdownId = uniqueId || `${name}-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${dropdownId}-listbox`;

  return (
    <div ref={ref} className="relative w-full">
      <input
        name={name}
        type="text"
        value={input}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => {
          // only open when there are results and user hasn't just selected
          if (
            options &&
            options.length > 0 &&
            input.length >= minLength &&
            !justSelectedRef.current
          ) {
            setOpen(true);
          }
        }}
        className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-white text-sm"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listboxId}
      />

      {open && options && options.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-52 overflow-auto"
        >
          {options.map((o, i) => {
            const n = normalize(o);
            return (
              <li
                key={`${dropdownId}-${n.value ?? i}`}
                role="option"
                onClick={(e) => {
                  e.stopPropagation(); // avoid bubbling to document click handler
                  handleSelect(o);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs whitespace-nowrap"
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

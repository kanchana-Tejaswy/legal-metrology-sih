import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, Loader2, X } from 'lucide-react';

/**
 * SearchableSelect
 *
 * A government-styled searchable dropdown.
 *
 * Props:
 *   id           {string}   — id for the hidden input (for label association)
 *   options      {string[]|{value,label}[]}  — list of options
 *   value        {string}   — currently selected value
 *   onChange     {fn}       — called with new value string when an option is selected
 *   placeholder  {string}   — placeholder text
 *   disabled     {bool}     — disables the control
 *   loading      {bool}     — shows a spinner
 *   required     {bool}     — marks the field as required
 *   className    {string}   — extra class names for the outer wrapper
 */
export const SearchableSelect = ({
  id,
  options = [],
  value = '',
  onChange,
  placeholder = 'Select...',
  disabled = false,
  loading = false,
  required = false,
  className = ''
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIdx, setHighlightedIdx] = useState(-1);

  const wrapperRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  // Normalise options to { value, label } objects
  const normalised = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Filter by search term
  const filtered = normalised.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Selected label for display
  const selectedLabel = normalised.find(o => o.value === value)?.label || '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
        setHighlightedIdx(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIdx >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-option]');
      items[highlightedIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIdx]);

  const handleToggle = () => {
    if (disabled || loading) return;
    setOpen(prev => !prev);
    if (!open) {
      setSearch('');
      setHighlightedIdx(-1);
    }
  };

  const handleSelect = useCallback((optValue) => {
    onChange(optValue);
    setOpen(false);
    setSearch('');
    setHighlightedIdx(-1);
  }, [onChange]);

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        setOpen(false);
        setSearch('');
        setHighlightedIdx(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIdx(prev => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIdx(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIdx >= 0 && filtered[highlightedIdx]) {
          handleSelect(filtered[highlightedIdx].value);
        }
        break;
      default:
        break;
    }
  };

  const isDisabledState = disabled || loading;

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden native input for required validation */}
      <input
        type="text"
        id={id}
        value={value}
        onChange={() => {}}
        required={required}
        tabIndex={-1}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        readOnly
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isDisabledState}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'w-full px-3 py-2 text-xs border rounded flex items-center justify-between text-left transition',
          'focus:outline-none focus:ring-1 focus:ring-gov-navy',
          isDisabledState
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-white border-slate-300 text-slate-800 hover:border-gov-navy cursor-pointer',
          open ? 'border-gov-navy ring-1 ring-gov-navy' : ''
        ].join(' ')}
      >
        <span className={selectedLabel ? 'text-slate-800 font-medium' : 'text-slate-400'}>
          {loading ? 'Loading...' : (selectedLabel || placeholder)}
        </span>
        <span className="flex items-center gap-1 ml-2 flex-shrink-0">
          {value && !isDisabledState && (
            <span
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
              title="Clear selection"
            >
              <X size={11} />
            </span>
          )}
          {loading
            ? <Loader2 size={14} className="text-slate-400 animate-spin" />
            : <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          }
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded shadow-lg overflow-hidden"
          role="listbox"
        >
          {/* Search box */}
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
            <div className="flex items-center gap-1.5 px-2 py-1.5 border border-slate-300 rounded focus-within:border-gov-navy focus-within:ring-1 focus-within:ring-gov-navy bg-white">
              <Search size={12} className="text-slate-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setHighlightedIdx(0); }}
                placeholder="Type to search..."
                className="flex-1 text-xs border-none outline-none bg-transparent text-slate-800 placeholder-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setHighlightedIdx(-1); searchRef.current?.focus(); }}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <ul
            ref={listRef}
            className="max-h-52 overflow-y-auto py-1"
            role="listbox"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-xs text-slate-400 text-center italic">
                No results found for &ldquo;{search}&rdquo;
              </li>
            ) : (
              filtered.map((opt, idx) => (
                <li
                  key={opt.value}
                  data-option=""
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => handleSelect(opt.value)}
                  className={[
                    'px-3 py-2 text-xs cursor-pointer transition flex items-center gap-2',
                    opt.value === value
                      ? 'bg-gov-navy text-white font-semibold'
                      : idx === highlightedIdx
                        ? 'bg-blue-50 text-gov-navy'
                        : 'text-slate-700 hover:bg-slate-50'
                  ].join(' ')}
                >
                  {opt.value === value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  )}
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

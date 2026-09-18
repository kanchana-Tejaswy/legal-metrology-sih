import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox, Loader2 } from 'lucide-react';

export const DataTable = ({
  columns,
  data = [],
  loading = false,
  searchPlaceholder = 'Search records...',
  filterComponent,
  pageSize = 10,
  keyField = 'id'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(item).some((val) => {
      if (typeof val === 'string' || typeof val === 'number') {
        return String(val).toLowerCase().includes(term);
      }
      return false;
    });
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-card overflow-hidden">
      {/* Search and Filters Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-navy focus:border-gov-navy transition shadow-2xs"
          />
        </div>

        {filterComponent && <div className="w-full sm:w-auto">{filterComponent}</div>}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="gov-table">
          <thead className="sticky top-0 z-10 shadow-xs">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`${col.className || ''} text-white`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="skeleton-shimmer">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx}>
                      <div className="h-4 bg-slate-200/80 rounded-md w-3/4 my-1"></div>
                      {cIdx === 0 && <div className="h-3 bg-slate-100 rounded-md w-1/2 mt-1"></div>}
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10 text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Inbox size={22} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">No matching records found in official registry</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr key={row[keyField] || rIdx}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`${col.cellClassName || ''} tabular-nums`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:px-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-2">
        <div className="tabular-nums">
          {loading
            ? <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin text-gov-navy" /> Querying registry...</span>
            : <>Showing <span className="font-semibold text-slate-800">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to{' '}
              <span className="font-semibold text-slate-800">{Math.min(startIndex + pageSize, filteredData.length)}</span> of <span className="font-semibold text-slate-800">{filteredData.length}</span> entries</>
          }
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            aria-label="Previous page"
            className="p-1.5 rounded-md border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 transition btn-tactile focus:outline-none focus:ring-1 focus:ring-gov-navy"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="font-semibold text-slate-800 tabular-nums px-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            aria-label="Next page"
            className="p-1.5 rounded-md border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 transition btn-tactile focus:outline-none focus:ring-1 focus:ring-gov-navy"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

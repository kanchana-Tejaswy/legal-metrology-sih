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

      {/* Mobile Card View (screen width < sm) */}
      <div className="sm:hidden divide-y divide-slate-100 max-h-[600px] overflow-y-auto touch-scroll bg-slate-50/40">
        {loading ? (
          Array.from({ length: 4 }).map((_, rIdx) => (
            <div key={rIdx} className="p-4 space-y-2.5 skeleton-shimmer bg-white">
              <div className="h-4 bg-slate-200/80 rounded w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-2/3"></div>
            </div>
          ))
        ) : paginatedData.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2">
              <Inbox size={20} />
            </div>
            <span className="text-xs font-medium text-slate-600">No matching records found</span>
          </div>
        ) : (
          paginatedData.map((row, rIdx) => (
            <div key={row[keyField] || rIdx} className="p-4 space-y-2.5 bg-white border-b border-slate-100 last:border-none">
              {columns.map((col, cIdx) => {
                const content = col.render ? col.render(row) : row[col.accessor];
                const isAction = col.header?.toLowerCase().includes('action');
                if (isAction) {
                  return (
                    <div key={cIdx} className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      {content}
                    </div>
                  );
                }
                return (
                  <div key={cIdx} className="flex justify-between items-start text-xs gap-3">
                    <span className="text-slate-500 font-semibold text-[11px] flex-shrink-0 uppercase tracking-wider">
                      {col.header}:
                    </span>
                    <div className="text-right text-slate-800 flex-1 flex justify-end">
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Desktop / Tablet Table Content */}
      <div className="hidden sm:block overflow-x-auto max-h-[600px] overflow-y-auto touch-scroll">
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
      <div className="p-3 sm:px-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 gap-2.5">
        <div className="tabular-nums text-center sm:text-left">
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
            className="p-2 sm:p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 transition btn-tactile focus:outline-none focus:ring-1 focus:ring-gov-navy min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-semibold text-slate-800 tabular-nums px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            aria-label="Next page"
            className="p-2 sm:p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-100 transition btn-tactile focus:outline-none focus:ring-1 focus:ring-gov-navy min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

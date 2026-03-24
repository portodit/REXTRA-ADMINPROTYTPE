import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RextraTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  itemsPerPageOptions?: number[];
}

export function RextraTablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50],
}: RextraTablePaginationProps) {
  if (totalPages <= 0) return null;

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const navBtnClass =
    "flex flex-col w-8 h-8 items-center justify-center gap-2.5 p-2.5 bg-white rounded-lg border border-solid border-[#f1f1f1] disabled:opacity-40 transition-colors";

  return (
    <nav
      className="flex items-center gap-[5px] px-5 sm:px-6 py-4"
      aria-label="Pagination"
    >
      {/* Page navigation - left */}
      <div className="flex flex-col flex-1 items-start gap-2.5">
        <ul className="inline-flex items-center gap-[5px]">
          {/* First */}
          <li>
            <button
              className={navBtnClass}
              aria-label="First page"
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          </li>
          {/* Previous */}
          <li>
            <button
              className={navBtnClass}
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </li>

          {/* Page numbers */}
          {getPageNumbers().map((page, idx) =>
            page === "ellipsis" ? (
              <li key={`ellipsis-${idx}`}>
                <div className="w-8 h-8 items-center justify-center gap-2.5 p-2.5 bg-white rounded-lg flex flex-col">
                  <span className="font-semibold text-[13px] text-[#333333] leading-normal">
                    ...
                  </span>
                </div>
              </li>
            ) : (
              <li key={page}>
                <button
                  className={cn(
                    "flex flex-col w-8 h-8 items-center justify-center gap-2.5 p-2.5 rounded-lg transition-colors",
                    page === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border border-solid border-[#f1f1f1] text-[#333333]"
                  )}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => onPageChange(page)}
                >
                  <span
                    className={cn(
                      "text-xs font-semibold leading-[155%] whitespace-nowrap",
                      page === currentPage ? "text-white" : "text-[#333333]"
                    )}
                  >
                    {page}
                  </span>
                </button>
              </li>
            )
          )}

          {/* Next */}
          <li>
            <button
              className={navBtnClass}
              aria-label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </li>
          {/* Last */}
          <li>
            <button
              className={navBtnClass}
              aria-label="Last page"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </div>

      {/* Items per page - right */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="items-per-page"
          className="text-sm font-medium text-foreground whitespace-nowrap"
        >
          Halaman
        </label>
        <div className="relative flex h-[42px] items-center gap-1 px-[15px] py-2 bg-white rounded-lg border border-solid border-border">
          <select
            id="items-per-page"
            className="text-sm font-normal text-foreground cursor-pointer appearance-none bg-transparent pr-4 outline-none"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            aria-label="Items per page"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-foreground pointer-events-none absolute right-2" />
        </div>
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          dari {totalItems.toLocaleString("id-ID")}
        </span>
      </div>
    </nav>
  );
}

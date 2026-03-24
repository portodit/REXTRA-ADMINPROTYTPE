/**
 * REXTRA Shared Component Library
 *
 * Folder structure (matching Figma Component UI library):
 *
 *  shared/
 *  ├── badges/
 *  │   └── StatusBadge.tsx       — Selesai / Berjalan / Dihentikan badges
 *  ├── buttons/
 *  │   └── ActionButtons.tsx     — HapusButton, ResetFilterButton, FilterButton,
 *  │                               TerapkanFilterButton, ExportButton, NextPageButton
 *  ├── table/
 *  │   └── TabBar.tsx            — Status tab toggle row (Semua Data / Selesai / ...)
 *  ├── BulkDeleteDialog.tsx      — Bulk delete confirmation dialog
 *  ├── SingleDeleteDialog.tsx    — Single item delete confirmation dialog
 *  ├── ExportDataDialog.tsx      — Export data dialog
 *  ├── RextraTableHeader.tsx     — Standard table header with title + actions
 *  └── RextraTablePagination.tsx — Table pagination component
 *
 *  ui/                           — shadcn base primitives (Button, Input, Checkbox, etc.)
 *  layout/                       — AppSidebar, DashboardLayout, TopNavbar, NavLink
 *  form/                         — Form field components (LabelText, FormInput, HelperText)
 */

export { StatusBadge } from './badges/StatusBadge'
export type { StatusValue } from './badges/StatusBadge'

export {
  HapusButton,
  ResetFilterButton,
  FilterButton,
  TerapkanFilterButton,
  ExportButton,
  NextPageButton,
} from './buttons/ActionButtons'

export { TabBar } from './table/TabBar'

export { RextraTablePagination } from './RextraTablePagination'
export { RextraTableHeader } from './RextraTableHeader'
export { BulkDeleteDialog } from './BulkDeleteDialog'
export { SingleDeleteDialog } from './SingleDeleteDialog'
export { ExportDataDialog } from './ExportDataDialog'

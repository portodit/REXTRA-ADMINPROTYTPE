/**
 * REXTRA Shared Component Library
 *
 * Folder structure (matching Figma "Tabel" design page):
 *
 *  shared/
 *  ├── badges/
 *  │   ├── StatusBadge.tsx       — Selesai / Berjalan / Dihentikan (test completion)
 *  │   └── ActiveBadge.tsx       — Aktif / Nonaktif (item/feature active status)
 *  ├── buttons/
 *  │   └── ActionButtons.tsx     — HapusButton, ResetFilterButton, FilterButton,
 *  │                               TerapkanFilterButton, ExportButton, NextPageButton
 *  ├── cards/
 *  │   └── ContentCard.tsx       — Hoverable content card (Container Content large)
 *  ├── table/
 *  │   ├── TabBar.tsx            — Status tab toggle row (Default togle / segmented control)
 *  │   └── ExpandableInfoRow.tsx — Collapsible info section (Dropdown Info large)
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

export { ActiveBadge } from './badges/ActiveBadge'

export {
  HapusButton,
  ResetFilterButton,
  FilterButton,
  TerapkanFilterButton,
  ExportButton,
  NextPageButton,
} from './buttons/ActionButtons'

export { TabBar } from './table/TabBar'
export { ExpandableInfoRow } from './table/ExpandableInfoRow'

export { ContentCard } from './cards/ContentCard'

export { RextraTablePagination } from './RextraTablePagination'
export { RextraTableHeader } from './RextraTableHeader'
export { BulkDeleteDialog } from './BulkDeleteDialog'
export { SingleDeleteDialog } from './SingleDeleteDialog'
export { ExportDataDialog } from './ExportDataDialog'

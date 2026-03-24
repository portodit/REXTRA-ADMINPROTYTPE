/**
 * REXTRA Design System — Component Library
 *
 * Matches the REXTRA Figma design system (files: REXTRA NEW 2025 + Dashboard REXTRA).
 *
 * Folder structure:
 *
 *  design-system/
 *  ├── badges/
 *  │   ├── StatusBadge.tsx         — Selesai / Berjalan / Dihentikan (test completion)
 *  │   ├── ActiveBadge.tsx         — Aktif / Nonaktif (item/feature active status)
 *  │   ├── ColorBadge.tsx          — Generic colored badge (Orange/Green/red/blue light/Disabled)
 *  │   ├── RiasecLetterBadge.tsx   — RIASEC letter tiles (R/I/A/S/E/C) with unique colors
 *  │   ├── BubbleNumber.tsx        — Small ranked number bubble (green/blue/orange/gray)
 *  │   ├── KategoriChip.tsx        — Career category inline chip with icon (Bisnis/Teknologi/...)
 *  │   ├── KategoriLabel.tsx       — Colored career category pill with icon
 *  │   ├── PriorityLabel.tsx       — Dianjurkan / Wajib / Umum Digunakan
 *  │   └── TipePendidikanBadge.tsx — Bootcamp / Sertifikasi / Kursus / Gaji (salary)
 *  ├── buttons/
 *  │   └── ActionButtons.tsx       — HapusButton, ResetFilterButton, FilterButton,
 *  │                                  TerapkanFilterButton, ExportButton, NextPageButton
 *  ├── cards/
 *  │   └── ContentCard.tsx         — Hoverable content card (Container Content large)
 *  ├── chips/
 *  │   └── ChipData.tsx            — Chip/tag with optional PriorityLabel and remove button
 *  ├── table/
 *  │   ├── TabBar.tsx              — Status tab toggle row (Semua Data / Selesai / ...)
 *  │   └── ExpandableInfoRow.tsx   — Collapsible info section (Dropdown Info large)
 *  ├── BulkDeleteDialog.tsx        — Bulk delete confirmation dialog
 *  ├── SingleDeleteDialog.tsx      — Single item delete confirmation dialog
 *  ├── ExportDataDialog.tsx        — Export data dialog
 *  ├── RextraTableHeader.tsx       — Standard table header with title + actions
 *  └── RextraTablePagination.tsx   — Table pagination component
 *
 *  ui/     — shadcn base primitives (Button, Input, Checkbox, etc.)
 *  layout/ — AppSidebar, DashboardLayout, TopNavbar, NavLink
 *  form/   — Form field components (LabelText, FormInput, HelperText)
 */

/* ── Badges ─────────────────────────────────────────────── */
export { StatusBadge } from './badges/StatusBadge'
export type { StatusValue } from './badges/StatusBadge'

export { ActiveBadge } from './badges/ActiveBadge'

export { ColorBadge } from './badges/ColorBadge'

export { RiasecLetterBadge } from './badges/RiasecLetterBadge'

export { BubbleNumber } from './badges/BubbleNumber'

export { KategoriChip } from './badges/KategoriChip'
export type { KategoriValue } from './badges/KategoriChip'

export { KategoriLabel } from './badges/KategoriLabel'

export { PriorityLabel } from './badges/PriorityLabel'

export { TipePendidikanBadge } from './badges/TipePendidikanBadge'

/* ── Buttons ─────────────────────────────────────────────── */
export {
  HapusButton,
  ResetFilterButton,
  FilterButton,
  TerapkanFilterButton,
  ExportButton,
  NextPageButton,
} from './buttons/ActionButtons'

/* ── Cards ──────────────────────────────────────────────── */
export { ContentCard } from './cards/ContentCard'

/* ── Chips ──────────────────────────────────────────────── */
export { ChipData } from './chips/ChipData'

/* ── Table ──────────────────────────────────────────────── */
export { TabBar } from './table/TabBar'
export { ExpandableInfoRow } from './table/ExpandableInfoRow'

/* ── Dialogs & Table chrome ─────────────────────────────── */
export { RextraTablePagination } from './RextraTablePagination'
export { RextraTableHeader } from './RextraTableHeader'
export { BulkDeleteDialog } from './BulkDeleteDialog'
export { SingleDeleteDialog } from './SingleDeleteDialog'
export { ExportDataDialog } from './ExportDataDialog'

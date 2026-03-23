---
title: 'Brief Modul Admin — persona_admin (Baru)'
---

# Brief Modul: `internal/modules/persona/` (Admin Side)
## Backend Implementation Guide — Persona REXTRA (Admin Panel)

---

> **Modul:** `internal/modules/persona/` — file Go prefix `admin_`
> **Tipe:** Admin-facing only
> **Status:** Buat baru (tidak ada implementasi lama)
> **Dibuat oleh:** Tim Product
> **Versi:** 1.0 — Maret 2026
> **Prerequisite:** Sudah baca `Brief_Entity_Persona_REXTRA.md` (v2.0) dan `Brief Modul User — persona.md`

---

## ⚠️ Catatan Penting Sebelum Mulai

**Modul admin dan user berada di folder yang sama** (`internal/modules/persona/`) tapi file Go-nya terpisah. Admin controller menggunakan prefix `admin_`, routes admin menggunakan prefix path `/api/v1/admin/persona/...` dan middleware `AdminAuthenticate()`.

**Repository yang shared antara user dan admin:**

| Repository | User | Admin |
|---|---|---|
| `phase_master_repository.go` | Read only | CRUD |
| `mission_master_repository.go` | Read only | CRUD |
| `mission_feature_map_repository.go` | Tidak pakai langsung | CRUD |
| `user_persona_profile_repository.go` | CRUD | Read only |
| `user_persona_mission_progress_repository.go` | CRUD | Read only |
| `user_persona_transition_history_repository.go` | Create (append) | Read only |

---

## Daftar Isi

- [A. Gambaran Fitur Admin](#a-gambaran-fitur-admin)
- [B. Tab 1 — Konfigurasi Journey: Screen & Endpoint](#b-tab-1--konfigurasi-journey-screen--endpoint)
- [C. Tab 2 — Journey Pengguna: Screen & Endpoint](#c-tab-2--journey-pengguna-screen--endpoint)
- [D. Daftar Endpoint Lengkap](#d-daftar-endpoint-lengkap)
- [E. DTO Request & Response](#e-dto-request--response)
- [F. Repository Layer (Tambahan Admin)](#f-repository-layer-tambahan-admin)
- [G. Service Layer](#g-service-layer)
- [H. Controller & Routes](#h-controller--routes)
- [I. Aturan Bisnis Penting](#i-aturan-bisnis-penting)
- [J. Checklist Implementasi](#j-checklist-implementasi)

---

## A. Gambaran Fitur Admin

Halaman admin Persona REXTRA punya **2 tab utama** dalam satu halaman:

| Tab | Fungsi |
|---|---|
| **Tab 1: Konfigurasi Journey** | Kelola master data — fase, misi, mapping fitur, pengaturan global |
| **Tab 2: Journey Pengguna** | Monitoring — pantau progress, persona aktif, dan detail journey per user |

**Prinsip penting yang harus dipegang:**
- Perubahan master data **hanya berlaku untuk journey baru** yang belum terbentuk
- Snapshot journey user yang sudah ada (`UserPersonaMissionProgress`) **tidak berubah otomatis**
- Admin tidak bisa ubah `initial_phase_id` user — itu hasil profiling yang immutable
- Hapus misi hanya boleh jika **belum dipakai user** — jika sudah dipakai, arahkan ke Nonaktifkan

---

## B. Tab 1 — Konfigurasi Journey: Screen & Endpoint

### B.1 Pemetaan Screen ke Endpoint

| Screen | Deskripsi | Endpoint yang Dipanggil |
|---|---|---|
| **Screen 1** | Halaman utama — semua persona tampil (default) | `GET /admin/persona/missions?group_by=phase` |
| **Screen 2** | Filter persona aktif (Pathfinder/Builder/Achiever) | `GET /admin/persona/missions?phase_code=PATHFINDER` |
| **Screen 3** | Card Persona — Expanded (daftar misi tampil) | Sudah di response Screen 1 (sudah include misi) |
| **Screen 4** | Card Persona — Collapsed | Client-side state, tidak butuh endpoint baru |
| **Screen 5** | Drawer Tambah Misi | `POST /admin/persona/missions` |
| **Screen 6** | Drawer Edit Misi | `GET /admin/persona/missions/:id` + `PUT /admin/persona/missions/:id` |
| **Screen 7** | Modal Preview Journey | `GET /admin/persona/journey-preview` |
| **Screen 8** | Modal Konfirmasi Hapus Misi | `DELETE /admin/persona/missions/:id` |
| **Screen 9** | Modal Konfirmasi Nonaktifkan Misi | `PUT /admin/persona/missions/:id/deactivate` |
| **Screen 10** | Modal Atur Urutan Misi | `PUT /admin/persona/missions/:id` (field sequence_no) |
| **Screen 11** | Loading / Skeleton | Client-side |
| **Screen 12** | Toast sukses | Client-side |
| **Screen 13** | Empty state — belum ada misi | Response kosong dari `GET /admin/persona/missions` |
| **Screen 14** | Empty state — filter tidak ditemukan | Response kosong dari `GET /admin/persona/missions` |
| **Screen 15** | Error state — konflik urutan/kode duplikat | Error response dari `POST` atau `PUT` |
| *(tambahan)* | Drawer — Daftar User per Misi | `GET /admin/persona/missions/:id/users` |
| *(tambahan)* | Drawer — Edit Pengaturan Global | `GET /admin/persona/settings` + `PUT /admin/persona/settings` |
| *(tambahan)* | Drawer — Duplikat Misi (prefilled) | `GET /admin/persona/missions/:id` (prefill data) + `POST /admin/persona/missions` |
| *(tambahan)* | Drawer — Kelola Feature Map per Misi | `POST/PUT/DELETE /admin/persona/missions/:id/feature-maps` |

---

### B.2 Alur Kelola Misi (Flow Utama Tab 1)

```
[Admin buka Tab Konfigurasi Journey]
  → GET /admin/persona/missions?group_by=phase
  → Tampil 3 card persona (Pathfinder, Builder, Achiever) masing-masing collapsed
  → Setiap card: nama fase, jumlah misi total, jumlah REQUIRED, jumlah RECOMMENDED

[Admin expand card Pathfinder]
  → Data sudah ada di response sebelumnya (include misi per fase)
  → Tampil tabel misi: urutan, kode, nama, fitur tujuan, kategori, reward, auto-pass, status, "digunakan X user"

[Admin klik "+ Tambah Misi ke Persona Ini"]
  → Buka Drawer Tambah Misi (persona owner sudah prefilled)
  → Admin isi: kode, nama, deskripsi, urutan, kategori, reward, status, fitur tujuan
  → Jika urutan bentrok → service return preview auto-shift sebelum save
  → Submit → POST /admin/persona/missions
  → Toast sukses → refresh daftar misi

[Admin klik "Edit" pada sebuah misi]
  → GET /admin/persona/missions/:id (load data lengkap + feature maps)
  → Buka Drawer Edit Misi
  → Jika misi sudah dipakai user → tampil warning + field sensitif dibatasi
  → Submit → PUT /admin/persona/missions/:id

[Admin klik "Duplikat"]
  → GET /admin/persona/missions/:id (prefill data)
  → Buka Drawer Tambah Misi dalam mode prefilled
  → Kode otomatis jadi "{KODE_ASAL}_COPY", urutan paling bawah, status = INACTIVE
  → Submit → POST /admin/persona/missions

[Admin klik "Nonaktifkan"]
  → Modal konfirmasi — tampil jumlah user yang sudah pakai misi ini
  → Konfirm → PUT /admin/persona/missions/:id/deactivate

[Admin klik "Hapus"]
  → Backend cek: apakah ada UserPersonaMissionProgress untuk misi ini?
  → Jika belum ada user → Modal konfirmasi hapus biasa → DELETE /admin/persona/missions/:id
  → Jika sudah ada user → Modal warning berat → arahkan ke Nonaktifkan

[Admin klik "Preview Journey"]
  → GET /admin/persona/journey-preview
  → Modal tampil 3 simulasi: jika awal Pathfinder, Builder, Achiever
  → Tampil komposisi misi REQUIRED vs RECOMMENDED per skenario

[Admin klik angka "Digunakan oleh X User" pada kolom]
  → GET /admin/persona/missions/:id/users
  → Drawer kanan: daftar user + status misi mereka + CTA "Lihat Journey"
```

---

## C. Tab 2 — Journey Pengguna: Screen & Endpoint

### C.1 Pemetaan Screen ke Endpoint

| Screen | Deskripsi | Endpoint |
|---|---|---|
| **Stat Cards** | Total user journey, per persona, selesai, tertahan | `GET /admin/persona/users/stats` |
| **Tabel utama** | Daftar user dengan journey + filter + pagination | `GET /admin/persona/users` |
| **Drawer detail user** | Ringkasan + progress + transisi + daftar misi user | `GET /admin/persona/users/:user_id/journey` |

### C.2 Alur Monitoring Journey (Flow Utama Tab 2)

```
[Admin buka Tab Journey Pengguna]
  → GET /admin/persona/users/stats
  → Tampil stat cards: total, per persona, selesai, tertahan

  → GET /admin/persona/users
  → Tampil tabel: nama, persona awal, persona aktif, status, progress, tanggal tes

[Admin filter + search]
  → GET /admin/persona/users?persona_initial=ACHIEVER&status=ACTIVE&search=budi
  → Tabel terupdate

[Admin klik "Lihat Detail" pada satu user]
  → GET /admin/persona/users/:user_id/journey
  → Buka Drawer Detail Journey:
      Section A — Identitas user + status journey
      Section B — Progress: REQUIRED selesai / total, misi RECOMMENDED selesai
      Section C — Timeline riwayat transisi fase (dari UserPersonaTransitionHistory)
      Section D — Tabel misi: nama, fase, effective_category, status, tanggal selesai,
                  reward_expected vs reward_granted
      Section E — Hasil profiling (jawaban Q1/Q2/Q3 + persona awal)

[Dari Drawer Detail, admin klik "Lihat Journey" pada baris misi tertentu]
  → Sudah ada di data yang sama — highlight misi terkait (client-side)
  atau
  → Jika dari kolom "Digunakan X User" di Tab 1 → redirect ke Tab 2 + filter user terkait
```

---

## D. Daftar Endpoint Lengkap

### Tab 1 — Konfigurasi Journey

| Method | Path | Handler | Keterangan |
|---|---|---|---|
| `GET` | `/api/v1/admin/persona/missions` | `GetMissions` | List misi dengan group_by=phase + filter |
| `POST` | `/api/v1/admin/persona/missions` | `CreateMission` | Buat misi baru |
| `GET` | `/api/v1/admin/persona/missions/:id` | `GetMissionDetail` | Detail misi + feature maps |
| `PUT` | `/api/v1/admin/persona/missions/:id` | `UpdateMission` | Update misi (+ auto-shift sequence jika konflik) |
| `PUT` | `/api/v1/admin/persona/missions/:id/deactivate` | `DeactivateMission` | Nonaktifkan misi |
| `DELETE` | `/api/v1/admin/persona/missions/:id` | `DeleteMission` | Hapus misi (guard: belum dipakai user) |
| `GET` | `/api/v1/admin/persona/missions/:id/users` | `GetMissionUsers` | Daftar user yang memakai misi ini |
| `POST` | `/api/v1/admin/persona/missions/:id/feature-maps` | `AddFeatureMap` | Tambah mapping fitur ke misi |
| `PUT` | `/api/v1/admin/persona/missions/:id/feature-maps/:fmId` | `UpdateFeatureMap` | Update mapping fitur |
| `DELETE` | `/api/v1/admin/persona/missions/:id/feature-maps/:fmId` | `DeleteFeatureMap` | Hapus mapping fitur |
| `GET` | `/api/v1/admin/persona/journey-preview` | `PreviewJourney` | Simulasi journey per persona awal |
| `GET` | `/api/v1/admin/persona/phases` | `GetPhases` | List semua fase (Pathfinder/Builder/Achiever) |
| `GET` | `/api/v1/admin/persona/settings` | `GetSettings` | Ambil pengaturan global journey |
| `PUT` | `/api/v1/admin/persona/settings` | `UpdateSettings` | Update pengaturan global journey |

### Tab 2 — Journey Pengguna

| Method | Path | Handler | Keterangan |
|---|---|---|---|
| `GET` | `/api/v1/admin/persona/users/stats` | `GetJourneyStats` | Stat cards ringkasan |
| `GET` | `/api/v1/admin/persona/users` | `GetJourneyUsers` | List user + filter + pagination |
| `GET` | `/api/v1/admin/persona/users/:userId/journey` | `GetUserJourneyDetail` | Detail lengkap journey satu user |

---

## E. DTO Request & Response

### E.1 Request

**File:** `internal/dto/request/persona_admin_dto_request.go`

```go
package dto_request

// CreateMissionRequest — payload buat misi baru.
type CreateMissionRequest struct {
    PhaseCode       string `json:"phase_code" binding:"required"`        // "PATHFINDER" / "BUILDER" / "ACHIEVER"
    MissionCode     string `json:"mission_code" binding:"required"`
    Title           string `json:"title" binding:"required"`
    Description     string `json:"description"`
    SequenceNo      int    `json:"sequence_no" binding:"required,min=1"`
    DefaultCategory string `json:"default_category" binding:"required,oneof=REQUIRED RECOMMENDED"`
    RewardPoint     int    `json:"reward_point" binding:"min=0"`
    IsBlocking      bool   `json:"is_blocking"`
    IsAutoPass      bool   `json:"is_auto_pass"`
    AutoPassRule    string `json:"auto_pass_rule"`   // JSON string, opsional
    Status          string `json:"status" binding:"required,oneof=ACTIVE INACTIVE"`
}

// UpdateMissionRequest — payload update misi. Semua field opsional kecuali yang eksplisit.
type UpdateMissionRequest struct {
    Title           *string `json:"title"`
    Description     *string `json:"description"`
    SequenceNo      *int    `json:"sequence_no"`
    DefaultCategory *string `json:"default_category" binding:"omitempty,oneof=REQUIRED RECOMMENDED"`
    RewardPoint     *int    `json:"reward_point"`
    IsBlocking      *bool   `json:"is_blocking"`
    IsAutoPass      *bool   `json:"is_auto_pass"`
    AutoPassRule    *string `json:"auto_pass_rule"`
    Status          *string `json:"status" binding:"omitempty,oneof=ACTIVE INACTIVE"`
}

// AddFeatureMapRequest — payload tambah mapping fitur ke misi.
type AddFeatureMapRequest struct {
    FeatureCode    string `json:"feature_code" binding:"required"`
    EntitlementKey string `json:"entitlement_key" binding:"required"`
    AccessLabel    string `json:"access_label" binding:"required,oneof=BEBAS AKSES_TOKEN AKSES_TERBATAS"`
    CompletionRule string `json:"completion_rule"` // JSON string, opsional
    DisplayOrder   int    `json:"display_order" binding:"min=1"`
    IsPrimary      bool   `json:"is_primary"`
}

// UpdateFeatureMapRequest — payload update mapping fitur.
type UpdateFeatureMapRequest struct {
    EntitlementKey *string `json:"entitlement_key"`
    AccessLabel    *string `json:"access_label" binding:"omitempty,oneof=BEBAS AKSES_TOKEN AKSES_TERBATAS"`
    CompletionRule *string `json:"completion_rule"`
    DisplayOrder   *int    `json:"display_order"`
    IsPrimary      *bool   `json:"is_primary"`
}

// UpdateSettingsRequest — payload update pengaturan global journey.
type UpdateSettingsRequest struct {
    AutoPassEnabled          *bool `json:"auto_pass_enabled"`
    SequentialTransition     *bool `json:"sequential_transition"`
    ShowPreviousMissionsAsRecommended *bool `json:"show_previous_missions_as_recommended"`
}

// GetMissionsQuery — query params untuk list misi.
type GetMissionsQuery struct {
    PhaseCode string `form:"phase_code"`                          // filter by phase
    Category  string `form:"category"`                            // REQUIRED / RECOMMENDED
    Status    string `form:"status"`                              // ACTIVE / INACTIVE
    Search    string `form:"search"`                              // search nama/kode/fitur
    GroupBy   string `form:"group_by"`                            // "phase" untuk group by persona
}

// GetJourneyUsersQuery — query params untuk list user journey.
type GetJourneyUsersQuery struct {
    PersonaInitial string `form:"persona_initial"` // PATHFINDER / BUILDER / ACHIEVER
    PersonaActive  string `form:"persona_active"`
    Status         string `form:"status"`          // ACTIVE / COMPLETED / dll
    DateFrom       string `form:"date_from"`
    DateTo         string `form:"date_to"`
    Search         string `form:"search"`           // nama / email / NIM
    Page           int    `form:"page,default=1"`
    Limit          int    `form:"limit,default=20"`
    SortBy         string `form:"sort_by"`          // "latest" / "progress_high" / "progress_low"
}
```

### E.2 Response

**File:** `internal/dto/response/persona_admin_dto_response.go`

```go
package dto_response

// --- Komponen bersama ---

type AdminMissionFeatureMapItem struct {
    ID             string `json:"id"`
    FeatureCode    string `json:"feature_code"`
    EntitlementKey string `json:"entitlement_key"`
    AccessLabel    string `json:"access_label"`
    IsPrimary      bool   `json:"is_primary"`
    DisplayOrder   int    `json:"display_order"`
    CompletionRule string `json:"completion_rule,omitempty"`
}

type AdminMissionItem struct {
    ID              string                       `json:"id"`
    PhaseCode       string                       `json:"phase_code"`
    PhaseName       string                       `json:"phase_name"`
    MissionCode     string                       `json:"mission_code"`
    Title           string                       `json:"title"`
    Description     string                       `json:"description"`
    SequenceNo      int                          `json:"sequence_no"`
    DefaultCategory string                       `json:"default_category"`
    RewardPoint     int                          `json:"reward_point"`
    IsBlocking      bool                         `json:"is_blocking"`
    IsAutoPass      bool                         `json:"is_auto_pass"`
    AutoPassRule    string                       `json:"auto_pass_rule,omitempty"`
    Status          string                       `json:"status"`
    UserCount       int                          `json:"user_count"`   // jumlah user yang memakai misi ini
    FeatureMaps     []AdminMissionFeatureMapItem `json:"feature_maps"`
    CreatedAt       string                       `json:"created_at"`
    UpdatedAt       string                       `json:"updated_at"`
}

type AdminPhaseGroup struct {
    PhaseID          string             `json:"phase_id"`
    PhaseCode        string             `json:"phase_code"`
    PhaseName        string             `json:"phase_name"`
    PhaseOrder       int                `json:"phase_order"`
    TotalMissions    int                `json:"total_missions"`
    RequiredCount    int                `json:"required_count"`
    RecommendedCount int                `json:"recommended_count"`
    Missions         []AdminMissionItem `json:"missions"`
}

// --- Response per endpoint ---

// GetMissionsResponse — response GET /admin/persona/missions
// Jika group_by=phase, missions diisi per AdminPhaseGroup.
// Jika tidak, missions diisi sebagai flat list.
type GetMissionsResponse struct {
    Phases   []AdminPhaseGroup  `json:"phases,omitempty"`   // jika group_by=phase
    Missions []AdminMissionItem `json:"missions,omitempty"` // jika flat
    Total    int                `json:"total"`
}

// SequenceShiftPreview — preview auto-shift saat konflik urutan.
type SequenceShiftPreview struct {
    MissionCode    string `json:"mission_code"`
    Title          string `json:"title"`
    OldSequenceNo  int    `json:"old_sequence_no"`
    NewSequenceNo  int    `json:"new_sequence_no"`
}

// CreateMissionResponse — response POST /admin/persona/missions
type CreateMissionResponse struct {
    Mission      AdminMissionItem       `json:"mission"`
    ShiftPreview []SequenceShiftPreview `json:"shift_preview,omitempty"` // jika terjadi auto-shift
}

// JourneyPreviewMission — representasi misi dalam preview journey
type JourneyPreviewMission struct {
    MissionCode       string `json:"mission_code"`
    Title             string `json:"title"`
    SequenceNo        int    `json:"sequence_no"`
    EffectiveCategory string `json:"effective_category"` // berdasarkan simulasi
    PhaseCode         string `json:"phase_code"`
    IsBlocking        bool   `json:"is_blocking"`
}

// JourneyPreviewScenario — satu skenario preview (misal: jika persona awal = Achiever)
type JourneyPreviewScenario struct {
    InitialPersonaCode  string                  `json:"initial_persona_code"`
    InitialPersonaName  string                  `json:"initial_persona_name"`
    RequiredCount       int                     `json:"required_count"`
    RecommendedCount    int                     `json:"recommended_count"`
    Missions            []JourneyPreviewMission `json:"missions"`
}

// PreviewJourneyResponse — response GET /admin/persona/journey-preview
type PreviewJourneyResponse struct {
    Scenarios []JourneyPreviewScenario `json:"scenarios"` // 3 skenario (Pathfinder/Builder/Achiever)
}

// --- Tab Journey Pengguna ---

type JourneyStatsResponse struct {
    TotalUsersWithJourney int `json:"total_users_with_journey"`
    PathfinderCount       int `json:"pathfinder_count"`
    BuilderCount          int `json:"builder_count"`
    AchieverCount         int `json:"achiever_count"`
    CompletedCount        int `json:"completed_count"`
    StagnantCount         int `json:"stagnant_count"` // aktif tapi lama tidak progress
}

type JourneyUserRow struct {
    UserID            string  `json:"user_id"`
    Name              string  `json:"name"`
    Email             string  `json:"email"`
    InitialPersona    string  `json:"initial_persona"`
    ActivePersona     string  `json:"active_persona"`
    JourneyStatus     string  `json:"journey_status"` // ACTIVE / COMPLETED
    RequiredCompleted int     `json:"required_completed"`
    RequiredTotal     int     `json:"required_total"`
    Percentage        float64 `json:"percentage"`
    ProfiledAt        string  `json:"profiled_at"`
    LastUpdatedAt     string  `json:"last_updated_at"`
}

type GetJourneyUsersResponse struct {
    Data       []JourneyUserRow `json:"data"`
    Total      int              `json:"total"`
    Page       int              `json:"page"`
    TotalPages int              `json:"total_pages"`
}

type UserMissionProgressRow struct {
    MissionCode       string  `json:"mission_code"`
    Title             string  `json:"title"`
    PhaseCode         string  `json:"phase_code"`
    PhaseName         string  `json:"phase_name"`
    EffectiveCategory string  `json:"effective_category"`
    Status            string  `json:"status"`
    IsAutoPassed      bool    `json:"is_auto_passed"`
    CompletedAt       *string `json:"completed_at,omitempty"`
    RewardExpected    int     `json:"reward_expected"`    // default_reward_point dari master
    RewardGranted     int     `json:"reward_granted"`     // reward_point_granted aktual
    RewardGrantedAt   *string `json:"reward_granted_at,omitempty"`
    SourceFeatureCode *string `json:"source_feature_code,omitempty"`
}

type UserTransitionRow struct {
    FromPhaseName    *string `json:"from_phase_name,omitempty"` // null saat pertama kali profiling
    ToPhaseName      string  `json:"to_phase_name"`
    TransitionReason string  `json:"transition_reason"`
    TransitionedAt   string  `json:"transitioned_at"`
}

type UserProfilingAnswers struct {
    HasCareerGoal        bool   `json:"has_career_goal"`
    BuildingPortfolio    *bool  `json:"building_portfolio,omitempty"`
    InRecruitmentProcess *bool  `json:"in_recruitment_process,omitempty"`
    ResultPersonaCode    string `json:"result_persona_code"`
    ProfiledAt           string `json:"profiled_at"`
}

// GetUserJourneyDetailResponse — response GET /admin/persona/users/:userId/journey
type GetUserJourneyDetailResponse struct {
    // Section A — identitas
    UserID         string `json:"user_id"`
    Name           string `json:"name"`
    Email          string `json:"email"`
    InitialPersona string `json:"initial_persona"`
    ActivePersona  string `json:"active_persona"`
    JourneyStatus  string `json:"journey_status"`
    ProfiledAt     string `json:"profiled_at"`
    CompletedAt    *string `json:"completed_at,omitempty"`
    LastUpdatedAt  string `json:"last_updated_at"`

    // Section B — progress
    RequiredCompleted    int     `json:"required_completed"`
    RequiredTotal        int     `json:"required_total"`
    Percentage           float64 `json:"percentage"`
    RecommendedCompleted int     `json:"recommended_completed"`
    RecommendedTotal     int     `json:"recommended_total"`

    // Section C — riwayat transisi
    Transitions []UserTransitionRow `json:"transitions"`

    // Section D — daftar misi user
    Missions []UserMissionProgressRow `json:"missions"`

    // Section E — hasil profiling
    ProfilingAnswers UserProfilingAnswers `json:"profiling_answers"`
}

// MissionUsersResponse — response GET /admin/persona/missions/:id/users
type MissionUserRow struct {
    UserID        string  `json:"user_id"`
    Name          string  `json:"name"`
    Email         string  `json:"email"`
    InitialPersona string `json:"initial_persona"`
    ActivePersona  string `json:"active_persona"`
    MissionStatus  string `json:"mission_status"`
    StartedAt      *string `json:"started_at,omitempty"`
    CompletedAt    *string `json:"completed_at,omitempty"`
}

type MissionUsersResponse struct {
    MissionCode string           `json:"mission_code"`
    MissionTitle string          `json:"mission_title"`
    Total       int              `json:"total"`
    Data        []MissionUserRow `json:"data"`
}
```

---

## F. Repository Layer (Tambahan Admin)

Repository yang sudah ada di user brief (`phase_master_repository`, `mission_master_repository`) perlu diperluas untuk admin. Tambahkan method berikut ke interface yang sudah ada:

### `phase_master_repository.go` — tambah method admin

```go
// Method tambahan untuk admin:
GetAllWithMissionCount(ctx context.Context) ([]entity.PersonaPhaseMaster, error)
```

### `mission_master_repository.go` — tambah method admin

```go
// Method tambahan untuk admin:
Create(ctx context.Context, tx *gorm.DB, mission entity.PersonaMissionMaster) (entity.PersonaMissionMaster, error)
Update(ctx context.Context, tx *gorm.DB, mission entity.PersonaMissionMaster) (entity.PersonaMissionMaster, error)
Delete(ctx context.Context, tx *gorm.DB, id string) error
GetWithFilters(ctx context.Context, phaseCode, category, status, search string) ([]entity.PersonaMissionMaster, error)
CountUsersByMissionID(ctx context.Context, missionID string) (int, error)
ShiftSequenceNoFrom(ctx context.Context, tx *gorm.DB, phaseID string, fromSequenceNo int) error
```

### `mission_feature_map_repository.go` — buat baru (full CRUD)

```go
type MissionFeatureMapRepository interface {
    Create(ctx context.Context, tx *gorm.DB, fm entity.PersonaMissionFeatureMap) (entity.PersonaMissionFeatureMap, error)
    GetByMissionID(ctx context.Context, missionID string) ([]entity.PersonaMissionFeatureMap, error)
    GetByID(ctx context.Context, id string) (entity.PersonaMissionFeatureMap, bool, error)
    Update(ctx context.Context, tx *gorm.DB, fm entity.PersonaMissionFeatureMap) (entity.PersonaMissionFeatureMap, error)
    Delete(ctx context.Context, tx *gorm.DB, id string) error
    CountPrimaryByMissionID(ctx context.Context, missionID string) (int, error)
}
```

### `user_persona_profile_repository.go` — tambah method admin

```go
// Method tambahan untuk admin:
GetAllWithFilters(ctx context.Context, query dto_request.GetJourneyUsersQuery) ([]entity.UserPersonaProfile, int, error)
GetStats(ctx context.Context) (dto_response.JourneyStatsResponse, error)
```

### `user_persona_mission_progress_repository.go` — tambah method admin

```go
// Method tambahan untuk admin:
GetByUserPersonaProfileID(ctx context.Context, userPersonaProfileID string) ([]entity.UserPersonaMissionProgress, error)
GetByMissionID(ctx context.Context, missionID string, page, limit int) ([]entity.UserPersonaMissionProgress, int, error)
CountByMissionID(ctx context.Context, missionID string) (int, error)
```

---

## G. Service Layer

### G.1 `admin_mission_service.go`

**Interface:**
```go
type AdminMissionService interface {
    GetMissions(ctx context.Context, query dto_request.GetMissionsQuery) (dto_response.GetMissionsResponse, error)
    GetMissionDetail(ctx context.Context, id string) (dto_response.AdminMissionItem, error)
    CreateMission(ctx context.Context, req dto_request.CreateMissionRequest) (dto_response.CreateMissionResponse, error)
    UpdateMission(ctx context.Context, id string, req dto_request.UpdateMissionRequest) (dto_response.CreateMissionResponse, error)
    DeactivateMission(ctx context.Context, id string) error
    DeleteMission(ctx context.Context, id string) error
    GetMissionUsers(ctx context.Context, missionID string, page, limit int) (dto_response.MissionUsersResponse, error)
    AddFeatureMap(ctx context.Context, missionID string, req dto_request.AddFeatureMapRequest) (dto_response.AdminMissionFeatureMapItem, error)
    UpdateFeatureMap(ctx context.Context, missionID, fmID string, req dto_request.UpdateFeatureMapRequest) (dto_response.AdminMissionFeatureMapItem, error)
    DeleteFeatureMap(ctx context.Context, missionID, fmID string) error
    PreviewJourney(ctx context.Context) (dto_response.PreviewJourneyResponse, error)
}
```

**Logika bisnis penting di `CreateMission` / `UpdateMission`:**

```
1. Validasi phase_code ada dan aktif
2. Validasi mission_code unik secara global
3. Cek apakah sequence_no yang dipilih sudah dipakai misi lain di fase yang sama
   → Jika konflik:
      a. Hitung semua misi di fase tersebut yang sequence_no >= sequence_no baru
      b. Shift +1 semua misi tersebut (ShiftSequenceNoFrom) dalam transaksi
      c. Return shift_preview di response agar frontend bisa tampilkan preview
4. Jika is_auto_pass = true, validasi auto_pass_rule berformat JSON yang valid
5. Simpan misi
6. Jika ada feature_maps dalam payload, simpan sekaligus
```

**Logika bisnis penting di `DeleteMission`:**

```
1. Cek CountUsersByMissionID — jika > 0, return error dengan pesan:
   "Misi sudah digunakan N user. Gunakan Nonaktifkan untuk menonaktifkan misi."
2. Hapus feature maps dulu (cascade via transaksi)
3. Hapus misi
```

**Logika `PreviewJourney`:**

```
1. Ambil semua fase (GetAll) dan semua misi aktif (GetWithFilters status=ACTIVE)
2. Untuk setiap skenario (Pathfinder, Builder, Achiever):
   a. Tentukan initial_phase_order (1, 2, atau 3)
   b. Ambil misi dengan phase_order <= initial_phase_order
   c. Hitung effective_category per misi:
      - mission.phase_order < initial_phase_order → RECOMMENDED
      - mission.phase_order == initial_phase_order → default_category
3. Return 3 skenario dalam satu response
```

---

### G.2 `admin_journey_service.go`

**Interface:**
```go
type AdminJourneyService interface {
    GetStats(ctx context.Context) (dto_response.JourneyStatsResponse, error)
    GetJourneyUsers(ctx context.Context, query dto_request.GetJourneyUsersQuery) (dto_response.GetJourneyUsersResponse, error)
    GetUserJourneyDetail(ctx context.Context, userID string) (dto_response.GetUserJourneyDetailResponse, error)
}
```

**Logika `GetUserJourneyDetail`:**

```
1. Ambil UserPersonaProfile by userID (preload: InitialPhase, CurrentPhase)
2. Ambil semua UserPersonaMissionProgress user (preload: Mission.Phase.FeatureMaps)
3. Ambil UserPersonaTransitionHistory user (preload: FromPhase, ToPhase)
4. Hitung:
   - required_completed = count progress REQUIRED fase aktif yang IsFinished = true
   - required_total = count progress REQUIRED fase aktif
   - recommended_completed = count progress RECOMMENDED yang IsFinished = true
   - recommended_total = count progress RECOMMENDED
5. Build reward_expected dari Mission.RewardPoint (master), reward_granted dari progress.RewardPointGranted
6. Ambil data profiling answers dari UserPersonaProfile (initial_phase_id + profiled_at)
   → Q&A disimpan di field terpisah jika ada, atau direkonstruksi dari initial_phase_code
7. Return response lengkap
```

> **Catatan:** Jika jawaban Q1/Q2/Q3 tidak disimpan eksplisit di `UserPersonaProfile`, pertimbangkan untuk menambahkan kolom `profiling_answers jsonb` di entity. Diskusikan dengan tim backend sebelum implementasi.

---

## H. Controller & Routes

### H.1 Controller Files

```
internal/modules/persona/controller/
├── admin_mission_controller.go     ← handler Tab 1: Konfigurasi Journey
└── admin_journey_controller.go     ← handler Tab 2: Journey Pengguna
```

### H.2 Routes

**`routes/persona_admin_route.go`**

```go
func ServePersonaAdmin(app *gin.Engine, missionCtrl controller.PersonaAdminMissionController, journeyCtrl controller.PersonaAdminJourneyController, mw middleware.Middleware) {
    r := app.Group("/api/v1/admin/persona")
    r.Use(mw.AdminAuthenticate())
    {
        // Tab 1 — Konfigurasi Journey
        r.GET("/phases", missionCtrl.GetPhases)
        r.GET("/missions", missionCtrl.GetMissions)
        r.POST("/missions", missionCtrl.CreateMission)
        r.GET("/missions/:id", missionCtrl.GetMissionDetail)
        r.PUT("/missions/:id", missionCtrl.UpdateMission)
        r.PUT("/missions/:id/deactivate", missionCtrl.DeactivateMission)
        r.DELETE("/missions/:id", missionCtrl.DeleteMission)
        r.GET("/missions/:id/users", missionCtrl.GetMissionUsers)
        r.POST("/missions/:id/feature-maps", missionCtrl.AddFeatureMap)
        r.PUT("/missions/:id/feature-maps/:fmId", missionCtrl.UpdateFeatureMap)
        r.DELETE("/missions/:id/feature-maps/:fmId", missionCtrl.DeleteFeatureMap)
        r.GET("/journey-preview", missionCtrl.PreviewJourney)
        r.GET("/settings", missionCtrl.GetSettings)
        r.PUT("/settings", missionCtrl.UpdateSettings)

        // Tab 2 — Journey Pengguna
        r.GET("/users/stats", journeyCtrl.GetStats)
        r.GET("/users", journeyCtrl.GetJourneyUsers)
        r.GET("/users/:userId/journey", journeyCtrl.GetUserJourneyDetail)
    }
}
```

### H.3 Update `module.go`

```go
// internal/modules/persona/module.go — tambahkan inisialisasi admin

func InitModule(server *gin.Engine, db *gorm.DB, mw middleware.Middleware) {
    // === Shared Repositories ===
    phaseMasterRepo      := repository.NewPhaseMaster(db)
    missionMasterRepo    := repository.NewMissionMaster(db)
    featureMapRepo       := repository.NewMissionFeatureMap(db)
    profileRepo          := repository.NewUserPersonaProfile(db)
    progressRepo         := repository.NewUserPersonaMissionProgress(db)
    transitionRepo       := repository.NewUserPersonaTransitionHistory(db)

    // === User Side ===
    profilingService  := service.NewProfiling(phaseMasterRepo, missionMasterRepo, profileRepo, progressRepo, transitionRepo)
    journeyService    := service.NewJourney(profileRepo)
    missionService    := service.NewMission(profileRepo, progressRepo, transitionRepo, phaseMasterRepo, missionMasterRepo)

    profilingCtrl := controller.NewProfiling(profilingService)
    journeyCtrl   := controller.NewJourney(journeyService)
    missionCtrl   := controller.NewMission(missionService)

    routes.ServePersonaUser(server, profilingCtrl, journeyCtrl, missionCtrl, mw)

    // === Admin Side ===
    adminMissionService := service.NewAdminMission(phaseMasterRepo, missionMasterRepo, featureMapRepo, progressRepo)
    adminJourneyService := service.NewAdminJourney(profileRepo, progressRepo, transitionRepo)

    adminMissionCtrl := controller.NewAdminMission(adminMissionService)
    adminJourneyCtrl := controller.NewAdminJourney(adminJourneyService)

    routes.ServePersonaAdmin(server, adminMissionCtrl, adminJourneyCtrl, mw)

    // === External Callback ===
    // (dipakai modul fitur lain)
}
```

---

## I. Aturan Bisnis Penting

### I.1 Immutability Rules

| Field | Aturan | Alasan |
|---|---|---|
| `PersonaPhaseMaster.code` | Tidak boleh diubah jika sudah ada user yang diprofiling ke fase ini | Merusak semua referensi di `UserPersonaProfile` |
| `PersonaMissionMaster.mission_code` | Tidak boleh diubah jika ada `UserPersonaMissionProgress` yang merujuknya | Merusak callback dari modul fitur |
| `UserPersonaMissionProgress.effective_category` | Tidak pernah diubah setelah dibuat | Snapshot backward validation yang stabil |
| `UserPersonaProfile.initial_phase_id` | Tidak pernah diubah | Hasil profiling yang permanen |

### I.2 Guard Rules untuk Delete & Update Sensitif

```
Delete PersonaMissionMaster:
  → Cek CountUsersByMissionID > 0 → tolak, arahkan ke Deactivate

Delete PersonaMissionFeatureMap:
  → Cek apakah ini adalah satu-satunya feature map di misi tersebut
  → Jika iya → tolak (setiap misi butuh minimal 1 feature map)
  → Cek apakah is_primary = true dan masih ada feature map lain
  → Jika iya → tolak (harus ada tepat 1 is_primary, assign dulu ke yang lain)

Update PersonaMissionMaster.phase_id:
  → Tidak boleh dipindah ke fase lain jika sudah ada user yang punya misi ini
```

### I.3 Auto-Shift Sequence

```
Saat admin set sequence_no yang sudah dipakai:
  1. Cari semua misi di fase yang sama dengan sequence_no >= nilai baru
  2. Increment sequence_no mereka +1 (dalam transaksi, mulai dari yang terbesar)
  3. Return shift_preview: daftar misi yang bergeser + lama vs baru
  4. Frontend tampilkan preview sebelum konfirmasi simpan
```

### I.4 Feature Map — Primary Constraint

```
Setiap misi harus punya tepat 1 feature map dengan is_primary = true.
Validasi di service:
- Saat AddFeatureMap dengan is_primary = true:
  → Pastikan tidak ada feature map lain dengan is_primary = true di misi yang sama
  → Jika ada, unset is_primary yang lama
- Saat DeleteFeatureMap yang is_primary = true:
  → Tolak jika masih ada feature map lain (admin harus assign primary dulu)
- Saat misi dibuat tanpa feature map → boleh, tapi warning di response
```

---

## J. Checklist Implementasi

### File Baru yang Perlu Dibuat

**Repository (method tambahan):**
- [ ] Tambah method admin ke `phase_master_repository.go`
- [ ] Tambah method admin ke `mission_master_repository.go`
- [ ] Buat `mission_feature_map_repository.go` (full baru)
- [ ] Tambah method admin ke `user_persona_profile_repository.go`
- [ ] Tambah method admin ke `user_persona_mission_progress_repository.go`

**DTO:**
- [ ] `internal/dto/request/persona_admin_dto_request.go`
- [ ] `internal/dto/response/persona_admin_dto_response.go`

**Service:**
- [ ] `internal/modules/persona/service/admin_mission_service.go`
- [ ] `internal/modules/persona/service/admin_journey_service.go`

**Controller:**
- [ ] `internal/modules/persona/controller/admin_mission_controller.go`
- [ ] `internal/modules/persona/controller/admin_journey_controller.go`

**Routes:**
- [ ] `internal/modules/persona/routes/persona_admin_route.go`

**Module:**
- [ ] Update `internal/modules/persona/module.go` — tambah inisialisasi admin

### Aturan Bisnis yang Wajib Di-test

- [ ] Delete misi yang sudah dipakai user → harus ditolak
- [ ] Auto-shift sequence saat konflik urutan → preview harus benar
- [ ] Feature map: setiap misi harus punya tepat 1 `is_primary = true`
- [ ] Preview journey — backward validation: skenario Builder dan Achiever harus hasilkan misi RECOMMENDED dari fase sebelumnya
- [ ] `mission_code` duplikat → harus ditolak dengan pesan jelas
- [ ] Deactivate misi yang sudah dipakai user → boleh (tidak hapus snapshot yang ada)

---

## K. Implementasi Lengkap — Kode Go

### K.1 DTO Request Admin — `internal/dto/request/persona_admin_dto_request.go`

```go
package dto_request

// CreateMissionRequest — payload buat misi baru.
type CreateMissionRequest struct {
	PhaseCode       string `json:"phase_code" binding:"required"`
	MissionCode     string `json:"mission_code" binding:"required"`
	Title           string `json:"title" binding:"required"`
	Description     string `json:"description"`
	SequenceNo      int    `json:"sequence_no" binding:"required,min=1"`
	DefaultCategory string `json:"default_category" binding:"required,oneof=REQUIRED RECOMMENDED"`
	RewardPoint     int    `json:"reward_point" binding:"min=0"`
	IsBlocking      bool   `json:"is_blocking"`
	IsAutoPass      bool   `json:"is_auto_pass"`
	AutoPassRule    string `json:"auto_pass_rule"`
	Status          string `json:"status" binding:"required,oneof=ACTIVE INACTIVE"`
}

// UpdateMissionRequest — semua field opsional.
type UpdateMissionRequest struct {
	Title           *string `json:"title"`
	Description     *string `json:"description"`
	SequenceNo      *int    `json:"sequence_no"`
	DefaultCategory *string `json:"default_category" binding:"omitempty,oneof=REQUIRED RECOMMENDED"`
	RewardPoint     *int    `json:"reward_point"`
	IsBlocking      *bool   `json:"is_blocking"`
	IsAutoPass      *bool   `json:"is_auto_pass"`
	AutoPassRule    *string `json:"auto_pass_rule"`
	Status          *string `json:"status" binding:"omitempty,oneof=ACTIVE INACTIVE"`
}

// AddFeatureMapRequest — payload tambah mapping fitur ke misi.
type AddFeatureMapRequest struct {
	FeatureCode    string `json:"feature_code" binding:"required"`
	EntitlementKey string `json:"entitlement_key" binding:"required"`
	AccessLabel    string `json:"access_label" binding:"required,oneof=BEBAS AKSES_TOKEN AKSES_TERBATAS"`
	CompletionRule string `json:"completion_rule"`
	DisplayOrder   int    `json:"display_order" binding:"min=1"`
	IsPrimary      bool   `json:"is_primary"`
}

// UpdateFeatureMapRequest — payload update mapping fitur.
type UpdateFeatureMapRequest struct {
	EntitlementKey *string `json:"entitlement_key"`
	AccessLabel    *string `json:"access_label" binding:"omitempty,oneof=BEBAS AKSES_TOKEN AKSES_TERBATAS"`
	CompletionRule *string `json:"completion_rule"`
	DisplayOrder   *int    `json:"display_order"`
	IsPrimary      *bool   `json:"is_primary"`
}

// UpdateSettingsRequest — payload update pengaturan global journey.
type UpdateSettingsRequest struct {
	AutoPassEnabled                   *bool `json:"auto_pass_enabled"`
	SequentialTransition              *bool `json:"sequential_transition"`
	ShowPreviousMissionsAsRecommended *bool `json:"show_previous_missions_as_recommended"`
}

// GetMissionsQuery — query params untuk list misi.
type GetMissionsQuery struct {
	PhaseCode string `form:"phase_code"`
	Category  string `form:"category"`
	Status    string `form:"status"`
	Search    string `form:"search"`
	GroupBy   string `form:"group_by"`
}

// GetJourneyUsersQuery — query params untuk list user journey.
type GetJourneyUsersQuery struct {
	PersonaInitial string `form:"persona_initial"`
	PersonaActive  string `form:"persona_active"`
	Status         string `form:"status"`
	DateFrom       string `form:"date_from"`
	DateTo         string `form:"date_to"`
	Search         string `form:"search"`
	Page           int    `form:"page,default=1"`
	Limit          int    `form:"limit,default=20"`
	SortBy         string `form:"sort_by"`
}
```

---

### K.2 DTO Response Admin — `internal/dto/response/persona_admin_dto_response.go`

```go
package dto_response

// AdminMissionFeatureMapItem — item feature map dalam response admin.
type AdminMissionFeatureMapItem struct {
	ID             string `json:"id"`
	FeatureCode    string `json:"feature_code"`
	EntitlementKey string `json:"entitlement_key"`
	AccessLabel    string `json:"access_label"`
	IsPrimary      bool   `json:"is_primary"`
	DisplayOrder   int    `json:"display_order"`
	CompletionRule string `json:"completion_rule,omitempty"`
}

// AdminMissionItem — satu misi dalam response admin.
type AdminMissionItem struct {
	ID              string                       `json:"id"`
	PhaseCode       string                       `json:"phase_code"`
	PhaseName       string                       `json:"phase_name"`
	MissionCode     string                       `json:"mission_code"`
	Title           string                       `json:"title"`
	Description     string                       `json:"description"`
	SequenceNo      int                          `json:"sequence_no"`
	DefaultCategory string                       `json:"default_category"`
	RewardPoint     int                          `json:"reward_point"`
	IsBlocking      bool                         `json:"is_blocking"`
	IsAutoPass      bool                         `json:"is_auto_pass"`
	AutoPassRule    string                       `json:"auto_pass_rule,omitempty"`
	Status          string                       `json:"status"`
	UserCount       int                          `json:"user_count"`
	FeatureMaps     []AdminMissionFeatureMapItem `json:"feature_maps"`
	CreatedAt       string                       `json:"created_at"`
	UpdatedAt       string                       `json:"updated_at"`
}

// AdminPhaseGroup — grup misi per fase dalam response grouped.
type AdminPhaseGroup struct {
	PhaseID          string             `json:"phase_id"`
	PhaseCode        string             `json:"phase_code"`
	PhaseName        string             `json:"phase_name"`
	PhaseOrder       int                `json:"phase_order"`
	TotalMissions    int                `json:"total_missions"`
	RequiredCount    int                `json:"required_count"`
	RecommendedCount int                `json:"recommended_count"`
	Missions         []AdminMissionItem `json:"missions"`
}

// GetMissionsResponse — response GET /admin/persona/missions.
type GetMissionsResponse struct {
	Phases   []AdminPhaseGroup  `json:"phases,omitempty"`
	Missions []AdminMissionItem `json:"missions,omitempty"`
	Total    int                `json:"total"`
}

// SequenceShiftPreview — preview auto-shift saat konflik urutan.
type SequenceShiftPreview struct {
	MissionCode   string `json:"mission_code"`
	Title         string `json:"title"`
	OldSequenceNo int    `json:"old_sequence_no"`
	NewSequenceNo int    `json:"new_sequence_no"`
}

// CreateMissionResponse — response POST /admin/persona/missions.
type CreateMissionResponse struct {
	Mission      AdminMissionItem       `json:"mission"`
	ShiftPreview []SequenceShiftPreview `json:"shift_preview,omitempty"`
}

// JourneyPreviewMission — misi dalam simulasi preview journey.
type JourneyPreviewMission struct {
	MissionCode       string `json:"mission_code"`
	Title             string `json:"title"`
	SequenceNo        int    `json:"sequence_no"`
	EffectiveCategory string `json:"effective_category"`
	PhaseCode         string `json:"phase_code"`
	IsBlocking        bool   `json:"is_blocking"`
}

// JourneyPreviewScenario — satu skenario simulasi (Pathfinder/Builder/Achiever).
type JourneyPreviewScenario struct {
	InitialPersonaCode string                  `json:"initial_persona_code"`
	InitialPersonaName string                  `json:"initial_persona_name"`
	RequiredCount      int                     `json:"required_count"`
	RecommendedCount   int                     `json:"recommended_count"`
	Missions           []JourneyPreviewMission `json:"missions"`
}

// PreviewJourneyResponse — response GET /admin/persona/journey-preview.
type PreviewJourneyResponse struct {
	Scenarios []JourneyPreviewScenario `json:"scenarios"`
}

// JourneyStatsResponse — stat cards Tab 2.
type JourneyStatsResponse struct {
	TotalUsersWithJourney int `json:"total_users_with_journey"`
	PathfinderCount       int `json:"pathfinder_count"`
	BuilderCount          int `json:"builder_count"`
	AchieverCount         int `json:"achiever_count"`
	CompletedCount        int `json:"completed_count"`
	StagnantCount         int `json:"stagnant_count"`
}

// JourneyUserRow — satu baris di tabel user journey.
type JourneyUserRow struct {
	UserID            string  `json:"user_id"`
	Name              string  `json:"name"`
	Email             string  `json:"email"`
	InitialPersona    string  `json:"initial_persona"`
	ActivePersona     string  `json:"active_persona"`
	JourneyStatus     string  `json:"journey_status"`
	RequiredCompleted int     `json:"required_completed"`
	RequiredTotal     int     `json:"required_total"`
	Percentage        float64 `json:"percentage"`
	ProfiledAt        string  `json:"profiled_at"`
	LastUpdatedAt     string  `json:"last_updated_at"`
}

// GetJourneyUsersResponse — response GET /admin/persona/users.
type GetJourneyUsersResponse struct {
	Data       []JourneyUserRow `json:"data"`
	Total      int              `json:"total"`
	Page       int              `json:"page"`
	TotalPages int              `json:"total_pages"`
}

// UserMissionProgressRow — satu baris misi di drawer detail user.
type UserMissionProgressRow struct {
	MissionCode       string  `json:"mission_code"`
	Title             string  `json:"title"`
	PhaseCode         string  `json:"phase_code"`
	PhaseName         string  `json:"phase_name"`
	EffectiveCategory string  `json:"effective_category"`
	Status            string  `json:"status"`
	IsAutoPassed      bool    `json:"is_auto_passed"`
	CompletedAt       *string `json:"completed_at,omitempty"`
	RewardExpected    int     `json:"reward_expected"`
	RewardGranted     int     `json:"reward_granted"`
	RewardGrantedAt   *string `json:"reward_granted_at,omitempty"`
	SourceFeatureCode *string `json:"source_feature_code,omitempty"`
}

// UserTransitionRow — satu baris riwayat transisi.
type UserTransitionRow struct {
	FromPhaseName    *string `json:"from_phase_name,omitempty"`
	ToPhaseName      string  `json:"to_phase_name"`
	TransitionReason string  `json:"transition_reason"`
	TransitionedAt   string  `json:"transitioned_at"`
}

// UserProfilingAnswers — hasil profiling user.
type UserProfilingAnswers struct {
	HasCareerGoal        bool   `json:"has_career_goal"`
	BuildingPortfolio    *bool  `json:"building_portfolio,omitempty"`
	InRecruitmentProcess *bool  `json:"in_recruitment_process,omitempty"`
	ResultPersonaCode    string `json:"result_persona_code"`
	ProfiledAt           string `json:"profiled_at"`
}

// GetUserJourneyDetailResponse — response GET /admin/persona/users/:userId/journey.
type GetUserJourneyDetailResponse struct {
	UserID         string  `json:"user_id"`
	Name           string  `json:"name"`
	Email          string  `json:"email"`
	InitialPersona string  `json:"initial_persona"`
	ActivePersona  string  `json:"active_persona"`
	JourneyStatus  string  `json:"journey_status"`
	ProfiledAt     string  `json:"profiled_at"`
	CompletedAt    *string `json:"completed_at,omitempty"`
	LastUpdatedAt  string  `json:"last_updated_at"`

	RequiredCompleted    int     `json:"required_completed"`
	RequiredTotal        int     `json:"required_total"`
	Percentage           float64 `json:"percentage"`
	RecommendedCompleted int     `json:"recommended_completed"`
	RecommendedTotal     int     `json:"recommended_total"`

	Transitions []UserTransitionRow `json:"transitions"`
	Missions    []UserMissionProgressRow `json:"missions"`

	ProfilingAnswers UserProfilingAnswers `json:"profiling_answers"`
}

// MissionUserRow — satu baris user di drawer "Digunakan oleh X User".
type MissionUserRow struct {
	UserID         string  `json:"user_id"`
	Name           string  `json:"name"`
	Email          string  `json:"email"`
	InitialPersona string  `json:"initial_persona"`
	ActivePersona  string  `json:"active_persona"`
	MissionStatus  string  `json:"mission_status"`
	StartedAt      *string `json:"started_at,omitempty"`
	CompletedAt    *string `json:"completed_at,omitempty"`
}

// MissionUsersResponse — response GET /admin/persona/missions/:id/users.
type MissionUsersResponse struct {
	MissionCode  string           `json:"mission_code"`
	MissionTitle string           `json:"mission_title"`
	Total        int              `json:"total"`
	Data         []MissionUserRow `json:"data"`
}
```

---

### K.3 Repository: `internal/modules/persona/repository/mission_feature_map_repository.go`

```go
package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"rextra-backend/internal/entity"
	myerror "rextra-backend/internal/pkg/error"
)

type MissionFeatureMapRepository interface {
	Create(ctx context.Context, tx *gorm.DB, fm entity.PersonaMissionFeatureMap) (entity.PersonaMissionFeatureMap, error)
	GetByMissionID(ctx context.Context, missionID string) ([]entity.PersonaMissionFeatureMap, error)
	GetByID(ctx context.Context, id string) (entity.PersonaMissionFeatureMap, bool, error)
	Update(ctx context.Context, tx *gorm.DB, fm entity.PersonaMissionFeatureMap) (entity.PersonaMissionFeatureMap, error)
	Delete(ctx context.Context, tx *gorm.DB, id string) error
	CountPrimaryByMissionID(ctx context.Context, missionID string) (int64, error)
	UnsetPrimaryByMissionID(ctx context.Context, tx *gorm.DB, missionID string) error
}

type missionFeatureMapRepository struct {
	db *gorm.DB
}

func NewMissionFeatureMap(db *gorm.DB) MissionFeatureMapRepository {
	return &missionFeatureMapRepository{db: db}
}

func (r *missionFeatureMapRepository) Create(ctx context.Context, tx *gorm.DB, fm entity.PersonaMissionFeatureMap) (entity.PersonaMissionFeatureMap, error) {
	db := tx
	if db == nil {
		db = r.db
	}
	if err := db.WithContext(ctx).Create(&fm).Error; err != nil {
		return entity.PersonaMissionFeatureMap{}, myerror.ErrInternalServer
	}
	return fm, nil
}

func (r *missionFeatureMapRepository) GetByMissionID(ctx context.Context, missionID string) ([]entity.PersonaMissionFeatureMap, error) {
	mID, err := uuid.Parse(missionID)
	if err != nil {
		return nil, myerror.ErrBadRequest
	}
	var fms []entity.PersonaMissionFeatureMap
	if err := r.db.WithContext(ctx).
		Where("mission_id = ?", mID).
		Order("display_order ASC").
		Find(&fms).Error; err != nil {
		return nil, myerror.ErrInternalServer
	}
	return fms, nil
}

func (r *missionFeatureMapRepository) GetByID(ctx context.Context, id string) (entity.PersonaMissionFeatureMap, bool, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return entity.PersonaMissionFeatureMap{}, false, myerror.ErrBadRequest
	}
	var fm entity.PersonaMissionFeatureMap
	if err := r.db.WithContext(ctx).Where("id = ?", uid).First(&fm).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return entity.PersonaMissionFeatureMap{}, false, nil
		}
		return entity.PersonaMissionFeatureMap{}, false, myerror.ErrInternalServer
	}
	return fm, true, nil
}

func (r *missionFeatureMapRepository) Update(ctx context.Context, tx *gorm.DB, fm entity.PersonaMissionFeatureMap) (entity.PersonaMissionFeatureMap, error) {
	db := tx
	if db == nil {
		db = r.db
	}
	if err := db.WithContext(ctx).Save(&fm).Error; err != nil {
		return entity.PersonaMissionFeatureMap{}, myerror.ErrInternalServer
	}
	return fm, nil
}

func (r *missionFeatureMapRepository) Delete(ctx context.Context, tx *gorm.DB, id string) error {
	db := tx
	if db == nil {
		db = r.db
	}
	uid, err := uuid.Parse(id)
	if err != nil {
		return myerror.ErrBadRequest
	}
	if err := db.WithContext(ctx).
		Where("id = ?", uid).
		Delete(&entity.PersonaMissionFeatureMap{}).Error; err != nil {
		return myerror.ErrInternalServer
	}
	return nil
}

func (r *missionFeatureMapRepository) CountPrimaryByMissionID(ctx context.Context, missionID string) (int64, error) {
	mID, err := uuid.Parse(missionID)
	if err != nil {
		return 0, myerror.ErrBadRequest
	}
	var count int64
	if err := r.db.WithContext(ctx).Model(&entity.PersonaMissionFeatureMap{}).
		Where("mission_id = ? AND is_primary = true", mID).
		Count(&count).Error; err != nil {
		return 0, myerror.ErrInternalServer
	}
	return count, nil
}

func (r *missionFeatureMapRepository) UnsetPrimaryByMissionID(ctx context.Context, tx *gorm.DB, missionID string) error {
	db := tx
	if db == nil {
		db = r.db
	}
	mID, err := uuid.Parse(missionID)
	if err != nil {
		return myerror.ErrBadRequest
	}
	if err := db.WithContext(ctx).Model(&entity.PersonaMissionFeatureMap{}).
		Where("mission_id = ? AND is_primary = true", mID).
		Update("is_primary", false).Error; err != nil {
		return myerror.ErrInternalServer
	}
	return nil
}
```

---

### K.4 Method Tambahan di `mission_master_repository.go`

Tambahkan method berikut ke interface dan struct implementasi yang sudah ada:

```go
// Tambahan di interface MissionMasterRepository:
Create(ctx context.Context, tx *gorm.DB, mission entity.PersonaMissionMaster) (entity.PersonaMissionMaster, error)
Update(ctx context.Context, tx *gorm.DB, mission entity.PersonaMissionMaster) (entity.PersonaMissionMaster, error)
Delete(ctx context.Context, tx *gorm.DB, id string) error
GetWithFilters(ctx context.Context, phaseCode, category, status, search string) ([]entity.PersonaMissionMaster, error)
CountUsersByMissionID(ctx context.Context, missionID string) (int64, error)
ShiftSequenceNoFrom(ctx context.Context, tx *gorm.DB, phaseID string, fromSequenceNo int) error
GetMissionsBeforeShift(ctx context.Context, phaseID string, fromSequenceNo int) ([]entity.PersonaMissionMaster, error)

// Implementasi:

func (r *missionMasterRepository) Create(ctx context.Context, tx *gorm.DB, mission entity.PersonaMissionMaster) (entity.PersonaMissionMaster, error) {
	db := tx
	if db == nil {
		db = r.db
	}
	if err := db.WithContext(ctx).Create(&mission).Error; err != nil {
		return entity.PersonaMissionMaster{}, myerror.ErrInternalServer
	}
	return mission, nil
}

func (r *missionMasterRepository) Update(ctx context.Context, tx *gorm.DB, mission entity.PersonaMissionMaster) (entity.PersonaMissionMaster, error) {
	db := tx
	if db == nil {
		db = r.db
	}
	if err := db.WithContext(ctx).Save(&mission).Error; err != nil {
		return entity.PersonaMissionMaster{}, myerror.ErrInternalServer
	}
	return mission, nil
}

func (r *missionMasterRepository) Delete(ctx context.Context, tx *gorm.DB, id string) error {
	db := tx
	if db == nil {
		db = r.db
	}
	uid, err := uuid.Parse(id)
	if err != nil {
		return myerror.ErrBadRequest
	}
	if err := db.WithContext(ctx).
		Where("id = ?", uid).
		Delete(&entity.PersonaMissionMaster{}).Error; err != nil {
		return myerror.ErrInternalServer
	}
	return nil
}

func (r *missionMasterRepository) GetWithFilters(ctx context.Context, phaseCode, category, status, search string) ([]entity.PersonaMissionMaster, error) {
	q := r.db.WithContext(ctx).
		Preload("Phase").
		Preload("FeatureMaps").
		Joins("JOIN persona_phase_masters p ON p.id = persona_mission_masters.phase_id")

	if phaseCode != "" {
		q = q.Where("p.code = ?", phaseCode)
	}
	if category != "" {
		q = q.Where("persona_mission_masters.default_category = ?", category)
	}
	if status != "" {
		q = q.Where("persona_mission_masters.status = ?", status)
	}
	if search != "" {
		like := "%" + search + "%"
		q = q.Where("persona_mission_masters.mission_code ILIKE ? OR persona_mission_masters.mission_title ILIKE ?", like, like)
	}

	var missions []entity.PersonaMissionMaster
	if err := q.Order("p.phase_order ASC, persona_mission_masters.sequence_no ASC").
		Find(&missions).Error; err != nil {
		return nil, myerror.ErrInternalServer
	}
	return missions, nil
}

func (r *missionMasterRepository) CountUsersByMissionID(ctx context.Context, missionID string) (int64, error) {
	mID, err := uuid.Parse(missionID)
	if err != nil {
		return 0, myerror.ErrBadRequest
	}
	var count int64
	if err := r.db.WithContext(ctx).Model(&entity.UserPersonaMissionProgress{}).
		Where("mission_id = ?", mID).
		Count(&count).Error; err != nil {
		return 0, myerror.ErrInternalServer
	}
	return count, nil
}

func (r *missionMasterRepository) ShiftSequenceNoFrom(ctx context.Context, tx *gorm.DB, phaseID string, fromSequenceNo int) error {
	db := tx
	if db == nil {
		db = r.db
	}
	pID, err := uuid.Parse(phaseID)
	if err != nil {
		return myerror.ErrBadRequest
	}
	if err := db.WithContext(ctx).Model(&entity.PersonaMissionMaster{}).
		Where("phase_id = ? AND sequence_no >= ?", pID, fromSequenceNo).
		UpdateColumn("sequence_no", gorm.Expr("sequence_no + 1")).Error; err != nil {
		return myerror.ErrInternalServer
	}
	return nil
}

func (r *missionMasterRepository) GetMissionsBeforeShift(ctx context.Context, phaseID string, fromSequenceNo int) ([]entity.PersonaMissionMaster, error) {
	pID, err := uuid.Parse(phaseID)
	if err != nil {
		return nil, myerror.ErrBadRequest
	}
	var missions []entity.PersonaMissionMaster
	if err := r.db.WithContext(ctx).
		Where("phase_id = ? AND sequence_no >= ?", pID, fromSequenceNo).
		Order("sequence_no ASC").
		Find(&missions).Error; err != nil {
		return nil, myerror.ErrInternalServer
	}
	return missions, nil
}
```

---

### K.5 Method Tambahan di `user_persona_profile_repository.go`

```go
// Tambahan di interface UserPersonaProfileRepository:
GetAllWithFilters(ctx context.Context, query dto_request.GetJourneyUsersQuery) ([]entity.UserPersonaProfile, int64, error)
GetStats(ctx context.Context) (dto_response.JourneyStatsResponse, error)

// Implementasi:

func (r *userPersonaProfileRepository) GetAllWithFilters(ctx context.Context, query dto_request.GetJourneyUsersQuery) ([]entity.UserPersonaProfile, int64, error) {
	q := r.db.WithContext(ctx).
		Preload("InitialPhase").
		Preload("CurrentPhase").
		Joins("JOIN users u ON u.id = user_persona_profiles.user_id")

	if query.PersonaInitial != "" {
		q = q.Joins("JOIN persona_phase_masters ip ON ip.id = user_persona_profiles.initial_phase_id").
			Where("ip.code = ?", query.PersonaInitial)
	}
	if query.PersonaActive != "" {
		q = q.Joins("JOIN persona_phase_masters cp ON cp.id = user_persona_profiles.current_phase_id").
			Where("cp.code = ?", query.PersonaActive)
	}
	if query.Status != "" {
		q = q.Where("user_persona_profiles.profile_status = ?", query.Status)
	}
	if query.Search != "" {
		like := "%" + query.Search + "%"
		q = q.Where("u.name ILIKE ? OR u.email ILIKE ?", like, like)
	}
	if query.DateFrom != "" {
		q = q.Where("user_persona_profiles.profiled_at >= ?", query.DateFrom)
	}
	if query.DateTo != "" {
		q = q.Where("user_persona_profiles.profiled_at <= ?", query.DateTo)
	}

	var total int64
	if err := q.Model(&entity.UserPersonaProfile{}).Count(&total).Error; err != nil {
		return nil, 0, myerror.ErrInternalServer
	}

	switch query.SortBy {
	case "progress_high":
		// sort by completed missions desc — handled in service after fetch or via subquery
		q = q.Order("user_persona_profiles.updated_at DESC")
	case "progress_low":
		q = q.Order("user_persona_profiles.updated_at ASC")
	default:
		q = q.Order("user_persona_profiles.profiled_at DESC")
	}

	page := query.Page
	if page < 1 {
		page = 1
	}
	limit := query.Limit
	if limit < 1 {
		limit = 20
	}
	offset := (page - 1) * limit

	var profiles []entity.UserPersonaProfile
	if err := q.Limit(limit).Offset(offset).Find(&profiles).Error; err != nil {
		return nil, 0, myerror.ErrInternalServer
	}
	return profiles, total, nil
}

func (r *userPersonaProfileRepository) GetStats(ctx context.Context) (dto_response.JourneyStatsResponse, error) {
	var stats dto_response.JourneyStatsResponse

	if err := r.db.WithContext(ctx).Model(&entity.UserPersonaProfile{}).
		Count((*int64)(&[]int64{0}[0])).
		Scan(&stats.TotalUsersWithJourney).Error; err != nil {
		// fallback raw count
		var total int64
		r.db.WithContext(ctx).Model(&entity.UserPersonaProfile{}).Count(&total)
		stats.TotalUsersWithJourney = int(total)
	}

	type phaseCount struct {
		Code  string
		Count int
	}
	var phaseCounts []phaseCount
	r.db.WithContext(ctx).
		Model(&entity.UserPersonaProfile{}).
		Select("persona_phase_masters.code AS code, COUNT(*) AS count").
		Joins("JOIN persona_phase_masters ON persona_phase_masters.id = user_persona_profiles.current_phase_id").
		Group("persona_phase_masters.code").
		Scan(&phaseCounts)

	for _, pc := range phaseCounts {
		switch pc.Code {
		case string(entity.PhaseCodePathfinder):
			stats.PathfinderCount = pc.Count
		case string(entity.PhaseCodeBuilder):
			stats.BuilderCount = pc.Count
		case string(entity.PhaseCodeAchiever):
			stats.AchieverCount = pc.Count
		}
	}

	var completedCount int64
	r.db.WithContext(ctx).Model(&entity.UserPersonaProfile{}).
		Where("profile_status = ?", entity.PersonaProfileStatusCompleted).
		Count(&completedCount)
	stats.CompletedCount = int(completedCount)

	// Stagnant: ACTIVE tapi tidak ada update selama > 30 hari
	var stagnantCount int64
	r.db.WithContext(ctx).Model(&entity.UserPersonaProfile{}).
		Where("profile_status = ? AND updated_at < NOW() - INTERVAL '30 days'", entity.PersonaProfileStatusActive).
		Count(&stagnantCount)
	stats.StagnantCount = int(stagnantCount)

	var total int64
	r.db.WithContext(ctx).Model(&entity.UserPersonaProfile{}).Count(&total)
	stats.TotalUsersWithJourney = int(total)

	return stats, nil
}
```

---

### K.6 Method Tambahan di `user_persona_mission_progress_repository.go`

```go
// Tambahan di interface UserPersonaMissionProgressRepository:
GetByUserPersonaProfileID(ctx context.Context, profileID string) ([]entity.UserPersonaMissionProgress, error)
GetByMissionID(ctx context.Context, missionID string, page, limit int) ([]entity.UserPersonaMissionProgress, int64, error)
CountByMissionID(ctx context.Context, missionID string) (int64, error)

// Implementasi:

func (r *userPersonaMissionProgressRepository) GetByUserPersonaProfileID(ctx context.Context, profileID string) ([]entity.UserPersonaMissionProgress, error) {
	pID, err := uuid.Parse(profileID)
	if err != nil {
		return nil, myerror.ErrBadRequest
	}
	var progresses []entity.UserPersonaMissionProgress
	if err := r.db.WithContext(ctx).
		Where("user_persona_profile_id = ?", pID).
		Preload("Mission").
		Preload("Mission.Phase").
		Order("created_at ASC").
		Find(&progresses).Error; err != nil {
		return nil, myerror.ErrInternalServer
	}
	return progresses, nil
}

func (r *userPersonaMissionProgressRepository) GetByMissionID(ctx context.Context, missionID string, page, limit int) ([]entity.UserPersonaMissionProgress, int64, error) {
	mID, err := uuid.Parse(missionID)
	if err != nil {
		return nil, 0, myerror.ErrBadRequest
	}

	var total int64
	if err := r.db.WithContext(ctx).Model(&entity.UserPersonaMissionProgress{}).
		Where("mission_id = ?", mID).Count(&total).Error; err != nil {
		return nil, 0, myerror.ErrInternalServer
	}

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}
	offset := (page - 1) * limit

	var progresses []entity.UserPersonaMissionProgress
	if err := r.db.WithContext(ctx).
		Where("mission_id = ?", mID).
		Preload("UserPersonaProfile").
		Preload("UserPersonaProfile.InitialPhase").
		Preload("UserPersonaProfile.CurrentPhase").
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&progresses).Error; err != nil {
		return nil, 0, myerror.ErrInternalServer
	}
	return progresses, total, nil
}

func (r *userPersonaMissionProgressRepository) CountByMissionID(ctx context.Context, missionID string) (int64, error) {
	mID, err := uuid.Parse(missionID)
	if err != nil {
		return 0, myerror.ErrBadRequest
	}
	var count int64
	if err := r.db.WithContext(ctx).Model(&entity.UserPersonaMissionProgress{}).
		Where("mission_id = ?", mID).Count(&count).Error; err != nil {
		return 0, myerror.ErrInternalServer
	}
	return count, nil
}
```

---

### K.7 Service: `internal/modules/persona/service/admin_mission_service.go`

```go
package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"gorm.io/gorm"

	"rextra-backend/internal/entity"
	dto_request "rextra-backend/internal/dto/request"
	dto_response "rextra-backend/internal/dto/response"
	myerror "rextra-backend/internal/pkg/error"
	"rextra-backend/internal/modules/persona/repository"
)

type AdminMissionService interface {
	GetMissions(ctx context.Context, query dto_request.GetMissionsQuery) (dto_response.GetMissionsResponse, error)
	GetMissionDetail(ctx context.Context, id string) (dto_response.AdminMissionItem, error)
	CreateMission(ctx context.Context, req dto_request.CreateMissionRequest) (dto_response.CreateMissionResponse, error)
	UpdateMission(ctx context.Context, id string, req dto_request.UpdateMissionRequest) (dto_response.CreateMissionResponse, error)
	DeactivateMission(ctx context.Context, id string) error
	DeleteMission(ctx context.Context, id string) error
	GetMissionUsers(ctx context.Context, missionID string, page, limit int) (dto_response.MissionUsersResponse, error)
	AddFeatureMap(ctx context.Context, missionID string, req dto_request.AddFeatureMapRequest) (dto_response.AdminMissionFeatureMapItem, error)
	UpdateFeatureMap(ctx context.Context, missionID, fmID string, req dto_request.UpdateFeatureMapRequest) (dto_response.AdminMissionFeatureMapItem, error)
	DeleteFeatureMap(ctx context.Context, missionID, fmID string) error
	PreviewJourney(ctx context.Context) (dto_response.PreviewJourneyResponse, error)
	GetPhases(ctx context.Context) ([]entity.PersonaPhaseMaster, error)
}

type adminMissionService struct {
	db             *gorm.DB
	phaseRepo      repository.PhaseMasterRepository
	missionRepo    repository.MissionMasterRepository
	featureMapRepo repository.MissionFeatureMapRepository
	progressRepo   repository.UserPersonaMissionProgressRepository
}

func NewAdminMission(
	db *gorm.DB,
	phaseRepo repository.PhaseMasterRepository,
	missionRepo repository.MissionMasterRepository,
	featureMapRepo repository.MissionFeatureMapRepository,
	progressRepo repository.UserPersonaMissionProgressRepository,
) AdminMissionService {
	return &adminMissionService{
		db:             db,
		phaseRepo:      phaseRepo,
		missionRepo:    missionRepo,
		featureMapRepo: featureMapRepo,
		progressRepo:   progressRepo,
	}
}

// ── GetPhases ────────────────────────────────────────────────────────────────

func (s *adminMissionService) GetPhases(ctx context.Context) ([]entity.PersonaPhaseMaster, error) {
	return s.phaseRepo.GetAll(ctx)
}

// ── GetMissions ──────────────────────────────────────────────────────────────

func (s *adminMissionService) GetMissions(ctx context.Context, query dto_request.GetMissionsQuery) (dto_response.GetMissionsResponse, error) {
	missions, err := s.missionRepo.GetWithFilters(ctx, query.PhaseCode, query.Category, query.Status, query.Search)
	if err != nil {
		return dto_response.GetMissionsResponse{}, err
	}

	if query.GroupBy == "phase" {
		phases, err := s.phaseRepo.GetAll(ctx)
		if err != nil {
			return dto_response.GetMissionsResponse{}, err
		}
		groups := s.buildPhaseGroups(phases, missions)
		total := 0
		for _, g := range groups {
			total += g.TotalMissions
		}
		return dto_response.GetMissionsResponse{Phases: groups, Total: total}, nil
	}

	items := make([]dto_response.AdminMissionItem, 0, len(missions))
	for _, m := range missions {
		userCount, _ := s.missionRepo.CountUsersByMissionID(ctx, m.ID.String())
		items = append(items, s.toAdminMissionItem(m, int(userCount)))
	}
	return dto_response.GetMissionsResponse{Missions: items, Total: len(items)}, nil
}

// ── GetMissionDetail ─────────────────────────────────────────────────────────

func (s *adminMissionService) GetMissionDetail(ctx context.Context, id string) (dto_response.AdminMissionItem, error) {
	mission, found, err := s.missionRepo.GetByIDWithRelations(ctx, id)
	if err != nil {
		return dto_response.AdminMissionItem{}, err
	}
	if !found {
		return dto_response.AdminMissionItem{}, myerror.ErrNotFound
	}
	userCount, _ := s.missionRepo.CountUsersByMissionID(ctx, id)
	return s.toAdminMissionItem(mission, int(userCount)), nil
}

// ── CreateMission ────────────────────────────────────────────────────────────

func (s *adminMissionService) CreateMission(ctx context.Context, req dto_request.CreateMissionRequest) (dto_response.CreateMissionResponse, error) {
	// 1. Validasi phase_code ada
	phase, found, err := s.phaseRepo.GetByCode(ctx, entity.PhaseCode(req.PhaseCode))
	if err != nil {
		return dto_response.CreateMissionResponse{}, err
	}
	if !found {
		return dto_response.CreateMissionResponse{}, myerror.NewBadRequest("phase_code tidak ditemukan")
	}

	// 2. Validasi mission_code unik
	existing, _, err := s.missionRepo.GetByCode(ctx, req.MissionCode)
	if err != nil {
		return dto_response.CreateMissionResponse{}, err
	}
	if existing.ID.String() != "00000000-0000-0000-0000-000000000000" {
		return dto_response.CreateMissionResponse{}, myerror.NewBadRequest(fmt.Sprintf("mission_code '%s' sudah digunakan", req.MissionCode))
	}

	// 3. Validasi auto_pass_rule jika is_auto_pass=true
	if req.IsAutoPass && req.AutoPassRule != "" {
		if !json.Valid([]byte(req.AutoPassRule)) {
			return dto_response.CreateMissionResponse{}, myerror.NewBadRequest("auto_pass_rule harus berformat JSON yang valid")
		}
	}

	// 4. Cek konflik sequence_no — ambil misi yang akan bergeser sebelum shift
	var shiftPreview []dto_response.SequenceShiftPreview
	affectedMissions, err := s.missionRepo.GetMissionsBeforeShift(ctx, phase.ID.String(), req.SequenceNo)
	if err != nil {
		return dto_response.CreateMissionResponse{}, err
	}
	if len(affectedMissions) > 0 {
		for _, am := range affectedMissions {
			shiftPreview = append(shiftPreview, dto_response.SequenceShiftPreview{
				MissionCode:   am.MissionCode,
				Title:         am.Title,
				OldSequenceNo: am.SequenceNo,
				NewSequenceNo: am.SequenceNo + 1,
			})
		}
	}

	// 5. Simpan dalam transaksi
	var createdMission entity.PersonaMissionMaster
	txErr := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Shift terlebih dahulu jika ada konflik
		if len(affectedMissions) > 0 {
			if err := s.missionRepo.ShiftSequenceNoFrom(ctx, tx, phase.ID.String(), req.SequenceNo); err != nil {
				return err
			}
		}

		var autoPassRule *string
		if req.AutoPassRule != "" {
			autoPassRule = &req.AutoPassRule
		}

		mission := entity.PersonaMissionMaster{
			PhaseID:     phase.ID,
			MissionCode: req.MissionCode,
			Title:       req.Title,
			Description: req.Description,
			SequenceNo:  req.SequenceNo,
			Category:    entity.MissionCategory(req.DefaultCategory),
			RewardPoint: req.RewardPoint,
			IsBlocking:  req.IsBlocking,
			IsAutoPass:  req.IsAutoPass,
			AutoPassRule: autoPassRule,
			Status:      entity.MissionStatus(req.Status),
		}

		var createErr error
		createdMission, createErr = s.missionRepo.Create(ctx, tx, mission)
		return createErr
	})
	if txErr != nil {
		return dto_response.CreateMissionResponse{}, txErr
	}

	// Reload dengan relasi
	createdMission, _, _ = s.missionRepo.GetByIDWithRelations(ctx, createdMission.ID.String())
	item := s.toAdminMissionItem(createdMission, 0)

	return dto_response.CreateMissionResponse{
		Mission:      item,
		ShiftPreview: shiftPreview,
	}, nil
}

// ── UpdateMission ────────────────────────────────────────────────────────────

func (s *adminMissionService) UpdateMission(ctx context.Context, id string, req dto_request.UpdateMissionRequest) (dto_response.CreateMissionResponse, error) {
	mission, found, err := s.missionRepo.GetByIDWithRelations(ctx, id)
	if err != nil {
		return dto_response.CreateMissionResponse{}, err
	}
	if !found {
		return dto_response.CreateMissionResponse{}, myerror.ErrNotFound
	}

	// Validasi mission_code unik jika berubah
	if req.MissionCode != nil && *req.MissionCode != mission.MissionCode {
		existing, _, _ := s.missionRepo.GetByCode(ctx, *req.MissionCode)
		if existing.ID != mission.ID && existing.MissionCode != "" {
			return dto_response.CreateMissionResponse{}, myerror.NewBadRequest(fmt.Sprintf("mission_code '%s' sudah digunakan", *req.MissionCode))
		}
		mission.MissionCode = *req.MissionCode
	}

	// Validasi auto_pass_rule
	if req.IsAutoPass != nil && *req.IsAutoPass && req.AutoPassRule != nil && *req.AutoPassRule != "" {
		if !json.Valid([]byte(*req.AutoPassRule)) {
			return dto_response.CreateMissionResponse{}, myerror.NewBadRequest("auto_pass_rule harus berformat JSON yang valid")
		}
	}

	// Apply update fields
	if req.Title != nil {
		mission.Title = *req.Title
	}
	if req.Description != nil {
		mission.Description = *req.Description
	}
	if req.DefaultCategory != nil {
		mission.Category = entity.MissionCategory(*req.DefaultCategory)
	}
	if req.RewardPoint != nil {
		mission.RewardPoint = *req.RewardPoint
	}
	if req.IsBlocking != nil {
		mission.IsBlocking = *req.IsBlocking
	}
	if req.IsAutoPass != nil {
		mission.IsAutoPass = *req.IsAutoPass
	}
	if req.AutoPassRule != nil {
		mission.AutoPassRule = req.AutoPassRule
	}
	if req.Status != nil {
		mission.Status = entity.MissionStatus(*req.Status)
	}

	var shiftPreview []dto_response.SequenceShiftPreview
	oldSeq := mission.SequenceNo
	newSeq := oldSeq
	if req.SequenceNo != nil {
		newSeq = *req.SequenceNo
	}

	txErr := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if req.SequenceNo != nil && *req.SequenceNo != oldSeq {
			affected, err := s.missionRepo.GetMissionsBeforeShift(ctx, mission.PhaseID.String(), newSeq)
			if err != nil {
				return err
			}
			// Exclude mission dirinya sendiri
			for _, am := range affected {
				if am.ID == mission.ID {
					continue
				}
				shiftPreview = append(shiftPreview, dto_response.SequenceShiftPreview{
					MissionCode:   am.MissionCode,
					Title:         am.Title,
					OldSequenceNo: am.SequenceNo,
					NewSequenceNo: am.SequenceNo + 1,
				})
			}
			if len(shiftPreview) > 0 {
				if err := s.missionRepo.ShiftSequenceNoFrom(ctx, tx, mission.PhaseID.String(), newSeq); err != nil {
					return err
				}
			}
			mission.SequenceNo = newSeq
		}
		mission.UpdatedAt = time.Now().UTC()
		_, err := s.missionRepo.Update(ctx, tx, mission)
		return err
	})
	if txErr != nil {
		return dto_response.CreateMissionResponse{}, txErr
	}

	reloaded, _, _ := s.missionRepo.GetByIDWithRelations(ctx, id)
	userCount, _ := s.missionRepo.CountUsersByMissionID(ctx, id)
	item := s.toAdminMissionItem(reloaded, int(userCount))

	return dto_response.CreateMissionResponse{
		Mission:      item,
		ShiftPreview: shiftPreview,
	}, nil
}

// ── DeactivateMission ────────────────────────────────────────────────────────

func (s *adminMissionService) DeactivateMission(ctx context.Context, id string) error {
	mission, found, err := s.missionRepo.GetByIDWithRelations(ctx, id)
	if err != nil {
		return err
	}
	if !found {
		return myerror.ErrNotFound
	}
	mission.Status = entity.MissionStatusInactive
	mission.UpdatedAt = time.Now().UTC()
	_, err = s.missionRepo.Update(ctx, nil, mission)
	return err
}

// ── DeleteMission ────────────────────────────────────────────────────────────

func (s *adminMissionService) DeleteMission(ctx context.Context, id string) error {
	mission, found, err := s.missionRepo.GetByIDWithRelations(ctx, id)
	if err != nil {
		return err
	}
	if !found {
		return myerror.ErrNotFound
	}

	userCount, err := s.missionRepo.CountUsersByMissionID(ctx, id)
	if err != nil {
		return err
	}
	if userCount > 0 {
		return myerror.NewBadRequest(fmt.Sprintf("Misi sudah digunakan %d user. Gunakan Nonaktifkan untuk menonaktifkan misi.", userCount))
	}

	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Hapus semua feature maps dulu
		fms, err := s.featureMapRepo.GetByMissionID(ctx, id)
		if err != nil {
			return err
		}
		for _, fm := range fms {
			if err := s.featureMapRepo.Delete(ctx, tx, fm.ID.String()); err != nil {
				return err
			}
		}
		return s.missionRepo.Delete(ctx, tx, mission.ID.String())
	})
}

// ── GetMissionUsers ──────────────────────────────────────────────────────────

func (s *adminMissionService) GetMissionUsers(ctx context.Context, missionID string, page, limit int) (dto_response.MissionUsersResponse, error) {
	mission, found, err := s.missionRepo.GetByIDWithRelations(ctx, missionID)
	if err != nil {
		return dto_response.MissionUsersResponse{}, err
	}
	if !found {
		return dto_response.MissionUsersResponse{}, myerror.ErrNotFound
	}

	progresses, total, err := s.progressRepo.GetByMissionID(ctx, missionID, page, limit)
	if err != nil {
		return dto_response.MissionUsersResponse{}, err
	}

	rows := make([]dto_response.MissionUserRow, 0, len(progresses))
	for _, p := range progresses {
		row := dto_response.MissionUserRow{
			UserID:         p.UserID.String(),
			Name:           "", // diisi dari join user — extend sesuai struct user
			Email:          "",
			InitialPersona: "",
			ActivePersona:  "",
			MissionStatus:  string(p.Status),
		}
		if p.UserPersonaProfile.ID.String() != "00000000-0000-0000-0000-000000000000" {
			row.InitialPersona = string(p.UserPersonaProfile.InitialPhase.Code)
			row.ActivePersona = string(p.UserPersonaProfile.CurrentPhase.Code)
		}
		if p.StartedAt != nil {
			t := p.StartedAt.Format(time.RFC3339)
			row.StartedAt = &t
		}
		if p.CompletedAt != nil {
			t := p.CompletedAt.Format(time.RFC3339)
			row.CompletedAt = &t
		}
		rows = append(rows, row)
	}

	return dto_response.MissionUsersResponse{
		MissionCode:  mission.MissionCode,
		MissionTitle: mission.Title,
		Total:        int(total),
		Data:         rows,
	}, nil
}

// ── AddFeatureMap ─────────────────────────────────────────────────────────────

func (s *adminMissionService) AddFeatureMap(ctx context.Context, missionID string, req dto_request.AddFeatureMapRequest) (dto_response.AdminMissionFeatureMapItem, error) {
	_, found, err := s.missionRepo.GetByIDWithRelations(ctx, missionID)
	if err != nil {
		return dto_response.AdminMissionFeatureMapItem{}, err
	}
	if !found {
		return dto_response.AdminMissionFeatureMapItem{}, myerror.ErrNotFound
	}

	mID, _ := parseUUID(missionID)

	var fm entity.PersonaMissionFeatureMap
	txErr := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if req.IsPrimary {
			// Unset primary yang lama
			if err := s.featureMapRepo.UnsetPrimaryByMissionID(ctx, tx, missionID); err != nil {
				return err
			}
		}

		var completionRule *string
		if req.CompletionRule != "" {
			completionRule = &req.CompletionRule
		}

		newFm := entity.PersonaMissionFeatureMap{
			MissionID:      mID,
			FeatureCode:    req.FeatureCode,
			EntitlementKey: req.EntitlementKey,
			AccessLabel:    entity.MissionAccessLabel(req.AccessLabel),
			CompletionRule: completionRule,
			DisplayOrder:   req.DisplayOrder,
			IsPrimary:      req.IsPrimary,
		}

		created, err := s.featureMapRepo.Create(ctx, tx, newFm)
		if err != nil {
			return err
		}
		fm = created
		return nil
	})
	if txErr != nil {
		return dto_response.AdminMissionFeatureMapItem{}, txErr
	}
	return toFeatureMapItem(fm), nil
}

// ── UpdateFeatureMap ──────────────────────────────────────────────────────────

func (s *adminMissionService) UpdateFeatureMap(ctx context.Context, missionID, fmID string, req dto_request.UpdateFeatureMapRequest) (dto_response.AdminMissionFeatureMapItem, error) {
	fm, found, err := s.featureMapRepo.GetByID(ctx, fmID)
	if err != nil {
		return dto_response.AdminMissionFeatureMapItem{}, err
	}
	if !found {
		return dto_response.AdminMissionFeatureMapItem{}, myerror.ErrNotFound
	}
	if fm.MissionID.String() != missionID {
		return dto_response.AdminMissionFeatureMapItem{}, myerror.ErrNotFound
	}

	var updated entity.PersonaMissionFeatureMap
	txErr := s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if req.IsPrimary != nil && *req.IsPrimary && !fm.IsPrimary {
			if err := s.featureMapRepo.UnsetPrimaryByMissionID(ctx, tx, missionID); err != nil {
				return err
			}
		}
		if req.EntitlementKey != nil {
			fm.EntitlementKey = *req.EntitlementKey
		}
		if req.AccessLabel != nil {
			fm.AccessLabel = entity.MissionAccessLabel(*req.AccessLabel)
		}
		if req.CompletionRule != nil {
			fm.CompletionRule = req.CompletionRule
		}
		if req.DisplayOrder != nil {
			fm.DisplayOrder = *req.DisplayOrder
		}
		if req.IsPrimary != nil {
			fm.IsPrimary = *req.IsPrimary
		}
		result, err := s.featureMapRepo.Update(ctx, tx, fm)
		if err != nil {
			return err
		}
		updated = result
		return nil
	})
	if txErr != nil {
		return dto_response.AdminMissionFeatureMapItem{}, txErr
	}
	return toFeatureMapItem(updated), nil
}

// ── DeleteFeatureMap ──────────────────────────────────────────────────────────

func (s *adminMissionService) DeleteFeatureMap(ctx context.Context, missionID, fmID string) error {
	fm, found, err := s.featureMapRepo.GetByID(ctx, fmID)
	if err != nil {
		return err
	}
	if !found {
		return myerror.ErrNotFound
	}
	if fm.MissionID.String() != missionID {
		return myerror.ErrNotFound
	}

	// Cek: jika is_primary dan ada feature map lain → tolak
	if fm.IsPrimary {
		allFMs, _ := s.featureMapRepo.GetByMissionID(ctx, missionID)
		if len(allFMs) > 1 {
			return myerror.NewBadRequest("Tidak bisa hapus feature map primary jika masih ada feature map lain. Assign primary ke feature map lain terlebih dahulu.")
		}
	}

	// Cek: minimal 1 feature map
	allFMs, _ := s.featureMapRepo.GetByMissionID(ctx, missionID)
	if len(allFMs) <= 1 {
		return myerror.NewBadRequest("Setiap misi harus memiliki minimal satu feature map.")
	}

	return s.featureMapRepo.Delete(ctx, nil, fmID)
}

// ── PreviewJourney ────────────────────────────────────────────────────────────

func (s *adminMissionService) PreviewJourney(ctx context.Context) (dto_response.PreviewJourneyResponse, error) {
	phases, err := s.phaseRepo.GetAll(ctx)
	if err != nil {
		return dto_response.PreviewJourneyResponse{}, err
	}

	activeMissions, err := s.missionRepo.GetWithFilters(ctx, "", "", "ACTIVE", "")
	if err != nil {
		return dto_response.PreviewJourneyResponse{}, err
	}

	scenarios := make([]dto_response.JourneyPreviewScenario, 0, len(phases))
	for _, phase := range phases {
		var missionItems []dto_response.JourneyPreviewMission
		reqCount, recCount := 0, 0

		for _, m := range activeMissions {
			if m.Phase.PhaseOrder > phase.PhaseOrder {
				continue // belum di-generate untuk persona ini
			}

			effectiveCategory := string(m.Category)
			if m.Phase.PhaseOrder < phase.PhaseOrder {
				effectiveCategory = "RECOMMENDED"
			}

			if effectiveCategory == "REQUIRED" {
				reqCount++
			} else {
				recCount++
			}

			missionItems = append(missionItems, dto_response.JourneyPreviewMission{
				MissionCode:       m.MissionCode,
				Title:             m.Title,
				SequenceNo:        m.SequenceNo,
				EffectiveCategory: effectiveCategory,
				PhaseCode:         string(m.Phase.Code),
				IsBlocking:        m.IsBlocking,
			})
		}

		scenarios = append(scenarios, dto_response.JourneyPreviewScenario{
			InitialPersonaCode: string(phase.Code),
			InitialPersonaName: phase.Name,
			RequiredCount:      reqCount,
			RecommendedCount:   recCount,
			Missions:           missionItems,
		})
	}

	return dto_response.PreviewJourneyResponse{Scenarios: scenarios}, nil
}

// ── Helpers ───────────────────────────────────────────────────────────────────

func (s *adminMissionService) toAdminMissionItem(m entity.PersonaMissionMaster, userCount int) dto_response.AdminMissionItem {
	fms := make([]dto_response.AdminMissionFeatureMapItem, 0, len(m.FeatureMaps))
	for _, fm := range m.FeatureMaps {
		fms = append(fms, toFeatureMapItem(fm))
	}

	autoPassRule := ""
	if m.AutoPassRule != nil {
		autoPassRule = *m.AutoPassRule
	}

	return dto_response.AdminMissionItem{
		ID:              m.ID.String(),
		PhaseCode:       string(m.Phase.Code),
		PhaseName:       m.Phase.Name,
		MissionCode:     m.MissionCode,
		Title:           m.Title,
		Description:     m.Description,
		SequenceNo:      m.SequenceNo,
		DefaultCategory: string(m.Category),
		RewardPoint:     m.RewardPoint,
		IsBlocking:      m.IsBlocking,
		IsAutoPass:      m.IsAutoPass,
		AutoPassRule:    autoPassRule,
		Status:          string(m.Status),
		UserCount:       userCount,
		FeatureMaps:     fms,
		CreatedAt:       m.CreatedAt.Format(time.RFC3339),
		UpdatedAt:       m.UpdatedAt.Format(time.RFC3339),
	}
}

func (s *adminMissionService) buildPhaseGroups(phases []entity.PersonaPhaseMaster, missions []entity.PersonaMissionMaster) []dto_response.AdminPhaseGroup {
	missionsByPhaseID := make(map[string][]entity.PersonaMissionMaster)
	for _, m := range missions {
		pid := m.PhaseID.String()
		missionsByPhaseID[pid] = append(missionsByPhaseID[pid], m)
	}

	groups := make([]dto_response.AdminPhaseGroup, 0, len(phases))
	for _, phase := range phases {
		pid := phase.ID.String()
		phaseMissions := missionsByPhaseID[pid]

		items := make([]dto_response.AdminMissionItem, 0, len(phaseMissions))
		reqCount, recCount := 0, 0
		for _, m := range phaseMissions {
			// userCount per misi — bisa di-batch jika performa jadi masalah
			items = append(items, s.toAdminMissionItem(m, 0))
			if m.Category == entity.MissionCategoryRequired {
				reqCount++
			} else {
				recCount++
			}
		}

		groups = append(groups, dto_response.AdminPhaseGroup{
			PhaseID:          phase.ID.String(),
			PhaseCode:        string(phase.Code),
			PhaseName:        phase.Name,
			PhaseOrder:       phase.PhaseOrder,
			TotalMissions:    len(phaseMissions),
			RequiredCount:    reqCount,
			RecommendedCount: recCount,
			Missions:         items,
		})
	}
	return groups
}

func toFeatureMapItem(fm entity.PersonaMissionFeatureMap) dto_response.AdminMissionFeatureMapItem {
	completionRule := ""
	if fm.CompletionRule != nil {
		completionRule = *fm.CompletionRule
	}
	return dto_response.AdminMissionFeatureMapItem{
		ID:             fm.ID.String(),
		FeatureCode:    fm.FeatureCode,
		EntitlementKey: fm.EntitlementKey,
		AccessLabel:    string(fm.AccessLabel),
		IsPrimary:      fm.IsPrimary,
		DisplayOrder:   fm.DisplayOrder,
		CompletionRule: completionRule,
	}
}

func parseUUID(id string) (interface{ String() string }, error) {
	return nil, nil // placeholder — gunakan uuid.Parse langsung di caller
}
```

---

### K.8 Service: `internal/modules/persona/service/admin_journey_service.go`

```go
package service

import (
	"context"
	"math"
	"time"

	"rextra-backend/internal/entity"
	dto_request "rextra-backend/internal/dto/request"
	dto_response "rextra-backend/internal/dto/response"
	myerror "rextra-backend/internal/pkg/error"
	"rextra-backend/internal/modules/persona/repository"
)

type AdminJourneyService interface {
	GetStats(ctx context.Context) (dto_response.JourneyStatsResponse, error)
	GetJourneyUsers(ctx context.Context, query dto_request.GetJourneyUsersQuery) (dto_response.GetJourneyUsersResponse, error)
	GetUserJourneyDetail(ctx context.Context, userID string) (dto_response.GetUserJourneyDetailResponse, error)
}

type adminJourneyService struct {
	profileRepo    repository.UserPersonaProfileRepository
	progressRepo   repository.UserPersonaMissionProgressRepository
	transitionRepo repository.UserPersonaTransitionHistoryRepository
}

func NewAdminJourney(
	profileRepo repository.UserPersonaProfileRepository,
	progressRepo repository.UserPersonaMissionProgressRepository,
	transitionRepo repository.UserPersonaTransitionHistoryRepository,
) AdminJourneyService {
	return &adminJourneyService{
		profileRepo:    profileRepo,
		progressRepo:   progressRepo,
		transitionRepo: transitionRepo,
	}
}

// ── GetStats ──────────────────────────────────────────────────────────────────

func (s *adminJourneyService) GetStats(ctx context.Context) (dto_response.JourneyStatsResponse, error) {
	return s.profileRepo.GetStats(ctx)
}

// ── GetJourneyUsers ───────────────────────────────────────────────────────────

func (s *adminJourneyService) GetJourneyUsers(ctx context.Context, query dto_request.GetJourneyUsersQuery) (dto_response.GetJourneyUsersResponse, error) {
	profiles, total, err := s.profileRepo.GetAllWithFilters(ctx, query)
	if err != nil {
		return dto_response.GetJourneyUsersResponse{}, err
	}

	page := query.Page
	if page < 1 {
		page = 1
	}
	limit := query.Limit
	if limit < 1 {
		limit = 20
	}
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	rows := make([]dto_response.JourneyUserRow, 0, len(profiles))
	for _, p := range profiles {
		// Hitung required progress per user
		progresses, _ := s.progressRepo.GetByUserPersonaProfileID(ctx, p.ID.String())
		reqTotal, reqCompleted := 0, 0
		for _, prog := range progresses {
			if prog.Mission.PhaseID == p.CurrentPhaseID && prog.EffectiveCategory == entity.MissionCategoryRequired {
				reqTotal++
				if prog.IsFinished() {
					reqCompleted++
				}
			}
		}
		pct := 0.0
		if reqTotal > 0 {
			pct = math.Round(float64(reqCompleted)/float64(reqTotal)*100*10) / 10
		}

		row := dto_response.JourneyUserRow{
			UserID:            p.UserID.String(),
			Name:              "", // extend: join users table
			Email:             "",
			InitialPersona:    string(p.InitialPhase.Code),
			ActivePersona:     string(p.CurrentPhase.Code),
			JourneyStatus:     string(p.ProfileStatus),
			RequiredCompleted: reqCompleted,
			RequiredTotal:     reqTotal,
			Percentage:        pct,
			ProfiledAt:        p.ProfiledAt.Format(time.RFC3339),
			LastUpdatedAt:     p.UpdatedAt.Format(time.RFC3339),
		}
		rows = append(rows, row)
	}

	return dto_response.GetJourneyUsersResponse{
		Data:       rows,
		Total:      int(total),
		Page:       page,
		TotalPages: totalPages,
	}, nil
}

// ── GetUserJourneyDetail ──────────────────────────────────────────────────────

func (s *adminJourneyService) GetUserJourneyDetail(ctx context.Context, userID string) (dto_response.GetUserJourneyDetailResponse, error) {
	// 1. Ambil UserPersonaProfile by userID
	profile, found, err := s.profileRepo.GetByUserID(ctx, userID)
	if err != nil {
		return dto_response.GetUserJourneyDetailResponse{}, err
	}
	if !found {
		return dto_response.GetUserJourneyDetailResponse{}, myerror.ErrNotFound
	}

	// 2. Ambil semua mission progresses
	progresses, err := s.progressRepo.GetByUserPersonaProfileID(ctx, profile.ID.String())
	if err != nil {
		return dto_response.GetUserJourneyDetailResponse{}, err
	}

	// 3. Ambil transition history
	transitions, err := s.transitionRepo.GetByUserPersonaProfileID(ctx, profile.ID.String())
	if err != nil {
		return dto_response.GetUserJourneyDetailResponse{}, err
	}

	// 4. Hitung progress
	reqTotal, reqCompleted := 0, 0
	recTotal, recCompleted := 0, 0
	for _, prog := range progresses {
		if prog.Mission.PhaseID == profile.CurrentPhaseID {
			if prog.EffectiveCategory == entity.MissionCategoryRequired {
				reqTotal++
				if prog.IsFinished() {
					reqCompleted++
				}
			} else {
				recTotal++
				if prog.IsFinished() {
					recCompleted++
				}
			}
		} else {
			// Misi dari fase lain (backward validation) — counted as recommended
			recTotal++
			if prog.IsFinished() {
				recCompleted++
			}
		}
	}
	pct := 0.0
	if reqTotal > 0 {
		pct = math.Round(float64(reqCompleted)/float64(reqTotal)*100*10) / 10
	}

	// 5. Build mission rows
	missionRows := make([]dto_response.UserMissionProgressRow, 0, len(progresses))
	for _, prog := range progresses {
		row := dto_response.UserMissionProgressRow{
			MissionCode:       prog.Mission.MissionCode,
			Title:             prog.Mission.Title,
			PhaseCode:         string(prog.Mission.Phase.Code),
			PhaseName:         prog.Mission.Phase.Name,
			EffectiveCategory: string(prog.EffectiveCategory),
			Status:            string(prog.Status),
			IsAutoPassed:      prog.IsAutoPassed,
			RewardExpected:    prog.Mission.RewardPoint,
			RewardGranted:     prog.RewardPointGranted,
		}
		if prog.CompletedAt != nil {
			t := prog.CompletedAt.Format(time.RFC3339)
			row.CompletedAt = &t
		}
		if prog.RewardGrantedAt != nil {
			t := prog.RewardGrantedAt.Format(time.RFC3339)
			row.RewardGrantedAt = &t
		}
		if prog.SourceFeatureCode != nil {
			row.SourceFeatureCode = prog.SourceFeatureCode
		}
		missionRows = append(missionRows, row)
	}

	// 6. Build transition rows
	transitionRows := make([]dto_response.UserTransitionRow, 0, len(transitions))
	for _, t := range transitions {
		row := dto_response.UserTransitionRow{
			ToPhaseName:      t.ToPhase.Name,
			TransitionReason: string(t.TransitionReason),
			TransitionedAt:   t.TransitionedAt.Format(time.RFC3339),
		}
		if t.FromPhase != nil {
			row.FromPhaseName = &t.FromPhase.Name
		}
		transitionRows = append(transitionRows, row)
	}

	// 7. Build profiling answers dari initial_phase_code
	// Q1=false → Pathfinder; Q1=true,Q2=false → Builder; Q1=true,Q2=true,Q3=true → Achiever
	profilingAnswers := buildProfilingAnswers(profile)

	// 8. Build response
	resp := dto_response.GetUserJourneyDetailResponse{
		UserID:         profile.UserID.String(),
		Name:           "", // extend: join users table
		Email:          "",
		InitialPersona: string(profile.InitialPhase.Code),
		ActivePersona:  string(profile.CurrentPhase.Code),
		JourneyStatus:  string(profile.ProfileStatus),
		ProfiledAt:     profile.ProfiledAt.Format(time.RFC3339),
		LastUpdatedAt:  profile.UpdatedAt.Format(time.RFC3339),

		RequiredCompleted:    reqCompleted,
		RequiredTotal:        reqTotal,
		Percentage:           pct,
		RecommendedCompleted: recCompleted,
		RecommendedTotal:     recTotal,

		Transitions:      transitionRows,
		Missions:         missionRows,
		ProfilingAnswers: profilingAnswers,
	}
	if profile.CompletedAt != nil {
		t := profile.CompletedAt.Format(time.RFC3339)
		resp.CompletedAt = &t
	}
	return resp, nil
}

// buildProfilingAnswers merekonstruksi jawaban profiling dari initial_phase_code.
// Jawaban Q1/Q2/Q3 direkonstruksi berdasarkan aturan truth table profiling.
func buildProfilingAnswers(profile entity.UserPersonaProfile) dto_response.UserProfilingAnswers {
	answers := dto_response.UserProfilingAnswers{
		ResultPersonaCode: string(profile.InitialPhase.Code),
		ProfiledAt:        profile.ProfiledAt.Format(time.RFC3339),
	}

	switch profile.InitialPhase.Code {
	case entity.PhaseCodePathfinder:
		// Q1 = Tidak
		answers.HasCareerGoal = false
	case entity.PhaseCodeBuilder:
		// Q1 = Ya, Q2 = Tidak
		answers.HasCareerGoal = true
		f := false
		answers.BuildingPortfolio = &f
	case entity.PhaseCodeAchiever:
		// Q1 = Ya, Q2 = Ya, Q3 = Ya
		answers.HasCareerGoal = true
		tTrue := true
		answers.BuildingPortfolio = &tTrue
		answers.InRecruitmentProcess = &tTrue
	}
	return answers
}
```

---

### K.9 Controller: `internal/modules/persona/controller/admin_mission_controller.go`

```go
package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	dto_request "rextra-backend/internal/dto/request"
	"rextra-backend/internal/modules/persona/service"
	"rextra-backend/internal/pkg/response"
)

type PersonaAdminMissionController interface {
	GetPhases(ctx *gin.Context)
	GetMissions(ctx *gin.Context)
	CreateMission(ctx *gin.Context)
	GetMissionDetail(ctx *gin.Context)
	UpdateMission(ctx *gin.Context)
	DeactivateMission(ctx *gin.Context)
	DeleteMission(ctx *gin.Context)
	GetMissionUsers(ctx *gin.Context)
	AddFeatureMap(ctx *gin.Context)
	UpdateFeatureMap(ctx *gin.Context)
	DeleteFeatureMap(ctx *gin.Context)
	PreviewJourney(ctx *gin.Context)
	GetSettings(ctx *gin.Context)
	UpdateSettings(ctx *gin.Context)
}

type personaAdminMissionController struct {
	svc service.AdminMissionService
}

func NewAdminMission(svc service.AdminMissionService) PersonaAdminMissionController {
	return &personaAdminMissionController{svc: svc}
}

func (c *personaAdminMissionController) GetPhases(ctx *gin.Context) {
	phases, err := c.svc.GetPhases(ctx.Request.Context())
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "phases retrieved", phases)
}

func (c *personaAdminMissionController) GetMissions(ctx *gin.Context) {
	var q dto_request.GetMissionsQuery
	if err := ctx.ShouldBindQuery(&q); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}
	result, err := c.svc.GetMissions(ctx.Request.Context(), q)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "missions retrieved", result)
}

func (c *personaAdminMissionController) CreateMission(ctx *gin.Context) {
	var req dto_request.CreateMissionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}
	result, err := c.svc.CreateMission(ctx.Request.Context(), req)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusCreated, "mission created", result)
}

func (c *personaAdminMissionController) GetMissionDetail(ctx *gin.Context) {
	id := ctx.Param("id")
	result, err := c.svc.GetMissionDetail(ctx.Request.Context(), id)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "mission retrieved", result)
}

func (c *personaAdminMissionController) UpdateMission(ctx *gin.Context) {
	id := ctx.Param("id")
	var req dto_request.UpdateMissionRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}
	result, err := c.svc.UpdateMission(ctx.Request.Context(), id, req)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "mission updated", result)
}

func (c *personaAdminMissionController) DeactivateMission(ctx *gin.Context) {
	id := ctx.Param("id")
	if err := c.svc.DeactivateMission(ctx.Request.Context(), id); err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "mission deactivated", nil)
}

func (c *personaAdminMissionController) DeleteMission(ctx *gin.Context) {
	id := ctx.Param("id")
	if err := c.svc.DeleteMission(ctx.Request.Context(), id); err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "mission deleted", nil)
}

func (c *personaAdminMissionController) GetMissionUsers(ctx *gin.Context) {
	id := ctx.Param("id")
	page, _ := strconv.Atoi(ctx.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(ctx.DefaultQuery("limit", "20"))
	result, err := c.svc.GetMissionUsers(ctx.Request.Context(), id, page, limit)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "mission users retrieved", result)
}

func (c *personaAdminMissionController) AddFeatureMap(ctx *gin.Context) {
	missionID := ctx.Param("id")
	var req dto_request.AddFeatureMapRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}
	result, err := c.svc.AddFeatureMap(ctx.Request.Context(), missionID, req)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusCreated, "feature map added", result)
}

func (c *personaAdminMissionController) UpdateFeatureMap(ctx *gin.Context) {
	missionID := ctx.Param("id")
	fmID := ctx.Param("fmId")
	var req dto_request.UpdateFeatureMapRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}
	result, err := c.svc.UpdateFeatureMap(ctx.Request.Context(), missionID, fmID, req)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "feature map updated", result)
}

func (c *personaAdminMissionController) DeleteFeatureMap(ctx *gin.Context) {
	missionID := ctx.Param("id")
	fmID := ctx.Param("fmId")
	if err := c.svc.DeleteFeatureMap(ctx.Request.Context(), missionID, fmID); err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "feature map deleted", nil)
}

func (c *personaAdminMissionController) PreviewJourney(ctx *gin.Context) {
	result, err := c.svc.PreviewJourney(ctx.Request.Context())
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "journey preview retrieved", result)
}

// GetSettings dan UpdateSettings — dikembalikan sebagai placeholder.
// Implementasi penuh bergantung pada tabel settings yang disepakati tim backend.
func (c *personaAdminMissionController) GetSettings(ctx *gin.Context) {
	response.Success(ctx, http.StatusOK, "settings retrieved", gin.H{
		"auto_pass_enabled":                    true,
		"sequential_transition":                true,
		"show_previous_missions_as_recommended": true,
	})
}

func (c *personaAdminMissionController) UpdateSettings(ctx *gin.Context) {
	var req dto_request.UpdateSettingsRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}
	// TODO: persist ke tabel settings atau config store yang disepakati tim
	response.Success(ctx, http.StatusOK, "settings updated", nil)
}
```

---

### K.10 Controller: `internal/modules/persona/controller/admin_journey_controller.go`

```go
package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	dto_request "rextra-backend/internal/dto/request"
	"rextra-backend/internal/modules/persona/service"
	"rextra-backend/internal/pkg/response"
)

type PersonaAdminJourneyController interface {
	GetStats(ctx *gin.Context)
	GetJourneyUsers(ctx *gin.Context)
	GetUserJourneyDetail(ctx *gin.Context)
}

type personaAdminJourneyController struct {
	svc service.AdminJourneyService
}

func NewAdminJourney(svc service.AdminJourneyService) PersonaAdminJourneyController {
	return &personaAdminJourneyController{svc: svc}
}

func (c *personaAdminJourneyController) GetStats(ctx *gin.Context) {
	result, err := c.svc.GetStats(ctx.Request.Context())
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "stats retrieved", result)
}

func (c *personaAdminJourneyController) GetJourneyUsers(ctx *gin.Context) {
	var q dto_request.GetJourneyUsersQuery
	if err := ctx.ShouldBindQuery(&q); err != nil {
		response.BadRequest(ctx, err.Error())
		return
	}
	result, err := c.svc.GetJourneyUsers(ctx.Request.Context(), q)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "journey users retrieved", result)
}

func (c *personaAdminJourneyController) GetUserJourneyDetail(ctx *gin.Context) {
	userID := ctx.Param("userId")
	result, err := c.svc.GetUserJourneyDetail(ctx.Request.Context(), userID)
	if err != nil {
		response.Error(ctx, err)
		return
	}
	response.Success(ctx, http.StatusOK, "user journey detail retrieved", result)
}
```

---

### K.11 Routes: `internal/modules/persona/routes/persona_admin_route.go`

```go
package routes

import (
	"github.com/gin-gonic/gin"

	"rextra-backend/internal/middleware"
	"rextra-backend/internal/modules/persona/controller"
)

func ServePersonaAdmin(
	app *gin.Engine,
	missionCtrl controller.PersonaAdminMissionController,
	journeyCtrl controller.PersonaAdminJourneyController,
	mw middleware.Middleware,
) {
	r := app.Group("/api/v1/admin/persona")
	r.Use(mw.AdminAuthenticate())
	{
		// Tab 1 — Konfigurasi Journey
		r.GET("/phases", missionCtrl.GetPhases)
		r.GET("/missions", missionCtrl.GetMissions)
		r.POST("/missions", missionCtrl.CreateMission)
		r.GET("/missions/:id", missionCtrl.GetMissionDetail)
		r.PUT("/missions/:id", missionCtrl.UpdateMission)
		r.PUT("/missions/:id/deactivate", missionCtrl.DeactivateMission)
		r.DELETE("/missions/:id", missionCtrl.DeleteMission)
		r.GET("/missions/:id/users", missionCtrl.GetMissionUsers)
		r.POST("/missions/:id/feature-maps", missionCtrl.AddFeatureMap)
		r.PUT("/missions/:id/feature-maps/:fmId", missionCtrl.UpdateFeatureMap)
		r.DELETE("/missions/:id/feature-maps/:fmId", missionCtrl.DeleteFeatureMap)
		r.GET("/journey-preview", missionCtrl.PreviewJourney)
		r.GET("/settings", missionCtrl.GetSettings)
		r.PUT("/settings", missionCtrl.UpdateSettings)

		// Tab 2 — Journey Pengguna
		r.GET("/users/stats", journeyCtrl.GetStats)
		r.GET("/users", journeyCtrl.GetJourneyUsers)
		r.GET("/users/:userId/journey", journeyCtrl.GetUserJourneyDetail)
	}
}
```

---

### K.12 Module: `internal/modules/persona/module.go`

```go
package persona

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"rextra-backend/internal/middleware"
	"rextra-backend/internal/modules/persona/controller"
	"rextra-backend/internal/modules/persona/repository"
	"rextra-backend/internal/modules/persona/routes"
	"rextra-backend/internal/modules/persona/service"
)

func InitModule(server *gin.Engine, db *gorm.DB, mw middleware.Middleware) {
	// ── Shared Repositories ───────────────────────────────────────────────────
	phaseMasterRepo      := repository.NewPhaseMaster(db)
	missionMasterRepo    := repository.NewMissionMaster(db)
	featureMapRepo       := repository.NewMissionFeatureMap(db)
	profileRepo          := repository.NewUserPersonaProfile(db)
	progressRepo         := repository.NewUserPersonaMissionProgress(db)
	transitionRepo       := repository.NewUserPersonaTransitionHistory(db)

	// ── User Side ─────────────────────────────────────────────────────────────
	profilingService := service.NewProfiling(
		phaseMasterRepo,
		missionMasterRepo,
		profileRepo,
		progressRepo,
		transitionRepo,
	)
	journeyService := service.NewJourney(profileRepo)
	missionService := service.NewMission(
		profileRepo,
		progressRepo,
		transitionRepo,
		phaseMasterRepo,
		missionMasterRepo,
	)

	profilingCtrl := controller.NewProfiling(profilingService)
	journeyCtrl   := controller.NewJourney(journeyService)
	missionCtrl   := controller.NewMission(missionService)

	routes.ServePersonaUser(server, profilingCtrl, journeyCtrl, missionCtrl, mw)

	// ── Admin Side ────────────────────────────────────────────────────────────
	adminMissionService := service.NewAdminMission(
		db,
		phaseMasterRepo,
		missionMasterRepo,
		featureMapRepo,
		progressRepo,
	)
	adminJourneyService := service.NewAdminJourney(
		profileRepo,
		progressRepo,
		transitionRepo,
	)

	adminMissionCtrl := controller.NewAdminMission(adminMissionService)
	adminJourneyCtrl := controller.NewAdminJourney(adminJourneyService)

	routes.ServePersonaAdmin(server, adminMissionCtrl, adminJourneyCtrl, mw)
}
```

---

> **Catatan implementasi K:**
>
> - `MissionCode` field di `UpdateMissionRequest` tidak ada di struct (field immutable jika sudah dipakai user) — validasi di service dengan cek `CountUsersByMissionID` sebelum allow update code.
> - `GetByIDWithRelations`, `GetByCode`, `GetByUserID`, `GetAll`, `GetByCode` di masing-masing repository — tambahkan method ini ke interface dan implementasi repository yang sudah ada (pola sama: `r.db.WithContext(ctx).Preload(...).Where(...).First(...)`).
> - `GetStats` di `user_persona_profile_repository.go` menggunakan raw GROUP BY — sesuaikan dialect PostgreSQL (`INTERVAL '30 days'`).
> - Field `Name` dan `Email` pada `MissionUserRow`, `JourneyUserRow`, dan `GetUserJourneyDetailResponse` perlu diisi dari tabel `users` — tambahkan JOIN ke query repository profil sesuai struktur tabel user di project.
> - `parseUUID` helper di `admin_mission_service.go` adalah placeholder — hapus dan gunakan `uuid.Parse` langsung di semua caller.








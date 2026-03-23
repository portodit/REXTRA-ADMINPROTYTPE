const BASE = "/api/v1/admin/persona";

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(BASE + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(BASE + path, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export interface JourneyStats {
  total_users_with_journey: number;
  pathfinder_count: number;
  builder_count: number;
  achiever_count: number;
  completed_count: number;
  stagnant_count: number;
}

export interface JourneyUserRow {
  user_id: string;
  name: string;
  email: string;
  initial_persona: string;
  active_persona: string;
  journey_status: string;
  required_completed: number;
  required_total: number;
  percentage: number;
  profiled_at: string;
  last_updated_at: string;
}

export interface GetJourneyUsersResponse {
  data: JourneyUserRow[];
  total: number;
  page: number;
  total_pages: number;
}

export interface UserMissionRow {
  mission_code: string;
  title: string;
  phase_code: string;
  phase_name: string;
  effective_category: string;
  status: string;
  is_auto_passed: boolean;
  completed_at: string | null;
  reward_expected: number;
  reward_granted: number;
  reward_granted_at: string | null;
  source_feature_code: string | null;
}

export interface UserTransitionRow {
  from_phase_name: string | null;
  to_phase_name: string;
  transition_reason: string;
  transitioned_at: string;
}

export interface UserJourneyDetail {
  user_id: string;
  name: string;
  email: string;
  initial_persona: string;
  active_persona: string;
  journey_status: string;
  profiled_at: string;
  completed_at: string | null;
  last_updated_at: string;
  required_completed: number;
  required_total: number;
  percentage: number;
  recommended_completed: number;
  recommended_total: number;
  transitions: UserTransitionRow[];
  missions: UserMissionRow[];
  profiling_answers: {
    has_career_goal: boolean;
    building_portfolio: boolean | null;
    in_recruitment_process: boolean | null;
    result_persona_code: string;
    profiled_at: string;
  };
}

export interface Phase {
  id: string;
  code: string;
  name: string;
  phaseOrder: number;
  isActive: boolean;
}

export interface MissionItem {
  id: string;
  phase_code: string;
  phase_name: string;
  mission_code: string;
  title: string;
  description: string;
  sequence_no: number;
  default_category: "REQUIRED" | "RECOMMENDED";
  reward_point: number;
  is_blocking: boolean;
  is_auto_pass: boolean;
  auto_pass_rule: string;
  status: "ACTIVE" | "INACTIVE";
  user_count: number;
  feature_maps: FeatureMapItem[];
  created_at: string;
  updated_at: string;
}

export interface FeatureMapItem {
  id: string;
  feature_code: string;
  entitlement_key: string;
  access_label: string;
  is_primary: boolean;
  display_order: number;
  completion_rule: string;
}

export interface PhaseGroup {
  phase_id: string;
  phase_code: string;
  phase_name: string;
  phase_order: number;
  total_missions: number;
  required_count: number;
  recommended_count: number;
  missions: MissionItem[];
}

export interface GetMissionsResponse {
  phases?: PhaseGroup[];
  missions?: MissionItem[];
  total: number;
}

export interface JourneyPreviewScenario {
  initial_persona_code: string;
  initial_persona_name: string;
  required_count: number;
  recommended_count: number;
  missions: {
    mission_code: string;
    title: string;
    sequence_no: number;
    effective_category: string;
    phase_code: string;
    is_blocking: boolean;
  }[];
}

export interface JourneySettings {
  id: string;
  autoPassEnabled: boolean;
  sequentialTransition: boolean;
  showPreviousMissionsAsRecommended: boolean;
  updatedAt: string;
}

export const personaApi = {
  getStats: () => get<JourneyStats>("/users/stats"),

  getUsers: (params?: {
    persona_initial?: string;
    persona_active?: string;
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    page?: string;
    limit?: string;
    sort_by?: string;
  }) => get<GetJourneyUsersResponse>("/users", params as Record<string, string>),

  getUserJourney: (userId: string) => get<UserJourneyDetail>(`/users/${userId}/journey`),

  getPhases: () => get<Phase[]>("/phases"),

  getMissions: (params?: {
    phase_code?: string;
    category?: string;
    status?: string;
    search?: string;
    group_by?: string;
  }) => get<GetMissionsResponse>("/missions", params as Record<string, string>),

  getMission: (id: string) => get<MissionItem>(`/missions/${id}`),

  createMission: (body: {
    phase_code: string;
    mission_code: string;
    title: string;
    description?: string;
    sequence_no: number;
    default_category: string;
    reward_point?: number;
    is_blocking?: boolean;
    is_auto_pass?: boolean;
    auto_pass_rule?: string;
    status: string;
  }) => post<{ mission: MissionItem; shift_preview: unknown[] }>("/missions", body),

  updateMission: (id: string, body: Partial<{
    title: string; description: string; sequence_no: number;
    default_category: string; reward_point: number;
    is_blocking: boolean; is_auto_pass: boolean;
    auto_pass_rule: string; status: string;
  }>) => put<{ mission: MissionItem; shift_preview: unknown[] }>(`/missions/${id}`, body),

  deactivateMission: (id: string) => put<{ success: boolean }>(`/missions/${id}/deactivate`, {}),

  deleteMission: (id: string) => del(`/missions/${id}`),

  getMissionUsers: (id: string, params?: { page?: string; limit?: string }) =>
    get<{ mission_code: string; mission_title: string; total: number; data: unknown[] }>(`/missions/${id}/users`, params as Record<string, string>),

  addFeatureMap: (missionId: string, body: {
    feature_code: string; entitlement_key: string;
    access_label: string; completion_rule?: string;
    display_order?: number; is_primary?: boolean;
  }) => post<FeatureMapItem>(`/missions/${missionId}/feature-maps`, body),

  updateFeatureMap: (missionId: string, fmId: string, body: Partial<{
    entitlement_key: string; access_label: string;
    completion_rule: string; display_order: number; is_primary: boolean;
  }>) => put<FeatureMapItem>(`/missions/${missionId}/feature-maps/${fmId}`, body),

  deleteFeatureMap: (missionId: string, fmId: string) =>
    del(`/missions/${missionId}/feature-maps/${fmId}`),

  getJourneyPreview: () => get<{ scenarios: JourneyPreviewScenario[] }>("/journey-preview"),

  getSettings: () => get<JourneySettings>("/settings"),

  updateSettings: (body: {
    auto_pass_enabled?: boolean;
    sequential_transition?: boolean;
    show_previous_missions_as_recommended?: boolean;
  }) => put<JourneySettings>("/settings", body),
};

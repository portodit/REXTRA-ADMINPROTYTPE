import {
  pgTable, uuid, text, integer, boolean, timestamp, jsonb, pgEnum, unique
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const personaCategoryEnum = pgEnum("persona_category", ["REQUIRED", "RECOMMENDED"]);
export const personaStatusEnum = pgEnum("persona_status", ["ACTIVE", "INACTIVE"]);
export const accessLabelEnum = pgEnum("persona_access_label", ["BEBAS", "AKSES_TOKEN", "AKSES_TERBATAS"]);
export const journeyStatusEnum = pgEnum("persona_journey_status", ["ACTIVE", "COMPLETED"]);
export const missionProgressStatusEnum = pgEnum("persona_mission_progress_status", [
  "NOT_STARTED", "IN_PROGRESS", "COMPLETED", "AUTO_PASSED"
]);

export const personaPhaseMaster = pgTable("persona_phase_master", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  phaseOrder: integer("phase_order").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const personaMissionMaster = pgTable("persona_mission_master", {
  id: uuid("id").defaultRandom().primaryKey(),
  phaseId: uuid("phase_id").notNull().references(() => personaPhaseMaster.id),
  missionCode: text("mission_code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").default(""),
  sequenceNo: integer("sequence_no").notNull(),
  defaultCategory: personaCategoryEnum("default_category").notNull(),
  rewardPoint: integer("reward_point").notNull().default(0),
  isBlocking: boolean("is_blocking").notNull().default(false),
  isAutoPass: boolean("is_auto_pass").notNull().default(false),
  autoPassRule: text("auto_pass_rule").default(""),
  status: personaStatusEnum("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  unique("persona_mission_phase_seq").on(t.phaseId, t.sequenceNo),
]);

export const personaMissionFeatureMap = pgTable("persona_mission_feature_map", {
  id: uuid("id").defaultRandom().primaryKey(),
  missionId: uuid("mission_id").notNull().references(() => personaMissionMaster.id, { onDelete: "cascade" }),
  featureCode: text("feature_code").notNull(),
  entitlementKey: text("entitlement_key").notNull(),
  accessLabel: accessLabelEnum("access_label").notNull(),
  completionRule: text("completion_rule").default(""),
  displayOrder: integer("display_order").notNull().default(1),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const personaJourneySettings = pgTable("persona_journey_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  autoPassEnabled: boolean("auto_pass_enabled").notNull().default(true),
  sequentialTransition: boolean("sequential_transition").notNull().default(true),
  showPreviousMissionsAsRecommended: boolean("show_previous_missions_as_recommended").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userPersonaProfile = pgTable("user_persona_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique(),
  initialPhaseId: uuid("initial_phase_id").notNull().references(() => personaPhaseMaster.id),
  currentPhaseId: uuid("current_phase_id").notNull().references(() => personaPhaseMaster.id),
  journeyStatus: journeyStatusEnum("journey_status").notNull().default("ACTIVE"),
  profiledAt: timestamp("profiled_at", { withTimezone: true }).notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).defaultNow().notNull(),
  profilingAnswers: jsonb("profiling_answers"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userPersonaMissionProgress = pgTable("user_persona_mission_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userPersonaProfileId: uuid("user_persona_profile_id").notNull().references(() => userPersonaProfile.id, { onDelete: "cascade" }),
  missionId: uuid("mission_id").notNull().references(() => personaMissionMaster.id),
  effectiveCategory: personaCategoryEnum("effective_category").notNull(),
  status: missionProgressStatusEnum("status").notNull().default("NOT_STARTED"),
  isAutoPassed: boolean("is_auto_passed").notNull().default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  rewardPointGranted: integer("reward_point_granted").notNull().default(0),
  rewardGrantedAt: timestamp("reward_granted_at", { withTimezone: true }),
  sourceFeatureCode: text("source_feature_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  unique("persona_mission_progress_unique").on(t.userPersonaProfileId, t.missionId),
]);

export const userPersonaTransitionHistory = pgTable("user_persona_transition_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userPersonaProfileId: uuid("user_persona_profile_id").notNull().references(() => userPersonaProfile.id, { onDelete: "cascade" }),
  fromPhaseId: uuid("from_phase_id").references(() => personaPhaseMaster.id),
  toPhaseId: uuid("to_phase_id").notNull().references(() => personaPhaseMaster.id),
  transitionReason: text("transition_reason").notNull().default(""),
  transitionedAt: timestamp("transitioned_at", { withTimezone: true }).defaultNow().notNull(),
});

export const personaPhaseMasterRelations = relations(personaPhaseMaster, ({ many }) => ({
  missions: many(personaMissionMaster),
}));

export const personaMissionMasterRelations = relations(personaMissionMaster, ({ one, many }) => ({
  phase: one(personaPhaseMaster, { fields: [personaMissionMaster.phaseId], references: [personaPhaseMaster.id] }),
  featureMaps: many(personaMissionFeatureMap),
  progresses: many(userPersonaMissionProgress),
}));

export const personaMissionFeatureMapRelations = relations(personaMissionFeatureMap, ({ one }) => ({
  mission: one(personaMissionMaster, { fields: [personaMissionFeatureMap.missionId], references: [personaMissionMaster.id] }),
}));

export const userPersonaProfileRelations = relations(userPersonaProfile, ({ one, many }) => ({
  initialPhase: one(personaPhaseMaster, { fields: [userPersonaProfile.initialPhaseId], references: [personaPhaseMaster.id], relationName: "initialPhase" }),
  currentPhase: one(personaPhaseMaster, { fields: [userPersonaProfile.currentPhaseId], references: [personaPhaseMaster.id], relationName: "currentPhase" }),
  missionProgresses: many(userPersonaMissionProgress),
  transitionHistory: many(userPersonaTransitionHistory),
}));

export const userPersonaMissionProgressRelations = relations(userPersonaMissionProgress, ({ one }) => ({
  userPersonaProfile: one(userPersonaProfile, { fields: [userPersonaMissionProgress.userPersonaProfileId], references: [userPersonaProfile.id] }),
  mission: one(personaMissionMaster, { fields: [userPersonaMissionProgress.missionId], references: [personaMissionMaster.id] }),
}));

export const userPersonaTransitionHistoryRelations = relations(userPersonaTransitionHistory, ({ one }) => ({
  userPersonaProfile: one(userPersonaProfile, { fields: [userPersonaTransitionHistory.userPersonaProfileId], references: [userPersonaProfile.id] }),
  fromPhase: one(personaPhaseMaster, { fields: [userPersonaTransitionHistory.fromPhaseId], references: [personaPhaseMaster.id], relationName: "fromPhase" }),
  toPhase: one(personaPhaseMaster, { fields: [userPersonaTransitionHistory.toPhaseId], references: [personaPhaseMaster.id], relationName: "toPhase" }),
}));

export type PersonaPhaseMaster = typeof personaPhaseMaster.$inferSelect;
export type PersonaMissionMaster = typeof personaMissionMaster.$inferSelect;
export type PersonaMissionFeatureMap = typeof personaMissionFeatureMap.$inferSelect;
export type UserPersonaProfile = typeof userPersonaProfile.$inferSelect;
export type UserPersonaMissionProgress = typeof userPersonaMissionProgress.$inferSelect;
export type UserPersonaTransitionHistory = typeof userPersonaTransitionHistory.$inferSelect;

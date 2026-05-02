import {
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ── Enums ─────────────────────────────────────────────────────────────────────

export const muscleGroupEnum = pgEnum('muscle_group', [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
  'core', 'quads', 'hamstrings', 'glutes', 'calves', 'full_body',
  'cardio', 'other',
]);

export const categoryEnum = pgEnum('category', [
  'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'cardio', 'other',
]);

// ── Exercises ────────────────────────────────────────────────────────────────

export const exercises = pgTable('exercises', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  muscleGroup: muscleGroupEnum('muscle_group').notNull(),
  category: categoryEnum('category').notNull(),
  notes: text(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Workouts ─────────────────────────────────────────────────────────────────

export const workouts = pgTable(
  'workouts',
  {
    id: serial().primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    name: varchar({ length: 255 }),
    notes: text(),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('workouts_user_id_idx').on(t.userId)],
);

// ── Workout Exercises ─────────────────────────────────────────────────────────

export const workoutExercises = pgTable('workout_exercises', {
  id: serial().primaryKey(),
  workoutId: integer('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id')
    .notNull()
    .references(() => exercises.id),
  orderIndex: integer('order_index').notNull(),
  notes: text(),
});

// ── Sets ──────────────────────────────────────────────────────────────────────

export const sets = pgTable('sets', {
  id: serial().primaryKey(),
  workoutExerciseId: integer('workout_exercise_id')
    .notNull()
    .references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer(),
  weightKg: numeric('weight_kg', { precision: 6, scale: 2 }),
  durationSecs: integer('duration_secs'),
  distanceM: numeric('distance_m', { precision: 8, scale: 2 }),
  rpe: numeric('rpe', { precision: 3, scale: 1 }),
});

// ── Relations ─────────────────────────────────────────────────────────────────

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(sets),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

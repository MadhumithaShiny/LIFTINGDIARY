'use server';

import { neon } from '@neondatabase/serverless';

export type WorkoutSet = {
  id: number;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  rpe: number | null;
};

export type WorkoutExercise = {
  id: number;
  orderIndex: number;
  exerciseName: string;
  muscleGroup: string;
  category: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: number;
  name: string | null;
  notes: string | null;
  startedAt: string | null;
  completedAt: string | null;
  exercises: WorkoutExercise[];
};

export async function getWorkoutsForDate(userId: string, date: string): Promise<Workout[]> {
  const sql = neon(process.env.DATABASE_URL!);

  const rows = await sql`
    SELECT
      w.id            AS workout_id,
      w.name          AS workout_name,
      w.notes         AS workout_notes,
      w.started_at,
      w.completed_at,
      we.id           AS we_id,
      we.order_index,
      e.id            AS ex_id,
      e.name          AS ex_name,
      e.muscle_group,
      e.category,
      s.id            AS s_id,
      s.set_number,
      s.reps,
      s.weight_kg,
      s.rpe
    FROM workouts w
    JOIN workout_exercises we ON we.workout_id = w.id
    JOIN exercises e ON e.id = we.exercise_id
    LEFT JOIN sets s ON s.workout_exercise_id = we.id
    WHERE w.user_id = ${userId}
      AND DATE(w.started_at) = ${date}
    ORDER BY w.id, we.order_index, s.set_number
  `;

  // Shape flat rows into nested structure
  const workoutMap = new Map<number, Workout>();
  const exerciseMap = new Map<number, WorkoutExercise>();

  for (const row of rows) {
    if (!workoutMap.has(row.workout_id)) {
      workoutMap.set(row.workout_id, {
        id: row.workout_id,
        name: row.workout_name,
        notes: row.workout_notes,
        startedAt: row.started_at ? new Date(row.started_at).toISOString() : null,
        completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
        exercises: [],
      });
    }

    if (!exerciseMap.has(row.we_id)) {
      const ex: WorkoutExercise = {
        id: row.we_id,
        orderIndex: row.order_index,
        exerciseName: row.ex_name,
        muscleGroup: row.muscle_group,
        category: row.category,
        sets: [],
      };
      exerciseMap.set(row.we_id, ex);
      workoutMap.get(row.workout_id)!.exercises.push(ex);
    }

    if (row.s_id) {
      exerciseMap.get(row.we_id)!.sets.push({
        id: row.s_id,
        setNumber: row.set_number,
        reps: row.reps,
        weightKg: row.weight_kg != null ? parseFloat(row.weight_kg) : null,
        rpe: row.rpe != null ? parseFloat(row.rpe) : null,
      });
    }
  }

  return Array.from(workoutMap.values());
}

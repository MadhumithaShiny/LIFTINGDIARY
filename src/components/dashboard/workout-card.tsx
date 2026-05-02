'use client';

import { useState, useEffect } from 'react';
import type { Workout, WorkoutExercise } from '@/app/dashboard/actions';

// ── Workout CSS class (theme-aware colors via CSS variables) ──────────────────

const KEYWORD_CLASS: Array<{ keywords: string[]; cls: string }> = [
  { keywords: ['push'],                     cls: 'wt-push' },
  { keywords: ['pull'],                     cls: 'wt-pull' },
  { keywords: ['leg', 'lower', 'squat'],   cls: 'wt-leg' },
  { keywords: ['chest'],                    cls: 'wt-chest' },
  { keywords: ['back'],                     cls: 'wt-back' },
  { keywords: ['shoulder'],                 cls: 'wt-shoulder' },
  { keywords: ['arm', 'bicep', 'tricep'],  cls: 'wt-arm' },
  { keywords: ['cardio', 'run', 'bike'],   cls: 'wt-cardio' },
  { keywords: ['full', 'upper', 'lower'],  cls: 'wt-default' },
];

function getWorkoutClass(name: string | null): string {
  const lower = (name ?? '').toLowerCase();
  for (const { keywords, cls } of KEYWORD_CLASS) {
    if (keywords.some((k) => lower.includes(k))) return cls;
  }
  return 'wt-default';
}

// ── Pose selection ─────────────────────────────────────────────────────────────

type PoseName = 'squat' | 'deadlift' | 'bench' | 'overhead' | 'pullup' | 'pushdown' | 'running' | 'core';

function getPose(muscleGroup: string, category: string): PoseName {
  if (['quads', 'glutes'].includes(muscleGroup))               return 'squat';
  if (['hamstrings'].includes(muscleGroup))                    return 'deadlift';
  if (muscleGroup === 'chest')                                 return 'bench';
  if (muscleGroup === 'shoulders')                             return 'overhead';
  if (muscleGroup === 'biceps' || category === 'bodyweight')   return 'pullup';
  if (muscleGroup === 'triceps' || category === 'cable')       return 'pushdown';
  if (muscleGroup === 'core')                                  return 'core';
  if (category === 'cardio' || muscleGroup === 'cardio')       return 'running';
  if (['back', 'forearms', 'full_body'].includes(muscleGroup)) return 'deadlift';
  if (category === 'machine')                                  return 'pushdown';
  return 'deadlift';
}

// ── SVG Poses — all viewBox="0 0 60 100", stroke="currentColor" ───────────────

// Trainer: upright, right arm raised and pointing forward
function TrainerSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      <circle cx="30" cy="10" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainer-torso">
        <line x1="30" y1="18" x2="30" y2="54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* left arm — down */}
        <line x1="30" y1="26" x2="14" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* right arm — raised, pointing */}
        <g className="trainer-arm">
          <line x1="30" y1="26" x2="50" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="12" x2="57" y2="7"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </g>
        <line x1="30" y1="54" x2="20" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="54" x2="40" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Squat: barbell on traps, deep squat, knees out, torso upright
function SquatSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      <circle cx="30" cy="14" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainee-body">
        {/* barbell across shoulders */}
        <line x1="8"  y1="28" x2="52" y2="28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="8"  cy="28" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="52" cy="28" r="5" stroke="currentColor" strokeWidth="2" />
        {/* hands gripping bar */}
        <line x1="30" y1="22" x2="14" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="22" x2="46" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* torso — upright */}
        <line x1="30" y1="28" x2="30" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* left leg — bent at knee, foot flat */}
        <line x1="30" y1="56" x2="16" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="72" x2="10" y2="88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* right leg */}
        <line x1="30" y1="56" x2="44" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="72" x2="50" y2="88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Deadlift: hinge forward ~45°, arms straight down gripping bar at shin
function DeadliftSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      <circle cx="30" cy="22" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainee-body pose-deadlift">
        {/* torso angled forward */}
        <line x1="30" y1="30" x2="20" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* arms reaching down to bar */}
        <line x1="26" y1="40" x2="14" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="40" x2="38" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* barbell */}
        <line x1="6"  y1="66" x2="50" y2="66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="6"  cy="66" r="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="66" r="5" stroke="currentColor" strokeWidth="2" />
        {/* left leg bent */}
        <line x1="20" y1="56" x2="12" y2="72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="72" x2="8"  y2="88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* right leg */}
        <line x1="20" y1="56" x2="32" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="70" x2="36" y2="88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Bench: seated upright, arms out to sides mid-fly (avoids the lying-flat symbol problem)
function BenchSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      <circle cx="30" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainee-body pose-bench">
        {/* torso upright — seated */}
        <line x1="30" y1="20" x2="30" y2="54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* left arm — out to side holding dumbbell */}
        <line x1="30" y1="30" x2="8"  y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8"  y1="38" x2="4"  y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="4" cy="30" r="4"  stroke="currentColor" strokeWidth="2" />
        {/* right arm */}
        <line x1="30" y1="30" x2="52" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="52" y1="38" x2="56" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="56" cy="30" r="4" stroke="currentColor" strokeWidth="2" />
        {/* legs hanging — seated */}
        <line x1="30" y1="54" x2="18" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="66" x2="16" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="54" x2="42" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="66" x2="44" y2="82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Overhead press: standing, bar pressed fully overhead, arms straight up
function OverheadSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      <circle cx="30" cy="22" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainee-body pose-overhead">
        {/* bar overhead */}
        <line x1="10" y1="6"  x2="50" y2="6"  stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="10" cy="6" r="4"  stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="6" r="4"  stroke="currentColor" strokeWidth="2" />
        {/* arms straight up */}
        <line x1="30" y1="30" x2="16" y2="8"  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="30" x2="44" y2="8"  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* torso */}
        <line x1="30" y1="30" x2="30" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* legs */}
        <line x1="30" y1="62" x2="20" y2="84" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="62" x2="40" y2="84" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Pull-up: arms raised gripping bar overhead, body hanging, knees slightly bent
function PullupSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      {/* pull-up bar */}
      <line x1="6"  y1="6"  x2="54" y2="6"  stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="6"  y1="2"  x2="6"  y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="2"  x2="54" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="28" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainee-body pose-pullup">
        {/* arms reaching up to bar */}
        <line x1="30" y1="20" x2="18" y2="8"  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="20" x2="42" y2="8"  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* torso hanging */}
        <line x1="30" y1="36" x2="30" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* legs bent slightly */}
        <line x1="30" y1="66" x2="22" y2="80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="80" x2="24" y2="92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="66" x2="38" y2="80" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="80" x2="36" y2="92" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Pushdown / cable: upright, elbows tucked, forearms pressing down
function PushdownSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      {/* cable anchor above */}
      <line x1="30" y1="0"  x2="30" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2" />
      <circle cx="30" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainee-body pose-pushdown">
        {/* torso */}
        <line x1="30" y1="20" x2="30" y2="54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* upper arms tight to sides */}
        <line x1="30" y1="28" x2="18" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="28" x2="42" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* forearms pressing down — cable handle */}
        <line x1="18" y1="38" x2="16" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="38" x2="44" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* handle bar */}
        <line x1="14" y1="56" x2="46" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* legs */}
        <line x1="30" y1="54" x2="20" y2="78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="54" x2="40" y2="78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Running: mid-stride, one knee up high, arms swinging opposite
function RunningSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      <circle cx="32" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainee-body pose-running">
        {/* torso leaning slightly forward */}
        <line x1="32" y1="20" x2="28" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* right arm forward */}
        <line x1="30" y1="30" x2="46" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* left arm back */}
        <line x1="30" y1="30" x2="14" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* right leg — knee raised high */}
        <line x1="28" y1="52" x2="40" y2="64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="64" x2="48" y2="54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* left leg — back, straight, push-off */}
        <line x1="28" y1="52" x2="18" y2="70" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="70" x2="12" y2="88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Core / crunch: seated, torso curled forward, hands at temples
function CoreSVG() {
  return (
    <svg viewBox="0 0 60 100" width="52" height="78" fill="none" aria-hidden="true" className="wc-svg">
      <circle cx="30" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" />
      <g className="trainee-body pose-core">
        {/* torso — curled forward strongly */}
        <line x1="30" y1="24" x2="24" y2="50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* hands at temples */}
        <line x1="30" y1="30" x2="18" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="30" x2="42" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        {/* legs — knees raised, feet off ground */}
        <line x1="24" y1="50" x2="14" y2="64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="14" y1="64" x2="20" y2="78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="50" x2="36" y2="64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="64" x2="30" y2="78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const POSE_MAP: Record<PoseName, () => React.ReactElement> = {
  squat:     SquatSVG,
  deadlift:  DeadliftSVG,
  bench:     BenchSVG,
  overhead:  OverheadSVG,
  pullup:    PullupSVG,
  pushdown:  PushdownSVG,
  running:   RunningSVG,
  core:      CoreSVG,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildTrainerSpeech(ex: WorkoutExercise): string {
  const firstSet = ex.sets[0];
  const sets = ex.sets.length;
  const weight = firstSet?.weightKg;
  return `${ex.exerciseName} — ${sets} set${sets !== 1 ? 's' : ''}${weight ? ` @ ${weight} kg` : ''}`;
}

function buildTraineeAction(ex: WorkoutExercise): string {
  const s = ex.sets[0];
  if (!s) return 'Ready!';
  const parts = [];
  if (s.reps != null) parts.push(`${s.reps} reps`);
  if (s.weightKg != null) parts.push(`${s.weightKg} kg`);
  return parts.join(' × ') || 'Working hard';
}

// ── Main Card ─────────────────────────────────────────────────────────────────

export function WorkoutCard({ workout }: { workout: Workout }) {
  const wtClass = getWorkoutClass(workout.name);
  const startTime = formatTime(workout.startedAt);
  const endTime   = formatTime(workout.completedAt);
  const hasMany   = workout.exercises.length > 1;

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!hasMany) return;
    const id = setInterval(() => setActiveIdx(i => (i + 1) % workout.exercises.length), 3500);
    return () => clearInterval(id);
  }, [hasMany, workout.exercises.length]);

  const activeEx  = workout.exercises[activeIdx] ?? workout.exercises[0];
  const pose      = activeEx ? getPose(activeEx.muscleGroup, activeEx.category) : 'deadlift';
  const PoseSVG   = POSE_MAP[pose];

  return (
    <div className={`workout-card ${wtClass} rounded-xl p-5 flex flex-col gap-4`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="wc-title font-bold text-lg tracking-tight transition-colors duration-300"
            style={{ color: 'var(--wt-color)' }}>
          {workout.name ?? 'Workout'}
        </h3>
        {startTime && (
          <span className="wc-time text-xs tabular-nums text-muted-foreground transition-colors duration-300">
            {startTime}{endTime ? ` → ${endTime}` : ''}
          </span>
        )}
      </div>

      {/* Characters */}
      <div className="flex items-end gap-4 px-2">
        {/* Trainer */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="wc-trainer-bubble text-xs px-2 py-1 rounded-lg rounded-bl-none max-w-[140px] text-center leading-tight transition-all duration-300"
               style={{ background: 'color-mix(in srgb, var(--wt-color) 15%, transparent)', border: '1px solid var(--wt-color)', color: 'var(--wt-color)' }}>
            {activeEx ? buildTrainerSpeech(activeEx) : 'Great work today!'}
          </div>
          <div style={{ color: 'var(--wt-color)' }}>
            <TrainerSVG />
          </div>
          <span className="wc-label text-[10px] font-medium text-muted-foreground transition-colors duration-300">Trainer</span>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch opacity-30" style={{ background: 'var(--wt-color)' }} />

        {/* Trainee */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="wc-trainee-bubble text-xs px-2 py-1 rounded-lg rounded-br-none max-w-[140px] text-center leading-tight bg-muted text-muted-foreground transition-all duration-300">
            {activeEx ? buildTraineeAction(activeEx) : 'Lets go!'}
          </div>
          <div style={{ color: 'var(--wt-color)' }}>
            <PoseSVG />
          </div>
          <span className="wc-label text-[10px] font-medium text-muted-foreground transition-colors duration-300">You</span>
        </div>
      </div>

      {/* Exercise cycle dots */}
      {hasMany && (
        <div className="flex justify-center gap-1.5">
          {workout.exercises.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'wc-dot-active w-4'
                  : 'wc-dot-inactive w-1.5'
              }`}
              style={i === activeIdx
                ? { background: 'var(--wt-color)' }
                : { background: 'color-mix(in srgb, var(--wt-color) 35%, transparent)' }
              }
              aria-label={`Exercise ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Exercise list */}
      <div className="flex flex-col gap-3">
        {workout.exercises.map((ex, i) => (
          <div key={ex.id} className={i === activeIdx ? 'opacity-100' : 'opacity-60'}>
            <div className="flex items-center gap-2 mb-1">
              <span className="exercise-tag text-xs font-semibold px-1.5 py-0.5 rounded transition-all duration-300"
                    style={{ background: 'color-mix(in srgb, var(--wt-color) 15%, transparent)', color: 'var(--wt-color)' }}>
                {ex.muscleGroup.replace(/_/g, ' ')}
              </span>
              <span className="exercise-name text-sm font-medium transition-colors duration-300">{ex.exerciseName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

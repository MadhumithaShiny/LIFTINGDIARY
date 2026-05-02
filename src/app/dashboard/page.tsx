import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DatePicker } from '@/components/dashboard/date-picker';
import { WorkoutCard } from '@/components/dashboard/workout-card';
import { getWorkoutsForDate } from './actions';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect('/');

  const params = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  // Clamp to today if a future date was somehow passed in the URL
  const requested = params.date ?? today;
  const date = requested > today ? today : requested;

  const workouts = await getWorkoutsForDate(user.id, date);

  return (
    <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workout Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {workouts.length > 0
              ? `${workouts.length} workout${workouts.length > 1 ? 's' : ''} logged`
              : 'No workouts logged for this day'}
          </p>
        </div>
        <DatePicker value={date} max={today} />
      </div>

      {/* Workout cards */}
      {workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4 select-none">🏋️</div>
          <p className="text-lg font-medium text-muted-foreground">Rest day or no log yet</p>
          <p className="text-sm text-muted-foreground mt-1">Pick another date or log a workout.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {workouts.map((w) => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </div>
      )}
    </main>
  );
}

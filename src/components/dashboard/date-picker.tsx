'use client';

import { useRouter } from 'next/navigation';

export function DatePicker({ value, max }: { value: string; max: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="workout-date" className="text-sm font-medium text-muted-foreground">
        Date
      </label>
      <input
        id="workout-date"
        type="date"
        value={value}
        max={max}
        onChange={(e) => router.push(`/dashboard?date=${e.target.value}`)}
        className="
          bg-card text-foreground border border-border rounded-md px-3 py-1.5 text-sm
          focus:outline-none focus:ring-2 focus:ring-ring
          [color-scheme:dark]
          cursor-pointer
        "
      />
    </div>
  );
}

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <main className="flex-1 flex flex-col">
      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6 bg-gradient-to-b from-background to-muted/40">
        <Badge variant="outline" className="text-xs tracking-widest uppercase px-3 py-1">
          Your lifting journal
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
          Every rep.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-400">
            Every set.
          </span>{' '}
          Every PR.
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
          Lifting Diary pairs you with an animated trainer — visualise your workout session, cycle through exercises, and track every set with weight and RPE.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-8 font-semibold">
              Get started free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="px-8">
              Sign in
            </Button>
          </SignInButton>
        </div>

        {/* Mini preview strip — static colour-coded workout type pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {[
            { label: 'Push Day',      cls: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
            { label: 'Pull Day',      cls: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300' },
            { label: 'Leg Day',       cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
            { label: 'Shoulder Day',  cls: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
            { label: 'Cardio',        cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
            { label: 'Arm Day',       cls: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
          ].map(({ label, cls }) => (
            <span key={label} className={`text-xs font-semibold px-3 py-1 rounded-full ${cls}`}>
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">What you get</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <Card className="border-violet-200 dark:border-violet-800/50">
            <CardHeader className="pb-2">
              <div className="text-3xl mb-1">📅</div>
              <CardTitle className="text-base">Date-filtered dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Pick any past date to instantly see every workout you logged — no scrolling, no search.
            </CardContent>
          </Card>

          <Card className="border-cyan-200 dark:border-cyan-800/50">
            <CardHeader className="pb-2">
              <div className="text-3xl mb-1">🎨</div>
              <CardTitle className="text-base">Colour-coded workout types</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Push, Pull, Legs, Cardio — each gets its own accent colour that adapts between light and dark themes.
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-800/50">
            <CardHeader className="pb-2">
              <div className="text-3xl mb-1">🏋️</div>
              <CardTitle className="text-base">Animated trainer & you</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              A stick-figure trainer calls out each exercise while you cycle through 8 distinct exercise poses — squat, deadlift, pull-up, overhead press and more.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { step: '1', title: 'Log your workout', body: 'Record exercises, sets, reps, weight and RPE after each session.' },
              { step: '2', title: 'Open the dashboard', body: 'Use the date picker to jump to any day you trained.' },
              { step: '3', title: 'Watch it come alive', body: 'Your trainer instructs and your animated self performs each lift — in sequence.' },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                  {step}
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 gap-5 bg-gradient-to-t from-muted/40 to-background">
        <h2 className="text-3xl font-extrabold tracking-tight">Ready to start logging?</h2>
        <p className="text-muted-foreground max-w-sm">
          Free to use. No credit card. Just sign up and track your first workout in under a minute.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg" className="px-10 font-semibold">
            Get started — it&apos;s free
          </Button>
        </SignUpButton>
      </section>
    </main>
  );
}

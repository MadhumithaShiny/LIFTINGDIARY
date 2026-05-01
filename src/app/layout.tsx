import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lifting Diary",
  description: "Track your lifts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const displayName = user?.firstName ?? user?.username ?? user?.emailAddresses[0]?.emailAddress ?? null;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ClerkProvider>
          <header className="flex items-center justify-between px-6 py-4 border-b border-border">
            <span className="font-bold text-lg tracking-tight">Lifting Diary</span>

            <div className="flex items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="btn-sign-in px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-sign-up px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <div className="flex items-center gap-2">
                  {displayName && (
                    <span className="text-sm font-medium">{displayName}</span>
                  )}
                  <UserButton />
                </div>
              </Show>

              <ThemeToggle />
            </div>
          </header>

          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

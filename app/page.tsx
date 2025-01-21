"use client"

import Image from "next/image";
import { useSession } from "next-auth/react";
import { auth } from "../auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap, MessageSquare, Settings, Shield, LogOut, LayoutDashboard } from 'lucide-react';
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col min-h-screen dark bg-gray-900 text-gray-100 scroll-smooth">
      <Header session={session} />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <OpenSourceSection />
        <CallToActionSection />
      </main>
      <Footer />

    </div>
  );
}

function Header({ session }) {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="#">
        <Bot className="h-6 w-6" />
        <span className="ml-2 text-lg font-bold">Luma</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
          Features
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
          Pricing
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#faq">
          FAQ
        </Link>
        {session ? (
          <ProfileMenu session={session} />
        ) : (
          <Button asChild disabled className="opacity-50 cursor-not-allowed">
            <Link href="">Sign In</Link>
          </Button>
        )} 
      </nav>
    </header>
  );
}

function ProfileMenu({ session }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center">
        <Image src={session.user.image} alt="Profile" width={32} height={32} className="rounded-full" />
        <span className="ml-2 text-sm font-medium">{session.user.name}</span>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2">
          <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/api/auth/signout" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Link>
        </div>
      )}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 min-h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Meet Luma
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl dark:text-gray-400">
              The ultimate Discord companion. Moderation, music, games, and more - all in one powerful bot (coming soon).
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild disabled className="opacity-50 cursor-not-allowed">
              <Link href="#">Add to Discord</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://www.youtube.com/watch?v=dB6_sUIvFoQ">View Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={Zap} title="Powerful Commands" description="Access a wide range of commands for moderation, fun, and utility." />
          <FeatureCard icon={MessageSquare} title="Logging" description="Always know what's happening in your server with in-depth logging features." />
          <FeatureCard icon={Settings} title="Customization" description="Tailor the bot to fit your server's unique needs and style." />
          <FeatureCard icon={Shield} title="24/7 Uptime" description="Rely on our bot to be there when you need it, around the clock." />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <Icon className="h-6 w-6 mb-2" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}

function OpenSourceSection() {
  return (
    <section id="open-source" className="w-full py-12 md:py-24 lg:py-32 bg-gray-700 min-h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Fully Open Source and Free</h2>
            <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl dark:text-gray-400">
            Luma is fully open source and free to use. Contribute to the project or customize it to fit your needs.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild>
              <Link href="https://github.com/cloudyio/luma-dash">View on GitHub</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToActionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 min-h-screen flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to transform your server?</h2>
            <p className="mx-auto max-w-[600px] text-gray-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Add Luma to your Discord server now and experience the difference.
            </p>
          </div>
          <Button size="lg" asChild disabled className="opacity-50 cursor-not-allowed">
            <Link href="#">Add to Discord</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
      <p className="text-xs text-gray-400">© 2025 Luma. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4 text-gray-400" href="#">
          Privacy
        </Link>
      </nav>
    </footer>
  );
}

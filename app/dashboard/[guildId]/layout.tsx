"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useRouter } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster"

export default function Layout({ 
  children,
}: { 
  children: React.ReactNode
}) {

  const router = useRouter();
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <div className="lg:block">
          <AppSidebar />
        </div>
        <main className="flex-1 min-h-screen w-full">
          <div className="top-4 lg:hidden">
            <SidebarTrigger />
          </div>
          {children}
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  )
}

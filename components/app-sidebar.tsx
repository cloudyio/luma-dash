"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronDown, LayoutDashboard, PlusCircle, Settings, Shield, FileText, Package } from "lucide-react"
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function AppSidebar() {
  const router = useRouter();
  const BOT_ID = "1301225522587631689"; 
  const { data: session, status } = useSession()
  const [servers, setServers] = useState<{ bot_in: any[], bot_not_in: [] }>({
    bot_in: [],
    bot_not_in: []
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState(null)
  const { isReady } = router;

  const pathname = usePathname();

  const currentGuildId = pathname.match(/\/(\d+)(\/|$)/)?.[1];

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/get_user_guilds")
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            return;
          }
          setServers({
            bot_in: data.bot_in || [],
            bot_not_in: data.bot_not_in || []
          });
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [status]) 

  const filteredServers = {
    bot_in: servers.bot_in.filter(server => 
      server.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    bot_not_in: servers.bot_not_in.filter(server => 
      server.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const currentGuild = servers.bot_in.find(server => server.id === currentGuildId);

  const navigateTo = (path: string) => {
    if (currentGuildId) {
      router.push(`/dashboard/${currentGuildId}${path}`);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <Sidebar className="h-screen border-r flex flex-col">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-12 cursor-pointer">
                <SidebarMenuButton className="text-lg font-bold flex items-center p-2 cursor-pointer hover:bg-gray-800">
                  {currentGuild ? (
                    <span className="text-base">{currentGuild.name}</span>
                  ) : (
                    <span className="text-base">Select Server</span>
                  )}
                  <ChevronDown className="ml-auto w-5 h-5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                {filteredServers.bot_in.map((server) => (
                  <DropdownMenuItem key={server.id} className="cursor-pointer hover:bg-gray-800">
                    <div className="flex items-center">
                      <span><a href={`/dashboard/${server.id}`}>{server.name}</a></span>
                    </div>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-800">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  <span><a href="/dashboard">Add to a Server</a></span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton onClick={() => router.push(`/dashboard/${currentGuildId}`)} asChild>
              <div className={`sidebar-button cursor-pointer hover:bg-gray-800 ${isActive(`/dashboard/${currentGuildId}`) ? 'border-l-4 border-blue-500' : ''}`}>
                <LayoutDashboard className="mr-4 w-5 h-5" />
                <span className="text-base">Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton onClick={() => router.push(`/dashboard/${currentGuildId}/modules`)} asChild>
              <div className={`sidebar-button cursor-pointer hover:bg-gray-800 ${isActive(`/dashboard/${currentGuildId}/modules`) ? 'border-l-4 border-blue-500' : ''}`}>
                <Package className="mr-4 w-5 h-5" />
                <span className="text-base">Modules</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton onClick={() => router.push(`/dashboard/${currentGuildId}/permission`)} asChild>
              <div className={`sidebar-button cursor-pointer hover:bg-gray-800 ${isActive(`/dashboard/${currentGuildId}/permission`) ? 'border-l-4 border-blue-500' : ''}`}>
                <Shield className="mr-4 w-5 h-5" />
                <span className="text-base">Permissions</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton onClick={() => router.push("/logs")} asChild>
              <div className={`sidebar-button cursor-pointer hover:bg-gray-800 ${isActive("/logs") ? 'border-l-4 border-blue-500' : ''}`}>
                <FileText className="mr-4 w-5 h-5" />
                <span className="text-base">Logs</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton onClick={() => router.push("/settings")} asChild>
              <div className={`sidebar-button cursor-pointer hover:bg-gray-800 ${isActive("/settings") ? 'border-l-4 border-blue-500' : ''}`}>
                <Settings className="mr-4 w-5 h-5" />
                <span className="text-base">Settings</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  )
}


import { ChevronDown, LayoutDashboard, Terminal, FileClock } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSubItem,
  SidebarMenuSub,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarContent,
  
} from "@/components/ui/sidebar";

import CollapseMenu from "@/components/collapse-sidebar";




// Configurations for each folder

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10">
                <div className="rounded-full bg-black w-8 h-8"> </div> 
                <p className="font-semibold">Cloudy's Server</p> 
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </SidebarMenuItem>

          <SidebarContent>
            <SidebarMenuButton asChild className="mt-2 font-semibold">
              <a href="#"><LayoutDashboard /> Dashboard</a>
            </SidebarMenuButton>
            <CollapseMenu />
            <SidebarMenuButton asChild className="font-semibold">
              <a href="#"><Terminal /> Commands</a>
            </SidebarMenuButton>
            <SidebarMenuButton asChild className="font-semibold">
              <a href="#"><FileClock /> Logs</a>
            </SidebarMenuButton>

          </SidebarContent>
    
          
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}

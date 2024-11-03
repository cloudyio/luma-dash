import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Search } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"


export default function Home() {
  return (
    <div className="flex min-h-screen relative">
      <SidebarProvider>
        <div className="flex">
          <AppSidebar />
          <SidebarTrigger />
        </div>

        <header className="absolute top-0 right-0 p-4 flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.ng" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <span className="font-medium">cloudy</span>
        </header>

        <main className="flex-1 p-6 mt-16">
          <h1 className="text-3xl font-bold mb-4 flex justify-center md:justify-start">Basic Settings</h1>
          <div className="flex flex-wrap justify-center md:justify-start">
            <Card className="w-[350px] md:mr-4 mb-4 lg:mb-0">
              <CardHeader>
                <CardTitle>Server Info</CardTitle>
                <CardDescription>Basic stats for (server_name)</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Members: 256</p>
                <p>Bots: 13</p>
                <p>Roles: 23</p>
                <p>Channels: 30</p>
              </CardContent>
              <CardFooter>
                <CardDescription>All stats are approximate.</CardDescription>
              </CardFooter>
            </Card>
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Bot Settings</CardTitle>
                <CardDescription>Edit basic bot settings for your server</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="prefix">Prefix</Label>
                      <Input id="prefix" placeholder="-" defaultValue="-" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="nick">Nickname</Label>
                      <Input id="nick" placeholder="aiobot"/>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between"></CardFooter>
            </Card>
          </div>
          <h1 className="text-3xl font-bold mt-4 flex justify-center md:justify-start mb-4">Modules</h1>
          <div className="relative mb-3 w-7/12">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input 
            type="text" 
            placeholder="Search Modules" 
            className="h-10 pl-10"
          />
        </div>
          <div className="flex flex-wrap justify-center md:justify-start">
            
            <Card className="w-[350px] md:mr-4 mb-4  ">
              <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    Moderation
                    <Badge className="ml-3">Core</Badge>
                  </div>
                  <Switch />
                </div>
              </CardTitle>
              </CardHeader>
              <CardContent>
                Use a high quality moderation module to manage your server
              </CardContent>
              <CardFooter>
                <CardDescription>It is recomended to have this on</CardDescription>
              </CardFooter>
            </Card>

            <Card className="w-[350px] md:mr-4 mb-4 ">
              <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    Moderation
                    
                  </div>
                  <Switch />
                </div>
              </CardTitle>
              </CardHeader>
              <CardContent>
                Entertain your server members with simple but fun commands
              </CardContent>
              <CardFooter>
                <CardDescription>Can become spammy</CardDescription>
              </CardFooter>
            </Card>

            <Card className="w-[350px] md:mr-4 mb-4">
              <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    Misc
                    
                  </div>
                  <Switch />
                </div>
              </CardTitle>
              </CardHeader>
              <CardContent>
                Random commands which dont have a specific module
              </CardContent>
              <CardFooter>
                <CardDescription>Idk what to put for this one</CardDescription>
              </CardFooter>
            </Card>

            <Card className="w-[350px] md:mr-4 mb-4">
              <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    Tickets
                    <Badge className="ml-3">Core</Badge>
                  </div>
                  <Switch />
                </div>
              </CardTitle>
              </CardHeader>
              <CardContent>
                Ticket system to manage requests on your server
              </CardContent>
              <CardFooter>
                <CardDescription>empty</CardDescription>
              </CardFooter>
            </Card>
            
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
          <span className="font-medium">Username</span>
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
          <h1 className="text-3xl font-bold mt-4 flex justify-center md:justify-start">Modules</h1>
        </main>
      </SidebarProvider>
    </div>
  )
}
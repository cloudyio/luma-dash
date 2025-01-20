"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { ServerCard } from "@/components/server-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Settings } from "lucide-react"

const BOT_ID = "1301225522587631689"; 

export default function Dashboard() { 
  const { data: session, status } = useSession()
  const [servers, setServers] = useState<{ bot_in: any[], bot_not_in: any[] }>({
    bot_in: [],
    bot_not_in: []
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/get_user_guilds")
        .then((res) => {
          return res.json();
        })
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Not logged in</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Select a server:</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search servers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <Tabs defaultValue="managed" className="space-y-6">
          <div className="flex md:block justify-center w-full border-b pb-2">
            <TabsList className="inline-flex h-10">
              <TabsTrigger value="managed">
                Bot Servers ({filteredServers.bot_in.length})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available Servers ({filteredServers.bot_not_in.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="managed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServers.bot_in.map((server) => (
                <ServerCard 
                  key={server.id} 
                  server={{...server, bot_added: true}}
                  botId={BOT_ID}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServers.bot_not_in.map((server) => (
                <ServerCard 
                  key={server.id} 
                  server={{...server, bot_added: false}}
                  botId={BOT_ID}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

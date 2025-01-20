import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ServerCardProps {
  server: {
    id: string
    name: string
    icon: string
    owner: boolean
    permissions: string
    member_count?: number
    bot_added?: boolean
  }
  onManageClick: (serverId: string) => void
  botId: string 
}

export function ServerCard({ server, onManageClick, botId }: ServerCardProps) {
  const router = useRouter()
  const iconURL = server.icon 
    ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
    : undefined

  const hasAdminPermissions = server.owner || 
    (BigInt(server.permissions) & BigInt(0x8)) === BigInt(0x8)

  const handleAction = () => {
    if (server.bot_added) {
      router.push(`/dashboard/${server.id}`)
    } else {
      const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=8&scope=bot&guild_id=${server.id}&disable_guild_select=true`;
      window.open(inviteUrl, '_blank');
    }
  };

  return (
    <Card className="hover:bg-accent/50 transition-all">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={iconURL} />
          <AvatarFallback className="text-lg font-semibold">
            {server.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <CardTitle className="line-clamp-1">{server.name}</CardTitle>
          <div className="flex gap-2">
            {server.owner && (
              <Badge variant="default" className="gap-1">
                <Shield className="h-3 w-3" />
                Owner
              </Badge>
            )}
            {!server.owner && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end items-center mt-4">
        <Button 
          variant={server.bot_added ? "default" : "secondary"}
          onClick={handleAction}
        >
          {server.bot_added ? "Manage Bot" : "Add Bot"}
        </Button>
      </CardFooter>
    </Card>
  )
}

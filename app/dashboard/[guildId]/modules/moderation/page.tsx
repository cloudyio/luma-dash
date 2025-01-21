"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Spinner } from '@/components/ui/spinner';
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { MultiSelect } from "@/components/multi-select";

export default function ModerationPage({ params }: { params: { guildId: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [guildId, setGuildId] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [channels, setChannels] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [warningLogChannel, setWarningLogChannel] = useState<string | null>(null)
  const [banLogChannel, setBanLogChannel] = useState<string | null>(null)
  const [kickLogChannel, setKickLogChannel] = useState<string | null>(null)
  const [moderatorRole, setModeratorRole] = useState<string | null>(null)
  const [lockdownChannels, setLockdownChannels] = useState<string[]>([])
  const [timeoutLogChannel, setTimeoutLogChannel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [infractionLogs, setInfractionLogs] = useState<any>({ warnings: [], bans: [], kicks: [] })
  const [optionalFields, setOptionalFields] = useState({
    warningLogChannel: true,
    banLogChannel: true,
    kickLogChannel: true,
    lockdownChannels: true,
    timeoutLogChannel: true
  })
  const { toast } = useToast()

  useEffect(() => {
    setGuildId(params.guildId)
  }, [params.guildId])

  useEffect(() => {
    if (guildId) {
      fetch(`/api/get_guild_info?guildId=${guildId}`)
        .then(response => {
          if (response.status === 401) {
            toast({
              title: "Error",
              description: "You do not have the necessary permissions to access this page.",
              variant: "destructive",
            });
            router.push(`/dashboard`);
            return;
          }
          return response.json();
        })
        .then(data => {
          if (!data) return;
          setHasPermission(true);
        })
        .catch(error => {
          console.error('Error fetching guild info:', error);
        });
    }
  }, [guildId, router]);

  useEffect(() => {
    if (guildId) {
      setChannels([
        { id: '1', name: 'general' },
        { id: '2', name: 'logs' },
        { id: '3', name: 'moderation' },
        { id: '4', name: 'music' },
        { id: '5', name: 'random' },
        { id: '6', name: 'memes' },
      ])
      setRoles([
        { id: '1', name: 'Admin' },
        { id: '2', name: 'Moderator' }
      ])
      setLoading(false)
    }
  }, [guildId])

  if (!hasPermission) {
    return null;
  }

  const handleSaveChanges = async () => {
    if (!moderatorRole) {
      toast({
        title: "Error",
        description: "Moderator role is required",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    // Save changes logic here
    setUpdating(false);
    toast({
      title: "Success",
      description: "Moderation settings updated successfully",
      variant: "success",
    });
  };

  const handleToggleChange = (field: string) => {
    setOptionalFields(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  const handleLockdownChannelChange = (value: string[]) => {
    setLockdownChannels(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6">
      <div className="w-full max-w-full">
        <h2 className="text-3xl font-bold mb-6">Moderation Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Warning Log Channel</Label>
                <div className="flex items-center">
                  <Switch 
                    checked={optionalFields.warningLogChannel}
                    onCheckedChange={() => handleToggleChange('warningLogChannel')}
                    size="small"
                  />
                </div>
                {optionalFields.warningLogChannel && (
                  <Select 
                    value={warningLogChannel} 
                    onValueChange={(value) => setWarningLogChannel(value)}
                    onBlur={handleSaveChanges}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a channel..." />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map(channel => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Select Ban Log Channel</Label>
                <div className="flex items-center">
                  <Switch 
                    checked={optionalFields.banLogChannel}
                    onCheckedChange={() => handleToggleChange('banLogChannel')}
                    size="small"
                  />
                </div>
                {optionalFields.banLogChannel && (
                  <Select 
                    value={banLogChannel} 
                    onValueChange={(value) => setBanLogChannel(value)}
                    onBlur={handleSaveChanges}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a channel..." />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map(channel => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Select Kick Log Channel</Label>
                <div className="flex items-center">
                  <Switch 
                    checked={optionalFields.kickLogChannel}
                    onCheckedChange={() => handleToggleChange('kickLogChannel')}
                    size="small"
                  />
                </div>
                {optionalFields.kickLogChannel && (
                  <Select 
                    value={kickLogChannel} 
                    onValueChange={(value) => setKickLogChannel(value)}
                    onBlur={handleSaveChanges}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a channel..." />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map(channel => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label>Select Timeout Log Channel</Label>
                <div className="flex items-center">
                  <Switch 
                    checked={optionalFields.timeoutLogChannel}
                    onCheckedChange={() => handleToggleChange('timeoutLogChannel')}
                    size="small"
                  />
                </div>
                {optionalFields.timeoutLogChannel && (
                  <Select 
                    value={timeoutLogChannel} 
                    onValueChange={(value) => setTimeoutLogChannel(value)}
                    onBlur={handleSaveChanges}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a channel..." />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map(channel => (
                        <SelectItem key={channel.id} value={channel.id}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lockdown Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Select Lockdown Channels</Label>
                <div className="flex items-center">
                  <Switch 
                    checked={optionalFields.lockdownChannels}
                    onCheckedChange={() => handleToggleChange('lockdownChannels')}
                    size="small"
                  />
                </div>
                {optionalFields.lockdownChannels && (
                  <MultiSelect
                    options={channels.map(channel => ({
                      label: channel.name,
                      value: channel.id
                    }))}
                    onValueChange={handleLockdownChannelChange}
                    defaultValue={lockdownChannels}
                    placeholder="Select channels..."
                    maxCount={3}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
        <Card>
            <CardHeader>
              <CardTitle>Moderator Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Moderator Role</Label>
                <Select 
                  value={moderatorRole} 
                  onValueChange={(value) => setModeratorRole(value)}
                  onBlur={handleSaveChanges}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
        </div>

        <Separator className="my-6" />
        
        <h3 className="text-2xl font-bold mb-4">Infraction Logs</h3>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              {infractionLogs.warnings.length > 0 ? (
                <ul>
                  {infractionLogs.warnings.map((log: any) => (
                    <li key={log.id}>{log.details}</li>
                  ))}
                </ul>
              ) : (
                <p>No warnings found.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bans</CardTitle>
            </CardHeader>
            <CardContent>
              {infractionLogs.bans.length > 0 ? (
                <ul>
                  {infractionLogs.bans.map((log: any) => (
                    <li key={log.id}>{log.details}</li>
                  ))}
                </ul>
              ) : (
                <p>No bans found.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Kicks</CardTitle>
            </CardHeader>
            <CardContent>
              {infractionLogs.kicks.length > 0 ? (
                <ul>
                  {infractionLogs.kicks.map((log: any) => (
                    <li key={log.id}>{log.details}</li>
                  ))}
                </ul>
              ) : (
                <p>No kicks found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

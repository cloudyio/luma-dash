"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Activity, Users, MessageSquare, Settings2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { UserNav } from "@/components/user-nav"
import { Spinner } from '@/components/ui/spinner';
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { modules as initialModules } from "./modules"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"

export default function DashboardPage({ params }: { params: { guildId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [guildId, setGuildId] = useState<string | null>(null);
  const [guildData, setGuildData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [prefixInput, setPrefixInput] = useState("")
  const [updatingPrefix, setUpdatingPrefix] = useState(false)
  const [nicknameInput, setNicknameInput] = useState("")
  const [updatingNickname, setUpdatingNickname] = useState(false)
  const [modules, setModules] = useState(initialModules)
  const [moduleSearch, setModuleSearch] = useState("")
  const [loadingModules, setLoadingModules] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [tempModules, setTempModules] = useState(initialModules)
  const [savingChanges, setSavingChanges] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    const fetchGuildId = async () => {
      const { guildId } = await params
      setGuildId(guildId)
    }
    fetchGuildId()
  }, [params])

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
          setGuildData(data)
          setLoading(false)
          setHasPermission(true);
        })
        .catch(error => {
          console.error('Error fetching guild info:', error)
          setLoading(false)
        })
    }
  }, [guildId, router])

  useEffect(() => {
    if (guildData?.prefix) {
      setPrefixInput(guildData.prefix)
    }
    if (guildData?.nickname) {
      setNicknameInput(guildData.nickname)
    }
  }, [guildData])

  const handlePrefixUpdate = async () => {
    if (!guildId || !prefixInput.trim()) {
      console.log("Validation failed:", { guildId, prefixInput });
      toast({
        title: "Error",
        description: "Prefix cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setUpdatingPrefix(true);
    try {
      const token = session?.accessToken;
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log("Sending request with:", { 
        guild_id: guildId, 
        prefix: prefixInput.trim() 
      });

      const response = await fetch(`/api/dashboard/settings/update_prefix`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          guild_id: guildId, 
          prefix: prefixInput.trim() 
        })
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log("Server response:", { 
        status: response.status, 
        ok: response.ok, 
        data 
      });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update prefix');
      }

      setGuildData(prev => ({ ...prev, prefix: prefixInput }));
      toast({
        title: "Success",
        description: data.message || "Bot prefix updated successfully",
        variant: "success", 
      });
    } catch (error) {
      console.error('Detailed error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        prefixInput,
        guildId
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update prefix",
        variant: "destructive",
      });
    } finally {
      setUpdatingPrefix(false);
    }
  };

  const handleNicknameUpdate = async () => {
    if (!guildId || !nicknameInput.trim()) {
      toast({
        title: "Error",
        description: "Nickname cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setUpdatingNickname(true);
    try {
      const token = session?.accessToken;
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/dashboard/settings/update_nickname`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          guild_id: guildId, 
          nickname: nicknameInput.trim() 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update nickname');
      }

      setGuildData(prev => ({ ...prev, nickname: nicknameInput }));
      toast({
        title: "Success",
        description: "Bot nickname updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update nickname",
        variant: "destructive",
      });
    } finally {
      setUpdatingNickname(false);
    }
  };

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    setTempModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, enabled } : module
    ));
    setUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    setSavingChanges(true);
    try {
      const token = session?.accessToken;
      if (!token) {
        throw new Error('Authentication required');
      }

      const modulesDict = tempModules.reduce((acc, module) => {
        acc[module.id] = module.enabled;
        return acc;
      }, {});

      const response = await fetch(`/api/dashboard/settings/update_modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          guild_id: guildId,
          modules: modulesDict
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save module changes');
      }

      setModules(tempModules);
      setUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Module changes saved successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save module changes",
        variant: "destructive",
      });
    } finally {
      setSavingChanges(false);
    }
  };

  const handleCancelChanges = () => {
    setTempModules(modules);
    setUnsavedChanges(false);
  };

  const filteredModules = tempModules.filter(module =>
    module.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
    module.description.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    );
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="h-full w-full p-6">
        <div className="w-full max-w-full">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-3xl font-bold">{guildData?.name || "Server Dashboard"}</h2>
            <UserNav />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6 mb-4 w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guildData?.total_members || "NaN"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guildData?.messages_today ?? "NaN"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guildData?.active_members ?? "NaN"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Commands Used</CardTitle>
                <Settings2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guildData?.commands_used ?? "NaN"}</div>
              </CardContent>
            </Card>
          </div>
          <Separator />
          <div className="grid gap-6 md:grid-cols-2 mt-4 mb-4 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Bot Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bot Prefix</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter prefix..." 
                      value={prefixInput}
                      onChange={(e) => setPrefixInput(e.target.value)}
                      maxLength={10}
                    />
                    <Button 
                      onClick={handlePrefixUpdate}
                      disabled={updatingPrefix}
                    >
                      {updatingPrefix ? <Spinner className="mr-2 h-4 w-4 text-white" /> : "Save"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bot Nickname</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter nickname..." 
                      value={nicknameInput}
                      onChange={(e) => setNicknameInput(e.target.value)}
                      maxLength={32}
                    />
                    <Button 
                      onClick={handleNicknameUpdate}
                      disabled={updatingNickname}
                    >
                      {updatingNickname ? <Spinner className="mr-2 h-4 w-4 text-white" /> : "Save"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4 w-full">
            <h2 className="text-2xl font-bold">Module Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search modules..." 
                className="pl-10" 
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {loadingModules ? (
                <div className="col-span-full flex justify-center">
                  <Spinner />
                </div>
              ) : filteredModules.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground">
                  No modules found
                </div>
              ) : (
                filteredModules.map((module) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <Switch 
                          id={`module-${module.id}`}
                          checked={module.enabled}
                          onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            {unsavedChanges && (
              <Toast>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">Careful, you have unsaved changes</p>
                  <Button variant="destructive" onClick={handleCancelChanges}>Cancel</Button>
                  <Button 
                    onClick={handleSaveChanges}
                    disabled={savingChanges}
                  >
                    {savingChanges ? <Spinner className="mr-2 h-4 w-4 text-white" /> : "Save"}
                  </Button>
                </div>
              </Toast>
            )}
          </div>
        </div>
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}

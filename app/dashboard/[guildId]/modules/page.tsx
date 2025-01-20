"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Spinner } from '@/components/ui/spinner';
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { modules as initialModules } from "./../modules"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"

export default function ModulesPage({ params }: { params: { guildId: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [guildId, setGuildId] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState(false);
  const [modules, setModules] = useState(initialModules)
  const [moduleSearch, setModuleSearch] = useState("")
  const [loadingModules, setLoadingModules] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [tempModules, setTempModules] = useState(initialModules)
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
          setHasPermission(true);
        })
        .catch(error => {
          console.error('Error fetching guild info:', error);
        });
    }
  }, [guildId, router]);

  if (!hasPermission) {
    return null;
  }

  const handleModuleToggle = (moduleId: string, enabled: boolean) => {
    setTempModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, enabled } : module
    ));
    setUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
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

  const handleModuleClick = (moduleId: string) => {
    router.push(`/dashboard/${guildId}/modules/${moduleId}`);
  };

  return (
    <ToastProvider>
      <div className="h-full w-full p-6">
        <div className="w-full max-w-full">
          <h2 className="text-3xl font-bold mb-6">Module Management</h2>
          <div className="relative mb-6">
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
                <Card key={module.id} className="cursor-pointer">
                  <CardHeader onClick={() => handleModuleClick(module.id)}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <Switch 
                        id={`module-${module.id}`}
                        checked={module.enabled}
                        onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </CardHeader>
                  <CardContent onClick={() => handleModuleClick(module.id)}>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          {unsavedChanges && (
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="destructive" onClick={handleCancelChanges}>Cancel</Button>
              <Button onClick={handleSaveChanges}>Save</Button>
            </div>
          )}
        </div>
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}

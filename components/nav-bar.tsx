import Link from "next/link";
import { UserCircle, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 border-b bg-background z-50">
      <div className="flex h-16 items-center px-4 justify-between max-w-7xl mx-auto">
        <div className="font-bold text-xl">
          AIOBot
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/invite" className="flex items-center gap-2 hover:text-gray-300">
            <Plus className="h-5 w-5" />
            <span>Invite</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-gray-300">
            <UserCircle className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[200px]">
            <div className="flex flex-col gap-4 mt-4">
              <Link href="/invite" className="flex items-center gap-2 hover:text-gray-300">
                <Plus className="h-5 w-5" />
                <span>Invite</span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-gray-300">
                <UserCircle className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

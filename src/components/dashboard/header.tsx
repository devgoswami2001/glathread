import Link from "next/link";
import { LogOut, Bell, Settings, User as UserIcon, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { users } from "@/lib/data";
import { Logo } from "../logo";

export function DashboardHeader() {
  const currentUser = users.find(u => u.id === 'user-current');
  const userInitials = currentUser?.name.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-4 border-black/10 bg-background/80 backdrop-blur-sm px-4 md:px-6">
       <div className="flex items-center gap-4">
        <Link href="/dashboard">
            <Logo className="h-8 w-auto" />
        </Link>
       </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-black/20">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 rounded-sm border-2 border-black/20" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-sm">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
            </DropdownMenuItem>
             <DropdownMenuItem className="rounded-sm">
                <Settings className="mr-2 h-4 w-4" />
                <span>Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-sm">
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-sm">
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

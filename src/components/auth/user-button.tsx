"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface UserButtonProps {
  name?: string
  email?: string
  image?: string
}

export function UserButton({ name = "Emmanuel", email = "emmanuel@example.com", image }: UserButtonProps) {
  const router = useRouter()
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-brand-blue text-white">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>Profil</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")}>Paramètres</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/login")}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


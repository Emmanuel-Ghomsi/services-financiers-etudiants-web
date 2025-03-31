import { Bell } from "lucide-react"
import { Button } from "./button"

export function NotificationIcon() {
  return (
    <Button variant="ghost" size="icon">
      <Bell className="h-5 w-5" />
    </Button>
  )
}


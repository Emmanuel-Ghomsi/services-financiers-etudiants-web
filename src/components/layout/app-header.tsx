import { NotificationIcon } from "../ui/notification-icon"
import { UserButton } from "../auth/user-button"
import { Logo } from "./logo"

interface AppHeaderProps {
  title?: string
  userName?: string
}

export function AppHeader({ title, userName = "Emmanuel" }: AppHeaderProps) {
  return (
    <header className="w-full px-6 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Logo />
        {title && <h1 className="ml-10 text-2xl font-bold">{title}</h1>}
      </div>
      <div className="flex items-center space-x-4">
        <NotificationIcon />
        <UserButton name={userName} />
      </div>
    </header>
  )
}


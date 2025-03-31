import { NotificationIcon } from '../ui/notification-icon';
import { UserButton } from '../auth/user-button';

interface AppHeaderProps {
  title?: string;
  userName?: string;
}

export function AppHeader({ title, userName = 'Emmanuel' }: AppHeaderProps) {
  return (
    <div className="flex-1 flex items-center justify-between">
      {title && <h1 className="text-xl font-bold">{title}</h1>}
      <div className="flex items-center space-x-4 ml-auto">
        <NotificationIcon />
        <UserButton name={userName} />
      </div>
    </div>
  );
}

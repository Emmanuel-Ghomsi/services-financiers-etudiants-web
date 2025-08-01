import { Badge } from '@/components/ui/badge';
import {
  VALIDATION_STATUS_LABELS,
  VALIDATION_STATUS_COLORS,
  VALIDATION_STATUS_ICONS,
} from '@/lib/constants/validation-status';
import type { ValidationStatus } from '@/types/validation';

interface ValidationStatusBadgeProps {
  status: ValidationStatus;
  showIcon?: boolean;
}

export function ValidationStatusBadge({ status, showIcon = true }: ValidationStatusBadgeProps) {
  return (
    <Badge className={VALIDATION_STATUS_COLORS[status]} variant="secondary">
      {showIcon && <span className="mr-1">{VALIDATION_STATUS_ICONS[status]}</span>}
      {VALIDATION_STATUS_LABELS[status]}
    </Badge>
  );
}

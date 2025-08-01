import { LeaveType } from "@/types/leave"

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  [LeaveType.ANNUAL]: "Congé annuel",
  [LeaveType.SICK]: "Congé maladie",
  [LeaveType.EXCEPTIONAL]: "Congé exceptionnel",
  [LeaveType.MATERNITY]: "Congé maternité",
  [LeaveType.PATERNITY]: "Congé paternité",
  [LeaveType.UNPAID]: "Congé sans solde",
}

export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  [LeaveType.ANNUAL]: "bg-blue-100 text-blue-800",
  [LeaveType.SICK]: "bg-red-100 text-red-800",
  [LeaveType.EXCEPTIONAL]: "bg-purple-100 text-purple-800",
  [LeaveType.MATERNITY]: "bg-pink-100 text-pink-800",
  [LeaveType.PATERNITY]: "bg-green-100 text-green-800",
  [LeaveType.UNPAID]: "bg-gray-100 text-gray-800",
}

export const LEAVE_TYPE_OPTIONS = Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => ({
  value: value as LeaveType,
  label,
}))

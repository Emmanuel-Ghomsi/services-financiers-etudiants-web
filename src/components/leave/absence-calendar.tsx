'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import type { AbsenceCalendarDTO, LeaveType } from '@/types/leave';
import { LEAVE_TYPE_LABELS, LEAVE_TYPE_COLORS } from '@/lib/constants/leave-constants';

interface AbsenceCalendarProps {
  absences: AbsenceCalendarDTO[];
  isLoading?: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  employeeId: string;
  employeeName: string;
  leaveType: string;
}

export function AbsenceCalendar({ absences, isLoading }: AbsenceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Convertir les données d'absence en événements de calendrier
  const events: CalendarEvent[] = absences.flatMap((dayData) =>
    dayData.absences.map((absence) => ({
      id: `${absence.employeeId}-${dayData.date}`,
      title: `${absence.employeeName} - ${LEAVE_TYPE_LABELS[absence.leaveType as LeaveType]}`,
      date: new Date(dayData.date),
      employeeId: absence.employeeId,
      employeeName: absence.employeeName,
      leaveType: absence.leaveType,
    }))
  );

  // Obtenir les jours du mois actuel
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Jours du mois précédent pour compléter la première semaine
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => event.date.toDateString() === date.toDateString());
  };

  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendrier des absences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Chargement du calendrier...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const days = getDaysInMonth(currentDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendrier des absences
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Navigation du calendrier */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Aujourd'hui
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* En-têtes des jours */}
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
              {day}
            </div>
          ))}

          {/* Jours du calendrier */}
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border border-gray-200 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${isToday ? 'text-blue-600' : ''}`}
                >
                  {day.date.getDate()}
                </div>

                {/* Événements du jour */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded truncate"
                      style={{ backgroundColor: '#3b82f6', color: 'white' }}
                      title={event.title}
                    >
                      {event.employeeName}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 2} autre(s)</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Légende des types de congés</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LEAVE_TYPE_LABELS).map(([type, label]) => (
              <Badge
                key={type}
                className={LEAVE_TYPE_COLORS[type as LeaveType]}
                variant="secondary"
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from './util/event-util';
import { injectDispatch } from '@ngrx/signals/events';
import { calendarEvents } from './store/calendarEvent';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarStore } from './store/calendarStore';
import { ExpenseDetailModalComponent } from './components/expense-detail-modal/expense-detail-modal';
import { ExpenseDTO } from '../../types/generated';
@Component({
  selector: 'app-calendar-component',
  imports: [FullCalendarModule, MatDialogModule],
  templateUrl: './calendar-component.html',
  styleUrl: './calendar-component.css',
})

export class CalendarComponent {
  calendarVisible = signal(true);
  readonly dispatch = injectDispatch(calendarEvents);
  readonly store = inject(CalendarStore);
  readonly dialog = inject(MatDialog);
  calendarOptions = signal<CalendarOptions>({
    height: '100%',
    expandRows: true,
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) {
    effect(() => {
      const newEvents = this.store.expenses();
      this.calendarOptions.update(opts => ({
        ...opts,
        events: newEvents
      }));
    });
  }

  handleCalendarToggle(): void {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle(): void {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect({ startStr }: DateSelectArg): void {
    this.dispatch.openExpenseModal({ startStr, isRecurring: false });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    const expense = clickInfo.event.extendedProps['expense'] as ExpenseDTO | undefined;
    if (!expense) return;
    this.dialog.open(ExpenseDetailModalComponent, {
      data: { expense },
      width: '440px',
      panelClass: 'expense-detail-panel',
    });
  }

  handleEvents(events: EventApi[]): void {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}

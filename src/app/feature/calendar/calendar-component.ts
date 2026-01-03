import { ChangeDetectorRef, Component, effect, inject, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {INITIAL_EVENTS } from './util/event-util';
import { injectDispatch } from '@ngrx/signals/events';
import { calendarEvents } from './store/calendarEvent';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarStore } from './store/calendarStore';
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
    initialEvents: INITIAL_EVENTS,
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
    this.dispatch.openExpenseModal({ startStr });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]): void {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}

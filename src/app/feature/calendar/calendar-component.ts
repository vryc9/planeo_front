import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { createEventId, INITIAL_EVENTS } from './util/event-util';
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
    height : '100%',
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
  }


  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect({startStr}: DateSelectArg) {
    this.dispatch.openExpenseModal({startStr});

    // console.log("wewe");
    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect();

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log("Clique");
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

}

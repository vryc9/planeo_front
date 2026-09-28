import { ContextMenuTriggerDirective } from './../../shared/context-menu/context-menu-trigger.directive';
import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';
import frLocale from '@fullcalendar/core/locales/fr';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi, EventClickArg, EventDropArg } from '@fullcalendar/core/index.js';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { injectDispatch } from '@ngrx/signals/events';
import { calendarEvents } from './store/calendarEvent';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CalendarStore } from './store/calendarStore';
import { ExpenseDetailModalComponent } from './components/expense-detail-modal/expense-detail-modal';
import { ExpenseDTO } from '../../types/generated';
import { ExpenseStore } from '../expenses/store/expenseStore';
import { ExpenseEvents } from '../expenses/store/expenseEvents';
import { ContextMenuItem } from '../../shared/context-menu/context-menu-item';
import { ConfirmDialogService } from '../../shared/confirm-dialog/confirm-dialog.service';
const MOBILE_QUERY = '(max-width: 600px)';

/** Local YYYY-MM-DD (toISOString would shift the day for timezones east of UTC). */
function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

@Component({
  selector: 'app-calendar-component',
  imports: [FullCalendarModule, MatDialogModule, ContextMenuTriggerDirective, MatIconModule, DecimalPipe],
  templateUrl: './calendar-component.html',
  styleUrl: './calendar-component.css',
})

export class CalendarComponent {
  calendarVisible = signal(true);
  readonly dispatch = injectDispatch(calendarEvents);
  readonly store = inject(CalendarStore);
  readonly dialog = inject(MatDialog);
  private readonly expenseStore = inject(ExpenseStore)
  private readonly dispatchExpenseEvents = injectDispatch(ExpenseEvents)
  private readonly confirmDialog = inject(ConfirmDialogService)
  private readonly breakpointObserver = inject(BreakpointObserver);

  /** Phones get a dot-based month grid + an agenda of the selected day instead of cramped labels. */
  readonly isMobile = toSignal(
    this.breakpointObserver.observe(MOBILE_QUERY).pipe(map(({ matches }) => matches)),
    { initialValue: this.breakpointObserver.isMatched(MOBILE_QUERY) },
  );

  readonly selectedDate = signal<string>(toIsoDate(new Date()));

  readonly selectedDayExpenses = computed<ExpenseDTO[]>(() =>
    this.store.expenses()
      .map(event => event.extendedProps?.['expense'] as ExpenseDTO | undefined)
      .filter((expense): expense is ExpenseDTO => !!expense && expense.date.slice(0, 10) === this.selectedDate())
  );

  readonly selectedDayTotal = computed(() =>
    this.selectedDayExpenses().reduce((total, { amount }) => total + amount, 0)
  );

  readonly selectedDateLabel = computed(() =>
    new Date(this.selectedDate() + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  );

  calendarOptions = signal<CalendarOptions>({
    locale: frLocale,
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
    dayMaxEvents: true,
    // dateClick fires on a simple tap, whereas `select` needs a 1s long-press on touch screens.
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEvents.bind(this)
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

    effect(() => {
      const mobile = this.isMobile();
      const selected = this.selectedDate();
      this.calendarOptions.update(opts => ({
        ...opts,
        height: mobile ? 'auto' : '100%',
        expandRows: !mobile,
        fixedWeekCount: !mobile,
        dayMaxEvents: mobile ? false : true,
        dayHeaderFormat: mobile ? { weekday: 'narrow' } : { weekday: 'short' },
        headerToolbar: mobile
          ? { start: 'title', center: '', end: 'prev,next' }
          : { start: 'title', center: '', end: 'today prev,next' },
        dayCellClassNames: ({ date }) => mobile && toIsoDate(date) === selected ? ['is-selected'] : [],
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

  handleDateClick({ dateStr }: DateClickArg): void {
    if (this.isMobile()) {
      this.selectedDate.set(dateStr);
      return;
    }
    this.dispatch.openExpenseModal({ startStr: dateStr, isRecurring: false });
  }

  addExpenseOnSelectedDate(): void {
    this.dispatch.openExpenseModal({ startStr: this.selectedDate(), isRecurring: false });
  }

  deleteExpense(expense: ExpenseDTO): void {
    this.dispatchExpenseEvents.deleteExpense({ expense });
  }

  readonly menuItems = computed<readonly ContextMenuItem[]>(() => [
    { label: 'Renommer', action: () => console.log("qzdqz") },
  ]);

  handleEventClick(clickInfo: EventClickArg): void {
    const expense = clickInfo.event.extendedProps['expense'] as ExpenseDTO | undefined;
    if (!expense) return;
    // On phones the event is only a dot: tapping it selects its day in the agenda.
    if (this.isMobile()) {
      this.selectedDate.set(expense.date.slice(0, 10));
      return;
    }
    this.openExpenseDetail(expense);
  }

  openExpenseDetail(expense: ExpenseDTO): void {
    this.dialog.open(ExpenseDetailModalComponent, {
      data: { expense },
      width: '440px',
      panelClass: 'expense-detail-panel',
    });
  }

  handleEvents({ delta: { days }, event: { _def: { title } } }: EventDropArg): void {
    const expenseToUpdate = this.expenseStore.expenses().find(({ label }) => title === label);
    if (!expenseToUpdate) return;
    const expenseUpdated: ExpenseDTO = { ...expenseToUpdate, date: this.applyDaysToDate(expenseToUpdate.date, days) }
    this.dispatchExpenseEvents.updateExpense({ expense: expenseUpdated });
  }

  private applyDaysToDate(dateStr: string, days: number): string {
    const date: Date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }


  getMenuItems(event: EventApi): readonly ContextMenuItem[] {
    return [
      { label: 'Supprimer', icon: 'delete', danger: true, action: () => this.deleteEvent(event) },
    ];
  }

  private deleteEvent({ title }: EventApi): void {
    const expense = this.expenseStore.expenses().find(({ label }) => title === label);
    if (!expense) return;
    this.dispatchExpenseEvents.deleteExpense({ expense });
  }
}

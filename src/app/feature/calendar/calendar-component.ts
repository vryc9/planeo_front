import { ContextMenuTriggerDirective } from './../../shared/context-menu/context-menu-trigger.directive';
import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventDropArg } from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
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
@Component({
  selector: 'app-calendar-component',
  imports: [FullCalendarModule, MatDialogModule, ContextMenuTriggerDirective],
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

  readonly menuItems = computed<readonly ContextMenuItem[]>(() => [
    { label: 'Renommer', action: () => console.log("qzdqz") },
  ]);

  handleEventClick(clickInfo: EventClickArg): void {
    const expense = clickInfo.event.extendedProps['expense'] as ExpenseDTO | undefined;
    if (!expense) return;
    this.dialog.open(ExpenseDetailModalComponent, {
      data: { expense },
      width: '440px',
      panelClass: 'expense-detail-panel',
    });
  }

  handleEvents({ delta: { days }, event: { _def: { title } } }: EventDropArg): void {
    const expenseToUpdate: ExpenseDTO = { ...this.expenseStore.expenses().find(({ label }) => title === label) } as ExpenseDTO
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
    const expense: ExpenseDTO = { ...this.expenseStore.expenses().find(({ label }) => title === label) } as ExpenseDTO
    this.dispatchExpenseEvents.deleteExpense({ expense });
  }
}

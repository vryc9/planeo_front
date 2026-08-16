import { Component, computed, inject, input, InputSignal } from '@angular/core';
import { ActiveElement, ChartData, ChartEvent, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseDTO } from '../../../../types/generated';
import { ExpenseAmountByCategoryDTO } from '../../../../types/generated/expense-amount-by-tag-dto';
import { ExpenseCategoryModalComponent } from '../expense-category-modal/expense-category-modal';

@Component({
  selector: 'app-dashboard-tags-graph-component',
  imports: [BaseChartDirective],
  templateUrl: './dashboard-tags-graph-component.html',
  styleUrl: './dashboard-tags-graph-component.css',
})
export class DashboardTagsGraphComponent {
  private readonly dialog = inject(MatDialog);

  readonly expenseAmountByCategory: InputSignal<ExpenseAmountByCategoryDTO[]> = input.required<ExpenseAmountByCategoryDTO[]>();
  readonly expenses: InputSignal<ExpenseDTO[]> = input.required<ExpenseDTO[]>();

  readonly chartData = computed<ChartData<'bar'>>(() => ({
  labels: this.expenseAmountByCategory().map(({category : {name}}) => name),
    datasets: [
      {
        data: this.expenseAmountByCategory().map(e => e.total),
        label: 'Dépenses par catégorie',
        backgroundColor: 'rgba(79, 209, 197, 0.54)',
        borderColor: '#4FD1C5',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(79, 209, 197, 0.8)',
      }
    ]
  }));

  readonly chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 4,
    onHover: (event, elements) => {
      const target = event.native?.target as HTMLElement | undefined;
      if (target) target.style.cursor = elements.length ? 'pointer' : 'default';
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.parsed.y} €`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `${value} €`
        }
      }
    }
  };

  onChartClick(event: { event?: ChartEvent; active?: object[] }): void {
    const active = event.active as ActiveElement[] | undefined;
    if (!active?.length) return;

    const entry = this.expenseAmountByCategory()[active[0].index];
    if (!entry) return;

    const categoryExpenses = this.expenses().filter(expense => expense.category.id === entry.category.id);

    this.dialog.open(ExpenseCategoryModalComponent, {
      data: { category: entry.category, expenses: categoryExpenses },
      width: '560px',
      maxWidth: '92vw',
      panelClass: 'expense-category-panel',
    });
  }
}

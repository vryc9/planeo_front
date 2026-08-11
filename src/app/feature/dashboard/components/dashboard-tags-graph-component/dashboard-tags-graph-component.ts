import { Component, computed, input, InputSignal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ExpenseAmountByTagDTO } from '../../../../types/generated';
import { ExpenseAmountByCategoryDTO } from '../../../../types/generated/expense-amount-by-tag-dto';

@Component({
  selector: 'app-dashboard-tags-graph-component',
  imports: [BaseChartDirective],
  templateUrl: './dashboard-tags-graph-component.html',
  styleUrl: './dashboard-tags-graph-component.css',
})
export class DashboardTagsGraphComponent {
  readonly expenseAmountByCategory: InputSignal<ExpenseAmountByCategoryDTO[]> = input.required<ExpenseAmountByCategoryDTO[]>();

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
}

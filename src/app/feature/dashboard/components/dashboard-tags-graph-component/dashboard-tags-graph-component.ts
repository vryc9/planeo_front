import { Component, computed, input, InputSignal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ExpenseAmountByTagDTO } from '../../../../types/generated';
import { toTagLabel } from '../../../../shared/utils/tags-utils';

@Component({
  selector: 'app-dashboard-tags-graph-component',
  imports: [BaseChartDirective],
  templateUrl: './dashboard-tags-graph-component.html',
  styleUrl: './dashboard-tags-graph-component.css',
})
export class DashboardTagsGraphComponent {
  readonly expenseAmountByTags: InputSignal<ExpenseAmountByTagDTO[]> = input.required<ExpenseAmountByTagDTO[]>();

  readonly chartData = computed<ChartData<'bar'>>(() => ({
  labels: this.expenseAmountByTags().map(({tag}) => toTagLabel(tag)),
    datasets: [
      {
        data: this.expenseAmountByTags().map(e => e.total),
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

import { Component, computed, input, InputSignal } from '@angular/core';
import { ExpenseByTags } from '../../../expenses/types/expenseByTags';
import { Tag } from '../../../expenses/types/expense';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard-tags-graph-component',
  imports: [BaseChartDirective],
  templateUrl: './dashboard-tags-graph-component.html',
  styleUrl: './dashboard-tags-graph-component.css',
})
export class DashboardTagsGraphComponent {
  readonly expenseByTags: InputSignal<ExpenseByTags[]> = input.required<ExpenseByTags[]>();

  private readonly tagLabels: Record<number, string> = {
    [Tag.SOIREE]: 'Soirée',
    [Tag.RESTAURANT]: 'Restaurant',
  };

  readonly chartData = computed<ChartData<'bar'>>(() => ({
    labels: this.expenseByTags().map(e => this.tagLabels[e.tag] ?? e.tag.toString()),
    datasets: [
      {
        data: this.expenseByTags().map(e => e.total),
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

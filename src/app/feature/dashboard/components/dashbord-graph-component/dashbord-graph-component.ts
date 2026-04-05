import { Component, computed, input, InputSignal } from '@angular/core';
import { ExpensePerMonthView } from '../../../expenses/types/expensePerMount';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashbord-graph-component',
  imports: [BaseChartDirective],
  templateUrl: './dashbord-graph-component.html',
  styleUrl: './dashbord-graph-component.css',
})
export class DashbordGraphComponent {
  expensesPerMonth : InputSignal<ExpensePerMonthView[]> = input.required<ExpensePerMonthView[]>();

  private buildGradient(ctx: CanvasRenderingContext2D, chartArea: { top: number; bottom: number }): CanvasGradient {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(79, 209, 197, 0.54)');
    gradient.addColorStop(1, 'rgba(79, 209, 197, 0)');
    return gradient;
  }

  readonly chartData = computed<ChartData<'line'>>(() => ({
    labels: this.expensesPerMonth().map(e => e.month),
    datasets: [
      {
        data: this.expensesPerMonth().map(e => e.amount),
        label: 'Dépenses mensuelles',
        fill: true,
        tension: 0.4,
        borderColor: '#4FD1C5',
        pointBackgroundColor: '#4FD1C5',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(79, 209, 197, 0)';
          return this.buildGradient(ctx, chartArea);
        }
      }
    ]
  }));

  readonly chartOptions: ChartOptions<'line'> = {
    responsive: true,
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

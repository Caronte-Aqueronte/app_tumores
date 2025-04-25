import { Component } from '@angular/core';
import { Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);

@Component({
  selector: 'app-points-chart',
  standalone: false,
  templateUrl: './points-chart.component.html',
  styleUrl: './points-chart.component.css',
})
export class PointsChartComponent implements OnChanges {
  @Input() errorPerEpoch!: Record<number, number>;

  public scatterChartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  public lineChartType: ChartType = 'line';

  public scatterChartOptions: ChartConfiguration['options']  = {
    responsive: true,
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      },
    },
  };

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['errorPerEpoch']) {
      this.loadLineChart();
    }
  }

  private loadLineChart() {
    if (!this.errorPerEpoch) {
      return;
    }
    //las labels seran los numeros de las epocas que vienen en las llaves de Record
    const labels = Object.keys(this.errorPerEpoch);

    const data = Object.values(this.errorPerEpoch);

    this.scatterChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          label: 'Errores por época',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          borderColor: 'rgb(255, 131, 90)',
        },
      ],
    };
  }
}

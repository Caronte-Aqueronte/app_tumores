import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NeuronalNetworkService } from '../../services/neuronal-network.service';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);
@Component({
  selector: 'app-scatter-initial-dataset',
  standalone: false,
  templateUrl: './scatter-initial-dataset.component.html',
  styleUrl: './scatter-initial-dataset.component.css',
})
export class ScatterInitialDatasetComponent implements OnInit, OnChanges {
  @Input() featureNames!: any[];
  @Input() desicionBoundaryPoints!: any;
  @Input() selectedColX!: any;
  @Input() selectedColY!: any;

  @Output() event = new EventEmitter<any>();

  private initialData = [];

  public scatterChartData: ChartData<'scatter'> = {
    datasets: [],
  };
  public scatterChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public scatterChartType: ChartType = 'scatter';

  constructor(private neuronalNetworkService: NeuronalNetworkService) {}

  public ngOnInit(): void {
    this.getDataForPlot();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['featureNames']) {
      //al recibir el parametro de los features entonces seleccionamos los primeros dos de la lista
      this.selectedColX = this.featureNames[0];
      this.selectedColY = this.featureNames[1];
    }

    if (changes['selectedColX'] || changes['selectedColY']) {
      this.updateChart(true);
    }

    if (changes['desicionBoundaryPoints']) {
      this.updateChart(false);
    }
  }

  private getDataForPlot(): void {
    this.neuronalNetworkService.getDataForPlot().subscribe({
      next: (response: any) => {
        this.initialData = response;
        this.updateChart(true);
      },
    });
  }

  public updateChart(deleteDesicionBoundary: boolean): void {
    //si la bandera viene true entonces hacemos los puntos de la frontera de decion nulos para que se elemine de la grafica
    if (deleteDesicionBoundary) {
      this.desicionBoundaryPoints = null;
    }

    const features = this.initialData[0];
    const labels = this.initialData[1];

    this.scatterChartData = this.convertToChartData(
      features,
      labels,
      this.selectedColX,
      this.selectedColY
    );
    this.scatterChartOptions = this.getChartOptions(
      this.selectedColX,
      this.selectedColY
    );

    const data = {
      selectedColX: this.selectedColX,
      selectedColY: this.selectedColY,
    };
    this.event.emit(data);
  }
  private convertToChartData(
    features: any[],
    labels: any[],
    colX: any,
    colY: any
  ): ChartData<'scatter'> {
    const malignos: any[] = [];
    const benignos: any[] = [];

    for (let i = 0; i < features.length; i++) {
      const x = features[i][colX.id];
      const y = features[i][colY.id];
      const label = labels[i];

      if (label === 1) {
        malignos.push({ x, y });
      } else if (label === 0) {
        benignos.push({ x, y });
      }
    }

    const datasets: any[] = [
      {
        label: 'Maligno',
        data: malignos,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        borderColor: 'rgb(255, 29, 78)',
      },
      {
        label: 'Benigno',
        data: benignos,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        borderColor: 'rgb(0, 76, 126)',
        borderWidth: 1,
      },
    ];

    if (this.desicionBoundaryPoints) {
      const boundaryLine: any[] = [
        { x: this.desicionBoundaryPoints.x, y: this.desicionBoundaryPoints.y },
        {
          x: this.desicionBoundaryPoints.x2,
          y: this.desicionBoundaryPoints.y2,
        },
      ];

      datasets.push({
        label: 'Frontera de decisión',
        data: boundaryLine,
        type: 'line',
        borderColor: 'rgb(170, 142, 32)',
        borderWidth: 1,
      });
    }

    return { datasets };
  }

  private getChartOptions(colX: any, colY: any): ChartConfiguration['options'] {
    const xFeature = this.featureNames.find((f) => f.id === colX.id)?.name;
    const yFeature = this.featureNames.find((f) => f.id === colY.id)?.name;

    return {
      responsive: true,
      scales: {
        x: { title: { display: true, text: xFeature } },
        y: { title: { display: true, text: yFeature } },
      },

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
  }
}

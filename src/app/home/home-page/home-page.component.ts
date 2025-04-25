import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { NeuronalNetworkService } from '../../services/neuronal-network.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  public featureNames: { id: number; name: string }[] = [
    { id: 0, name: 'radius (mean)' },
    { id: 1, name: 'texture (mean)' },
    { id: 2, name: 'perimeter (mean)' },
    { id: 3, name: 'area (mean)' },
    { id: 4, name: 'smoothness (mean)' },
    { id: 5, name: 'compactness (mean)' },
    { id: 6, name: 'concavity (mean)' },
    { id: 7, name: 'concave points (mean)' },
    { id: 8, name: 'symmetry (mean)' },
    { id: 9, name: 'fractal dimension (mean)' },
    { id: 10, name: 'radius (standard error)' },
    { id: 11, name: 'texture (standard error)' },
    { id: 12, name: 'perimeter (standard error)' },
    { id: 13, name: 'area (standard error)' },
    { id: 14, name: 'smoothness (standard error)' },
    { id: 15, name: 'compactness (standard error)' },
    { id: 16, name: 'concavity (standard error)' },
    { id: 17, name: 'concave points (standard error)' },
    { id: 18, name: 'symmetry (standard error)' },
    { id: 19, name: 'fractal dimension (standard error)' },
    { id: 20, name: 'radius (worst)' },
    { id: 21, name: 'texture (worst)' },
    { id: 22, name: 'perimeter (worst)' },
    { id: 23, name: 'area (worst)' },
    { id: 24, name: 'smoothness (worst)' },
    { id: 25, name: 'compactness (worst)' },
    { id: 26, name: 'concavity (worst)' },
    { id: 27, name: 'concave points (worst)' },
    { id: 28, name: 'symmetry (worst)' },
    { id: 29, name: 'fractal dimension (worst)' },
  ];

  public selectedColX: { id: number; name: string } = {
    id: 0,
    name: 'radius (mean)',
  };
  public selectedColY: { id: number; name: string } = {
    id: 1,
    name: 'texture (mean)',
  };

  public trainForm: FormGroup;
  public predictForm: FormGroup;
  public desicionBoundaryPoints: any;
  public predictionResult!: string | null;
  public finalAccuracy!: number;
  public errorPerEpoch!: Record<number, number>;

  constructor(
    private fb: FormBuilder,
    private neuronalNetworkServise: NeuronalNetworkService,
    private toastr: ToastrService
  ) {
    this.trainForm = this.fb.group({
      max_epochs: [200, [Validators.required, Validators.min(1)]],
      learning_rate: [
        1,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      percentage_to_use: [
        80,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
    });

    this.predictForm = this.fb.group({
      first_feature: [null, [Validators.required]],
      second_feature: [null, [Validators.required]],
    });
  }

  public selectCols(event: any): void {
    this.selectedColX = event.selectedColX;
    this.selectedColY = event.selectedColY;
  }

  public ngOnInit(): void {}

  public train(): void {
    if (this.trainForm.invalid) {
      this.toastr.error(
        'Por favor, completa correctamente todos los campos.',
        'Formulario inválido'
      );
      return;
    }

    const formValue = this.trainForm.value;

    const requestBody = {
      max_epochs: formValue.max_epochs,
      learning_rate: formValue.learning_rate,
      first_feature: this.selectedColX.id,
      second_feature: this.selectedColY.id,
      percentage_to_use: formValue.percentage_to_use,
    };

    this.neuronalNetworkServise.train(requestBody).subscribe(
      (response) => {
        this.toastr.success('Entrenamiento completado exitosamente.', 'Éxito');
        this.desicionBoundaryPoints = response.desicion_boundary_points;
        this.errorPerEpoch = response.error_per_epoch;
        this.finalAccuracy = response.final_accuracy;
        this.predictionResult = null;
      },
      (error) => {
        this.toastr.error(
          'Ocurrió un error durante el entrenamiento.',
          'Error'
        );
      }
    );
  }

  public predict(): void {
    if (this.predictForm.invalid) {
      this.toastr.error(
        'Por favor, completa correctamente todos los campos.',
        'Formulario inválido'
      );
      return;
    }

    const formValue = this.predictForm.value;

    const requestBody = {
      first_feature: formValue.first_feature,
      second_feature: formValue.second_feature,
    };

    this.neuronalNetworkServise.predict(requestBody).subscribe({
      next: (response: any) => {
        this.predictionResult = response.prediction;
      },
      error: (error) => {
        this.toastr.error(error?.error?.detail, 'Error');
      },
    });
  }
}

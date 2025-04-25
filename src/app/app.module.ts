import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ToastrModule } from 'ngx-toastr';
import { provideNzI18n } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ScatterInitialDatasetComponent } from './components/scatter-initial-dataset/scatter-initial-dataset.component';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

import { NzInputModule } from 'ng-zorro-antd/input';
import { TrainedModelComponent } from './components/trained-model/trained-model.component';
import { PointsChartComponent } from './components/points-chart/points-chart.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ScatterInitialDatasetComponent,
    TrainedModelComponent,
    PointsChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BaseChartDirective,
    NzSelectModule,
    NzButtonModule,
    NzInputModule,
    FontAwesomeModule,

    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    }),

    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas); // Añadir el pack de iconos sólidos
  }
}

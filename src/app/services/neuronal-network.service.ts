import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NeuronalNetworkService {
  private apiUrl = 'http://localhost:8000/neuronal-network/';

  constructor(private http: HttpClient) {}

  public getDataForPlot(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  public train(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}train`, body);
  }
}

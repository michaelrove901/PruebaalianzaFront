import { Injectable } from '@angular/core';
import { HttpClient,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient) {}

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getClientByKey(key: string): Observable<any> {
    const url = `${this.apiUrl}/key/${key}`;
    return this.http.get<any>(url);
  }

  createClient(client: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, client);
  }
  getClientByParams(params: any): Observable<any> {
    // Construir los parámetros de búsqueda
    let queryParams = new HttpParams();
    if (params.searchKeyClient) {
      queryParams = queryParams.append('keyClient', params.searchKeyClient);
    }
    if (params.searchName) {
      queryParams = queryParams.append('name', params.searchName);
    }
    if (params.searchEmail) {
      queryParams = queryParams.append('email', params.searchEmail);
    }
    if (params.searchPhone) {
      queryParams = queryParams.append('phone', params.searchPhone);
    }
    if (params.searchStartDate) {
      queryParams = queryParams.append('startDate', params.searchStartDate);
    }
    if (params.searchEndDate) {
      queryParams = queryParams.append('endDate', params.searchEndDate);
    }

    // Realizar la solicitud HTTP con los parámetros de búsqueda
    return this.http.get<any>(`${this.apiUrl}/advancedsearch`, { params: queryParams });
  }
}
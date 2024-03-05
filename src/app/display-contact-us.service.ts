import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayContactUsService {


  constructor(private http: HttpClient) {}

 
  fetchData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/data');
  }
  deleteData(id: number): Observable<any> {
    return this.http.delete<any>('http://localhost:3000/api/data/' + id);
  }

  updateData(id: number, data: any): Observable<any> {
    return this.http.put<any>('http://localhost:3000/api/update/' + id, data);
  }
  
}
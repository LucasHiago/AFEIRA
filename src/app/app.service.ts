import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  url: string = `http://3.22.166.247/products`;

  constructor(private http: HttpClient) { }

  feed(): Observable<any> {
    return this.http.get(this.url);
  }

  addFeed(product: any): Observable<any> {
    return this.http.post(`${this.url}/create`, product);
  }

  updateFeed(product: any, id: any): Observable<any> {
    return this.http.put(`${this.url}/update/${id}`, product);
  }

  deleteFeed(id: any): Observable<any> {
    return this.http.delete(`${this.url}/delete/${id}`);
  }
}

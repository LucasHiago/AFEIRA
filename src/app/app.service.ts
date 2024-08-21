import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  socket?: Socket;
  url: string = `https://afeira-api.onrender.com/products`;
  wss: string = `https://afeira-api.onrender.com`;
  //url: string = `http://10.0.0.112:4000/products`;
  //wss: string = `http://10.0.0.112:4000`;

  public message$: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor(private http: HttpClient) {
    this.createSocketConnection();
  }

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

  //TODO: SOCKET SPACE
  createSocketConnection() {
    this.socket = io(this.wss, {
      auth: {
        token: 'cde'
      }
    });
  };

  listen(eventName: string) {
    return new Observable((subcriber) => {
      this.socket?.on(eventName, (data: any, socketId: any = this.socket?.id) => {
        subcriber.next({ data, socketId });
      })
    })
  }

  emit(eventName: string, data: any) {
    this.socket?.emit(eventName, {data, socketId: this.socket?.id});
  }
}

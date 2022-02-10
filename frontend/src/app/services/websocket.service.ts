import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: Socket;
  messages$: Subject<any>

  constructor() {}

  public connect(): AnonymousSubject<MessageEvent> {
    this.socket = io(environment.ws)
    let observable = new Observable(observer => {
      // this.socket.on('message', (data: any) => {
      //   console.log("message", data)
      //   observer.next(data)
      // })
      this.socket.on('table', (data: any) => {
        console.log("table", data)
        observer.next(data)
      })
      return () => {
        this.socket.disconnect();
      }
    })

    let observer: any = {
      next: (data: Object) => {
        // this.socket.emit('message', JSON.stringify(data))
        this.socket.emit('table', JSON.stringify(data))
      }
  
    }

    return new AnonymousSubject<any>(observer, observable)
  }

  public disconnect() {
    this.socket.disconnect()
  }

  sendMsg(msg: any) {
    console.log(msg)
    this.messages$.next(msg.contacts)
  }
}

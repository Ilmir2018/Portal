import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contact } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class TemplatePageComponent implements OnInit {

  oSub: Subscription
  contacts$: Observable<Contact[]>
  messages: any = []
  private message: string

  form: FormGroup
  public text: FormControl

  constructor(private service: ContactsService, private socket: WebsocketService, private fb: FormBuilder) {
    // socket.connect()
    // this.socket.messages$ = <Subject<any>>socket.connect()
    // .pipe(map((responce: any): any => {
    //   console.log('responce', responce)
    //   return responce;
    // }))
  }

  ngOnInit(): void {
    // setInterval(() => {
    // this.oSub = this.service.getContacts().subscribe(contactResp => {
    //   this.contacts$ = contactResp.contacts
    // })
    // this.num++
    // }, 1000)
    this.form = this.fb.group({
      text: [null, [
        Validators.required
      ]]
    })
    // this.socket.messages$.subscribe(msg => {
    //   this.messages = []
    //   this.messages = msg.text
    // })
  }

  sendMessage() {
    this.socket.sendMsg(this.message)
  }

  setMessage(text: any) {
    this.message = text.value
  }

}
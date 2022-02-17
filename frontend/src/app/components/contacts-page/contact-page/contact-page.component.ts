import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MaterialService } from 'src/app/classes/material.service';
import { CommonService } from 'src/app/services/common.service';
import { ContactsService } from 'src/app/services/contacts.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {

  form: FormGroup
  contact: any
  date: Date
  idContact: number
  paramsId: string
  contacts = []

  constructor(private route: ActivatedRoute,
    private service: ContactsService, public common: CommonService, private router: Router,
     private webSocket: WebsocketService) {
  }

  /**
   * Подгружаем данные контакта
   */
  ngOnInit(): void {

    this.form = new FormGroup({})

    //Получаем отображаемые в таблице столбцы
    let visibleColumns = JSON.parse(localStorage.getItem('visibleColumns'))

    //Заполняем FormControl, в дальнейшем на что то можно придумать валидаторы
    visibleColumns.forEach((item) => {
      this.form.addControl(item.field, new FormControl(true))
      this.contacts.push(item.field)
    })

    this.form.disable()

    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['id']) {
          this.paramsId = params['id']
          return this.service.getById(params['id'])
        }
        return of(null)
      })
    ).subscribe(contact => {
      if (contact) {
        //Сохраняем в переменную наш контакт со всеми полями
        this.contact = contact.rows[0]
        //В зависимотсти от того какие поля таблицы отображаются записываем значения в нашу форму
        visibleColumns.forEach((item) => {
          for (let cont in this.contact) {
            if (cont == item.field) {
              this.form.patchValue({
                [`${item.field}`]: this.contact[cont]
              })
            }
          }
        })
        this.date = contact.rows[0].date
        this.common.imagePreview = this.contact.imagesrc
        MaterialService.updateTextInputs()
      }
      this.form.enable()
    }, error => {
      MaterialService.toast(error.error.message)
    })

    this.common.imagePreview = ''
  }

  /**
   * Метод обновления контакта
   */

  onSubmit() {
    let obs$: Observable<any>
    this.form.disable()
    obs$ = this.service.update(this.paramsId, this.common.image, this.form.value)
    setTimeout(() => {
      obs$.subscribe(
        contact => {
          this.contact = contact
          console.log('this.contact', this.contact)
          this.socketChanges(this.contact)
          MaterialService.toast('Изменения сохранены')
          this.form.enable()
        }, error => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        }
      )
    }, 1000)
  }

  /**
   * Метод удаления контакта
   */

  deleteContact() {
    const decision = window.confirm(`Вы уверены что вы хотите удалить контакт ${this.contact.email}`)
    if (decision) {
      this.service.delete(this.contact.id, this.contact.user_id).subscribe(
        contact => {
          this.contact = contact
          MaterialService.toast('Контакт удалён')
          this.router.navigate(['/contacts'])
        }, error => {
          MaterialService.toast(error.error.message)
          this.form.enable()
        }
      )
    }

  }

  /**
   * Метод для коннекта и дисконнекта сокета.
   * @param contact передаём данные в отправку сообщения на бек через сокет
   * ВАЖНЫЙ МОМЕНТ - ЧТОБЫ ОСУЩЕСТВИТЬ ОБНОВЛЕНИЕ ВСЕХ КЛИЕНТОВ СОКЕТ ДОЛЖЕН БЫТЬ ВКЛЮЧЕН ИНАЧЕ - ОШИБКА ПОТОМУ 
   * ЧТО ПЕРВЫМ ВЫПОЛНЯЕТСЯ disconnect
   */
  private socketChanges(contact: any) {
    this.webSocket.connect()
    this.webSocket.messages$ = <Subject<any>>this.webSocket.connect()
      .pipe(map((responce: any): any => {
        console.log('responce', responce)
        return responce;
      }))
    this.webSocket.sendMsg(contact)
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MaterialService } from 'src/app/classes/material.service';
import { Contact } from 'src/app/interfaces';
import { CommonService } from 'src/app/services/common.service';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  profile: Contact
  form: FormGroup
  contacts = []
  paramsId: string

  constructor(private service: ContactsService, public common: CommonService) { }

  ngOnInit() {
    this.form = new FormGroup({})
    let role = localStorage.getItem('role')

    //Получаем отображаемые в таблице столбцы
    let visibleColumns = JSON.parse(localStorage.getItem('visibleColumns'))

    //Заполняем FormControl, в дальнейшем на что то можно придумать валидаторы
    visibleColumns.forEach((item) => {
      //USER не может менять в своём профиле роль, это может только ADMIN
      if (role !== 'ADMIN' && item.field == 'roles') {
        return null;
      } else {
        this.form.addControl(item.field, new FormControl(true))
        this.contacts.push(item.field)
      }

    })

    this.form.disable()
    //Получаем информацию о залогинившемся контакте
    this.service.getContacts().subscribe(data => {
      data.contacts.forEach((item) => {
        if (item.user_id == localStorage.getItem('id-user')) {
          this.profile = item
          this.paramsId = item.id
          visibleColumns.forEach((item) => {
            for (let cont in this.profile) {
              if (cont == item.field) {
                this.form.patchValue({
                  [`${item.field}`]: this.profile[cont]
                })
              }
            }
          })
          this.common.imagePreview = item.imagesrc
          MaterialService.updateTextInputs()
        }
        this.form.enable()
      }, error => {
        MaterialService.toast(error.error.message)
      })
    })

    this.common.imagePreview = ''
  }

  onSubmit() {
    let obs$
    this.form.disable()
    obs$ = this.service.update(this.profile.id, this.common.image, this.form.value)
    obs$.subscribe(
      contact => {
        this.profile = contact
        MaterialService.toast('Изменения сохранены')
        this.form.enable()
      }, error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}

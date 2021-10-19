import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(private service: ContactsService, public common: CommonService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      firm: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null),
      phone: new FormControl(null),
      date: new FormControl(null),
    })

    this.form.disable()
    //Получаем информацию о залогинившемся контакте
    this.service.getContacts().subscribe(data => {
      data.contacts.forEach((item) => {
        if (item.user_id == localStorage.getItem('id-user')) {
          this.profile = item
          this.form.patchValue({
            name: item.name,
            firm: item.firm,
            email: item.email,
            password: '',
            phone: item.phone,
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
    obs$ = this.service.update(this.profile._id, this.form.value.name,
      this.form.value.firm, this.form.value.email, this.form.value.phone, this.profile.roles, this.common.image,  this.form.value.password)
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

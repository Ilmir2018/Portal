import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/classes/material.service';
import { Contact } from 'src/app/interfaces';
import { CommonService } from 'src/app/services/common.service';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {

  form: FormGroup
  contact: Contact
  date: Date
  idContact: number
  paramsId: string

  constructor(private route: ActivatedRoute, private service: ContactsService, public common: CommonService) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      firm: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null),
      phone: new FormControl(null),
      date: new FormControl(null),
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
        this.contact = contact
        this.form.patchValue({
          id: this.paramsId,
          name: contact.rows[0].name,
          firm: contact.rows[0].firm,
          email: contact.rows[0].email,
          phone: contact.rows[0].phone,
          password: ''
        })
        this.date = contact.rows[0].date
        this.common.imagePreview = contact.rows[0].imagesrc
        MaterialService.updateTextInputs()
      }
      this.form.enable()
    }, error => {
      MaterialService.toast(error.error.message)
    })

    this.common.imagePreview = ''
  }

  onSubmit() {
    let obs$
    this.form.disable()
    obs$ = this.service.update(this.paramsId, this.form.value.name,
      this.form.value.firm, this.form.value.email, this.form.value.phone, this.contact.roles, this.common.image, this.form.value.password)
    obs$.subscribe(
      contact => {
        this.contact = contact
        MaterialService.toast('Изменения сохранены')
        this.form.enable()
      }, error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}

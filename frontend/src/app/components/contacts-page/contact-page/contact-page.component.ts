import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/classes/material.service';
import { Contact } from 'src/app/interfaces';
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

  constructor(private route: ActivatedRoute, private service: ContactsService,
    private router: Router) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      firm: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null),
      date: new FormControl(null),
    })

    this.form.disable()

    this.route.params.pipe(
      switchMap((params: Params) => {
        if(params['id']) {
          return this.service.getById(params['id'])
        }
        return of(null)
      })
    ).subscribe(contact => {
      if(contact) {
        this.contact = contact
        this.form.patchValue({
          name: contact.name,
          firm: contact.firm,
          email: contact.email,
          phone: contact.phone,
          date: contact.date
        })
        this.date = contact.date
        MaterialService.updateTextInputs()
      }
      this.form.enable()
    }, error => {
      MaterialService.toast(error.error.message)
    })
  }

  onSubmit() {
    let obs$
    this.form.disable()
    obs$ = this.service.update(this.contact._id, this.form.value.name,
       this.form.value.firm, this.form.value.email, this.form.value.phone)

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

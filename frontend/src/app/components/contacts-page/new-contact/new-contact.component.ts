import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';
import { Contact } from 'src/app/interfaces';
import { CommonService } from 'src/app/services/common.service';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss']
})
export class NewContactComponent implements OnInit {

  form: FormGroup
  contact: Contact

  constructor(private service: ContactsService, private router: Router, public common: CommonService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      firm: new FormControl(null, Validators.required),
      email: new FormControl(null,[ Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      phone: new FormControl(null),
    })
    this.common.imagePreview = ''
  }

  
  onSubmit() {
    this.service.create(this.form.value, this.common.image).subscribe(
      contact => {
        MaterialService.toast('Изменения сохранены')
        this.form.disable()
        this.router.navigate(['/contacts'])
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}

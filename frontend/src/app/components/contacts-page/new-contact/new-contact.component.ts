import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from 'src/app/classes/material.service';
import { Contact } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss']
})
export class NewContactComponent implements OnInit {

  form: FormGroup
  contact: Contact

  constructor(private route: ActivatedRoute,
    private service: ContactsService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      tab_num: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.minLength(6)),
      division: new FormControl(null, Validators.minLength(6)),
      city: new FormControl(null),
      firm: new FormControl(null, Validators.required),
      email: new FormControl(null,[ Validators.required, Validators.email]),
      phone: new FormControl(null),
      status: new FormControl(null, Validators.required),
    })
  }

  
  onSubmit() {
    this.service.create(this.form.value).subscribe(
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

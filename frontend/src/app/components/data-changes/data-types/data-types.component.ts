import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/classes/material.service';
import { DataService } from 'src/app/services/data.service';

export interface NewTable {
  title: string
}

export interface Field {
  column_name: string
  data_type: string
}

export interface Food {
  value: string;
  viewValue: string;
}

export interface NewField {
  title: string
  column_name: string
  data_type: string
}


@Component({
  selector: 'app-data-types',
  templateUrl: './data-types.component.html',
  styleUrls: ['./data-types.component.scss']
})
export class DataTypesComponent implements OnInit, OnDestroy {

  public dataTypes: NewTable[] = [];

  form: FormGroup
  field: FormGroup
  aSub: Subscription
  oSub: Subscription
  fields: Field[] = []
  typeName: string;
  selectedValue: string;
  modal: boolean = false
  charType: boolean = false

  types = ['integer', 'CHARACTER VARYING'];

  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl(null, [Validators.required]),
    })

    this.field = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      countChar: new FormControl(null),
    })

    this.service.get().subscribe((data: NewTable[]) => {
      this.dataTypes = data
    })
  }

  onSubmit() {
    this.aSub = this.service.create(this.form.value).subscribe(
      () => {
        console.log('Data create!')
        this.dataTypes.push({ title: this.form.value.type })
      },
      (e) => {
        MaterialService.toast(e.error.message)
        this.form.enable()
      }
    )
  }

  changeType(title: string): void {
    this.typeName = title
    this.service.getTableType(title).subscribe((data) => {
      this.fields = data
    })
  }

  toggleModal() {
    this.modal = !this.modal
    if (this.modal) {
      this.field.reset()
    }
    this.charType = false
  }

  addField() {
    this.field.value.title = this.typeName
    this.oSub = this.service.createField(this.field.value).subscribe(
      () => {
        this.modal = false
        this.fields.push({ column_name: this.field.value.name, data_type: this.field.value.type })
        console.log('Field create!')
        this.charType = false
      },
      (e) => {
        MaterialService.toast(e.error.message)
        this.form.enable()
      }
    )
  }


  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  choose(type: string) {
    if (type == "CHARACTER VARYING") {
      this.charType = true
    }
  }
}

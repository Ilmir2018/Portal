import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/services/excel.service';
import { TriggersService } from 'src/app/services/triggers.service';

export interface Trigger {
  id?: number
  table_search?: string
  source_location?: string
  update_frequency?: { frequency?: string, decryption?: string }
  list_name: string
  row_count?: number
  decryption: string
}

export interface Data {
  id: number
  title: string
}

export interface triggerPageAnswer {
  data: Data[]
  triggers: Trigger[]
}

@Component({
  selector: 'app-triggers-page',
  templateUrl: './triggers-page.component.html',
  styleUrls: ['./triggers-page.component.scss']
})
export class TriggersPageComponent implements OnInit, OnDestroy {

  triggers: Trigger[] = []
  oSub: Subscription
  showModal: boolean
  triggerForm: FormGroup
  tableNames: Data[] = []
  frequencyUpdate: string[];
  lists: string[]
  showLists: boolean;
  triggerNum: number

  constructor(private service: TriggersService, private excelService: ExcelService) {
    this.showModal = false
    this.showLists = false
    this.frequencyUpdate = ['Каждый час', 'Каждый день', 'Раз в неделю', 'Раз в месяц']
  }

  ngOnInit(): void {

    this.triggerForm = new FormGroup({
      table: new FormControl(null, [Validators.required]),
      frequency: new FormControl(null, [Validators.required]),
      importFile: new FormControl(null, [Validators.required]),
      list: new FormControl(null, [Validators.required]),
      countRows: new FormControl(null),
    })

    this.oSub = this.service.getAll().subscribe((items: triggerPageAnswer) => {
      items.triggers.forEach((item, idx) => {
        item.id = idx + 1
      })
      this.triggerNum = items.triggers.length
      this.triggers = items.triggers
      this.tableNames = items.data
    })
  }

  toggleListsModal() {
    this.showModal = !this.showModal
    document.body.classList.add('hidden')
    if (this.showModal) {
      this.triggerForm.reset()
    } else {
      document.body.classList.remove('hidden')
    }
  }


  chooseTheList(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.lists = <any[]>this.excelService.checkList(bstr);
      this.showLists = true
      console.log(this.lists)
    };
    reader.readAsBinaryString(target.files[0]);
  }

  addNewTrigger() {
    let data = this.triggerForm.value
    data.importFile = './files/' + data.importFile.split('\\').pop();
    data.frequency = this.returnFrequency(data.frequency)
    this.service.createNew(data).subscribe(() => {
      this.triggerNum++;
      this.triggers.push({ id: this.triggerNum, decryption: data.frequency.decryption, list_name: data.list })
      this.showModal = false
      this.showLists = false
    })
  }

  private returnFrequency(frequency: string): any {
    let result = { frequency: '', decryption: '' }
    let date = new Date()
    switch (frequency) {
      case 'Каждый час':
        result.frequency = '59' + ' * * * *'
        result.decryption = 'Каждый час'
        break
      case 'Каждый день':
        result.frequency = date.getMinutes() + ' ' + date.getHours() + ' * * ' + date.getDay()
        result.decryption = 'Каждый день'
        break
      case 'Раз в неделю':
        result.frequency = date.getMinutes() + ' ' + date.getHours() + ' * * ' + date.getDay()
        result.decryption = 'Раз в неделю'
        break
      case 'Раз в месяц':
        date.getMinutes() + ' ' + date.getHours() + ' ' + date.getDate() + ' * *'
        result.decryption = 'Раз в месяц'
        break
    }
    return result;
  }

  frequency(frequency: string) {
    let result = ''
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

}

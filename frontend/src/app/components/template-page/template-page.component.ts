import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';
import { MenuService } from 'src/app/services/menu.service';


export class Contact {
  name: string = "";
  email: string = "";
  phone: string = "";
  address: string = "";
}

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.scss']
})

export class TemplatePageComponent implements OnInit {

  importContacts: any[] = [];
  exportContacts: Contact[] = [];
  Data = []

  constructor(private service: MenuService, private excelSrv: ExcelService) {
  }

  ngOnInit(): void {
    for (let index = 0; index < 10; index++) {
      const contact = new Contact();
      contact.name = 'name';
      contact.phone = 'phone';
      contact.email = 'email';
      contact.address = 'address';
      this.exportContacts.push(contact);
    }
  }

  // onFileChange(evt: any) {
  //   const target: DataTransfer = <DataTransfer>(evt.target);
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');

  //   const reader: FileReader = new FileReader();
  //   reader.onload = (e: any) => {

  //     const bstr: string = e.target.result;
  //     const data = <any[]>this.excelSrv.importFromFile(bstr);

  //     data[0].forEach((item) => {
  //       this.Data.push(item) 
  //     })

  //     const importedData = data.slice(1, -1);
  //     this.importContacts = importedData.map(arr => {
  //       const obj = {};
  //       for (let i = 0; i < this.Data.length; i++) {
  //         const k = this.Data[i];
  //         obj[k] = arr[i];
  //       }
  //       return <any>obj;
  //     })
  //   };
  //   reader.readAsBinaryString(target.files[0]);

  // }

  exportData(tableId: string) {
    this.excelSrv.exportToFile("contacts", tableId);
  }
}
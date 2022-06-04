import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

export interface xlsDAta {
  data: XLSX.AOA2SheetOpts
  sheetNames: string[]
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  // public importFromFile(bstr: string): XLSX.AOA2SheetOpts {
  //   /* read workbook */
  //   const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //   /* grab first sheet */
  //   const wsname: string = wb.SheetNames[0];
  //   // console.log(wb.SheetNames)
  //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];

  //   /* save data */
  //   const data = <XLSX.AOA2SheetOpts>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

  //   return data;
  // }


  public checkList(bstr: string) {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    return wb.SheetNames;
  }

  public returnData(bstr: string, listName: string, lineNumber: number): any[] {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    const ws: XLSX.WorkSheet = wb.Sheets[listName];

    /* save data */
    let data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

    data = data.splice(lineNumber - 2);

    return data;
  }

  public returnPath(bstr: string) {
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    console.log(wb)
    return wb.SheetNames;
  }


  public exportToFile(fileName: string, dataSource: any) {
    const workSheet = XLSX.utils.json_to_sheet(dataSource.data);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Лист1');
    XLSX.writeFile(workBook, fileName + '.xlsx');
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/classes/material.service';
import { Field, NewTable } from 'src/app/interfaces';
import { DataService } from 'src/app/services/data.service';
import { ExcelService, xlsDAta } from 'src/app/services/excel.service';
import { MenuService } from 'src/app/services/menu.service';


@Component({
  selector: 'app-data-types',
  templateUrl: './data-types.component.html',
  styleUrls: ['./data-types.component.scss']
})
export class DataTypesComponent implements OnInit, OnDestroy {

  //Переменная хранит название выбранной таблицы (типа данных)
  public dataTypes: NewTable[] = [];

  //Форма создания новой таблицы
  form: FormGroup
  //Форма сохдания новой колонки для таблицы
  field: FormGroup
  //Форма выбора импортируемого листа
  listForm: FormGroup
  aSub: Subscription
  oSub: Subscription
  fields: Field[] = []
  typeName: string;
  selectedValue: string;
  modal: boolean = false
  charType: boolean = false
  //Название листа которй нужно импртировать в нашу систему
  listName: string
  //Номер строки с которой нужно загружать таблицу
  lineNumber: number
  //Массив листов выбираемого импортируемого файла
  listNames: string[]
  //Переменная флаг для выбора листа импортируемого файла
  listsModal: boolean = false

  event: any

  types = ['integer', 'CHARACTER VARYING'];

  //Переменные для работы с импортом новых таблиц в систему
  importContacts: any[] = [];

  constructor(private service: DataService, private excelService: ExcelService, private menuService: MenuService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      type: new FormControl(null, [Validators.required]),
    })

    this.field = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      countChar: new FormControl(null),
    })

    this.listForm = new FormGroup({
      list: new FormControl(null, [Validators.required]),
      countRows: new FormControl(null),
    })

    //Загружаем названия всех имеющихся таблиц
    this.service.get().subscribe((data: NewTable[]) => {
      this.dataTypes = data
    })
  }

  /**
   * Функция добавления новой таблицы вручную
   */
  onSubmit() {
    this.service.create(this.form.value).subscribe(
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

  /**
   * Обновляем переменную fields при выборе таблицы
   * нам выдаются столбцы таблицы и тип столбца
   * @param title название таблицы
   */
  changeType(title: string): void {
    this.typeName = title
    this.oSub = this.service.getTableType(title).subscribe((data) => {
      this.fields = data
    })
  }

  /**
   * Закрытие - открытие модального окна
   *  для добавления столбца в таблицу
   */
  toggleModal() {
    this.modal = !this.modal
    if (this.modal) {
      this.field.reset()
    }
    this.charType = false
  }

  toggleListsModal() {
    this.listsModal = !this.listsModal
    if (this.listsModal) {
      this.field.reset()
    }
  }

  /**
   * Функция добавления нового столбца в таблицу
   */
  addField() {
    this.field.value.title = this.typeName
    this.service.createField(this.field.value).subscribe(
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


  /**
   * Отписка от событий при выходе из страницы
   */
  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  /**
   * Функция которая открывает дополнительный инпут в 
   * модальном окне для выбора количества символов
   * если мы выбираем тип CHARACTER VARYING
   * @param type выбираемый тип данных
   */
  choose(type: string) {
    if (type == "CHARACTER VARYING") {
      this.charType = true
    }
  }


  /**
   * Функция добавления новой таблицы с помощью импорта
   * @param evt событие которое к нам попадает из html
   */
  onFileChange() {
    const target: DataTransfer = <DataTransfer>(this.event.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;

      //Получаем массив массивов для создания таблицы на бэкенде
      const data = <any[]>this.excelService.returnData(bstr, this.listForm.value.list, this.listForm.value.countRows);

      let columns = data[0]

      const importedData = data.splice(1);

      //Добавляем id в любую импортируемую таблицу
      data[0].unshift('id')

      //Меняем название таблицы на англ символы
      let changedListName = this.menuService.translit(this.listForm.value.list)
      this.aSub = this.service.addImportingData(changedListName, columns, importedData).subscribe((data) => {
        this.dataTypes.push({ title: changedListName })
      })
      this.listsModal = false
    };
    reader.readAsBinaryString(target.files[0]);

  }

  chooseTheList(evt: any) {
    this.event = evt
    const target: DataTransfer = <DataTransfer>(evt.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;

      //Получаем массив листов данного документа
      const data = <any[]>this.excelService.checkList(bstr);

      this.listNames = data

      this.listsModal = true

    };
    reader.readAsBinaryString(target.files[0]);
  }
}

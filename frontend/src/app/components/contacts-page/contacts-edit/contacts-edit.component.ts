import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/classes/material.service';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contacts-edit',
  templateUrl: './contacts-edit.component.html',
  styleUrls: ['./contacts-edit.component.scss']
})
export class ContactsEditComponent implements OnInit, OnDestroy {

  oSub: Subscription
  cSub: Subscription
  dSub: Subscription
  contactsItem = []
  sendContacts = []
  columns = []
  columnsChange = []
  formChange: FormGroup
  formAdd: FormGroup
  changeSubmit: string = 'change'
  fieldId: number
  changedField: string = ''
  field: string = ''
  oldField: string = ''

  constructor(private service: ContactsService, private router: Router) {
    this.formChange = new FormGroup({})
    this.formAdd = new FormGroup({
      addField: new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.oSub = this.service.getContactsFields().subscribe((fields: any) => {
      //выводим все поля таблицы которые можно редактировать
      fields.fields.forEach((item) => {
        //В зависимости от того что нам приходит с бэка, распределяем по состоянию фильтра
        if (item.filter) {
          this.formChange.addControl(item.field, new FormControl(true))
        } else {
          this.formChange.addControl(item.field, new FormControl(false))
        }
        //Заполняем изначальный массив значениями пришедшими с бэка
        this.contactsItem.push({ id: item.id, field: item.field, filter: this.formChange.value[item.field] })
      })
    })
  }

  /**
   * Функция обновления видимых столбцов таблицы контактов
   */
  changeFielsd() {
    let field;
    //Определяем перед отправкой, изменилось ли значение поля
    if (this.changedField != "") {
      field = this.changedField
    } else {
      field = this.field
    }
    if (this.changeSubmit == "change") {
      //сначала очищаем отправляемый массив
      this.sendContacts = []
      //получаем ширину экрана, сохранённую из страницы контактов
      let widthScreen = JSON.parse(localStorage.getItem('widthScreen'))
      //При отправке мы формируем другой массив в зависимотсти от состояния формы (checks)
      this.contactsItem.forEach((item) => {
        this.sendContacts.push({ id: item.id, field: item.field, filter: this.formChange.value[item.field] })
      })

      //Формируем массив отображаемых колонок на странице контактов
      this.sendContacts.forEach((item) => {
        if (item.filter == true) {
          this.columns.push(item)
        }
      })


      //Заполняем финальный массив для сохранения его в localstorage
      this.columns.forEach((item, idx) => {
        this.columnsChange.push({ field: item.field, width: widthScreen / this.columns.length, name: item.field, show: true, order: idx })
      })

      //Пересохраняем локальное хранилище отображаемых столбцов
      localStorage.setItem('widthChange', JSON.stringify(this.columnsChange))

      //Записываем в базу данных обновлённые данные
      this.cSub = this.service.updateFields(true, this.sendContacts, null).subscribe(
        modal => {
          MaterialService.toast('Изменения сохранены')
        }, error => {
          MaterialService.toast(error.error.message)
        }
      )
    } else if (this.changeSubmit == "delete") {
      this.deleteField(this.fieldId, field)
    } else if (this.changeSubmit == "edit") {
      this.updateField(this.fieldId, field)      
    }

  }

  /**
   * Функция добавления нового столбца в таблицу контактов
   */
  addField() {
    let value = this.formAdd.controls.addField.value
    this.service.updateFields(false, null, value).subscribe(
      (modal: any) => {
        this.formChange.addControl(value, new FormControl(false))
        this.contactsItem.push({id: modal.id, field: value, filter: false })
        this.formAdd.reset()
        MaterialService.toast('Столбец добавлен')
      }, error => {
        MaterialService.toast(error.error.message)
      }
    )
  }

  /**
   * Функция удаления которая срабатывает по клику
   * @param id удаляемого поля
   * @param field название удаляемого поля
   * переменная changeSubmit определяет какой submit отправить при отправке запроса
   */

  delete(id: number, field: string) {
    this.fieldId = id
    this.field = field
    this.changeSubmit = "delete"
  }

  /**
   * Функция обновления названия столбца, которая срабатывает так же по клику
   * @param id удаляемого поля
   * @param field название удаляемого поля
   * переменная changeSubmit определяет какой submit отправить при отправке запроса
   */
  edit(id: number, field: string) {
    this.fieldId = id
    this.field = field
    this.changeSubmit = "edit"
  }

   /**
   * Функция удаления которая срабатывает по клику
   * @param id удаляемого поля
   * @param field название удаляемого поля
   * переменная changeSubmit определяет какой submit отправить при отправке запроса
   */

  deleteField(id: number, field: string) {
    const decision = window.confirm(`Вы уверены что хотите удалить столбец?`)
    if (decision) {
      this.changeSubmit = 'change'
      this.dSub = this.service.deleteFields(id, field).subscribe(
        modal => {
          this.contactsItem = this.contactsItem.filter(fields => fields.id != id)
          this.formAdd.reset()
          MaterialService.toast('Столбец удалён')
        }, error => {
          MaterialService.toast(error.error.message)
        }
      )
    }
  }

  /**
   * Функция обновления названия столбца, которая срабатывает так же по клику
   * @param id обновляемго поля
   * @param field название обновляемго поля
   * переменная changeSubmit определяет какой submit отправить при отправке запроса
   */
  updateField(id: number, field: string) {
    this.changeSubmit = 'change'
    if(localStorage.getItem('oldField')) {
      this.oldField = localStorage.getItem('oldField')
    } else {
      this.oldField = field
    }
    this.dSub = this.service.updateField(id, this.oldField, this.changedField).subscribe(
      modal => {
        localStorage.setItem('oldField', field)
        MaterialService.toast('Столбец переименован')
      }, error => {
        MaterialService.toast(error.error.message)
      }
    )
  }


  setValue(value: string) {
    this.changedField = value
  }


  //Отписка от событий
  ngOnDestroy() {
    this.oSub.unsubscribe()
  }

}

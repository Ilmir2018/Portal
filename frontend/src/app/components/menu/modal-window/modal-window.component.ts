import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DragAndDropService } from 'src/app/services/drag-and-drop.service';
import { MaterialService } from 'src/app/classes/material.service';
import { NavItemNew, UserRole } from 'src/app/interfaces';
import { ContactsService } from 'src/app/services/contacts.service';
import { MenuService } from 'src/app/services/menu.service';
import { TemplatePageComponent } from '../../template-page/template-page.component';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.scss']
})
export class ModalWindowComponent implements OnInit {

  //Флаг для модального окна
  public newItem = false
  public inputValue: string
  data: NavItemNew
  public forbiddenItems = []
  form: FormGroup;
  contacts: Array<UserRole> = []
  @Input() public settingsItem: NavItemNew;
  //Переменная для сохранения роли пользователя
  role: string
  //Промежуточный массив для поиска промежуточных пунктов меню, если они есть
  removingArr = []
  //Флаг который регулирует список появляющийся при нажатии на инпут (должен иметь фильтрацию списка)
  public selectBlock = false
  //Флаг который регулирует кнопку "Сохранить изменения"
  public permissionChange = false;
  //Флаг который скрывает и открывает нужные окна
  public selectUser = false;
  //Переменная хранит имя добавляемого в список пользователя (читатель, редактор)
  private userName = ''
  //Один изменяемый контакт
  private contact: UserRole
  searchStr = ''

  selectName = new FormControl(this.service.addPermissions[0].value);

  constructor(public service: MenuService, private router: Router,
    private fb: FormBuilder, public contactService: ContactsService, public managerService: DragAndDropService) {
    this.form = fb.group({
      read: false,
      write: false,
      delete: false
    });
    this.role = localStorage.getItem('role')
  }


  ngOnInit(): void {
    this.forbiddenItems = ['contacts', 'menu', 'profile', 'settings']
  }

  /**
   * Функция для изменения прав пользователей
   */
  changePermissions() {
    //Массив для заполнения
    let permissionsArr = []
    //Сохраняем в переменную объект с правами, полученный из формы
    let permissions = this.service.permissionForm.value
    //Заполняем массив для перезаписи прав в контактах
    for (var key in permissions) {
      if (permissions[key] == 'none') {
        permissionsArr.push([true, false, false])
      } else if (permissions[key] == 'read') {
        permissionsArr.push([false, true, false])
      } else if (permissions[key] == 'write') {
        permissionsArr.push([false, false, true])
      }
    }
    let changePermission = []

    //Исключаем из отправки контакты в которых нет доступа
    this.service.contacts.forEach((item) => {
      changePermission.push(item)
    })

    //Перезаписываем изменённые права которые берём из формы
    changePermission.forEach((item, index) => {
      item.permissions = permissionsArr[index]
    })

    //Отправка изменённых данных на сервер
    this.service.modalAdd(this.service.settingsItem.id, changePermission).subscribe(
      modal => {
        MaterialService.toast('Изменения сохранены')
      }, error => {
        MaterialService.toast(error.error.message)
      }
    )

  }

  /**
   * Функция обновления объекта в базе
   * @param item Обновляемый объект
   */
  save(item) {
    item.title = this.inputValue
    item.url = this.service.translit(this.inputValue)
    this.service.update(item).subscribe(
      menu => {
        MaterialService.toast('Изменения сохранены')
      }, error => {
        MaterialService.toast(error.error.message)
      }
    )
  }

  /**
   * Функция добавления дочерних пунктов меню
   * @param item пункт меню, в который мы добавляем подпункт
   */
  add(item: NavItemNew) {
    let arr = []
    //Берём имеющиеся пункты меню для определения уровня элементов
    this.service.menuItemsOld.forEach((element) => {
      if (element.parent_id == item.id) {
        arr.push(item)
      }
    })

    let forBack = { title: this.inputValue, url: this.service.translit(this.inputValue), parent_id: item.id, level: (arr.length + 1).toString() }
    let url = this.service.translit(this.inputValue);

    //Изменяем мааасив permissions в localstorage
    let permissions = JSON.parse(localStorage.getItem('permissions'))
    permissions.push({ url: this.service.translit(this.inputValue), permissions: [false, true, false] })
    localStorage.setItem('permissions', JSON.stringify(permissions))

    //Добавляем новый пункт меню
    this.service.add(forBack).subscribe(
      newItem => {
        //Обновляем пункты меню
        let forFront = { id: newItem.id, title: newItem.title, url: newItem.url, subtitle: [], parent_id: newItem.parent_id, level: newItem.level }
        this.addItem(this.service.menuItems, item, forFront)
        this.service.menuItemsOld.push(forFront)
        MaterialService.toast('Элемент добавлен')
        this.newItem = false;
        //Добавляем новый адрес в массив роутов
        this.router.config.forEach((item) => {
          if (item.canActivate) {
            item.children.push({ path: url, component: TemplatePageComponent })
          }
        })
      },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
    this.newItem = false;
  }


  /**
   * Функция добавления нового подпункта в существующий пункт на фронте
   * @param items массив всех элементов
   * @param element елемент в который добавляется подпункт
   * @param object добавляемый элемент
   */
  addItem(items: NavItemNew[], element: NavItemNew, object: NavItemNew) {
    items.forEach((item) => {
      if (item.id == element.id) {
        item.subtitle.push(object)
      } else {
        this.addItem(item.subtitle, element, object)
      }
    })
  }

  /**
   * Функция удаления дочерних пунктов меню
   * @param item удаляемый пункт
   */
  remove(item: NavItemNew) {
    const decision = window.confirm(`Вы уверены что хотите удалить этот пункт меню?`)
    if (decision) {
      this.removingArr = []
      //Организация массива для отправки на сервер
      this.recursionFunc(item)
      //Заполняем массив удаляемых элементов на фронте
      this.removingArr.push(item)
      this.removingArr.forEach((removeItem) => {
        let idx = this.service.menuItemsOld.findIndex(p => p.id === removeItem.id)
        this.service.menuItemsOld.splice(idx, 1)

        // Меняем массив разрешений
        let permissions = JSON.parse(localStorage.getItem('permissions'))
        idx = permissions.findIndex(p => p.url === removeItem.url)
        permissions.splice(idx, 1)
        localStorage.setItem('permissions', JSON.stringify(permissions))
      })
      //Образуем массив id которые удаляем
      let idItems = []
      this.removingArr.forEach((itemSend) => {
        idItems.push(itemSend.id)
      })

      console.log(this.removingArr)
      this.service.settingsMenu = false

      this.service.delete(item, idItems).subscribe(
        responce => {
          //Закрытие окна настройки пункта меню
          this.service.settingsMenu = false
          //Обнуляем массив для следующего удаления
          this.removingArr = []
          //Обновляем пункты меню
          this.removeItem(this.service.menuItems, item)
          //Удаляем класс при закрытии модального окна
          document.body.classList.remove('hidden')
          MaterialService.toast('Удалено успешно')
        },
        error => MaterialService.toast(error.error.message),
      )
    }
  }


  /**
   * Рекурсивная функция поиска удаляемого элемента на фронте
   * @param items массив пунктов в которм ищем элемент
   * @param element искомый пункт меню, который удаляем 
   */
  removeItem(items: NavItemNew[], element: NavItemNew) {
    items.forEach((item) => {
      if (items.includes(element)) {
        let idx = items.findIndex(p => p.id === element.id)
        items.splice(idx, 1)
      } else {
        this.removeItem(item.subtitle, element)
      }
    })
  }

  /**
   * Рекурсивная функция для удаления всех подпунктов меню
   * если таковые имеются
   * @param item пунтк или подпункт меню
   */
  private recursionFunc(item: NavItemNew) {
    this.service.menuItemsOld.forEach((item2) => {
      if (item2.parent_id == item.id) {
        this.removingArr.push(item2)
        this.recursionFunc(item2)
      }
    })
  }

  addNew(item: NavItemNew) {
    this.data = item
    this.newItem = true;
  }

  /**
   * Функция закрытия модального окна, в котором
   * обнуляются многие используемые флаги
   */
  closeModal() {
    //Очищаем массив контактов
    this.service.contacts = []
    //Обновляю контролы формы
    this.service.permissionForm.controls = {}
    this.service.settingsMenu = false
    this.newItem = false;
    this.selectUser = false
    this.selectBlock = false

    //Обнуляем значения модального окна при закрытии
    this.form = this.fb.group({
      read: false,
      write: false,
      delete: false,
    });

    //Обнуляем список пользователей
    // this.permissionControl.reset()

    //Удалаем класс скрывающий прокрутку в body
    document.body.classList.remove('hidden')
  }

  closeAddModal() {
    this.newItem = false
  }

  setValue(value: string) {
    this.inputValue = value
  }

  /**
   * Функция для открытия/закрытия списка контактов
   * @param event событие клика мыши
   */
  loadList(event: MouseEvent) {
    if (event.target['className'] == 'select-input') {
      this.selectBlock = true
    } else {
      this.selectBlock = false
    }
  }

  /**
   * Функция выбора одного контакта для добавления в список
   * @param contact выбираемый контакт
   */
  checkContact(contact: UserRole) {
    this.contact = contact
    this.selectUser = true
    this.userName = contact.email
  }

  //Функция добавления юзера с правами (читатель, редактор) в общий список
  addUser() {
    if (this.selectName.value == 'read') {
      this.contact.permissions = [false, true, false]
    } else {
      this.contact.permissions = [false, false, true]
    }
    // Отправка изменённых данных на сервер
    this.service.modalAdd(this.service.settingsItem.id, [this.contact]).subscribe(
      modal => {
        MaterialService.toast('Изменения сохранены')
      }, error => {
        MaterialService.toast(error.error.message)
      }
    )
    this.selectUser = false
  }

  /**
   * Закрытие окно добавления нового контакта в список
   */
  cancel() {
    this.selectUser = false
  }

  /**
   * В этой функции будут сравниваться 2 объекта
   * первый - это объект который есть при открытии окна редактирования изначально
   * и второй - тот который будет получаться в результате изменений
   */
  changePermission() {
    if (JSON.stringify(this.service.permissionForm.value) != localStorage.getItem('permission')) {
      this.permissionChange = true;
    } else {
      this.permissionChange = false;
    }
  }

  /**
   * Метод фильтрации списка контактов 
   * (мы применяем пайп фильтрации и пайп ограничения элементов в списке)
   * @param filterValue значение которое мы получаем из инпута
   */
  applyFilter(filterValue: string) {
    this.searchStr = filterValue
  }


}

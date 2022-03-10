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

  private id = 543

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
   * @param item добавляемый пункт меню
   */
  add(item: NavItemNew) {
    let arr = []
    //Берём имеющиеся пункты меню для определения уровня элементов
    this.service.menuItemsOld.forEach((element) => {
      if (element.parent_id == item.id) {
        arr.push(item)
      }
    })
    let object = { title: this.inputValue, url: this.service.translit(this.inputValue), parent_id: item.id, level: (arr.length + 1).toString() }
    let url = this.service.translit(this.inputValue);

    //Изменяем мааасив permissions в localstorage
    let permissions = JSON.parse(localStorage.getItem('permissions'))
    permissions.push({ url: this.service.translit(this.inputValue), permissions: [false, true, false] })
    localStorage.setItem('permissions', JSON.stringify(permissions))

    //Добавляем новый пункт меню
    this.service.add(object).subscribe(
      newItem => {
        console.log(newItem)
        //Формируем на фронте с помощью функции addNewItem обновлённый массив меню
        // this.service.menuItemsOld.push(newItem)
        // this.updateMenuItems()

        this.service.get().subscribe((data) => {
          let menu: any, resultArr = []
          menu = data
          //Отбираем пункты меню по user_id
          menu.forEach((items) => {
            resultArr.push(items)
          })
          this.service.menuItemsOld = []
          //Первые уровни меню
          resultArr.forEach((item) => {
            //заполняем массив для добавления и удаления элементов на фронте
            this.service.menuItemsOld.push(item)
          })
          this.updateMenuItems()

          console.log(this.service.menuItems)
        })

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
   * Функция удаления дочерних пунктов меню
   * @param item удаляемый пункт
   */
  remove(item: NavItemNew) {
    const decision = window.confirm(`Вы уверены что хотите удалить этот пункт меню?`)
    if (decision) {
      this.removingArr = []
      //Удаление элемена на фронте
      this.recursionFunc(item)
      //Заполняем массив удаляемых элементов на фронте
      this.removingArr.push(item)
      console.log(this.service.menuItemsOld)
      this.removingArr.forEach((removeItem) => {
        let idx = this.service.menuItemsOld.findIndex(p => p.id === removeItem.id)
        this.service.menuItemsOld.splice(idx, 1)

        //Удаляем элемент из droppable списка (нужно улучшить, чтобы не только на верхнем уровне мог удалять)
        if (item.parent_id == null) {
          idx = this.service.dragDelete.findIndex(p => p.id === removeItem.id)
          this.service.dragDelete.splice(idx, 1)
        }
        //Меняем массив разрешений
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

      this.service.delete(item, idItems).subscribe(
        responce => {
          //Закрытие окна настройки пункта меню
          this.service.settingsMenu = false
          //Обнуляем массив для следующего удаления
          this.removingArr = []
          //Обновляем массив menuItemsOld
          this.service.get().subscribe((data) => {
            let menu: any, resultArr = []
            menu = data
            //Отбираем пункты меню по user_id
            menu.forEach((items) => {
              resultArr.push(items)
            })
            this.service.menuItemsOld = []
            //Первые уровни меню
            resultArr.forEach((item) => {
              //заполняем массив для добавления и удаления элементов на фронте
              this.service.menuItemsOld.push(item)
            })
            this.updateMenuItems()
          })

          document.body.classList.remove('hidden')
          MaterialService.toast('Удалено успешно')
        },
        error => MaterialService.toast(error.error.message),
      )
    }
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

  /**
  * Функция обновления массива меню на фронте (используется при каждом удалении или давлении нового пункта меню)
  */
  updateMenuItems() {
    let map = new Map()
    //Сначала обнуляем массив, потому что создаём его заново уже с новым элементом
    this.service.menuItems = []
    this.service.dragDelete = []
    //Первые уровни меню
    // console.log(this.service.menuItemsOld)
    this.service.menuItemsOld.forEach((item) => {
      let navItem: NavItemNew = {
        id: item.id, title: item.title, url: item.url,
        subtitle: [], parent_id: item.parent_id, level: item.level
      }
      map.set(item.id, navItem)
      if (item.parent_id == null) {
        this.service.menuItems.push(navItem)
        this.service.dragDelete.push(navItem)
      }
    })
    this.service.menuItemsOld.forEach((item) => {
      if (item.parent_id !== null) {
        let obj = map.get(item.parent_id)
        obj.subtitle.push(map.get(item.id))
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

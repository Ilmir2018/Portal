import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewTable, NewField, DataFields } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  //Функция для выбора названий всех таблиц
  get() {
    return this.http.get(`/api/dannye`)
  }

  /**
   * Функция выбора всех полей текущей таблицы
   * @param tableName название выбираемой таблицы
   */
  getData(tableName: string) {
    return this.http.get<DataFields>(`/api/dannye/data/?data=${tableName}`)
  }

  /**
   * Функция выбора названий и типов полей текущей таблицы
   * @param tableName название выбираемой таблицы
   */
  getTableType(tableName: string) {
    return this.http.get<Array<any>>(`/api/dannye/table/?table=${tableName}`)
  }

  /**
   * Создание новой таблицы
   * @param data 
   */
  create(data: NewTable): Observable<NewTable> {
    return this.http.post<NewTable>('/api/dannye', data)
  }

  /**
   * Создание новой колонки для выбранной таблицы
   * @param data Характеристики новой колонки (название, тип, название таблицы)
   */
  createField(data: NewField): Observable<NewField> {
    return this.http.post<NewField>('/api/dannye/types', data)
  }

  /**
   * Функция добавления или изменения сущестующей строки выбранной таблицы
   * @param changes 
   * @param action Действие, если true то добавляем новую строку, если false - редактируем существующую
   */
  addUpdateField(changes: any, action: boolean): Observable<NewField> {
    return this.http.post<any>('/api/dannye/data', {changes, action})
  }

  /**
   * Функция сохранения в базе данных xls таблицы, которую мы импортируем в систему
   * @param columns Поля создаваемой таблицы
   * @param data Данные для вставки
   */
  addImportingData(tableName: string, columns: [], data: [][]): Observable<any> {
    return this.http.post<any>('/api/dannye/import', {tableName, columns, data})
  }

}

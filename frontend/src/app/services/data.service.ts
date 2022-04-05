import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataFields } from '../components/data-changes/app-data/app-data.component';
import { NewField, NewTable } from '../components/data-changes/data-types/data-types.component';
import { GridColumnDefinition } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  columns: GridColumnDefinition[] = [
    { field: 'name', width: 10, name: 'name', show: true, order: 1 },
    { field: 'firm', width: 40, name: 'firm', show: true, order: 2 },
    { field: 'email', width: 20, name: 'email', show: true, order: 3 },
    { field: 'phone', width: 30, name: 'phone', show: true, order: 4 },
  ];

  get() {
    return this.http.get(`/api/dannye`)
  }

  getData(tableName: string) {
    return this.http.get<DataFields>(`/api/dannye/data/?data=${tableName}`)
  }

  getTableType(tableName: string) {
    return this.http.get<Array<any>>(`/api/dannye/table/?table=${tableName}`)
  }

  create(data: NewTable): Observable<NewTable> {
    return this.http.post<NewTable>('/api/dannye', data)
  }

  createField(data: NewField): Observable<NewField> {
    return this.http.post<NewField>('/api/dannye/types', data)
  }

  addUpdateField(changes: any, action: boolean): Observable<NewField> {
    return this.http.post<any>('/api/dannye/data', {changes, action})
  }

}

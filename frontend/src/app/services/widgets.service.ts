import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Container, DataFields, Element, WidgetData } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WidgetsService {

  choiseContainerModal: boolean = false;
  choiseWidgetModal: boolean = false;
  choiseWidgetTypeModal: boolean = false;
  $builder: Observable<Container[]>;
  containers: Container[] = [];
  widgetData: DataFields[] = []
  selectedContainer: Container
  element_id: number = null
  widgetType: string = null
  page_id: string = null

  constructor(private http: HttpClient) { }

  getWidgets(pageName: string): Observable<any> {
    return this.http.get<any>(`/api/widgets/?pageName=${pageName}`)
  }

  addContainerAndElements(page_id: number, type: string): Observable<any> {
    return this.http.post(`/api/widgets`, { page_id, type })
  }

  deleteElementAndWidgets(element: Element) {
    return this.http.post(`/api/widgets/deleteElem`, {element})
  }

  deleteContainer(container: Container) {
    return this.http.post(`/api/widgets/deleteCont`, {container})
  }

  /**
   * Создание нового виджета
   */

  creatingWidget(data: WidgetData): Observable<any> {
    return this.http.post(`/api/widgets/add`, { dataWidget: data })
  }

  /**
   * В дальнейшем нужно будет передавать тип виджета
   * @param id идентификатор виджета
   */
  getWidget(id: number): Observable<DataFields> {
    return this.http.get<DataFields>(`/api/widgets/${id}`)
  }

}

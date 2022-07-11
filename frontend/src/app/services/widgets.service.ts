import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Container, Element } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WidgetsService {

  choiseContainerModal: boolean = false;
  choiseWidgetModal: boolean = false;
  $builder: Observable<Container[]>;
  containers: Container[] = [];
  selectedContainer: Container

  constructor(private http: HttpClient) { }

  getWidgets(pageName: string): Observable<any> {
    return this.http.get<any>(`/api/widgets/?pageName=${pageName}`)
  }

  addContainerAndElements(page_id: number, type: string): Observable<any> {
    return this.http.post(`/api/widgets`, {page_id, type})
  }

  deleteElementAndWidgets(element: Element) {
    return this.http.delete(`/api/widgets/${element.id}?container_id=${element.container_id}`)
  }

  deleteContainer(container_id: number) {
    return this.http.delete(`/api/widgets/container/${container_id}`)
  }

}

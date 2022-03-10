import { CdkDropList } from '@angular/cdk/drag-drop';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DragAndDropService } from '../services/drag-and-drop.service';

@Directive({
  selector: '[dragAndDrop]'
})
export class DragAndDropDirective implements OnInit, OnDestroy {
  private manager!: Subscription;

  constructor(
    private dropList: CdkDropList,
    private managerService: DragAndDropService
  ) {}

  ngOnInit(): void {
    // console.log(this.dropList.id)
    this.managerService.register(String(this.dropList.id));
    this.manager = this.managerService.onListChange().subscribe(x => {
      this.dropList.connectedTo = x.reverse();
    });
  }

  ngOnDestroy(): void {
    this.manager.unsubscribe();
    this.managerService.unregister(String(this.dropList.id));
  }
}

@Directive({
  selector: '[dragAndDropRoot]',
  providers: [
    {
      provide: DragAndDropService
    }
  ]
})
export class DragAndDropRootDirective extends DragAndDropDirective {}
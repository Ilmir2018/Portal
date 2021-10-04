import { ElementRef, Injectable, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  image: File
  imagePreview: any;
  @ViewChild('input') inputRef: ElementRef

  constructor() {
   }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file;

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }
}

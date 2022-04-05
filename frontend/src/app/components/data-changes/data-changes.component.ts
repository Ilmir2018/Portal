import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-data-changes',
  templateUrl: './data-changes.component.html',
  styleUrls: ['./data-changes.component.scss']
})
export class DataChangesComponent implements OnInit {

  constructor(private service: DataService) { }

  ngOnInit(): void {
    // this.service.get().subscribe((data) => {
    //   console.log(data)
    // })
  }

}

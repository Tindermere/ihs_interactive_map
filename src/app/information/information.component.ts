import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  @Output() closeEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  close() {
    this.closeEventEmitter.emit()
  }

}

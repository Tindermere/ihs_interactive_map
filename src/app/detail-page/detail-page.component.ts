import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ApiService} from "../services/api-service";
import {Construction} from "../../models/Construction";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Output() closeEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  construction: Construction;
  private _unsubscribe$ = new Subject<void>();

  constructor(private _apiService: ApiService) {
  }

  ngOnInit(): void {
    this._apiService.getConstruction(this.id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(construction => this.construction = construction);
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  close() {
    this.closeEventEmitter.emit()
  }

  coordinates(): string {
    return this.construction.latitude + '° N, ' + this.construction.longitude + '° E'
  }

  atob(base64String: string) {
    return atob(base64String);
  }

}

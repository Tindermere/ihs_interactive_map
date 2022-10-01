import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../services/api-service";
import {take} from "rxjs";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  succeed = false;

  constructor(private _route: ActivatedRoute, private _apiService: ApiService) {
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this._apiService.confirmConstruction(params['Token']).pipe(take(1)).subscribe(() => this.succeed = true)
    })
  }

}

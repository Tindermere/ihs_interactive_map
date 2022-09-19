import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ApiService} from "../services/api-service";
import {Construction} from "../../models/Construction";

interface Category {
  value: string;
  color?: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  apiLoaded$: Observable<boolean>;

  categories: Category[] = [{value: 'Est', color: 'red'}];
  constructions$: Observable<Construction[]>;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Construction[]>;
  googleMapsOptions: google.maps.MapOptions = {
    center: {lat: 46.7739, lng: 8.6025},
    zoom: 10,
  };

  constructor(httpClient: HttpClient, private _apiService: ApiService) {
    this.apiLoaded$ = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCmv7VOgTWeFT-dlUMxzaliANNR3AFO2e4',
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  ngOnInit() {
    this.constructions$ = this._apiService.getConstructions();
    this.constructions$.subscribe(values => console.log(values));
  }
}

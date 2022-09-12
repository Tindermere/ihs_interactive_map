import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  apiLoaded$: Observable<boolean>;

  constructor(httpClient: HttpClient) {
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

  options: google.maps.MapOptions = {
    center: { lat: 46.7739, lng: 8.6025 },
    zoom: 9,
  };

  ngOnInit(): void {}
}

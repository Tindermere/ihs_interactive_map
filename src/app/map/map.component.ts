import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';

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

  categories: Category[] = [{ value: 'Est', color: 'red' }];
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

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

  googleMapsOptions: google.maps.MapOptions = {
    center: { lat: 46.7739, lng: 8.6025 },
    zoom: 11,
  };

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}

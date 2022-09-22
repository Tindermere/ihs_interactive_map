import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay, Observable, Subject, takeUntil} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ApiService} from "../services/api-service";
import {Construction} from "../../models/Construction";
import {MarkerClusterer} from "@googlemaps/markerclusterer";

declare const google: any;

interface Category {
  value: string;
  color?: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("map", {static: true}) mapElement: any;
  map: any;

  categories: Category[] = [{value: 'Est', color: 'red'}];
  constructions$: Observable<Construction[]>;
  construction$: Observable<Construction>;
  myControl = new FormControl('');

  filteredOptions: Observable<Construction[]>;

  private _unsubscribe$ = new Subject<void>();

  constructor(private httpClient: HttpClient, private _apiService: ApiService) {
  }

  ngAfterViewInit() {
    this.constructions$ = this._apiService.getConstructions(this.myControl.value ? this.myControl.value : '');
    this._watchMyControl();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  ngOnInit() {
    this._apiService.getConstructions(this.myControl.value ? this.myControl.value : '')
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(constructions => {
        const locations = constructions.map(construction => {
          return {lat: construction.latitude, lng: construction.longitude, id: construction.id}
        });
        this.addMarker(locations)
      })

    this.construction$?.subscribe(value => console.log(value));

    const mapProperties = {
      center: {lat: 47.0502, lng: 8.3093},
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );
  }

  addMarker(locations) {
    const markers = locations.map((location, i) => {
      const marker = new google.maps.Marker({
        position: location,
        // label: labels[i % labels.length],
        map: this.map,
        clickable: true,
        animation: google.maps.Animation.DROP
      });

      google.maps.event.addListener(marker, 'click', () => {
        console.log(location.id);
        this.construction$ = this._apiService.getConstruction(location.id);
      })

      return marker;
    });
    new MarkerClusterer({map: this.map, markers});
  }

  private _watchMyControl() {
    this.myControl.valueChanges.pipe(takeUntil(this._unsubscribe$), delay(300)).subscribe(value => {
      this._apiService.getConstructions(value ? value : '');
    })
  }

  /*this._apiService.getConstructions(this.myControl.value ? this.myControl.value : '')
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe(constructions => {
      const markers = constructions.map((construction, i) => {
        const constructionMarker = {lat: construction.latitude, lng: construction.longitude};
        const label = labels[i % labels.length];
        const marker = new google.maps.Marker({position: constructionMarker, label})
        marker.addListener('click', () => {
          infoWindow.setContent(label);
          infoWindow.open(this.mapElement, marker);
        })
      })
      return markers;
    })*/

}

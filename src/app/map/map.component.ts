import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, debounceTime, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ApiService} from "../services/api-service";
import {Construction} from "../../models/Construction";
import {MarkerClusterer} from "@googlemaps/markerclusterer";
import {ConstructionColor} from "../../enums/ConstructionColor";

declare const google: any;

interface Category {
  value: string;
  color?: ConstructionColor;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild("map", {static: true}) mapElement: any;
  map: any;

  categories: Category[] = [
    {value: 'Aktuell', color: ConstructionColor.white},
    {value: 'Bauwerke', color: ConstructionColor.blue},
    {value: 'Rote Liste', color: ConstructionColor.red},
    {value: 'Ferien im Baudenkmal', color: ConstructionColor.yellow},
    {value: 'Kategorie XY', color: ConstructionColor.green}
  ];
  enterInSearch$ = new BehaviorSubject<any>(null);
  searchControl = new FormControl<string>('');
  categoryFilterControl = new FormControl<Category>({} as Category);
  markers: google.maps.Marker[] = [];
  markerCluster: MarkerClusterer;

  filteredOptions: Observable<Construction[]>;

  private _unsubscribe$ = new Subject<void>();

  constructor(private httpClient: HttpClient, private _apiService: ApiService) {
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  ngOnInit() {
    this._watchControls();

    this._apiService.getConstructions(this.searchControl.value!)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(constructions => {
        this._setMarkers(constructions);
      })

    const mapProperties = {
      center: {lat: 47.0502, lng: 8.3093},
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );
  }

  addMarker(locations) {
    const markersTemp = locations.map((location, i) => {
      const marker = new google.maps.Marker({
        position: location,
        // label: labels[i % labels.length],
        map: this.map,
        clickable: true,
        animation: google.maps.Animation.DROP
      });

      google.maps.event.addListener(marker, 'click', () => {
        console.log(location.id);

      })

      return marker;
    });
    this.markers = markersTemp;
    this.markerCluster = new MarkerClusterer({map: this.map, markers: this.markers});
  }

  onEnter() {
    this.enterInSearch$.next(this.searchControl.value);
  }

  private _watchControls() {
    this.categoryFilterControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap(category =>
          this._apiService.getConstructions(this.searchControl.value!, category)
        )
      )
      .subscribe(constructions => {
        this._setMarkers(constructions)
      });

    combineLatest(
      this.searchControl.valueChanges,
      this.enterInSearch$
    )
      .pipe(
        takeUntil(this._unsubscribe$),
        debounceTime(300),
        switchMap(([searchValue, _]) =>
          this._apiService.getConstructions(searchValue!, this.categoryFilterControl.getRawValue())
        )).subscribe(constructions => {
      this._setMarkers(constructions);
    });
  }

  private _setMarkers(constructions: Construction[]) {
    this._removeMarkers();
    const mappedConstructions = constructions.map(construction => {
      return {lat: construction.latitude, lng: construction.longitude, id: construction.id}
    });
    this.addMarker(mappedConstructions);
  }

  private _removeMarkers() {
    if (this.markerCluster) {
      this.markerCluster.removeMarkers(this.markers);
    }
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null)
    }
    this.markers = [];
  }
}

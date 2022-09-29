import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, combineLatest, debounceTime, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ApiService} from "../services/api-service";
import {Construction} from "../../models/Construction";
import {MarkerClusterer} from "@googlemaps/markerclusterer";
import {Router} from "@angular/router";
import {categories, Category} from "../../models/Category";

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild("map", {static: true}) mapElement: any;
  map: any;

  categories = categories;
  enterInSearch$ = new BehaviorSubject<any>(null);
  searchControl = new FormControl<string>('');
  categoryFilterControl = new FormControl<Category>({} as Category);
  markers: google.maps.Marker[] = [];
  markerCluster: MarkerClusterer;
  detailOpened: boolean;
  selectedId$ = new BehaviorSubject<string>('');

  filteredOptions: Observable<Construction[]>;

  private _unsubscribe$ = new Subject<void>();

  constructor(private _httpClient: HttpClient,
              private _apiService: ApiService,
              private _router: Router) {
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

      const infoBox = new google.maps.InfoWindow({
        maxWidth: 450,
      })

      google.maps.event.addListener(marker, 'click', () => {
          const div = document.createElement('div');
          const locationDiv = document.createElement('div');

          locationDiv.innerHTML = location.text + '<br>';
          div.appendChild(locationDiv);

          const infoText = document.createElement('div');
          infoText.className = "info-text-wrapper"
          infoText.innerHTML = "<a class='info-text'> Informationen </a>"
          infoText.onclick = () => this.setDetailOpened(location.id);
          div.appendChild(infoText);

          infoBox.setContent(div);
          infoBox.open(this.map, marker)
        }
      )

      return marker;
    });
    this.markers = markersTemp;
    this.markerCluster = new MarkerClusterer({map: this.map, markers: this.markers});
  }

  setDetailOpened(id: string) {
    this.selectedId$.next(id);
    this.detailOpened = true;
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
          this._apiService.getConstructions(searchValue!, this.categoryFilterControl.value)
        )).subscribe(constructions => {
      this._setMarkers(constructions);
    });
  }

  private _setMarkers(constructions: Construction[]) {
    this._removeMarkers();
    const mappedConstructions = constructions.map(construction => {
      return {
        lat: construction.latitude,
        lng: construction.longitude,
        id: construction.id,
        text: construction.structure
      }
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

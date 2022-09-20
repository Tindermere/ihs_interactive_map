import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, delay, map, Observable, of, Subject, takeUntil} from 'rxjs';
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
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild("googleMap", {static: true}) mapElement: any;
  map: any;

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
  private _unsubscribe$: Subject<void>;

  constructor(private httpClient: HttpClient, private _apiService: ApiService) {
    this._loadMap();
  }

  ngAfterViewInit() {
    this.constructions$ = this._apiService.getConstructions(this.myControl.value ? this.myControl.value : '');
    this.constructions$.subscribe(values => console.log(values));
    this._setMapConfigs();

    this._watchMyControl();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private _setMapConfigs() {
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      this.googleMapsOptions
    )
    this._createClusterMarkers();
  }

  private _loadMap() {
    this.apiLoaded$ = this.httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCmv7VOgTWeFT-dlUMxzaliANNR3AFO2e4',
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  private _watchMyControl() {
    this.myControl.valueChanges.pipe(takeUntil(this._unsubscribe$), delay(300)).subscribe(value => {
      this._apiService.getConstructions(value ? value : '');
    })
  }


  private _createClusterMarkers() {
    const infoWindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const locations = [
      {lat: -31.56391, lng: 147.154312},
      {lat: -33.718234, lng: 150.363181},
      {lat: -33.727111, lng: 150.371124},
      {lat: -33.848588, lng: 151.209834},
      {lat: -33.851702, lng: 151.216968},
      {lat: -34.671264, lng: 150.863657},
      {lat: -35.304724, lng: 148.662905},
      {lat: -36.817685, lng: 175.699196},
      {lat: -36.828611, lng: 175.790222},
      {lat: -37.75, lng: 145.116667},
      {lat: -37.759859, lng: 145.128708},
      {lat: -37.765015, lng: 145.133858},
      {lat: -37.770104, lng: 145.143299},
      {lat: -37.7737, lng: 145.145187},
      {lat: -37.774785, lng: 145.137978},
      {lat: -37.819616, lng: 144.968119},
      {lat: -38.330766, lng: 144.695692},
      {lat: -39.927193, lng: 175.053218},
      {lat: -41.330162, lng: 174.865694},
      {lat: -42.734358, lng: 147.439506},
      {lat: -42.734358, lng: 147.501315},
      {lat: -42.735258, lng: 147.438},
      {lat: -43.999792, lng: 170.463352}
    ];

    const markers = locations.map((construction, i) => {
      const label = labels[i % labels.length];
      const marker = new google.maps.Marker({position: construction, label})
      marker.addListener('click', () => {
        infoWindow.setContent(label);
        infoWindow.open(this.mapElement, marker);
      })
      return marker;
    })

    const markerCluster = new MarkerClusterer({map: this.map, markers,
       imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    );

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
}

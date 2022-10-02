import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterModule} from '@angular/router';
import {MapComponent} from './map/map.component';
import {ListComponent} from './list/list.component';
import {InformationComponent} from './information/information.component';
import {CaptureBuildingComponent} from './capture-building/capture-building.component';
import {ContactComponent} from './contact/contact.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {GoogleMapsModule} from '@angular/google-maps';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {DetailPageComponent} from './detail-page/detail-page.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ConfirmComponent} from './confirm/confirm.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ListComponent,
    InformationComponent,
    CaptureBuildingComponent,
    ContactComponent,
    DetailPageComponent,
    ConfirmComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    RouterModule,
    GoogleMapsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [MatIconRegistry],
  bootstrap: [AppComponent],
  exports: [MapComponent],
})
export class AppModule {
  constructor(public matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}

import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { ListComponent } from './list/list.component';
import { InformationComponent } from './information/information.component';
import { CaptureBuildingComponent } from './capture-building/capture-building.component';
import { ContactComponent } from './contact/contact.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'list',
    component: ListComponent,
  },
  {
    path: 'info',
    component: InformationComponent,
  },
  {
    path: 'capture-building',
    component: CaptureBuildingComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: '**',
    component: MapComponent,
  },
  {
    path: '',
    redirectTo: '/map',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}

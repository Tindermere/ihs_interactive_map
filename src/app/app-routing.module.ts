import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from './map/map.component';
import {ListComponent} from './list/list.component';
import {CaptureBuildingComponent} from './capture-building/capture-building.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'list',
    component: ListComponent,
  },
  {
    path: 'capture-building',
    component: CaptureBuildingComponent,
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
export class AppRoutingModule {
}

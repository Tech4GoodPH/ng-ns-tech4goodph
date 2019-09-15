import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

import { MapComponent } from './views/map/map.component';
import { DetailsComponent } from './views/details/details.component';
import { DetailsDialogComponent } from './views/details-dialog/details-dialog.component';

const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'map/:mode',
    component: MapComponent,
    data: { title: 'Map View'},
    children: [
        {
            path: 'modal-view',
            component: DetailsDialogComponent
        }
    ]
  },
  { path: 'map',
    component: MapComponent,
    data: { title: 'Map View'},
    children: [
        {
            path: 'modal-view',
            component: DetailsDialogComponent
        }
    ]
  },
  { path: 'details/:id', component: DetailsComponent},

];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

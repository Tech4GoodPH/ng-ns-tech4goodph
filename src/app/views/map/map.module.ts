import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        MapRoutingModule,
    ],
    declarations: [
        MapComponent,
        DetailsDialogComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    entryComponents: [
        DetailsDialogComponent
    ]
})
export class HomeModule { }

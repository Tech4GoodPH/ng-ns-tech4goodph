import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './views/map/map.component';
import { DetailsComponent } from './views/details/details.component';
import { PhotoCardComponent } from './views/details/photo-card/photo-card.component';
import { RatingPipe } from './pipes/rating.pipe';
import { DetailsDialogComponent } from './views/details-dialog/details-dialog.component';
import { ActionBarComponent } from './views/action-bar/action-bar.component';
import { isIOS } from 'tns-core-modules/platform';
declare var GMSServices: any;
// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

if (isIOS) {
  GMSServices.provideAPIKey('AIzaSyCbKLdAXndfKwzW30H2qx-I7x0ZqC2HSH4');
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        MapComponent,
        DetailsComponent,
        PhotoCardComponent,
        RatingPipe,
        DetailsDialogComponent,
        ActionBarComponent,
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }

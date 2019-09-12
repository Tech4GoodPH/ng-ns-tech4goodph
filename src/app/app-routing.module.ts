import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { MapComponent } from "./views/map/map.component";
import { CameraComponent } from "./views/camera/camera.component";
import { DetailsComponent } from "./views/details/details.component";


const routes: Routes = [
    { path: "", redirectTo: "/map", pathMatch: "full" },
    { path: "map", component: MapComponent},
    { path: "camera", component: CameraComponent},
    { path: "details/:id", component: DetailsComponent},

];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

import { Component, OnInit } from "@angular/core";
import { ApiAccessService } from "./services/api-access/api-access.service";
import { MockDataService } from "./services/mock-data/mock-data.service";

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {

    constructor (
        private apiService: ApiAccessService,
        private mockService: MockDataService
    ) {}

    ngOnInit () {
        // todo: remove when Backend is working
        this.apiService.saveToLocal(this.mockService.generatePhotosArray());
    }

}

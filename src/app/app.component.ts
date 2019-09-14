import { Component, OnInit } from '@angular/core';
import { LoggerService } from './services/logger/logger.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { ApiAccessService } from './services/api-access/api-access.service';
import { MockDataService } from './services/mock-data/mock-data.service';

@Component({
    selector: 'ns-app',
    moduleId: module.id,
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor (
        private loggerService: LoggerService,
        private apiService: ApiAccessService,
        private localStorage: LocalStorageService,
        private mockService: MockDataService
    ) {}

    ngOnInit () {
        this.loggerService.debug(`[AppComponent] initialize...`);
        // this.localStorage.clear();
        // this.apiService.saveToLocal(this.mockService.generatePhotosArray());
    }

}

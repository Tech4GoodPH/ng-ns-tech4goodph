import { Component, OnInit } from '@angular/core';
import { LoggerService } from './services/logger/logger.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';

@Component({
    selector: 'ns-app',
    moduleId: module.id,
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor (
        private loggerService: LoggerService,
        private localStorage: LocalStorageService
    ) {}

    ngOnInit () {
        this.loggerService.debug(`[AppComponent] initialize...`);
        // this.localStorage.clear();
    }

}

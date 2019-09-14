import { Component, OnInit } from '@angular/core';
import { LoggerService } from './services/logger/logger.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { ApiAccessService } from './services/api-access/api-access.service';
import { MockDataService } from './services/mock-data/mock-data.service';
import { isIOS } from 'tns-core-modules/platform';
import { topmost } from 'tns-core-modules/ui/frame';
import * as app from 'tns-core-modules/application';
import { ConfigurationService } from './services/configuration/configuration.service';

declare var android;

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
        private mockService: MockDataService,
        private configurationService: ConfigurationService
    ) {
        if (isIOS) {
            this.loggerService.debug(`[AppComponent constructor] iOS device detected`);
            topmost().ios.controller.navigationBar.barStyle = 0; // 0 is white text, 1 is dark text
        } else {
            this.loggerService.debug(`[AppComponent constructor] Android device detected`);
            const decorView = app.android.startActivity.getWindow()
                .getDecorView();
            decorView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }
    }

    ngOnInit () {
        this.loggerService.debug(`[AppComponent] initialize...`);
        if (this.configurationService.demoMode) {
            this.localStorage.clear();
            this.apiService.saveToLocal(this.mockService.generatePhotosArray(50));
        }
    }

}

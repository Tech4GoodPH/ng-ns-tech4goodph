import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { LoggerService } from '~/app/services/logger/logger.service';
import { ConfigurationService } from '~/app/services/configuration/configuration.service';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { RouterExtensions } from 'nativescript-angular/router';

import * as application from 'tns-core-modules/application';

/**
 * Details view component for reviewing photo data before uploading
 */
@Component({
  selector: 'ns-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  moduleId: module.id,
})
export class DetailsComponent implements OnInit {

  photoId: string;
  appName: string;

  constructor(
    private configurationService: ConfigurationService,
    private route: ActivatedRoute,
    private loggerService: LoggerService,
    private apiService: ApiAccessService,
    private router: RouterExtensions
  ) { }

  ngOnInit() {

    // TODO: handle iOS
    application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
      args.cancel = true;
      this.loggerService.debug(`[DetailsComponent] back detected`);
      this.cancel();
    });

    this.appName = this.configurationService.appName;
    this.route.params.forEach((params: Params) => {
      this.photoId = params.id;
    });
    this.loggerService.debug(`[DetailsComponent initialize...] ${this.photoId}`);
  }

  cancel() {
    this.apiService.removeFromLocal(this.photoId);
    this.loggerService.debug(`[DetailsComponent cancel]`);
    this.router.navigate(['map', {pageTransition: 'slideRight', clearHistory: true}]);
  }

  ratePhoto(rating: number) {
    if (typeof this.photoId !== 'string') {
      return;
    }
    const photo = this.apiService.getLocalPhoto(this.photoId);
    // remove from local
    this.apiService.removeFromLocal(this.photoId);
    // upload photo
    photo.rating = rating;
    this.apiService.uploadPhoto(photo);
    this.loggerService.debug(`[DetailsComponent ratePhoto] ${rating}`);
    this.router.navigate(['map', {pageTransition: 'slideRight', clearHistory: true}]);
  }

}

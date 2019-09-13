import { Component, OnInit, Input } from '@angular/core';

import { RouterExtensions } from 'nativescript-angular/router';

import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { LoggerService } from '~/app/services/logger/logger.service';

/**
 * Submission buttons for uploading photo with rating data
 */
@Component({
  selector: 'ns-submission-buttons',
  templateUrl: './submission-buttons.component.html',
  styleUrls: ['./submission-buttons.component.css'],
  moduleId: module.id,
})
export class SubmissionButtonsComponent implements OnInit {
  @Input() photoId: string;

  constructor(
    private apiService: ApiAccessService,
    private router: RouterExtensions,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.apiService.removeFromLocal(this.photoId);
    this.loggerService.debug(`[SubmissionButtonsComponent cancel]`);
    // this.router.navigate(['map', {pageTransition: 'slideRight'}]);
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
    this.loggerService.debug(`[SubmissionButtonsComponent ratePhoto] ${rating}`);
    this.router.navigate(['map']);
  }

}

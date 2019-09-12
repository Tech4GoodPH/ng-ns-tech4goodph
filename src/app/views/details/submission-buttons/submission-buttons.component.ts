import { Component, OnInit, Input } from '@angular/core';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { LoggerService } from '~/app/services/logger/logger.service';

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

  ratePhoto(rating: number) {
    if (typeof this.photoId !== 'string') {
      return
    }
    const photo = this.apiService.getLocalPhoto(this.photoId);
    // remove from local
    this.apiService.removeFromLocal(this.photoId);
    // upload photo
    photo.rating = rating;
    this.apiService.uploadPhoto(photo);
    this.loggerService.debug(`[SubmissionButtonsComponent ratePhoto] ${rating | rating}`);
    this.router.navigate(['map']);
  }

}

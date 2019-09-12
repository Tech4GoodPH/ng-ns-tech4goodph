import { Component, OnInit, Input } from '@angular/core';
import { Photo } from '~/app/interfaces/photo.interface';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { LoggerService } from '~/app/services/logger/logger.service';

@Component({
  selector: 'ns-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.css'],
  moduleId: module.id,
})
export class PhotoCardComponent implements OnInit {

  @Input() photoId: string;
  photo: Photo;

  constructor(
    private apiService: ApiAccessService,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
    this.photo = this.apiService.getLocalPhoto(this.photoId);
    if (!this.photo) {
      this.loggerService.debug(`[PhotoCardComponent initialize...] No Photo Found for ${this.photoId}`);
    }
  }

}

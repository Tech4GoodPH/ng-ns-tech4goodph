import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { LoggerService } from '~/app/services/logger/logger.service';
import { switchMap } from 'rxjs/operators';

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

  constructor(
    private route: ActivatedRoute,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.photoId = params.id;
    });
    this.loggerService.debug(`[DetailsComponent initialize...] ${this.photoId}`);
  }

}

import { Component, OnInit } from '@angular/core';
import { Photo } from '~/app/interfaces/photo.interface';
import { MockDataService } from '~/app/services/mock-data/mock-data.service';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { LoggerService } from '~/app/services/logger/logger.service';
import { Location } from '@angular/common';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
  moduleId: module.id,
})
export class CameraComponent implements OnInit {

  constructor(
    private mockDataService: MockDataService,
    private apiService: ApiAccessService,
    private router: RouterExtensions,
    private location: Location,
    private loggerService: LoggerService
  ) { }

  ngOnInit() {
  }

  shoot() {
    const photo: Photo = this.mockDataService.generatePhoto();
    this.apiService.uploadPhoto(photo);
    this.loggerService.debug(`[CameraComponent shoot]`, photo.id);
    // open photo detail
    this.router.navigate(['details', photo.id]);
  }

  back(){
    this.loggerService.debug(`[CameraComponent back]`);
    this.router.navigate(['map']);
  }

}

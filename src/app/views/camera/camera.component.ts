import { Component, OnInit } from '@angular/core';
import { Photo } from '~/app/interfaces/photo.interface';
import { MockDataService } from '~/app/services/mock-data/mock-data.service';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
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
    private routerExtensions: RouterExtensions
  ) { }

  ngOnInit() {
  }

  shoot() {
    const photo: Photo = this.mockDataService.generatePhoto();
    this.apiService.uploadPhoto(photo);
    // open photo detail
    this.routerExtensions.navigate(['details', photo.id]);
  }

}

import { Component, OnInit } from '@angular/core';
import { Photo } from '~/app/interfaces/photo.interface';
import { LocalStorageService } from '~/app/services/local-storage/local-storage.service';
import { PHOTOS_STORAGE_KEY } from '~/app/services/api-access/api-access.service';
import { LoggerService } from '~/app/services/logger/logger.service';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'ns-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  moduleId: module.id,
})
export class MapComponent implements OnInit {

  photosArray: Photo[];

  constructor(
    private localStorage: LocalStorageService,
    private loggerService: LoggerService,
    private router: RouterExtensions
  ) { }

  ngOnInit() {
    this.photosArray = this.localStorage.getItem(PHOTOS_STORAGE_KEY);
  }

  onItemTap(args){
    const photoId = args.view.bindingContext.id;
    this.loggerService.debug(`[MapComponent onItemTap] ${photoId}`);
    this.router.navigate(['details', photoId]);
  }
}

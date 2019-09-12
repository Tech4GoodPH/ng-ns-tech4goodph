import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { RouterExtensions } from 'nativescript-angular/router';

import { Photo } from '~/app/interfaces/photo.interface';
import { LocalStorageService } from '~/app/services/local-storage/local-storage.service';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { LoggerService } from '~/app/services/logger/logger.service';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';

@Component({
  selector: 'ns-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [ModalDialogService],
  moduleId: module.id,
})
export class MapComponent implements OnInit {

  photosArray: Photo[];

  constructor(
    private localStorage: LocalStorageService,
    private apiService: ApiAccessService,
    private loggerService: LoggerService,
    private viewContainer: ViewContainerRef,
    private dialogService: ModalDialogService
  ) { }

  ngOnInit() {
    this.photosArray = this.apiService.listPhotos();
  }

  clearLocalStorage() {
    this.photosArray = [];
    this.localStorage.clear();
  }

  onItemTap (args) {
    const photoId = args.view.bindingContext.id;
    this.loggerService.debug(`[MapComponent onItemTap] ${photoId}`);

    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainer,
      context: { photoId },
      fullscreen: false
    };
    this.dialogService.showModal(DetailsDialogComponent, options);
  }
}

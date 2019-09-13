import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { Photo } from '~/app/interfaces/photo.interface';
import { LocalStorageService } from '~/app/services/local-storage/local-storage.service';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { LoggerService } from '~/app/services/logger/logger.service';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';

import { Accuracy } from 'tns-core-modules/ui/enums';
import * as geolocation from 'nativescript-geolocation';

import { registerElement } from 'nativescript-angular/element-registry';
registerElement('Mapbox', () => require('nativescript-mapbox').MapboxView);

/**
 * Map view component
 */
@Component({
  selector: 'ns-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [ModalDialogService],
  moduleId: module.id,
})
export class MapComponent implements OnInit, AfterViewInit {

  currentLat: number;
  currentLng: number;

  photosArray: Photo[];
  map: any;

  @ViewChild('map', {static: false}) public mapbox: ElementRef;

  constructor(
    private localStorage: LocalStorageService,
    private apiService: ApiAccessService,
    private loggerService: LoggerService,
    private viewContainer: ViewContainerRef,
    private dialogService: ModalDialogService
  ) { }

  ngOnInit() {
    this.photosArray = this.apiService.listPhotos();
    this.loggerService.debug(`[MapComponent initialize] checking if geolocation is enabled.`);
  }

  ngAfterViewInit() {
    this.checkGeoLocation();
  }

  /**
   * Centers the map to the current location
   */
  recenterMap() {
    if (this.map) {
      this.map.setCenter(
        {
            lat: this.currentLat, // mandatory
            lng: this.currentLng, // mandatory
            animated: true, // default true
            zoomLevel: 14
        }
      );
      this.loggerService.debug(`[MapComponent recenter map]`);
    } else {
      this.loggerService.error(`[MapComponent recenter map] map not found`);
    }
  }

  /**
   * Clears the photos in the Map
   */
  clearPhotosArray() {
    this.photosArray = [];
    this.localStorage.clear();
  }

  /**
   * Call on tap of photo point or item
   * @param args - tap event object
   */
  onItemTap (args: any) {
    const photoId = args.view.bindingContext.id;
    this.loggerService.debug(`[MapComponent onItemTap] ${photoId}`);

    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainer,
      context: { photoId },
      fullscreen: false
    };
    this.dialogService.showModal(DetailsDialogComponent, options);
  }

  /**
   * Fires after Mapbox map is rendered
   * @param args - map render finish event object
   */
  onMapReady(args: any) {
    this.map = args.map;
    this.recenterMap();
  }

  /**
   * Checks whether location access is permitted. If not, fires a request prompt.
   */
  private checkGeoLocation() {
    geolocation.isEnabled().then(enabled => {
      this.loggerService.debug(`[MapComponent initialize] geolocation isEnabled = ${enabled}`);
      if (enabled) {
          this.watchUserLocation();
      } else {
          this.requestLocationAccess();
      }
    }, e => {
      this.loggerService.error(`[MapComponent initialize] isEnabled error`, e);
      this.requestLocationAccess();
    });
  }

  /**
   * Opens a request prompt for location access
   */
  private requestLocationAccess() {
    this.loggerService.debug(`[MapComponent request] request `);
    geolocation.enableLocationRequest().then(() => {
        this.loggerService.debug(`[MapComponent request] location enabled!`);
        this.watchUserLocation();
    }, e => {
        this.loggerService.error(`[MapComponent request] Failed to enable`, e);
    });
  }

  /**
   * Watches for change in users location then sets current location (x, y)
   */
  private watchUserLocation() {
      this.loggerService.debug(`[MapComponent watch] watchLocation()`);
      geolocation.watchLocation(position => {
          this.currentLat = position.latitude;
          this.currentLng = position.longitude;
          this.recenterMap();
          this.loggerService.debug(`[MapComponent watch] current location: (${this.currentLat}, ${this.currentLng})`);
      }, e => {
          this.loggerService.error('[MapComponent watch] failed to get location');
      }, {
          desiredAccuracy: Accuracy.high,
          minimumUpdateTime: 500
      });
  }
}

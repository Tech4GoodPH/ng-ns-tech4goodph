import { Component, OnInit, ViewContainerRef, AfterViewInit } from '@angular/core';

import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { ImageAsset } from 'tns-core-modules/image-asset';

import { DEFAULT_Y, DEFAULT_X, Photo } from '~/app/interfaces/photo.interface';
import { LocalStorageService } from '~/app/services/local-storage/local-storage.service';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { LoggerService } from '~/app/services/logger/logger.service';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';

import { Accuracy } from 'tns-core-modules/ui/enums';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';

import { registerElement } from 'nativescript-angular/element-registry';
import { Color } from 'tns-core-modules/color/color';
registerElement('MapView', () => MapView);

import * as geolocation from 'nativescript-geolocation';
import * as camera from 'nativescript-camera';

export const DEFAULT_ZOOM = 12;

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

  /** map settings */
    zoom = DEFAULT_ZOOM;
    minZoom = 0;
    maxZoom = 22;
    bearing = 0;
    tilt = 0;
    padding = [40, 40, 40, 40];
    centerLocation: geolocation.Location;
    currentLat = DEFAULT_X;
    currentLng = DEFAULT_Y;
    lastCamera: String;
    photosArray: Photo[];
    map: MapView;

  /** camera settings */
    saveToGallery = false;
    allowsEditing = false;
    keepAspectRatio = true;
    width = 320;
    height = 240;
    cameraImage: ImageAsset;
    actualWidth: number;
    actualHeight: number;
    scale = 1;
    labelText: string;

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

  ngAfterViewInit() {
    this.checkGeoLocation();
  }

  openCamera(args) {
    camera.requestPermissions().then(
      () => {
        const cameraSettings = {
          width: this.width,
          height: this.height,
          keepAspectRatio: this.keepAspectRatio,
          saveToGallery: this.saveToGallery,
          allowsEditing: this.allowsEditing
        };
        camera.takePicture()
            .then((imageAsset: any) => {
                this.cameraImage = imageAsset;
                const that = this;
                imageAsset.getImageAsync(function (nativeImage, ex) {
                    if (ex instanceof Error) {
                        throw ex;
                    } else if (typeof ex === 'string') {
                        throw new Error(ex);
                    }

                    if (imageAsset.android) {
                        // get the current density of the screen (dpi) and divide it by the default one to get the scale
                        that.scale = nativeImage.getDensity(); // / android.util.DisplayMetrics.DENSITY_DEFAULT;
                        that.actualWidth = nativeImage.getWidth();
                        that.actualHeight = nativeImage.getHeight();
                    } else {
                        that.scale = nativeImage.scale;
                        that.actualWidth = nativeImage.size.width * that.scale;
                        that.actualHeight = nativeImage.size.height * that.scale;
                    }
                    that.labelText = `Displayed Size: ${that.actualWidth}x${that.actualHeight} with scale ${that.scale}\n` +
                        `Image Size: ${Math.round(that.actualWidth / that.scale)}x${Math.round(that.actualHeight / that.scale)}`;

                    console.log(`${that.labelText}`);
                });
            }, (error) => {
                console.log('Error: ' + error);
            });
      },
      () => alert('permissions rejected')
    );
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
  onItemTap (photoId: string) {
    this.loggerService.debug(`[MapComponent onItemTap] ${photoId}`);

    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainer,
      context: { photoId },
      fullscreen: false
    };
    this.dialogService.showModal(DetailsDialogComponent, options);
  }

    onCoordinateTapped(args) {
        console.log('Coordinate Tapped, Lat: ' + args.position.latitude + ', Lon: ' + args.position.longitude, args);
    }

    onMarkerEvent(args) {
      this.onItemTap(args.marker.userData.id);
    }

    onCameraChanged(args) {
        // console.log('Camera changed: ' + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
        this.lastCamera = JSON.stringify(args.camera);
    }

    onCameraMove(args) {
        // console.log('Camera moving: ' + JSON.stringify(args.camera));
    }

  /**
   * Fires after map is rendered
   * @param args - map render finish event object
   */
  onMapReady(event: any) {
    this.map = event.object;
    this.addMarkers();

    this.loggerService.debug(`[MapComponent onMapReady]`);
  }

  private addMarkers() {
    this.photosArray.forEach(photo => {
      const marker = new Marker();
      marker.position = Position.positionFromLatLng(photo.lat, photo.lng);
      // marker.title = photo.id;
      // marker.snippet = this.apiService.ratingToString(photo.rating);
      switch (photo.rating) {
        case 1: marker.color = new Color('green'); break;
        case 0: marker.color = new Color('red'); break;
        default: marker.color = new Color('green'); break;
      }
      marker.userData = {id: photo.id};
      if (this.map) {
        this.map.addMarker(marker);
      }
    });
  }

  /**
   * Checks whether location access is permitted. If not, fires a request prompt.
   */
  private checkGeoLocation() {
    this.loggerService.debug(`[MapComponent checkGeoLocation] checking if geolocation is enabled.`);
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
    this.loggerService.debug(`[MapComponent request] request location access permission`);
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
      this.loggerService.debug(`[MapComponent watchUserLocation]`);
      geolocation.watchLocation(position => {
        this.centerLocation = position;
        this.recenterMap();
        this.loggerService.debug(`[MapComponent watchUserLocation] current location: (${this.currentLat}, ${this.currentLng})`);
      }, e => {
          this.loggerService.error('[MapComponent watchUserLocation] failed to get location');
      }, {
          desiredAccuracy: Accuracy.high,
          minimumUpdateTime: 100
      });
  }

  private recenterMap() {
    this.currentLat = this.centerLocation.latitude;
    this.currentLng = this.centerLocation.longitude;
    this.zoom = DEFAULT_ZOOM;
    this.loggerService.debug(`[MapComponent recenterMap] (${this.centerLocation.latitude}, ${this.centerLocation.longitude}) zoom:${this.zoom}!`);
  }
}

import { Component, OnInit, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';

import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';

import { ImageAsset } from 'tns-core-modules/image-asset';

import { DEFAULT_Y, DEFAULT_X, Photo } from '~/app/interfaces/photo.interface';
import { LocalStorageService } from '~/app/services/local-storage/local-storage.service';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';
import { LoggerService } from '~/app/services/logger/logger.service';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';

import { Accuracy } from 'tns-core-modules/ui/enums';
import { MapView, Marker, Position, Bounds } from 'nativescript-google-maps-sdk';

import { registerElement } from 'nativescript-angular/element-registry';
import { Color } from 'tns-core-modules/color/color';
import { Image } from 'tns-core-modules/ui/image';
registerElement('MapView', () => MapView);

import * as geolocation from 'nativescript-geolocation';
import * as camera from 'nativescript-camera';
import * as mapUtil from 'nativescript-google-maps-utils';
import { ConfigurationService } from '~/app/services/configuration/configuration.service';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { MockDataService } from '~/app/services/mock-data/mock-data.service';
import { RouterExtensions } from 'nativescript-angular/router';

export enum ViewMode {
  HeatMap = 'HeatMapView',
  PointsMap = 'PoinstMapView'
}
export const DEFAULT_VIEW_MODE = ViewMode.PointsMap; // set default view here
export const DEFAULT_ZOOM = 19;

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
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  appName: string;
  viewMode: ViewMode = ViewMode.PointsMap;
  subscriptions: Subscription[] = [];
  demoMode: boolean;
  ViewMode = ViewMode;

  /** map settings */
    zoom = DEFAULT_ZOOM;
    minZoom = 0;
    maxZoom = 22;
    bearing = 0;
    tilt = 0;
    padding = [40, 40, 40, 40];
    currentLat = DEFAULT_X;
    currentLng = DEFAULT_Y;
    lastCamera: String;
    photosArray: Photo[];
    map: MapView;

  /** camera settings */
    saveToGallery = true;
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
    private mockDataService: MockDataService,
    private configurationService: ConfigurationService,
    private localStorage: LocalStorageService,
    private apiService: ApiAccessService,
    private loggerService: LoggerService,
    private viewContainer: ViewContainerRef,
    private dialogService: ModalDialogService,
    private ngRouter: Router,
    private router: RouterExtensions,
    private route: ActivatedRoute
  ) {
      this.ngRouter.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      const subscription = this.ngRouter.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // Trick the Router into believing it's last link wasn't previously loaded
          this.ngRouter.navigated = false;
        }
      });
      this.subscriptions.push(subscription);
  }

  ngOnInit() {
    this.demoMode = this.configurationService.demoMode;
    this.appName = this.configurationService.appName;
    this.photosArray = this.apiService.listPhotos();

    this.route.params.forEach((params: Params) => {
      this.viewMode = params.mode;
    });

    if (typeof this.viewMode === 'undefined') {
      this.viewMode = DEFAULT_VIEW_MODE;
    }

    this.loggerService.debug(`[MapComponent initialize...] ViewMode: ${this.viewMode} ${this.viewMode === ViewMode.PointsMap ? 'PointsMap View' : 'HeatMap View'}`);
  }

  ngAfterViewInit() {
    this.checkGeoLocation();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  toggleDemoMode() {
    this.demoMode = this.configurationService.toggleDemoMode();
    this.loggerService.debug(`[MapComponent toggleDemoMode] is demo mode? ${this.demoMode}`);
    if (this.demoMode) {
      this.loggerService.debug(`[MapComponent toggleDemoMode] now generating array`);
      this.apiService.saveToLocal(this.mockDataService.generatePhotosArray(50));
    } else {
      this.loggerService.debug(`[MapComponent toggleDemoMode] now clearing array`);
      this.localStorage.clear();
    }
    this.reloadMap();
  }

  togglePointsMap() {
    this.router.navigate(['map', ViewMode.PointsMap]);
  }

  toggleHeatMap() {
    this.router.navigate(['map', ViewMode.HeatMap]);
  }

  setupHeatMap() {
    // positions of bad locations
    const positions = this.photosArray.filter(photo => photo.rating !== 1).map(photo => {
      return Position.positionFromLatLng(photo.lat, photo.lng);
    });
    mapUtil.setupHeatmap(this.map, positions);
    this.loggerService.debug(`[MapComponent setupHeatMap] heatmap toggled for ${positions.length} points`);
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
        camera.takePicture(cameraSettings)
            .then((imageAsset: any) => {
                this.cameraImage = imageAsset;
                const photoImage = new Image();
                photoImage.src = imageAsset;
                imageAsset.getImageAsync((nativeImage, ex) => {
                    if (ex instanceof Error) {
                        throw ex;
                    } else if (typeof ex === 'string') {
                        throw new Error(ex);
                    }

                    if (imageAsset.android) {
                        // get the current density of the screen (dpi) and divide it by the default one to get the scale
                        this.scale = nativeImage.getDensity(); // / android.util.DisplayMetrics.DENSITY_DEFAULT;
                        this.actualWidth = nativeImage.getWidth();
                        this.actualHeight = nativeImage.getHeight();
                    } else {
                        this.scale = nativeImage.scale;
                        this.actualWidth = nativeImage.size.width * this.scale;
                        this.actualHeight = nativeImage.size.height * this.scale;
                    }
                    this.labelText = `Displayed Size: ${this.actualWidth}x${this.actualHeight} with scale ${this.scale}\n` +
                        `Image Size: ${Math.round(this.actualWidth / this.scale)}x${Math.round(this.actualHeight / this.scale)}`;

                    this.loggerService.debug(`[MapComponent openCamera] taken photo`, this.cameraImage);
                    const photo = new Photo(this.cameraImage['_android'], new Date(), this.currentLat, this.currentLng);
                    this.apiService.saveToLocal(photo);
                    this.loggerService.debug(`[MapComponent openCamera] save to local`, photo);
                    // open photo detail
                    this.router.navigate(['details', photo.id, {clearHistory: true}]);

                    // console.log(`${this.labelText}`);
                });
            }, (error) => {
              this.loggerService.error(`[MapComponent openCamera]`, error);
            });
      },
      () => {
        this.loggerService.error(`[MapComponent openCamera] camera request rejected`);
      }
    );
  }

  /**
   * Clears the photos in the Map
   */
  clearPhotosArray() {
    this.loggerService.debug(`[MapComponent clearPhotosArray] clearing ${this.photosArray.length} photos`);
    this.map.removeAllMarkers();
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
      // console.log('Photo Tapped, Lat: ' + args.position.latitude + ', Lon: ' + args.position.longitude, args);
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
    if (this.viewMode === ViewMode.PointsMap) {
      this.addMarkers();
    } else {
      this.setupHeatMap();
    }
    const gmap = this.map.gMap;

    this.loggerService.debug(`[MapComponent onMapReady]`, gmap);
  }

  private addPhotoMarker(photoId: string) {
    const photo = this.apiService.getPhoto(photoId);
    const marker = new Marker();
    marker.position = Position.positionFromLatLng(photo.lat, photo.lng);
    // marker.title = photo.id;
    // marker.snippet = this.apiService.ratingToString(photo.rating);
    switch (photo.rating) {
      case 1: marker.color = new Color('green'); break;
      case 0: marker.color = new Color('red'); break;
      default: marker.color = new Color('gray'); break;
    }
    marker.userData = {id: photo.id};
    if (this.map) {
      this.map.addMarker(marker);
    }
  }

  private reloadMap() {
    this.router.navigate(['map', {clearHistory: true}]);
  }

  private refreshMarkers() {
    if (this.map) {
      this.loggerService.debug(`[MapComponent refreshMarkers]`, this.photosArray);
      this.map.removeAllMarkers();
      this.photosArray = this.apiService.listPhotos();
      this.addMarkers();
    } else {
      this.loggerService.debug(`[MapComponent refreshMarkers] map not yet ready`);
    }
  }

  private addMarkers() {
    if (this.photosArray && this.photosArray.length) {
      this.loggerService.debug(`[MapComponent addMarkers] ${this.photosArray.length} photos`);
      this.photosArray.forEach(photo => {
        const marker = new Marker();
        marker.position = Position.positionFromLatLng(photo.lat, photo.lng);
        // marker.title = photo.id;
        // marker.snippet = this.apiService.ratingToString(photo.rating);
        switch (photo.rating) {
          case 1: marker.color = new Color('#7ed957'); break;
          case 0: marker.color = new Color('#ff5c5c'); break;
          default: marker.color = new Color('gray'); break;
        }
        marker.userData = {id: photo.id};
        if (this.map) {
          this.map.addMarker(marker);
        }
      });
    } else {
      this.loggerService.debug(`[MapComponent addMarkers] photosArray not yet populated`);
    }
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
        // don't recenter if heat map is toggled
        if (this.viewMode === ViewMode.HeatMap) {
          this.currentLat = position.latitude;
          this.currentLng = position.longitude;
        }
        this.loggerService.debug(`[MapComponent watchUserLocation] current location: (${this.currentLat}, ${this.currentLng})`);
      }, e => {
          this.loggerService.error('[MapComponent watchUserLocation] failed to get location');
      }, {
          desiredAccuracy: Accuracy.high,
          minimumUpdateTime: 100
      });
  }

  private recenterMap() {
    const southWest = Position.positionFromLatLng(this.currentLat - 0.0006943, this.currentLng - 0.0004659);
    const northEast = Position.positionFromLatLng(this.currentLat + 0.0006943, this.currentLng + 0.0004659);
    const bounds = Bounds.fromCoordinates(southWest, northEast);
    this.map.setViewport(bounds);
    this.refreshMarkers();
    this.loggerService.debug(`[MapComponent recenterMap] (${this.currentLat}, ${this.currentLng})`);
  }
}

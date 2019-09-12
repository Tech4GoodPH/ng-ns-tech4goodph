import { Component, OnInit, Input } from '@angular/core';
import { Photo } from '~/app/interfaces/photo.interface';
import { ApiAccessService } from '~/app/services/api-access/api-access.service';

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
    private apiService: ApiAccessService
  ) { }

  ngOnInit() {
    this.photo = this.apiService.getPhoto(this.photoId);
  }

}

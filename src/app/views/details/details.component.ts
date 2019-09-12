import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  ) { }

  ngOnInit() {
    this.photoId = this.route.paramMap[0];
  }

}

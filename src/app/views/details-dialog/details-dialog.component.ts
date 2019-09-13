import { Component, OnInit } from '@angular/core';

import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

/**
 * Photo details dialog
 */
@Component({
  selector: 'ns-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.css'],
  moduleId: module.id,
})
export class DetailsDialogComponent implements OnInit {

    photoId: string;

    constructor(
      private params: ModalDialogParams
    ) {}

    ngOnInit(): void {
      this.photoId = this.params.context.photoId;
    }

    onClose() {
      this.params.closeCallback();
    }
}

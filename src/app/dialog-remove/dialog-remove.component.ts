import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'dialog-remove',
    templateUrl: 'dialog-remove.component.html',
  })
  export class DialogRemoveComponent implements OnInit {
    public mode: string = 'library';
    constructor(
        public dialogRef: MatDialogRef<DialogRemoveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    public onNoClick(): void {
      this.dialogRef.close();
    }

    public closeDialog() {
        this.dialogRef.close({
            mode: this.mode
        });
    }

    public ngOnInit() {
      this.mode = this.data.mode;
    }
  }

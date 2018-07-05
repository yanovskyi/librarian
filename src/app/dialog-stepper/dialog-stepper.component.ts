import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MouseEvent } from '@agm/core';
import * as $ from 'jquery';

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
    selector: 'dialog-stepper',
    templateUrl: 'dialog-stepper.component.html',
  })
  export class DialogStepperComponent implements OnInit {
    @ViewChild('dialogTitle') public dialogTitle: any;

    @ViewChild('libraryName') public libraryName: any;
    @ViewChild('libraryAddress') public libraryAddress: any;
    @ViewChild('libraryCoordLat') public libraryCoordLat: any;
    @ViewChild('libraryCoordLng') public libraryCoordLng: any;

    @ViewChild('bookName') public bookName: any;
    @ViewChild('bookAuthor') public bookAuthor: any;
    @ViewChild('bookYear') public bookYear: any;
    @ViewChild('bookISBN') public bookISBN: any;
    @ViewChild('bookCover') public bookCover: any;

    @ViewChild('instanceLibrary') public instanceLibrary: any;
    @ViewChild('instanceBook') public instanceBook: any;
    @ViewChild('instanceReturningStatus') public instanceReturningStatus: any;
    @ViewChild('instanceReturningTime') public instanceReturningTime: any;

    public instanceLibraryValue: any;
    public instanceBookValue: any;
    public instanceReturningStatusValue: boolean;
    public instanceReturningTimeValue: any;
    public isLinear = true;
    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;
    public thirdFormGroup: FormGroup;
    public fourthFormGroup: FormGroup;
    public fifthFormGroup: FormGroup;
    public statusFormGroup: FormGroup;
    public dateFormGroup: FormGroup;
    public lat: number = 50.44742371378133;
    public lng: number = 30.526552094714248;
    public markers: Marker[] = [];
    public mode: string = 'addLibrary';

    constructor(
        public dialogRef: MatDialogRef<DialogStepperComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder) {}

    public onNoClick(): void {
        this.dialogRef.close();
    }

    /*************************************************************************** */
    /*** Функція відправлення данних до компоненту admin-mode, який визвав даний компонент */
    /************************************************************************** */
    public closeDialog() {
        if ((this.mode === 'addLibrary') || (this.mode === 'editLibrary')) {
            this.dialogRef.close({
                libraryName: this.libraryName.nativeElement.value,
                libraryAddress: this.libraryAddress.nativeElement.value,
                libraryCoord: [this.libraryCoordLat.nativeElement.value,
                            this.libraryCoordLng.nativeElement.value],
                mode: this.mode
            });
        } else if ((this.mode === 'addBook') || (this.mode === 'editBook')) {
            this.dialogRef.close({
                bookName: this.bookName.nativeElement.value,
                bookAuthor: this.bookAuthor.nativeElement.value,
                bookYear: this.bookYear.nativeElement.value,
                bookISBN: this.bookISBN.nativeElement.value,
                bookCover: this.bookCover.nativeElement.value,
                mode: this.mode
            });
        } else if ((this.mode === 'addInstance') || (this.mode === 'editInstance')) {
            this.dialogRef.close({
                instanceLibrary: this.instanceLibrary.value,
                instanceBook: this.instanceBook.value,
                instanceReturningStatus: this.instanceReturningStatus.checked,
                instanceReturningTime: this.instanceReturningTime.nativeElement.value,
                mode: this.mode
            });
        }
    }

    /*************************************************************************** */
    /*** Функція додавання маркеру на карту для визначення координат бібліотеки * */
    /************************************************************************** */
    public mapClicked($event: MouseEvent) {
        this.markers = [];
        this.markers.push({
            lat: $event.coords.lat,
            lng: $event.coords.lng,
            draggable: false
        });
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;
    }

    public ngOnInit() {
        $(this.dialogTitle.nativeElement).text(this.data.title);
        this.mode = this.data.mode;
        if (this.mode === 'addLibrary') {
            this.firstFormGroup = this._formBuilder.group({
                firstCtrl: ['', Validators.required]
            });
            this.secondFormGroup = this._formBuilder.group({
                secondCtrl: ['', Validators.required]
            });
            this.thirdFormGroup = this._formBuilder.group({});
        } else if (this.mode === 'addBook') {
            this.firstFormGroup = this._formBuilder.group({
                firstCtrl: ['', Validators.required]
            });
            this.secondFormGroup = this._formBuilder.group({
                secondCtrl: ['', Validators.required]
            });
            this.thirdFormGroup = this._formBuilder.group({
                thirdCtrl: ['', Validators.required]
            });
            this.fourthFormGroup = this._formBuilder.group({
                fourthCtrl: ['', Validators.required]
            });
            this.fifthFormGroup = this._formBuilder.group({
                fifthCtrl: ['', Validators.required]
            });

        } else if (this.mode === 'addInstance') {
            this.firstFormGroup = this._formBuilder.group({});
            this.secondFormGroup = this._formBuilder.group({});
            this.statusFormGroup = this._formBuilder.group({});
            this.dateFormGroup = this._formBuilder.group({
                dateCtrl: []
            });

            this.instanceLibraryValue = this.data.libraries[0]['id'];
            this.instanceBookValue = this.data.books[0]['id'];
            this.instanceReturningStatusValue = true;
            let newReturningTime = new Date();
            this.instanceReturningTimeValue = (newReturningTime.getMonth() + 1)
                                            + '/' + newReturningTime.getDate()
                                            + '/' + newReturningTime.getFullYear()
                                            + ' ' + newReturningTime.getHours()
                                            + ':' + ('0'
                                            + newReturningTime.getMinutes()).slice(-2);
        } else if (this.mode === 'editLibrary') {
            this.firstFormGroup = this._formBuilder.group({
                firstCtrl: [ this.data.libraryName, Validators.required]
            });
            this.secondFormGroup = this._formBuilder.group({
                secondCtrl: [this.data.libraryAddress, Validators.required]
            });
            this.thirdFormGroup = this._formBuilder.group({});

            this.lat = parseFloat(this.data.libraryCoord.split(',')[0]);
            this.lng = parseFloat(this.data.libraryCoord.split(',')[1]);

            this.markers.push({
                lat: this.lat,
                lng: this.lng,
                draggable: false
              });
        } else if (this.mode === 'editBook') {
            this.firstFormGroup = this._formBuilder.group({
                firstCtrl: [ this.data.bookName, Validators.required]
            });
            this.secondFormGroup = this._formBuilder.group({
                secondCtrl: [this.data.bookAuthor, Validators.required]
            });

            this.thirdFormGroup = this._formBuilder.group({
                thirdCtrl: [ this.data.bookYear, Validators.required]
            });
            this.fourthFormGroup = this._formBuilder.group({
                fourthCtrl: [this.data.bookISBN, Validators.required]
            });
            this.fifthFormGroup = this._formBuilder.group({
                fifthCtrl: [this.data.bookCover, Validators.required]
            });

        } else if (this.mode === 'editInstance') {
            this.firstFormGroup = this._formBuilder.group({});
            this.secondFormGroup = this._formBuilder.group({});
            this.statusFormGroup = this._formBuilder.group({});
            this.dateFormGroup = this._formBuilder.group({
                dateCtrl: []
            });
            this.instanceLibraryValue = this.data.instanceLibrary;
            this.instanceBookValue = this.data.instanceBook;
            if (this.data.instanceReturningStatus === true) {
                this.instanceReturningStatusValue = true;
            } else {
                this.instanceReturningStatusValue = false;
            }
            this.instanceReturningTimeValue = this.data.instanceReturningTime;
        }
    }
  }

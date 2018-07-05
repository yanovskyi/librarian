import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AuthenticationService } from '../services/authentication.service';
import { DefaultDataService } from '../services/default-data.service';
import { DialogRemoveComponent } from '../dialog-remove/dialog-remove.component';
import { DialogStepperComponent } from '../dialog-stepper/dialog-stepper.component';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar,
         MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface LibraryData {
    id: string;
    name: string;
    address: string;
    coord: string;
}

export interface BookData {
    id: string;
    name: string;
    author: string;
    year: string;
    isbn: string;
    cover: string;
}

export interface InstanceData {
    id: string;
    id_library: string;
    id_book: string;
    returning_status: string;
    returning_time: string;
}

@Component({
    selector:   'admin-mode',
    templateUrl: 'admin-mode.component.html',
    styleUrls: ['admin-mode.component.scss'],
    providers: []
})
export class AdminModeComponent implements OnInit {
    @ViewChild('libraryPaginator') public libraryPaginator: MatPaginator;
    @ViewChild('bookPaginator') public bookPaginator: MatPaginator;
    @ViewChild('instancePaginator') public instancePaginator: MatPaginator;
    public loginFlag: boolean = false;
    public onlineLibrarianData = {
        libraries: [],
        books: [],
        instances: []
    };

    public displayedColumns = ['id', 'name', 'address', 'coord', 'buttons'];
    public dataSource: MatTableDataSource<LibraryData>;

    public displayedColumnsBooks = ['id', 'name', 'author', 'year',
                                    'isbn', 'cover', 'image', 'buttons'];
    public dataSourceBooks: MatTableDataSource<BookData>;

    public displayedColumnsInstances = ['id', 'image', 'id_book', 'id_library',
                                        'returning_status', 'returning_time', 'buttons'];
    public dataSourceInstances: MatTableDataSource<InstanceData>;

    constructor(private authenticationService: AuthenticationService,
                private defaultDataService: DefaultDataService,
                private router: Router,
                public snackBar: MatSnackBar,
                public dialog: MatDialog) {
        if (this.authenticationService.check()) {
            this.loginFlag = true;
            this.authenticationService.sendMessage('true');
        } else {
            this.loginFlag = false;
            this.authenticationService.sendMessage('false');
            this.router.navigate(['/']);
        }
    }

    /*************************************************************************** */
    /**************** Функції фільтрів для списків Бібліотек, Книжок, Екземплярів книжок */
    /************************************************************************** */
    public applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public applyFilterBook(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSourceBooks.filter = filterValue;
        if (this.dataSourceBooks.paginator) {
            this.dataSourceBooks.paginator.firstPage();
        }
    }

    /*************************************************************************** */
    /**************** Функція видалення бібліотеки************************ */
    /************************************************************************** */
    public removeLibrary(id: any) {

        const dialogRef = this.dialog.open(DialogRemoveComponent, {
            // height: '350px'
            width: '300px',
            data: {mode: 'library'}
          });

        dialogRef.afterClosed().subscribe((result) => {
        if ((result) && (result.mode === 'library')) {
            console.log('deleting library', id);

            let instances = this.onlineLibrarianData.instances;
            for (let i = 0; i < instances.length; i++) {
                if (instances[i]['id_library'] === id) {
                    instances.splice(i, 1);
                    i--;
                }
            }
            this.dataSourceInstances = new MatTableDataSource(this.onlineLibrarianData.instances);

            let libraries = this.onlineLibrarianData.libraries;
            let arrayPoz = this.findPozById(libraries, id);
            if (arrayPoz > -1) {
                libraries.splice(arrayPoz, 1);
            }
            this.dataSource = new MatTableDataSource(this.onlineLibrarianData.libraries);
            this.dataSource.paginator = this.libraryPaginator;
            localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
            if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
            }
        }
        });
    }

    /*************************************************************************** */
    /**************** Функція редагування бібліотеки (+ виклик dialog-stepper компоненту) */
    /************************************************************************** */
    public editLibrary(id: any) {
        console.log('editLibrary', id);
        let libraries = this.onlineLibrarianData.libraries;
        let arrayPoz = this.findPozById(libraries, id);
        const dialogRef = this.dialog.open(DialogStepperComponent, {
            data: {
                    title: 'Редагувати бібліотеку',
                    mode: 'editLibrary',
                    libraryName: libraries[arrayPoz]['name'],
                    libraryAddress: libraries[arrayPoz]['address'],
                    libraryCoord: libraries[arrayPoz]['coord']
                }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if ((result) && (result.mode === 'editLibrary')) {
                libraries[arrayPoz]['name'] = result.libraryName;
                libraries[arrayPoz]['address'] = result.libraryAddress;
                libraries[arrayPoz]['coord'] = result.libraryCoord.toString();
                this.dataSource = new MatTableDataSource(this.onlineLibrarianData.libraries);
                this.dataSource.paginator = this.libraryPaginator;
                localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
            }
        });
    }

    /*************************************************************************** */
    /**************** Функція додавання бібліотеки (+ виклик dialog-stepper компоненту) */
    /************************************************************************** */
    public addLibrary() {
        console.log('addLibrary');

        const dialogRef = this.dialog.open(DialogStepperComponent, {
            data: {
                    title: 'Додати нову бібліотеку',
                    mode: 'addLibrary'
                }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if ((result) && (result.mode === 'addLibrary')) {
                let newId = this.findMaxId(this.onlineLibrarianData.libraries);
                this.onlineLibrarianData.libraries.push({
                    id: (newId + 1).toString(),
                    name: result.libraryName,
                    address: result.libraryAddress,
                    coord: result.libraryCoord.toString()
                });
                this.dataSource = new MatTableDataSource(this.onlineLibrarianData.libraries);
                this.dataSource.paginator = this.libraryPaginator;
                localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
            }
        });
    }

    /*************************************************************************** */
    /**************** Функція видалення книжки (+ виклик dialog-remove компоненту) */
    /************************************************************************** */
    public removeBook(id: any) {

        const dialogRef = this.dialog.open(DialogRemoveComponent, {
            width: '300px',
            data: {mode: 'book'}
          });

        dialogRef.afterClosed().subscribe((result) => {
        if ((result) && (result.mode === 'book')) {
            console.log('deleting book', id);

            let instances = this.onlineLibrarianData.instances;
            for (let i = 0; i < instances.length; i++) {
                if (instances[i]['id_book'] === id) {
                    instances.splice(i, 1);
                    i--;
                }
            }
            this.dataSourceInstances = new MatTableDataSource(this.onlineLibrarianData.instances);

            let books = this.onlineLibrarianData.books;
            let arrayPoz = this.findPozById(books, id);
            if (arrayPoz > -1) {
                books.splice(arrayPoz, 1);
            }
            this.dataSourceBooks = new MatTableDataSource(this.onlineLibrarianData.books);
            this.dataSourceBooks.paginator = this.bookPaginator;
            localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
            if (this.dataSourceBooks.paginator) {
                this.dataSourceBooks.paginator.firstPage();
            }
        }
        });
    }

    /*************************************************************************** */
    /**************** Функція редагування книжки (+ виклик dialog-stepper компоненту) ** */
    /************************************************************************** */
    public editBook(id: any) {
        console.log('editLibrary', id);
        let books = this.onlineLibrarianData.books;
        let arrayPoz = this.findPozById(books, id);
        const dialogRef = this.dialog.open(DialogStepperComponent, {
            data: {
                    title: 'Редагувати книжку',
                    mode: 'editBook',
                    bookName: books[arrayPoz]['name'],
                    bookAuthor: books[arrayPoz]['author'],
                    bookYear: books[arrayPoz]['year'],
                    bookISBN: books[arrayPoz]['isbn'],
                    bookCover: books[arrayPoz]['cover'],
                }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if ((result) && (result.mode === 'editBook')) {
                books[arrayPoz]['name'] = result.bookName;
                books[arrayPoz]['author'] = result.bookAuthor;
                books[arrayPoz]['year'] = result.bookYear;
                books[arrayPoz]['isbn'] = result.bookISBN;
                books[arrayPoz]['cover'] = result.bookCover;

                this.dataSourceBooks = new MatTableDataSource(this.onlineLibrarianData.books);
                this.dataSourceBooks.paginator = this.bookPaginator;
                localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
            }
        });
    }

    /*************************************************************************** */
    /**************** Функція додавання книжки (+ виклик dialog-stepper компоненту) ** */
    /************************************************************************** */
    public addBook() {
        console.log('addBook');

        const dialogRef = this.dialog.open(DialogStepperComponent, {
            data: {
                    title: 'Додати нову книжку',
                    mode: 'addBook'
                }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if ((result) && (result.mode === 'addBook')) {
                let newId = this.findMaxId(this.onlineLibrarianData.books);
                this.onlineLibrarianData.books.push({
                    id: (newId + 1).toString(),
                    name: result.bookName,
                    author: result.bookAuthor,
                    year: result.bookYear,
                    isbn: result.bookISBN,
                    cover: result.bookCover
                });
                this.dataSourceBooks = new MatTableDataSource(this.onlineLibrarianData.books);
                this.dataSourceBooks.paginator = this.bookPaginator;
                localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
            }
        });
    }

    /*************************************************************************** */
    /****** Функція видалення екземпляру книжки (+ виклик dialog-remove компоненту) ** */
    /************************************************************************** */
    public removeInstance(id: any) {

        const dialogRef = this.dialog.open(DialogRemoveComponent, {
            width: '300px',
            data: {mode: 'instance'}
          });

        dialogRef.afterClosed().subscribe((result) => {
        if ((result) && (result.mode === 'instance')) {
            console.log('deleting instance', id);
            let instances = this.onlineLibrarianData.instances;
            let arrayPoz = this.findPozById(instances, id);
            if (arrayPoz > -1) {
                instances.splice(arrayPoz, 1);
            }
            this.dataSourceInstances = new MatTableDataSource(this.onlineLibrarianData.instances);
            this.dataSourceInstances.paginator = this.instancePaginator;
            localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
            if (this.dataSourceInstances.paginator) {
                this.dataSourceInstances.paginator.firstPage();
            }
        }
        });
    }

    /*************************************************************************** */
    /****** Функція редагування екземпляру книжки (+ виклик dialog-stepper компоненту) ** */
    /************************************************************************** */
    public editInstance(id: any) {
        console.log('editInstance', id);
        let instances = this.onlineLibrarianData.instances;
        let arrayPoz = this.findPozById(instances, id);
        const dialogRef = this.dialog.open(DialogStepperComponent, {
            data: {
                    title: 'Редагувати екземпляр книжки',
                    mode: 'editInstance',
                    instanceLibrary: instances[arrayPoz]['id_library'],
                    instanceBook: instances[arrayPoz]['id_book'],
                    instanceReturningStatus: instances[arrayPoz]['returning_status'],
                    instanceReturningTime: instances[arrayPoz]['returning_time'],
                    libraries: this.onlineLibrarianData.libraries,
                    books: this.onlineLibrarianData.books
                }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if ((result) && (result.mode === 'editInstance')) {
                instances[arrayPoz]['id_library'] = result.instanceLibrary;
                instances[arrayPoz]['id_book'] = result.instanceBook;
                instances[arrayPoz]['returning_status'] = result.instanceReturningStatus;
                instances[arrayPoz]['returning_time'] = result.instanceReturningTime;

                let instancesData = this.onlineLibrarianData.instances;
                this.dataSourceInstances = new MatTableDataSource(instancesData);
                this.dataSourceInstances.paginator = this.instancePaginator;
                localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
            }
        });
    }

    /*************************************************************************** */
    /***** Функція додавання екземпляру книжки (+ виклик dialog-stepper компоненту) ** */
    /************************************************************************** */
    public addInstance() {
        console.log('addInstance');
        if ((this.onlineLibrarianData.libraries.length > 0)
            && (this.onlineLibrarianData.books.length > 0)) {
            const dialogRef = this.dialog.open(DialogStepperComponent, {
                data: {
                        title: 'Додати новий екземпляр книжки',
                        mode: 'addInstance',
                        libraries: this.onlineLibrarianData.libraries,
                        books: this.onlineLibrarianData.books
                    }
            });

            dialogRef.afterClosed().subscribe((result) => {
                if ((result) && (result.mode === 'addInstance')) {
                    let newId = this.findMaxId(this.onlineLibrarianData.instances);
                    this.onlineLibrarianData.instances.push({
                        id: (newId + 1).toString(),
                        id_library: result.instanceLibrary,
                        id_book: result.instanceBook,
                        returning_status: result.instanceReturningStatus,
                        returning_time: result.instanceReturningTime
                    });
                    let instancesData = this.onlineLibrarianData.instances;
                    this.dataSourceInstances = new MatTableDataSource(instancesData);
                    this.dataSourceInstances.paginator = this.instancePaginator;
                    localStorage.setItem('onlineLibrarian',
                                         JSON.stringify(this.onlineLibrarianData));
                }
            });
        } else if (this.onlineLibrarianData.libraries.length === 0) {
            this.authenticationService.sendMessage('libraries not exist');
        } else if (this.onlineLibrarianData.books.length === 0) {
            this.authenticationService.sendMessage('books not exist');
        }
    }

    public findMaxId(dataArray) {
        let maxId = 0;
        for (let arrayItem of dataArray) {
            if (parseInt(arrayItem['id'], 10) > maxId) {
                maxId = parseInt(arrayItem['id'], 10);
            }
        }
        return maxId;
    }

    public findPozById(dataArray, id) {
        let arrayPoz = -1;
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i]['id'] === id) {
                arrayPoz = i;
            }
        }
        return arrayPoz;
    }

    public findBookNameById(id) {
        let books = this.onlineLibrarianData.books;
        let arrayPoz = this.findPozById(books, id);
        return books[arrayPoz]['name'];
    }

    public findBookCoverById(id) {
        let books = this.onlineLibrarianData.books;
        let arrayPoz = this.findPozById(books, id);
        return books[arrayPoz]['cover'];
    }

    public findLibraryNameById(id) {
        let libraries = this.onlineLibrarianData.libraries;
        let arrayPoz = this.findPozById(libraries, id);
        return libraries[arrayPoz]['name'];
    }

    /*************************************************************************** */
    /**************** Функція експорту файлу ** */
    /************************************************************************** */
    public exportFile() {
        let FileSaver = require('file-saver');
        let blob = new Blob([JSON.stringify(this.onlineLibrarianData)],
                            {type: 'application/json;charset=utf-8'});
        FileSaver.saveAs(blob, 'onlineLibrarian.json');
    }

    public readFile(file) {
        let reader = new FileReader();
        reader.onload = (evt) => {
            this.onlineLibrarianData = JSON.parse(evt.target['result']);
            this.dataSource = new MatTableDataSource(this.onlineLibrarianData.libraries);
            this.dataSourceBooks = new MatTableDataSource(this.onlineLibrarianData.books);
            this.dataSourceInstances = new MatTableDataSource(this.onlineLibrarianData.instances);
            localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
        };
        reader.readAsText(file);
    }

    /*************************************************************************** */
    /**************** Функція імпорту файлу ** */
    /************************************************************************** */
    public importFile() {
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        $(fileInput).click();
        $(fileInput).change((e) => {
            this.readFile(e.target.files[0]);
        });

    }

    public ngOnInit() {
        /*************************************************************************** */
        /**************** Читання данних з Local Storage ** */
        /************************************************************************** */
        if (localStorage.getItem('onlineLibrarian')
            && (localStorage.getItem('onlineLibrarian') !== '')
            && (localStorage.getItem('onlineLibrarian') !== undefined)) {
            console.log('data exist in localStorage');
            this.onlineLibrarianData = JSON.parse(localStorage.getItem('onlineLibrarian'));
        } else {
            console.log('no data in localStorage');
            this.onlineLibrarianData = this.defaultDataService.librarian;
            localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
        }

        let flagStatusChange = false;
        for (let instance of this.onlineLibrarianData.instances) {
            let returningTime = new Date(instance['returning_time']).getTime();
            let currentTime = new Date().getTime();
            if ((currentTime > returningTime)
                && (instance['returning_status'] === false)) {
                instance['returning_status'] = true;
                flagStatusChange = true;
            }
        }
        if (flagStatusChange) {
            localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
        }

        this.dataSource = new MatTableDataSource(this.onlineLibrarianData.libraries);
        this.dataSourceBooks = new MatTableDataSource(this.onlineLibrarianData.books);
        this.dataSourceInstances = new MatTableDataSource(this.onlineLibrarianData.instances);

        this.dataSource.paginator = this.libraryPaginator;

        this.dataSourceBooks.paginator = this.bookPaginator;

        this.dataSourceInstances.paginator = this.instancePaginator;
    }
}

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'qrcode-generator';
import { AuthenticationService } from '../services/authentication.service';
import { DefaultDataService } from '../services/default-data.service';
import { MouseEvent } from '@agm/core';

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
    selector:   'user-mode',
    templateUrl: 'user-mode.component.html',
    styleUrls: ['user-mode.component.scss'],
    providers: []
})
export class UserModeComponent implements OnInit, OnDestroy {
    @ViewChild('newMessage') public newMessage: any;
    @ViewChild('libScrollBar') public libScrollBar: any;
    @ViewChild('qrcodeElement') public qrcodeElement: any;
    public loginFlag: boolean = false;
    public lat: number = 50.44742371378133;
    public lng: number = 30.526552094714248;
    public markersLibraries: Marker[] = [];
    public markers: Marker[] = [];
    public markerMe: Marker[] = [];
    public heightValue;
    public stepType: string = 'root';
    public currentMessage: string = '';
    public onlineLibrarianData = {
        libraries: [],
        books: [],
        instances: []
    };
    public searchResult = [];
    public searchResultLibraries = [];
    public searchResultInstances = [];

    constructor(private authenticationService: AuthenticationService,
                private defaultDataService: DefaultDataService,
                private router: Router) {
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
    /**************** Функція додавання маркеру на мапу ************************ */
    /************************************************************************** */
    public mapClicked($event: MouseEvent) {
        this.markers = [];
        this.markerMe = [];
        this.markerMe.push({
            label: 'Я',
            lat: $event.coords.lat,
            lng: $event.coords.lng,
            draggable: false
        });
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;

        this.markers.push(...this.markerMe);
        this.markers.push(...this.markersLibraries);

        if ((this.stepType === 'choosingLibrary') && (this.currentMessage === 'знайти найближчу')) {
            this.chatBot(this.currentMessage);
        }
    }

    /*************************************************************************** */
    /**************** Функція простого редагування сповіщення ************************ */
    /************************************************************************** */
    public prepareMessage(message: string) {
        let newMessage = message.toLowerCase().replace(/[\s{2,}]+/g, ' ');
        return newMessage;
    }

    /*************************************************************************** */
    /**************** Головна функція для відображення повідомлення в чаті******** */
    /************************************************************************** */
    public messageFactory(type: string, message: string, mode: string = 'simple') {
        if (message !== '') {
            let messageDate = new Date();
            let messageDateText = messageDate.getDate()
            + '/' + (messageDate.getMonth() + 1)
            + '/' + messageDate.getFullYear()
            + ' ' + messageDate.getHours()
            + ':' + ('0' + messageDate.getMinutes()).slice(-2);
            $('#wait_answer').show();
            this.newMessage.nativeElement.value = '';
            let messageBlock = document.createElement('div');
            $('#chat').append($(messageBlock));
            $(messageBlock).css({
                'margin-top': '20px',
                'margin-bottom': '20px'
            });

            let messageAvElBlock = document.createElement('div');
            $(messageBlock).append($(messageAvElBlock));

            let messageAvatar = document.createElement('div');
            $(messageAvElBlock).append($(messageAvatar));
            $(messageAvatar).css({
                'width': '80px',
                'height': '80px',
                'border-radius': '50%',
                'margin-left': '10px',
                'margin-right': '10px',
            });

            let messageSenEl = document.createElement('div');
            $(messageAvElBlock).append($(messageSenEl));
            $(messageSenEl).css({
                overflow: 'hidden'
            });

            let messageSenderBlock = document.createElement('div');
            $(messageSenEl).append($(messageSenderBlock));
            $(messageSenderBlock).css({
                'margin-left': '50px',
                'margin-right': '50px',
                'color': 'gray',
                'font-size': '12px',
                'margin-bottom': '5px'
            });

            let messageElement = document.createElement('div');
            $(messageSenEl).append($(messageElement));
            $(messageElement).css({
                'margin-left': '20px',
                'margin-right': '20px',
                'padding': '20px',
                'min-width': '100px',
                'display': 'inline-block',
                'background-color': '#3f51b5',
                'color': 'white',
                'border-radius': '40px',
            });

            if (mode === 'simple') {
                $(messageElement).text(message);
            } else if (mode === 'searchResult') {
                let resultBook = this.searchResult[parseInt(message, 10)];
                $(messageElement).text('ID: ' + resultBook['id']);

                let messageBookContent = document.createElement('div');
                $(messageElement).append($(messageBookContent));
                $(messageBookContent).css({
                    'margin-top': '10px'
                });

                let messageBookCover = document.createElement('div');
                $(messageBookContent).append($(messageBookCover));
                $(messageBookCover).css({
                    float: 'left'
                });

                let messageBookCoverImg = document.createElement('img');
                $(messageBookCover).append($(messageBookCoverImg));
                messageBookCoverImg.src = resultBook['cover'];
                $(messageBookCoverImg).css({
                    'width': '100px',
                    'max-height': '300px'
                });

                let messageBookInfo = document.createElement('div');
                $(messageBookContent).append($(messageBookInfo));
                $(messageBookInfo).css({
                    'float': 'left',
                    'margin-left': '15px'
                });

                let messageBookLock = document.createElement('div');
                $(messageBookContent).append($(messageBookLock));
                $(messageBookLock).css({
                    clear: 'both'
                });

                let messageBookInfoName = document.createElement('div');
                $(messageBookInfo).append($(messageBookInfoName));
                $(messageBookInfoName).text(resultBook['name']);
                $(messageBookInfoName).css({
                    'margin-bottom': '10px'
                });

                let messageBookInfoAuthor = document.createElement('div');
                $(messageBookInfo).append($(messageBookInfoAuthor));
                $(messageBookInfoAuthor).text('Автор: ' + resultBook['author']);
                $(messageBookInfoAuthor).css({
                    'margin-bottom': '10px'
                });

                let messageBookInfoYear = document.createElement('div');
                $(messageBookInfo).append($(messageBookInfoYear));
                $(messageBookInfoYear).text('Рік: ' + resultBook['year']);
                $(messageBookInfoYear).css({
                    'margin-bottom': '10px'
                });

                let messageBookInfoISBN = document.createElement('div');
                $(messageBookInfo).append($(messageBookInfoISBN));
                $(messageBookInfoISBN).text('ISBN: ' + resultBook['isbn']);
                $(messageBookInfoISBN).css({
                    'margin-bottom': '10px'
                });
            } else if (mode === 'searchResultLibrary') {
                let resultLibrary = this.searchResultLibraries[parseInt(message, 10)];
                $(messageElement).text('ID: ' + resultLibrary['id']);

                let messageLibraryName = document.createElement('div');
                $(messageElement).append($(messageLibraryName));
                $(messageLibraryName).text(resultLibrary['name']);

                let messageLibraryAddress = document.createElement('div');
                $(messageElement).append($(messageLibraryAddress));
                $(messageLibraryAddress).text(resultLibrary['address']);
            } else if (mode === 'searchResultLibraryReturning') {
                let resultLibrary = this.searchResultLibraries[parseInt(message, 10)];
                $(messageElement).text('ID: ' + resultLibrary['id']);

                let messageLibraryName = document.createElement('div');
                $(messageElement).append($(messageLibraryName));
                $(messageLibraryName).text(resultLibrary['name']);

                let messageLibraryAddress = document.createElement('div');
                $(messageElement).append($(messageLibraryAddress));
                $(messageLibraryAddress).text(resultLibrary['address']);

                for (let instance of this.searchResultInstances) {
                    if (resultLibrary['id'] === instance['id_library']) {
                        let messageLibraryReturning = document.createElement('div');
                        $(messageElement).append($(messageLibraryReturning));
                        $(messageLibraryReturning).text('ID екземпляру: ' + instance['id']
                                                        + ' ( Дата повернення: '
                                                        + instance['returning_time'] + ' )');
                    }
                }
            } else if (mode === 'reserving') {
                let resultLibrary = this.searchResultLibraries[0];
                let resultInstance = this.searchResultInstances[0];

                let currentDateRaw = new Date();
                let currentDate = (currentDateRaw.getMonth() + 1)
                                    + '/' + currentDateRaw.getDate()
                                    + '/' + currentDateRaw.getFullYear()
                                    + ' ' + currentDateRaw.getHours()
                                    + ':' + ('0' + currentDateRaw.getMinutes()).slice(-2);
                let qrData = 'ID instance: ' + this.searchResultInstances[0]['id'] + ' --> '
                            + 'Date: ' + currentDate;
                let qr = qrcode(4, 'L');
                qr.addData(qrData);
                qr.make();
                let qrImage = qr.createImgTag(8);
                $(messageElement).html(qrImage);
                let newReservingTimeRaw = new Date(currentDateRaw.getTime() + 5 * 60 * 1000);
                let newReservingTime = (newReservingTimeRaw.getMonth() + 1)
                                        + '/' + newReservingTimeRaw.getDate()
                                        + '/' + newReservingTimeRaw.getFullYear()
                                        + ' ' + newReservingTimeRaw.getHours()
                                        + ':' + ('0' + newReservingTimeRaw.getMinutes()).slice(-2);
                for (let instance of  this.onlineLibrarianData.instances) {
                    if (instance['id'] === resultInstance['id']) {
                        instance['returning_status'] = false;
                        instance['returning_time'] = newReservingTime;
                    }
                }

                let downloadBtn = document.createElement('div');
                $(messageElement).append($(downloadBtn));
                $(downloadBtn).css({
                    'cursor': 'pointer',
                    'background-color': 'white',
                    'color': '#3f51b5',
                    'border-radius': '10px',
                    'padding': '10px',
                    'margin-top': '10px',
                    'width': '100px',
                    'text-align': 'center'
                });
                $(downloadBtn).hover(() => {
                    $(downloadBtn).css('background-color', 'lightgray');
                }, () => {
                    $(downloadBtn).css('background-color', 'white');
                });
                $(downloadBtn).text('Скачати');
                $(downloadBtn).click(() => {
                    let fileSaver = require('file-saver');

                    let baseImage = new Image();
                    baseImage.src = $(qrImage).attr('src');
                    let tempCanvas = document.createElement('canvas');
                    tempCanvas.width = baseImage.width;
                    tempCanvas.height = baseImage.height;
                    let tempContext = tempCanvas.getContext('2d');
                    tempContext.drawImage(baseImage, 0, 0);
                    tempCanvas.toBlob((blob) => {
                        fileSaver.saveAs(blob, 'qrCodeFromLibrarian.png');
                    });
                });

                localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
                this.messageFactory('librarian',
                                    'Бронювання виконано. Скачай і роздрукуй QR-код вище '
                                    + 'або сфотографуй, та покажи його в обраній '
                                    + 'тобою бібліотеці');
            }

            let messageLock = document.createElement('div');
            $(messageAvElBlock).append($(messageLock));
            $(messageLock).css({
                clear: 'both'
            });

            /*************************************************************************** */
            /****************для повідомленння від бібліотекаря (боту) ************************ */
            /************************************************************************** */
            if (type === 'librarian') {
                $(messageSenderBlock).text('Бібліотекар, ' + messageDateText);
                $(messageBlock).css({
                    'text-align': 'left'
                });
                $(messageElement).css({
                    'background-color': '#3f51b5',
                    'color': 'white',
                    'float': 'left'
                });
                $(messageAvatar).css({
                    'float': 'left',
                    'background-image': 'url(../../assets/img/librarian.png)',
                    'background-repeat': 'no-repeat',
                    'background-size': '80px 80px'
                });

            /*************************************************************************** */
            /**************** для повідомлення від користувача  ************************ */
            /************************************************************************** */
            } else if (type === 'user') {
                $(messageSenderBlock).text('Я, ' + messageDateText);
                $(messageBlock).css({
                    'text-align': 'right',
                });
                $(messageElement).css({
                    'background-color': 'white',
                    'color': '#3f51b5',
                    'float': 'right'
                });
                $(messageAvatar).css({
                    'float': 'right',
                    'background-image': 'url(../../assets/img/user.png)',
                    'background-repeat': 'no-repeat',
                    'background-size': '80px 80px'
                });

                // this.previousMessage = this.prepareMessage(message);
                this.chatBot(this.prepareMessage(message));
            }
            this.libScrollBar.directiveRef.scrollToBottom();
            $('#wait_answer').hide();
        }
    }

    /*************************************************************************** */
    /**************** Функція пошуку книжки ************************ */
    /************************************************************************** */
    public searchBook(text: string, type: string) {
        this.markers = [];
        this.markers.push(...this.markerMe);
        let newText = this.prepareMessage(text);
        let booksArray = [];
        let books = this.onlineLibrarianData.books;
        for (let book of books) {
            if (this.prepareMessage(book[type]).includes(newText)) {
                booksArray.push(book);
            }
        }
        return booksArray;
    }

    /*************************************************************************** */
    /**************** Функція пошуку бібліотеки ************************ */
    /************************************************************************** */
    public searchLibrary(bookID, mode = 'simple') {
        this.markers = [];
        this.markersLibraries = [];
        let instances = this.onlineLibrarianData.instances;
        let currentTime = new Date().getTime();
        this.searchResultInstances = [];
        this.searchResultLibraries = [];
        for (let i = 0; i < instances.length; i++) {
            let returningTime = new Date(instances[i]['returning_time']).getTime();
            if ((instances[i]['id_book'] === bookID)
                   && ((currentTime > returningTime) || (mode === 'full'))) {
                if (instances[i]['returning_status'] === false) {
                    this.onlineLibrarianData.instances[i]['returning_status'] = true;
                }
                this.searchResultInstances.push(instances[i]);
            }
        }

        for (let resultInstance of this.searchResultInstances) {
            let newLibraryFlag = true;
            for (let library of this.searchResultLibraries) {
                if (resultInstance['id_library'] === library['id']) {
                    newLibraryFlag = false;
                }
            }
            let libraries = this.onlineLibrarianData.libraries;
            if (newLibraryFlag) {
                for (let library of libraries) {
                    if (resultInstance['id_library'] === library['id']) {
                        this.searchResultLibraries.push(library);
                        this.markersLibraries.push({
                            label: library['id'],
                            lat: parseFloat(library['coord'].split(',')[0]),
                            lng: parseFloat(library['coord'].split(',')[1]),
                            draggable: false
                        });
                    }
                }
            }
        }
        this.markers.push(...this.markerMe);
        this.markers.push(...this.markersLibraries);
        localStorage.setItem('onlineLibrarian', JSON.stringify(this.onlineLibrarianData));
    }

    /*************************************************************************** */
    /**************** Функція відобреження підказок для чату************************ */
    /************************************************************************** */
    public tipsFactory(tips: string[]) {
        $('#tip_block').html('');
        for (let tip of tips) {
            let tipElement = document.createElement('div');
            $('#tip_block').append($(tipElement));
            $(tipElement).text(tip);
            $(tipElement).css({
                'display': 'inline-block',
                'margin': '10px',
                'background-color': '#3f51b5',
                'color': 'white',
                'padding': '10px',
                'border-radius': '10px'
            });
        }

    }

    /*************************************************************************** */
    /**************** Функція пошуку найближчої бібліотеки ************************ */
    /************************************************************************** */
    public searchClosestLibrary() {
        function degreesToRadians(degrees) {
            return degrees * Math.PI / 180;
        }

        function distanceInKm(lat1, lon1, lat2, lon2) {
            let earthRadiusKm = 6371;

            let dLat = degreesToRadians(lat2 - lat1);
            let dLon = degreesToRadians(lon2 - lon1);

            lat1 = degreesToRadians(lat1);
            lat2 = degreesToRadians(lat2);

            let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return earthRadiusKm * c;
        }

        let shortestDistance = -1;
        let theClosestLibrary = [];
        for (let library of this.searchResultLibraries) {
            let libLat = library.coord.split(',')[0];
            let libLng = library.coord.split(',')[1];
            let dist = distanceInKm(this.markerMe[0].lat, this.markerMe[0].lng, libLat, libLng);
            if (shortestDistance < 0 || shortestDistance > dist) {
                shortestDistance = dist;
                theClosestLibrary = library;
            }
        }

        return theClosestLibrary;
    }

    /*************************************************************************** */
    /**************** Головна функція спілкування (логіки) Бібліотекаря (боту) ***/
    /************************************************************************** */
    public chatBot(message) {
        this.currentMessage = message;
        if (message === 'спочатку') {
            this.stepType = 'begin';
            this.chatBot('');
        } else if (this.stepType === 'searchBook' && ((message === 'вітаю')
            || (message === 'доброго дня'))) {
            this.messageFactory('librarian',
                                'Нарешті хоч один відвідувач привітався. Дякую! :-)');
            this.stepType = 'begin';
            this.chatBot('');
        } else if (this.stepType === 'searchBook' && ((message === 'вітаю')
            || (message === 'доброго дня'))) {
            this.messageFactory('librarian',
                                'Нарешті хоч один відвідувач привітався. Дякую! :-)');
            this.stepType = 'begin';
            this.chatBot('');
        } else if (this.stepType === 'searchBook' && (message === 'шукати за автором')) {
            this.messageFactory('librarian', 'Готовий шукати книжку за автором');
            this.stepType = 'searchBookByAuthor';
        } else if (this.stepType === 'searchBook' && (message === 'шукати за isbn')) {
            this.messageFactory('librarian', 'Готовий шукати книжку за ISBN');
            this.stepType = 'searchBookByISBN';
        } else if (this.stepType === 'root') {
            this.messageFactory('librarian', 'Вітаю! я до Ваших послуг');
            this.stepType = 'begin';
            this.chatBot(message);
        } else if (this.stepType === 'begin') {
            this.messageFactory('librarian', 'Введіть, будь-ласка, назву книжки');
            this.tipsFactory([
                'Доброго дня',
                'Вітаю',
                'Шукати за автором',
                'Шукати за ISBN'
            ]);
            this.stepType = 'searchBook';
        } else if (this.stepType === 'searchBook') {
            this.tipsFactory([
                'Спочатку'
            ]);

            this.searchResult = this.searchBook(message, 'name');
            this.stepType = 'searchBookComplete';
            this.chatBot('');
        } else if (this.stepType === 'searchBookByAuthor') {
            this.tipsFactory([
                'Спочатку'
            ]);

            this.searchResult = this.searchBook(message, 'author');
            this.stepType = 'searchBookComplete';
            this.chatBot('');
        } else if (this.stepType === 'searchBookByISBN') {
            this.tipsFactory([
                'Спочатку'
            ]);

            this.searchResult = this.searchBook(message, 'isbn');
            this.stepType = 'searchBookComplete';
            this.chatBot('');
        } else if (this.stepType === 'searchBookComplete') {
            if (this.searchResult.length > 0) {
                this.messageFactory('librarian', 'Знайдено книг: ' + this.searchResult.length);
                let tipsArray = ['Спочатку'];
                for (let i = 0; i < this.searchResult.length; i++) {
                    this.messageFactory('librarian', i.toString(), 'searchResult');
                    tipsArray.push(this.searchResult[i]['id']);
                }

                // якщо знайдено декілька книжок
                if (this.searchResult.length > 1) {
                    this.stepType = 'choosingBook';
                    this.messageFactory('librarian', 'Обери ID книжки з перелічених');
                    this.tipsFactory(tipsArray);

                // якщо знайдена одна книжка
                } else if (this.searchResult.length === 1) {
                    this.stepType = 'choosingBookComplete';
                    this.chatBot('');
                }
            } else {
                this.messageFactory('librarian', 'Нічого не знайдено');
            }
        } else if (this.stepType === 'choosingBook') {
            let tempBook = [];
            for (let book of this.searchResult) {
                if (book['id'] === message) {
                    tempBook = book;
                }
            }
            if (tempBook['id'] !== undefined) {
                this.searchResult = [];
                this.searchResult.push(tempBook);

                this.stepType = 'choosingBookComplete';
                this.chatBot('');
            }

        } else if (this.stepType === 'choosingBookComplete') {
            this.searchLibrary(this.searchResult[0]['id']);

            if (this.searchResultLibraries.length > 0) {
                this.messageFactory('librarian', 'Кількість бібліотек, '
                                    + 'в яких Ви можете забронювати книжку: '
                                    + this.searchResultLibraries.length);
                let tipsArray = ['Спочатку', 'Знайти найближчу'];
                for (let i = 0; i < this.searchResultLibraries.length; i++) {
                    this.messageFactory('librarian', i.toString(), 'searchResultLibrary');
                    tipsArray.push(this.searchResultLibraries[i]['id']);
                }

                // якщо декілька бібліотек
                if (this.searchResultLibraries.length > 1) {
                    this.stepType = 'choosingLibrary';
                    this.messageFactory('librarian',
                                        'Обери ID бібліотеки або можу '
                                        + 'знайти найближчу до тебе бібліотеку');
                    this.tipsFactory(tipsArray);
                } else if (this.searchResultLibraries.length === 1) {
                    this.stepType = 'reserveBook';
                    this.messageFactory('librarian', 'Забронювати книжку в цій бібліотеці?');
                    this.tipsFactory([
                        'Спочатку',
                        'Так'
                    ]);
                }
            } else {
                this.stepType = 'reservedLibraryList';
                this.messageFactory('librarian',
                                    'На жаль, всі книжки заброньовані або на руках. '
                                    + 'Ось перелік бібліотек та час, '
                                    + 'коли дані книжки будуть повернуті');
                this.chatBot('');
            }
        } else if (this.stepType === 'reservedLibraryList') {
            this.searchLibrary(this.searchResult[0]['id'], 'full');

            if (this.searchResultLibraries.length > 0) {
                this.messageFactory('librarian', 'Кількість бібліотек: '
                                    + this.searchResultLibraries.length);
                let tipsArray = ['Спочатку'];
                for (let i = 0; i < this.searchResultLibraries.length; i++) {
                    this.messageFactory('librarian', i.toString(),
                                        'searchResultLibraryReturning');
                    tipsArray.push(this.searchResultLibraries[i]['id']);
                }
            }

        } else if (this.stepType === 'choosingLibrary') {
            if (message === 'знайти найближчу') {
                if (this.markerMe.length < 1) {
                    this.messageFactory('librarian',
                                        'Покажи, будь-ласка, своє місцезнаходження '
                                        + 'на карті (клікни, щоб поставити маркер)');
                } else {
                    this.messageFactory('librarian', 'Шукаю найближчу до тебе');
                    let theClosestLibrary = this.searchClosestLibrary();
                    this.searchResultLibraries = [theClosestLibrary];
                    this.messageFactory('librarian', '0', 'searchResultLibrary');
                    this.stepType = 'reserveBook';
                    this.messageFactory('librarian', 'Забронювати книжку в цій бібліотеці?');
                    this.tipsFactory([
                        'Спочатку',
                        'Так'
                    ]);
                }
            } else {
                let tempLibrary = [];
                for (let library of this.searchResultLibraries) {
                    if (library['id'] === message) {
                        tempLibrary = library;
                    }
                }
                if (tempLibrary['id'] !== undefined) {
                    this.searchResultLibraries = [];
                    this.searchResultLibraries.push(tempLibrary);

                    this.messageFactory('librarian', '0', 'searchResultLibrary');
                    this.stepType = 'reserveBook';
                    this.messageFactory('librarian', 'Забронювати книжку в цій бібліотеці?');
                    this.tipsFactory([
                        'Спочатку',
                        'Так',
                        // 'Ні'
                    ]);
                }
            }
        } else if (this.stepType === 'reserveBook') {
            this.tipsFactory([
                'Спочатку'
            ]);
            if (message === 'так') {
                let tempInstance = [];
                for (let instance of this.searchResultInstances) {
                    if (this.searchResultLibraries[0]['id'] === instance['id_library']) {
                        tempInstance = instance;
                    }
                }
                this.searchResultInstances = [];
                this.searchResultInstances.push(tempInstance);

                this.messageFactory('librarian', '0', 'reserving');
            } else {
                this.tipsFactory([
                    'Спочатку',
                    'Так'
                ]);
            }
        }
    }

    public ngOnInit() {
        // беремо дані LocaStorage
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

        this.heightValue = window.innerHeight - 42;
        $('#wait_answer').hide();
        $('.librarian').css({
            'width': window.innerWidth - 1,
            'overflow': 'hidden',
            'background-color': '#c0c6ec'
        });
        $('.lib-sidebar').css({
            width: 400 + 'px',
            height: this.heightValue + 'px'
        });
        $('.lib-chat').css({
            width: (window.innerWidth - $('.lib-sidebar').width() - 2) + 'px',
            height: this.heightValue + 'px'
        });
        $('.lib-chat-field').css({
            height: $('.lib-chat').height() - $('.lib-chat-input-block').height() - 25
        });
        $('.lib-chat-input-block').css({
            'border-radius': '40px',
            'height': '70px',
            'background-color': '#fff',
            'margin-left': '15px',
            'margin-right': '15px',
            'padding-left': '20px',
            'padding-right': '20px',
            'padding-top': '10px'
        });
        $('.lib-chat-input').css({
            width: $('.lib-chat-input-block').width() - 100
        });
        $('.tip-scroll-bar').css({
            'height': $('.lib-sidebar').height() - 390,
            'min-height': '200px'
        });

        this.chatBot('');

        // для адаптивності
        $(window).on('resize', () => {
            this.heightValue = window.innerHeight - 42;
            $('.librarian').css({
                width: window.innerWidth - 1,
                overflow: 'hidden'
            });
            $('.lib-sidebar').css({
                width: 400 + 'px',
                height: this.heightValue + 'px'
            });
            $('.lib-chat').css({
                width: (window.innerWidth - $('.lib-sidebar').width() - 2) + 'px',
                height: this.heightValue + 'px'
            });
            $('.lib-chat-field').css({
                height: $('.lib-chat').height() - $('.lib-chat-input-block').height() - 25
            });
            $('.lib-chat-input').css({
                width: $('.lib-chat-input-block').width() - 100
            });
            $('.tip-scroll-bar').css({
                height: $('.lib-sidebar').height() - 390
            });

        });

        // можливість відправляти повідомлення після натискання Enter
        $('#new_message').on('keyup', (e: any) => {
            if (e.keyCode === 13) {
                this.messageFactory('user', this.newMessage.nativeElement.value);
            }
        });
    }

    public ngOnDestroy() {
        $('#new_message').off('keyup');
    }
}

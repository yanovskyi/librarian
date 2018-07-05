import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, ResponseType } from '@angular/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DefaultDataService {
    public librarian = {
        libraries: [
            {
                id: '1',
                name: 'Бібліотека імені Вернадського',
                address: 'м. Київ, Голосіївський пр., 3',
                coord: '50.404350641261516,30.519020140230396'
            },
            {
                id: '2',
                name: 'Бібліотека імені Лесі Українки',
                address: 'вул. Тургенівська, 83-85',
                coord: '50.45603619137038,30.48891538107307'
            },
            {
                id: '3',
                name: 'Бібліотека Французького інституту',
                address: 'вул. Гончара, 84',
                coord: '50.44835401540503,30.496970858262102'
            },
            {
                id: '4',
                name: 'Бібліотека Гете-інституту',
                address: 'вул. Волошська, 12/4',
                coord: '50.466186489941116,30.52147457677188'
            }
        ],
        books: [
            {
                id: '1',
                name: 'JavaScript для чайников',
                author: 'Крис Минник, Ева Холланд',
                year: '2016',
                isbn: '978-5-8459-2036-2, 978-1-119-05607-2',
                cover: 'https://ozon-st.cdn.ngenix.net/multimedia/1014477493.jpg'
            },
            {
                id: '2',
                name: 'PHP. Объекты, шаблоны и методики программирования',
                author: 'Мэт Зандстра',
                year: '2011',
                isbn: '978-5-8459-1689-1, 978-1-43-022925-4',
                cover: 'https://ozon-st.cdn.ngenix.net/multimedia/1002134878.jpg'
            },
            {
                id: '3',
                name: 'Python и машинное обучение',
                author: 'Себастьян Рашка',
                year: '2017',
                isbn: '978-5-97060-409-0, 978-1-78355-513-0',
                cover: 'https://ozon-st.cdn.ngenix.net/multimedia/1018056523.jpg'
            },
            {
                id: '4',
                name: 'Программирование на Java для чайников',
                author: 'Барри Берд',
                year: '2013',
                isbn: '978-5-8459-1834-5, 978-0-470-37174-9',
                cover: 'https://ozon-st.cdn.ngenix.net/multimedia/1005986117.jpg'
            },
            {
                id: '5',
                name: 'Приемы объектно-ориентированного проектирования. Паттерны проектирования',
                author: 'Эрих Гамма, Ричард Хелм, Ральф Джонсон, Джон Влиссидес',
                year: '2016',
                isbn: '978-5-459-01720-5, 978-5-496-00389-6',
                cover: 'https://ozon-st.cdn.ngenix.net/multimedia/1000281214.jpg'
            },
            {
                id: '6',
                name: 'Стив Джобс',
                author: 'Уолтер Айзексон',
                year: '2015',
                isbn: '978-5-271-39378-5, 978-5-17-077871-3',
                cover: 'https://ozon-st.cdn.ngenix.net/multimedia/1003652274.jpg'
            },
            {
                id: '7',
                name: 'Cracking the Coding Interview',
                author: 'Макдауэлл Г. Лакман',
                year: '2011',
                isbn: '978-0-98478-280-2',
                cover: 'https://ozon-st.cdn.ngenix.net/multimedia/1014461193.jpg'
            }
        ],
        instances: [
            {
                id: '1',
                id_library: '1',
                id_book: '1',
                returning_status: false,
                returning_time: '6/2/2018 12:57'
            },
            {
                id: '2',
                id_library: '2',
                id_book: '2',
                returning_status: true,
                returning_time: '6/2/2018 12:59'
            },
            {
                id: '3',
                id_library: '3',
                id_book: '3',
                returning_status: true,
                returning_time: '6/2/2018 12:59'
            },
            {
                id: '4',
                id_library: '4',
                id_book: '4',
                returning_status: false,
                returning_time: '6/2/2018 13:00'
            },
            {
                id: '5',
                id_library: '1',
                id_book: '5',
                returning_status: true,
                returning_time: '6/2/2018 13:00'
            },
            {
                id: '6',
                id_library: '2',
                id_book: '6',
                returning_status: true,
                returning_time: '6/2/2018 13:00'
            },
            {
                id: '7',
                id_library: '3',
                id_book: '7',
                returning_status: true,
                returning_time: '6/2/2018 13:01'
            },
            {
                id: '8',
                id_library: '4',
                id_book: '1',
                returning_status: true,
                returning_time: '6/2/2018 13:02'
            },
            {
                id: '9',
                id_library: '1',
                id_book: '2',
                returning_status: true,
                returning_time: '6/2/2018 13:02'
            },
            {
                id: '10',
                id_library: '2',
                id_book: '3',
                returning_status: false,
                returning_time: '6/2/2018 13:02'
            },
            {
                id: '11',
                id_library: '3',
                id_book: '4',
                returning_status: true,
                returning_time: '6/2/2018 13:03'
            },
            {
                id: '12',
                id_library: '4',
                id_book: '5',
                returning_status: true,
                returning_time: '6/2/2018 13:03'
            }
        ]
    };
}

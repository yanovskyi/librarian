import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { DefaultDataService } from './services/default-data.service';
import { MatDialog,
        MatDialogRef,
        MatSnackBar,
        MatButtonModule,
        MatIcon } from '@angular/material';
import { Subscription, Subject } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import 'jquery';
import 'jquery-ui-dist/jquery-ui';
import * as $ from 'jquery';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss',
    './../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
  ],
  templateUrl: 'app.component.html',
  providers: [AuthenticationService, DefaultDataService]
})
export class AppComponent {

  public loginFlag: boolean = false;
  public loginPageFlag: boolean = false;
  public subscription: Subscription;
  public userName: string;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              public snackBar: MatSnackBar) {
    this.loginFlag = this.authenticationService.check();
    if (this.loginFlag) {
      this.userName = window.localStorage.getItem('library_user');
    }

    /*************************************************************************** */
    /**************** реагування на події з інших сторінок та сервісів  ********* */
    /************************************************************************** */
    this.subscription = this.authenticationService.getMessage().subscribe((message) => {
        if (message.text === 'true') {
          this.loginFlag = true;
          this.loginPageFlag = false;
          this.userName = window.localStorage.getItem('library_user');
        } else if (message.text === 'false login page') {
          this.loginPageFlag = true;
          this.loginFlag = false;
        } else if (message.text === 'login password error') {
          this.snackBar.open('Невірний логін чи пароль!', '', {
              duration: 2000,
          });
        } else if (message.text === 'libraries not exist') {
          this.snackBar.open('Немає бібліотек!', '', {
              duration: 2000,
          });
        } else if (message.text === 'books not exist') {
          this.snackBar.open('Немає книжок!', '', {
              duration: 2000,
          });
        } else {
          this.loginFlag = false;
          this.loginPageFlag = false;
        }

    });
  }

  /*************************************************************************** */
  /****** Функція Виходу з під авторизації та перехід на сторінку авторизації****** */
  /************************************************************************** */
  public logout() {
    window.localStorage.removeItem('library_user');
    window.localStorage.removeItem('library_key');
    this.router.navigate(['/login']);
  }

  /*************************************************************************** */
    /**************** Функція переходу на сторінку авторизації ***************** */
    /************************************************************************** */
  public login() {
    this.router.navigate(['/login']);
  }

}

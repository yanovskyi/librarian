import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material';
import { Md5 } from 'ts-md5/dist/md5';
import * as $ from 'jquery';

@Component({
    selector: 'login-page',
    styleUrls: ['login-page.component.scss'],
    templateUrl: 'login-page.component.html',
    providers: []
})
export class LoginPageComponent implements OnInit, OnDestroy {
    @ViewChild('userLogin') public userLogin: any;
    @ViewChild('userPass') public userPass: any;

    public constructor(private router: Router,
                       private authenticationService: AuthenticationService,
                       public snackBar: MatSnackBar) {
        if (this.authenticationService.check()) {
            this.authenticationService.sendMessage('true');
            this.router.navigate(['/']);
        } else {
            this.authenticationService.sendMessage('false login page');
            console.log('is logged out');
        }
    }

    /*************************************************************************** */
    /**************** Функція авторизації ************************ */
    /************************************************************************** */
    public loginFunc() {
        let loginStatus = this.authenticationService.login(this.userLogin.nativeElement.value,
                                                           this.userPass.nativeElement.value);
        if (loginStatus) {
            this.router.navigate(['/']);
        } else {
            this.authenticationService.sendMessage('login password error');
        }
    }

    public ngOnInit() {

        this.userLogin.nativeElement.value = '';
        this.userPass.nativeElement.value = '';

        $(document).on('keyup', (e: any) => {
            if (e.keyCode === 13) {
                this.loginFunc();
            }
        });
    }

    public ngOnDestroy() {
        this.userLogin.nativeElement.value = '';
        this.userPass.nativeElement.value = '';
        $(document).off('keyup');
    }
}

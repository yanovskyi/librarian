import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule, ApplicationRef } from '@angular/core';
import { MatDialog,
         MatDialogRef,
         MatSnackBar,
         MatSnackBarModule,
         MatMenuModule,
         MatButtonModule,
         MatSidenavModule,
         MatSelectModule,
         MatInputModule,
         MatIconModule,
         MatSlideToggleModule,
         MatDividerModule,
         MatTabsModule,
         MatTableModule,
         MatPaginatorModule,
         MatSortModule,
         MatDialogModule,
         MatStepperModule,
         MatDatepickerModule,
         MatProgressBarModule } from '@angular/material';
import { AppComponent } from './app.component';
import { UserModeComponent } from './user-mode/user-mode.component';
import { AdminModeComponent } from './admin-mode/admin-mode.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { DialogRemoveComponent } from './dialog-remove/dialog-remove.component';
import { DialogStepperComponent } from './dialog-stepper/dialog-stepper.component';
import { AgmCoreModule } from '@agm/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import 'hammerjs';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    UserModeComponent,
    AdminModeComponent,
    LoginPageComponent,
    DialogRemoveComponent,
    DialogStepperComponent
  ],
  entryComponents: [
    DialogRemoveComponent,
    DialogStepperComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSidenavModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatDatepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PerfectScrollbarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBY3Ia6Cf_vV0NgMs29JujRIhAOq3DZNgQ'
    }),
    RouterModule.forRoot([
      { path: 'login', component: LoginPageComponent },
      { path: 'admin', component: AdminModeComponent },
      { path: 'user', component: UserModeComponent },
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: '**', redirectTo: 'user'}
  ])
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

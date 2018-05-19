import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CrimeFormPage } from '../pages/crime-form/crime-form';
import { LocateCrimePage } from '../pages/locate-crime/locate-crime';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomeProvider } from '../pages/home/home.provider';
import { LocationProvider } from '../providers/location.provider';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';
import { GmapsProvider } from '../providers/gmaps.provider';
import { CrimeFormProvider } from '../pages/crime-form/crime-form.provider';
import { UtilsProvider } from '../providers/utils.provider';

import { AndroidPermissions } from '@ionic-native/android-permissions';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CrimeFormPage,
    LocateCrimePage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CrimeFormPage,
    LocateCrimePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    HomeProvider,
    GmapsProvider,
    CrimeFormProvider,
    AndroidPermissions,
    LocationProvider,
    UtilsProvider
  ]
})
export class AppModule {}

import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CrimeFormPage } from '../pages/crime-form/crime-form';
import { configConstants } from '../constants/config.constants';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    /*Define las páginas que serán accesibles desde el menú lateral*/
    this.pages = [
      { title: configConstants.pages.home, component: HomePage },
      { title: configConstants.pages.report, component: CrimeFormPage }
    ];

  }

  /*Inicialización nativa de Ionic una vez la plataforma está lista*/
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /* Muestra la página seleccionada en el menú lateral*/
  openPage(page) {
    this.nav.setRoot(page.component);
  }
}

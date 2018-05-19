
import { Injectable } from '@angular/core';
import { LoadingController, Loading, AlertOptions, AlertController} from 'ionic-angular';
import { SlicedAlertOptions } from '../interfaces/sliced-alert-options.interface';
import * as _ from 'lodash';

/* Provider con utilidades y funciones reutilizables */
@Injectable()
export class UtilsProvider {
  constructor(
    private loadingCtrl : LoadingController,
    private alertCtrl : AlertController
  ) {}

  /* Clona un nuevo objeto JavaScript a partir del suministrado como parámetro
     utilizando JSON stringify para evitar copiar la referencia original */
  cloneObj(obj : object) : object {
    return JSON.parse(JSON.stringify(obj));
  }

  /* Funcionalidad que permite crear un Loader de Ionic de forma mas simple */
  createLoader(msg) : Loading {
    return this.loadingCtrl.create({
      content: msg
    });
  }

  /* Funcionalidad que permite crear una alerta de Ionic de forma mas simple */
  createAlert(opts : AlertOptions) : Promise<any> {
    return this.alertCtrl.create(opts).present();
  }

  /* Funcionalidad que permite crear objetos parámetro para alertas de Ionic de forma mas simple */
  createAlertOpts(opts : SlicedAlertOptions, handler : () => void) : AlertOptions {
    let crimeAlertOpts = this.cloneObj(opts);
    (<any>(_.head((<AlertOptions>crimeAlertOpts).buttons))).handler = handler;
    return crimeAlertOpts;
  }
}
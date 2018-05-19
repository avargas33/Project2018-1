import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { configConstants } from '../../constants/config.constants';
import 'rxjs/add/operator/toPromise';

/* Provider que maneja las conexiones al API de la pantalla principal */
@Injectable()
export class HomeProvider {

  constructor(
    private http: Http
  ) {}

  /* Obtiene la información de crímenes en la base de datos a través del servicio web */
  getCrimeData() : Promise<any> {
    return this.http.get(configConstants.webAPI.urls.crimes.get)
      .toPromise().then(resp => JSON.parse((<any>resp)._body))
      .catch(err => {
        console.error(err);
        return Promise.reject(err);
      });
  }
}
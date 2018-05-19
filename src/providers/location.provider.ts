

import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { Injectable } from '@angular/core';

/* Provider para interactuar con la clase Geolocation de ionic */
@Injectable()
export class LocationProvider {
  /* Caché local de localización del dispositivo */
  private lastLocation : Coordinates;

  constructor(
    private geolocation: Geolocation
  ) {}

  /* Obtiene la localización del dispositivo */
  getLocation() {
    return this.geolocation.getCurrentPosition()
    .then(geo => {
        /* Guarda en la caché antes de retornar la localización */
        this.lastLocation = geo.coords;
        return this.lastLocation;
    }).catch(error => {
      console.error(error);
      return Promise.reject(error);
    });
  }

  /* Obtiene la localización de caché */
  getLastLocation() {
    return this.lastLocation;
  }
}
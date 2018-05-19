import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { configConstants } from '../../constants/config.constants';
import 'rxjs/add/operator/toPromise';
import { CrimeType } from '../../interfaces/crime-type.interface';

/* Provider que maneja la informacion y servicios web del formulario de crimenes */
@Injectable()
export class CrimeFormProvider {

  /* Caché local con los resultados retornados por el servicio de tipos de crimenes */
  localCrimeTypes : any;

  /* Datos de localización y tipo de crimen seleccionados por el usuario en el formulario */
  private location : any;
  private crimeType : any;

  constructor(
    private http: Http
  ) {}

  /* Retorna la ubicación seleccionada */
  getLocation() {
    return this.location;
  }

  /* Asigna una nueva localización */
  setLocation(location) {
    this.location = location;
  }

  /* Retorna el tipo de crimen seleccionado */
  getCrimeType() {
    return this.crimeType;
  }

  /* Asigna un nuevo tipo de crimen */
  setCrimeType(crimeType) {
    this.crimeType = crimeType;
  }

  /* Reinicia los datos del formulario */
  resetFormData() {
    this.location = null;
    this.crimeType = null;
  }

  /* Envía los datos de localización y tipo de crimen al servicio web de reporte de crímenes */
  reportCrime() : Promise<any> {
    return this.http.post(configConstants.webAPI.urls.crimes.add, {
      type: this.crimeType.id,
      location: JSON.stringify({
        lat: this.location.lat(),
        lng: this.location.lng()
      })
    }).toPromise();
  }

  /* Obtiene los tipos de crímenes de la base de datos a través del servicio web */
  getCrimeTypes() : Promise<Array<CrimeType>> {
    return this.localCrimeTypes ? Promise.resolve(this.localCrimeTypes) :
    this.http.get(configConstants.webAPI.urls.crimeTypes.get).toPromise()
    .then(resp => {
      /* JSON parse a los datos de gradientes guardados como string en la base de datos */
      this.localCrimeTypes = JSON.parse((<any>resp)._body).map(type => {
        let gradient = JSON.parse(type.gradient);
        /* Si el gradiente no tiene el formato correcto se asigna null
        para que el mapa use el gradiente por defecto */
        type.gradient = Array.isArray(gradient) && gradient.length > 0 ? gradient : null;
        return type;
      });
      return this.localCrimeTypes;
    });
  }

  /* Retorna la url relativa del icono a mostrar en el mapa dependiendo del tipo de crimen */
  getCrimeTypeIcon(type : CrimeType) : string  {
    return configConstants.mapIconsURL + type.value + '.png';
  }
}
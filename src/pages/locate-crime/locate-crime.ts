import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Loading, AlertOptions } from 'ionic-angular';
import { configConstants } from '../../constants/config.constants';
import { guiConstants } from '../../constants/gui.constants';
import { GmapsProvider } from '../../providers/gmaps.provider';
import { CrimeFormPage } from '../crime-form/crime-form';
import { LocationProvider } from '../../providers/location.provider';
import { CrimeFormProvider } from '../crime-form/crime-form.provider';
import { UtilsProvider } from '../../providers/utils.provider';

/* Pantalla donde el usuario selecciona o modifica la ubicación de un crimen */
@Component({
  selector: 'page-locate-crime',
  templateUrl: 'locate-crime.html',
})
export class LocateCrimePage {
  /* referencia al mapa de google maps */
  @ViewChild(configConstants.map.htmlElementId) mapElement: ElementRef; 
  map: any;
  /* Marcador de Google Maps ubicado en la localización seleccionada por el usuario */
  locationMarker : any;
  /* Localización seleccionada por el usuario */
  location : any;
  /* Objeto que guarda las constantes de interfaz gráfica */
  tags : any;
  /* Icono del tipo de crimen seleccionado */
  icon : any;
  /* Loader que bloquea la pantalla mientras se carga el mapa */
  loadingMap : Loading;
  /* Datos para alerta que se muestra cuando la localizacion no puede ser recuperada correctamente */
  locationAlertOpts : AlertOptions;
  /* Localización del dispositivo del usuario final */
  userPosition : any;
  /* Constructor de la vista. Inicializa los datos necesarios para funcionar */
  constructor(
    public navCtrl: NavController,
    private gmapsProvider : GmapsProvider,
    private locationProvider : LocationProvider,
    private crimeFormProvider : CrimeFormProvider,
    private utils : UtilsProvider) {
      /* Inicializa los datos de icono y localización */
      this.tags = guiConstants.locateCrime;
      this.location = this.crimeFormProvider.getLocation();
      this.icon = this.crimeFormProvider.getCrimeTypeIcon(this.crimeFormProvider.getCrimeType());
      this.locationAlertOpts = this.utils.createAlertOpts(guiConstants.alert.error.location, () => {
        this.navCtrl.setRoot(CrimeFormPage);
      });
    }

  /* Evento de ciclo de vida de Ionic que se dispara cuando se entra a la vista */
  ionViewDidEnter() {
    this.loadingMap = this.utils.createLoader(guiConstants.loading.msg.location);
    this.loadingMap.present();
    /* Intenta obtener la ubicación del dispositivo para cargar el mapa */
    this.locationProvider.getLocation().then(this.loadMap.bind(this))
    .catch(e => {
      /* Si falla la ubicación intenta obtener la última guardada en caché.
         Si aun asi no puede obtenerla, muestra una alerta de error*/
      let lastLocation = this.locationProvider.getLastLocation();
      lastLocation ? this.loadMap(lastLocation) : this.utils.createAlert(this.locationAlertOpts);
    });
  }
/* Crea una instancia de mapa de Google Maps con un marcador en la posición del usuario.*/
  private loadMap(devicePosition) {
    /* Si ya hay una localización seleccionada se utiliza como centro del mapa,
       de lo contrario se utiliza la ubicación del dispositivo */
    let center = this.location ?
      { latitude: this.location.lat(), longitude: this.location.lng()} : devicePosition;
    this.map = this.gmapsProvider.createMap(
      this.mapElement.nativeElement, center, configConstants.map.locateZoom, configConstants.map.mapTypeId
    );
    this.gmapsProvider.bindEvent(this.map, 'click', this.locationSelected.bind(this));
    this.userPosition=this.gmapsProvider.addUserPositionMarker(this.map,
      this.gmapsProvider.createLatLngObj(devicePosition.latitude, devicePosition.longitude));
    /* si hay una localización seleccionada se agrega un marcador al mapa con el icono correspondiente */
    if (this.location) {
      this.locationMarker = this.gmapsProvider.addMarker(this.map, this.location, this.icon);
    }
    this.loadingMap.dismiss();
  }

  /* Evento que se dispara cuando el usuario selecciona una localización en el mapa.
     Agrega un marcador de Google Maps en la nueva localización */
  private locationSelected(event) {
    if (this.locationMarker) {
      this.locationMarker.setMap(null);
    }
    this.locationMarker = this.gmapsProvider.addMarker(this.map, event.latLng, this.icon);
  }

  /* Evento que se dispara cuando el usuario oprime el botón de confirmar ubicación.
     Guarda la localización y redirige al formulario de crímenes. */
  locationConfirmed() {
    this.crimeFormProvider.setLocation(this.locationMarker.position);
    this.navCtrl.setRoot(CrimeFormPage);
  }
  /* Evento que se dispara cuando el usuario oprime el botón flotante sobre el mapa.
  Redirige la localización del mapa a la posición del dispositivo */
centerLocation() {
 this.map.setCenter(this.userPosition.getPosition());
  }
}
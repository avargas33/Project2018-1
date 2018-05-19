import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, Loading, AlertOptions } from 'ionic-angular';
import { guiConstants } from '../../constants/gui.constants';
import { configConstants } from '../../constants/config.constants';
import { GmapsProvider } from '../../providers/gmaps.provider';
import { HomeProvider } from './home.provider';
import { UtilsProvider } from '../../providers/utils.provider';
import { LocationProvider } from '../../providers/location.provider';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Coordinates } from '@ionic-native/geolocation';
import { CrimeFormProvider } from '../crime-form/crime-form.provider';
import { MapType } from '../../interfaces/map-type.interface';
import { Crime } from '../../interfaces/crime.interface';
import { CrimeType } from '../../interfaces/crime-type.interface';
import { CrimeFormPage } from '../crime-form/crime-form';
import * as _ from 'lodash';

/* Pantalla principal de la aplicación, donde el usuario observa la información de crímenes
   a su alrededor y puede escoger entre distintos tipos de mapas y crímenes. */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /* referencia al mapa de google maps */
  @ViewChild(configConstants.map.htmlElementId) mapElement: ElementRef;
  map: any;
  /* Objeto que guarda las constantes de interfaz gráfica */
  tags : any;
  /* Título de la página visible al usuario */
  title : string;
  /* Datos para alertas que se muestran cuando la localizacion o los datos de crimenes
     no pueden ser recuperados correctamente */
  crimeAlertOpts : AlertOptions;
  locationAlertOpts : AlertOptions;
  /* Loader que bloquea la pantalla mientras se carga la ubicación del dispositivo */
  loadingLocation : Loading;
  /* Loader que bloquea la pantalla mientras se obtienen los datos de crimenes de la base de datos */
  loadingCrimeData : Loading;
   /* Loader que bloquea la pantalla mientras se carga el mapa de calor */
  loadingHeatMap : Loading;
   /* Loader que bloquea la pantalla mientras se carga el mapa informativo */
  loadingInfoMap : Loading;
   /* Loader que bloquea la pantalla mientras se aplican los filtros de crímenes */
  loadingFilterChanges : Loading;

   /* Almacena la respuesta del servicio de crímenes */
  crimes : Array<Crime>;
   /* Almacena la respuesta del servicio de tipos de crímenes */
  crimeTypes : Array<CrimeType>;
   /* Almacena los tipos de mapas disponibles, informativo y de calor */
  mapTypes : Array<MapType> = [];
   /* Referencia el tipo de mapa seleccionado en un momento dado */
  currentMap : MapType;
  /* Localización del dispositivo del usuario final */
  userPosition : any;

  /* Constructor de la vista. Inicializa los datos necesarios para funcionar */
  constructor(
    public navCtrl: NavController,
    private homeProvider : HomeProvider,
    private gmapsProvider : GmapsProvider,
    public platform: Platform,
    public androidPermissions : AndroidPermissions,
    private locationProvider : LocationProvider,
    private utils : UtilsProvider,
    private crimeFormProvider : CrimeFormProvider) {
      this.tags = guiConstants.home;
      this.title = this.tags.title.heat;
      /* Inicializa los datos de los mapas informativo y de calor */
      this.mapTypes.push(this.createMapType(
        configConstants.mapTypes.heat.name, guiConstants.mapTypes.heat.label,
        true, this.createHeatMap.bind(this), this.destroyHeatMap.bind(this),
        this.onChangeHeatMap.bind(this)
      ));
      this.mapTypes.push(this.createMapType(
        configConstants.mapTypes.info.name, guiConstants.mapTypes.info.label,
        false, this.createInfoMap.bind(this), this.destroyInfoMap.bind(this),
        this.onChangeInfoMap.bind(this)
      ));
      /* Selecciona el primer elemento del arreglo de mapas como mapa seleccionado */
      this.currentMap = _.head(this.mapTypes);
      /* Inicializa loaders y opciones de alertas */
      this.loadingLocation = this.utils.createLoader(guiConstants.loading.msg.location);
      this.loadingCrimeData = this.utils.createLoader(guiConstants.loading.msg.crimes);
      this.locationAlertOpts = this.utils.createAlertOpts(guiConstants.alert.error.location, () => {
        this.loadingLocation = this.utils.createLoader(guiConstants.loading.msg.location);
        this.checkLocation();
      });
      this.crimeAlertOpts = this.utils.createAlertOpts(guiConstants.alert.error.crime, () => {
        this.loadingCrimeData = this.utils.createLoader(guiConstants.loading.msg.crimes);
        this.getCrimeData();
      });
  }

  /* Evento que se dispara cuando el usuario oprime el botón de reportar crimen.
     Envía al usuario a la vista de formulario de reporte de crimen */
  reportCrime() {
    this.navCtrl.setRoot(CrimeFormPage);
  }

  /* Evento que se dispara cuando el usuario oprime el icono de cambiar mapa.
     Abre un diálogo para que el usuario seleccione el mapa que desea ver */
  toggleMapType() {
    this.utils.createAlert({
      title: guiConstants.alert.mapTypes.title,
      inputs: this.mapTypes.map(type => {
        return {
          value: type.name,
          name: type.name,
          label: type.label,
          checked: type.checked,
          type: 'radio'
        };
      }),
      buttons: [{
        text: guiConstants.alert.mapTypes.button.text,
        handler: this.onChangeMapType.bind(this)
      }],
      enableBackdropDismiss: false
    });
  }

  /* Evento que se dispara cuando el usuario oprime el icono de cambiar filtros.
     Abre un diálogo para que el usuario seleccione los crimenes que desea ver en el mapa */
  toggleCrimeFilter() {
    this.utils.createAlert({
      title: guiConstants.alert.crimeFilter.title,
      inputs: this.crimeTypes.map(type => {
        return {
          name: type.name,
          label: type.name,
          value: type.value,
          disabled: type.data.length === 0,
          checked: type.checked,
          type: 'checkbox'
        }
      }),
      buttons: [{
          text: guiConstants.alert.crimeFilter.button.text,
          handler: this.onChangeCrimeFilter.bind(this)
      }],
      enableBackdropDismiss: false
    });
  }

  /* Evento de ciclo de vida de Ionic que se dispara cuando se entra a la vista */
  ionViewDidEnter() {
    /* Verifica que la plataforma de Ionic se encuentra lista */
    this.platform.ready().then(() => {
      /* Si la plataforma actual es un teléfono móvil verifica permisos de acceder a localización */
      this.platform.is('mobile') ?
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      .then(result => this.checkLocation(),
        /* Si el dispositivo no tiene permisos de localización, los solicita al usuario*/
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
        .then(this.checkLocation.bind(this))
        .catch(this.logErrorAndStop.bind(this))
      ) : this.checkLocation();
    });
  }

  /* Evento que se dispara cuando el usuario oprime el botón flotante sobre el mapa.
     Redirige la localización del mapa a la posición del dispositivo */
  centerLocation() {
    this.map.setCenter(this.userPosition.getPosition());
  }

  /* Evento que se dispara cuando el usuario oprime el icono de recargar datos.
     Actualiza los datos de crímenes a través del servicio web */
  updateCrimes() {
    this.loadingCrimeData = this.utils.createLoader(guiConstants.loading.msg.crimes);
    this.loadingCrimeData.present();
    /* Destruye el mapa actual que será reconstruido una vez recibidos los datos de crimenes */
    this.currentMap.destroy();
    this.getCrimeData();
  }

  /* Intenta recuperar la localización del dispositivo.
     Si esta se recupera correctamente carga el mapa, de lo contrario muestra una alerta de error */
  private checkLocation() {
    this.loadingLocation.present();
    this.locationProvider.getLocation()
    .then(this.loadMap.bind(this))
    .catch(err => this.stopLoaderAndShowError(this.loadingLocation, err, this.locationAlertOpts));
  }

  /* Crea una instancia de mapa de Google Maps con un marcador en la posición del usuario.
     Inicia además el proceso de obtener los datos de crímenes del servicio web */
  private loadMap(coords : Coordinates) {
    this.map = this.gmapsProvider.createMap(
      this.mapElement.nativeElement, coords,
      configConstants.map.zoom, configConstants.map.mapTypeId
    );
    this.userPosition = this.gmapsProvider.addUserPositionMarker(this.map,
        this.gmapsProvider.createLatLngObj(coords.latitude, coords.longitude));
    this.loadingLocation.dismiss();
    this.getCrimeData();
  }

  /* Obtiene los datos de crímenes a través del servicio web.
     Si este proceso falla muestra una alerta de error*/
  private getCrimeData() {
    this.loadingCrimeData.present();
    this.homeProvider.getCrimeData()
    .then(this.getCrimeDataSuccess.bind(this))
    .catch(err => this.stopLoaderAndShowError(this.loadingCrimeData, err, this.crimeAlertOpts));
  }

  /* Obtiene los datos de tipos de crímenes a través del servicio web.
     Si este proceso falla muestra una alerta de error*/
  private getCrimeDataSuccess(crimes : Array<Crime>) {
    this.crimes = crimes;
    this.crimeFormProvider.getCrimeTypes()
    .then(types => {
      /* Agrega a los tipos de crímenes la información adicional necesaria*/
      this.crimeTypes = types.map(type => {
        /* asigna a la variable data la informacion de crímenes de un tipo especifico*/
        let data = crimes.filter(crime => crime.type === type.id).map(
        crime => { let location = JSON.parse(crime.location);
          return this.gmapsProvider.createLatLngObj(location.lat, location.lng);
        });
        return _.extend(type, {
          /* Agrega al objeto los crimenes de su tipo */
          data: data,
          /* Agrega al objeto un marcador de Google Maps para cada crimen */
          markers: data.map(position =>
            this.gmapsProvider.addMarker(null, position, this.crimeFormProvider.getCrimeTypeIcon(type))),
          /* Agrega al objeto una propiedad que le muestra en el mapa si hay al menos un crimen de ese tipo */
          checked: data.length > 0
        });
      });
      this.loadingCrimeData.dismiss();
      this.currentMap.create();
    })
    .catch(err => this.stopLoaderAndShowError(this.loadingCrimeData, err, this.crimeAlertOpts));
  }

  /* Metodo de creación para el mapa de calor */
  private createHeatMap() {
    /* cambia el titulo de la pagina */
    this.title = this.tags.title.heat;
    this.loadingHeatMap = this.utils.createLoader(guiConstants.loading.msg.heatMap);
    this.loadingHeatMap.present();
    /* Para cada tipo de crimen que se encuentre seleccionado en los filtros,
       muestra en el mapa (o crea si no existe) la capa de mapa de calor de Google Maps
       de la propiedad heatmap */
    this.crimeTypes.filter(type => type.checked).forEach(type => {
      if (type.heatmap) {
        type.heatmap.setMap(this.map);
      } else {
        type.heatmap = this.gmapsProvider.createHeatMap(this.map, type.data, type.gradient);
      }
    });
    this.loadingHeatMap.dismiss();
  }

  /* Metodo de destrucción para el mapa de calor */
  private destroyHeatMap() {
    /* Para cada tipo de crimen oculta la capa de mapa de calor asignando null como mapa */
    this.crimeTypes.filter(type => type.heatmap).forEach(type => {
      type.heatmap.setMap(null);
      type.heatmap = null;
    });
  }

  /* Metodo de mostrar / ocultar crimen para el mapa de calor */
  private onChangeHeatMap(changedType) {
    /* Si el tipo de crimen se encontraba seleccionado, se oculta asignando un mapa null,
       De lo contrario, se muestra asignando la referencia al mapa de la aplicación */
    changedType.checked ? changedType.heatmap.setMap(null) : changedType.heatmap.setMap(this.map);
  }

  /* Metodo de creación para el mapa informativo */
  private createInfoMap() {
    this.title = this.tags.title.info;
    this.loadingInfoMap = this.utils.createLoader(guiConstants.loading.msg.infoMap);
    this.loadingInfoMap.present();
    /* Para cada tipo de crimen que se encuentre seleccionado en los filtros,
       muestra sus crimenes asociados como marcadores en el mapa asignando la referencia al mapa
       de la aplicación y añadiendo ademas una ventana informativa que será desplegada
       al darle click a cada marcador */
    this.crimeTypes.filter(type => type.checked).forEach(type => {
      type.markers.forEach(marker => marker.setMap(this.map));
      type.infoWindows = type.markers.map(marker => this.gmapsProvider.addInfoWindow(this.map, marker, type.name));
    });
    this.loadingInfoMap.dismiss();
  }

  /* Metodo de destrucción para el mapa informativo */
  private destroyInfoMap() {
    /* Para cada tipo de crimen oculta los marcadores de crimenes y sus ventanas informativas asociadas */
    this.crimeTypes.filter(type => type.infoWindows && type.markers).forEach(type => {
      type.infoWindows.forEach(infoWindow => infoWindow.close());
      type.markers.forEach(marker => marker.setMap(null));
    });
  }

  /* Metodo de mostrar / ocultar crimen para el mapa informativo */
  private onChangeInfoMap(changedType) {
    if (changedType.checked) {
      /* Si el tipo de crimen se encontraba seleccionado, cierra las ventanas informativas
         y oculta los marcadores */
      changedType.infoWindows.forEach(infoWindow => infoWindow.close());
      changedType.markers.forEach(marker => marker.setMap(null));
    } else {
      /* Si el tipo de crimen no se encontraba seleccionado, muestra nuevamente los marcadores
         y asigna las ventanas informativas */
      changedType.markers.forEach(marker => marker.setMap(this.map));
      changedType.infoWindows =
        changedType.markers.map(marker => this.gmapsProvider.addInfoWindow(this.map, marker, changedType.name));
    }
  }

  /* Evento que se dispara cuando el usuario realiza cambios en los filtros de crimenes */
  private onChangeCrimeFilter(data) {
    this.loadingFilterChanges = this.utils.createLoader(guiConstants.loading.msg.ongoingChanges);
    this.loadingFilterChanges.present();
    this.crimeTypes.filter(type => {
      let nowSelected = _.some(data, selected => type.value === selected);
      return (type.checked && !nowSelected) || (nowSelected && !type.checked);
    }).forEach(changed => {
      /*Para cada tipo de crimen que haya cambiado su estado, actualizarlo usando
        la función update del mapa seleccionado*/
      this.currentMap.update(changed);
      changed.checked = !changed.checked;
    });
    this.loadingFilterChanges.dismiss();
  }

  /* Evento que se dispara cuando el usuario escoge cambiar el tipo de mapa*/
  private onChangeMapType(data) {
    let newMap = _.find(this.mapTypes, type => type.name === data);
    if (newMap && newMap.name !== this.currentMap.name) {
      /*Si el mapa deseado no se encuentra seleccionado,
      se llama la funcion destroy del mapa actual y la función create del nuevo mapa*/
      this.currentMap.checked = false;
      this.currentMap.destroy();
      this.currentMap = newMap;
      this.currentMap.create();
      this.currentMap.checked = true;
    }
  }

  /* Funcionalidad de error genérica. Imprime el error en consola y despliega la alerta
     suministrada como parámetro */
  private stopLoaderAndShowError(loader : Loading, error : any, crimeAlertOpts : any) {
    loader.dismiss();
    this.utils.createAlert(crimeAlertOpts);
    this.logErrorAndStop(error);
  }

  /* Funcionalidad que permite crear objetos de tipo MapType a partir de sus parametros. */
  private createMapType(name : string, label : string, checked : boolean,
    create : () => void, destroy : () => void, update : (changedType) => void) : MapType {
    return {
      name: name,
      label: label,
      checked: checked,
      create: create,
      destroy: destroy,
      update: update
    };
  }

  /* Funcionalidad que imprime un error en consola */
  private logErrorAndStop(error) {
    console.error(error);
  }
}
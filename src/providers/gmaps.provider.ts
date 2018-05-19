import { Injectable } from '@angular/core';
import { guiConstants } from '../constants/gui.constants';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

/* Provider para interactuar con la API de Google Maps */
declare var google;
@Injectable()
export class GmapsProvider {

  constructor() {}

  /* Retorna un objeto de tipo Map de Google Maps */
  createMap(map, center, zoom, type){
    return new google.maps.Map(map, {
      center: new google.maps.LatLng(
        center.latitude,
        center.longitude
      ),
      zoom: zoom,
      mapTypeId: type,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      styles: [{
        featureType: "poi",
        stylers: [{ visibility: "off" }]
      }]
    });
  }

  /* Retorna un objeto de tipo Marker de Google Maps */
  addMarker(map, position, icon ?: string) {
    let markerData = {
      map: map,
      animation: google.maps.Animation.DROP,
      position: position
    };
    return new google.maps.Marker(icon ? _.extend(markerData, { icon : icon }) : markerData);
  }

  /* Retorna un objeto de tipo InfoWindow de Google Maps */
  addInfoWindow(map, marker, content) {
    let infowindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infowindow.open(map, marker);
    });
    return infowindow;
  }

  /* Retorna un objeto de tipo HeatmapLayer de Google Maps */
  createHeatMap(map, data, gradient) {
    let heatMap = new google.maps.visualization.HeatmapLayer({
      data: data,
      gradient: gradient,
      radius: 20
    });
    heatMap.setMap(map);
    return heatMap;
  }

  /* Retorna un objeto de tipo LatLng de Google Maps */
  createLatLngObj(lat, lng) {
    return new google.maps.LatLng(lat, lng);
  }

  /* Añade un evento a un mapa de Google Maps */
  bindEvent(map, event, callback){
    google.maps.event.addListener(map, event, callback);
  }

  /* Retorna un objeto de tipo Marker de Google Maps con una ventana
     de información con el mensaje de posición del usuario */
  addUserPositionMarker(map, position) {
    let marker = this.addMarker(map, position);
    this.addInfoWindow(map, marker, guiConstants.map.userPosition);
    return marker;
  }
}

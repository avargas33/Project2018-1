declare var google;
/* URL del Backend de la aplicación */
const baseURL : string = 'http://ec2-52-67-82-54.sa-east-1.compute.amazonaws.com:8080/';
/* URL relativa base de carpeta de material audiovisual */
const assetsURL: string = './assets/';

/* Este objeto centraliza las constantes de configuración necesarias
   para el correcto funcionamiento de la aplicación */
export const configConstants : any = {
    /* Nombres de páginas de la aplicación para el menú lateral */
    pages: {
      home: 'Mapa de Crímenes',
      report: 'Reportar Delito'
    },
    /* URLs de consumo de servicios web */
    webAPI: {
      urls: {
        crimes: {
          get: baseURL + 'crimes/all',
          add: baseURL + 'crimes/add'
        },
        crimeTypes: {
          get: baseURL + 'crimetypes/all'
        }
      }
    },
    /* Datos base para creación de mapa google maps */
    map: {
      htmlElementId: 'map',
      defaultCenter: {
        latitude: 7.1297,
        longitude: -73.125769
      },
      zoom: 17,
      locateZoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    /* Tipos de mapas de la pantalla principal */
    mapTypes: {
      heat: {
        name: 'heat'
      },
      info: {
        name: 'info'
      }
    },
    /* URL para acceder a los iconos de la aplicación */
    mapIconsURL: assetsURL + 'img/map-icons/'
  };
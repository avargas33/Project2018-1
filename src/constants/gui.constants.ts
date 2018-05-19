/* Este objeto centraliza todos los mensajes visibles para el usuario durante
   su interacción con la aplicación*/
export const guiConstants : any = {
    /* Mensajes visibles en la pantalla de home */
    home: {
      title: {
        heat: 'Mapa de Calor',
        info: 'Mapa Informativo'
      },
      reportBtnLabel: 'Reportar Crimen'
    },
    /* Mensajes visibles en la pantalla de formulario de crimen */
    crimeForm: {
      title: 'Reportar Delito',
      intro: 'Gracias por ayudarnos a hacer la ciudad más segura. Por favor llena los siguientes ' + 
      'datos para reportar una actividad delictiva.',
      selectCategoryLabel: 'Tipo de delito',
      selectLocationLabel: 'Seleccionar Ubicación',
      modifyLocationLabel: 'Modificar Ubicación',
      reportBtnLabel: 'Reportar'
    },
    /* Mensajes visibles en la pantalla de seleccion de ubicación */
    locateCrime: {
      title: 'Elige la ubicación',
      selectBtnLabel: 'Seleccionar'
    },
    /* Mensajes de carga visibles en la aplicación */
    loading: {
      msg: {
        location: 'Buscando geolocalización del dispositivo...',
        crimes: 'Recuperando información de crímenes en el área...',
        infoMap: 'Cargando Mapa Informativo...',
        heatMap: 'Cargando Mapa de Calor...',
        ongoingChanges: 'Realizando Cambios...',
        report: 'Reportando crimen...'
      }
    },
    /* Datos de alerta visibles en la aplicación */
    alert: {
      error: {
        /* Error al acceder al servicio de crímenes */
        crime: {
          title: 'API Error',
          subTitle: 'No se han podido recuperar los datos de crímenes en este momento. Por favor verifica tu conexión a internet o intenta nuevamente más tarde.',
          buttons: [{
            text: 'Reintentar'
          }],
          enableBackdropDismiss: false
        },
        /* Error al acceder a la localización del dispositivo */
        location: {
          title: 'Location Error',
          subTitle: 'No se ha podido obtener la ubicación del dispositivo. Por favor verifica que el GPS se encuentre encendido e intenta nuevamente.',
          buttons: [{
            text: 'Reintentar'
          }],
          enableBackdropDismiss: false
        },
        /* Error al reportar un delito */
        report: {
          title: 'API Error',
          subTitle: 'Ha ocurrido un error al reportar el delito. Por favor verifica tu conexión a internet o intenta nuevamente más tarde.',
          buttons: [{
            text: 'Reintentar'
          }, {
            text: 'Cancelar'
          }],
          enableBackdropDismiss: false
        }
      },
      success: {
        /* Exito al reportar un crimen */
        report: {
          title: 'Reporte Exitoso',
          subTitle: 'Muchas gracias por tu reporte. El delito ha sido registrado correctamente en la base de datos.',
          buttons: [{
            text: 'Aceptar'
          }],
          enableBackdropDismiss: false
        }
      },
      /* Dialogo de selección de mapa en pantalla principal */
      mapTypes: {
        title: '¿Qué mapa desea mostrar?',
        button: {
          text: 'Aceptar'
        }
      },
      /* Dialogo de filtros de crímenes en pantalla principal */
      crimeFilter: {
        title: '¿Qué delitos desea mostrar?',
        button: {
          text: 'Aceptar'
        }
      }
    },
    /* Título para cada tipo de mapa */
    mapTypes: {
      heat: {
        label: 'Mapa de Calor'
      },
      info: {
        label: 'Mapa Informativo'
      }
    },
    /* Etiquetas en mapa de Google maps */
    map: {
      userPosition: 'Tu Posición'
    }
  };
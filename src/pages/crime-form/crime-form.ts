import { Component } from '@angular/core';
import { NavController, Loading, AlertOptions } from 'ionic-angular';
import { LocateCrimePage } from '../locate-crime/locate-crime';
import { HomePage } from '../home/home';
import { CrimeFormProvider } from './crime-form.provider';
import { UtilsProvider } from '../../providers/utils.provider';
import { guiConstants } from '../../constants/gui.constants';
import { CrimeType } from '../../interfaces/crime-type.interface';
import { CrimeFormData } from '../../interfaces/crime-form-data.interface';
import * as _ from "lodash";

/* En esta página el usuario selecciona los datos del crimen y
   lo reporta para ser guardado en la base de datos*/
@Component({
  selector: 'page-crime-form',
  templateUrl: 'crime-form.html',
})
export class CrimeFormPage {

  /* datos seleccionados por el usuario en el formulario y
     guardados con 2 way binding de Angular */
  form : CrimeFormData = {
    category: '',
    location: {
      lat: 0,
      lng: 0
    }
  };

  /* Objeto que guarda las constantes de interfaz gráfica */
  tags : any;
   /* Tipos de crimenes que apareceran en el selectbox del formulario */
  crimeOptions : Array<CrimeType>;
   /* Loader que bloquea la pantalla mientras se reporta un crimen */
  loadingReport : Loading;
   /* Datos para alertas que se muestran cuando el reporte es exitoso o fallido */
  reportAlertOpts : AlertOptions;
  successAlertOpts : AlertOptions;

  /* Constructor de la vista. Inicializa los datos necesarios para funcionar */
  constructor(public navCtrl: NavController,
  private crimeFormProvider : CrimeFormProvider,
  private utils : UtilsProvider) {
    this.tags = guiConstants.crimeForm;
    this.reportAlertOpts = this.utils.createAlertOpts(guiConstants.alert.error.report, this.reportCrime.bind(this));
    this.successAlertOpts = this.utils.createAlertOpts(guiConstants.alert.success.report, () => {
      this.navCtrl.setRoot(HomePage);
    });
    /* Si el usuario no viene de seleccionar la ubicación, reinicia los datos del formulario*/
    if (navCtrl.last().name !== LocateCrimePage.name) {
      this.crimeFormProvider.resetFormData();
    }
    /* Asigna los tipos de crimenes segun la respuesta del servicio web */
    crimeFormProvider.getCrimeTypes().then(types => {
      this.crimeOptions = types;
      let category = this.crimeFormProvider.getCrimeType();
      this.form.category = category ? category.value : _.head(types).value;
      this.crimeFormProvider.setCrimeType(this.crimeOptions.find(opt => opt.value === this.form.category));
    }).catch(console.error);
    this.form.location = this.crimeFormProvider.getLocation();
  }

  /* Evento que se dispara cuando el usuario selecciona una opción del selectbox.
     Guarda el nuevo tipo de crimen seleccionado en el provider */
  crimeTypeSelectionChanged(selection) {
    this.crimeFormProvider.setCrimeType(selection);
  }

  /* Evento que se dispara cuando el usuario oprime el botón de seleccionar o modificar ubicación.
     Envía al usuario a la vista de seleccionar ubicación */
  selectLocation() {
    this.navCtrl.push(LocateCrimePage);
  }

  /* Evento que se dispara cuando el usuario oprime el botón de reportar crimen. 
     Envía los datos de formulario seleccionados a través del servicio web de reportar crimenes */
  reportCrime() {
    this.loadingReport = this.utils.createLoader(guiConstants.loading.msg.report);
    this.loadingReport.present();
    this.crimeFormProvider.reportCrime()
    .then(() => { this.utils.createAlert(this.successAlertOpts); })
    .catch(err => {
      console.error(err);
      this.utils.createAlert(this.reportAlertOpts);
    }).then(data => this.loadingReport.dismiss());
  }
}
/* Representa la estructura de datos que se recibe del servicio de tipos de crimenes.
   Los valores opcionales, son datos que se generan durante la ejecución
   de los mapas de información y de calor en la pantalla principal */
export interface CrimeType {
    id : number;
    name : string;
    value : string;
    gradient : Array<string>;
    data ?: Array<any>;
    markers ?: Array<any>;
    checked ?: boolean;
    heatmap ?: any;
    infoWindows ?: Array<any>;
};
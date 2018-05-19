/* Representa los tipos de mapa usados en la pantalla principal,
   originalmente mapa de calor y mapa informativo*/
export interface MapType {
    name : string;
    label : string;
    checked : boolean;
    create : () => void;
    destroy : () => void;
    update : (changed) => void;
};
import { LatLng } from './lat-lng.interface';

/* Representa los datos que se guardan en el formulario de reportar crimen.*/
export interface CrimeFormData{
    category: string,
    location: LatLng
};
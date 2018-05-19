/* Estructura de datos utilizada por el provider de utilidades para crear alertas de ionic */
export interface SlicedAlertOptions {
    title: string,
    subTitle: string,
    buttons : Array<ButtonData>,
    enableBackdropDismiss: boolean
}

interface ButtonData {
    text: string
}
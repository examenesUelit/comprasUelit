export interface ProductoInterface {
    idProducto?: string;
    idUsuario?: string;
    nombre?: string;
    categoria?: string;
    imagenUrl?: string;
    cantidad?: number;
    fecha?: number;
    ultimaModificacion?: number;
    precio?: number;
    tienda?: string;
    firebaseId?: string;
    detalle?: {}
}
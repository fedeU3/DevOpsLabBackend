// Para el PATCH: todos los campos son opcionales, solo se modifican los que llegan
export class UpdateServicioDto {
  servicio?: string;
  duracion?: number;
  precio?: number;
  estado?: string;
}

// Para el PATCH: todos los campos son opcionales, solo se modifican los que llegan
export class UpdateTurnoDto {
  idUsuario?: number;
  idServicio?: number;
  fecha?: string;
  estado?: string;
}

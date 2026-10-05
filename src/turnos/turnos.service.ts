import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { And, DataSource, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TurnosEntity } from './turnos.entity';
import { ServiciosEntity } from '../servicios/servicios.entity';
import { ServiciosService } from '../servicios/servicios.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';

// P = Pendiente, A = Atendido, C = Cancelado
const ESTADOS_TURNO = ['P', 'A', 'C'];

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(TurnosEntity)
    private readonly turnosRepository: Repository<TurnosEntity>,
    private readonly serviciosService: ServiciosService,
    private readonly usuariosService: UsuariosService,
    private readonly dataSource: DataSource,
  ) { }

  // Trae todos los turnos, si se pasa idServicio filtra por servicio
  async getAll(idServicio?: number) {
    if (idServicio) {
      const servicio = await this.serviciosService.getById(idServicio);
      if (!servicio) throw new NotFoundException(`El Servicio ${idServicio} no fue encontrado`);
    }
    return this.turnosRepository.find({
      where: idServicio ? { idServicio } : {},
      relations: ['servicio'],
      order: { fecha: 'ASC' },
    });
  }

  // Busca el turno. Lanza NotFoundException si no existe.
  async buscarTurno(id: number): Promise<TurnosEntity> {
    const turno = await this.turnosRepository.findOne({ where: { idTurno: id } });
    if (!turno) throw new NotFoundException(`El Turno ${id} no fue encontrado`);
    return turno;
  }

  // Dado un servicio y un dia (YYYY-MM-DD) devuelve los horarios ya tomados, sin contar los cancelados
  async getHorariosOcupados(idServicio: number, fecha: string) {
    if (!fecha) throw new BadRequestException('Debe indicar la fecha (YYYY-MM-DD)');
    await this.serviciosService.buscarServicio(idServicio);

    return this.turnosRepository
      .createQueryBuilder('t')
      .select('t.idTurno', 'idTurno')
      .addSelect('t.fecha', 'fecha')
      .where('t.idServicio = :idServicio', { idServicio })
      .andWhere('DATE(t.fecha) = :fecha', { fecha })
      .andWhere('t.estado <> :cancelado', { cancelado: 'C' })
      .orderBy('t.fecha', 'ASC')
      .getRawMany();
  }

  // Resumen de turnos entre dos fechas (YYYY-MM-DD), sin contar los cancelados.
  // Devuelve cantidad de turnos e ingresos agrupados por franja horaria: Mañana, Tarde, Noche.
  async getResumen(desde: string, hasta: string) {
    if (!desde || !hasta) throw new BadRequestException('Debe indicar desde y hasta (YYYY-MM-DD)');

    const rows = await this.dataSource.createQueryBuilder()
      .select('s.servicio', 'servicio')
      .addSelect('EXTRACT(HOUR FROM t.fecha)', 'hora')
      .addSelect('COUNT(t.idTurno)', 'cantidad')
      .addSelect('SUM(s.precio)', 'total')
      .from(TurnosEntity, 't')
      .innerJoin(ServiciosEntity, 's', 's.idServicio = t.idServicio')
      .where('DATE(t.fecha) BETWEEN :desde AND :hasta', { desde, hasta })
      .andWhere('t.estado <> :cancelado', { cancelado: 'C' })
      .groupBy('s.servicio')
      .addGroupBy('EXTRACT(HOUR FROM t.fecha)')
      .orderBy('EXTRACT(HOUR FROM t.fecha)', 'ASC')
      .getRawMany();

    // Agrupar en franjas: Mañana (antes de las 12), Tarde (antes de las 19), Noche
    const grouped: Record<string, { cantidad: number; total: number }> = {};
    for (const r of rows) {
      const hora = Number(r.hora);
      let franja: string;
      if (hora < 12) {
        franja = 'Mañana';
      } else if (hora < 19) {
        franja = 'Tarde';
      } else {
        franja = 'Noche';
      }
      if (!grouped[franja]) grouped[franja] = { cantidad: 0, total: 0 };
      grouped[franja].cantidad += Number(r.cantidad);
      grouped[franja].total += Number(r.total);
    }

    //Convierte el objeto agrupado en un array de objetos
    return Object.entries(grouped).map(([franja, { cantidad, total }]) => ({
      franja,
      cantidad,
      total,
    }));
  }

  async createTurno(dto: CreateTurnoDto): Promise<TurnosEntity> {
    const turno = new TurnosEntity();

    turno.idUsuario = dto.idUsuario;
    turno.idServicio = dto.idServicio;
    turno.fecha = new Date(dto.fecha);
    turno.estado = dto.estado ?? 'P';

    await this.validarTurno(turno);
    return this.turnosRepository.save(turno);
  }

  // PUT: reemplaza todos los campos del turno
  async replaceTurno(id: number, dto: CreateTurnoDto): Promise<TurnosEntity> {
    const turno = await this.buscarTurno(id);

    turno.idUsuario = dto.idUsuario;
    turno.idServicio = dto.idServicio;
    turno.fecha = new Date(dto.fecha);
    turno.estado = dto.estado ?? 'P';

    await this.validarTurno(turno);
    return this.turnosRepository.save(turno);
  }

  // PATCH: modifica solo los campos enviados (ej: { "estado": "A" } para marcarlo atendido)
  async updateTurno(id: number, dto: UpdateTurnoDto): Promise<TurnosEntity> {
    const turno = await this.buscarTurno(id);

    if (dto.idUsuario !== undefined) turno.idUsuario = dto.idUsuario;
    if (dto.idServicio !== undefined) turno.idServicio = dto.idServicio;
    if (dto.fecha !== undefined) turno.fecha = new Date(dto.fecha);
    if (dto.estado !== undefined) turno.estado = dto.estado;

    await this.validarTurno(turno);
    return this.turnosRepository.save(turno);
  }

  async deleteTurno(id: number): Promise<void> {
    await this.buscarTurno(id);
    await this.turnosRepository.delete({ idTurno: id });
  }

  // Controla que los datos del turno sean validos y que no se superponga con otro turno del mismo servicio
  private async validarTurno(turno: TurnosEntity): Promise<void> {
    if (isNaN(turno.fecha.getTime())) {
      throw new BadRequestException('La fecha no es valida');
    }
    if (!ESTADOS_TURNO.includes(turno.estado)) {
      throw new BadRequestException(`El estado debe ser uno de: ${ESTADOS_TURNO.join(', ')}`);
    }

    const usuario = await this.usuariosService.getById(turno.idUsuario);
    if (!usuario) throw new NotFoundException(`El Usuario ${turno.idUsuario} no fue encontrado`);

    const servicio = await this.serviciosService.buscarServicio(turno.idServicio);
    if (servicio.estado !== 'A') {
      throw new BadRequestException(`El Servicio ${turno.idServicio} esta dado de baja`);
    }

    // Un turno cancelado no ocupa horario
    if (turno.estado === 'C') return;

    // Todos los turnos de un servicio duran lo mismo, entonces dos turnos se superponen
    // si sus horarios de inicio estan a menos de "duracion" minutos de distancia
    const duracionMs = servicio.duracion * 60 * 1000;
    const desde = new Date(turno.fecha.getTime() - duracionMs);
    const hasta = new Date(turno.fecha.getTime() + duracionMs);

    const superpuesto = await this.turnosRepository.findOne({
      where: {
        idServicio: turno.idServicio,
        estado: Not('C'),
        fecha: And(MoreThan(desde), LessThan(hasta)),
        // Al modificar un turno no hay que compararlo consigo mismo
        ...(turno.idTurno ? { idTurno: Not(turno.idTurno) } : {}),
      },
    });
    if (superpuesto) {
      throw new ConflictException(`El horario se superpone con el Turno ${superpuesto.idTurno}`);
    }
  }
}

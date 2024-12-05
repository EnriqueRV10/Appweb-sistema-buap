import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarMateriaModalComponent } from 'src/app/modals/editar-materia-modal/editar-materia-modal.component';

declare var $: any;

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit {
  public tipo: string = "registro-materias";
  public materia: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idMateria: Number = 0;
  public token: string = "";
  public lista_maestros: any[] = [];

  // Para control de tiempo
  timeConfig: any = {
    format: 12,
    minutesGap: 5,
  };

  // Para los días de la semana
  public diasSemana = [
    { id: 'lunes', nombre: 'Lunes', checked: false },
    { id: 'martes', nombre: 'Martes', checked: false },
    { id: 'miercoles', nombre: 'Miércoles', checked: false },
    { id: 'jueves', nombre: 'Jueves', checked: false },
    { id: 'viernes', nombre: 'Viernes', checked: false },
    { id: 'sabado', nombre: 'Sábado', checked: false }
  ];

  // Para el select de programa educativo
  public programasEducativos = [
    { id: 1, nombre: 'Ingeniería en Ciencias de la Computación' },
    { id: 2, nombre: 'Licenciatura en Ciencias de la Computación' },
    { id: 3, nombre: 'Ingeniería en Tecnologías de la Información' }
  ];

  constructor(
    private materiasService: MateriasService,
    private maestrosService: MaestrosService,
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      this.obtenerMateria();
    } else {
      this.materia = this.materiasService.esquemaMateria();
      this.token = this.facadeService.getSessionToken();
    }
    this.obtenerMaestros();
  }

  private obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
      },
      (error) => {
        alert("No se pudo obtener la lista de maestros");
      }
    );
  }

  private obtenerMateria() {
    this.materiasService.getMateriaByID(this.idMateria).subscribe(
      (response) => {
        this.materia = {
          ...response,
          hora_inicio: response.hora_inicio?.substring(0, 5),
          hora_fin: response.hora_fin?.substring(0, 5),
          profesor_id: response.profesor?.id
        };
  
        if (this.materia.dias_json) {
          this.diasSemana.forEach(dia => {
            dia.checked = this.materia.dias_json.includes(dia.id);
          });
        }
  
        console.log("Materia formateada para edición:", this.materia);
      },
      (error) => {
        alert("No se pudieron obtener los datos de la materia para editar");
      }
    );
  }

  public onTimeChange(timeString: string, tipo: 'inicio' | 'fin') {
    // Asegurarse de que el formato sea HH:mm
    const formattedTime = timeString.substring(0, 5);
    
    if (tipo === 'inicio') {
      this.materia.hora_inicio = formattedTime;
    } else {
      this.materia.hora_fin = formattedTime;
    }
    
    if (this.materia.hora_inicio && this.materia.hora_fin) {
      this.validarHorario();
    }
  }

  public onDiaChange() {
    this.materia.dias_json = this.diasSemana
      .filter(dia => dia.checked)
      .map(dia => dia.id);
  }

  private validarHorario() {
    try {
      const [horaInicio, minInicio] = this.materia.hora_inicio.split(':');
      const [horaFin, minFin] = this.materia.hora_fin.split(':');
      
      const fechaInicio = new Date();
      fechaInicio.setHours(parseInt(horaInicio), parseInt(minInicio), 0);
      
      const fechaFin = new Date();
      fechaFin.setHours(parseInt(horaFin), parseInt(minFin), 0);
      
      // Si la hora de inicio es mayor o igual a la hora de fin
      if (fechaInicio >= fechaFin) {
        this.errors.horario = "La hora de inicio debe ser menor a la hora de fin";
      } else {
        // Solo eliminar el error de horario si la validación pasa
        delete this.errors.horario;
      }
    } catch (error) {
      console.error('Error al validar horario:', error);
      this.errors.horario = "Error en el formato de las horas";
    }
  }

  public registrar() {
    // Actualizar los días seleccionados antes de validar
    this.materia.dias_json = this.diasSemana
      .filter(dia => dia.checked)
      .map(dia => dia.id);
  
    // Crear una copia del objeto errors actual
    const currentErrors = { ...this.errors };
    
    // Obtener nuevos errores del servicio
    const serviceErrors = this.materiasService.validarMateria(this.materia, this.editar);
    
    // Combinar los errores preservando los errores de horario existentes
    this.errors = {
      ...serviceErrors,
      ...(currentErrors.horario ? { horario: currentErrors.horario } : {})
    };
  
    if (Object.keys(this.errors).length > 0) {
      return false;
    }
  
    this.materiasService.registrarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia registrada correctamente");
        this.router.navigate(["home"]);
      },
      (error) => {
        // Manejar específicamente el error de NRC duplicado
        if (error.error && error.error.message) {
          alert(error.error.message); // Mostrará el mensaje específico del backend
        } else {
          alert("Error al registrar materia: " + (error.message || 'Error desconocido'));
        }
      }
    );
    return true;
  }

  public actualizar() {
    this.errors = [];
    
    // Actualizar los días seleccionados
    this.materia.dias_json = this.diasSemana
      .filter(dia => dia.checked)
      .map(dia => dia.id);
  
    // Validar horario antes de enviar
    this.validarHorario();
    
    this.errors = {
      ...this.errors,
      ...this.materiasService.validarMateria(this.materia, this.editar)
    };
  
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }
  
    // Mostrar el modal de confirmación
    const dialogRef = this.dialog.open(EditarMateriaModalComponent, {
      data: { nombre: this.materia.nombre },
      height: '250px',
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isConfirmed) {
        // Crear el objeto con el formato correcto para el backend
        const materiaToUpdate = {
          ...this.materia,
          hora_inicio: this.materia.hora_inicio + ':00',
          hora_fin: this.materia.hora_fin + ':00'
        };
  
        // Proceder con la actualización
        this.materiasService.editarMateria(materiaToUpdate).subscribe(
          (response) => {
            alert("Materia editada correctamente");
            this.router.navigate(["home"]);
          },
          (error) => {
            alert("No se pudo editar la materia");
          }
        );
      }
    });
  
    return true;
  }

  public regresar() {
    this.location.back();
  }

  public soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (!(charCode >= 48 && charCode <= 57)) {
      event.preventDefault();
    }
  }

  public soloAlfanumerico(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (!(
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode === 32
    )) {
      event.preventDefault();
    }
  }
}
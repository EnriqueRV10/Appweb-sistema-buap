import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';
import { FacadeService } from 'src/app/services/facade.service';
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
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      console.log("ID Materia: ", this.idMateria);
      // Al iniciar la vista obtiene la materia por su ID
      this.obtenerMateria();
    } else {
      this.materia = this.materiasService.esquemaMateria();
      this.token = this.facadeService.getSessionToken();
    }

    // Obtener lista de maestros para el select
    this.obtenerMaestros();
  }

  private obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        console.log("Lista maestros: ", this.lista_maestros);
      },
      (error) => {
        alert("No se pudo obtener la lista de maestros");
      }
    );
  }

  private obtenerMateria() {
    this.materiasService.getMateriaByID(this.idMateria).subscribe(
      (response) => {
        this.materia = response;
        // Cargar los días seleccionados en los checkboxes
        if (this.materia.dias_json) {
          this.diasSemana.forEach(dia => {
            dia.checked = this.materia.dias_json.includes(dia.id);
          });
        }
        console.log("Datos materia: ", this.materia);
      },
      (error) => {
        alert("No se pudieron obtener los datos de la materia para editar");
      }
    );
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    // Validar
    this.errors = [];

    // Preparar datos para envío
    this.materia.dias_json = this.diasSemana
      .filter(dia => dia.checked)
      .map(dia => dia.id);

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    this.materiasService.registrarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia registrada correctamente");
        console.log("Materia registrada: ", response);
        this.router.navigate(["home"]);
      },
      (error) => {
        alert("Error al registrar materia");
      }
    );
    return true;
  }

  public actualizar() {
    // Validación
    this.errors = [];

    // Preparar datos para envío
    this.materia.dias_json = this.diasSemana
      .filter(dia => dia.checked)
      .map(dia => dia.id);

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    this.materiasService.editarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia editada correctamente");
        console.log("Materia editada: ", response);
        this.router.navigate(["home"]);
      },
      (error) => {
        alert("No se pudo editar la materia");
      }
    );
    return true;
  }

  public soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (!(charCode >= 48 && charCode <= 57)) { // Solo números del 0 al 9
      event.preventDefault();
    }
  }

  public soloAlfanumerico(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (!(
      (charCode >= 48 && charCode <= 57) || // Números del 0 al 9
      (charCode >= 65 && charCode <= 90) || // Letras mayúsculas
      (charCode >= 97 && charCode <= 122) || // Letras minúsculas
      charCode === 32 // Espacio
    )) {
      event.preventDefault();
    }
  }
}
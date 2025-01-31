import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit{

  public name_user:string = "";
  public rol:string = "";
  public token : string = "";
  public lista_alumnos: any[] = [];

  //Para la tabla
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_alumnos as DatosUsuario[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private alumnosService: AlumnosService,
    private facadeService: FacadeService,
    private router: Router,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    
    // Definir las columnas según el rol
    if (this.rol === 'alumno') {
      this.displayedColumns = ['clave_alumno', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'rfc', 'curp', 'edad', 'ocupacion'];
    } else {
      this.displayedColumns = ['clave_alumno', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'rfc', 'curp', 'edad', 'ocupacion', 'editar', 'eliminar'];
    }

    // Lista de alumnos
    this.obtenerAlumnos();
    this.initPaginator();
  }

  //Para paginación
  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

  public obtenerAlumnos(){
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_alumnos);
        this.dataSource.paginator = this.paginator;  // Actualizar el paginador
        console.log("Lista alumnos: ", this.lista_alumnos);
      }, 
      (error) => {
        alert("No se pudo obtener la lista de alumnos");
      }
    );
  }


  public goEditar(idUser: number){
    this.router.navigate(["registro-usuarios/alumno/"+idUser])
  }

  public delete(idUser: number){
    //console.log("User:", idUser);
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idUser, rol: 'alumno'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Alumno eliminado");
        //Recargar página
        window.location.reload();
      }else{
        alert("Alumno no eliminado ");
        console.log("No se eliminó el Alumno");
      }
    });
  }
}


export interface DatosUsuario {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  clave_alumno: string;  // Cambiado a string ya que viene como string en los datos
  telefono: string;
  rfc: string;
  edad: number;
  ocupacion: string;
  fecha_nacimiento: string;
  curp: string;
  creation: string;
  update: string | null;
}

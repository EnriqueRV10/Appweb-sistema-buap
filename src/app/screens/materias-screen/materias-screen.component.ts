import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {
  
  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];

  // Para la tabla
  displayedColumns: string[] = ['nrc', 'nombre', 'seccion', 'dias', 'horario', 'salon', 'programa_educativo', 'profesor', 'creditos'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private materiasService: MateriasService,
    private facadeService: FacadeService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    
    if (this.token == "") {
      this.router.navigate([""]);
    }

    if (this.rol === 'alumno') {
      this.router.navigate(["home"]);
    }

    if (this.rol === 'administrador') {
      this.displayedColumns.push('editar', 'eliminar');
    }

    this.obtenerMaterias();
    this.initPaginator();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getProgramaEducativo(id: number): string {
    switch(id) {
      case 1: return 'ICC';
      case 2: return 'LCC';
      case 3: return 'ITI';
      default: return '';
    }
  }

  getDiaAbreviado(dia: string): string {
    const mapping = {
      'lunes': 'L',
      'martes': 'M',
      'miercoles': 'X',
      'jueves': 'J',
      'viernes': 'V',
      'sabado': 'S'
    };
    return mapping[dia] || dia;
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  public obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response.map(materia => {
          return {
            ...materia,
            programa_educativo: this.getProgramaEducativo(materia.programa_educativo),
            dias_json: materia.dias_json.map(dia => this.getDiaAbreviado(dia)).join(','),
            hora_inicio: this.formatTime(materia.hora_inicio),
            hora_fin: this.formatTime(materia.hora_fin),
            profesor_nombre: materia.profesor.user.first_name + ' ' + materia.profesor.user.last_name
          };
        });
        
        this.dataSource = new MatTableDataSource(this.lista_materias);
        this.dataSource.paginator = this.paginator;
        console.log("Lista materias: ", this.lista_materias);
      },
      (error) => {
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  public initPaginator() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
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
    }, 500);
  }

  public goEditar(idMateria: number) {
    this.router.navigate(["registro-materias/" + idMateria]);
  }

  public delete(idMateria: number) {
    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: { id: idMateria, rol: 'materia' },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isDelete) {
        this.materiasService.eliminarMateria(idMateria).subscribe(
          () => {
            console.log("Materia eliminada");
            window.location.reload();
          },
          (error) => {
            alert("No se pudo eliminar la materia");
          }
        );
      }
    });
  }
}
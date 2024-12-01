import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-eliminar-materia-modal',
  templateUrl: './eliminar-materia-modal.component.html',
  styleUrls: ['./eliminar-materia-modal.component.scss']
})
export class EliminarMateriaModalComponent {
  constructor(
    private materiasService: MateriasService,
    private dialogRef: MatDialogRef<EliminarMateriaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public cerrar_modal() {
    this.dialogRef.close({ isDelete: false });
  }

  public eliminarMateria() {
    this.materiasService.eliminarMateria(this.data.id).subscribe(
      (response) => {
        console.log(response);
        this.dialogRef.close({ isDelete: true });
      },
      (error) => {
        this.dialogRef.close({ isDelete: false });
      }
    );
  }
}
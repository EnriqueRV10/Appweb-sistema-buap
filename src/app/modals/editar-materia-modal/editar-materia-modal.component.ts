import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-materia-modal',
  templateUrl: './editar-materia-modal.component.html',
  styleUrls: ['./editar-materia-modal.component.scss']
})
export class EditarMateriaModalComponent {
  constructor(
    private dialogRef: MatDialogRef<EditarMateriaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public cerrarModal() {
    this.dialogRef.close({ isConfirmed: false });
  }

  public confirmarEdicion() {
    this.dialogRef.close({ isConfirmed: true });
  }
}
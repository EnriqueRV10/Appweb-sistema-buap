import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

//Este import es para los servicios HTTP
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
//Elementos de angular material
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {NavbarComponent} from './partials/navbar/navbar.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

//Para usar el mask
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

//Importa date picker
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';


import { RegistroAdminComponent } from './partials/registro-admin/registro-admin.component';
import { RegistroAlumnosComponent } from './partials/registro-alumnos/registro-alumnos.component';
import { RegistroMaestrosComponent } from './partials/registro-maestros/registro-maestros.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { AlumnosScreenComponent } from './screens/alumnos-screen/alumnos-screen.component';
import { MaestrosScreenComponent } from './screens/maestros-screen/maestros-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { EliminarUserModalComponent } from './modals/eliminar-user-modal/eliminar-user-modal.component';
import { NgChartsModule } from 'ng2-charts';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { RegistroMateriasScreenComponent } from './screens/registro-materias-screen/registro-materias-screen.component';
import { MateriasScreenComponent } from './screens/materias-screen/materias-screen.component';
import { RouterModule } from '@angular/router';
import { EditarMateriaModalComponent } from './modals/editar-materia-modal/editar-materia-modal.component';
import { EliminarMateriaModalComponent } from './modals/eliminar-materia-modal/eliminar-materia-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    RegistroUsuariosScreenComponent,
    NavbarComponent,
    RegistroAdminComponent,
    RegistroAlumnosComponent,
    RegistroMaestrosComponent,
    HomeScreenComponent,
    AdminScreenComponent,
    AlumnosScreenComponent,
    MaestrosScreenComponent,
    EliminarUserModalComponent,
    GraficasScreenComponent,
    RegistroMateriasScreenComponent,
    MateriasScreenComponent,
    EditarMateriaModalComponent,
    EliminarMateriaModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    MatRadioModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective,
    MatTableModule,
    MatPaginatorModule,
    NgChartsModule,
    MatDialogModule,
    NgxMaterialTimepickerModule,
    MatTooltipModule,
    RouterModule,
  ],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent]
})
export class AppModule { }

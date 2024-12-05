import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService,
  ) { }

  public esquemaMateria() {
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias_json': [],
      'hora_inicio': '',
      'hora_fin': '',
      'salon': '',
      'programa_educativo': '',
      'profesor_id': '',
      'creditos': ''
    }
  }

  //Validación para el formulario
  public validarMateria(data: any, editar: boolean) {
    console.log("Validando materia... ", data);

    let error: any = [];

    if (!this.validatorService.required(data["nrc"])) {
      error["nrc"] = this.errorService.required;
    } else if (!/^\d{5,6}$/.test(data["nrc"])) {
      error["nrc"] = "El NRC debe tener entre 5 y 6 dígitos numéricos";
    }

    if (!this.validatorService.required(data["nombre"])) {
      error["nombre"] = this.errorService.required;
    } else if (!/^[a-zA-Z0-9\s]+$/.test(data["nombre"])) {
      error["nombre"] = "El nombre solo puede contener letras, números y espacios";
    }

    if (!this.validatorService.required(data["seccion"])) {
      error["seccion"] = this.errorService.required;
    } else if (!/^\d{1,3}$/.test(data["seccion"])) {
      error["seccion"] = "La sección debe tener máximo 3 dígitos numéricos";
    }

    if (!data["dias_json"] || data["dias_json"].length === 0) {
      error["dias_json"] = "Debe seleccionar al menos un día";
    }

    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["salon"])) {
      error["salon"] = this.errorService.required;
    } else if (!/^[a-zA-Z0-9\s]+$/.test(data["salon"])) {
      error["salon"] = "El salón solo puede contener letras, números y espacios";
    }

    if (!this.validatorService.required(data["programa_educativo"])) {
      error["programa_educativo"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["profesor_id"])) {
      error["profesor_id"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["creditos"])) {
      error["creditos"] = this.errorService.required;
    } else if (!/^\d{1,2}$/.test(data["creditos"])) {
      error["creditos"] = "Los créditos deben ser un número de 1 o 2 dígitos";
    }

    return error;
  }

  // Servicios HTTP
  public registrarMateria(data: any): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.post<any>(`${environment.url_api}/materia/`, data, { headers: headers });
  }

  public obtenerListaMaterias(): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers: headers });
  }

  public getMateriaByID(idMateria: Number): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/materia/?id=${idMateria}`, { headers: headers });
  }

  public editarMateria(data: any): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.put<any>(`${environment.url_api}/materias-edit/`, data, { headers: headers });
  }

  public eliminarMateria(idMateria: number): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.delete<any>(`${environment.url_api}/materias-edit/?id=${idMateria}`, { headers: headers });
  }
}
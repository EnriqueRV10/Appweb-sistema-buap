import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Location } from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit{
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno:any = {};
  public errors:any={};
  public editar:boolean = false;
  public token:string = "";

  constructor(
    private alumnosService: AlumnosService,
    private router: Router,
    private location: Location,
  ){}

  ngOnInit(): void {
    this.alumno = this.alumnosService.esquemaAlumno();

    this.alumno.rol = this.rol;

    console.log("Datos del alumno: ", this.alumno);
  }

  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    //validar datos
    this.errors = [];    

    this. errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    
    //Validar la contraseña
    if(this.alumno.password == this.alumno.confirmar_password){

      // Transformar la fecha de nacimiento al formato 'YYYY-MM-DD'
      const fechaNacimiento = new Date(this.alumno.fecha_nacimiento);
      this.alumno.fecha_nacimiento = fechaNacimiento.toISOString().split('T')[0]; // Extraer solo la fecha

      console.log("Datos a enviar: ", this.alumno)
      //Entra a registrar
      this.alumnosService.registrarAlumno(this.alumno).subscribe(
        (response) => {
          alert("Usuario registrado correctamente");
          console.log("Usuario registrado: ", response);
          if (this.token != ""){
            this.router.navigate(["home"]);
          }else{
            this.router.navigate(["/"]);
          }
        }, (error)=>{
          alert("Error al registrar usuario");
        }
      );
    }else{
      alert("Las contraseñas no coinciden");
      this.alumno.password="";
      this.alumno.confirmar_password="";
    }
  }

  public actualizar(){
    
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }
}

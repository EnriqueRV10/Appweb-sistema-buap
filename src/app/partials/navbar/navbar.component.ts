import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { filter } from 'rxjs/operators';
declare var $:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  @Input() tipo: string = "";
  @Input() rol:string ="";

  public editar: boolean = false;
  public token : string = "";
  public currentUrl: string = "";

  constructor(
    public router: Router,
    private facadeService: FacadeService,
    public activatedRoute: ActivatedRoute,
  ){
    // Suscribirse a los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
      this.updateActiveLink();
    });
  }

  ngOnInit() {
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
    }

    // Detectar la ruta actual y activar el enlace correspondiente
    setTimeout(() => {
      const currentPath = this.router.url;
      if (currentPath.includes('alumnos')) {
        this.activarLink('alumnos');
      } else if (currentPath.includes('maestros')) {
        this.activarLink('maestros');
      } else if (currentPath.includes('materias-screen')) {
        this.activarLink('materias-screen');
      } else if (currentPath.includes('graficas')) {
        this.activarLink('graficas');
      } else if (currentPath === '/home') {
        this.activarLink('home');
      }
    }, 100);
  }

  private updateActiveLink() {
    // Remover active de todos los enlaces
    $("#principal, #maestro, #alumno, #graficas, #materias").removeClass("active");
    
    // Agregar active según la URL actual
    if (this.currentUrl.includes('alumnos')) {
      $("#alumno").addClass("active");
    } else if (this.currentUrl.includes('maestros')) {
      $("#maestro").addClass("active");
    } else if (this.currentUrl.includes('materias-screen')) {
      $("#materias").addClass("active");
    } else if (this.currentUrl.includes('graficas')) {
      $("#graficas").addClass("active");
    } else if (this.currentUrl === '/home') {
      $("#principal").addClass("active");
    }
  }

  public goRegistro(){
    this.router.navigate(["registro-usuarios"]);
  }

  public goRegistroMateria(){
    this.router.navigate(["registro-materias"]);
  }

  //Cerrar sesión
  public logout(){
    this.facadeService.logout().subscribe(
      (response)=>{
        console.log("Entró");

        this.facadeService.destroyUser();
        //Navega al login
        this.router.navigate(["/"]);
      }, (error)=>{
        console.error(error);
      }
    );
  }

  public clickNavLink(link: string){
    this.router.navigate([link]);
    setTimeout(() => {
      this.activarLink(link);
    }, 100);
  }
  
  public activarLink(link: string){
    // Primero removemos la clase active de todos los enlaces
    $("#principal").removeClass("active");
    $("#maestro").removeClass("active");
    $("#alumno").removeClass("active");
    $("#materias").removeClass("active");
    $("#graficas").removeClass("active");

    // Luego agregamos la clase active al enlace correspondiente
    if(link == "alumnos"){
      $("#alumno").addClass("active");
    }else if(link == "maestros"){
      $("#maestro").addClass("active");
    }else if(link == "home"){
      $("#principal").addClass("active");
    }else if(link == "graficas"){
      $("#graficas").addClass("active");
    }else if(link == "materias-screen"){
      $("#materias").addClass("active");
    }
  }
}

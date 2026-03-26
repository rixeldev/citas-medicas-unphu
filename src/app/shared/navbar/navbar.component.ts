import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { EncdescService } from 'src/app/services/encdesc.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {



  menu_adm_param = [];

  menu_adm_proceso = [];


  menu_adm_reporte = [];


 login_data:any;
 tipo_usuario:any;
 nombre_usuario:any;

  constructor( private route: Router,private encryp: EncdescService,public routes: ActivatedRoute, private router: Router) {

   this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));

     this.tipo_usuario = this.login_data.tipo_usuario;
     this.nombre_usuario = this.login_data.nombre;
  }


  ngOnInit(): void {
     this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));

     this.tipo_usuario = this.login_data.tipo_usuario;
     this.nombre_usuario = this.login_data.nombre;

if (this.tipo_usuario =="ADM"){
     this.menu_adm_param = [           
      { name: "Usuario", url: "/dashboard/usuario", icono: "nav-icon fas fa-book" }, 
      { name: "Cliente", url: "/dashboard/cliente", icono: "nav-icon fas fa-book" }, 
      { name: "Empresa", url: "/dashboard/empresa", icono: "nav-icon fas fa-book" }, 
      { name: "Vehiculo", url: "/dashboard/vehiculo", icono: "nav-icon fas fa-book" }, 
    ];
  
    this.menu_adm_proceso = [
      { name: "Recepción Despacho", url: "/dashboard/despachorecibidos", icono: "nav-icon fas fa-th" },
      { name: "Gastos", url: "/dashboard/gastos/0", icono: "nav-icon fas fa-th" },
      
    ];
  
  
    this.menu_adm_reporte = [
      { name: "Usuario", url: "/dashboard/repusuario", icono: "nav-icon fas fa-file" },
    ];
  

   }else{

    if (this.tipo_usuario =="SEC"){
      this.menu_adm_param = [

        { name: "producto", url: "/dashboard/producto", icono: "nav-icon fas fa-book" },  
       
      ];
     
      this.menu_adm_proceso = [
      
        { name: "Agenda", url: "/dashboard/agenda", icono: "nav-icon fas fa-th" }, 
      ];
     
     
      this.menu_adm_reporte = [
     
        { name: "Reporte de producto", url: "/dashboard/repproducto", icono: "nav-icon fas fa-file" },
     
      ];
    }
   
   }

  }

salir(){
 localStorage.removeItem("meta");
 this.route.navigate(['/login']);
}

  isActive(route: string) {
    if (route === this.router.url) {
      return true;
    }
    return false;
  }
}

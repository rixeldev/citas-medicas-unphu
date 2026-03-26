import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import Swal from 'sweetalert2';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

 constructor(private encryp: EncdescService, private fb: FormBuilder, private serv: DataService, private route: Router, private routes: ActivatedRoute) {

 }
 filtro: any;
 id_empr: any;
 reservaciones: any;
 login_data: any;
 forma!: FormGroup;

 monto1;
 monto2;
 monto3;
 monto4;

 tblreservacioness;


 ngOnInit(): void {
   this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
   this.getreservaciones();

   
 }


 editdash(rutas: any) {
  this.route.navigate(['/dashboard/verfactura', this.encryp.encryptData(JSON.stringify(rutas))])
}

 getreservaciones() {
   let datos =
   {
     codigousuario: this.login_data.usuario,
     jwt: '1'
   }
   this.serv.consultas(datos, 'dashboard/listall.php')
     .subscribe((resp: any) => {
 
       if (resp.status) {
        console.log(resp);
          this.monto1= resp.monto1;
          this.monto2= resp.cantidadcitas;
          this.monto3= resp.cantidadconsultas;
          this.monto4= resp.cantidadcitasvencidas;
          this.tblreservacioness= resp.tblcitas;

       }
       else {
         return
       }

     }, (err: any) => {
       console.log(err);
     });
 }

 Estadousuario(forma: any, estado: any) {
        let est = '';
    
        if (estado === 'I') { est = 'inactivar' }
        if (estado === 'A') { est = 'activar'}
    
        Swal.fire({
          icon: 'warning',
          text: `Seguro que desea ${est} esta usuario?`,
          showCancelButton: true,
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
    
            let datos: any = {};
            let dato: any = {};
           dato['id_usuario'] = forma.idusuario;
            dato['estado'] = estado;
            dato['jwt'] = '1';
            datos = JSON.stringify(dato);
            console.log(datos);
    
            try {
              this.serv.consultass(datos, '/usuario/estado.php').then((resp: any) => {
                Swal.fire({
                  icon: 'success',
                  text: 'Done!',
                  confirmButtonText: 'Ok',
                }).then(rep => {
                  this.ngOnInit();
                })
              })
            }
            catch (e) {
              console.log(e);
            }
          }
          else if (result.isDismissed) {
            null
          }
        })
      }

}

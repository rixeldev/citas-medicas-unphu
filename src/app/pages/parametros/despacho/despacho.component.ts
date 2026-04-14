import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-despacho',
  templateUrl: './despacho.component.html',
  styleUrls: ['./despacho.component.css']
})
export class DespachoComponent implements OnInit {

  citas: any[] = [];
  estados: any[] = [];
  login_data: any;
  filtro: string = '';
  
  // For ordering
  sortKey: string = 'fecha_cita';
  sortReverse: boolean = false;

  constructor(
    private serv: DataService,
    private encrp: EncdescService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.login_data = this.encrp.decryptData(localStorage.getItem('meta'));
    this.loadCitas();
    this.loadEstados();
  }

  loadCitas() {
    const datos = { jwt: this.login_data.jwt };
    this.serv.consultas(datos, 'v_agenda_medica/listall.php').subscribe((resp: any) => {
      if (resp.status) {
        this.citas = resp.data;
      }
    });
  }

  loadEstados() {
    const datos = { jwt: this.login_data.jwt };
    this.serv.consultas(datos, 'estados_cita/listall.php').subscribe((resp: any) => {
      if (resp.status) {
        this.estados = resp.data;
      }
    });
  }

  cambiarEstado(cita: any, nuovoEstadoId: any) {
    Swal.fire({
      title: '¿Cambiar estado?',
      text: `¿Desea cambiar el estado de la cita a ${this.getNombreEstado(nuovoEstadoId)}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const datos = {
          id_cita: cita.id_cita,
          id_estado: nuovoEstadoId,
          jwt: this.login_data.jwt
        };
        this.serv.consultass(JSON.stringify(datos), 'citas/estado.php').then((resp: any) => {
          if (resp.status) {
            Swal.fire('Actualizado', 'El estado ha sido actualizado correctamente', 'success');
            this.loadCitas();
          } else {
            Swal.fire('Error', resp.msg || 'No se pudo actualizar el estado', 'error');
          }
        });
      }
    });
  }

  getNombreEstado(id: any) {
    const state = this.estados.find(e => e.id_estado == id);
    return state ? state.nombre_estado : 'Desconocido';
  }

  editarCita(cita: any) {
    // We navigate to the existing addcitas component in edit mode
    const encryptedCita = this.encrp.encryptData(JSON.stringify(cita));
    this.router.navigate(['/dashboard/citas', encryptedCita]);
  }

  setOrderBy(key: string) {
    if (this.sortKey === key) {
      this.sortReverse = !this.sortReverse;
    } else {
      this.sortKey = key;
      this.sortReverse = false;
    }
    
    this.citas.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      
      if (valA < valB) return this.sortReverse ? 1 : -1;
      if (valA > valB) return this.sortReverse ? -1 : 1;
      return 0;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'],
})
export class CitasComponent implements OnInit {
  constructor(
    private encryp: EncdescService,
    private fb: FormBuilder,
    private serv: DataService,
    private route: Router,
  ) {}
  filtro: any;
  citas: any[] = [];
  login_data: any;
  forma!: FormGroup;

  ngOnInit(): void {
    this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
    this.getCitas();
  }

  addcita() {
    this.route.navigate([
      '/dashboard/citas',
      this.encryp.encryptData(JSON.stringify('add')),
    ]);
  }

  editcita(cita: any) {
    this.route.navigate([
      '/dashboard/citas',
      this.encryp.encryptData(JSON.stringify(cita)),
    ]);
  }

  getCitas() {
    const datos = { jwt: this.login_data.jwt };
    this.serv.consultas(datos, 'citas/listall.php').subscribe(
      (resp: any) => {
        if (resp.status) {
          this.citas = resp.data;
        }
      },
      (err: any) => console.log(err),
    );
  }

  Estadocita(cita: any, estado: any) {
    const est = estado === 1 ? 'activar' : 'anular';
    Swal.fire({
      icon: 'warning',
      text: `Seguro que desea ${est} esta cita?`,
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        const dato: any = {
          id_cita: cita.id_cita,
          id_estado: estado,
          jwt: this.login_data.jwt,
        };
        this.serv.consultass(JSON.stringify(dato), 'citas/estado.php')
          .then(() => {
            Swal.fire({ icon: 'success', text: 'Done!', confirmButtonText: 'Ok' })
              .then(() => this.ngOnInit());
          });
      }
    });
  }
}

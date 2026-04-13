import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
})
export class MedicosComponent implements OnInit {
  constructor(
    private encryp: EncdescService,
    private fb: FormBuilder,
    private serv: DataService,
    private route: Router,
    private routes: ActivatedRoute,
  ) {}
  filtro: any;
  medico: any;
  login_data: any;
  forma!: FormGroup;

  ngOnInit(): void {
    this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
    this.getmedico();
  }

  addmedico() {
    this.route.navigate([
      '/dashboard/medicos',
      this.encryp.encryptData(JSON.stringify('add')),
    ]);
  }

  editmedico(medico: any) {
    this.route.navigate([
      '/dashboard/medicos',
      this.encryp.encryptData(JSON.stringify(medico)),
    ]);
  }

  getmedico() {
    let datos = {
      jwt: this.login_data.jwt,
    };
    this.serv.consultas(datos, 'medicos/listall.php').subscribe(
      (resp: any) => {
        if (resp.status) {
          this.medico = resp.data;
        } else {
          return;
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  Estadomedico(forma: any, estado: any) {
    const est = estado === 1 ? 'activar' : 'inactivar';

    Swal.fire({
      icon: 'warning',
      text: `Seguro que desea ${est} este médico?`,
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        let dato: any = {};
        dato['id_medico'] = forma.id_medico;
        dato['activo'] = estado;
        dato['jwt'] = this.login_data.jwt;

        try {
          this.serv
            .consultass(JSON.stringify(dato), 'medicos/estado.php')
            .then((resp: any) => {
              Swal.fire({ icon: 'success', text: 'Done!', confirmButtonText: 'Ok' })
                .then(() => this.ngOnInit());
            });
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
}
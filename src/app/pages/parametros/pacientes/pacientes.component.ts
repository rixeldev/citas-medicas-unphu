import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  constructor(
    private encryp: EncdescService,
    private fb: FormBuilder,
    private serv: DataService,
    private route: Router,
    private routes: ActivatedRoute,
  ) {}
  filtro: any;
  id_empr: any;
  paciente: any;
  login_data: any;
  forma!: FormGroup;
  agregar: boolean = false;
  ngOnInit(): void {
    this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
    this.getpaciente();
  }
  addpaciente(paciente: any) {
    this.route.navigate([
      '/dashboard/pacientes',
      this.encryp.encryptData(JSON.stringify(paciente)),
    ]);
  }
  editpaciente(paciente: any) {
    this.route.navigate([
      '/dashboard/pacientes',
      this.encryp.encryptData(JSON.stringify(paciente)),
    ]);
  }

  getpaciente() {
    let datos = {
      codigopaciente: this.login_data.paciente,
      jwt: this.login_data.jwt,
    };
    this.serv.consultas(datos, 'pacientes/listall.php').subscribe(
      (resp: any) => {
        if (resp.status) {
          this.paciente = resp.data;
          console.log(this.paciente);
        } else {
          return;
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  Estadopaciente(forma: any, estado: any) {
    let est = '';

    if (estado === 0) {
      est = 'inactivar';
    }
    if (estado === 1) {
      est = 'activar';
    }

    Swal.fire({
      icon: 'warning',
      text: `Seguro que desea ${est} esta paciente?`,
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        let datos: any = {};
        let dato: any = {};
        dato['id_paciente'] = forma.id_paciente;
        dato['activo'] = estado;
        dato['jwt'] = this.login_data.jwt;
        datos = JSON.stringify(dato);

        try {
          this.serv
            .consultass(datos, 'pacientes/estado.php')
            .then((resp: any) => {
              Swal.fire({
                icon: 'success',
                text: 'Done!',
                confirmButtonText: 'Ok',
              }).then((rep) => {
                this.ngOnInit();
              });
            });
        } catch (e) {
          console.log(e);
        }
      } else if (result.isDismissed) {
        null;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';

@Component({
  selector: 'app-reppacientes',
  templateUrl: './reppacientes.component.html',
  styleUrls: ['./reppacientes.component.css'],
})
export class ReppacientesComponent implements OnInit {
  muestra = false;
  reporte: any[] = [];
  cant = '0';
  nombre_usuario = '';
  login_data: any;
  forma!: FormGroup;
  fecha = '';

  constructor(
    private encryp: EncdescService,
    private fb: FormBuilder,
    private serv: DataService,
    private route: Router,
    private routes: ActivatedRoute,
    private pdfExport: PdfExportService,
  ) {}

  ngOnInit(): void {
    this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
    this.crearFormulario();
    this.nombre_usuario = this.login_data?.nombre ?? '';
    this.fecha = new Date().toLocaleDateString();
  }

  crearFormulario() {
    this.forma = this.fb.group({
      estado: ['A'],
    });
  }

  getreporte() {
    const datos = {
      codigopaciente: this.login_data.paciente,
      jwt: this.login_data.jwt,
    };

    this.cant = '0';
    this.reporte = [];

    this.serv.consultas(datos, 'pacientes/listall.php').subscribe(
      (resp: any) => {
        if (resp.status && Array.isArray(resp.data)) {
          const rows = resp.data as any[];
          const est = this.forma.value.estado;
          let filtered = rows;
          if (est === 'A') {
            filtered = rows.filter((r) => r.activo === 1);
          } else if (est === 'I') {
            filtered = rows.filter((r) => r.activo === 0);
          }
          this.reporte = filtered;
          this.cant = String(filtered.length);
          this.muestra = true;
        }
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  generar() {
    this.muestra = true;
  }

  generarpdf() {
    const el = document.getElementById('htmlDataPacientes');
    void this.pdfExport.exportHtmlElementToPdf(
      el,
      `${new Date().toISOString()}_reporte_pacientes.pdf`,
    );
  }
}

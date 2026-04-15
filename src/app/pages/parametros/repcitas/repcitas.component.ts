import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';

@Component({
  selector: 'app-repcitas',
  templateUrl: './repcitas.component.html',
  styleUrls: ['./repcitas.component.css'],
})
export class RepcitasComponent implements OnInit {
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
      estado: this.forma.value.estado,
      jwt: this.login_data.jwt,
    };

    this.cant = '0';
    this.reporte = [];

    this.serv.consultas(datos, 'v_citas_por_estado/listall.php').subscribe(
      (resp: any) => {
        if (resp.status && Array.isArray(resp.data)) {
          this.reporte = resp.data;
          this.cant = String(resp.data.length);
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
    const el = document.getElementById('htmlDataCitas');
    void this.pdfExport.exportHtmlElementToPdf(
      el,
      `${new Date().toISOString()}_reporte_citas.pdf`,
    );
  }
}

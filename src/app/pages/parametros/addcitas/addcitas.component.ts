import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addcitas',
  templateUrl: './addcitas.component.html',
  styleUrls: ['./addcitas.component.css'],
})
export class AddcitasComponent implements OnInit {
  constructor(
    private encryp: EncdescService,
    private fb: FormBuilder,
    private serv: DataService,
    private route: Router,
    private routes: ActivatedRoute,
  ) {}
  cita: any;
  login_data: any;
  id!: string | null;
  forma!: FormGroup;

  // lookup data
  pacientes: any[]      = [];
  medicos: any[]        = [];
  especialidades: any[] = [];
  motivos: any[]        = [];
  estados: any[]        = [];

  ngOnInit(): void {
    this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
    this.crearFormulario();
    this.loadLookups();

    const paramId  = this.routes.snapshot.paramMap.get('id');
    const decrypted = paramId === 'add' ? 'add' : this.encryp.decryptData(paramId);

    if (decrypted && decrypted !== 'add') {
      this.id   = 'edit';
      this.cita = decrypted;

      this.forma.controls['id_cita'].setValue(this.cita.id_cita);
      this.forma.controls['numero_cita'].setValue(this.cita.numero_cita);
      this.forma.controls['id_paciente'].setValue(this.cita.id_paciente);
      this.forma.controls['id_medico'].setValue(this.cita.id_medico);
      this.forma.controls['id_especialidad'].setValue(this.cita.id_especialidad);
      this.forma.controls['id_motivo'].setValue(this.cita.id_motivo);
      this.forma.controls['id_estado'].setValue(this.cita.id_estado);
      this.forma.controls['fecha_cita'].setValue(this.cita.fecha_cita);
      this.forma.controls['hora_inicio'].setValue(this.cita.hora_inicio);
      this.forma.controls['hora_fin'].setValue(this.cita.hora_fin);
      this.forma.controls['duracion_minutos'].setValue(this.cita.duracion_minutos);
      this.forma.controls['fecha_confirmacion'].setValue(this.cita.fecha_confirmacion);
      this.forma.controls['observaciones'].setValue(this.cita.observaciones);
      this.forma.controls['notas_medicas'].setValue(this.cita.notas_medicas);
      this.forma.controls['consultorio'].setValue(this.cita.consultorio);
      this.forma.controls['tipo_cita'].setValue(this.cita.tipo_cita);
      this.forma.controls['es_primera_vez'].setValue(this.cita.es_primera_vez);
    } else {
      this.id = 'add';
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({
      id_cita:           [''],
      numero_cita:       [''],
      id_paciente:       ['', [Validators.required]],
      id_medico:         ['', [Validators.required]],
      id_especialidad:   ['', [Validators.required]],
      id_motivo:         ['', [Validators.required]],
      id_estado:         ['', [Validators.required]],
      fecha_cita:        ['', [Validators.required]],
      hora_inicio:       ['', [Validators.required]],
      hora_fin:          [''],
      duracion_minutos:  [30],
      fecha_confirmacion:[''],
      observaciones:     [''],
      notas_medicas:     [''],
      consultorio:       [''],
      tipo_cita:         ['Presencial', [Validators.required]],
      es_primera_vez:    [0],
    });
  }

  loadLookups() {
    const jwt = { jwt: this.login_data.jwt };
    this.serv.consultas(jwt, 'pacientes/listall.php').subscribe((r: any) => { if (r.status) this.pacientes = r.data; });
    this.serv.consultas(jwt, 'medicos/listall.php').subscribe((r: any) => { if (r.status) this.medicos = r.data; });
    this.serv.consultas(jwt, 'especialidades/listall.php').subscribe((r: any) => { if (r.status) this.especialidades = r.data; });
    this.serv.consultas(jwt, 'motivos_consulta/listall.php').subscribe((r: any) => { if (r.status) this.motivos = r.data; });
    this.serv.consultas(jwt, 'estados_cita/listall.php').subscribe((r: any) => { if (r.status) this.estados = r.data; });
  }

  get pacienteNoValido() { return this.forma.get('id_paciente')!.invalid && this.forma.get('id_paciente')!.touched; }
  get medicoNoValido()   { return this.forma.get('id_medico')!.invalid && this.forma.get('id_medico')!.touched; }
  get especialidadNoValido() { return this.forma.get('id_especialidad')!.invalid && this.forma.get('id_especialidad')!.touched; }
  get motivoNoValido()   { return this.forma.get('id_motivo')!.invalid && this.forma.get('id_motivo')!.touched; }
  get estadoNoValido()   { return this.forma.get('id_estado')!.invalid && this.forma.get('id_estado')!.touched; }
  get fechaNoValido()    { return this.forma.get('fecha_cita')!.invalid && this.forma.get('fecha_cita')!.touched; }
  get horaNoValido()     { return this.forma.get('hora_inicio')!.invalid && this.forma.get('hora_inicio')!.touched; }
  get tipoCitaNoValido() { return this.forma.get('tipo_cita')!.invalid && this.forma.get('tipo_cita')!.touched; }

  guardar() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach(c => c.markAsTouched());
    }
    Swal.fire({
      icon: 'warning', text: 'Seguro que desea guardar?',
      showCancelButton: true, confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.id === 'edit') {
          this.Actualizacita(this.forma.value);
        } else {
          this.Guardacita(this.forma.value);
        }
        Swal.fire({ icon: 'success', text: 'Done!', confirmButtonText: 'Ok' })
          .then(() => this.route.navigate(['/dashboard/citas']));
      }
    });
  }

  private buildPayload(forma: any): any {
    return {
      numero_cita:        forma.numero_cita || '',
      id_paciente:        Number(forma.id_paciente),
      id_medico:          Number(forma.id_medico),
      id_especialidad:    Number(forma.id_especialidad),
      id_motivo:          Number(forma.id_motivo),
      id_estado:          Number(forma.id_estado),
      fecha_cita:         forma.fecha_cita,
      hora_inicio:        forma.hora_inicio,
      hora_fin:           forma.hora_fin || '',
      duracion_minutos:   forma.duracion_minutos || 30,
      fecha_solicitud:    new Date().toISOString().split('T')[0],
      fecha_confirmacion: forma.fecha_confirmacion || '',
      observaciones:      forma.observaciones || '',
      notas_medicas:      forma.notas_medicas || '',
      consultorio:        forma.consultorio || '',
      tipo_cita:          forma.tipo_cita,
      es_primera_vez:     forma.es_primera_vez || 0,
    };
  }

  Guardacita(forma: any) {
    const dato: any = this.buildPayload(forma);
    dato['usuario_creacion'] = this.login_data.id_usuario;
    dato['jwt']              = this.login_data.jwt;
    this.serv.consultass(JSON.stringify(dato), 'citas/agregar.php')
      .then().catch((e: any) => console.log(e));
  }

  Actualizacita(forma: any) {
    const dato: any = this.buildPayload(forma);
    dato['id_cita']               = forma.id_cita;
    dato['usuario_modificacion']  = this.login_data.id_usuario;
    dato['jwt']                   = this.login_data.jwt;
    this.serv.consultass(JSON.stringify(dato), 'citas/editar.php')
      .then().catch((e: any) => console.log(e));
  }
}

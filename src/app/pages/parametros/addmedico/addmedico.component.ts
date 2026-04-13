import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addmedico',
  templateUrl: './addmedico.component.html',
  styleUrls: ['./addmedico.component.css'],
})
export class AddmedicoComponent implements OnInit {
  constructor(
    private encryp: EncdescService,
    private fb: FormBuilder,
    private serv: DataService,
    private route: Router,
    private routes: ActivatedRoute,
  ) {}
  medico: any;
  login_data: any;
  id!: string | null;
  forma!: FormGroup;
  especialidades: any[] = [];

  ngOnInit(): void {
    this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
    this.crearFormulario();
    this.getEspecialidades();

    const paramId = this.routes.snapshot.paramMap.get('id');
    const decrypted =
      paramId === 'add' ? 'add' : this.encryp.decryptData(paramId);

    if (decrypted && decrypted !== 'add') {
      this.id = 'edit';
      this.medico = decrypted;

      this.forma.controls['id_medico'].setValue(this.medico.id_medico);
      this.forma.controls['id_usuario'].setValue(this.medico.id_usuario);
      this.forma.controls['id_especialidad'].setValue(
        this.medico.id_especialidad,
      );
      this.forma.controls['numero_licencia'].setValue(
        this.medico.numero_licencia,
      );
      this.forma.controls['nombre'].setValue(this.medico.nombre);
      this.forma.controls['apellido_paterno'].setValue(
        this.medico.apellido_paterno,
      );
      this.forma.controls['apellido_materno'].setValue(
        this.medico.apellido_materno,
      );
      this.forma.controls['telefono'].setValue(this.medico.telefono);
      this.forma.controls['email'].setValue(this.medico.email);
      this.forma.controls['consultorio'].setValue(this.medico.consultorio);
      this.forma.controls['biografia'].setValue(this.medico.biografia);
      this.forma.controls['anos_experiencia'].setValue(
        this.medico.anos_experiencia,
      );
      this.forma.controls['fecha_contratacion'].setValue(
        this.medico.fecha_contratacion,
      );
      this.forma.controls['activo'].setValue(this.medico.activo);
    } else {
      this.id = 'add';
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({
      id_medico: [''],
      id_usuario: [''],
      // usuario account fields
      nombre_completo: ['', [Validators.required]],
      nombre_usuario: ['', [Validators.required]],
      password_hash: ['', [Validators.required]],
      // medico fields
      id_especialidad: ['', [Validators.required]],
      numero_licencia: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido_paterno: ['', [Validators.required]],
      apellido_materno: [''],
      telefono: ['', [Validators.required]],
      email: [''],
      consultorio: [''],
      biografia: [''],
      anos_experiencia: [0],
      fecha_contratacion: ['', [Validators.required]],
      activo: [1, [Validators.required]],
    });
  }

  getEspecialidades() {
    const datos = { jwt: this.login_data.jwt };
    this.serv.consultas(datos, 'especialidades/listall.php').subscribe(
      (resp: any) => {
        if (resp.status) {
          this.especialidades = resp.data;
        }
      },
      (err: any) => console.log(err),
    );
  }

  get nombreNoValido() {
    return (
      this.forma.get('nombre')!.invalid && this.forma.get('nombre')!.touched
    );
  }
  get apellidoNoValido() {
    return (
      this.forma.get('apellido_paterno')!.invalid &&
      this.forma.get('apellido_paterno')!.touched
    );
  }
  get licenciaNoValido() {
    return (
      this.forma.get('numero_licencia')!.invalid &&
      this.forma.get('numero_licencia')!.touched
    );
  }
  get especialidadNoValido() {
    return (
      this.forma.get('id_especialidad')!.invalid &&
      this.forma.get('id_especialidad')!.touched
    );
  }
  get telefonoNoValido() {
    return (
      this.forma.get('telefono')!.invalid && this.forma.get('telefono')!.touched
    );
  }
  get fechaNoValido() {
    return (
      this.forma.get('fecha_contratacion')!.invalid &&
      this.forma.get('fecha_contratacion')!.touched
    );
  }

  guardar() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach((c) =>
        c.markAsTouched(),
      );
    }

    Swal.fire({
      icon: 'warning',
      text: 'Seguro que desea guardar?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.id === 'edit') {
          this.Actualizamedico(this.forma.value);
        } else {
          this.Guardarmedico(this.forma.value);
        }
        Swal.fire({
          icon: 'success',
          text: 'Done!',
          confirmButtonText: 'Ok',
        }).then(() => this.route.navigate(['/dashboard/medicos']));
      }
    });
  }

  async Guardarmedico(forma: any) {
    try {
      // Step 1: create linked usuario (rol 2 = Médico by default)
      const usuarioDato: any = {
        nombre_completo: forma.nombre_completo,
        nombre_usuario:  forma.nombre_usuario,
        password_hash:   forma.password_hash,
        email:           forma.email || '',
        telefono:        forma.telefono || '',
        jwt:             this.login_data.jwt,
      };
      const usuarioResp: any = await this.serv.consultass(
        JSON.stringify(usuarioDato), 'usuarios/agregar_medico.php'
      );

      if (!usuarioResp || !usuarioResp.status) {
        Swal.fire({ icon: 'error', text: `Error al crear usuario: ${usuarioResp?.msg || ''}` });
        return;
      }

      const nuevo_id_usuario = usuarioResp.id_usuario;

      // Step 2: create medico using the new id_usuario
      const dato: any = {};
      dato['id_usuario']         = nuevo_id_usuario;
      dato['id_especialidad']    = forma.id_especialidad;
      dato['numero_licencia']    = forma.numero_licencia;
      dato['nombre']             = forma.nombre;
      dato['apellido_paterno']   = forma.apellido_paterno;
      dato['apellido_materno']   = forma.apellido_materno || '';
      dato['telefono']           = forma.telefono;
      dato['email']              = forma.email || '';
      dato['consultorio']        = forma.consultorio || '';
      dato['biografia']          = forma.biografia || '';
      dato['anos_experiencia']   = forma.anos_experiencia || 0;
      dato['activo']             = forma.activo;
      dato['fecha_contratacion'] = forma.fecha_contratacion;
      dato['usuario_registro']   = this.login_data.id_usuario;
      dato['jwt']                = this.login_data.jwt;

      await this.serv.consultass(JSON.stringify(dato), 'medicos/agregar.php');

    } catch (e) {
      console.log(e);
    }
  }

  Actualizamedico(forma: any) {
    let dato: any = {};
    dato['id_medico'] = forma.id_medico;
    dato['id_usuario'] = forma.id_usuario || null;
    dato['id_especialidad'] = forma.id_especialidad;
    dato['numero_licencia'] = forma.numero_licencia;
    dato['nombre'] = forma.nombre;
    dato['apellido_paterno'] = forma.apellido_paterno;
    dato['apellido_materno'] = forma.apellido_materno || '';
    dato['telefono'] = forma.telefono;
    dato['email'] = forma.email || '';
    dato['consultorio'] = forma.consultorio || '';
    dato['biografia'] = forma.biografia || '';
    dato['anos_experiencia'] = forma.anos_experiencia || 0;
    dato['activo'] = forma.activo;
    dato['fecha_contratacion'] = forma.fecha_contratacion;
    dato['usuario_modificado'] = this.login_data.id_usuario;
    dato['jwt'] = this.login_data.jwt;

    let datos = JSON.stringify(dato);
    try {
      this.serv.consultass(datos, 'medicos/editar.php').then();
    } catch (e) {}
  }
}

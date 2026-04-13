import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-addpaciente',
  templateUrl: './addpaciente.component.html',
  styleUrls: ['./addpaciente.component.css']
})
export class AddpacienteComponent implements OnInit {
  constructor(
    private encryp: EncdescService,
    private fb: FormBuilder,
    private serv: DataService,
    private route: Router,
    private routes: ActivatedRoute,
  ) {}
  paciente: any;
  login_data: any;
  id!: string | null;
  forma!: FormGroup;

  ngOnInit(): void {
    this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
    this.crearFormulario();
    let paramId = this.routes.snapshot.paramMap.get('id');
    
    // Attempt decryption to detect if it's an object with an ID
    let decrypted = paramId === 'add' ? 'add' : this.encryp.decryptData(paramId);
    
    if (decrypted && decrypted !== 'add') {
      this.id = 'edit';
      this.paciente = decrypted;
      
      this.forma.controls['id_paciente'].setValue(this.paciente.id_paciente);
      this.forma.controls['numero_expediente'].setValue(this.paciente.numero_expediente);
      this.forma.controls['nombre'].setValue(this.paciente.nombre);
      this.forma.controls['apellido_paterno'].setValue(this.paciente.apellido_paterno);
      this.forma.controls['apellido_materno'].setValue(this.paciente.apellido_materno);
      this.forma.controls['fecha_nacimiento'].setValue(this.paciente.fecha_nacimiento);
      this.forma.controls['genero'].setValue(this.paciente.genero);
      this.forma.controls['tipo_documento'].setValue(this.paciente.tipo_documento);
      this.forma.controls['numero_documento'].setValue(this.paciente.numero_documento);
      this.forma.controls['email'].setValue(this.paciente.email);
      this.forma.controls['telefono_principal'].setValue(this.paciente.telefono_principal);
      this.forma.controls['telefono_secundario'].setValue(this.paciente.telefono_secundario);
      this.forma.controls['direccion'].setValue(this.paciente.direccion);
      this.forma.controls['ciudad'].setValue(this.paciente.ciudad);
      this.forma.controls['provincia'].setValue(this.paciente.provincia);
      this.forma.controls['codigo_postal'].setValue(this.paciente.codigo_postal);
      this.forma.controls['tipo_sangre'].setValue(this.paciente.tipo_sangre);
      this.forma.controls['alergias'].setValue(this.paciente.alergias);
      this.forma.controls['condiciones_medicas'].setValue(this.paciente.condiciones_medicas);
      this.forma.controls['contacto_emergencia_nombre'].setValue(this.paciente.contacto_emergencia_nombre);
      this.forma.controls['contacto_emergencia_telefono'].setValue(this.paciente.contacto_emergencia_telefono);
      this.forma.controls['contacto_emergencia_relacion'].setValue(this.paciente.contacto_emergencia_relacion);
      this.forma.controls['activo'].setValue(this.paciente.activo);
    } else {
      this.id = 'add';
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({
      id_paciente: [''],
      numero_expediente: [''],
      nombre: ['', [Validators.required]],
      apellido_paterno: ['', [Validators.required]],
      apellido_materno: [''],
      fecha_nacimiento: ['', [Validators.required]],
      genero: ['Otro', [Validators.required]],
      tipo_documento: ['Cedula', [Validators.required]],
      numero_documento: ['', [Validators.required]],
      email: [''],
      telefono_principal: ['', [Validators.required]],
      telefono_secundario: [''],
      direccion: [''],
      ciudad: [''],
      provincia: [''],
      codigo_postal: [''],
      tipo_sangre: [''],
      alergias: [''],
      condiciones_medicas: [''],
      contacto_emergencia_nombre: [''],
      contacto_emergencia_telefono: [''],
      contacto_emergencia_relacion: [''],
      activo: [1, [Validators.required]]
    });
  }

  get nombreNoValido() { return this.forma.get('nombre')!.invalid && this.forma.get('nombre')!.touched; }
  get apellidoNoValido() { return this.forma.get('apellido_paterno')!.invalid && this.forma.get('apellido_paterno')!.touched; }
  get fechaNacimientoNoValido() { return this.forma.get('fecha_nacimiento')!.invalid && this.forma.get('fecha_nacimiento')!.touched; }
  get generoNoValido() { return this.forma.get('genero')!.invalid && this.forma.get('genero')!.touched; }
  get tipoDocumentoNoValido() { return this.forma.get('tipo_documento')!.invalid && this.forma.get('tipo_documento')!.touched; }
  get documentoNoValido() { return this.forma.get('numero_documento')!.invalid && this.forma.get('numero_documento')!.touched; }
  get telefonoNoValido() { return this.forma.get('telefono_principal')!.invalid && this.forma.get('telefono_principal')!.touched; }
  get activoNoValido() { return this.forma.get('activo')!.invalid && this.forma.get('activo')!.touched; }

  Cerrarmodal(forma: FormGroup) {
    forma.reset();
  }

  guardar() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    Swal.fire({
      icon: 'warning',
      text: 'Seguro que desea guardar?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.id === 'edit') {
          this.Actualizapaciente(this.forma.value);
        } else {
          this.Guardarpaciente(this.forma.value);
        }
        Swal.fire({
          icon: 'success',
          text: 'Done!',
          confirmButtonText: 'Ok',
        }).then((rep) => {
          this.route.navigate(['/dashboard/pacientes']);
        });
      }
    });
  }

  Guardarpaciente(forma: any) {
    let dato: any = {};
    dato['numero_expediente'] = forma.numero_expediente || '';
    dato['nombre'] = forma.nombre;
    dato['apellido_paterno'] = forma.apellido_paterno;
    dato['apellido_materno'] = forma.apellido_materno || '';
    dato['fecha_nacimiento'] = forma.fecha_nacimiento;
    dato['genero'] = forma.genero;
    dato['tipo_documento'] = forma.tipo_documento;
    dato['numero_documento'] = forma.numero_documento;
    dato['email'] = forma.email || '';
    dato['telefono_principal'] = forma.telefono_principal;
    dato['telefono_secundario'] = forma.telefono_secundario || '';
    dato['direccion'] = forma.direccion || '';
    dato['ciudad'] = forma.ciudad || '';
    dato['provincia'] = forma.provincia || '';
    dato['codigo_postal'] = forma.codigo_postal || '';
    dato['tipo_sangre'] = forma.tipo_sangre || '';
    dato['alergias'] = forma.alergias || '';
    dato['condiciones_medicas'] = forma.condiciones_medicas || '';
    dato['contacto_emergencia_nombre'] = forma.contacto_emergencia_nombre || '';
    dato['contacto_emergencia_telefono'] = forma.contacto_emergencia_telefono || '';
    dato['contacto_emergencia_relacion'] = forma.contacto_emergencia_relacion || '';
    dato['activo'] = forma.activo;

    dato['usuario_registro'] = this.login_data.id_usuario;
    dato['jwt'] = this.login_data.jwt;

    let datos = JSON.stringify(dato);
    try {
      this.serv.consultass(datos, 'pacientes/agregar.php').then();
    } catch (e) {}
  }

  Actualizapaciente(forma: any) {
    let dato: any = {};
    dato['id_paciente'] = forma.id_paciente;
    dato['numero_expediente'] = forma.numero_expediente || '';
    dato['nombre'] = forma.nombre;
    dato['apellido_paterno'] = forma.apellido_paterno;
    dato['apellido_materno'] = forma.apellido_materno || '';
    dato['fecha_nacimiento'] = forma.fecha_nacimiento;
    dato['genero'] = forma.genero;
    dato['tipo_documento'] = forma.tipo_documento;
    dato['numero_documento'] = forma.numero_documento;
    dato['email'] = forma.email || '';
    dato['telefono_principal'] = forma.telefono_principal;
    dato['telefono_secundario'] = forma.telefono_secundario || '';
    dato['direccion'] = forma.direccion || '';
    dato['ciudad'] = forma.ciudad || '';
    dato['provincia'] = forma.provincia || '';
    dato['codigo_postal'] = forma.codigo_postal || '';
    dato['tipo_sangre'] = forma.tipo_sangre || '';
    dato['alergias'] = forma.alergias || '';
    dato['condiciones_medicas'] = forma.condiciones_medicas || '';
    dato['contacto_emergencia_nombre'] = forma.contacto_emergencia_nombre || '';
    dato['contacto_emergencia_telefono'] = forma.contacto_emergencia_telefono || '';
    dato['contacto_emergencia_relacion'] = forma.contacto_emergencia_relacion || '';
    dato['activo'] = forma.activo;

    dato['usuario_modificado'] = this.login_data.id_usuario;
    dato['jwt'] = this.login_data.jwt;

    let datos = JSON.stringify(dato);
    try {
      this.serv.consultass(datos, 'pacientes/editar.php').then();
    } catch (e) {}
  }
}

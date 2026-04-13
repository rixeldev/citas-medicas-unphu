import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { EncdescService } from 'src/app/services/encdesc.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-addusuario',
  templateUrl: './addusuario.component.html',
  styleUrls: ['./addusuario.component.css'],
})
export class AddusuarioComponent implements OnInit {
  constructor(
    private encryp: EncdescService,
    private fb: FormBuilder,
    private serv: DataService,
    private route: Router,
    private routes: ActivatedRoute,
  ) {}
  usuario: any;
  login_data: any;
  id!: string | null;
  forma!: FormGroup;

  ngOnInit(): void {
    this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
    this.crearFormulario();
    this.id = this.encryp.decryptData(this.routes.snapshot.paramMap.get('id'));

    if (this.id != 'add') {
      this.usuario = this.encryp.decryptData(
        this.routes.snapshot.paramMap.get('id'),
      );
      // console.log(this.marca);

      //armar aqui campos

      this.forma.controls['id_usuario'].setValue(this.usuario.id_usuario);
      this.forma.controls['nombre_completo'].setValue(
        this.usuario.nombre_completo,
      );
      this.forma.controls['nombre_usuario'].setValue(
        this.usuario.nombre_usuario,
      );
      this.forma.controls['password_hash'].setValue(this.usuario.password_hash);
      this.forma.controls['telefono'].setValue(this.usuario.telefono);
      this.forma.controls['id_rol'].setValue(this.usuario.id_rol);
      this.forma.controls['activo'].setValue(this.usuario.activo);
    }
  }
  crearFormulario() {
    this.forma = this.fb.group({
      id_usuario: [''],
      nombre_completo: ['', [Validators.required]],
      nombre_usuario: ['', [Validators.required]],
      password_hash: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      activo: ['', [Validators.required]],
      id_rol: ['', [Validators.required]],
    });
  }
  //armar campos db

  get id_rolNoValido() {
    return (
      this.forma.get('id_rol')!.invalid && this.forma.get('id_rol')!.touched
    );
  }

  get nombre_completoNoValido() {
    return (
      this.forma.get('nombre_completo')!.invalid &&
      this.forma.get('nombre_completo')!.touched
    );
  }
  get nombre_usuarioNoValido() {
    return (
      this.forma.get('nombre_usuario')!.invalid &&
      this.forma.get('nombre_usuario')!.touched
    );
  }
  get password_hashNoValido() {
    return (
      this.forma.get('password_hash')!.invalid &&
      this.forma.get('password_hash')!.touched
    );
  }
  get telefonoNoValido() {
    return (
      this.forma.get('telefono')!.invalid &&
      this.forma.get('telefono')!.touched
    );
  }
  get activoNoValido() {
    return (
      this.forma.get('activo')!.invalid && this.forma.get('activo')!.touched
    );
  }

  Cerrarmodal(forma: FormGroup) {
    forma.reset();
  }

  //armar por campos id_

  guardar() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((control) =>
            control.markAsTouched(),
          );
        } else {
          control.markAsTouched();
        }
      });
    }

    Swal.fire({
      icon: 'warning',
      text: 'Seguro que desea guardar?',
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.id != 'add') {
          this.Actualizausuario(this.forma.value);
        }
        if (this.id === 'add') {
          this.Guardarusuario(this.forma.value);
        }
        Swal.fire({
          icon: 'success',
          text: 'Done!',
          confirmButtonText: 'Ok',
        }).then((rep) => {
          this.route.navigate(['/dashboard/usuario']);
        });
      } else if (result.isDismissed) {
        null;
      }
    });
  }

  Guardarusuario(forma: any) {
    let datos: any = {};
    let dato: any = {};
    console.log(forma);
    dato['nombre_completo'] = forma.nombre_completo;
    dato['nombre_usuario'] = forma.nombre_usuario;
    dato['password_hash'] = forma.password_hash;
    dato['id_rol'] = forma.id_rol;
    dato['activo'] = forma.activo;

    dato['email'] = ''; // o undefined si no se requiere
    dato['telefono'] = forma.telefono;
    dato['ultimo_acceso'] = null;
    dato['intentos_fallidos'] = 0;
    dato['bloqueado'] = 0;

    dato['jwt'] = this.login_data.jwt;

    datos = JSON.stringify(dato);

    try {
      this.serv
        .consultass(datos, 'usuarios/agregar.php')
        .then((resp: any) => {});
    } catch (e) {
      console.log(e);
    }
  }

  Actualizausuario(forma: any) {
    let datos: any = {};
    let dato: any = {};

    dato['id_usuario'] = forma.id_usuario;
    dato['nombre_completo'] = forma.nombre_completo;
    dato['nombre_usuario'] = forma.nombre_usuario;
    dato['password_hash'] = forma.password_hash;
    dato['id_rol'] = forma.id_rol;
    dato['activo'] = forma.activo;

    dato['email'] = this.usuario?.email || '';
    dato['telefono'] = forma.telefono || '';
    dato['ultimo_acceso'] = this.usuario?.ultimo_acceso || null;
    dato['intentos_fallidos'] = this.usuario?.intentos_fallidos || 0;
    dato['bloqueado'] = this.usuario?.bloqueado || 0;

    dato['jwt'] = this.login_data.jwt;

    datos = JSON.stringify(dato);

    console.log(datos);
    try {
      this.serv.consultass(datos, 'usuarios/editar.php').then((resp: any) => {
        console.log(resp);
      });
    } catch (e) {
      console.log(e);
    }
  }
}

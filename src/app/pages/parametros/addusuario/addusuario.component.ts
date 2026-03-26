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
      styleUrls: ['./addusuario.component.css']
    })
    export class AddusuarioComponent implements OnInit {
      
    
      constructor(private encryp: EncdescService, private fb: FormBuilder, private serv: DataService, private route: Router, private routes: ActivatedRoute) {


        
      }
      usuario: any;
      login_data: any;
      id!: string | null;
      forma!: FormGroup;
    
      ngOnInit(): void {
        this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
        this.crearFormulario();
        this.id = this.encryp.decryptData(this.routes.snapshot.paramMap.get('id'));
      
        
        
        
        if (this.id != 'add') {
    
          this.usuario = this.encryp.decryptData(this.routes.snapshot.paramMap.get('id'));
          // console.log(this.marca);

          //armar aqui campos
          
        this.forma.controls['idusuario'].setValue(this.usuario.idusuario);
        this.forma.controls['Nombre'].setValue(this.usuario.nombre);
        this.forma.controls['usuario'].setValue(this.usuario.usuario);
        this.forma.controls['clave'].setValue(this.usuario.clave);
        this.forma.controls['tipo_usuario'].setValue(this.usuario.tipousuario);
        this.forma.controls['estado'].setValue(this.usuario.estado);
        }
      }
      crearFormulario() {
        this.forma = this.fb.group({
         
        idusuario:[''],
        Nombre:['', [Validators.required]],
        usuario:['', [Validators.required]],
        clave:['', [Validators.required]],
        estado:['', [Validators.required]],
        tipo_usuario:['', [Validators.required]],
        
        });
    
      
    
      }
    //armar campos db
    
        get tipo_usuarioNoValido() {
      return this.forma.get('tipo_usuario')!.invalid && this.forma.get('tipo_usuario')!.touched
    }
        
        get NombreNoValido() {
      return this.forma.get('Nombre')!.invalid && this.forma.get('Nombre')!.touched
    }
        get usuarioNoValido() {
      return this.forma.get('usuario')!.invalid && this.forma.get('usuario')!.touched
    }
        get claveNoValido() {
      return this.forma.get('clave')!.invalid && this.forma.get('clave')!.touched
    }
        get estadoNoValido() {
      return this.forma.get('estado')!.invalid && this.forma.get('estado')!.touched
    }
    
   
      Cerrarmodal(forma: FormGroup) {
    
        forma.reset();
      }
    
      //armar por campos id_
      
     
  
    
    
      guardar() {
        if (this.forma.invalid) {
          return Object.values(this.forma.controls).forEach(control => {
            if (control instanceof FormGroup) {
              Object.values(control.controls).forEach(control => control.markAsTouched())
            }
            else {
              control.markAsTouched();
            }
          })
    
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
              this.Guardausuario(this.forma.value);
    
            }
            Swal.fire({
              icon: 'success',
              text: 'Done!',
              confirmButtonText: 'Ok',
            }).then(rep => {
              this.route.navigate(['/dashboard/usuario']);
            })
          } else if (result.isDismissed) {
            null
          }
        })
      }


    
      Guardausuario(forma: any) {
        let datos: any = {};
        let dato: any = {};
        

        dato['nombre'] = forma.Nombre;
        dato['usuario'] = forma.usuario;
        dato['clave'] = forma.clave;
        dato['tipo_usuario'] = forma.tipo_usuario;
        dato['estado'] = forma.estado;
    
        dato['jwt'] = 1;
    
    
    
        datos = JSON.stringify(dato);
    
        try {
          this.serv.consultass(datos, '/usuario/agregar.php').then((resp: any) => {
          })
        }
        catch (e) {
          console.log(e);
        }
      }
      
      
      Actualizausuario(forma: any) {
        let datos: any = {};
        let dato: any = {};
    
        
         dato['id_usuario'] = forma.idusuario;
         dato['nombre'] = forma.Nombre;
         dato['usuario'] = forma.usuario;
         dato['clave'] = forma.clave;
         dato['tipo_usuario'] = forma.tipo_usuario;
         dato['estado'] = forma.estado;
    

        dato['jwt'] = 1;
    
    
        datos = JSON.stringify(dato);

        console.log(datos)
        try {
          this.serv.consultass(datos, '/usuario/editar.php').then((resp: any) => {
            console.log(resp)
          })
        }
        catch (e) {
          console.log(e);
        }
      }
    
    }    
    
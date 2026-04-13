import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { Router, ActivatedRoute } from '@angular/router';
    import { DataService } from 'src/app/services/data.service';
    import { EncdescService } from 'src/app/services/encdesc.service';
    import Swal from 'sweetalert2';
    declare var $: any;
    import jsPDF from 'jspdf';
    import html2canvas from 'html2canvas';
    

@Component({
  selector: 'app-repcitas',
  templateUrl: './repcitas.component.html',
  styleUrls: ['./repcitas.component.css']
})
export class RepcitasComponent implements OnInit {
  paciente: any;
  usuario: any;
  tipocita: any;
  muestra = false;

  reporte;
  cant ="0" ;

  nombre_usuario="";
constructor(private encryp: EncdescService, private fb: FormBuilder, private serv: DataService, private route: Router, private routes: ActivatedRoute) {
}
citas: any;
login_data: any;
id!: string | null;
forma!: FormGroup;

fecha;

ngOnInit(): void {

 this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));
 this.crearFormulario();
  this.login_data = this.encryp.decryptData(localStorage.getItem('meta'));

 
  this.nombre_usuario = this.login_data.nombre;


  this.fecha = new Date().toLocaleDateString();
  
}


crearFormulario() {
 this.forma = this.fb.group({

 estado:[''],
 id_usuario:[''],
 
 });



}

//armar por campos id_

getreporte() {
 let datos =
 {
   estado: this.forma.value.estado,
   jwt: '1'
 }

 this.cant ="0";
 
 this.serv.consultas(datos, 'v_citas_por_estado/listall.php')
   .subscribe((resp: any) => {
     if (resp.status) {
      this. reporte = resp.data;
       console.log(resp);
       this.cant = resp.data.length;
     }
     else {
       return
     }

   }, (err: any) => {
     console.log(err);
   });
} 

generar(){
 this.muestra = true;

}


generarpdf(){


 Swal.fire({
  allowOutsideClick: false,
  icon: 'info',
  text: 'Espere por favor...'
});
Swal.showLoading();

  const DATA = document.getElementById('htmlData');
  const doc = new jsPDF('p', 'pt', 'a4' );
  const options = {
    background: 'white',
    scale: 3
  };
  html2canvas(DATA, options).then((canvas) => {

    const img = canvas.toDataURL('image/PNG');

    // Add image Canvas to PDF
    const bufferX = 15;
    const bufferY = 15;
    const imgProps = (doc as any).getImageProperties(img);
    const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    return doc;
  }).then((docResult) => {
   Swal.close();

    docResult.save(`${new Date().toISOString()}_reporte.pdf`);
  });
}



}    

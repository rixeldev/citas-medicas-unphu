import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotImagePipe } from './pipes/not-image.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { TooltipModule } from '../common/ui/tooltip/tooltip.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';

import { UsuarioComponent } from '../pages/parametros/usuario/usuario.component';

import { AddusuarioComponent } from './parametros/addusuario/addusuario.component';
import { PacientesComponent } from './parametros/pacientes/pacientes.component';
import { AddpacienteComponent } from './parametros/addpaciente/addpaciente.component';
import { CitasComponent } from './parametros/citas/citas.component';
import { MedicosComponent } from './parametros/medicos/medicos.component';
import { AddmedicoComponent } from './parametros/addmedico/addmedico.component';
import { RepusuariosComponent } from './parametros/repusuarios/repusuarios.component';
import { AddcitasComponent } from './parametros/addcitas/addcitas.component';
import { RepcitasComponent } from './parametros/repcitas/repcitas.component';
import { ReppacientesComponent } from './parametros/reppacientes/reppacientes.component';
import { RepmedicosComponent } from './parametros/repmedicos/repmedicos.component';
import { DespachoComponent } from './parametros/despacho/despacho.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FilterPipe,
    NotImagePipe,
    UsuarioComponent,
    AddusuarioComponent,
    PacientesComponent,
    AddpacienteComponent,
    CitasComponent,
    MedicosComponent,
    AddmedicoComponent,
    RepusuariosComponent,
    AddcitasComponent,
    RepcitasComponent,
    ReppacientesComponent,
    RepmedicosComponent,
    DespachoComponent,
  ],
  imports: [
    CommonModule,
    TooltipModule,
    NgSelectModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class PagesModule {}

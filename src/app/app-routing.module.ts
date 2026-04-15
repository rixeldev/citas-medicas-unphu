import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { UsuarioComponent } from './pages/parametros/usuario/usuario.component';

import { AddusuarioComponent } from './pages/parametros/addusuario/addusuario.component';
import { PacientesComponent } from './pages/parametros/pacientes/pacientes.component';
import { AddpacienteComponent } from './pages/parametros/addpaciente/addpaciente.component';

import { CitasComponent } from './pages/parametros/citas/citas.component';

import { MedicosComponent } from './pages/parametros/medicos/medicos.component';
import { AddmedicoComponent } from './pages/parametros/addmedico/addmedico.component';
import { RepusuariosComponent } from './pages/parametros/repusuarios/repusuarios.component';
import { AddcitasComponent } from './pages/parametros/addcitas/addcitas.component';
import { RepcitasComponent } from './pages/parametros/repcitas/repcitas.component';
import { ReppacientesComponent } from './pages/parametros/reppacientes/reppacientes.component';
import { RepmedicosComponent } from './pages/parametros/repmedicos/repmedicos.component';
import { DespachoComponent } from './pages/parametros/despacho/despacho.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: NavbarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dash', component: DashboardComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'usuario/:id', component: AddusuarioComponent },
      { path: 'pacientes', component: PacientesComponent },
      { path: 'pacientes/:id', component: AddpacienteComponent },
      { path: 'medicos', component: MedicosComponent },
      { path: 'medicos/:id', component: AddmedicoComponent },
      { path: 'citas', component: CitasComponent },
      { path: 'citas/:id', component: AddcitasComponent },
      { path: 'despacho', component: DespachoComponent },
      { path: 'repusuario', component: RepusuariosComponent },
      { path: 'repcitas', component: RepcitasComponent },
      { path: 'reppacientes', component: ReppacientesComponent },
      { path: 'repmedicos', component: RepmedicosComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

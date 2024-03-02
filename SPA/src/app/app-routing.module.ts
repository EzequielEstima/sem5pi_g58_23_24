import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestaoCampusComponent } from './gestao-campus/gestao-campus.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestaoFrotaComponent } from './gestao-frota/gestao-frota.component';
import { GestaoPlaneamentoComponent } from './gestao-planeamento/gestao-planeamento.component';
import { ContaComponent } from './conta/conta.component';
import { CriarPisoComponent } from './gestao-campus/criar-piso/criar-piso.component';
import { CriarEdificioComponent } from './gestao-campus/criar-edificio/criar-edificio.component';
import { EditarEdificioComponent } from './gestao-campus/editar-edificio/editar-edificio.component';
import { ApagarEdificioComponent } from './gestao-campus/apagar-edificio/apagar-edificio.component';
import { CriarTipoRoboComponent } from './gestao-frota/criar-tipo-robo/criar-tipo-robo.component';
import { ApagarTipoRoboComponent } from './gestao-frota/apagar-tipo-robo/apagar-tipo-robo.component';
import { AdicionarDispositivoComponent } from './gestao-frota/adicionar-dispositivo/adicionar-dispositivo.component';
import { CriarElevadorComponent } from './gestao-campus/criar-elevador/criar-elevador.component';
import { EditarPisoComponent } from './gestao-campus/editar-piso/editar-piso.component';
import { CriarPassagemComponent } from './gestao-campus/criar-passagem/criar-passagem.component';
import { CriarSalaComponent } from './gestao-campus/criar-sala/criar-sala.component';
import { EditarPassagemComponent } from './gestao-campus/editar-passagem/editar-passagem.component';
import { ListarPisoComponent } from './gestao-campus/listar-piso/listar-piso.component';
import { Visualizacao3DComponent } from './visualizacao3-d/visualizacao3-d.component';
import { CarregarMapaComponent } from './gestao-campus/carregar-mapa/carregar-mapa.component';
import { ListarEdificiosComponent } from './gestao-campus/listar-edificios/listar-edificios.component';
import { EditarElevadorComponent } from './gestao-campus/editar-elevador/editar-elevador.component';
import { InibirDispositivoComponent } from './gestao-frota/inibir-dispositivo/inibi-dispositivo.component';
import { ListarDispositivosFrotaComponent } from './gestao-frota/listar-dispositivos-frota/listar-dispositivos-frota.component';
import { ListarEdificioMinMaxPisosComponent } from './gestao-campus/listar-edificio-min-max-pisos/listar-edificio-min-max-pisos.component';
import { ListarPisoPassagemComponent } from './gestao-campus/listar-piso-passagem/listar-piso-passagem.component';
import { ListarElevadorComponent } from './gestao-campus/listar-elevador/listar-elevador.component';
import { ListarPassagemPorEdificiosComponent } from './gestao-campus/listar-passagem-por-edificios/listar-passagem-por-edificios.component';
import { CaminhoEntreEdificiosComponent } from './gestao-planeamento/caminho-entre-edificios/caminho-entre-edificios.component';
import { ExportarDadosPessoaisComponent } from './conta/exportar-dados-pessoais/exportar-dados-pessoais.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { SignupComponent } from './administrador/signup/signup.component';
import { SignupUtenteComponent } from './signup-utente/signup-utente.component';
import { PoliticaPrivacidadeComponent } from './politica-privacidade/politica-privacidade.component';
import { ApproveOrRejectUtenteComponent } from './administrador/approve-or-reject-utente/approve-or-reject-utente.component';
import { LoginComponent } from './login/login.component';
import { AprovarTarefaComponent } from './gestao-planeamento/aprovar-tarefa/aprovar-tarefa.component';
import { CriarTarefaVigilanciaComponent } from './conta/criar-tarefa-vigilancia/criar-tarefa-vigilancia.component';
import { CriarTarefaPickUpDeliveryComponent } from './conta/criar-tarefa-pick-up-delivery/criar-tarefa-pick-up-delivery.component';
import { DeleteTarefaComponent } from './gestao-planeamento/delete-tarefa/delete-tarefa.component';
import { AlterarDadosUtenteComponent } from './conta/alterar-dados-utente/alterar-dados-utente.component';
import { DeleteUtenteComponent } from './conta/delete-utente/delete-utente.component';
import { ObterTarefaComponent } from './gestao-planeamento/obter-tarefa/obter-tarefa.component';
import { PlaneamentoTarefasComponent } from './gestao-planeamento/planeamento-tarefas/planeamento-tarefas.component';
import { ListarTarefasPendentesComponent } from './gestao-planeamento/listar-tarefas-pendentes/listar-tarefas-pendentes.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gestaoCampus', component: GestaoCampusComponent },
  { path: 'gestaoFrota', component: GestaoFrotaComponent},
  { path: 'gestaoPlaneamento', component: GestaoPlaneamentoComponent},
  { path: 'administrador', component: AdministradorComponent},
  { path: 'conta', component: ContaComponent},
  { path: 'registar', component: SignupComponent},
  { path: 'criarPiso', component: CriarPisoComponent},
  { path: 'criarEdificio', component: CriarEdificioComponent},
  { path: 'editarEdificio', component: EditarEdificioComponent},
  { path: 'apagarEdificio', component: ApagarEdificioComponent},
  { path: 'criarTipoRobo', component: CriarTipoRoboComponent},
  { path: 'apagarTipoRobo', component: ApagarTipoRoboComponent},
  { path: 'criarElevador', component: CriarElevadorComponent},
  { path: 'editarElevador', component: EditarElevadorComponent},
  { path: 'listarElevador', component: ListarElevadorComponent},
  { path: 'adicionarDispositivo', component: AdicionarDispositivoComponent},  
  { path: 'listarDispositivosFrota', component: ListarDispositivosFrotaComponent},  
  { path: 'editarPiso', component: EditarPisoComponent},
  { path: 'visualizacao3D', component: Visualizacao3DComponent},
  { path: 'visualizacao3D/:id', component: Visualizacao3DComponent},
  { path: 'criarPassagem', component: CriarPassagemComponent},
  { path: 'criarSala', component: CriarSalaComponent},
  { path: 'editarPassagem', component: EditarPassagemComponent},
  { path: 'carregarMapa', component: CarregarMapaComponent},
  { path: 'listarEdificios', component: ListarEdificiosComponent},
  { path: 'listarPiso', component : ListarPisoComponent},
  { path: 'inibirDispositivo', component: InibirDispositivoComponent},
  { path: 'listarEdificioMinMaxPisos', component: ListarEdificioMinMaxPisosComponent},
  { path: 'listarPisoPassagem', component: ListarPisoPassagemComponent},
  { path: 'listarPassagensPorEdificio', component: ListarPassagemPorEdificiosComponent},
  { path: 'caminhoEntreEdificios', component: CaminhoEntreEdificiosComponent},
  { path: 'exportarDadosPessoais', component: ExportarDadosPessoaisComponent},
  { path: 'signupUtente', component: SignupUtenteComponent},
  { path: 'politicaPrivacidade', component: PoliticaPrivacidadeComponent},
  { path: 'approveOrRejectUtente', component: ApproveOrRejectUtenteComponent},
  { path: 'login', component: LoginComponent},
  { path: 'aprovarTarefas', component: AprovarTarefaComponent},
  { path: 'listarTarefasPendentes', component: ListarTarefasPendentesComponent},
  { path: 'criarTarefaVigilancia', component: CriarTarefaVigilanciaComponent},
  { path: 'criarTarefaPickUpDelivery', component: CriarTarefaPickUpDeliveryComponent},
  { path: 'apagarTarefa', component: DeleteTarefaComponent},
  {path: 'alterarDadosUtente', component: AlterarDadosUtenteComponent},
  {path: 'deleteUtente', component: DeleteUtenteComponent},
  { path: 'obterTarefa', component: ObterTarefaComponent},
  { path: 'planeamentoTarefas', component: PlaneamentoTarefasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 

}

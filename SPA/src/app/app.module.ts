import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GestaoCampusComponent } from './gestao-campus/gestao-campus.component';
import { GestaoFrotaComponent } from './gestao-frota/gestao-frota.component';
import { GestaoPlaneamentoComponent } from './gestao-planeamento/gestao-planeamento.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './gestao-campus/sidebar/sidebar.component';
import { SidebarFrotaComponent } from './gestao-frota/sidebar-frota/sidebar-frota.component';
import { CriarPisoComponent } from './gestao-campus/criar-piso/criar-piso.component';
import { CriarEdificioComponent } from './gestao-campus/criar-edificio/criar-edificio.component';
import { EditarEdificioComponent } from './gestao-campus/editar-edificio/editar-edificio.component';
import { MessageComponent } from './message/message.component';
import { AdicionarDispositivoComponent } from './gestao-frota/adicionar-dispositivo/adicionar-dispositivo.component';
import { CriarTipoRoboComponent } from './gestao-frota/criar-tipo-robo/criar-tipo-robo.component';
import { CriarElevadorComponent } from './gestao-campus/criar-elevador/criar-elevador.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditarPisoComponent } from './gestao-campus/editar-piso/editar-piso.component';
import { Visualizacao3DComponent } from './visualizacao3-d/visualizacao3-d.component';
import { CriarPassagemComponent } from './gestao-campus/criar-passagem/criar-passagem.component';
import { CriarSalaComponent } from './gestao-campus/criar-sala/criar-sala.component';
import { EditarPassagemComponent } from './gestao-campus/editar-passagem/editar-passagem.component';
import { CarregarMapaComponent } from './gestao-campus/carregar-mapa/carregar-mapa.component';
import { ListarEdificiosComponent } from './gestao-campus/listar-edificios/listar-edificios.component';
import { TableModule } from 'primeng/table';
import { ListarPisoComponent } from './gestao-campus/listar-piso/listar-piso.component';
import { EditarElevadorComponent } from './gestao-campus/editar-elevador/editar-elevador.component';
import { InibirDispositivoComponent } from './gestao-frota/inibir-dispositivo/inibi-dispositivo.component';
import { ListarDispositivosFrotaComponent } from './gestao-frota/listar-dispositivos-frota/listar-dispositivos-frota.component';
import { ListarEdificioMinMaxPisosComponent } from './gestao-campus/listar-edificio-min-max-pisos/listar-edificio-min-max-pisos.component';
import { ListarPisoPassagemComponent } from './gestao-campus/listar-piso-passagem/listar-piso-passagem.component';
import { ListarElevadorComponent } from './gestao-campus/listar-elevador/listar-elevador.component';
import { ListarPassagemPorEdificiosComponent } from './gestao-campus/listar-passagem-por-edificios/listar-passagem-por-edificios.component';
import { ApagarEdificioComponent } from './gestao-campus/apagar-edificio/apagar-edificio.component';
import { ApagarTipoRoboComponent } from './gestao-frota/apagar-tipo-robo/apagar-tipo-robo.component';
import { SidebarGestaoPlaneamentoComponent } from './gestao-planeamento/sidebar-gestao-planeamento/sidebar-gestao-planeamento.component';
import { CaminhoEntreEdificiosComponent } from './gestao-planeamento/caminho-entre-edificios/caminho-entre-edificios.component';
import { ContaComponent } from './conta/conta.component';
import { SidebarContaComponent } from './conta/sidebar-conta/sidebar-conta.component';
import { ExportarDadosPessoaisComponent } from './conta/exportar-dados-pessoais/exportar-dados-pessoais.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { SignupComponent } from './administrador/signup/signup.component';
import { SidebarAdministradorComponent } from './administrador/sidebar/sidebar.component';
import { SignupUtenteComponent } from './signup-utente/signup-utente.component';
import { PoliticaPrivacidadeComponent } from './politica-privacidade/politica-privacidade.component';
import { ApproveOrRejectUtenteComponent } from './administrador/approve-or-reject-utente/approve-or-reject-utente.component';
import { LoginComponent } from './login/login.component';
import { AprovarTarefaComponent } from './gestao-planeamento/aprovar-tarefa/aprovar-tarefa.component';
import { CriarTarefaVigilanciaComponent } from './conta/criar-tarefa-vigilancia/criar-tarefa-vigilancia.component';
import { CriarTarefaPickUpDeliveryComponent } from './conta/criar-tarefa-pick-up-delivery/criar-tarefa-pick-up-delivery.component';
import { DeleteTarefaComponent } from './gestao-planeamento/delete-tarefa/delete-tarefa.component';
import { AlterarDadosUtenteComponent } from './conta/alterar-dados-utente/alterar-dados-utente.component';
import { AuthenticationInterceptor } from '../app/core/interceptor/interceptor';
import { DeleteUtenteComponent } from './conta/delete-utente/delete-utente.component';
import { ObterTarefaComponent } from './gestao-planeamento/obter-tarefa/obter-tarefa.component';
import { PlaneamentoTarefasComponent } from './gestao-planeamento/planeamento-tarefas/planeamento-tarefas.component';
import { ListarTarefasPendentesComponent } from './gestao-planeamento/listar-tarefas-pendentes/listar-tarefas-pendentes.component';


@NgModule({
  declarations: [
    AppComponent,
    GestaoCampusComponent,
    GestaoFrotaComponent,
    GestaoPlaneamentoComponent,
    AdministradorComponent,
    DashboardComponent,
    SidebarComponent,
    SidebarFrotaComponent,
    SidebarAdministradorComponent,
    CriarPisoComponent,
    CriarEdificioComponent,
    EditarEdificioComponent,
    MessageComponent,
    AdicionarDispositivoComponent,
    CriarTipoRoboComponent,
    MessageComponent,
    CriarElevadorComponent,
    EditarPisoComponent,
    Visualizacao3DComponent,
    CriarPassagemComponent,
    CriarSalaComponent,
    EditarPassagemComponent,
    CarregarMapaComponent,
    ListarEdificiosComponent,
    ListarPisoComponent,
    EditarElevadorComponent,
    InibirDispositivoComponent,
    ListarDispositivosFrotaComponent,
    ListarEdificioMinMaxPisosComponent,
    ListarPisoPassagemComponent,
    ListarElevadorComponent,
    ListarPassagemPorEdificiosComponent,
    ApagarEdificioComponent,
    ApagarTipoRoboComponent,
    SidebarGestaoPlaneamentoComponent,
    CaminhoEntreEdificiosComponent,
    ContaComponent,
    SidebarContaComponent,
    ExportarDadosPessoaisComponent,
    SignupComponent,
    SignupUtenteComponent,
    PoliticaPrivacidadeComponent,
    ApproveOrRejectUtenteComponent,
    LoginComponent,
    AprovarTarefaComponent,
    CriarTarefaVigilanciaComponent,
    CriarTarefaPickUpDeliveryComponent,
    DeleteTarefaComponent,
    AlterarDadosUtenteComponent,
    DeleteUtenteComponent,
    ObterTarefaComponent,
    PlaneamentoTarefasComponent,
    ListarTarefasPendentesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TableModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthenticationInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

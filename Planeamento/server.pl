% Import de Bibliotecas HTTP
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_server)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_open)).
:- use_module(library(http/http_cors)).
:- use_module(library(date)).
:- use_module(library(random)).

% Import de Bibliotecas JSON
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).

% Import do nosso módulo 

% Iniciar o servidor
iniciar_servidor(PORT) :-
    http_server(http_dispatch, [port(PORT)]).

% Manipulador para pedido de informação do mapa
:- http_handler('/carregarMapa', mapa_handler, []).

mapa_handler(Request) :-
        http_read_json_dict(Request,Dict,[]),
        process_mapa_json(Dict),
        reply_json('mapa carregado com sucesso').

process_mapa_json(Dict):- 
    retractall(pisos(_,_)),
    retractall(elevador(_,_)),
    retractall(coordElevador(_,_,_)),
    retractall(corredor(_,_,_,_)),
    retractall(coordCorredor(_,_,_,_,_,_,_,_,_,_)),
    retractall(salas(_,_)),
    retractall(coordPorta(_,_,_)),
    retractall(m(_,_,_,_)),
    retractall(dim_ed(_,_,_)),
    ListaPiso = Dict.pisos,
    ListaElev = Dict.elevadores,
    ListaCoordElev = Dict.coordElevadores,
    ListaCorr = Dict.corredores,
    ListaCoordCorr = Dict.coordCorredores,
    ListaSalas = Dict.salas,
    ListaCoordPortas = Dict.coordPortas,
    ListaMatrizMapa = Dict.listaMatrizMapa,
    ListaDimensoes = Dict.dimensoes,
    obter_dados(ListaPiso, ListaElev, ListaCoordElev, ListaCorr, ListaCoordCorr, ListaSalas, ListaCoordPortas, ListaMatrizMapa, ListaDimensoes).


% Manipulador para pedido de tempo entre tarefas
:- http_handler('/tarefa/tempo', tempo_handler, []).

tempo_handler(Request) :-
        http_read_json_dict(Request,Dict,[]),
        process_json(Dict, RobotResults),
        retractall(tempo(_,_,_,_)),
        retractall(tarefa(_,_,_,_,_,_,_)),
        Robot = RobotResults,
        Algoritmo = Dict.algoritmo,
        iterar_robots(Robot),
        escolher_algoritmo(Robot,Algoritmo,Resultado),
        with_output_to(atom(RobotResultsJ), write(RobotResults)),
        with_output_to(atom(ResultadoJ), write(Resultado)),
        R = json{'resultado': ResultadoJ},
        reply_json(R).

process_json(Dict, RobotResults) :-
    Robots = Dict.robot,
    processar_lista_aux(Robots, [], RobotResults).


processar_lista_aux([], Acc, Acc).
processar_lista_aux([H|T], Acc, Termos) :-
    converter_e_adicionar(H, Termo),
    processar_lista_aux(T, [Termo|Acc], Termos).

converter_e_adicionar(String, Termo) :-
    term_string(Termo, String).


% Manipulador para caminho entre pontos de um piso
:- http_handler('/caminho/pontos_piso', caminho_pontos_piso_handler, []).

caminho_pontos_piso_handler(Request) :-
    http_read_json_dict(Request,Dict,[]),
    retractall(pisos(_,_)),
    retractall(elevador(_,_)),
    retractall(coordElevador(_,_,_)),
    retractall(corredor(_,_,_,_)),
    retractall(coordCorredor(_,_,_,_,_,_,_,_,_,_)),
    retractall(salas(_,_)),
    retractall(coordPorta(_,_,_)),
    retractall(m(_,_,_,_)),
    retractall(dim_ed(_,_,_)),
    ListaPiso = Dict.pisos,
    ListaElev = Dict.elevadores,
    ListaCoordElev = Dict.coordElevadores,
    ListaCorr = Dict.corredores,
    ListaCoordCorr = Dict.coordCorredores,
    ListaSalas = Dict.salas,
    ListaCoordPortas = Dict.coordPortas,
    ListaMatrizMapa = Dict.listaMatrizMapa,
    ListaDimensoes = Dict.dimensoes,
    XOrig = Dict.x_origem,
    YOrig = Dict.y_origem,
    PisoOrig = Dict.piso_origem,
    XDest = Dict.x_destino,
    YDest = Dict.y_destino,
    PisoDest = Dict.piso_destino,
    atom_number(XOrig,XO),
    atom_number(YOrig,YO),
    atom_string(PO,PisoOrig),
    atom_number(XDest,XD),
    atom_number(YDest,YD),
    atom_string(PD,PisoDest),
    obter_dados(ListaPiso, ListaElev, ListaCoordElev, ListaCorr, ListaCoordCorr, ListaSalas, ListaCoordPortas, ListaMatrizMapa, ListaDimensoes),
    caminho_pontos_pisoSemDig(XO, YO, PO, XD, YD, PD, LEdCam,LLig,LCelCamPisos,Custo),
    with_output_to(atom(LEdCamJ), write(LEdCam)),
    with_output_to(atom(LLigJ), write(LLig)),
    with_output_to(atom(CustoJ), write(Custo)),
    with_output_to(atom(LCelCamPisosJ), write(LCelCamPisos)),

    R = json{'edificios':LEdCamJ, 'ligacoes': LLigJ, 'caminho': LCelCamPisosJ, 'custo': CustoJ},
    reply_json(R).


obter_dados(ListaPiso, ListaElev, ListaCoordElev, ListaCorr, ListaCoordCorr, ListaSalas, ListaCoordPortas, ListaMatrizMapa, ListaDimensoes) :-
    processar_lista(ListaPiso),
    processar_lista(ListaElev),
    processar_lista(ListaCoordElev),
    processar_lista(ListaCorr),
    processar_lista(ListaCoordCorr),
    processar_lista(ListaSalas),
    processar_lista(ListaCoordPortas),
    processar_lista(ListaMatrizMapa),
    processar_lista(ListaDimensoes).

processar_lista(Lista) :-
    maplist(converter_e_assertar, Lista).

converter_e_assertar(String) :-
    term_string(Termo, String),
    assertz(Termo). 
    




% ==================================================================================================
% ==================================================================================================
% ==================================================================================================
% ================================== Código Base ===================================================
% ==================================================================================================
% ==================================================================================================
% ==================================================================================================

:-dynamic ligacel/2.
:-dynamic pisos/2.
:-dynamic elevador/2.
:-dynamic coordElevador/3.
:-dynamic corredor/4.
:-dynamic coordCorredor/10.
:-dynamic salas/2.
:-dynamic coordPorta/3.
:-dynamic node/3.
:-dynamic edge/3.
:-dynamic edge/5.
:-dynamic m/3.
:-dynamic m/4.
:-dynamic dim_ed/3.
:-dynamic tempo/4.
:-dynamic tarefa/7.
% Dados que vão ser obtidos atraves do pedido da informação do mapa ao MDRI
% Lista de pisos de cada edifício
% pisos(IdEdificio,[IdPiso1,IdPiso2,IdPiso3])
%pisos(a,[a1]).
%pisos(b,[b1,b2,b3,b4]).
%pisos(g,[g2,g3,g4]).
%pisos(h,[h1,h2,h3,h4]).
%pisos(i,[i1,i2,i3,i4]).
%pisos(j,[j1,j2,j3,j4]).
%
%dim_ed(a,8,7).
% Lista pisos que um elevador de um edificio serve
% elevador(IdEdificio,[IdPiso1,IdPiso2,IdPiso3])
%elevador(b,[b1,b2,b3,b4]).
%elevador(g,[g2,g3,g4]).
%elevador(i,[i1,i2,i3,i4]).
%elevador(j,[j1,j2,j3,j4]).

% Coordenada dos elevadores
% coordElevador(IdEdificio,x,y)
%coordElevador(b,1,1).
%coordElevador(g,2,2).
%coordElevador(i,3,3).
%coordElevador(j,4,4).


% Corredores que ligam pisos de um edificio
% corredor(IdEdificio1,IdEdificio2,IdPiso1,IdPiso2)
%corredor(a,h,a1,h2).
%corredor(b,g,b2,g2).
%corredor(b,g,b3,g3).
%corredor(b,i,b3,i3).
%corredor(g,h,g2,h2).
%corredor(g,h,g3,h3).
%corredor(h,i,h2,i2).
%corredor(i,j,i1,j1).
%corredor(i,j,i2,j2).
%corredor(i,j,i3,j3).

% Coordenada dos corredores
% coordCorredor(IdPisoA,IdPisoB,xA1,yA1,xA2,yA2,xB1,yB1,xB2,yB2)
%coordCorredor(a1,h2,2,2,2,3,0,0,0,1).
%coordCorredor(j2,i2,3,1,3,2,1,1,1,2).
%coordCorredor(i3,b3,1,3,2,3,1,1,2,1).
%coordCorredor(g3,b3,1,1,2,1,1,3,2,3).

% Lista de salas de cada piso
% salas(IdPiso,[IdSala1,IdSala2,IdSala3])
%(...) Apenas salas no j2 e g4 para funcionar com o exemplo "caminho_pisos(j2,g4,LEdCam,LLig)"
%salas(a2,[a201]).
%salas(j2,[j201]).
%salas(g4,[g401,g402]).

% Coordenada das portas (ponto de acesso) das salas
%coordPorta(a201,5,5).
%coordPorta(j201,5,5).
%coordPorta(g401,6,6).
%coordPorta(g402,7,7).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Informação que vai ser gerada a partir do dados iniciais
liga(a,b).
liga(b,c).
liga(b,d).
liga(c,d).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%Parte 2 - caminho no piso
% Informação de um grafo para o A*

% node(id,X,Y)

% edge(idNode1,idNode2,custo)

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%Matriz dummy
%m(a1,1,1,1).
%m(a1,2,1,1).
%m(a1,3,1,1).
%m(a1,4,1,1).
%m(a1,5,1,1).
%m(a1,6,1,1).
%m(a1,7,1,1).
%m(a1,8,1,1).
%
%m(a1,1,2,0).
%m(a1,2,2,0).
%m(a1,3,2,0).
%m(a1,4,2,0).
%m(a1,5,2,0).
%m(a1,6,2,0).
%m(a1,7,2,0).
%m(a1,8,2,1).
%
%m(a1,1,3,0).
%m(a1,2,3,0).
%m(a1,3,3,0).
%m(a1,4,3,0).
%m(a1,5,3,0).
%m(a1,6,3,0).
%m(a1,7,3,0).
%m(a1,8,3,1).
%
%m(a1,1,4,0).
%m(a1,2,4,0).
%m(a1,3,4,0).
%m(a1,4,4,0).
%m(a1,5,4,0).
%m(a1,6,4,0).
%m(a1,7,4,0).
%m(a1,8,4,1).
%
%m(a1,1,5,1).
%m(a1,2,5,1).
%m(a1,3,5,1).
%m(a1,4,5,1).
%m(a1,5,5,0).
%m(a1,6,5,0).
%m(a1,7,5,0).
%m(a1,8,5,1).
%
%m(a1,1,6,1).
%m(a1,2,6,1).
%m(a1,3,6,1).
%m(a1,4,6,1).
%m(a1,5,6,0).
%m(a1,6,6,0).
%m(a1,7,6,0).
%m(a1,8,6,1).
%
%m(a1,1,7,1).
%m(a1,2,7,1).
%m(a1,3,7,1).
%m(a1,4,7,1).
%m(a1,5,7,0).
%m(a1,6,7,0).
%m(a1,7,7,0).
%m(a1,8,7,1).



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%% Parte 1 - Obter o caminho entre edificios %%%%%%%%%%%%%%%%%%%
% ?- caminho_edificios(j,a,LEdCam).
% LEdCam = [j, i, b, g, h, a] ;
% LEdCam = [j, i, h, a]
caminho_edificios(EdOr,EdDest,LEdCam):-
    caminho_edificios2(EdOr,EdDest,[EdOr],LEdCam).


caminho_edificios2(EdX,EdX,LEdInv,LEdCam):-
    !,
    reverse(LEdInv,LEdCam).

caminho_edificios2(EdAct,EdDest,LEdPassou,LEdCam):-
    (liga(EdAct,EdInt);liga(EdInt,EdAct)),
    \+member(EdInt,LEdPassou),
    caminho_edificios2(EdInt,EdDest,[EdInt|LEdPassou],LEdCam).




% c encontrar um caminho entre pisos de edificios usando corredores e
% elevadores 40%
%
% ?- caminho_pisos(j2,g4,LEdCam,LLig).
%(Exemplo de uma solução)
%LEdCam = [j, i, b, g],
% LLig = [cor(j2, i2), elev(i2, i3), cor(i3, b3), cor(b3, g3), elev(g3,g4)] ;
caminho_pisos(PisoOr,PisoDest,LEdCam,LLig):-
    pisos(EdOr,LPisosOr),
    member(PisoOr,LPisosOr),
    pisos(EdDest,LPisosDest),
    member(PisoDest,LPisosDest),
    caminho_edificios(EdOr,EdDest,LEdCam),
    segue_pisos(PisoOr,PisoDest,LEdCam,LLig).



segue_pisos(PisoDest,PisoDest,_,[]).

segue_pisos(PisoDest1,PisoDest,[EdDest],[elev(PisoDest1,PisoDest)]):-
    PisoDest\==PisoDest1,
    elevador(EdDest,LPisos),
    member(PisoDest1,LPisos), 
    member(PisoDest,LPisos).

segue_pisos(PisoAct,PisoDest,[EdAct,EdSeg|LOutrosEd],[cor(PisoAct,PisoSeg)|LOutrasLig]):-
    (corredor(EdAct,EdSeg,PisoAct,PisoSeg);corredor(EdSeg,EdAct,PisoSeg,PisoAct)),
    segue_pisos(PisoSeg,PisoDest,[EdSeg|LOutrosEd],LOutrasLig).

segue_pisos(PisoAct,PisoDest,[EdAct,EdSeg|LOutrosEd],[elev(PisoAct,PisoAct1),cor(PisoAct1,PisoSeg)|LOutrasLig]):-
    (corredor(EdAct,EdSeg,PisoAct1,PisoSeg);corredor(EdSeg,EdAct,PisoSeg,PisoAct1)),
    PisoAct1\==PisoAct,
    elevador(EdAct,LPisos),
    member(PisoAct,LPisos),
    member(PisoAct1,LPisos),
    segue_pisos(PisoSeg,PisoDest,[EdSeg|LOutrosEd],LOutrasLig).

% encontrar um caminho entre pontos de pisos usando o predicado caminho_pisos() já definido
% apenas pontos que correspondem a portas de salas, elevadores e corredores sáo válidos
% Solução esperada é do memso tipo da solução do predicado caminho_pisos(j2,g4,LEdCam,LLig) (linha 94 e 95)

caminho_pontos_piso(XOrig,YOrig,PisoOrig,XDest,YDest,PisoDest,LEdCam,LLig,LCelCamPisos,Custo):-
    caminho_pisos(PisoOrig,PisoDest,LEdCam,LLig),
    processar_LLig(LLig,LParPontoMid),
    append([cel1(PisoOrig,XOrig,YOrig)],LParPontoMid,LParPonto),
    append(LParPonto,[cel1(PisoDest,XDest,YDest)],LCelCam),
    processar_LCelCam(LCelCam,LCelCamPisos1),
    cam_lista_pisos(LCelCamPisos1,LCelCamPisos,Custo).

caminho_pontos_pisoSemDig(XOrig,YOrig,PisoOrig,XDest,YDest,PisoDest,LEdCam,LLig,LCelCamPisos,Custo):-
    caminho_pisos(PisoOrig,PisoDest,LEdCam,LLig),
    processar_LLig(LLig,LParPontoMid),
    append([cel1(PisoOrig,XOrig,YOrig)],LParPontoMid,LParPonto),
    append(LParPonto,[cel1(PisoDest,XDest,YDest)],LCelCam),
    processar_LCelCam(LCelCam,LCelCamPisos1),
    cam_lista_pisosSemDig(LCelCamPisos1,LCelCamPisos,Custo).


processar_LLig([],[]).
%Troca da X e Y para as informações estarem de acordo com o mapa
processar_LLig([cor(Piso1,Piso2)|LLig],[cel1(Piso1,Y1,X1),cel1(Piso2,Y2,X2)|LCelCam]):- 
    (coordCorredor(Piso1,Piso2,X1,Y1,_,_,X2,Y2,_,_);coordCorredor(Piso2,Piso1,X2,Y2,_,_,X1,Y1,_,_)),
    processar_LLig(LLig,LCelCam).

%Troca da X e Y para as informações estarem de acordo com o mapa
processar_LLig([elev(Piso1,Piso2)|LLig],[cel1(Piso1,X,Y),cel1(Piso2,X,Y)|LCelCam]):-
    elevador(Ed,LEd),
    member(Piso1, LEd),
    coordElevador(Ed,Y,X),
    processar_LLig(LLig,LCelCam).

processar_LCelCam([],[]).
processar_LCelCam([cel1(Piso,X1,Y1),cel1(Piso,X2,Y2)|Rl],[cam(Piso,X1,Y1,X2,Y2)|RLCelCamPisos]):-
    processar_LCelCam(Rl,RLCelCamPisos).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%% Gerar m(X,Y,Z) para um piso %%%%%%%%%%%%%%%%%%%%

criar_matriz_piso(Piso):-
    findall(m(X,Y,Z),m(Piso,X,Y,Z),Res),
    criar_matriz_piso1(Res).

criar_matriz_piso1([]).
criar_matriz_piso1([m(X,Y,Z)|RL]):-
    assertz(m(X,Y,Z)),
    criar_matriz_piso1(RL).

%%%%%%%%%%%%%%%%%%%% Eliminar m(X,Y,Z) atuais %%%%%%%%%%%%%%%%%%%%

eliminar_matriz_piso():-
    retractall(m(_,_,_)).

%%%%%%%%%%%%%%%%%%%% Criar grafo - ligacel %%%%%%%%%%%%%%%%%%%%
cria_grafo(_,0):-!.
cria_grafo(Col,Lin):-cria_grafo_lin(Col,Lin),Lin1 is Lin-1,cria_grafo(Col,Lin1).

cria_grafo_lin(0,_):-!.
cria_grafo_lin(Col,Lin):-m(Col,Lin,0),!,ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1, % Se não for parede ve os nodes á volta
    ((m(ColS,Lin,0),assertz(ligacel(cel(Col,Lin),cel(ColS,Lin)));true)),
    ((m(ColA,Lin,0),assertz(ligacel(cel(Col,Lin), cel(ColA,Lin)));true)),
    ((m(Col,LinS,0),assertz(ligacel(cel(Col,Lin), cel(Col,LinS)));true)),
    ((m(Col,LinA,0),assertz(ligacel(cel(Col,Lin), cel(Col,LinA)));true)),
    ((m(ColA,LinA,0),assertz(ligacel(cel(Col,Lin), cel(ColA,LinA)));true)),
    ((m(ColS,LinS,0),assertz(ligacel(cel(Col,Lin), cel(ColS,LinS)));true)),
    ((m(ColA,LinS,0),assertz(ligacel(cel(Col,Lin), cel(ColA,LinS)));true)),
    ((m(ColS,LinA,0),assertz(ligacel(cel(Col,Lin), cel(ColS,LinA)));true)),
    Col1 is Col-1,
    cria_grafo_lin(Col1,Lin).
cria_grafo_lin(Col,Lin):-Col1 is Col-1,cria_grafo_lin(Col1,Lin). %% Se o ponto for parede dá skip

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%% Criar grafo - A* %%%%%%%%%%%%%%%%%%%%

%%%% Criar nodes %%%%
criar_nodes():-
    findall(m(X,Y,0),m(X,Y,0),Res),
    criar_nodes1(Res,0).

criar_nodes1([],_).
criar_nodes1([m(X,Y,0)|RL],Id):-
    Id1 is Id+1,
    assertz(node(Id1,X,Y)),
    criar_nodes1(RL,Id1).

%%%% Criar edges auxiliares %%%%

cria_edges_Aux(_,0):-!.
cria_edges_Aux(Col,Lin):-cria_grafo_lin1(Col,Lin),Lin1 is Lin-1,cria_edges_Aux(Col,Lin1).

cria_grafo_lin1(0,_):-!.
cria_grafo_lin1(Col,Lin):-m(Col,Lin,0),!,ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1, % Se não for parede ve os nodes á volta
    ((m(ColS,Lin,0),assertz(edge(Col,Lin,ColS,Lin,1));true)),
    ((m(ColA,Lin,0),assertz(edge(Col,Lin,ColA,Lin,1));true)),
    ((m(Col,LinS,0),assertz(edge(Col,Lin,Col,LinS,1));true)),
    ((m(Col,LinA,0),assertz(edge(Col,Lin,Col,LinA,1));true)),
    ((m(ColA,LinA,0),assertz(edge(Col,Lin,ColA,LinA,sqrt(2)));true)),
    ((m(ColS,LinS,0),assertz(edge(Col,Lin,ColS,LinS,sqrt(2)));true)),
    ((m(ColA,LinS,0),assertz(edge(Col,Lin,ColA,LinS,sqrt(2)));true)),
    ((m(ColS,LinA,0),assertz(edge(Col,Lin,ColS,LinA,sqrt(2)));true)),
    Col1 is Col-1,
    cria_grafo_lin1(Col1,Lin).
cria_grafo_lin1(Col,Lin):-Col1 is Col-1,cria_grafo_lin1(Col1,Lin). %% Se o ponto for parede dá skip



cria_edges_AuxSemDig(_,0):-!.
cria_edges_AuxSemDig(Col,Lin):-cria_grafo_lin_SemDig(Col,Lin),Lin1 is Lin-1,cria_edges_AuxSemDig(Col,Lin1).

cria_grafo_lin_SemDig(0,_):-!.
cria_grafo_lin_SemDig(Col,Lin):-m(Col,Lin,0),!,ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1, % Se não for parede ve os nodes á volta
    ((m(ColS,Lin,0),assertz(edge(Col,Lin,ColS,Lin,1));true)),
    ((m(ColA,Lin,0),assertz(edge(Col,Lin,ColA,Lin,1));true)),
    ((m(Col,LinS,0),assertz(edge(Col,Lin,Col,LinS,1));true)),
    ((m(Col,LinA,0),assertz(edge(Col,Lin,Col,LinA,1));true)),
%    ((m(ColA,LinA,0),assertz(edge(Col,Lin,ColA,LinA,sqrt(2)));true)),
%    ((m(ColS,LinS,0),assertz(edge(Col,Lin,ColS,LinS,sqrt(2)));true)),
%    ((m(ColA,LinS,0),assertz(edge(Col,Lin,ColA,LinS,sqrt(2)));true)),
%    ((m(ColS,LinA,0),assertz(edge(Col,Lin,ColS,LinA,sqrt(2)));true)),
    Col1 is Col-1,
    cria_grafo_lin_SemDig(Col1,Lin).
cria_grafo_lin_SemDig(Col,Lin):-Col1 is Col-1,cria_grafo_lin_SemDig(Col1,Lin). %% Se o ponto for parede dá skip

%%%% Criar edges %%%%

criar_edges_Astar():-
    findall(edge(Col,Lin,ColS,LinS,Custo),edge(Col,Lin,ColS,LinS,Custo),Res),
    criar_edges1(Res).

criar_edges1([]).
criar_edges1([edge(Col,Lin,ColS,LinS,Custo)|RL]):-
    node(Id1,Col,Lin),
    node(Id2,ColS,LinS),
    assertz(edge(Id1,Id2,Custo)),
    criar_edges1(RL).

%%%% Criar grafo (reunião dos métodos acima)%%%%

criar_grafo_Astar(X,Y):-
    criar_nodes(),
    cria_edges_Aux(X,Y),
    criar_edges_Astar(),
    retractall(edge(_,_,_,_,_)).


criar_grafo_AstarSemDig(X,Y):-
    criar_nodes(),
    cria_edges_AuxSemDig(X,Y),
    criar_edges_Astar(),
    retractall(edge(_,_,_,_,_)).    

%%%% Eliminar grafo ()%%%%

eliminar_grafo_Astar():-
    retractall(node(_,_,_)),
    retractall(edge(_,_,_)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

dim_piso(Piso,Col,Lin):-
    pisos(Ed,LPisos),
    member(Piso,LPisos),
    dim_ed(Ed,Col,Lin),
    !.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

cam_lista_pisos([],[],0).
cam_lista_pisos([cam(Piso,X1,Y1,X2,Y2)|RL],CamCel,Custo):-
    cam_piso(Piso,X1,Y1,X2,Y2,CamCel1,Custo1),
    cam_lista_pisos(RL,CamCel2,Custo2),
    append(CamCel1,CamCel2,CamCel),
    Custo is Custo1+Custo2.

cam_lista_pisosSemDig([],[],0).
cam_lista_pisosSemDig([cam(Piso,X1,Y1,X2,Y2)|RL],CamCel,Custo):-
    cam_pisoSemDig(Piso,X1,Y1,X2,Y2,CamCel1,Custo1),
    cam_lista_pisosSemDig(RL,CamCel2,Custo2),
    append(CamCel1,CamCel2,CamCel),
    Custo is Custo1+Custo2.




%%%%% Determina o caminho entre (X1,Y1) e (X2,Y2) no piso Piso e coloca uma lista de celPiso(Piso,X,Y) no CamCel%%%%%

cam_piso(Piso,X1,Y1,X2,Y2,CamCel,Custo):-
    dim_piso(Piso,Col,Lin),
    criar_matriz_piso(Piso),
    criar_grafo_Astar(Col,Lin),
    node(Id1,X1,Y1),
    node(Id2,X2,Y2),
    aStar(Id1,Id2,CamIdNodes,Custo),
    nodes_to_coords(Piso,CamIdNodes,CamCel),
    eliminar_grafo_Astar(),
    eliminar_matriz_piso().

cam_pisoSemDig(Piso,X1,Y1,X2,Y2,CamCel,Custo):-
    dim_piso(Piso,Col,Lin),
    criar_matriz_piso(Piso),
    criar_grafo_AstarSemDig(Col,Lin),
    node(Id1,X1,Y1),
    node(Id2,X2,Y2),
    aStar(Id1,Id2,CamIdNodes,Custo),
    nodes_to_coords(Piso,CamIdNodes,CamCel),
    eliminar_grafo_Astar(),
    eliminar_matriz_piso().

nodes_to_coords(_,[],[]).
nodes_to_coords(Piso,[Id|RL],CamCel):-
    node(Id,X,Y),
    nodes_to_coords(Piso,RL,CamCel1),
    append([celPiso(Piso,X,Y)],CamCel1,CamCel).



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Algoritmo A* para encontrar o caminho entre dois pontos de um piso

aStar(Orig,Dest,Cam,Custo):-
    aStar2(Dest,[(_,0,[Orig])],Cam,Custo).

aStar2(Dest,[(_,Custo,[Dest|T])|_],Cam,Custo):-
	reverse([Dest|T],Cam).

aStar2(Dest,[(_,Ca,LA)|Outros],Cam,Custo):-
	LA=[Act|_],
	findall((CEX,CaX,[X|LA]),
		(Dest\==Act,(edge(Act,X,CustoX);edge(X,Act,CustoX)),\+ member(X,LA),
		CaX is CustoX + Ca, estimativa(X,Dest,EstX),
		CEX is CaX +EstX),Novos),
	append(Outros,Novos,Todos),
	sort(Todos,TodosOrd),
	aStar2(Dest,TodosOrd,Cam,Custo).

% heuristica é a distância euclidiana entre dois pontos
estimativa(Nodo1,Nodo2,Estimativa):-
	node(Nodo1,X1,Y1),
	node(Nodo2,X2,Y2),
	Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Algoritmo dfs
dfs(Orig,Dest,Path):-
    dfs2(Orig,Dest,[Orig],Path).

dfs2(Dest,Dest,LA,Path):-
    reverse(LA,Path).

dfs2(Act,Dest,LA,Path):-
    ligacel(Act,X),
    \+ member(X,LA),
    dfs2(X,Dest,[X|LA],Path).

all_dfs(Orig,Dest,LPath):-
    findall(Path,dfs(Orig,Dest,Path),LPath).

better_dfs(Orig,Dest,Path):-
    all_dfs(Orig,Dest,LPath),
    shortlist(LPath,Path,_).

shortlist([L],L,N):-
    !,
    length(L,N).

shortlist([L|LL],Lm,Nm):-
    shortlist(LL,Lm1,Nm1),
    length(L,NL),
    ((NL<Nm1,!,Lm=L,Nm is NL);
        (Lm=Lm1,Nm is Nm1)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

bfs(Orig,Dest,Path):-
    bfs2(Dest,[[Orig]],Path).

bfs2(Dest,[[Dest|T]|_],Path):-
    reverse([Dest|T],Path).

bfs2(Dest,[LA|Outros],Path):-
    LA=[Act|_],
    findall([X|LA],
        (Dest\==Act,ligacel(Act,X),\+ member(X,LA)),
        Novos),
    append(Outros,Novos,Todos),
    bfs2(Dest,Todos,Path).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Algoritmo de calculo de tempo entre tarefas

tarefa_caminho_tempo(X1, Y1, PisoInicio1, X2, Y2, PisoFim1, X3, Y3, PisoInicio2, X4, Y4, PisoFim2,
               CustoTotal1, CustoTotal2) :- 

    % Custo do fim de T1 para o início de T2
    caminho_pontos_piso(X2, Y2, PisoFim1, X3, Y3, PisoInicio2, _, LLig1, _, Custo1),
    calcula_tempo_adicional(LLig1, TempoAdicional1),
    CustoTotal1 is Custo1 + TempoAdicional1,

    % Custo do fim de T2 para o início de T1
    caminho_pontos_piso(X4, Y4, PisoFim2, X1, Y1, PisoInicio1, _, LLig2, _, Custo2),
    calcula_tempo_adicional(LLig2, TempoAdicional2),
    CustoTotal2 is Custo2 + TempoAdicional2.

% Função auxiliar para calcular o tempo adicional com base em LLig
calcula_tempo_adicional(LLig, TempoAdicional) :-
    findall(Tipo, member(Tipo, LLig), Tipos),
    conta_tempo(Tipos, 0, TempoAdicional).

% Conta o tempo adicional com base nos tipos de ligação
conta_tempo([], Tempo, Tempo).
conta_tempo([elev(_, _)|T], TempoAcum, TempoTotal) :-
    NovoTempo is TempoAcum + 10,
    conta_tempo(T, NovoTempo, TempoTotal).
conta_tempo([cor(_, _)|T], TempoAcum, TempoTotal) :-
    NovoTempo is TempoAcum + 5,
    conta_tempo(T, NovoTempo, TempoTotal).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Predicado para processar todas as combinações de pares de tarefas
processar_tarefas(ListaTarefas, Resultados) :-
    findall(Res, combinar_tarefas(ListaTarefas, Res), ResultadosTemp),
    append(ResultadosTemp, Resultados).

% Combina as tarefas da lista, chamando tarefa_caminho_tempo para cada par.
combinar_tarefas([], []).
combinar_tarefas([Tarefa|Tarefas], Res) :-
    combinar_com_resto(Tarefa, Tarefas, ResParciais),
    combinar_tarefas(Tarefas, ResResto),
    append(ResParciais, ResResto, Res).

% Chama tarefa_caminho_tempo para a tarefa atual com cada uma das outras tarefas da lista.
combinar_com_resto(_, [], []).
combinar_com_resto(Tarefa1, [Tarefa2|Tarefas], [ResParcial|ResResto]) :-
    Tarefa1 = tarefa(Nome1, X1, Y1, PisoInicio1, X2, Y2, PisoFim1),
    Tarefa2 = tarefa(Nome2, X3, Y3, PisoInicio2, X4, Y4, PisoFim2),
    tarefa_caminho_tempo(X1, Y1, PisoInicio1, X2, Y2, PisoFim1, X3, Y3, PisoInicio2, X4, Y4, PisoFim2, Custo1, Custo2),
    ResParcial = tempos(Nome1, Nome2, Custo1, Nome2, Nome1, Custo2),
    combinar_com_resto(Tarefa1, Tarefas, ResResto).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Predicado para processar a lista de resultados e fazer assert para cada tempos
processar_e_assert_resultados([],_).
processar_e_assert_resultados([tempos(Tarefa1, Tarefa2, Custo1, Tarefa2Reverso, Tarefa1Reverso, Custo2)|Resto],Nome) :-
    assertz(tempo(Nome,Tarefa1, Tarefa2, Custo1)),
    assertz(tempo(Nome,Tarefa2Reverso, Tarefa1Reverso, Custo2)),
    processar_e_assert_resultados(Resto,Nome).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

processar_tarefas_e_assert(ListaTarefas,Nome) :-
    assertar_tarefas(ListaTarefas),
    processar_tarefas(ListaTarefas, Resultados),
    processar_e_assert_resultados(Resultados,Nome).

assertar_tarefas([]).
assertar_tarefas([tarefa(Nome,A,B,C,D,E,F)|Resto]) :-
    assertz(tarefa(Nome,A,B,C,D,E,F)),
    assertar_tarefas(Resto).

iterar_robots([]).
iterar_robots([robot(Nome, ListaTarefas) | RestoRobots]) :-
    processar_tarefas_e_assert(ListaTarefas,Nome),
    iterar_robots(RestoRobots).

% ==================================================================================================    
% =================================Algoritmo Permutações============================================
% ==================================================================================================

melhor_sequencia(Tarefas, MelhorSequencia) :-
    findall(Sequencia, permutation(Tarefas, Sequencia), Sequencias),
    avaliar_sequencias(Sequencias, MelhorSequencia, _).

avaliar_sequencias([], [], inf).
avaliar_sequencias([Sequencia], Sequencia, TempoSequencia) :- 
    avalia1(Sequencia, TempoSequencia), !.
avaliar_sequencias([Sequencia|RestoSequencias], MelhorSequencia, MelhorTempoSequencia) :-
    avalia1(Sequencia, TempoSequencia),
    avaliar_sequencias(RestoSequencias, TempMelhorSequencia, TempMelhorTempo),
    (   TempMelhorTempo == inf 
    ->  MelhorSequencia = Sequencia, MelhorTempoSequencia = TempoSequencia
    ;   TempoSequencia < TempMelhorTempo 
    ->  MelhorSequencia = Sequencia, MelhorTempoSequencia = TempoSequencia
    ;   MelhorSequencia = TempMelhorSequencia, MelhorTempoSequencia = TempMelhorTempo
    ).

avalia1([_],0).
avalia1([Tarefa1,Tarefa2|Resto], TempoIndividuo):-
    avalia1([Tarefa2|Resto], TempoResto),
    Tarefa1 = tarefa(Nome1,_,_,_,_,_,_),
    Tarefa2 = tarefa(Nome2,_,_,_,_,_,_),
    tempo(_,Nome1,Nome2,Custo), % Ensure tempo/4 is correctly defined and instantiates Custo.
    TempoIndividuo is TempoResto + Custo.


% ==================================================================================================
% =================================Algoritmo Genético===============================================
% ==================================================================================================

genetico_lista_robots([],[]).

genetico_lista_robots([robot(Nome, ListaTarefas) | RestoRobots], [robot(Nome, ListaTarefasFinal) | RestoRobotsFinal]) :-
    length(ListaTarefas, NumTarefas),
    NumTarefas > 2,
    !,
    genetico(ListaTarefas, ListaTarefasFinal),
    genetico_lista_robots(RestoRobots, RestoRobotsFinal).


%Utiliza a função do david 

genetico_lista_robots([robot(Nome, ListaTarefas) | RestoRobots], [robot(Nome, ListaTarefasFinal) | RestoRobotsFinal]) :-
    melhor_sequencia(ListaTarefas, ListaTarefasFinal),
    genetico_lista_robots(RestoRobots, RestoRobotsFinal).

% ==================================================================================================


genetico(ListaTarefas,Resultado):-
    criar_lista_tarefas(ListaTarefas,ListaTarefasFinal),
    gera(ListaTarefasFinal,ResultadoSemInformacao),
    obter_tarefas_com_informacao(ResultadoSemInformacao,Resultado).

obter_tarefas_com_informacao([], []).

obter_tarefas_com_informacao([NomeTarefa | Resto], [tarefa(NomeTarefa,A,B,C,D,E,F) | TarefasComInformacao]) :-
    tarefa(NomeTarefa,A,B,C,D,E,F),
    obter_tarefas_com_informacao(Resto, TarefasComInformacao).

criar_lista_tarefas([],[]).
criar_lista_tarefas([tarefa(Nome,_,_,_,_,_,_)|RestoLista],ListaTarefasFinal):-
    criar_lista_tarefas(RestoLista,ListaTarefasFinal1),
    append([Nome],ListaTarefasFinal1,ListaTarefasFinal).

inicializa(ListaTarefas):-
    NG is 10, % Número de gerações
    DP is 6, % Dimensão da população
    PC is 0.8, % Probabilidade de cruzamento
    PM is 0.8, % Probabilidade de mutação
    PTA is 0.4, % Percentagem do tempo atual
    (retract(geracoes(_));true), assertz(geracoes(NG)),
	(retract(populacao(_));true), assertz(populacao(DP)),
	(retract(prob_cruzamento(_));true), assertz(prob_cruzamento(PC)),
	(retract(prob_mutacao(_));true), assertz(prob_mutacao(PM)),
    length(ListaTarefas,NumT),
    avalia(ListaTarefas,Tempo),
    TempoAlvo is Tempo * PTA,
    (retract(tempo_alvo(_));true), assertz(tempo_alvo(TempoAlvo)),
    (retract(tarefas(_));true), assertz(tarefas(NumT)).

gera(ListaTarefas,Resultado):-
	inicializa(ListaTarefas),
	gera_populacao(Pop, ListaTarefas),
	avalia_populacao(Pop,PopAv),
	ordena_populacao(PopAv,PopOrd),
	geracoes(NG),
	gera_geracao(0,NG,PopOrd,Resultado).

gera_populacao(Pop,ListaTarefas):-
	populacao(TamPop),
	tarefas(NumT),
	gera_populacao(TamPop,ListaTarefas,NumT,Pop).

gera_populacao(0,_,_,[]):-!.

gera_populacao(TamPop,ListaTarefas,NumT,[Ind|Resto]):-
	TamPop1 is TamPop-1,
	gera_populacao(TamPop1,ListaTarefas,NumT,Resto),
	gera_individuo(ListaTarefas,NumT,Ind),
	not(member(Ind,Resto)).
gera_populacao(TamPop,ListaTarefas,NumT,L):-
	gera_populacao(TamPop,ListaTarefas,NumT,L).

gera_individuo([G],1,[G]):-!.

gera_individuo(ListaTarefas,NumT,[G|Resto]):-
	NumTemp is NumT + 1, % To use with random
	random(1,NumTemp,N),
	retira(N,ListaTarefas,G,NovaLista),
	NumT1 is NumT-1,
	gera_individuo(NovaLista,NumT1,Resto).

retira(1,[G|Resto],G,Resto).
retira(N,[G1|Resto],G,[G1|Resto1]):-
	N1 is N-1,
	retira(N1,Resto,G,Resto1).

avalia_populacao([],[]).
avalia_populacao([Ind|Resto],[Ind*V|Resto1]):-
	avalia(Ind,V),
	avalia_populacao(Resto,Resto1).

avalia([_],0).

avalia([Tarefa1,Tarefa2|Resto], TempoIndividuo):-
    avalia([Tarefa2|Resto], TempoResto),
    tempo(_,Tarefa1,Tarefa2,Custo),
    TempoIndividuo is TempoResto + Custo.


ordena_populacao(PopAv,PopAvOrd):-
	bsort(PopAv,PopAvOrd).

bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
	bsort(Xs,Zs),
	btroca([X|Zs],Ys).


btroca([X],[X]):-!.

btroca([X*VX,Y*VY|L1],[Y*VY|L2]):-
	VX>VY,!,
	btroca([X*VX|L1],L2).

btroca([X|L1],[X|L2]):-btroca(L1,L2).

%Caso de paragem chegou ao fim das gerações
gera_geracao(G,G,Pop, ResultadoFinal):-!,
    [ResultadoFinal*_ | _] = Pop.
%Caso de paragem chegou a uma solução com tempo inferior a algo
gera_geracao(_,_,Pop, ResultadoFinal):- 
    [ResultadoFinal*Tempo | _] = Pop,
    tempo_alvo(TempoAlvo),
    Tempo =< TempoAlvo.
%Geração Propriamente dita
gera_geracao(N,G,Pop, ResultadoFinal):-
	cruzamento(Pop,NPop1), %Faz cruzamento
	mutacao(NPop1,NPop), %Faz mutação
	avalia_populacao(NPop,NPopAv), %Avalia a nova população com tempos
    append(Pop,NPopAv,NAPopAv), %Junta a população antiga com a nova avaliada
	ordena_populacao(NAPopAv,NAPopOrd), % Ordena por ordem crescente
    dividir_x_primeiros(2,NAPopOrd,PopMelhores, PopResto), %Obtém os 2 melhores dos pais e dos filhos e os restantes separados
    populacao(TamPop),
    QuantPiores is TamPop - 2,
    escolher_entre_piores(QuantPiores,PopResto,ListaNaoElitista), % Escolhe entre os piores o resto da geração de uma maneira não elitista
    append(PopMelhores,ListaNaoElitista,PopNova), % Junta os melhores aos não elitistaas
    ordena_populacao(PopNova,PopFinalOrd), % Ordena-os Produzindo assim o resultado da geração
	N1 is N+1,
	gera_geracao(N1,G,PopFinalOrd, ResultadoFinal). % Volta a chamar uma nova geração
    
dividir_x_primeiros(0, Resto, [], Resto) :- !.

dividir_x_primeiros(X, [Melhor | Resto], ListaMelhores, RestoLista) :-
    X > 0,
    X1 is X - 1,
    dividir_x_primeiros(X1, Resto, RestoMelhores, RestoLista),
    ListaMelhores = [Melhor | RestoMelhores].

escolher_entre_piores(NumElementos, ListaPiores, Resultado):-
    calcular_produto_aleatorio_lista(ListaPiores, ListaPioresComProdutos),
    sort_por_produtos(ListaPioresComProdutos, ListaComProdutosOrdenada),
    obter_x_primeiros_s_produto(NumElementos,ListaComProdutosOrdenada, Resultado).

calcular_produto_aleatorio_lista([], []).

calcular_produto_aleatorio_lista([Elemento*Tempo|Resto], [Elemento*Tempo*Produto|RestoComProdutos]):-
    random(0.0, 1.0, Random),
    Produto is Tempo * Random,
    calcular_produto_aleatorio_lista(Resto, RestoComProdutos).

sort_por_produtos(ListaComProdutos, ListaComProdutosOrdenada):-
    bsortProduto(ListaComProdutos, ListaComProdutosOrdenada).

bsortProduto([X],[X]):-!.
bsortProduto([X|Xs],Ys):-
	bsortProduto(Xs,Zs),
	btrocaProduto([X|Zs],Ys).


btrocaProduto([X],[X]):-!.

btrocaProduto([X*VX*AX,Y*VY*AY|L1],[Y*VY*AY|L2]):-
	AX>AY,!,
	btrocaProduto([X*VX*AX|L1],L2).

btrocaProduto([X|L1],[X|L2]):-btrocaProduto(L1,L2).

obter_x_primeiros_s_produto(0, _, []) :- !.

obter_x_primeiros_s_produto(X, [Tarefa*Tempo*_ | Resto], Melhores) :-
    X > 0,
    X1 is X - 1,
    obter_x_primeiros_s_produto(X1, Resto, RestantesMelhores),
    Melhores = [Tarefa*Tempo | RestantesMelhores].

gerar_pontos_cruzamento(P1,P2):-
	gerar_pontos_cruzamento1(P1,P2).

gerar_pontos_cruzamento1(P1,P2):-
	tarefas(N),
	NTemp is N+1,
	random(1,NTemp,P11),
	random(1,NTemp,P21),
	P11\==P21,!,
	((P11<P21,!,P1=P11,P2=P21);(P1=P21,P2=P11)).
gerar_pontos_cruzamento1(P1,P2):-
	gerar_pontos_cruzamento1(P1,P2).

cruzamento(Lista,ListaNova):-
    random_permutation(Lista,ListaAleatoria), % Faz com que não sejam sempre os pares de tarefas por ordem crescente de valor a serem cruzados
    cruzamento1(ListaAleatoria,ListaNova).

cruzamento1([],[]).
cruzamento1([Ind*_],[Ind]).
cruzamento1([Ind1*_,Ind2*_|Resto],[NInd1,NInd2|Resto1]):-
	gerar_pontos_cruzamento(P1,P2),
	prob_cruzamento(Pcruz),random(0.0,1.0,Pc),
	((Pc =< Pcruz,!,
        cruzar(Ind1,Ind2,P1,P2,NInd1),
	  cruzar(Ind2,Ind1,P1,P2,NInd2))
	;
	(NInd1=Ind1,NInd2=Ind2)),
	cruzamento1(Resto,Resto1).

preencheh([],[]).

preencheh([_|R1],[h|R2]):-
	preencheh(R1,R2).


sublista(L1,I1,I2,L):-
	I1 < I2,!,
	sublista1(L1,I1,I2,L).

sublista(L1,I1,I2,L):-
	sublista1(L1,I2,I1,L).

sublista1([X|R1],1,1,[X|H]):-!,
	preencheh(R1,H).

sublista1([X|R1],1,N2,[X|R2]):-!,
	N3 is N2 - 1,
	sublista1(R1,1,N3,R2).

sublista1([_|R1],N1,N2,[h|R2]):-
	N3 is N1 - 1,
	N4 is N2 - 1,
	sublista1(R1,N3,N4,R2).

rotate_right(L,K,L1):-
	tarefas(N),
	T is N - K,
	rr(T,L,L1).

rr(0,L,L):-!.

rr(N,[X|R],R2):-
	N1 is N - 1,
	append(R,[X],R1),
	rr(N1,R1,R2).


elimina([],_,[]):-!.

elimina([X|R1],L,[X|R2]):-
	not(member(X,L)),!,
	elimina(R1,L,R2).

elimina([_|R1],L,R2):-
	elimina(R1,L,R2).

insere([],L,_,L):-!.
insere([X|R],L,N,L2):-
	tarefas(T),
	((N>T,!,N1 is N mod T);N1 = N),
	insere1(X,N1,L,L1),
	N2 is N + 1,
	insere(R,L1,N2,L2).


insere1(X,1,L,[X|L]):-!.
insere1(X,N,[Y|L],[Y|L1]):-
	N1 is N-1,
	insere1(X,N1,L,L1).

cruzar(Ind1,Ind2,P1,P2,NInd11):-
	sublista(Ind1,P1,P2,Sub1),
	tarefas(NumT),
	R is NumT-P2,
	rotate_right(Ind2,R,Ind21),
	elimina(Ind21,Sub1,Sub2),
	P3 is P2 + 1,
	insere(Sub2,Sub1,P3,NInd1),
	eliminah(NInd1,NInd11).


eliminah([],[]).

eliminah([h|R1],R2):-!,
	eliminah(R1,R2).

eliminah([X|R1],[X|R2]):-
	eliminah(R1,R2).

mutacao([],[]).
mutacao([Ind|Rest],[NInd|Rest1]):-
	prob_mutacao(Pmut),
	random(0.0,1.0,Pm),
	((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
	mutacao(Rest,Rest1).

mutacao1(Ind,NInd):-
	gerar_pontos_cruzamento(P1,P2),
	mutacao22(Ind,P1,P2,NInd).

mutacao22([G1|Ind],1,P2,[G2|NInd]):-
	!, P21 is P2-1,
	mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
	P11 is P1-1, P21 is P2-1,
	mutacao22(Ind,P11,P21,NInd).

mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
	P1 is P-1,
	mutacao23(G1,P1,Ind,G2,NInd).

% ==================================================================================================
% =================================Gestão dos algoritmos============================================
% ==================================================================================================

% Predicado principal que inicia a recursão
escolher_algoritmo(Robots, Algoritmo, Resultados) :-
    Algoritmo =:= 1,
    !,
    escolher_algoritmo_robots(Robots, [], Resultados).

escolher_algoritmo(Tarefas, Algoritmo, Resultados) :-
    Algoritmo =:= 0,
    genetico_lista_robots(Tarefas, Resultados).

% Caso base: quando não há mais robôs para processar
escolher_algoritmo_robots([], Resultados, Resultados).


% Caso recursivo
escolher_algoritmo_robots([robot(Nome,Tarefas)|RestoRobot], Acumulador, Resultados) :-
    melhor_sequencia(Tarefas, MelhorSequencia),
    escolher_algoritmo_robots(RestoRobot, [robot(Nome, MelhorSequencia)|Acumulador], Resultados).
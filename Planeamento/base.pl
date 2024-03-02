:- module(base, [caminho_edificios/3, caminho_pisos/4,
caminho_pontos_piso/10, aStar/4]).
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
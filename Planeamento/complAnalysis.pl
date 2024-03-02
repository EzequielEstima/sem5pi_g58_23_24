:-dynamic ligacel/2.
:-dynamic m/3.
:-dynamic nlin/1.
:-dynamic melhor_sol_dfs/2.
:- use_module(library(random)).


%linha 1:1,1,1,1,1,1,1,1
%linha 2:0,0,0,0,0,0,0,1
%linha 3:0,0,0,0,0,0,0,1
%linha 4:0,0,0,0,0,0,0,1
%linha 5:1,1,1,1,0,0,0,1
%linha 6:1,1,1,1,0,0,0,1
%linha 7:1,1,1,1,0,0,0,1
%coluna :1,2,3,4,5,6,7,8
%
%
cria_matriz:-
	retractall(m(_,_,_)),
	retractall(ligacel(_,_)),
	write('Numero de Colunas: '),read(NCol),nl,
	write('Numero de Linhas: '),read(NLin),nl,asserta(nlin(NLin)),
	cria_matriz_0(NCol,NLin),cria_grafo(NCol,NLin),retract(nlin(_)).


cria_matriz_0(1,1):-!,asserta(m(1,1,0)).
cria_matriz_0(NCol,1):-!,asserta(m(NCol,1,0)),NCol1 is NCol-1,nlin(NLin),cria_matriz_0(NCol1,NLin).
cria_matriz_0(NCol,NLin):-asserta(m(NCol,NLin,0)),NLin1 is NLin-1,cria_matriz_0(NCol,NLin1).

cria_grafo(_,0):-!.
cria_grafo(Col,Lin):-cria_grafo_lin(Col,Lin),Lin1 is Lin-1,cria_grafo(Col,Lin1).


cria_grafo_lin(0,_):-!.
cria_grafo_lin(Col,Lin):-m(Col,Lin,0),!,ColS is Col+1, ColA is Col-1, LinS is Lin+1,LinA is Lin-1,
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
cria_grafo_lin(Col,Lin):-Col1 is Col-1,cria_grafo_lin(Col1,Lin).

count_ligacel:-findall(ligacel(X,Y),ligacel(X,Y),L),length(L,N),write(N),nl.

dfs(Orig,Dest,Cam):-
    get_time(Ti),
    dfs2(Orig,Dest,[Orig],Cam),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.

dfs2(Dest,Dest,LA,Cam):-
	reverse(LA,Cam).

dfs2(Act,Dest,LA,Cam):-
	ligacel(Act,X),
        \+ member(X,LA),
	dfs2(X,Dest,[X|LA],Cam).


all_dfs(Orig,Dest,LCam):-findall(Cam,dfs(Orig,Dest,Cam),LCam).


better_dfs(Orig,Dest,Cam):-all_dfs(Orig,Dest,LCam), shortlist(LCam,Cam,_).


better_dfs1(Orig,Dest,LCaminho_minlig):-
		get_time(Ti),
		(better_dfs11(Orig,Dest);true),
		retract(melhor_sol_dfs(LCaminho_minlig,_)),
		get_time(Tf),
		T is Tf-Ti,
		write('Tempo de geracao da solucao:'),write(T),nl.

better_dfs11(Orig,Dest):-
		asserta(melhor_sol_dfs(_,10000)),
		dfs(Orig,Dest,LCaminho),
		atualiza_melhor_dfs(LCaminho),
		fail.

atualiza_melhor_dfs(LCaminho):-
		melhor_sol_dfs(_,N),
		length(LCaminho,C),
		C<N,retract(melhor_sol_dfs(_,_)),
		asserta(melhor_sol_dfs(LCaminho,C)).




shortlist([L],L,N):-!,length(L,N).
shortlist([L|LL],Lm,Nm):-shortlist(LL,Lm1,Nm1),
				length(L,NL),
			((NL<Nm1,!,Lm=L,Nm is NL);(Lm=Lm1,Nm is Nm1)).


bfs(Orig,Dest,Cam):-
    get_time(Ti),
    bfs2(Dest,[[Orig]],Cam),
    get_time(Tf),
    T is Tf-Ti,
    write('Tempo de geracao da solucao:'),write(T),nl.

bfs2(Dest,[[Dest|T]|_],Cam):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacel(Act,X),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

tarefa(t1,1,1,x1,2,2,x1).
tarefa(t2,3,3,x1,3,2,x1).
tarefa(t3,1,1,x1,2,3,x1).
tarefa(t4,1,1,x1,2,4,x1).
tarefa(t5, 1, 1, x1, 2, 5, x1).
tarefa(t6, 1, 1, x1, 2, 6, x1).
tarefa(t7, 1, 1, x1, 2, 7, x1).
tarefa(t8, 1, 1, x1, 2, 8, x1).
tarefa(t9, 1, 1, x1, 2, 9, x1).

tempo(manuel, t9, t1, 6).
tempo(manuel, t1, t9, 6).
tempo(manuel, t9, t2, 7).
tempo(manuel, t2, t9, 7).
tempo(manuel, t9, t3, 8).
tempo(manuel, t3, t9, 8).
tempo(manuel, t9, t4, 9).
tempo(manuel, t4, t9, 9).
tempo(manuel, t9, t5, 10).
tempo(manuel, t5, t9, 10).
tempo(manuel, t9, t6, 11).
tempo(manuel, t6, t9, 11).
tempo(manuel, t9, t7, 12).
tempo(manuel, t7, t9, 12).
tempo(manuel, t9, t8, 13).
tempo(manuel, t8, t9, 13).
tempo(manuel, t8, t1, 5).
tempo(manuel, t1, t8, 5).
tempo(manuel, t8, t2, 6).
tempo(manuel, t2, t8, 6).
tempo(manuel, t8, t3, 7).
tempo(manuel, t3, t8, 7).
tempo(manuel, t8, t4, 8).
tempo(manuel, t4, t8, 8).
tempo(manuel, t8, t5, 9).
tempo(manuel, t5, t8, 9).
tempo(manuel, t8, t6, 10).
tempo(manuel, t6, t8, 10).
tempo(manuel, t8, t7, 11).
tempo(manuel, t7, t8, 11).
tempo(manuel, t7, t1, 4).
tempo(manuel, t1, t7, 4).
tempo(manuel, t7, t2, 5).
tempo(manuel, t2, t7, 5).
tempo(manuel, t7, t3, 6).
tempo(manuel, t3, t7, 6).
tempo(manuel, t7, t4, 7).
tempo(manuel, t4, t7, 7).
tempo(manuel, t7, t5, 8).
tempo(manuel, t5, t7, 8).
tempo(manuel, t7, t6, 9).
tempo(manuel, t6, t7, 9).
tempo(manuel, t6, t1, 2).
tempo(manuel, t1, t6, 2).
tempo(manuel, t6, t2, 2).
tempo(manuel, t2, t6, 2).
tempo(manuel, t6, t3, 2).
tempo(manuel, t3, t6, 2).
tempo(manuel, t6, t4, 2).
tempo(manuel, t4, t6, 2).
tempo(manuel, t6, t5, 2).
tempo(manuel, t5, t6, 2).
tempo(manuel, t5, t1, 2).
tempo(manuel, t1, t5, 2).
tempo(manuel, t5, t2, 2).
tempo(manuel, t2, t5, 2).
tempo(manuel, t5, t3, 2).
tempo(manuel, t3, t5, 2).
tempo(manuel, t5, t4, 2).
tempo(manuel, t4, t5, 2).
tempo(manuel, t1, t2, 2).
tempo(manuel, t2, t1, 2).
tempo(manuel, t2, t3, 2).
tempo(manuel, t3, t2, 2).
tempo(manuel, t1, t3, 2).
tempo(manuel, t3, t1, 2).
tempo(manuel, t4, t1, 2).
tempo(manuel, t1, t4, 2).
tempo(manuel, t4, t2, 2).
tempo(manuel, t2, t4, 2).
tempo(manuel, t4, t3, 2).
tempo(manuel, t3, t4, 2).


melhor_sequencia(Tarefas, MelhorSequencia) :-
	get_time(Ti),
    findall(Sequencia, permutation(Tarefas, Sequencia), Sequencias),
    avaliar_sequencias(Sequencias, MelhorSequencia, _),
	get_time(Tf),
	T is Tf-Ti,
	write('Tempo de geracao da solucao:'),write(T),nl.

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


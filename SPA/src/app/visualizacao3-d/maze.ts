import * as THREE from "three";
import Ground from "./ground";
import Wall from "./wall";
import Door from "./door";
import { publishFacade } from "@angular/compiler";
import Elevador from "./elevador";
import ExportarMapa from "src/dataModel/exportarMapa";


interface mazeData {
    groundTextureUrl: string,
    wallTextureUrl: string,
    size: size,
    map: string[][],
    initialPosition: number[],
    initialDirection: number,
    exitLocation: number[],
}

interface size {
    "width": number
    "height": number,
}

export default class Maze {
    public map: string[][];
    public size: { width: number; height: number };
    public initialPosition: THREE.Vector3;
    public initialDirection: number;
    public exitLocation!: THREE.Vector3;
    public object: THREE.Group;
    public ground: Ground;
    public wall: Wall;
    public scale: THREE.Vector3;
    public loaded: boolean;
    public door!: Door[];
    public elevador!: Elevador[];
    public elevadorCoord: {
        xCoord: number,
        yCoord: number,
        orientacao: string
    };
    public passagensCoord : [{
        id: number,
        abcissaA: number,
        ordenadaA: number,
        abcissaB: number,
        ordenadaB: number,
        orientacao: string
    }];
    public  salasCoord ?: [{
        nome: string,
        abcissaA : number,
        ordenadaA: number,
        abcissaB: number,
        ordenadaB: number,
        abcissaPorta: number,
        ordenadaPorta: number,
        orientacaoPorta: string,
    }];
    public numeroPiso: number;
    public codigoEdificio: string;

    constructor(mapaData: ExportarMapa, scene: THREE.Scene, initialDirection: number, posicaoInicialRobo?: number[]) {
        this.loaded = false;
        this.scale = new THREE.Vector3(1.0, 0.8, 1.0);
        this.map = mapaData.matriz;
        this.size = { width: mapaData.matriz[0].length -1 ,height: mapaData.matriz.length-1};
        let posicaoInicialRoboAux;
        if(posicaoInicialRobo){
            posicaoInicialRoboAux = this.cellToCartesian(posicaoInicialRobo);
        }else{
            posicaoInicialRoboAux = this.cellToCartesian([mapaData.posicaoInicialRobo.x, mapaData.posicaoInicialRobo.y])
        }
        this.initialPosition = posicaoInicialRoboAux;
        this.initialDirection = initialDirection;
        this.salasCoord = mapaData.salas;
        this.passagensCoord = mapaData.passagens;
        this.elevadorCoord = mapaData.elevador;
        this.door = [];
        this.elevador = [];
        this.numeroPiso = mapaData.numeroPiso;
        this.codigoEdificio = mapaData.codigoEdificio;

        //this.exitLocation = this.cellToCartesian(mapaData.exitLocation);
        this.object = new THREE.Group();
        this.ground = new Ground({ textureUrl: mapaData.texturaChao, size: this.size });

        this.object.add(this.ground.object);
        
        this.wall = new Wall({ textureUrl: mapaData.texturaParede });
                
        let wallObject: THREE.Object3D;
        let doorObject: THREE.Object3D;
            for (let i = 0; i <= this.size.width; i++) {
                for (let j = 0; j <= this.size.height; j++) {
                    if (this.map[j][i] == "Norte" || this.map[j][i] == "NorteOeste" || this.map[j][i] == "PortaOesteNorteOeste" || this.map[j][i] == "PassagemNorte" || this.map[j][i] == "ElevadorNorte" || this.map[j][i] == "ElevadorNorteOeste") {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - this.size.width / 2.0 + 0.5, 0.5, j - this.size.height / 2.0);
                        this.object.add(wallObject);
                    }
                    if (this.map[j][i] == "Oeste" || this.map[j][i] == "NorteOeste" || this.map[j][i] == "PortaNorteNorteOeste" || this.map[j][i] == "PassagemOeste" || this.map[j][i] == "ElevadorOeste" || this.map[j][i] == "ElevadorNorteOeste") {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - this.size.width / 2.0, 0.5, j - this.size.height / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }
                    if(this.map[j][i] == "PortaNorte" || this.map[j][i] == "PortaNorteNorteOeste"){
                        this.door.push(new Door({ url: mapaData.modeloPorta, scale: new THREE.Vector3(0.9, 0.4, 0.5), initialDirection: 180 , position: new THREE.Vector3(i - this.size.width / 2.0 + 0.5, 0, j - this.size.height / 2.0), scene: scene}));
                    }
                    if(this.map[j][i] == "PortaOeste" || this.map[j][i] == "PortaOesteNorteOeste"){
                        this.door.push(new Door({ url: mapaData.modeloPorta, scale: new THREE.Vector3(0.9, 0.4, 0.5), initialDirection: 90 , position: new THREE.Vector3(i - this.size.width / 2.0, 0, j - this.size.height / 2.0 + 0.5), scene: scene}));
                    }
                    if(this.map[j][i] == "Elevador" || this.map[j][i] == "ElevadorNorte" || this.map[j][i] == "ElevadorOeste" || this.map[j][i] == "ElevadorNorteOeste"){
                        if(mapaData.elevador.orientacao == "Norte"){
                            this.elevador.push(new Elevador({ url: mapaData.modeloElevador, scale: new THREE.Vector3(0.242, 0.2, 0.242), initialDirection: -180 , position: new THREE.Vector3(i - this.size.width / 2.0 + 0.5, 0, j - this.size.height / 2.0 + 0.5), scene: scene}));
                        }else if (mapaData.elevador.orientacao == "Oeste"){
                            this.elevador.push(new Elevador({ url: mapaData.modeloElevador, scale: new THREE.Vector3(0.242, 0.2, 0.242), initialDirection: -90 , position: new THREE.Vector3(i - this.size.width / 2.0 + 0.5, 0, j - this.size.height / 2.0 + 0.5), scene: scene}));
                        }else if (mapaData.elevador.orientacao == "Sul"){
                            this.elevador.push(new Elevador({ url: mapaData.modeloElevador, scale: new THREE.Vector3(0.242, 0.2, 0.242), initialDirection: 0.0 , position: new THREE.Vector3(i - this.size.width / 2.0 + 0.5, 0, j - this.size.height / 2.0 + 0.5), scene: scene}));
                        }else{
                            this.elevador.push(new Elevador({ url: mapaData.modeloElevador, scale: new THREE.Vector3(0.242, 0.2, 0.242), initialDirection: 90 , position: new THREE.Vector3(i - this.size.width / 2.0 + 0.5, 0, j - this.size.height / 2.0 + 0.5), scene: scene}))
                        }    
                    }
                }
            }
        
        
        this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
        this.loaded = true;
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    public cellToCartesian(position: number[]): THREE.Vector3 {
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z);
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    public cartesianToCell(position: THREE.Vector3): number[] {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    public distanceToWestWall(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == "Oeste" || this.map[indices[0]][indices[1]] == "NorteOeste" || this.map[indices[0]][indices[1]] == "PortaNorteNorteOeste") {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    public distanceToEastWall(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == "Oeste" || this.map[indices[0]][indices[1]] == "NorteOeste" || this.map[indices[0]][indices[1]] == "PortaNorteNorteOeste") {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    public distanceToNorthWall(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == "Norte" || this.map[indices[0]][indices[1]] == "NorteOeste" || this.map[indices[0]][indices[1]] == "PortaOesteNorteOeste") {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    public distanceToSouthWall(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == "Norte" || this.map[indices[0]][indices[1]] == "NorteOeste" || this.map[indices[0]][indices[1]] == "PortaOesteNorteOeste") {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    public distanceToWestPassage(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == "Passagem" || this.map[indices[0]][indices[1]] == "PassagemOeste" || this.map[indices[0]][indices[1]] == "PassagemNorte") {
            for(let i = 0; i < this.passagensCoord.length; i++){
                if(this.passagensCoord[i].abcissaA == indices[0] && this.passagensCoord[i].ordenadaA == indices[1]){
                    if(this.passagensCoord[i].orientacao == "Oeste"){
                        return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
                    }
                }
                if(this.passagensCoord[i].abcissaB == indices[0] && this.passagensCoord[i].ordenadaB == indices[1]){
                    if(this.passagensCoord[i].orientacao == "Oeste"){
                        return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
                    }
                }
            }
        }
        return Infinity;
    }

    public distanceToEastPassage(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == "Passagem" || this.map[indices[0]][indices[1]] == "PassagemOeste" || this.map[indices[0]][indices[1]] == "PassagemNorte") {
            for(let i = 0; i < this.passagensCoord.length; i++){
                if(this.passagensCoord[i].abcissaA == indices[0] && this.passagensCoord[i].ordenadaA == indices[1]){
                    if(this.passagensCoord[i].orientacao == "Oeste"){
                        return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
                    }
                }
                if(this.passagensCoord[i].abcissaB == indices[0] && this.passagensCoord[i].ordenadaB == indices[1]){
                    if(this.passagensCoord[i].orientacao == "Oeste"){
                        return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
                    }
                }
            }
        }
        return Infinity;
    }

    public distanceToNorthPassage(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == "Passagem" || this.map[indices[0]][indices[1]] == "PassagemNorte" || this.map[indices[0]][indices[1]] == "PassagemNorte") {
            for(let i = 0; i < this.passagensCoord.length; i++){
                if(this.passagensCoord[i].abcissaA == indices[0] && this.passagensCoord[i].ordenadaA == indices[1]){
                    if(this.passagensCoord[i].orientacao == "Norte"){
                        return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
                    }
                }
                if(this.passagensCoord[i].abcissaB == indices[0] && this.passagensCoord[i].ordenadaB == indices[1]){
                    if(this.passagensCoord[i].orientacao == "Norte"){
                        return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
                    }
                }
            }
        }
        return Infinity;
    }

    public distanceToSouthPassage(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == "Passagem" || this.map[indices[0]][indices[1]] == "PassagemNorte" || this.map[indices[0]][indices[1]] == "PassagemNorte") {
            for(let i = 0; i < this.passagensCoord.length; i++){
                if(this.passagensCoord[i].abcissaA == indices[0] && this.passagensCoord[i].ordenadaA == indices[1]){
                    if(this.passagensCoord[i].orientacao == "Norte"){
                        return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
                    }
                }
                if(this.passagensCoord[i].abcissaB == indices[0] && this.passagensCoord[i].ordenadaB == indices[1]){
                    if(this.passagensCoord[i].orientacao == "Norte"){
                        return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
                    }
                }
            }
        }
        return Infinity;
    }

    public idPassagem(position: THREE.Vector3, radius: number): number {
        if(this.distanceToWestPassage(position) < radius){
            const indices = this.cartesianToCell(position);
            if (this.map[indices[0]][indices[1]] == "Passagem" || this.map[indices[0]][indices[1]] == "PassagemOeste" || this.map[indices[0]][indices[1]] == "PassagemNorte") {
                for(let i = 0; i < this.passagensCoord.length; i++){
                    if(this.passagensCoord[i].abcissaA == indices[0] && this.passagensCoord[i].ordenadaA == indices[1]){
                        if(this.passagensCoord[i].orientacao == "Oeste"){
                            return this.passagensCoord[i].id;
                        }
                    }
                    if(this.passagensCoord[i].abcissaB == indices[0] && this.passagensCoord[i].ordenadaB == indices[1]){
                        if(this.passagensCoord[i].orientacao == "Oeste"){
                            return this.passagensCoord[i].id;
                        }
                    }
                }
            }
        }else if(this.distanceToEastPassage(position) < radius){
            const indices = this.cartesianToCell(position);
            indices[1]++;
            if (this.map[indices[0]][indices[1]] == "Passagem" || this.map[indices[0]][indices[1]] == "PassagemOeste" || this.map[indices[0]][indices[1]] == "PassagemNorte") {
                for(let i = 0; i < this.passagensCoord.length; i++){
                    if(this.passagensCoord[i].abcissaA == indices[0] && this.passagensCoord[i].ordenadaA == indices[1]){
                        if(this.passagensCoord[i].orientacao == "Oeste"){
                            return this.passagensCoord[i].id;
                        }
                    }
                    if(this.passagensCoord[i].abcissaB == indices[0] && this.passagensCoord[i].ordenadaB == indices[1]){
                        if(this.passagensCoord[i].orientacao == "Oeste"){
                            return this.passagensCoord[i].id;
                        }
                    }
                }
            }
        }else if(this.distanceToNorthPassage(position) < radius){
            const indices = this.cartesianToCell(position);
            if (this.map[indices[0]][indices[1]] == "Passagem" || this.map[indices[0]][indices[1]] == "PassagemNorte" || this.map[indices[0]][indices[1]] == "PassagemNorte") {
                for(let i = 0; i < this.passagensCoord.length; i++){
                    if(this.passagensCoord[i].abcissaA == indices[0] && this.passagensCoord[i].ordenadaA == indices[1]){
                        if(this.passagensCoord[i].orientacao == "Norte"){
                            return this.passagensCoord[i].id;
                        }
                    }
                    if(this.passagensCoord[i].abcissaB == indices[0] && this.passagensCoord[i].ordenadaB == indices[1]){
                        if(this.passagensCoord[i].orientacao == "Norte"){
                            return this.passagensCoord[i].id;
                        }
                    }
                }
            }
        }else if(this.distanceToSouthPassage(position) < radius){
            const indices = this.cartesianToCell(position);
            indices[0]++;
            if (this.map[indices[0]][indices[1]] == "Passagem" || this.map[indices[0]][indices[1]] == "PassagemNorte" || this.map[indices[0]][indices[1]] == "PassagemNorte") {
                for(let i = 0; i < this.passagensCoord.length; i++){
                    if(this.passagensCoord[i].abcissaA == indices[0] && this.passagensCoord[i].ordenadaA == indices[1]){
                        if(this.passagensCoord[i].orientacao == "Norte"){
                            return this.passagensCoord[i].id;
                        }
                    }
                    if(this.passagensCoord[i].abcissaB == indices[0] && this.passagensCoord[i].ordenadaB == indices[1]){
                        if(this.passagensCoord[i].orientacao == "Norte"){
                            return this.passagensCoord[i].id;
                        }
                    }
                }
            }
        }
        return -1;
    }

    public distanceToWestElevador(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        // Se estiver no limite oeste do mapa
        if(indices[1] < 1){
            return Infinity;
        }

        if (this.map[indices[0]][indices[1]-1] == "ElevadorNorte" 
        || this.map[indices[0]][indices[1]-1] == "ElevadorOeste" 
        || this.map[indices[0]][indices[1]-1] == "ElevadorNorteOeste"
        || this.map[indices[0]][indices[1]-1] == "Elevador"
        ) {
            // Se for um elevador com a porta para este
            if (this.elevadorCoord.orientacao == "Este") {
                return Infinity;
            }else{
                return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
            }
        } else {
            return Infinity;
        }
        
    }

    public distanceToWestPortaElevador(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        // Se estiver no limite oeste do mapa
        if(indices[1] < 1){
            return Infinity;
        }

        if (this.map[indices[0]][indices[1]-1] == "ElevadorNorte" 
        || this.map[indices[0]][indices[1]-1] == "ElevadorOeste" 
        || this.map[indices[0]][indices[1]-1] == "ElevadorNorteOeste"
        || this.map[indices[0]][indices[1]-1] == "Elevador"
        ) {
            // Se for um elevador com a porta para este
            if (this.elevadorCoord.orientacao == "Este") {
                return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
            }else{
                return Infinity;
            }
        } else {
            return Infinity;
        }
        
    }

    public distanceToEastElevador(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);

        // Se estiver no limite oeste do mapa
        if(indices[1] > this.size.width - 1){
            return Infinity;
        }
        
        if (this.map[indices[0]][indices[1]+1] == "ElevadorNorte" 
        || this.map[indices[0]][indices[1]+1] == "ElevadorOeste" 
        || this.map[indices[0]][indices[1]+1] == "ElevadorNorteOeste"
        || this.map[indices[0]][indices[1]+1] == "Elevador") {
            // Se for um elevador com a porta para este
            if (this.elevadorCoord.orientacao == "Oeste") {
                return Infinity;
            }else{
                indices[1]++;
                return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
            }
        } else {
            return Infinity;
        }
    }

    public distanceToEastPortaElevador(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);

        // Se estiver no limite oeste do mapa
        if(indices[1] > this.size.width - 1){
            return Infinity;
        }
        
        if (this.map[indices[0]][indices[1]+1] == "ElevadorNorte" 
        || this.map[indices[0]][indices[1]+1] == "ElevadorOeste" 
        || this.map[indices[0]][indices[1]+1] == "ElevadorNorteOeste"
        || this.map[indices[0]][indices[1]+1] == "Elevador") {
            // Se for um elevador com a porta para este
            if (this.elevadorCoord.orientacao == "Oeste") {
                indices[1]++;
                return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
            }else{
                return Infinity;
            }
        } else {
            return Infinity;
        }
    }

    public distanceToNorthElevador(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);

        if(indices[0] < 1){
            return Infinity;
        }

        if (this.map[indices[0]-1][indices[1]] == "ElevadorNorte" 
        || this.map[indices[0]-1][indices[1]] == "ElevadorOeste" 
        || this.map[indices[0]-1][indices[1]] == "ElevadorNorteOeste"
        || this.map[indices[0]-1][indices[1]] == "Elevador"
        ) {
            // Se for um elevador com a porta para Sul
            if (this.elevadorCoord.orientacao == "Sul") {
                return Infinity;
            }else{
                return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
            }
        } else {
            return Infinity;
        }
    }

    public distanceToNorthPortaElevador(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);

        if(indices[0] < 1){
            return Infinity;
        }

        if (this.map[indices[0]-1][indices[1]] == "ElevadorNorte" 
        || this.map[indices[0]-1][indices[1]] == "ElevadorOeste" 
        || this.map[indices[0]-1][indices[1]] == "ElevadorNorteOeste"
        || this.map[indices[0]-1][indices[1]] == "Elevador"
        ) {
            // Se for um elevador com a porta para Sul
            if (this.elevadorCoord.orientacao == "Sul") {
                return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
            }else{
                return Infinity;
            }
        } else {
            return Infinity;
        }
    }

    public distanceToSouthElevador(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        
        if(indices[0] > this.size.height - 1){
            return Infinity;
        }

        if ( this.map[indices[0]+1][indices[1]] == "Elevador"
        || this.map[indices[0]+1][indices[1]] == "ElevadorNorte" 
        || this.map[indices[0]+1][indices[1]] == "ElevadorOeste" 
        || this.map[indices[0]+1][indices[1]] == "ElevadorNorteOeste") {
            // Se for um elevador com a porta para Sul
            if (this.elevadorCoord.orientacao == "Norte") {
                return Infinity;
            }else{
                indices[0]++;
                return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
            }
        } else {
            return Infinity;
        }
    
    }
    public distanceToSouthPortaElevador(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        
        if(indices[0] > this.size.height - 1){
            return Infinity;
        }

        if ( this.map[indices[0]+1][indices[1]] == "Elevador"
        || this.map[indices[0]+1][indices[1]] == "ElevadorNorte" 
        || this.map[indices[0]+1][indices[1]] == "ElevadorOeste" 
        || this.map[indices[0]+1][indices[1]] == "ElevadorNorteOeste") {
            // Se for um elevador com a porta para Sul
            if (this.elevadorCoord.orientacao == "Norte") {
                indices[0]++;
                return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
            }else{
                return Infinity;
            }
        } else {
            return Infinity;
        }
    
    }

    public distanceToWestDoor(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == "PortaOeste" || this.map[indices[0]][indices[1]] == "PortaOesteNorteOeste") {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    public distanceToEastDoor(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == "PortaOeste" || this.map[indices[0]][indices[1]] == "PortaOesteNorteOeste") {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    public distanceToNorthDoor(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == "PortaNorte" || this.map[indices[0]][indices[1]] == "PortaNorteNorteOeste") {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    public distanceToSouthDoor(position: THREE.Vector3): number {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == "PortaNorte" || this.map[indices[0]][indices[1]] == "PortaNorteNorteOeste") {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    foundExit(position: THREE.Vector3): boolean {
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };

    public getObjectNames(position: THREE.Vector3): string{
        
        let number = this.cartesianToCell(position);
        if(this.elevadorCoord){
            if(this.elevadorCoord.xCoord == number[0] && this.elevadorCoord.yCoord == number[1]){
                return "Elevador - " + this.codigoEdificio;
            }
        }

        if(this.salasCoord){
            for(let i = 0; i < this.salasCoord.length; i++){
                if(this.salasCoord[i].orientacaoPorta == "Norte"){
                    if((number[0] == this.salasCoord[i].abcissaPorta || number[0] == this.salasCoord[i].abcissaPorta - 1) && number[1] == this.salasCoord[i].ordenadaPorta){
                        return this.salasCoord[i].nome;
                    }
                }
                if(this.salasCoord[i].orientacaoPorta == "Oeste"){
                    if(number[0] == this.salasCoord[i].abcissaPorta  && (number[1] == this.salasCoord[i].ordenadaPorta || number[1] == this.salasCoord[i].ordenadaPorta - 1)){
                        return this.salasCoord[i].nome;
                    }
                }
                
            }
        }

        return "";
    }

}
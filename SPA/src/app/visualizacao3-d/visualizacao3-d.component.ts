import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
  Inject
} from '@angular/core';
import * as THREE from 'three';
import Maze from './maze';
import Lights from './lights';
import Camera from './camera';
import Orientation from './orientation';
import Player from './player';
import PlayerAnimations from './player_animations';
import UserInterface from './userInterface';
import { PisoService } from 'src/serviceInfo/piso.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { TarefaService } from 'src/serviceInfo/tarefa.service';
import ExportarMapa from 'src/dataModel/exportarMapa';
import { initial, isEqual } from 'lodash';
import DoorAnimations from './doorAnimations';
import { MapaService } from 'src/serviceInfo/mapa.service';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-visualizacao3-d',
  templateUrl: './visualizacao3-d.component.html',
  styleUrls: ['./visualizacao3-d.component.css'],
})
export class Visualizacao3DComponent implements AfterViewInit {
  numeroEntradas = 0;
  numeroEntradasEdificio = 0;
  virarRelogio: any = false;
  pontoAtualTarefaEdificio: number = 0;
  idTarefa: string = "";
  automaticMode : boolean = false;
  listaPontos : {
    edificio: string,
    piso: number,
    x: number,
    y: number,
  }[] = [];
  listaPontosCartesian: {
    edificio: string,
    piso: number,
    cartesian: THREE.Vector3,
  }[] = [];
  numeroEdificioAtual: number = 0;
  pontoAtualTarefa: number = 0;
  objetivoDirecao: number = 0;
  initialDirection: number = 0;
  chegou:boolean = false;
  atualMenor:boolean = false;
  tarefaConcluida:boolean = false;

  listaPontosEdificio: {
    edificio: string,
    piso: number,
    x: number,
    y: number,
  }[][] = [];

  listaPontosEdificioCartesian: {
    edificio: string,
    piso: number,
    cell: THREE.Vector3,
  }[][] = [];


  listaCodigos: string[] = [];
  listaNumeroPisos: number[] = [];
  codigo: any;
  numeroPiso: any;
  mapa: any;
  multipleViewsCheckBox: any;
  userInterfaceCheckBox: any;
  popupOpen: boolean = false;
  popupPisosElevadorOpen: boolean = false;
  listaPisosServidos: number[] = [1,2,3,4];
  carregouPiso: boolean = false;
  context1!: CanvasRenderingContext2D | null;
  texture1!: THREE.Texture;
  mouse = { x: 0, y: 0 }
  INTERSECTED: any;
  tooltip!: HTMLElement | null;
  popupAlertPassagem: boolean = false;
  popupAlertElevador: boolean = false;
  carregarPisoBooleano: boolean = false;

  constructor(
    private pisoService: PisoService,
    private edificioService: EdificioService,
    private tarefaService: TarefaService,
    private mapaService: MapaService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Perform your specific task here
        if(this.canvas){
          this.canvas.remove();
          const elements = document.body.querySelectorAll('.lil-gui');
          elements.forEach((element) => {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          });
        }
      }
    });

    this.route.paramMap.subscribe(params => {
      // Check if the parameter with key 'yourParamName' exists in the URL
      const idFromUrl = this.route.snapshot.paramMap.get('id');
      if(idFromUrl){
        this.automaticMode = true;
        this.idTarefa = idFromUrl;
      }
    });
    if(!this.automaticMode){
      this.edificioService.listarCodEdificios().subscribe({
        next: (data) => {
          this.listaCodigos = data;
        },
      });
    }
  }
  listarNumeroPisos(): void {
    const codigo = this.codigo.options.item(this.codigo.selectedIndex)?.value;
    if (codigo === '') {
      this.listaNumeroPisos = [];
    } else {
      this.pisoService.listarPisosMapa(codigo).subscribe({
        next: (data) => {
          this.listaNumeroPisos = data;
        },
        error: (error) => {
          console.error('Error fetching floor numbers:', error);
          this.listaNumeroPisos = [];
        },
        complete: () => { },
      });
    }
  }

  listarNumeroPisosServidosPorElevador(): void {
    const codigo = this.codigo.options.item(this.codigo.selectedIndex)?.value;

    if (codigo === '') {
      this.listaPisosServidos = [];
    } else {
      this.pisoService.listarPisosServidosPorElevador(codigo).subscribe({
        next: (data) => {
          this.listaPisosServidos = data;
        },
        error: (error) => {
          console.error('Error fetching floor numbers:', error);
          this.listaPisosServidos = [];
        },
        complete: () => { },
      });
    }
  }

  private setListaPontosPorEdificio(): void {
    let edificioAtual:string = this.listaPontos[0].edificio;
    let pisoAtual:number = this.listaPontos[0].piso;
    let numeroEdificios:number = 0;
    this.listaPontosEdificio[0] = [];
    for(let i = 0; i < this.listaPontos.length; i++){
      if(this.listaPontos[i].edificio === edificioAtual && this.listaPontos[i].piso === pisoAtual){
        this.listaPontosEdificio[numeroEdificios].push(this.listaPontos[i]);
      }else{
        edificioAtual = this.listaPontos[i].edificio;
        pisoAtual = this.listaPontos[i].piso;
        numeroEdificios++;
        this.listaPontosEdificio[numeroEdificios] = [];
        this.listaPontosEdificio[numeroEdificios].push(this.listaPontos[i]);
      }
    }
  }

  private setListaPontosCartesian(): void {
    this.listaPontosCartesian = [];
    for(let i = 0; i < this.listaPontos.length; i++){
      let number = [];
      number.push(this.listaPontos[i].y);
      number.push(this.listaPontos[i].x);
      this.listaPontosCartesian[i] = {
        edificio: this.listaPontos[i].edificio,
        piso: this.listaPontos[i].piso,
        cartesian: this.maze.cellToCartesian(number),
      }
    }
    for(let i = 0; i < this.listaPontosEdificio.length; i++){
      this.listaPontosEdificioCartesian[i] = [];
      for(let j = 0; j < this.listaPontosEdificio[i].length; j++){
        let number = [];
        number.push(this.listaPontosEdificio[i][j].y);
        number.push(this.listaPontosEdificio[i][j].x);
        this.listaPontosEdificioCartesian[i][j] = {
          edificio: this.listaPontosEdificio[i][j].edificio,
          piso: this.listaPontosEdificio[i][j].piso,
          cell: this.maze.cellToCartesian(number),
        }
      }
    }
  }

  private inicializarPercursoECriaCena(): void {
    this.edificioService.listarCodEdificios().subscribe({
      next: (data) => {
        let listaCodigosSide = data;
        let codigosSideLowerCase: string[] = [];
        for(let codigo of listaCodigosSide){
          codigosSideLowerCase.push(codigo.toLowerCase());
        }
        this.tarefaService.obterPercursoTarefa(this.idTarefa).subscribe({
          next: (data) => {
            let percursoString = data;
            if(percursoString === null){
            }else{
              let percursoFake = "[celPiso(a1,20,4),celPiso(a1,20,5),celPiso(a1,21,5),celPiso(b1,20,5),celPiso(b1,20,6),celPiso(b1,19,6)]";
              let result = percursoString.split('celPiso(');
              result[result.length - 1] = result[result.length - 1].substring(0,result[result.length - 1].length - 2);
              result.shift();
              this.listaPontos = [];
              for(let i = 0; i < result.length - 1; i++){
                result[i] = result[i].substring(0,result[i].length - 2);
              }
              for(let i = 0; i < result.length; i++){
              let valoresPonto = result[i].split(',');
              let pontos = valoresPonto[0].match(/^([a-zA-Z]+)(\d+)$/);
              let iMatch = 0;
              if(pontos != null){
              for(let i = 0; i < codigosSideLowerCase.length; i++){
                if(codigosSideLowerCase[i] === pontos[1].toLowerCase()){
                  iMatch = i;
                }
              }
              this.listaPontos.push({
                edificio: listaCodigosSide[iMatch],
                piso: parseInt(pontos[2]),
                x: Number(result[i].split(',')[1]),
                y: Number(result[i].split(',')[2]),
              })

              }
            }
          }

          this.listaPontos.shift();
          let edificioAtual:string = this.listaPontos[0].edificio;
          let pisoAtual:number = this.listaPontos[0].piso;
          let indexARetirar:number[] = [];
          for(let i = 1; i < this.listaPontos.length; i++){
            if(this.listaPontos[i].edificio === edificioAtual && this.listaPontos[i].piso !== pisoAtual){
              indexARetirar.push(i);
            }
            edificioAtual = this.listaPontos[i].edificio;
            pisoAtual = this.listaPontos[i].piso;
          }
          for(let i = 0; i < indexARetirar.length; i++){
            this.listaPontos.splice(indexARetirar[i],1);
          }
          this.setListaPontosPorEdificio();
          this.pontoAtualTarefa = 0;
          this.numeroEdificioAtual = 0;
          this.mapaService.exportarMapa(this.listaPontos[0].edificio, this.listaPontos[0].piso).subscribe((data: ExportarMapa) => {
            this.mapa = data;
            if(this.canvas){
              this.canvas.remove();
              const elements = document.body.querySelectorAll('.lil-gui');
              elements.forEach((element) => {
                if (element.parentNode) {
                  element.parentNode.removeChild(element);
                }
              });
            }
            this.createScene();
            this.render();
            this.setListaPontosCartesian();
          });
        }
        });
      },
    });
  }

  @ViewChild('myCanvas') private canvasRef!: ElementRef;
  fixedViewCameraParameters: any;
  firstPersonViewCameraParameters: any;
  thirdPersonViewCameraParameters: any;
  topViewCameraParameters: any;
  player: any;
  mousePosition!: THREE.Vector2;
  view: any;
  changeCameraDistance!: boolean;
  changeCameraOrientation!: boolean;
  horizontal: any;
  vertical: any;
  distance: any;
  zoom: any;
  activeViewCamera: any;
  viewsPanel!: HTMLElement | null;
  projection: any;
  reset!: any;
  resetAll!: any;
  gameRunning: any;
  maze!: Maze;
  light!: Lights;
  clock!: THREE.Clock;
  animations!: PlayerAnimations;
  doorAnimations!: DoorAnimations;
  //elevadorAnimations!: ElevadorAnimations;
  userInterface!: UserInterface;
  subwindowsPanel!: HTMLElement | null;
  idPassagemAtravessar: number = -1;
  numeroPisoUsarElevador: number = Number.MIN_SAFE_INTEGER;


  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  ngAfterViewInit(): void {
    if(this.automaticMode){
      this.inicializarPercursoECriaCena();
    }else{
      this.createScene();
      this.render();
    }
  }

  @Input() public rotationSpeedX: number = 0.001;
  @Input() public rotationSpeedY: number = 0.005;
  @Input() public size: number = 200;
  @Input() public texture: string = '';
  //* Stage Properties
  @Input() public cameraZ: number = 15;
  @Input() public cameraY: number = 3;
  @Input() public cameraX: number = 0;
  @Input() public fieldOfView: number = 30;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  renderer!: THREE.WebGLRenderer;
  scene2D!: THREE.Scene;
  square!: THREE.LineLoop;
  camera2D!: THREE.OrthographicCamera;
  scene3D!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  fixedViewCamera: any;
  firstPersonViewCamera: any;
  thirdPersonViewCamera: any;
  topViewCamera: any;

  async createScene() {
    this.gameRunning = false;

    this.scene2D = new THREE.Scene();
    let points = [
      new THREE.Vector3(0.0, 0.0, 0.0),
      new THREE.Vector3(1.0, 0.0, 0.0),
      new THREE.Vector3(1.0, 1.0, 0.0),
      new THREE.Vector3(0.0, 1.0, 0.0),
    ];
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    this.square = new THREE.LineLoop(geometry, material);
    this.scene2D.add(this.square);

    // Create a 3D scene (the game itself)
    this.scene3D = new THREE.Scene();
    let mazeData = this.mapa;

    this.initialDirection = 0;
    if(this.automaticMode){
      let xDiff = 0;
      let yDiff = 0;
      if(this.listaPontosEdificio[this.numeroEdificioAtual].length > 1){
        xDiff = this.listaPontosEdificio[this.numeroEdificioAtual][1].x - this.listaPontosEdificio[this.numeroEdificioAtual][0].x;
        yDiff = this.listaPontosEdificio[this.numeroEdificioAtual][1].y - this.listaPontosEdificio[this.numeroEdificioAtual][0].y;
      }
      if(xDiff > 0){
        if(yDiff > 0){
          this.initialDirection = 45;
        }else if(yDiff < 0){
          this.initialDirection = 135;
        }else{
          this.initialDirection = 90;
        }
      }else if (xDiff < 0){
        if(yDiff > 0){
          this.initialDirection = 315;
        }else if(yDiff < 0){
          this.initialDirection = 225;
        }else{
          this.initialDirection = 270;
        }
      }else{
        if(yDiff > 0){
          this.initialDirection = 0;
        }else if(yDiff < 0){
          this.initialDirection = 180;
        }
      }
      this.objetivoDirecao = this.initialDirection;
    }

    if(!(mazeData === undefined || mazeData === null)){
      if(this.automaticMode){
        this.maze = new Maze(mazeData, this.scene3D, 0.0, [this.listaPontosEdificio[this.numeroEdificioAtual][0].y, this.listaPontosEdificio[this.numeroEdificioAtual][0].x]);
      }else{
        this.maze = new Maze(mazeData, this.scene3D, 0.0);
      }
    }else{
      const defaultMazeData = {
        texturaChao: 'assets/ground.jpg',
        texturaParede: 'assets/wall.jpg',
        modeloPorta: 'assets/door/door.glb',
        modeloElevador: 'assets/elevador/Elevator.glb',
        codigoEdificio: 'Teste1',
        numeroPiso: 1,
        matriz: [
          ['NorteOeste', 'Norte', 'Norte', 'Norte', 'Norte', 'Oeste'],
          ['Oeste', ' ', ' ', ' ', ' ', 'Oeste'],
          ['Oeste', ' ', '', ' ', ' ', 'Oeste'],
          ['Oeste', ' ', ' ', ' ', ' ', 'Oeste'],
          ['Oeste', ' ', ' ', ' ', ' ', 'Oeste'],
          ['Norte', 'Norte', 'Norte', 'Norte', 'Norte', ''],
        ],
        posicaoInicialRobo: {
          x: 1,
          y: 1,
        }
      } as ExportarMapa;
      this.maze = new Maze(defaultMazeData, this.scene3D, 0.0);
    }
    const playerData = {
      url: 'assets/robotDelivery/starship_delivery_robot_model.glb',
      credits:
        "Model and related code snippets created by <a href='https://www.patreon.com/quaternius' target='_blank' rel='noopener'>Tomás Laulhé</a>. CC0 1.0. Modified by <a href='https://donmccurdy.com/' target='_blank' rel='noopener'>Don McCurdy</a>.",
      eyeHeight: 0.8, // fraction of character height
      scale: new THREE.Vector3(0.05, 0.05, 0.05),
      walkingSpeed: 0.55,
      initialDirection: 0, // Expressed in degrees
      turningSpeed: 100.0, // Expressed in degrees / second
      runningFactor: 2.0, // Affects walking speed and turning speed
      keyCodes: {
        fixedView: 'Digit1',
        firstPersonView: 'Digit2',
        thirdPersonView: 'Digit3',
        topView: 'Digit4',
        viewMode: 'KeyV',
        userInterface: 'KeyU',
        miniMap: 'KeyM',
        help: 'KeyH',
        statistics: 'KeyS',
        run: 'KeyR',
        left: 'ArrowLeft',
        right: 'ArrowRight',
        backward: 'ArrowDown',
        forward: 'ArrowUp',
        jump: 'KeyJ',
        yes: 'KeyY',
        no: 'KeyN',
        wave: 'KeyW',
        punch: 'KeyP',
        thumbsUp: 'KeyT',
      },
    };

    this.player = new Player(playerData);

    let lightParam = {
      ambientLight: { color: 0xffffff, intensity: 0.1 },
      pointLight1: {
        color: 0xffffff,
        intensity: 50.0,
        distance: 20.0,
        position: new THREE.Vector3(-3.5, 10.0, 2.5),
      },
      pointLight2: {
        color: 0xffffff,
        intensity: 50.0,
        distance: 20.0,
        position: new THREE.Vector3(3.5, 10.0, -2.5),
      },
      spotLight: {
        color: 0xffffff,
        intensity: 1.0,
        distance: 0.0,
        angle: Math.PI / 3.0,
        penumbra: 0.0,
        position: new THREE.Vector3(0.0, 0.0, 0.0),
        direction: 0.0,
      }, // angle and direction expressed in radians
    };

    this.light = new Lights(lightParam);

    const cameraData = {
      view: 'third-person', // Fixed view: "fixed"; first-person view: "first-person"; third-person view: "third-person"; top view: "top"; mini-map: "mini-map"
      multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 1.0, 1.0), // Viewport position and size: fraction of window width and window height; MUST BE REDEFINED when creating an instance of ThumbRaiser() so that each view is assigned a different viewport
      target: new THREE.Vector3(0.0, 0.0, 0.0), // Target position
      initialOrientation: new Orientation(135.0, -45.0), // Horizontal and vertical orientation and associated limits (expressed in degrees)
      orientationMin: new Orientation(-180.0, -90.0),
      orientationMax: new Orientation(180.0, 0.0),
      initialDistance: 8.0, // Distance to the target and associated limits
      distanceMin: 4.0,
      distanceMax: 16.0,
      initialZoom: 1.0, // Zoom factor and associated limits
      zoomMin: 0.5,
      zoomMax: 2.0,
      initialFov: 45.0, // Field-of-view (expressed in degrees)
      near: 0.01, // Front clipping plane
      far: 100.0, // Back clipping plane
    };

    this.fixedViewCameraParameters = {
      ...cameraData,
      ...{
        view: 'fixed',
        multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5),
      },
    };
    this.firstPersonViewCameraParameters = {
      ...cameraData,
      ...{
        view: 'first-person',
        multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5),
        initialOrientation: new Orientation(0.0, -10.0),
        initialDistance: 2.0,
        distanceMin: 1.0,
        distanceMax: 4.0,
      },
    };
    this.thirdPersonViewCameraParameters = {
      ...cameraData,
      ...{
        view: 'third-person',
        multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5),
        initialOrientation: new Orientation(0.0, -20.0),
        initialDistance: 2.0,
        distanceMin: 1.0,
        distanceMax: 4.0,
      },
    };
    this.topViewCameraParameters = {
      ...cameraData,
      ...{
        view: 'top',
        multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5),
        initialOrientation: new Orientation(0.0, -90.0),
        initialDistance: 4.0,
        distanceMin: 1.0,
        distanceMax: 16.0,
      },
    };

    this.fixedViewCamera = new Camera(
      this.fixedViewCameraParameters,
      window.innerWidth,
      window.innerHeight
    );
    this.firstPersonViewCamera = new Camera(
      this.firstPersonViewCameraParameters,
      window.innerWidth,
      window.innerHeight
    );
    this.thirdPersonViewCamera = new Camera(
      this.thirdPersonViewCameraParameters,
      window.innerWidth,
      window.innerHeight
    );
    this.topViewCamera = new Camera(
      this.topViewCameraParameters,
      window.innerWidth,
      window.innerHeight
    );

    this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.changeCameraDistance = false;
    this.changeCameraOrientation = false;

    this.viewsPanel = document.getElementById('views-panel');
    this.tooltip = document.getElementById('tooltip');
    this.view = document.getElementById('view');
    this.projection = document.getElementById('projection');
    this.horizontal = document.getElementById('horizontal');
    this.horizontal.step = 1;
    this.vertical = document.getElementById('vertical');
    this.vertical.step = 1;
    this.distance = document.getElementById('distance');
    this.distance.step = 0.1;
    this.zoom = document.getElementById('zoom');
    this.zoom.step = 0.1;
    this.reset = document.getElementById('reset');
    this.resetAll = document.getElementById('reset-all');
    this.codigo = document.getElementById('codigo');
    this.numeroPiso = document.getElementById('numeroPiso');
    this.subwindowsPanel = document.getElementById("subwindows-panel");
    this.multipleViewsCheckBox = document.getElementById("multiple-views");
    this.multipleViewsCheckBox.checked = false;
    this.userInterfaceCheckBox = document.getElementById("user-interface");
    this.userInterfaceCheckBox.checked = true;

    this.setActiveViewCamera(this.fixedViewCamera);

    window.addEventListener('resize', (event) => this.windowResize(event));

    if(!this.automaticMode){
      // Register the event handler to be called on key down
      document.addEventListener('keydown', (event) =>
        this.keyChange(event, true)
      );
  
      // Register the event handler to be called on key release
      document.addEventListener('keyup', (event) => this.keyChange(event, false));
    }
    

    this.renderer.domElement.addEventListener('mousedown', (event) =>
      this.mouseDown(event)
    );

    this.renderer.domElement.addEventListener('mousemove', (event) =>
      this.mouseMove(event)
    );

    this.renderer.domElement.addEventListener('mouseup', (event) =>
      this.mouseUp(event)
    );

    this.renderer.domElement.addEventListener('wheel', (event) =>
      this.mouseWheel(event)
    );

    this.renderer.domElement.addEventListener('contextmenu', (event) =>
      this.contextMenu(event)
    );

    // Register the event handler to be called on select, input number, or input checkbox change
    this.view.addEventListener('change', (event: Event) =>
      this.elementChange(event)
    );
    this.projection.addEventListener('change', (event: Event) =>
      this.elementChange(event)
    );
    this.horizontal.addEventListener('change', (event: Event) =>
      this.elementChange(event)
    );
    this.vertical.addEventListener('change', (event: Event) =>
      this.elementChange(event)
    );
    this.distance.addEventListener('change', (event: Event) =>
      this.elementChange(event)
    );
    this.zoom.addEventListener('change', (event: Event) =>
      this.elementChange(event)
    );

    this.reset.addEventListener('click', (event: Event) =>
      this.buttonClick(event)
    );
    this.resetAll.addEventListener('click', (event: Event) =>
      this.buttonClick(event)
    );

    this.codigo.addEventListener('change', (event: Event) =>
      this.elementChange(event)
    );

    this.numeroPiso.addEventListener('change', (event: Event) =>
      this.elementChange(event)
    );
    this.multipleViewsCheckBox.addEventListener("change", (event: Event) => this.elementChange(event));
    this.userInterfaceCheckBox.addEventListener("change", (event: Event) => this.elementChange(event));

    this.carregouPiso = true;
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private render() {
    requestAnimationFrame(() => this.render());
    this.update();
  }

  displayPanel() {
    this.view.options.selectedIndex = [
      'fixed',
      'first-person',
      'third-person',
      'top',
    ].indexOf(this.activeViewCamera.view);
    if (this.projection.option != null)
      this.projection.options.selectedIndex = [
        'perspective',
        'orthographic',
      ].indexOf(this.activeViewCamera.projection);
    this.horizontal.value = this.activeViewCamera.orientation.h.toFixed(0);
    this.vertical.value = this.activeViewCamera.orientation.v.toFixed(0);
    this.distance.value = this.activeViewCamera.distance.toFixed(1);
    this.zoom.value = this.activeViewCamera.zoom.toFixed(1);
  }

  windowResize(event: Event) {
    this.fixedViewCamera.updateWindowSize(
      window.innerWidth,
      window.innerHeight
    );
    this.firstPersonViewCamera.updateWindowSize(
      window.innerWidth,
      window.innerHeight
    );
    this.thirdPersonViewCamera.updateWindowSize(
      window.innerWidth,
      window.innerHeight
    );
    this.topViewCamera.updateWindowSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  keyChange(event: KeyboardEvent, state: boolean) {
    if (event.target != null) {
      // Allow digit and arrow keys to be used when entering numbers
      if (
        ['horizontal', 'vertical', 'distance', 'zoom'].indexOf(
          (event.target as any).id
        ) < 0
      ) {
        (event.target as any).blur();
      }
      if (document.activeElement === document.body) {
        // Prevent the "Space" and "Arrow" keys from scrolling the document's content
        if (
          event.code == 'Space' ||
          event.code == 'ArrowLeft' ||
          event.code == 'ArrowRight' ||
          event.code == 'ArrowDown' ||
          event.code == 'ArrowUp'
        ) {
          event.preventDefault();
        }

        if (event.code == this.player.keyCodes.fixedView && state) {
          // Select fixed view
          this.setActiveViewCamera(this.fixedViewCamera);
        } else if (
          event.code == this.player.keyCodes.firstPersonView &&
          state
        ) {
          // Select first-person view
          this.setActiveViewCamera(this.firstPersonViewCamera);
        } else if (
          event.code == this.player.keyCodes.thirdPersonView &&
          state
        ) {
          // Select third-person view
          this.setActiveViewCamera(this.thirdPersonViewCamera);
        } else if (event.code == this.player.keyCodes.topView && state) {
          // Select top view
          this.setActiveViewCamera(this.topViewCamera);
        }
        
        if (event.code == this.player.keyCodes.viewMode && state) { // Single-view mode / multiple-views mode
            this.setViewMode(!this.multipleViewsCheckBox.checked);
        }        
        if (event.code == this.player.keyCodes.userInterface && state) { // Display / hide user interface
            this.setUserInterfaceVisibility(!this.userInterfaceCheckBox.checked);
        }
                    /*
                    if (event.code == this.player.keyCodes.miniMap && state) { // Display / hide mini-map
                        this.setMiniMapVisibility(!this.miniMapCheckBox.checked);
                    }
                    if (event.code == this.player.keyCodes.help && state) { // Display / hide help
                        this.setHelpVisibility(!this.helpCheckBox.checked);
                    }
                    if (event.code == this.player.keyCodes.statistics && state) { // Display / hide statistics
                        this.setStatisticsVisibility(!this.statisticsCheckBox.checked);
                    }
                    */
        if (event.code == this.player.keyCodes.run) {
          this.player.keyStates.run = state;
        }
        if (event.code == this.player.keyCodes.left) {
          this.player.keyStates.left = state;
        } else if (event.code == this.player.keyCodes.right) {
          this.player.keyStates.right = state;
        }
        if (event.code == this.player.keyCodes.backward) {
          this.player.keyStates.backward = state;
        } else if (event.code == this.player.keyCodes.forward) {
          this.player.keyStates.forward = state;
        }
        if (event.code == this.player.keyCodes.jump) {
          this.player.keyStates.jump = state;
        } else if (event.code == this.player.keyCodes.yes) {
          this.player.keyStates.yes = state;
        } else if (event.code == this.player.keyCodes.no) {
          this.player.keyStates.no = state;
        } else if (event.code == this.player.keyCodes.wave) {
          this.player.keyStates.wave = state;
        } else if (event.code == this.player.keyCodes.punch) {
          this.player.keyStates.punch = state;
        } else if (event.code == this.player.keyCodes.thumbsUp) {
          this.player.keyStates.thumbsUp = state;
        }
      }
    }
  }

  mouseDown(event: MouseEvent) {
    if (event.buttons == 1 || event.buttons == 2) {
      // Primary or secondary button down
      // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
      this.mousePosition = new THREE.Vector2(
        event.clientX,
        window.innerHeight - event.clientY - 1
      );
      // Select the camera whose view is being pointed
      const cameraView = this.getPointedViewport(this.mousePosition);
      if (cameraView != 'none') {
        // One of the remaining cameras selected
        const cameraIndex = [
          'fixed',
          'first-person',
          'third-person',
          'top',
        ].indexOf(cameraView);
        this.view.options.selectedIndex = cameraIndex;
        this.setActiveViewCamera(
          [
            this.fixedViewCamera,
            this.firstPersonViewCamera,
            this.thirdPersonViewCamera,
            this.topViewCamera,
          ][cameraIndex]
        );
        if (event.buttons == 1) {
          // Primary button down
          this.changeCameraDistance = true;
        } else {
          // Secondary button down
          this.changeCameraOrientation = true;
        }
      }
    }
  }

  getPointedViewport(pointer: THREE.Vector2) {
    let viewport;
    /* Check if the pointer is over the mini-map camera viewport
        if (this.miniMapCheckBox.checked) {
            viewport = this.miniMapCamera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return this.miniMapCamera.view;
            }
        }*/
    // Check if the pointer is over the remaining camera viewports
    let cameras;
    if (this.multipleViewsCheckBox.checked) {
            cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
        }else {
          cameras = [this.activeViewCamera];
        }
    for (const camera of cameras) {
      viewport = camera.getViewport();
      if (this.pointerIsOverViewport(pointer, viewport)) {
        return camera.view;
      }
    }
    // No camera viewport is being pointed
    return 'none';
  }

  setActiveViewCamera(camera: any) {
    this.activeViewCamera = camera;
    this.horizontal.min = this.activeViewCamera.orientationMin.h.toFixed(0);
    this.horizontal.max = this.activeViewCamera.orientationMax.h.toFixed(0);
    this.vertical.min = this.activeViewCamera.orientationMin.v.toFixed(0);
    this.vertical.max = this.activeViewCamera.orientationMax.v.toFixed(0);
    this.distance.min = this.activeViewCamera.distanceMin.toFixed(1);
    this.distance.max = this.activeViewCamera.distanceMax.toFixed(1);
    this.zoom.min = this.activeViewCamera.zoomMin.toFixed(1);
    this.zoom.max = this.activeViewCamera.zoomMax.toFixed(1);
    this.displayPanel();
  }

  pointerIsOverViewport(pointer: THREE.Vector2, viewport: any) {
    return (
      pointer.x >= viewport.x &&
      pointer.x < viewport.x + viewport.width &&
      pointer.y >= viewport.y &&
      pointer.y < viewport.y + viewport.height
    );
  }

  mouseMove(event: MouseEvent) {
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    if(this.tooltip != null){
      this.tooltip.style.left = event.clientX - this.tooltip.offsetWidth / 2 + 'px';
      this.tooltip.style.top = event.clientY - this.tooltip.offsetHeight - 10 + 'px';
    }
    
    if (event.buttons == 1 || event.buttons == 2) {
      // Primary or secondary button down
      if (
        this.changeCameraDistance ||
        this.changeCameraOrientation /*|| this.dragMiniMap*/
      ) {
        // Mouse action in progress
        // Compute mouse movement and update mouse position
        const newMousePosition = new THREE.Vector2(
          event.clientX,
          window.innerHeight - event.clientY - 1
        );
        const mouseIncrement = newMousePosition.clone().sub(this.mousePosition);
        this.mousePosition = newMousePosition;
        if (event.buttons == 1) {
          // Primary button down
          if (this.changeCameraDistance) {
            this.activeViewCamera.updateDistance(
              -0.05 * (mouseIncrement.x + mouseIncrement.y)
            );
            this.displayPanel();
          }
          /*else if (this.dragMiniMap) {
                        const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
                        const width = this.miniMapCamera.viewport.width * windowMinSize;
                        const height = this.miniMapCamera.viewport.height * windowMinSize;
                        this.miniMapCamera.viewport.x += mouseIncrement.x / (window.innerWidth - width);
                        this.miniMapCamera.viewport.y += mouseIncrement.y / (window.innerHeight - height);
                    }*/
        } else {
          // Secondary button down
          if (this.changeCameraOrientation) {
            this.activeViewCamera.updateOrientation(
              mouseIncrement.multiply(new THREE.Vector2(-0.5, 0.5))
            );
            this.displayPanel();
          }
        }
      }
    }
  }

  mouseUp(event: MouseEvent) {
    // Reset mouse move action
    //this.dragMiniMap = false;
    this.changeCameraDistance = false;
    this.changeCameraOrientation = false;
  }

  mouseWheel(event: WheelEvent) {
    // Prevent the mouse wheel from scrolling the document's content
    event.preventDefault();
    // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
    this.mousePosition = new THREE.Vector2(
      event.clientX,
      window.innerHeight - event.clientY - 1
    );
    // Select the camera whose view is being pointed
    const cameraView = this.getPointedViewport(this.mousePosition);
    if (cameraView != 'none' /*&& cameraView != "mini-map"*/) {
      // One of the remaining cameras selected
      const cameraIndex = [
        'fixed',
        'first-person',
        'third-person',
        'top',
      ].indexOf(cameraView);
      this.view.options.selectedIndex = cameraIndex;
      const activeViewCamera = [
        this.fixedViewCamera,
        this.firstPersonViewCamera,
        this.thirdPersonViewCamera,
        this.topViewCamera,
      ][cameraIndex];
      activeViewCamera.updateZoom(-0.001 * event.deltaY);
      this.setActiveViewCamera(activeViewCamera);
    }
  }

  contextMenu(event: Event) {
    // Prevent the context menu from appearing when the secondary mouse button is clicked
    event.preventDefault();
  }

  elementChange(event: Event) {
    if (event.target != null) {
      let target = event.target as HTMLFormElement;
      switch (target.id) {
        case 'view':
          this.setActiveViewCamera(
            [
              this.fixedViewCamera,
              this.firstPersonViewCamera,
              this.thirdPersonViewCamera,
              this.topViewCamera,
            ][this.view.options.selectedIndex]
          );
          break;
        case 'projection':
          this.activeViewCamera.setActiveProjection(
            ['perspective', 'orthographic'][
            this.projection.options.selectedIndex
            ]
          );
          this.displayPanel();
          break;
        case 'horizontal':
        case 'vertical':
        case 'distance':
        case 'zoom':
          if (target.checkValidity()) {
            switch (target.id) {
              case 'horizontal':
              case 'vertical':
                this.activeViewCamera.setOrientation(
                  new Orientation(this.horizontal.value, this.vertical.value)
                );
                break;
              case 'distance':
                this.activeViewCamera.setDistance(this.distance.value);
                break;
              case 'zoom':
                this.activeViewCamera.setZoom(this.zoom.value);
                break;
            }
          }
          break;
        case 'user-interface':
          if ('checked' in target) {
            this.setUserInterfaceVisibility((target as any)['checked']);
          }
          break;
        case 'codigo':
          if(!this.automaticMode){
            this.listarNumeroPisos();
            this.listarNumeroPisosServidosPorElevador();
          }
          break;
          case 'numeroPiso':
            if (!this.automaticMode) {
              if (!this.carregarPisoBooleano) {
                this.carregarPisoBooleano = true;
                const numeroPiso = this.numeroPiso.options.item(this.numeroPiso.selectedIndex)?.value;
                this.mapaService.exportarMapa(this.codigo.value, numeroPiso).subscribe((data: ExportarMapa) => {
                  this.mapa = data;
                  if (this.canvas) {
                    this.canvas.remove();
                    const elements = document.body.querySelectorAll('.lil-gui');
                    elements.forEach((element) => {
                      if (element.parentNode) {
                        element.parentNode.removeChild(element);
                      }
                    });
                  }
                  this.createScene();
                  this.carregarPisoBooleano = false;
                });
              }
            }
  
            break;
          case "multiple-views":
              this.setViewMode((target as any)['checked']);
              break;
           /* case "help":
                this.setHelpVisibility(event.target.checked);
                break;
            case "statistics":
                this.setStatisticsVisibility(event.target.checked);
                break;
                */
      }
    }
  }
  buttonClick(event: Event) {
    if (event.target != null) {
      let target = event.target as HTMLFormElement;
      switch (target.id) {
        case 'reset':
          this.activeViewCamera.initialize();
          break;
        case 'reset-all':
          this.fixedViewCamera.initialize();
          this.firstPersonViewCamera.initialize();
          this.thirdPersonViewCamera.initialize();
          this.topViewCamera.initialize();
          break;
      }
      this.displayPanel();
    }
  }

  setViewMode(multipleViews: any) { // Single-view mode: false; multiple-views mode: true
    this.multipleViewsCheckBox.checked = multipleViews;
    this.arrangeViewports(this.multipleViewsCheckBox.checked);
  }

  arrangeViewports(multipleViews: any) {
    this.fixedViewCamera.setViewport(multipleViews);
    this.firstPersonViewCamera.setViewport(multipleViews);
    this.thirdPersonViewCamera.setViewport(multipleViews);
    this.topViewCamera.setViewport(multipleViews);
  }


  setUserInterfaceVisibility(visible: boolean) {
    //this.userInterfaceCheckBox.checked = visible;
    //this.viewsPanel.style.visibility = visible ? "visible" : "hidden";
    if(!(this.subwindowsPanel === null || this.subwindowsPanel === undefined)){
      this.subwindowsPanel.style.visibility = visible ? "visible" : "hidden";
    }
    this.userInterface.setVisibility(visible);
  }

  collision(position: THREE.Vector3) {
    return this.maze.distanceToWestWall(position) < this.player.radius
      || this.maze.distanceToEastWall(position) < this.player.radius
      || this.maze.distanceToNorthWall(position) < this.player.radius
      || this.maze.distanceToSouthWall(position) < this.player.radius
      // Colisões Elevador
      || this.maze.distanceToWestElevador(position) < this.player.radius
      || this.maze.distanceToEastElevador(position) < this.player.radius
      || this.maze.distanceToNorthElevador(position) < this.player.radius
      || this.maze.distanceToSouthElevador(position) < this.player.radius
      // Colisões Portas
      || this.maze.distanceToWestDoor(position) < this.player.radius
      || this.maze.distanceToEastDoor(position) < this.player.radius
      || this.maze.distanceToNorthDoor(position) < this.player.radius
      || this.maze.distanceToSouthDoor(position) < this.player.radius
      ;
  }

  collisionWithPassage(position: THREE.Vector3) {
    return this.maze.distanceToWestPassage(position) < this.player.radius
      || this.maze.distanceToEastPassage(position) < this.player.radius
      || this.maze.distanceToNorthPassage(position) < this.player.radius
      || this.maze.distanceToSouthPassage(position) < this.player.radius
      ;
  }

  collisionWithPortaElevador(position: THREE.Vector3) {
      return this.maze.distanceToWestPortaElevador(position) < this.player.radius
      || this.maze.distanceToEastPortaElevador(position) < this.player.radius
      || this.maze.distanceToNorthPortaElevador(position) < this.player.radius
      || this.maze.distanceToSouthPortaElevador(position) < this.player.radius
      ;
  }

  collisionWithParedesElevador(position: THREE.Vector3) {
    return this.maze.distanceToWestElevador(position) < this.player.radius
    || this.maze.distanceToEastElevador(position) < this.player.radius
    || this.maze.distanceToNorthElevador(position) < this.player.radius
    || this.maze.distanceToSouthElevador(position) < this.player.radius
  }
  collisionWithPorta(position: THREE.Vector3) {
    return this.maze.distanceToWestDoor(position) < this.player.radius
      || this.maze.distanceToEastDoor(position) < this.player.radius
      || this.maze.distanceToNorthDoor(position) < this.player.radius
      || this.maze.distanceToSouthDoor(position) < this.player.radius
  }

  collisionWithParede(position: THREE.Vector3) {
    return this.maze.distanceToWestWall(position) < this.player.radius
      || this.maze.distanceToEastWall(position) < this.player.radius
      || this.maze.distanceToNorthWall(position) < this.player.radius
      || this.maze.distanceToSouthWall(position) < this.player.radius
  }

  fecharPopup() {
    this.popupPisosElevadorOpen = false;
  }

  atravessarPassagem(resposta: boolean) {
    if(resposta == true){
      this.mapaService.exportarMapaAtravesDeUmaPassagemEPiso(this.idPassagemAtravessar,this.maze.codigoEdificio,this.maze.numeroPiso).subscribe((data: ExportarMapa) => {
        if(this.canvas){
          this.canvas.remove();
          const elements = document.body.querySelectorAll('.lil-gui');
          elements.forEach((element) => {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          });
        }
        this.mapa = data;
        this.createScene();
        this.popupOpen = false;
        this.codigo.value = this.maze.codigoEdificio;
        this.pisoService.listarPisosMapa(this.codigo.value).subscribe({ //
          next: (data) => {
            this.listaNumeroPisos = data;
            this.numeroPiso.value = this.maze.numeroPiso.toString();
          },
          error: (error) => {
            console.error('Error fetching floor numbers:', error);
            this.listaNumeroPisos = [];
          },
          complete: () => { },
        });
      });
    }else{
      this.popupOpen = false;
    }
  }
   delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  usarElevador(piso: number){
    if(piso == this.maze.numeroPiso){
      alert("Você já está neste piso!");
    }else if(piso === Number.MIN_SAFE_INTEGER){
      alert("Por favor, selecione um piso");
    }else{
      this.mapaService.exportarMapa(this.maze.codigoEdificio, this.numeroPisoUsarElevador).subscribe((data: ExportarMapa) => {
        // Set posição inicial do robo como a posição do elevador
        if (data.elevador.orientacao === 'Norte'){
          data.posicaoInicialRobo.x = data.elevador.xCoord - 1;
          data.posicaoInicialRobo.y = data.elevador.yCoord;
        }else if (data.elevador.orientacao === 'Sul'){
          data.posicaoInicialRobo.x = data.elevador.xCoord + 1;
          data.posicaoInicialRobo.y = data.elevador.yCoord;
        } else if (data.elevador.orientacao === 'Este'){
          data.posicaoInicialRobo.x = data.elevador.xCoord;
          data.posicaoInicialRobo.y = data.elevador.yCoord + 1;
        } else if (data.elevador.orientacao === 'Oeste'){
          data.posicaoInicialRobo.x = data.elevador.xCoord;
          data.posicaoInicialRobo.y = data.elevador.yCoord - 1;
        }


        if(this.canvas){
          this.canvas.remove();
          const elements = document.body.querySelectorAll('.lil-gui');
          elements.forEach((element) => {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          });
        }

        this.mapa = data;
        this.createScene();
        this.popupPisosElevadorOpen = false;
        this.codigo.value = this.maze.codigoEdificio;
        this.pisoService.listarPisosMapa(this.codigo.value).subscribe({ 
          
          next: (data) => {
            this.listaNumeroPisos = data;
            this.numeroPiso.value = piso.toString();
          },
          error: (error) => {
            console.error('Error fetching floor numbers:', error);
            this.listaNumeroPisos = [];
          },
          complete: () => { },
        });
      });
    }
    this.numeroPisoUsarElevador = Number.MIN_SAFE_INTEGER;
  }

  update() {
    if (!this.gameRunning) {
      if (this.maze.loaded && this.player.loaded) {
        // If all resources have been loaded
        // Add the maze, the player and the lights to the scene
        this.scene3D.add(this.maze.object);
        this.scene3D.add(this.player.object);
        this.scene3D.add(this.light.object);
        this.popupAlertElevador = false;
        this.popupAlertPassagem = false;

        // Create the clock
        this.clock = new THREE.Clock();

        // Create model animations (states, emotes and expressions)
        /*
        this.animations = new Animations(
          this.player.object,
          this.player.animations
        );
        */


        // Set the player's position and direction
        this.player.object.position.set(
          this.maze.initialPosition.x,
          this.maze.initialPosition.y,
          this.maze.initialPosition.z
        );
        
        // Create the user interface
        this.userInterface = new UserInterface(
          this.scene3D,
          this.renderer,
          {
            object: {
              ambientLight: this.light.ambientLight,
              pointLight1: this.light.pointLight1,
              pointLight2: this.light.pointLight2,
            },
          },
          /*this.fog,*/ this.player.object /*, this.animations*/
          );
          console.log('Game started');
          // Start the game
          this.player.object.direction = this.initialDirection;
          if(this.automaticMode && this.pontoAtualTarefa === 0){
            this.player.object.keyStates = true;
            this.player.keyStates.forward = true;
            this.pontoAtualTarefa = 0.5;
            this.chegou = false;
          }
          if(this.automaticMode &&  this.carregouPiso){
            this.setActiveViewCamera(this.thirdPersonViewCamera);
            if(this.pontoAtualTarefa === this.listaPontos.length - 1){
              this.tarefaConcluida = true;
              console.log("Tarefa concluída!");
              alert("Tarefa concluída!")
            }else{
              this.player.keyStates.forward = true;
              this.player.object.direction = this.initialDirection;
              this.chegou = false;
            }
          }

          this.gameRunning = true;
      }
      
    } else {

      if (!this.popupOpen && !this.popupPisosElevadorOpen) {
        if(this.tarefaConcluida && this.automaticMode && this.numeroEntradas === 0){
          this.numeroEntradas++;
          if(this.numeroEdificioAtual !== this.listaPontosEdificio.length - 1){
            this.mapaService.exportarMapa(this.listaPontosEdificio[this.numeroEdificioAtual + 1][0].edificio, (this.listaPontosEdificio[this.numeroEdificioAtual + 1][0].piso)).subscribe(async (data: ExportarMapa) => {
              
                                    
              if(this.listaPontosEdificio[this.numeroEdificioAtual][0].edificio == this.listaPontosEdificio[this.numeroEdificioAtual+1][0].edificio){
                // lançar pop-up
                this.popupAlertElevador = true;
              }
              else{
                // lançar pop-up
                this.popupAlertPassagem = true;
              }
               
              
              this.numeroEntradas = 0;
              this.numeroEdificioAtual++;
              this.pontoAtualTarefa++;
              this.pontoAtualTarefaEdificio = 0.5;
              this.numeroEntradasEdificio = 0;


              if(data.matriz[0].length - 1 === this.listaPontos[this.pontoAtualTarefa].x || data.matriz.length - 1 === this.listaPontos[this.pontoAtualTarefa].y){
                this.listaPontos.splice(this.pontoAtualTarefa, 1);
                this.listaPontosEdificio[this.numeroEdificioAtual].splice(0,1);
                this.listaPontosCartesian.splice(this.pontoAtualTarefa, 1);
              }
              this.mapa = data;
              this.carregouPiso = false;
              this.renderer.clear();
              if(this.canvas){
                this.canvas.remove();
                const elements = document.body.querySelectorAll('.lil-gui');
                elements.forEach((element) => {
                  if (element.parentNode) {
                    element.parentNode.removeChild(element);
                  }
                });
              }
              this.createScene();
              this.setListaPontosCartesian();
              this.tarefaConcluida = false;
              this.listaCodigos[0] = this.listaPontosEdificio[this.numeroEdificioAtual][0].edificio;
              this.codigo = this.listaCodigos[0];
              this.listaNumeroPisos[0] = this.listaPontosEdificio[this.numeroEdificioAtual][0].piso;
              this.numeroPiso = this.listaNumeroPisos[0];
            });

          }
        }
        // Update the model animations
        const deltaT = this.clock.getDelta();
        // this.animations.update(deltaT);

        //if (!this.animations.actionInProgress) {
        // Check if the player found the exit
        //if (this.maze.foundExit(this.player.position)) {
        //this.finalSequence();
        //} else {
          
        let coveredDistance = this.player.walkingSpeed * deltaT;
        if(this.automaticMode && !this.tarefaConcluida){
          if(this.chegou === false && this.pontoAtualTarefa < this.listaPontos.length - 1 && this.listaPontos[Math.floor(this.pontoAtualTarefa) + 1].edificio === this.listaPontos[Math.floor(this.pontoAtualTarefa)].edificio && this.listaPontos[Math.floor(this.pontoAtualTarefa) + 1].piso === this.listaPontos[Math.floor(this.pontoAtualTarefa)].piso){
            if(this.player.object.position.x >= this.listaPontosCartesian[Math.floor(this.pontoAtualTarefa)+1].cartesian.x - 0.03&&
              this.player.object.position.x <= this.listaPontosCartesian[Math.floor(this.pontoAtualTarefa)+1].cartesian.x + 0.03 &&
              this.player.object.position.z >=this.listaPontosCartesian[Math.floor(this.pontoAtualTarefa)+1].cartesian.z -0.03 &&
              this.player.object.position.z <= this.listaPontosCartesian[Math.floor(this.pontoAtualTarefa)+1].cartesian.z + 0.03){
                this.player.keyStates.forward = false;
                this.player.object.position.x = this.listaPontosCartesian[Math.floor(this.pontoAtualTarefa)+1].cartesian.x;
                this.player.object.position.z = this.listaPontosCartesian[Math.floor(this.pontoAtualTarefa)+1].cartesian.z;
                if(this.numeroEntradasEdificio !== 0){
                  this.pontoAtualTarefa = Math.floor(this.pontoAtualTarefa)+1;
                  this.pontoAtualTarefaEdificio = Math.floor(this.pontoAtualTarefaEdificio)+1;
                }
                this.numeroEntradasEdificio++;
                this.chegou = true;
                if(this.pontoAtualTarefa < this.listaPontos.length - 1 && this.listaPontos[Math.floor(this.pontoAtualTarefa) + 1].edificio === this.listaPontos[Math.floor(this.pontoAtualTarefa)].edificio){
                  let xDiff = this.listaPontos[Math.floor(this.pontoAtualTarefa) + 1].x - this.maze.cartesianToCell(this.player.object.position)[1];
                  let yDiff = this.listaPontos[Math.floor(this.pontoAtualTarefa) + 1].y - this.maze.cartesianToCell(this.player.object.position)[0];
                  this.virarRelogio = undefined;
                  if(xDiff > 0){
                    if(yDiff > 0){
                      this.objetivoDirecao = 45;
                    }else if(yDiff < 0){
                      this.objetivoDirecao = 135;
                    }else{
                      this.objetivoDirecao = 90;
                    }
                  }else if (xDiff < 0){
                    if(yDiff > 0){
                      this.objetivoDirecao = 315;
                    }else if(yDiff < 0){
                      this.objetivoDirecao = 225;
                    }else{
                      this.objetivoDirecao = 270;
                    }
                  }else{
                    if(yDiff > 0){
                      this.objetivoDirecao = 0;
                    }else if(yDiff < 0){
                      this.objetivoDirecao = 180;
                    }
                  }
                  if(this.player.object.direction < this.objetivoDirecao){
                    this.atualMenor = true;
                  }else{
                    this.atualMenor = false;
                  }
                }
              }
            }else{
            if((this.atualMenor && this.player.object.direction >= this.objetivoDirecao) || (!this.atualMenor && this.player.object.direction <= this.objetivoDirecao)|| ((!this.atualMenor && this.player.object.direction >= 350 && this.objetivoDirecao === 0) || (this.atualMenor && this.player.object.direction <= 10 && this.objetivoDirecao === 0)) || this.collision(this.player.object.position)){
              if(this.pontoAtualTarefaEdificio === this.listaPontosEdificio[this.numeroEdificioAtual].length - 1){
                if(this.numeroEdificioAtual === this.listaPontosEdificio.length - 1){
                  console.log("Tarefa concluída!");
                  alert("Tarefa concluída!")
                }
                this.player.keyStates.forward = false;
                this.tarefaConcluida = true;
              }else{
                if(this.tarefaConcluida === false){
                  this.player.object.direction = this.objetivoDirecao;
                  this.player.keyStates.forward = true;
                  this.chegou = false;
                }
              }
            }else{
              if(this.virarRelogio === undefined){
                let anguloAtual = this.player.object.direction %360;
                let anguloDestino = this.objetivoDirecao%360;
                const ponteiros = (anguloDestino - anguloAtual + 360) % 360;
                const contraponteiros = (anguloAtual - anguloDestino+ 360) % 360;
                if (ponteiros < contraponteiros || (-ponteiros >= contraponteiros - 0.001 && -ponteiros <= contraponteiros + 0.001) || (ponteiros >= contraponteiros - 0.001 && ponteiros <= contraponteiros + 0.001)) {
                  this.virarRelogio = true;
                } else {
                  this.virarRelogio = false;
                }
              }        
              if (this.virarRelogio === true) {
                  this.player.object.direction += this.player.turningSpeed * deltaT;
                  if(this.player.object.direction > 360){
                    this.player.object.direction -= 360;
                    this.atualMenor = true;
                  }
              } else {
                this.player.object.direction  -= this.player.turningSpeed * deltaT;
                if(this.player.object.direction < 0){
                  this.player.object.direction += 360;
                  this.atualMenor = false;
                }
              }
            }
          }
        }
        let directionIncrement = this.player.turningSpeed * deltaT;
        if (this.player.keyStates.run) {
          coveredDistance *= this.player.runningFactor;
          directionIncrement *= this.player.runningFactor;
        }
        if (this.player.keyStates.left) {
          this.player.object.direction += directionIncrement;
        } else if (this.player.keyStates.right) {
          this.player.object.direction -= directionIncrement;
        }
        const direction = THREE.MathUtils.degToRad(
          this.player.object.direction
        );
        if (this.player.keyStates.backward) {

          const newPosition = new THREE.Vector3(
            -coveredDistance * Math.sin(direction),
            0.0,
            -coveredDistance * Math.cos(direction)
          ).add(this.player.object.position);

          if (this.collision(newPosition)) {
            if(this.collisionWithPorta(newPosition)){
              if(this.automaticMode){
                this.player.keyStates.forward = false;
                console.log("Tarefa concluída!");
                alert("Tarefa concluída!")
                this.tarefaConcluida = true;
              }
            }else if (this.collisionWithParedesElevador(newPosition)){
              if(this.automaticMode){
                this.player.keyStates.forward = false;
                this.pontoAtualTarefa = this.pontoAtualTarefa + 2;
                this.pontoAtualTarefaEdificio = this.pontoAtualTarefaEdificio + 2;
                this.tarefaConcluida = true;
              }
            }else if(this.collisionWithParede(newPosition)){
              if(this.automaticMode){
                this.player.keyStates.forward = false;
                console.log("Tarefa concluída!");
                alert("Tarefa concluída!")
                this.tarefaConcluida = true;
              }
            }
          }else if (this.collisionWithPassage(newPosition)) {
            if(this.automaticMode){
              this.player.keyStates.forward = false;
              this.tarefaConcluida = true;
            }else{
              this.idPassagemAtravessar = this.maze.idPassagem(newPosition, this.player.radius);
              this.popupOpen = true;
            }
          } else if (this.collisionWithPortaElevador(newPosition)){
            if(this.automaticMode){
              this.player.keyStates.forward = false;
              this.tarefaConcluida = true;
            }else{
              this.popupPisosElevadorOpen = true;
            }
          } else {
            this.player.object.position.set(
              newPosition.x,
              newPosition.y,
              newPosition.z
            );        
          }
          
        } else if (this.player.keyStates.forward) {
          
          const newPosition = new THREE.Vector3(
            coveredDistance * Math.sin(direction),
            0.0,
            coveredDistance * Math.cos(direction)
          ).add(this.player.object.position);
          
          if (this.collision(newPosition)) {
            if(this.collisionWithPorta(newPosition)){
              if(this.automaticMode){
                this.player.keyStates.forward = false;
                console.log("Tarefa concluída!");
                alert("Tarefa concluída!")
                this.tarefaConcluida = true;
              }
            }else if (this.collisionWithParedesElevador(newPosition)){
              if(this.automaticMode){
                this.player.keyStates.forward = false;
                this.pontoAtualTarefa = this.pontoAtualTarefa + 2;
                this.pontoAtualTarefaEdificio = this.pontoAtualTarefaEdificio + 2;
                this.tarefaConcluida = true;
              }
            }else if(this.collisionWithParede(newPosition)){
              if(this.automaticMode){
                this.player.keyStates.forward = false;
                console.log("Tarefa concluída!");
                alert("Tarefa concluída!")
                this.tarefaConcluida = true;
              }
            }
          }else if (this.collisionWithPassage(newPosition)) {
            if(this.automaticMode){
              this.player.keyStates.forward = false;
              this.tarefaConcluida = true;
            }else{
              this.idPassagemAtravessar = this.maze.idPassagem(newPosition, this.player.radius);
              this.popupOpen = true;
            }
          } else if (this.collisionWithPortaElevador(newPosition)){
            if(this.automaticMode){
              this.player.keyStates.forward = false;
              this.pontoAtualTarefa = this.pontoAtualTarefa + 2;
              this.pontoAtualTarefaEdificio = this.pontoAtualTarefaEdificio + 2;
              this.tarefaConcluida = true;
            }else{
              this.popupPisosElevadorOpen = true;
            }
          } else {
            this.player.object.position.set(
              newPosition.x,
              newPosition.y,
              newPosition.z
            );        
          
          }
          
          /*
        } else if (this.player.keyStates.jump) {
          this.animations.fadeToAction('Jump', 0.2);
        } else if (this.player.keyStates.yes) {
          this.animations.fadeToAction('Yes', 0.2);
        } else if (this.player.keyStates.no) {
          this.animations.fadeToAction('No', 0.2);
        } else if (this.player.keyStates.wave) {
          this.animations.fadeToAction('Wave', 0.2);
        } else if (this.player.keyStates.punch) {
          this.animations.fadeToAction('Punch', 0.2);
        } else if (this.player.keyStates.thumbsUp) {
          this.animations.fadeToAction('ThumbsUp', 0.2);
        } else {
          this.animations.fadeToAction(
            'Idle',
            this.animations.activeName != 'Death' ? 0.2 : 0.6
          );
          */
        }
      
        this.player.object.position.set(
          this.player.object.position.x,
          this.player.object.position.y,
          this.player.object.position.z
        );
        this.player.object.rotation.y =
          direction - this.player.initialDirection;
        //}
        //}
      }
      // Update first-person, third-person and top view cameras parameters (player direction and target)
      this.firstPersonViewCamera.playerDirection = this.player.object.direction;
      this.thirdPersonViewCamera.playerDirection = this.player.object.direction;
      this.topViewCamera.playerDirection = this.player.object.direction;
      const target = new THREE.Vector3(
        this.player.object.position.x,
        this.player.object.position.y + this.player.eyeHeight,
        this.player.object.position.z
      );
      this.firstPersonViewCamera.setTarget(target);
      this.thirdPersonViewCamera.setTarget(target);
      this.topViewCamera.setTarget(target);

      // Update statistics
      //this.statistics.update();

      // Render primary viewport(s)
      this.renderer.clear();

      /*if (this.fog.enabled) {
                this.scene3D.fog = this.fog.object;
            }
            else {
                this.scene3D.fog = null;
            }*/
      let cameras;
      if (this.multipleViewsCheckBox.checked) {
          cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
      }
      else {
        cameras = [this.activeViewCamera];
      }
      
      for (const camera of cameras) {
        this.player.object.visible = (camera != this.firstPersonViewCamera);
        const viewport = camera.getViewport();
        this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
        
        this.renderer.render(this.scene3D, camera.object);
        //this.renderer.render(this.scene2D, this.camera2D);
        this.renderer.clearDepth();

        if(!this.multipleViewsCheckBox.checked){
          var ray: THREE.Raycaster;
          let i = new THREE.Raycaster(); 
          var vector = new THREE.Vector2( this.mouse.x, this.mouse.y );
          ray = i;
          ray.setFromCamera( vector, camera.object );

          
          
          // create an array containing all objects in the scene with which the ray intersects
          var intersects = ray.intersectObjects( this.scene3D.children );

          if ( intersects.length > 0 ){
            // update text, if it has a "name" field.
            if ( intersects[ 0 ].object.name && intersects[ 0 ].object.name != "Object_2") {
              let text = this.maze.getObjectNames(intersects[ 0 ].point);
              if(this.tooltip != null && text != ""){
                this.tooltip.style.display = 'block';
                this.tooltip.innerHTML = text; // Replace with desired text            
              }

            } else {
              if(this.tooltip != null){
                this.tooltip.style.display = 'none';
              }
            }
          }
        }  
      }

      // Render secondary viewport (mini-map)
      /*if (this.miniMapCheckBox.checked) {
                this.scene3D.fog = null;
                this.player.object.visible = true;
                const viewport = this.miniMapCamera.getViewport();
                this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene3D, this.miniMapCamera.object);
                this.renderer.render(this.scene2D, this.camera2D);
            }*/
    }
  }
}

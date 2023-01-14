//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G18400-2021 拓殖太郎
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import {OrbitControls} from "orbit";
import { GUI } from "gui";
import { BoxGeometry, CircleGeometry, LessEqualStencilFunc, Mesh, MeshPhongMaterial, Vector3 } from "three";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(1,100,1);
  camera.lookAt(0,0,0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x102040);
  renderer.setSize(window.innerWidth, innerHeight);
  document.getElementById("output").appendChild(renderer.domElement);

  // camera control
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDumping = true;

  const texttureLoader = new THREE.TextureLoader();
  const seaTexture = texttureLoader.load("sea-material-image.jpg");

  //平面の設定
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 32),
    new THREE.MeshPhongMaterial({
      color:0x6495ED,
    })
  );
  sphere.position.set(0, -62, 0);
  scene.add(sphere);

  //railroad 
  const railroad = new THREE.Group();
  const steelMaterial = new THREE.MeshPhongMaterial({color: 0x71797E});
  const woodMaterial = new THREE.MeshPhongMaterial({color: 0x966F33});
  const railLine1 = new THREE.Mesh(
    new THREE.TorusGeometry(59, 1, 10, 200, 2*Math.PI),
    steelMaterial
  )
  railLine1.position.z = 2;
  const railLine2 = new THREE.Mesh(
    new THREE.TorusGeometry(59, 1, 10, 200, 2*Math.PI),
    steelMaterial
  )
  railLine2.position.z = -2;
  railroad.add(railLine1);
  railroad.add(railLine2);
  let beam;
  for (let i = 0; i < 2*Math.PI; i+=0.05) {
    beam = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.2, 7),
      woodMaterial,  
    )
    const beamX = Math.cos(i%(2*Math.PI))*60;
    const beamY = Math.sin(i%(2*Math.PI))*60;
    beam.rotateZ(i+Math.PI/2);
    beam.position.set(beamX, beamY, 0);
    railroad.add(beam);
  }
  railroad.position.set(0, -62, 0);
  scene.add(railroad);

  //駅を作成
  //fence
  function createFence() {
    const fence = new THREE.Group();
    const fenceMaterial = new THREE.MeshPhongMaterial({color: 0x5F6A6A});
    let horizonLine = new THREE.Mesh(
      new BoxGeometry(10, 0.5, 0.5),
      fenceMaterial 
    )
    let verticalLine = new THREE.Mesh(
      new BoxGeometry(0.5, 2, 0.5),
      fenceMaterial,
    )
    const horizonLine2 = horizonLine.clone();
    horizonLine2.position.set(0, 1, 0);
    fence.add(horizonLine);
    fence.add(horizonLine2);

    const verticalLine2 = verticalLine.clone();
    verticalLine2.position.set(-4, 0, 0);
    fence.add(verticalLine2);
    const verticalLine3 = verticalLine.clone();
    verticalLine3.position.set(-3, 0, 0);
    fence.add(verticalLine3);
    const verticalLine4 = verticalLine.clone();
    verticalLine4.position.set(4, 0, 0);
    verticalLine.position.set(3, 0 ,0);
    fence.add(verticalLine);
    fence.add(verticalLine4);
     
    return fence;
  }

  const stationMaterial = new THREE.MeshPhongMaterial({color: 0xe0e0eb});
  const roofMaterial = new THREE.MeshPhongMaterial({color: 0x3498DB});
  const wallMaterial = new THREE.MeshPhongMaterial({color: 0x943126})
  { // right station
    const rightStation = new THREE.Mesh(
      new THREE.BoxGeometry(40, 2, 20),
      stationMaterial
    )
    const fence = createFence();
    fence.position.set(-15, 2, 5);
    rightStation.add(fence);
    const fence2 = createFence();
    fence2.position.set(15, 2, 5);
    rightStation.add(fence2);
    rightStation.position.set(0, 0, 18);
    
    const pillar1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 10, 1),
      wallMaterial
    )
    pillar1.position.set(-5, 5, 8);
    rightStation.add(pillar1);
    const pillar2 = pillar1.clone();
    pillar2.position.set(5, 5, 8);
    rightStation.add(pillar2);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(12, 2, 0.3),
      new THREE.MeshPhongMaterial({color: "white"})
    );
    board.position.set(0, 8.3, 8);
    rightStation.add(board);
    scene.add(rightStation);

    
  }

  {//left station
    const leftStation = new THREE.Mesh(
      new THREE.BoxGeometry(40, 2, 20),
      stationMaterial
    )
    const fence3 = createFence();
    fence3.position.set(-18, 2, -1);
    fence3.rotateY(Math.PI/2);
    leftStation.add(fence3);
    const fence4 = createFence();
    fence4.position.set(18, 2, -1);
    fence4.rotateY(Math.PI/2);
    leftStation.add(fence4);
    leftStation.position.set(0, 0, -18);
    
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(35, 8, 0.5),
      wallMaterial
    )
    wall.position.set(0, 2, -8);
    leftStation.add(wall);

    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(35, 4, 0.5),
      roofMaterial
    )
    roof.position.set(0, 7.8, -7);
    roof.rotateX(Math.PI/6);
    leftStation.add(roof);
    scene.add(leftStation);
  }

  //車両を作成
  function createTrain(isHead) {
    const train = new THREE.Group();
    let mesh;
    const tyreMaterial = new THREE.MeshPhongMaterial({color:'black'});
    //タイヤの追加
    const lefttyres = new THREE.Group();
    const tyreR = 0.5;
    const tyreW = 0.3;
    for (let i = 0; i < 5; i++) {
      mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1), tyreMaterial
      );
      mesh.rotateX(Math.PI/2);
      mesh.position.set(i*1.5-3, -2, 2);
      lefttyres.add(mesh);
    }
    train.add(lefttyres);
    //right tyre
    const righttyres = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(tyreR, tyreR, tyreW, 16, 1), tyreMaterial
      );
      mesh.rotateX(Math.PI/2);
      mesh.position.set(i*1.5-3, -2, -2);
      righttyres.add(mesh);
    }
    train.add(righttyres);
      
    //train body
    const body = new THREE.Group();
    const windownMaterial = new THREE.MeshPhongMaterial({color: 0x33cccc});
    const bodyMaterial = new THREE.MeshPhongMaterial({color: 0x006600});
    mesh = new THREE.Mesh(
      new THREE.BoxGeometry(10,4,4),
      bodyMaterial
    );
    for (let i=0; i<4; i++) {
      //right windown
      let windown = new THREE.Mesh(
        new THREE.PlaneGeometry(2,1),
        windownMaterial
      );
      windown.rotateZ(-Math.PI/2);
      windown.position.set(i*2-3, 0, 2.1);
      body.add(windown);
      //left windown
      let windown2 = new THREE.Mesh(
        new THREE.PlaneGeometry(2,1),
        windownMaterial
      );
      windown2.rotateZ(-Math.PI/2);
      windown2.rotateY(-Math.PI)
      windown2.position.set(i*2-3,0,-2.1);
      body.add(windown2);
    }
    
    body.add(mesh);
    train.add(body);
    //top
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(2,2,10,5,1,false,0,Math.PI),
      new THREE.MeshPhongMaterial({color: 0xcccc00})
    );
    top.rotateZ(Math.PI/2)
    top.position.y = 2;
    train.add(top);

    //train head
    if (isHead) {
      const length = 0.1, width = 0.3;
      const shape = new THREE.Shape();
      shape.moveTo( 0,0 );
      shape.lineTo( 0, width );
      shape.lineTo( length, width );
      shape.lineTo( length, 0 );
      shape.lineTo( 0, 0 );
      const extrudeSettings = {
        steps: 1,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 0.5,
        bevelOffset: 0.5,
        bevelSegments: 1
      };
      mesh = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, extrudeSettings),
        [
          bodyMaterial,
          windownMaterial,
          bodyMaterial,
          bodyMaterial,
          bodyMaterial,
          bodyMaterial
        ]
      );
      mesh.position.set(4.8,0.2,-0.5);
      train.add(mesh);
    }
  
    return train;
  }
  //電車を作成
  function createResha() {
    const trains = new THREE.Group();
    //両１
    const head = createTrain(true);
    head.position.set(11,-1,0);
    head.rotateZ(-0.184);
    trains.add(head);
    //両 2
    const middle = createTrain();
    trains.add(middle);
    const chain =  new Mesh(
      new THREE.BoxGeometry(5,0.5,0.5),
      new THREE.MeshBasicMaterial({color: 'black'})
    )
    chain.position.set(5, -1, 0);
    middle.add(chain);
    const chain2 = chain.clone();
    chain2.position.set(-5, -1, 0);
    middle.add(chain2);
    //両 3
    const last = createTrain(true);
    last.rotateY(Math.PI);
    last.position.set(-11, -1, 0);
    last.rotateZ(-0.184);
    trains.add(last);

    return trains;
  }
  // 電車を生成
  const trains = createResha();
  trains.position.set(0, 2.5, 0);
  scene.add(trains);
  
  // 描画処理
  
  // 環境ライト
  {
    const light = new THREE.AmbientLight();
    light.intensity=0.6;
    scene.add(light);
  }

  // 単方向ライト
  // { 
  //   const light = new THREE.DirectionalLight();
  //   light.position.set(50, 50, 30); 
  //   // ここから原点に向かう線と平行に光が差す
  //   scene.add(light);
  // }

  //画像処理

  // 描画関数
  let r =62;
  let theta = 0;
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;
    //電車の位置と向きの設定
    if (theta == 1.57) {
      console.log(theta);
    }

    theta = (theta+0.01)%(2*Math.PI);
    const theta2 = (theta+0.01)%(2*Math.PI);
    trains.position.x = (r)*Math.cos(theta);
    trains.position.y = (r)*Math.sin(theta) - r;
    trains.lookAt(new Vector3(r*Math.cos(theta2), r*Math.sin(theta2)-r, 0));
    if (trains.position.y <= -62) {
      trains.lookAt(new Vector3(r*Math.cos(theta2), r*Math.sin(theta2)-r, 0));
      trains.rotateX(-Math.PI);
    }else {
      trains.lookAt(new Vector3(r*Math.cos(theta2), r*Math.sin(theta2)-r, 0));
    }
    trains.rotateY(-Math.PI/2);
    // 描画
    renderer.render(scene, camera);
    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();
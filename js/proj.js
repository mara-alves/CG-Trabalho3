/*global THREE*/

//cameras, scene and renderer
var camera, camera1, camera2, camera3, scene, renderer;
//geometry, material and mesh for objects
var geometry, material, mesh, lamp, bulb;

var altScene, altCamera;
var stereo;

var ratio = 1.25,
  scale = 0.01,
  scale_width,
  scale_height,
  last_width,
  last_height;

var clock = new THREE.Clock();
var delta;

//objects
var floor;
var palanque, box, step1, step2; //palanque
var figure1, figure2, figure3; //origamis
var pauseScreen;

const objects = [];

//textures
var wood;
var boxmat, step1mat, step2mat, floormat, origamimat;

var origamiTexture = new THREE.TextureLoader().load("textures/origami.jpg");
var origami = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(0, 1),
  new THREE.Vector2(1, 1),
  new THREE.Vector2(1, 0),
];

var pauseTexture = new THREE.TextureLoader().load("textures/pause.jpg");

//booleans for onKeyDown/onKeyUp Events
var boolCamera1 = true;  //1
var boolCamera2 = false; //2
var boolPause = false;   //P(p)
var boolReset = false;   //M(m)

var rotYPosPiece1 = false; //Q(q)
var rotYNegPiece1 = false; //W(w)
var rotYPosPiece2 = false; //E(e)
var rotYNegPiece2 = false; //R(r)
var rotYPosPiece3 = false; //T(t)
var rotYNegPiece3 = false; //Y(y)

var changeShadowType = false; //A(a)
var lightCalc = true; //S(s)

var light;
var directionalLight = true; //D(d)
var spot1;
var spotLightPiece1 = false; //Z(z)
var spot2;
var spotLightPiece2 = false; //X(x)
var spot3;
var spotLightPiece3 = false; //C(c)

//renders scene
function render() {
  "use strict";

  delta = clock.getDelta();

  renderer.autoClear = false;
  renderer.clear();
  renderer.render(scene, camera);
  if (boolPause){
    renderer.clearDepth();
    renderer.render(altScene, altCamera);
  }
}

function createFixedPerspCamera() {
  "use strict";

  camera1 = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera1.position.set(0, 20, 80);
  camera1.lookAt(scene.position);
}

function createOrtCamera() {
  "use strict";

  scale_width = window.innerWidth * scale;
  scale_height = window.innerHeight * scale * ratio;

  if (window.innerWidth / window.innerHeight > 1.25) {
    camera2 = new THREE.OrthographicCamera(
      -window.innerWidth / scale_height,
      window.innerWidth / scale_height,
      window.innerHeight / scale_height,
      -window.innerHeight / scale_height,
      1,
      1000
    );
  } else {
    camera2 = new THREE.OrthographicCamera(
      -window.innerWidth / scale_width,
      window.innerWidth / scale_width,
      window.innerHeight / scale_width,
      -window.innerHeight / scale_width,
      1,
      1000
    );
  }

  last_width = window.innerWidth;
  last_height = window.innerHeight;

  camera2.position.set(0, 0, 200);
  camera2.lookAt(scene.position);
}

function createStereoCamera() {
  "use strict";
  stereo = new THREE.StereoCamera();
}

function createCameras() {
  "use strict";

  createOrtCamera();
  createFixedPerspCamera();
  createStereoCamera();
  camera = camera1;
}

function createFloor() {
  "use strict";
  wood.wrapS = THREE.RepeatWrapping;
  wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(5, 5);

  geometry = new THREE.BoxGeometry(500, 100, 10);
  material = floormat[1];

  floor = new THREE.Mesh(geometry, material);
  floor.translateY(-34);
  floor.rotateX(Math.PI / 2);
  scene.add(floor);

  objects.push(floor);
}

function createPalanque() {
  "use strict";
  palanque = new THREE.Object3D();

  material = boxmat[1];
  geometry = new THREE.BoxGeometry(150, 10, 17, 50, 1, 10);
  box = new THREE.Mesh(geometry, material);
  box.position.set(0, 0, 0);
  palanque.add(box);

  material = step1mat[1];
  geometry = new THREE.BoxGeometry(45, 6, 8, 50, 1, 10);
  step1 = new THREE.Mesh(geometry, material);
  step1.position.set(0, 0, 14);
  palanque.add(step1);

  material = step2mat[1];
  geometry = new THREE.BoxGeometry(25, 3, 8, 50, 1, 10);
  step2 = new THREE.Mesh(geometry, material);
  step2.position.set(0, 0, 22);
  palanque.add(step2);

  palanque.translateY(-28);
  scene.add(palanque);

  objects.push(palanque);
  objects.push(box);
  objects.push(step1);
  objects.push(step2);
}

function createFigure1() {
  "use strict";
  material = origamimat[2];

  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(-10.6, 10.6, 1), //left
    new THREE.Vector3(10.6, 10.6, 1),  //right
    new THREE.Vector3(0, 21.2, 0),
    new THREE.Vector3(0, 0, 0)
  );
  geometry.faces.push(
    new THREE.Face3(0, 3, 2),
    new THREE.Face3(1, 2, 3),
    new THREE.Face3(3, 2, 1),
    new THREE.Face3(2, 3, 0)
  );

  geometry.faces[0].color = geometry.faces[0].color = new THREE.Color("white");
  geometry.faces[1].color = geometry.faces[1].color = new THREE.Color("white");
  geometry.faces[2].color = geometry.faces[2].color = new THREE.Color("white");
  geometry.faces[3].color = geometry.faces[3].color = new THREE.Color("white");

  geometry.faceVertexUvs[0] = [];

  geometry.faceVertexUvs[0][2] = [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][3] = [origami[2], origami[3], origami[1]];

  geometry.computeFaceNormals();

  figure1 = new THREE.Mesh(geometry, material);
  figure1.position.set(-45, -15, 0);
  scene.add(figure1);

  objects.push(figure1);
}

function createFigure2() {
  "use strict";
  material = origamimat[2];

  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(0, 21.2, 0), //topo
    new THREE.Vector3(-0.5, 16.2, 2), //centro left
    new THREE.Vector3(0, 0, 0), //baixo
    new THREE.Vector3(3.5, 17.7, 0), //cima dir
    new THREE.Vector3(-3.5, 17.7, 0), //cima left
    new THREE.Vector3(3, 15, 0), //baixo dir
    new THREE.Vector3(-3, 15, 0), //baixo left 
    new THREE.Vector3(-0.5, 15, -1), //tras centro esq
    new THREE.Vector3(0.5, 16.2, 2), //frente centro dir
    new THREE.Vector3(0.5, 15, -1), //tras centro dir
  );
  geometry.faces.push(
    new THREE.Face3(0, 2, 3), //0 no color
    new THREE.Face3(0, 4, 2), //1  no color
    new THREE.Face3(1, 4, 6), //2
    new THREE.Face3(3, 8, 5), //3
    new THREE.Face3(1, 6, 2), //4
    new THREE.Face3(8, 2, 5), //5
    new THREE.Face3(0, 3, 2), //6
    new THREE.Face3(0, 2, 4), //7
    new THREE.Face3(5, 2, 9), //8
    new THREE.Face3(7, 2, 6), //9
    new THREE.Face3(3, 2, 8), //10
    new THREE.Face3(4, 1, 2), //11
    new THREE.Face3(5, 9, 2), //12
    new THREE.Face3(6, 2, 7)  //13
  );

  geometry.faces[0].color = new THREE.Color("grey");
  geometry.faces[1].color = new THREE.Color("grey");
  geometry.faces[2].color = new THREE.Color("white");
  geometry.faces[3].color = new THREE.Color("white");
  geometry.faces[4].color = new THREE.Color("grey");
  geometry.faces[5].color = new THREE.Color("grey");
  geometry.faces[6].color = new THREE.Color("white");
  geometry.faces[7].color = new THREE.Color("white");
  geometry.faces[8].color = new THREE.Color("grey");
  geometry.faces[9].color = new THREE.Color("grey");
  geometry.faces[10].color = new THREE.Color("grey");
  geometry.faces[11].color = new THREE.Color("grey");
  geometry.faces[12].color = new THREE.Color("white");
  geometry.faces[13].color = new THREE.Color("white");

  geometry.faceVertexUvs[0] = [];

  geometry.faceVertexUvs[0][0] =  [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][1] =  [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][4] =  [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][5] =  [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][8] =  [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][9] =  [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][10] = [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][11] = [origami[0], origami[1], origami[3]];

  geometry.computeFaceNormals();

  figure2 = new THREE.Mesh(geometry, material);
  figure2.position.set(0, -15, 0);
  scene.add(figure2);

  objects.push(figure2);
}

function createFigure3() {
  "use strict";
  material = origamimat[2];

  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(0, 0, 1.3), //V1
    new THREE.Vector3(0, 0, -1.3), //V2
    new THREE.Vector3(-3, 0, 1.5), //V3
    new THREE.Vector3(-3, 0, -1.5), //V4
    new THREE.Vector3(-5.7, 0, 1.7), //V5
    new THREE.Vector3(-5.7, 0, -1.7), //V6
    new THREE.Vector3(-8.6, 4.1, 0), //V7
    new THREE.Vector3(-3.7, 3.2, 2), //V8
    new THREE.Vector3(-3.7, 3.2, -2), //V9
    new THREE.Vector3(0.3, 2.5, 1.1), //V10
    new THREE.Vector3(0.3, 2.5, -1.1), //V11
    new THREE.Vector3(2.4, 1.8, 0.1), //V12
    new THREE.Vector3(2.4, 1.8, -0.1), //V13
    new THREE.Vector3(1.1, 8.2, 0.5), //V14
    new THREE.Vector3(1.1, 8.2, -0.5), //V15
    new THREE.Vector3(1.9, 8.5, 0.1), //V16
    new THREE.Vector3(1.9, 8.5, -0.1), //V17
    new THREE.Vector3(2.4, 8, 0.1), //V18
    new THREE.Vector3(2.4, 8, -0.1), //V19
    new THREE.Vector3(4.2, 6, 0), //V20
    new THREE.Vector3(2.5, 1.9, 0), //V21
    new THREE.Vector3(2, 8.6, 0) //V22
  );

  geometry.faces.push(
    //right flap
    new THREE.Face3(4, 2, 7), //1
    new THREE.Face3(2, 0, 7), //2
    new THREE.Face3(0, 9, 7), //3
    new THREE.Face3(0, 11, 9), //4
    new THREE.Face3(11, 13, 9), //5
    new THREE.Face3(11, 17, 13), //6
    new THREE.Face3(17, 15, 13), //7
    new THREE.Face3(19, 15, 17), //8
    /*---------------------------------*/
    //left flap
    new THREE.Face3(3, 5, 8), //9
    new THREE.Face3(1, 3, 8), //10
    new THREE.Face3(1, 8, 10), //11
    new THREE.Face3(1, 10, 12), //12
    new THREE.Face3(10, 18, 12), //13
    new THREE.Face3(10, 14, 18), //14
    new THREE.Face3(18, 14, 16), //15
    new THREE.Face3(19, 18, 16), //16
    /*---------------------------------*/
    //right body (inside)
    new THREE.Face3(4, 0, 6), //17
    new THREE.Face3(0, 20, 6), //18
    /*---------------------------------*/
    //left body (inside)
    new THREE.Face3(1, 5, 6), //19
    new THREE.Face3(1, 6, 20), //20
    /*---------------------------------*/
    //left neck (inside - back)
    new THREE.Face3(1, 20, 10), //21
    new THREE.Face3(20, 21, 10), //22
    new THREE.Face3(10, 21, 14), //23
    /*---------------------------------*/
    //right neck (inside - back)
    new THREE.Face3(0, 9, 20), //24
    new THREE.Face3(20, 9, 13), //25
    new THREE.Face3(20, 13, 21), //26
    /*---------------------------------*/
    //right flap (inside)
    new THREE.Face3(4, 7, 0), //27
    new THREE.Face3(0, 7, 20), //28
    /*---------------------------------*/
    //left flap (inside)
    new THREE.Face3(5, 1, 8), //29
    new THREE.Face3(1, 20, 8), //30
    /*---------------------------------*/
    //left head (inside)
    new THREE.Face3(19, 14, 21), //31
    /*---------------------------------*/
    //right head (inside)
    new THREE.Face3(19, 21, 13), //32
    /*---------------------------------*/
    //right neck (inside - front)
    new THREE.Face3(0, 20, 21), //33
    new THREE.Face3(20, 21, 13), //34
    /*---------------------------------*/
    //left neck (inside - front)
    new THREE.Face3(1, 21, 20), //35
    new THREE.Face3(1, 14, 21), //36
    /*---------------------------------*/
    //inside body
    new THREE.Face3(0, 4, 6), //37
    new THREE.Face3(1, 6, 5), //38
    new THREE.Face3(0, 6, 20), //39
    new THREE.Face3(1, 20, 5) //40
  );

  geometry.faces[0].color = new THREE.Color("#ffffff");
  geometry.faces[8].color = new THREE.Color("#ffffff");
  geometry.faces[32].color = new THREE.Color("#ffffff");
  geometry.faces[33].color = new THREE.Color("#ffffff");
  geometry.faces[34].color = new THREE.Color("#ffffff");
  geometry.faces[35].color = new THREE.Color("#ffffff");

  geometry.faces[ 1].color = new THREE.Color("#bfbfbf");
  geometry.faces[ 2].color = new THREE.Color("#bfbfbf");
  geometry.faces[ 3].color = new THREE.Color("#bfbfbf");
  geometry.faces[ 4].color = new THREE.Color("#bfbfbf");
  geometry.faces[ 5].color = new THREE.Color("#bfbfbf");
  geometry.faces[ 6].color = new THREE.Color("#bfbfbf");
  geometry.faces[ 7].color = new THREE.Color("#bfbfbf");

  geometry.faces[9].color = new THREE.Color("#bfbfbf");
  geometry.faces[10].color = new THREE.Color("#bfbfbf");
  geometry.faces[11].color = new THREE.Color("#bfbfbf");
  geometry.faces[12].color = new THREE.Color("#bfbfbf");
  geometry.faces[13].color = new THREE.Color("#bfbfbf");
  geometry.faces[14].color = new THREE.Color("#bfbfbf");
  geometry.faces[15].color = new THREE.Color("#bfbfbf");

  geometry.faces[16].color = new THREE.Color("#bfbfbf");
  geometry.faces[17].color = new THREE.Color("#bfbfbf");

  geometry.faces[18].color = new THREE.Color("#bfbfbf");
  geometry.faces[19].color = new THREE.Color("#bfbfbf");

  geometry.faces[20].color = new THREE.Color("#bfbfbf");
  geometry.faces[21].color = new THREE.Color("#bfbfbf");
  geometry.faces[22].color = new THREE.Color("#bfbfbf");

  geometry.faces[23].color = new THREE.Color("#bfbfbf");
  geometry.faces[24].color = new THREE.Color("#bfbfbf");
  geometry.faces[25].color = new THREE.Color("#bfbfbf");

  geometry.faces[26].color = new THREE.Color("#bfbfbf");
  geometry.faces[27].color = new THREE.Color("#bfbfbf");

  geometry.faces[28].color = new THREE.Color("#bfbfbf");
  geometry.faces[29].color = new THREE.Color("#bfbfbf");

  geometry.faces[30].color = new THREE.Color("#bfbfbf");

  geometry.faces[31].color = new THREE.Color("#bfbfbf");

  geometry.faces[36].color = new THREE.Color("#bfbfbf");
  geometry.faces[37].color = new THREE.Color("#bfbfbf");
  geometry.faces[38].color = new THREE.Color("#bfbfbf");
  geometry.faces[39].color = new THREE.Color("#bfbfbf");

  geometry.faceVertexUvs[0] = [];

  geometry.faceVertexUvs[0][1] =  [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][2] =  [origami[0], origami[2], origami[3]];
  geometry.faceVertexUvs[0][3] =  [origami[3], origami[1], origami[2]];
  geometry.faceVertexUvs[0][4] =  [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][5] =  [origami[0], origami[2], origami[3]];
  geometry.faceVertexUvs[0][6] =  [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][7] =  [origami[0], origami[1], origami[3]];

  geometry.faceVertexUvs[0][9] =  [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][10] = [origami[0], origami[2], origami[3]];
  geometry.faceVertexUvs[0][11] = [origami[3], origami[1], origami[2]];
  geometry.faceVertexUvs[0][12] = [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][13] = [origami[0], origami[2], origami[3]];
  geometry.faceVertexUvs[0][14] = [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][15] = [origami[0], origami[1], origami[3]];

  geometry.faceVertexUvs[0][16] = [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][17] = [origami[3], origami[1], origami[2]];

  geometry.faceVertexUvs[0][18] = [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][19] = [origami[3], origami[1], origami[2]];

  geometry.faceVertexUvs[0][20] = [origami[0], origami[2], origami[3]];
  geometry.faceVertexUvs[0][21] = [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][22] = [origami[0], origami[2], origami[3]];

  geometry.faceVertexUvs[0][23] = [origami[0], origami[2], origami[3]];
  geometry.faceVertexUvs[0][24] = [origami[0], origami[1], origami[3]];
  geometry.faceVertexUvs[0][25] = [origami[0], origami[2], origami[3]];

  geometry.faceVertexUvs[0][26] = [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][27] = [origami[0], origami[1], origami[2]];

  geometry.faceVertexUvs[0][28] = [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][29] = [origami[0], origami[1], origami[2]];

  geometry.faceVertexUvs[0][30] = [origami[0], origami[1], origami[2]];

  geometry.faceVertexUvs[0][31] = [origami[0], origami[1], origami[2]];

  geometry.faceVertexUvs[0][36] = [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][37] = [origami[0], origami[1], origami[2]];
  geometry.faceVertexUvs[0][38] = [origami[0], origami[2], origami[3]];
  geometry.faceVertexUvs[0][39] = [origami[0], origami[2], origami[3]];

  geometry.computeFaceNormals();

  figure3 = new THREE.Mesh(geometry, material);
  figure3.position.set(45, -15, 0);
  scene.add(figure3);

  objects.push(figure3);
}

function createLamps() {
  "use strict";
  //lamp1
  material = new THREE.MeshBasicMaterial({ color: "#000000" });
  geometry = new THREE.ConeGeometry(5, 10, 20, 1, false);
  lamp = new THREE.Mesh(geometry, material);

  material = new THREE.MeshBasicMaterial({ color: "#fff000" });
  geometry = new THREE.SphereGeometry(2, 32, 16);
  bulb = new THREE.Mesh(geometry, material);

  lamp.position.set(-45, 45, 0);
  bulb.position.set(0, -5, 0);
  lamp.add(bulb);
  scene.add(lamp);

  objects.push(lamp);
  objects.push(bulb);

  //lamp2
  material = new THREE.MeshBasicMaterial({ color: "#000000" });
  geometry = new THREE.ConeGeometry(5, 10, 20, 1, false);
  lamp = new THREE.Mesh(geometry, material);

  material = new THREE.MeshBasicMaterial({ color: "#fff000" });
  geometry = new THREE.SphereGeometry(2, 32, 16);
  bulb = new THREE.Mesh(geometry, material);

  lamp.position.set(0, 45, 0);
  bulb.position.set(0, -5, 0);
  lamp.add(bulb);
  scene.add(lamp);

  objects.push(lamp);
  objects.push(bulb);

  //lamp3
  material = new THREE.MeshBasicMaterial({ color: "#000000" });
  geometry = new THREE.ConeGeometry(5, 10, 20, 1, false);
  lamp = new THREE.Mesh(geometry, material);

  material = new THREE.MeshBasicMaterial({ color: "#fff000" });
  geometry = new THREE.SphereGeometry(2, 32, 16);
  bulb = new THREE.Mesh(geometry, material);

  lamp.position.set(45, 45, 0);
  bulb.position.set(0, -5, 0);
  lamp.add(bulb);
  scene.add(lamp);

  objects.push(lamp);
  objects.push(bulb);
}

function createScene() {
  "use strict";
  scene = new THREE.Scene();

  createFloor();
  createPalanque();
  createFigure1();
  createFigure2();
  createFigure3();
  createLamps();
}

function createAltScene() {
  "use strict";

  //create Alt Scene
  altScene = new THREE.Scene();

  //create Pause Screen
  createPauseScreen();

  // Camera
  if (window.innerWidth / window.innerHeight > 1.25)
    altCamera = new THREE.OrthographicCamera(
      -window.innerWidth / scale_height,
      window.innerWidth / scale_height,
      window.innerHeight / scale_height,
      -window.innerHeight / scale_height,
      1,
      1000
    );
  else
    altCamera = new THREE.OrthographicCamera(
      -window.innerWidth / scale_width,
      window.innerWidth / scale_width,
      window.innerHeight / scale_width,
      -window.innerHeight / scale_width,
      1,
      1000
    );

  altScene.add(altCamera);

  altCamera.position.set = (0, 20, 200);
  altCamera.lookAt(altScene.position);
}

function createLights() {
  "use strict";

  // Directional
  light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(0, 50, 40);
  /* DELETE this is just for testing
    const helper = new THREE.DirectionalLightHelper(light, 10, 0xff000);
    scene.add(helper);
    */
  scene.add(light);

  // Spotlights
  spot1 = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 15);
  spot1.position.set(-45, 50, 0);
  spot1.target = figure1;
  scene.add(spot1);

  /* DELETE this is just for testing
   spotLightHelper = new THREE.SpotLightHelper(spot1);
   scene.add(spotLightHelper);
   */

  spot2 = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 15);
  spot2.position.set(0, 50, 0);
  spot2.target = figure2;
  scene.add(spot2);

  spot3 = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 15);
  spot3.position.set(45, 50, 0);
  spot3.target = figure3;
  scene.add(spot3);

  objects.push(light);
  objects.push(spot1);
  objects.push(spot2);
  objects.push(spot3);
}

function deleteObjects() {
  var toRemove = objects.length - 1;

  while (toRemove >= 0) {
    scene.remove(objects[toRemove]);
    toRemove--;
  }
}

function resetGame() {
  deleteObjects();
  
  createFloor();
  createPalanque();
  createFigure1();
  createFigure2();
  createFigure3();
  createLamps();
  createLights();

  boolCamera1 = true;  //1
  boolCamera2 = false; //2
  boolPause = false;   //P(p)
  boolReset = false;   //M(m)
  
  changeShadowType = false; //A(a)
  lightCalc = true; //S(s)
  
  directionalLight = true; //D(d)
  spotLightPiece1 = false; //Z(z)
  spotLightPiece2 = false; //X(x)
  spotLightPiece3 = false; //C(c)
}

function createPauseScreen() {

  geometry = new THREE.PlaneGeometry(100, 50, 0);
  material = new THREE.MeshBasicMaterial({ map: pauseTexture });

  pauseScreen = new THREE.Mesh(geometry, material);
  pauseScreen.position.set(0, 30, -100);

  altScene.add(pauseScreen);
}

function resizeOrtCamera() {
  "use strict";

  scale_width = (window.innerWidth * scale_width) / last_width;
  scale_height = (window.innerHeight * scale_height) / last_height;

  last_width = window.innerWidth;
  last_height = window.innerHeight;

  if (window.innerWidth / window.innerHeight > ratio) {
    camera2.left = -window.innerWidth / scale_height;
    camera2.right = window.innerWidth / scale_height;
    camera2.top = window.innerHeight / scale_height;
    camera2.bottom = -window.innerHeight / scale_height;

    altCamera.left = -window.innerWidth / scale_height;
    altCamera.right = window.innerWidth / scale_height;
    altCamera.top = window.innerHeight / scale_height;
    altCamera.bottom = -window.innerHeight / scale_height;
  } else {
    camera2.left = -window.innerWidth / scale_width;
    camera2.right = window.innerWidth / scale_width;
    camera2.top = window.innerHeight / scale_width;
    camera2.bottom = -window.innerHeight / scale_width;

    altCamera.left = -window.innerWidth / scale_width;
    altCamera.right = window.innerWidth / scale_width;
    altCamera.top = window.innerHeight / scale_width;
    altCamera.bottom = -window.innerHeight / scale_width;
  }

  camera2.updateProjectionMatrix();
  altCamera.updateProjectionMatrix();
}

function resizePerspCamera() {
  "use strict";
  
  var aspect = window.innerWidth / window.innerHeight;
  console.log(aspect);
  camera1.aspect = aspect;
  camera1.updateProjectionMatrix();
}

function onResize() {
  "use strict";
  
  resizeOrtCamera();
  resizePerspCamera();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
  "use strict";
  // IMPORTANTE: NÃO TROCAR AS CÂMARAS AQUI
  switch (e.keyCode) {
    // ROTAÇÕES
    case 81: //Q
    case 113: //q
      rotYPosPiece1 = true;
      break;

    case 87: //W
    case 119: //w
      rotYNegPiece1 = true;
      break;

    case 69: //E
    case 101: //e
      rotYPosPiece2 = true;
      break;

    case 82: //R
    case 114: //r
      rotYNegPiece2 = true;
      break;

    case 84: //T
    case 116: //t
      rotYPosPiece3 = true;
      break;

    case 89: //Y
    case 121: //y
      rotYNegPiece3 = true;
      break;

    // LUZES
    case 65: //A
    case 97: //a
      changeShadowType = !changeShadowType;
      break;

    case 83: //S
    case 115: //s
      lightCalc = !lightCalc;
      break;

    case 68: //D
    case 100: //d
      directionalLight = !directionalLight;
      break;

    case 90: //Z
    case 122: //z
      spotLightPiece1 = !spotLightPiece1;
      break;

    case 88: //X
    case 120: //x
      spotLightPiece2 = !spotLightPiece2;
      break;

    case 67: //C
    case 99: //c
      spotLightPiece3 = !spotLightPiece3;
      break;

    // CAMARAS
    case 49: //1
      boolCamera1 = true;
      boolCamera2 = false;
      break;

    case 50: //2
      boolCamera1 = false;
      boolCamera2 = true;
      break;

    case 32: //SPACE
      boolPause = !boolPause;
      break;

    case 51: //3
      boolReset = !boolReset;
      break;
  }

  // IMPORTANTE: NÃO TROCAR AS CÂMARAS AQUI
}

function onKeyUp(e) {
  "use strict";

  switch (e.keyCode) {
    // ROTAÇÕES
    case 81: //Q
    case 113: //q
      rotYPosPiece1 = false;
      break;

    case 87: //W
    case 119: //w
      rotYNegPiece1 = false;
      break;

    case 69: //E
    case 101: //e
      rotYPosPiece2 = false;
      break;

    case 82: //R
    case 114: //r
      rotYNegPiece2 = false;
      break;

    case 84: //T
    case 116: //t
      rotYPosPiece3 = false;
      break;

    case 89: //Y
    case 121: //y
      rotYNegPiece3 = false;
      break;
  }
}

function animate() {
  "use strict";

  if (boolCamera1) camera = camera1;

  if (boolCamera2) camera = camera2;

  if (!boolPause) {
    if (rotYPosPiece1) figure1.rotateY(0.02);

    if (rotYNegPiece1) figure1.rotateY(-0.02);

    if (rotYPosPiece2) figure2.rotateY(0.02);

    if (rotYNegPiece2) figure2.rotateY(-0.02);

    if (rotYPosPiece3) figure3.rotateY(0.02);

    if (rotYNegPiece3) figure3.rotateY(-0.02);
  }

  if (boolPause) 
    if (boolReset) resetGame();

  if (lightCalc) {
    if (changeShadowType) {
      box.material = boxmat[2];
      step1.material = step1mat[2];
      step2.material = step2mat[2];
      floor.material = floormat[2];
      figure1.material = figure1mat[2];
    } else {
      box.material = boxmat[1];
      step1.material = step1mat[1];
      step2.material = step2mat[1];
      floor.material = floormat[1];
    }
  } else {
    box.material = boxmat[0];
    step1.material = step1mat[0];
    step2.material = step2mat[0];
    floor.material = floormat[0];
  }

  if (directionalLight) light.visible = true;
  else light.visible = false;

  if (spotLightPiece1) spot1.visible = true;
  else spot1.visible = false;

  if (spotLightPiece2) spot2.visible = true;
  else spot2.visible = false;

  if (spotLightPiece3) spot3.visible = true;
  else spot3.visible = false;

  /* DELETE this is just for testing
    spotLightHelper.update();
    */

  requestAnimationFrame(animate);
  render();
}

function createMaterials() {
  "use strict";

  wood = new THREE.TextureLoader().load("textures/floor.jpg");
  floormat = new Array(3);
  floormat[0] = new THREE.MeshBasicMaterial({ color: 0xc29e9a, map: wood });
  floormat[1] = new THREE.MeshLambertMaterial({ color: 0xc29e9a, map: wood });
  floormat[2] = new THREE.MeshPhongMaterial({ color: 0xc29e9a, map: wood });

  boxmat = new Array(3);
  boxmat[0] = new THREE.MeshBasicMaterial({ color: 0xb98383 });
  boxmat[1] = new THREE.MeshLambertMaterial({ color: 0xb98383 });
  boxmat[2] = new THREE.MeshPhongMaterial({ color: 0xb98383 });

  step1mat = new Array(3);
  step1mat[0] = new THREE.MeshBasicMaterial({ color: 0xa47676 });
  step1mat[1] = new THREE.MeshLambertMaterial({ color: 0xa47676 });
  step1mat[2] = new THREE.MeshPhongMaterial({ color: 0xa47676 });

  step2mat = new Array(3);
  step2mat[0] = new THREE.MeshBasicMaterial({ color: 0x805f5f });
  step2mat[1] = new THREE.MeshLambertMaterial({ color: 0x805f5f });
  step2mat[2] = new THREE.MeshPhongMaterial({ color: 0x805f5f });

  origamimat = new Array(3);
  origamimat[0] = new THREE.MeshBasicMaterial( {vertexColors: THREE.FaceColors, map: origamiTexture,})
  origamimat[1] = new THREE.MeshLambertMaterial( {vertexColors: THREE.FaceColors, map: origamiTexture});
  origamimat[2] = new THREE.MeshPhongMaterial( {vertexColors: THREE.FaceColors, map: origamiTexture});
}

function init() {
  "use strict";

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  // VR
  document.body.appendChild(VRButton.createButton(renderer));
  renderer.xr.enabled = true;
  renderer.setAnimationLoop(function () {
    renderer.render(scene, camera);
  });

  scale_width = window.innerWidth * scale;
  scale_height = window.innerHeight * scale * ratio;

  createMaterials();
  createScene();
  createLights();
  createCameras();
  createAltScene();

  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}
 
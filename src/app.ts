import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, FreeCamera } from "@babylonjs/core";


var canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.id = "gameCanvas";
document.body.appendChild(canvas);
// initialize babylon scene and engine
var engine = new Engine(canvas, true);
var scene = new Scene(engine);

var createScene = async function () {

  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.

  var sphereCount = 3;
  var sphereDiameter = 2;
  var sphereSpacing = 1;

  for (let index = 0; index < sphereCount; index++) {
    var sphere = MeshBuilder.CreateSphere("sphere" + index.toString, {diameter: sphereDiameter, segments: 32}, scene);
    sphere.position.y = 1;
    sphere.position.x = -(0.5*sphereCount*(sphereDiameter + sphereSpacing)) + (index * (sphereDiameter + sphereSpacing));
  }
 
  const environment = scene.createDefaultEnvironment();

  // XR
  const xrHelper = await scene.createDefaultXRExperienceAsync({
      floorMeshes: [environment.ground],
      uiOptions: { sessionMode:"immersive-vr"}
  });

};

class App {
  constructor() {
    createScene();
    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (scene.debugLayer.isVisible()) {
          scene.debugLayer.hide();
        } else {
          scene.debugLayer.show();
        }
      }
    });
    // run the main render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}
new App();
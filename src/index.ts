import { Color3, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';

import { RobotCar3d } from './3d/RobotCar3d';

 
const canvas = document.getElementById("view") as HTMLCanvasElement
const engine = new Engine(canvas, true)

  
const scene = new Scene(engine)

var camera = new ArcRotateCamera("camera1",  0, 0, 0, new Vector3(0, 0, 0), scene);
camera.setPosition(new Vector3(-12, 25, -84));
camera.attachControl(canvas, true);

var light = new HemisphericLight("light1", new Vector3(1, 0.5, 0), scene);


const robot = new RobotCar3d(scene);



// Enviroment

// Create array of points to describe the curve
var points:Vector3[] = [];
var n = 550; // number of points - more points the slower the car
var r = 50; //radius
for (var i = 0; i < n + 1; i++) {
    points.push( new Vector3((r + (r/5)*Math.sin(8*i*Math.PI/n))* Math.cos(2*i*Math.PI/n), 0, (r + (r/10)*Math.sin(6*i*Math.PI/n)) * Math.sin(2*i*Math.PI/n)));
}   
    
//Draw the curve
var track = MeshBuilder.CreateLines('track', {points: points}, scene);
track.color = new Color3(0, 0, 0);
    

var ground = MeshBuilder.CreateGround("ground", {width: 3*r, height: 3*r}, scene);

// Sollow

robot.setLinePoints(points);
/*----------------Position and Rotate Car at Start---------------------------*/
robot.body.position.y = 4;
//robot.body.position.z = r;


engine.runRenderLoop(() => {
    scene.render();
})

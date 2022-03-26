import { Color3, Vector4, Quaternion, Path3D, Texture, Mesh, InstancedMesh, Space, Axis , MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

import * as wheelImg from "../imgs/wheel.png";

export class RobotCar3d {

    body : Mesh;
    linePoints: Vector3[];

    // Animate
    private normals:Vector3[];
    private loopIndex:number = 0;
    private wheelFI:Mesh;
    private wheelFO:InstancedMesh;
    private wheelRI:InstancedMesh;
    private wheelRO:InstancedMesh;

    constructor(scene: Scene) {
        
        var bodyMaterial = new StandardMaterial("body_mat", scene);
        bodyMaterial.diffuseColor = new Color3(1.0, 0.25, 0.25);
        bodyMaterial.backFaceCulling = false;
                
        var side = [new Vector3(-4, 2, -2),
            new Vector3(4, 2, -2),
            new Vector3(5, -2, -2),
            new Vector3(-7, -2, -2)				
        ];
            
        side.push(side[0]); //close trapezium
            
        var extrudePath = [new Vector3(0, 0, 0), new Vector3(0, 0, 4)];
              
        this.body = MeshBuilder.ExtrudeShape("body", {shape: side, path: extrudePath, cap : Mesh.CAP_ALL}, scene);
        this.body.material = bodyMaterial;


        /*--------- Wheel ---------*/ 

        //Set color for wheel tread as black
        var faceColors=[];
        faceColors[1] = new Color3(0,0,0);
            
        //set texture for flat face of wheel 
        var faceUV =[];
        faceUV[0] = new Vector4(0,0,1,1);
        faceUV[2] = new Vector4(0,0,1,1);

        var wheelMaterial = new StandardMaterial("wheel_mat", scene);
        var wheelTexture = new Texture(wheelImg.default, scene);
        wheelMaterial.diffuseTexture = wheelTexture;

        //create wheel front inside and apply material
        this.wheelFI = MeshBuilder.CreateCylinder("wheelFI", {diameter: 3, height: 1, tessellation: 24, faceColors:faceColors, faceUV:faceUV}, scene);
        this.wheelFI.material = wheelMaterial;
            
        //rotate wheel so tread in xz plane  
        this. wheelFI.rotate(Axis.X, Math.PI/2, Space.WORLD);
        this.wheelFI.parent = this.body;  
            

        /*------------Create other Wheels as Instances, Parent and Position----------*/

        this.wheelFO = this.wheelFI.createInstance("FO");
        this.wheelFO.parent = this.body;
        this.wheelFO.position = new Vector3(-4.5, -2, 2.8);
        
        // this.wheelRI = this.wheelFI.createInstance("RI");
        // this.wheelRI.parent = this.body;
        // this.wheelRI.position = new Vector3(2.5, -2, -2.8);
        
        // this.wheelRO = this.wheelFI.createInstance("RO");
        // this.wheelRO.parent = this.body;
        // this.wheelRO.position = new Vector3(2.5, -2, 2.8);
        
        this.wheelFI.position = new Vector3(-4.5, -2, -2.8);

        // Call render...
        var self = this;
        scene.registerAfterRender(function(){
            self.render();
        });
    }


    /**
     *  https://englab.dawsoncollege.qc.ca/robot/3-%20Follow%20The%20Wall.html
     * 
        #include <Servo.h>
        Servo leftservo;  
        Servo rightservo;  
        const int pingPin = 5; // Trigger Pin of Ultrasonic Sensor
        const int echoPin = 6; // Echo Pin of Ultrasonic Sensor
        void setup() {
        leftservo.attach(9);  
        rightservo.attach(10);
        
        leftservo.write(90);
        rightservo.write(45);
        }
        void loop() {
        
        }
     */

    // Modeling of a differential drive robot
    // ref: https://youtu.be/XG4cODYVbJk?t=230  
    theta = 0;
    v = 0;
    dt = 1/30;
    w = 0;
    motorValRight = 39;
    motorValLeft = 15;
    wheelDist = 4;

    render(){
        
        var car = this.body;

        car.position.x += (this.v * Math.cos(this.theta))*this.dt;
        car.position.z += (this.v * Math.sin(this.theta))*this.dt;
        this.theta += this.w*this.dt; 
          
        var vAjust = 100;
        var velocityAmount = (this.motorValRight/vAjust)+(this.motorValLeft/vAjust);
        var rotationAmount = (this.motorValRight/vAjust)-(this.motorValLeft/vAjust);
        
        this.v = -velocityAmount* this.wheelDist;
        this.w = rotationAmount;
        
        
        this.wheelFI.rotate(Axis.Y, Math.PI/32, Space.LOCAL); 
        this.wheelFO.rotate(Axis.Y, Math.PI/32, Space.LOCAL);
        // this.wheelRI.rotate(Axis.Y, Math.PI/32, Space.LOCAL);
        // this.wheelRO.rotate(Axis.Y, Math.PI/32, Space.LOCAL);

        //this.wheelFI.rotate(normals[i], Math.PI/32, Space.WORLD); 
        //this.wheelFO.rotate(normals[i], Math.PI/32, Space.WORLD);
        //this.wheelRI.rotate(normals[i], Math.PI/32, Space.WORLD);
        //this.wheelRO.rotate(normals[i], Math.PI/32, Space.WORLD);
        
        // var theta = Math.acos(Vector3.Dot(normals[i],normals[i+1]));
        //var dir = Vector3.Cross(normals[i],normals[i+1]).y;
        //var dir = dir/Math.abs(dir);
        
        // car.rotate(Axis.Y,  this.heading, Space.WORLD);

        car.rotation = new Vector3(0, -this.theta, 0);

    }

        /*
    vl = 9;
    vr = 4;
    startAngle = 0.0;
    radios = 1.5;
    largure = 4.0;
    xx = 1;

    
    renderDiff(){

        console.log("theta", this.startAngle);

        var calc = (this.radios/2.0) * (this.vr + this.vl );
        var moveX = calc * Math.cos(this.startAngle);
        var moveY = calc * Math.sin(this.startAngle);
        var theta = (this.radios / this.largure) * (this.vr - this.vl);
        
        this.startAngle =  theta;

        var car = this.body;
        
        this.wheelFI.rotate(Axis.Y, Math.PI/32, Space.LOCAL); 
        this.wheelFO.rotate(Axis.Y, Math.PI/32, Space.LOCAL);
        // this.wheelRI.rotate(Axis.Y, Math.PI/32, Space.LOCAL);
        // this.wheelRO.rotate(Axis.Y, Math.PI/32, Space.LOCAL);

        //this.wheelFI.rotate(normals[i], Math.PI/32, Space.WORLD); 
        //this.wheelFO.rotate(normals[i], Math.PI/32, Space.WORLD);
        //this.wheelRI.rotate(normals[i], Math.PI/32, Space.WORLD);
        //this.wheelRO.rotate(normals[i], Math.PI/32, Space.WORLD);
        
        // var theta = Math.acos(Vector3.Dot(normals[i],normals[i+1]));
        //var dir = Vector3.Cross(normals[i],normals[i+1]).y;
        //var dir = dir/Math.abs(dir);
        
        //car.rotate(Axis.Y,  theta / 100, Space.LOCAL);
        

        var slowDown = 50; // this is to make slow ... ??? way ? i.d.k

        car.position.x += (moveX / slowDown);
        car.position.z += (moveY / slowDown);

        //this.loopIndex = (i + 1) % (this.linePoints.length-1);   //continuous looping 
    }
*/

    setLinePoints(points : Vector3[]){
        this.linePoints = points;
    }

}


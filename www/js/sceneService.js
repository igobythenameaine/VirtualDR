app.service("sceneService", function () {

    //create the Clinic

    var self = this;
    var ToRad = Math.PI / 180;

    var room = {
        width: 2.5,
        height: 2.1,
        depth: 3.5
    }
    var office = {
        wall: {
            front: { position: [0, 0, 0], width: room.width, depth: 0.01, height: room.height, mat: "wall" },
            left: { position: [-0.01, 0, 0], width: 0.01, depth: room.depth, height: room.height, mat: "wall" },
            right: { position: [room.width, 0, 0.05], width: 0.01, depth: room.depth, height: room.height, mat: "walls" },
        },
        background: {
            position: [-0.2, -0.2, room.depth + 0.05], width: room.width + 0.2, height: room.height + 0.2, depth: 0.01, mat: "wall"
        },
        floor: {
            top: { position: [0, 0, 0], width: room.width, depth: room.depth * 1.1, height: 0.05, mat: "carpet" }
        },
        ceiling: {
            top: { position: [0, room.height - 0.05, 0], width: room.width, depth: room.depth, height: 0.01, mat: "ceiling" }
        },
        pictures: {
            windowFrame: {
                position: [0.5, .8, room.depth], width: room.width /1.5, depth: 0.1, height: room.height/2.5, mat: "frame"
            },
             window: {
                position: [0.5, .8, room.depth], width: room.width /1.5, depth: 0.1, height: room.height/2.5, mat: "glass" 
             }
        }
    }

    self.room = room;
    self.office = office;

    function scaleItems(items, scale) {
        for (key in items) {
            if (items[key].position != undefined) {
                items[key].position[0] = items[key].position[0] * scale;
                items[key].position[1] = items[key].position[1] * scale;
                items[key].position[2] = items[key].position[2] * scale;
                items[key].width = items[key].width * scale;
                items[key].depth = items[key].depth * scale;
                items[key].height = items[key].height * scale;
            } else {
                scaleItems(items[key], scale);
            }
        }
    }

    function getCenter(item) {
        var center =
            [
                item.position[0] + (item.width / 2),
                item.position[1] + (item.height / 2),
                - (item.position[2] + (item.depth / 2))
            ];
        return center;
    }

    function computeCenters(items) {
        for (key in items) {
            if (items[key].position != undefined) {
                items[key].center = getCenter(items[key]);
            } else {
                computeCenters(items[key])
            }
        }
    };

    function addTexture(ctx, path, repeatX, repeatY) {
        return new THREE.TextureLoader().load(path, function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            texture.anisotropy = ctx.renderer.capabilities.getMaxAnisotropy();
            texture.repeat.set(repeatX, repeatY);
        });
    }

    function addMaterials(ctx) {
        self.textures = {};
        self.textures.plaster = addTexture(ctx, 'assets/textures/green.png', 1, 1);
        self.textures.wall = addTexture(ctx, 'assets/textures/wallGreen.jpg', 4, 4);
        self.textures.window = addTexture(ctx, 'assets/textures/window.png', 1, 1);
        self.textures.carpet = addTexture(ctx, 'assets/textures/floor.jpg', 4, 4);
        self.textures.ceiling = addTexture(ctx, 'assets/textures/white.jpg', 3, 3);
        self.textures.metal = addTexture(ctx, 'assets/textures/picture.jpg', 1, 1);
        self.textures.metalplate = addTexture(ctx, 'assets/textures/metalplate.jpg', 1, 1);
        self.textures.body = addTexture("assets/res/black.jpg");


        self.materials = {};

        self.materials.transparent = new THREE.MeshBasicMaterial({ color: 0, opacity: 0.2, blending: THREE.NoBlending }); 

        self.materials.ceiling = new THREE.MeshPhongMaterial({ map: self.textures.ceiling });
        self.materials.walls = new THREE.MeshPhongMaterial({ map: self.textures.wall });
        self.materials.carpet = new THREE.MeshBasicMaterial({ map: self.textures.carpet });
        self.materials.metal = new THREE.MeshBasicMaterial({ map: self.textures.metal });
        self.materials.metalplate = new THREE.MeshBasicMaterial({ map: self.textures.metalplate });
        self.materials.wall = new THREE.MeshBasicMaterial({ map: self.textures.plaster });
        self.materials.body = new THREE.MeshBasicMaterial({ map: self.textures.body });

        self.materials.frame = new THREE.MeshPhongMaterial({
            map: self.textures.window,
            bumpMap: self.textures.window,
            side: THREE.DoubleSide
        });

        self.materials.glass = new THREE.MeshBasicMaterial({
            //color: 0x223344,
            opacity: 0.5,
            combine: THREE.MixOperation,
            reflectivity: 0.25,
            transparent: true
        });

    }


    self.addLights = function(ctx) {
        console.log("adding lights");
        self.centerLight = new THREE.Vector3(0, -36.6, 0);

        self.ambient = new THREE.AmbientLight(0x808080);
        ctx.scene.add(self.ambient);

        self.hemiLight = new THREE.HemisphereLight(0x404040, 0x606060, 1);
        self.hemiLight.position.set(0, 2, 0);
        ctx.scene.add(self.hemiLight);

        self.light = new THREE.SpotLight(0x101010, 1, 0, Math.PI / 2, 1);
        self.light.castShadow = true;
        self.light.shadow.camera.near = 50;
        self.light.shadow.camera.far = 500;
        self.light.shadow.bias = -0.005;
        self.light.shadow.mapSize.height = self.light.shadow.mapSize.height = 1024;

        ctx.scene.add(self.light);

    }

     
    self.addScene = function (ctx, items) {
        console.log(ctx);
        console.log(items);
        addMaterials(ctx);

        

        for (key in items) {
             if (items[key].position != undefined) {
                var item = items[key];

                if (item.shape != undefined) {
                    var extrudeSettings = { depth: item.height, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.01, bevelThickness: 0.01 };
                    item.geometry = new THREE.ExtrudeGeometry(self.shapes[item.shape](item.width, item.depth, item.radius), extrudeSettings);
                } else {
                    item.geometry = new THREE.BoxGeometry(item.width, item.height, item.depth);
                }
                item.object = new THREE.Mesh(item.geometry, self.materials[item.mat]);
                item.object.position.x = item.center[0];
                item.object.position.y = item.center[1];
                item.object.position.z = item.center[2];
               item.objectW = new THREE.Mesh(item.geometry, self.materials.wireframe);
                item.objectW.position.x = item.center[0];
                item.objectW.position.y = item.center[1];
                item.objectW.position.z = item.center[2];

                if (item.shape != undefined) {
                    item.object.rotation.x = 90 * ToRad;
                    item.objectW.rotation.x = 90 * ToRad;
                }
               ctx.scene.add(item.object);
             } else {
                self.addScene(ctx, items[key])
           }
        }
    }


    scaleItems(office, 1);
    computeCenters(office);
   
   
       
        
});
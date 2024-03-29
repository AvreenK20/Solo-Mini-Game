// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        //maincontrols
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.attack = false;
        this.throw = false;
        this.throw2 = false;

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    //called after page has loaded, acts 2nd constructor.
    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };

    //starts up game loop
    //define a function game loop, that loops itself through, requestAnimFrame.
    //where it loops everytime the monitor refreshes.
    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    //load listeners that we expect from the user.
    startInput() {
        let that = this;
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                // console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                // console.log("CLICK", getXandY(e));
                
            }
            this.click = getXandY(e);
        });
        this.ctx.canvas.addEventListener("mousedown", e => {
            if (this.options.debugging) {
                // console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
            switch (e.which) {
                case 1:
                    //alert('Left Mouse button click.');
                    this.throw2 = true;

                    break;
                case 2:
                    //alert('Middle Mouse button release.');
                    break;
                case 3:
                    //alert('Right Mouse button release.');
                     break;
        
                }
            // console.log("left click", getXandY(e));
          
        });



        //release mouse click
        this.ctx.canvas.addEventListener("mouseup", e => {
            if (this.options.debugging) {
                // console.log("CLICK", getXandY(e));
            }
        
            this.click = getXandY(e);
            // console.log("CLICK Release", getXandY(e));
        
            switch (e.which) {
                case 1:
                    //alert('Left Mouse button release.');
                    that.throw2 = false;
                    break;
                case 2:
                    //alert('Middle Mouse button release.');
                    break;
                case 3:
                    //alert('Right Mouse button release.');
                     break;
        
                }
            });
        
        
        //The this keyword refers to the local function unless that function is attached to that class. Like the constructor will refer to the current class.
        this.ctx.canvas.addEventListener("keydown", e => {
            switch (e.code) {
                case "KeyA":
                    this.left = true;
                    break;
                case "KeyD":
                    this.right = true;
                    break;
                case "KeyW":
                    this.up = true;
                    break;
                case "KeyS":
                    this.down = true;
                    break;
                case"KeyP":
                    this.attack = true;
                    break;
                case "KeyO":
                    this.throw = true;
                    break;
            }
        }, false);
        this.ctx.canvas.addEventListener("keyup", 
        e => {
            switch (e.code) {
                case "KeyA":
                    this.left = false;
                    break;
                case "KeyD":
                    this.right = false;
                    break;
                case "KeyW":
                    this.up = false;
                    break;
                case "KeyS":
                    this.down = false;
                    break;
                case"KeyP":
                    this.attack = false;
                    break;
                case "KeyO":
                    this.throw = false;
                    break;
            }
        }, false);
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
        this.camera.update();
    };

    //goes through the list of entities and updates each entity, if the entity won't be removed.
    //removed entities like mushroom from mario.
    update() {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                //method that allows you to insert and delete out of a list
                //starting from index i of length 1.
                this.entities.splice(i, 1);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};
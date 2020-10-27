
let entities = [];
let dangers = [];
let world;
let screen;
let keypresses = [];
let cam_x = 0;
let cam_x_timer = 0;
let cam_y = 0;

function startGame() {
    myGameArea.start();
    screen = myGameArea;
    //screen.context.font = this.width + " " + this.height;
    //screen.context.fillStyle = "green";
    //screen.context.fillText("Hello Wold", 15, 55);
    for (let index = 0; index < 25; index++) {
        if(index === 24)
            entities[index] = new Entity(10, 15, true);
        else
            entities[index] = new Entity(500 + index* 600 + 400*Math.random(), 15, false);
    }
    for (let index = 0; index < 10; index++)
    {
        dangers[index] = new Danger(500 + index* 500 + 300*Math.random(), 0, 128, screen.canvas.height );
    }

    world = World;
    world.init();
}

let myGameArea =
{
    canvas: document.getElementsByTagName("canvas")[0],
    start: function () {
        this.canvas.width = 680;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        //this.context.
        this.interval = setInterval(update, 14);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function update() {
    //screen.clear();
    //screen.context.fillStyle = entity.col;
    //screen.context.fillRect(entity.x, entity.y, entity.w, entity.h);
    world.update();
    let player = entities[entities.length-1];
    for (let index = 0; index < dangers.length; index++){
        dangers[index].Update();
        if(dangers[index].Collide(player))
            player.isCaged = true;
           
    }
    for (let index = 0; index < entities.length; index++){
        entities[index].Update();
        if(player.Collide(entities[index]))
            player.isCaged = true;
    }
    if(!player.isCaged){
        cam_x_timer += 1.55;
        cam_x = cam_x_timer;
    }
}
let World = {
    img: new Image(),
    x1: 0,
    img2: new Image(),
    x2: 192,
    init: function()
    {
        this.img.src = "img\\world.png";
        this.img2.src = "img\\world.png";
    },
    update: function () 
    {
        //if(cam_x%120)
        screen.context.drawImage(this.img, 0, 0, 192, 32, -cam_x , 0, screen.canvas.width*4, screen.canvas.height);
        screen.context.drawImage(this.img2, 0, 0, 192, 32, -cam_x + screen.canvas.width*4 , 0, screen.canvas.width*4, screen.canvas.height);
    }
}
class Danger
{
    constructor(x, y, w, h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = new Image();
        this.img.src = "img\\danger.png";
    }
    Update()
    {
        screen.context.drawImage(this.img, 0, 0,16, 32, this.x - cam_x, this.y, this.w, this.h);
    }
    Collide(player)
    {
        if(player.isJumping)
            return false;
        
        if(player.x + player.w * 0.25 > this.x && player.x + player.w * 0.75 < this.x + this.w )
            return true;
        
        return false;
    }
}
class Entity 
{
    constructor(x, y, isPlayer)
    {
        this.isPlayer = isPlayer;
        this.spawned = isPlayer;
        this.isJumping = false;
        this.isCaged = false;
        this.jumpTimer = 0;
        this.x = x;
        this.y = y;
        this.w = 0;
        this.h = 0;
        this.vx = 0;
        this.vy = 0;
        this.img = new Image();
        this.img_jump = this.img;
        this.img_flip = this.img;
        this.img_cage = this.img;
        this.img_lazer = this.img;
        this.lazerActivated = false;
        this.lazerTimer = 0;
        this.col = "rgb(200,20,20)";//"#ff0000",
        this.timer =  0;
        if(this.isPlayer){
            this.img.src = "img\\unicorn.png";
            this.img_flip = new Image();
            this.img_flip.src = "img\\unicorn_flip.png";
            this.img_jump = new Image();
            this.img_jump.src = "img\\unicorn_jump.png";
            this.img_cage = new Image();
            this.img_cage.src = "img\\unicorn_cage.png";
            this.img_lazer = new Image();
            this.img_lazer.src = "img\\lazer.png";
        }
        else{
            this.img.src = "img\\tim.png";
            this.img_cage = new Image();
            this.img_cage.src = "img\\tim_lazer.png";

        }
    }
    Update() 
    {
        if(!this.spawned && this.x > cam_x + screen.canvas.width)
            return;
        else this.spawned = true;
        if(!this.isPlayer && this.x <= cam_x){
            this.spawned = false;
            return;
        }

        this.x += this.vx;
        this.y += this.vy;
        if (this.y + this.h >= screen.canvas.height) 
            this.y = screen.canvas.height- this.w;
        if(this.y < 0)
            this.y = 0;
        if (this.x + this.w >= cam_x + screen.canvas.width ) 
            this.x = cam_x + screen.canvas.width - this.w;
        if(this.x < cam_x )
            this.x = cam_x ;
        //let colors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        //this.col = "rgb(" + colors[0] + "," + colors[1] + "," + colors[1] + ")";

        this.h = this.w = (this.y * 50) / screen.canvas.height + 100 ;
        
        if(this.isPlayer)
        {
            //Move
            this.vy = Direction(keypresses["ArrowDown"], keypresses["ArrowUp"], 2);
            this.vx = Direction(keypresses["ArrowRight"], keypresses["ArrowLeft"], 4);
            //Lazor
            if(keypresses["x"] && !this.isJumping && this.vx >= 0){
                screen.context.drawImage(this.img_lazer, Math.floor(this.lazerTimer)*32, 0, 31.5, 32, this.x - cam_x + this.w, this.y, this.w, this.h);
                this.lazerTimer = (this.lazerTimer + 0.44) % 3 ;
                this.lazerActivated = true;
            }
            else this.lazerActivated = false;

            //Jump
            if(keypresses["z"] && this.jumpTimer <= 0){
                this.isJumping = true;
                this.timer = 0;
            }
            if(this.jumpTimer > 0)
                this.jumpTimer -= 0.025;
            if(this.isJumping)
                this.jumpTimer -= 0.025;
            if(this.jumpTimer < -1)
            {
                this.jumpTimer = 0.25;
                this.isJumping = false;
            }
        }
        else if(this.timer > 1.5 || this.timer == 0)
            this.vy = Math.random()*4 - 2;

        if(this.isJumping)
            this.timer += 0.1;
        else if(this.vx != 0 || this.vy != 0 || this.isCaged)
            this.timer += 0.2;
        else this.timer = 0;
        this.timer %= 3;

        if(this.isCaged){
            this.vx = this.vy = 0;
            screen.context.drawImage(this.img_cage, Math.floor(this.timer)*32, 0, 31.5, 32, this.x - cam_x, this.y, this.w, this.h);
        }
        else if(this.isJumping)
        {
            let offset = 1.25* ( this.jumpTimer >= -0.5?  this.h * this.jumpTimer : this.h * (-1 - this.jumpTimer));
            screen.context.drawImage(this.img_jump, Math.floor(this.timer)*32, 0, 31.5, 32, this.x - cam_x, this.y + offset, this.w, this.h);
        }
        else if(this.vx < 0)
            screen.context.drawImage(this.img_flip, Math.floor(this.timer)*32, 0, 31.5, 32, this.x - cam_x, this.y, this.w, this.h);
        else
            screen.context.drawImage(this.img, Math.floor(this.timer)*32, 0, 31.5, 32, this.x - cam_x, this.y, this.w, this.h);

    }
    Collide(enemy)
    {
        if(!this.spawned)
            return false;
        if(enemy.isPlayer)
            return false;
        
        if(this.lazerActivated  &&
            enemy.x + enemy.w * 0.75 > this.x + this.w && enemy.x + enemy.w * 0.75 < this.x + this.w *2 && 
            enemy.y + enemy.h * 0.25 > this.y && enemy.y + enemy.h * 0.75 < this.y + this.h  )
            enemy.isCaged = true;

        if(!enemy.isCaged && 
            enemy.x + enemy.w * 0.25 > this.x && enemy.x + enemy.w * 0.75 < this.x + this.w && 
            enemy.y + enemy.h * 0.25 > this.y && enemy.y + enemy.h * 0.75 < this.y + this.h  )
            return true;
        
        return false;
    }

}
function Direction(key1, key2, speed)
{
    if(key1)
        return speed;
    if(key2)
        return -speed;
    return 0;
}
window.addEventListener("keydown", function (event) {
    keypresses[event.key] = true;
    event.preventDefault(); //Cancel the default action to avoid it being handled twice
}, true);
  window.addEventListener("keyup", function (event) {
    keypresses[event.key] = false;
    event.preventDefault(); //Cancel the default action to avoid it being handled twice
}, true);

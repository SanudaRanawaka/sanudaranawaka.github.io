// grab the canvas from index.html
const MARGINX = 30;
const MARGINY = 60;
const canvas = document.getElementById("game");
canvas.width = window.innerWidth - MARGINX;
canvas.height = window.innerHeight - MARGINY;
//player
player = null;
world = null;
// get access to draw
const ctx = canvas.getContext("2d");
// --- INPUT --- //
const keys = {};

window.addEventListener("keydown", (a) => {
  keys[a.key] = true;
});
window.addEventListener("keyup", (a) => {
  keys[a.key] = false;
});

window.addEventListener("keydown", (d) => {
  keys[d.key] = true;
});
window.addEventListener("keyup", (d) => {
  keys[d.key] = false;
});
// --- INPUT --- //


//mainloop
function loop() {
  update();
  render();
  // loops
  requestAnimationFrame(loop);
}

function update() {
  // game logic (movement, physics later)
  if (keys["a"]) player.rotate(-0.1);
  if (keys["d"]) player.rotate(0.1);
}

function ready(){
    player = new Player();
    world = new World();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    player.cam.draw_vision(world);
    //drawPlayer();

    //ctx.font = "50px Arial";
    //ctx.fillText(player.cam.unitv,100,80);
}

function drawPlayer(){
    player.draw();
}

class Player {
  constructor() {
    this.global_pos = [1,2,0];
    this.rotation = 0;

    this.cam = new Camera(this);
  }

  draw() {
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(canvas.width/2+60,canvas.height/2);
    ctx.lineTo(canvas.width/2+50, canvas.height/2+100);
    ctx.lineTo(canvas.width/2+10, canvas.height/2+100);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#832923";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.lineTo(canvas.width/2+60,canvas.height/2);
    ctx.lineTo(canvas.width/2+50, canvas.height/2-20);
    ctx.lineTo(canvas.width/2+10, canvas.height/2-20);
    ctx.closePath();
    ctx.fill();
  }

  rotate(degrees){
    this.rotation += degrees;
    if (this.rotation > 359){
        this.rotation = 0;
    }
    else if (this.rotation <0){
        this.rotation = 359;
    }
  }
}

class World{
    constructor() {
    this.objects = [new Wall([1,3,0,4,2,0,4,2,5,1,3,5])];
  }
  get_display_details(search_vector){
    if(search_vector[0]< this.wall[6] && search_vector[0] > this.wall[0]){
      if(search_vector[1]< this.wall[4] && search_vector[1] > this.wall[1]){
        return ["brown"];
      }
      else{
        return null;
      }

    }
    return null;

  }
}

class Wall{
  constructor(coords) {
    this.shape = coords;
  }

  get_details(){
    return "wall";
  }

  get_relative_pos(origin){
    // 0 3 6 9 is x
    // 1 4 7 10 is y
    // 2 5 8 11 is z
    let v = [];
    for(let i = 0;i < 4;i++){
      v.push(this.shape[3*i]-origin[0]);
      v.push(this.shape[3*i+1]-origin[1]);
      v.push(this.shape[3*i+2]-origin[2]);
    }
    return v;
  }
  get_global_pos(){
    return this.shape.slice();
  }
}

class Camera{
    constructor(prnt){
        this.parent = prnt;
        this.fov = 100;
        this.camv = [0,1,0];
        this.render_dist = 5;
    
    }

    get_player_to_vision_vector(){
        let cos = Math.cos(this.parent.rotation*Math.PI/180);
        let sin = Math.sin(this.parent.rotation*Math.PI/180);
        let uv = [cos,sin,0];
        return uv;
    }

    draw_vision(world){
        //sweep left to right and fill screen
        let g  = this.get_player_to_vision_vector();
        ctx.fillStyle = "blue";
        ctx.font = "50px Arial";
        ctx.fillText(g,100,80);
        let v2  = world.objects[0].get_relative_pos(this.parent.global_pos);
        // assume any height so jsut check xy intersect then if that passes chekc if height works out
        

    }
}


ready();
loop();

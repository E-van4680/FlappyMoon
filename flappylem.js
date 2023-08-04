//board
let board;
let boardWidth = 900;
let boardHeight = 860;
let context;

//LEM
let lemWidth = 72;
let lemHeight = 71;
let lemX = boardWidth/8;
let lemY = boardHeight/2;
let lemImg;


let lem = {
	x : lemX,
	y : lemY,
	width : lemWidth,
	height : lemHeight
}

let boomImg = new Image();
boomImg.src = "./boom.png";
	//rocas
let rocaArray = [];
let rocaWidth = 150;
let rocaHeight = 800;
let rocaX = boardWidth;
let rocaY = 0;

let techoArray = [];
let techoWidth = 800;
let techoHeight = 100;
let techoX = boardWidth;
let techoY = -30;
let techoImg;

let rocaFlipImg;
let rocaImg;

//física
let velocityX = -3; 
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
	board = document.getElementById("board");
	board.height = boardHeight;
	board.width = boardWidth;
	context = board.getContext("2d");


	//load img
	lemImg = new Image();
	lemImg.src = "./LEM.png";
	lemImg.onload = function() {
		context.drawImage(lemImg, lem.x, lem.y, lem.width, lem.height);
	}

	rocaFlipImg = new Image();
	rocaFlipImg.src = "./rocaflip.png";

	rocaImg = new Image();
	rocaImg.src = "./roca.png";

	techoImg = new Image();
	techoImg.src = "./techo.png";

	requestAnimationFrame(update);
	setInterval(placeRocas, 1800);
	setInterval(placeTecho, 1800);
	document.addEventListener("keydown", moveLem);

	

}

function update() {
	requestAnimationFrame(update);
	if (gameOver) {
		techoArray = [];
		context.drawImage(boomImg, lem.x - 5, lem.y, 84, 82);
		playExplosion();
		return;
	}

	context.clearRect(0, 0, board.width, board.height);
	

	//lem
	velocityY += gravity;
	lem.y = Math.max(lem.y + velocityY, 0);
	context.drawImage(lemImg, lem.x, lem.y, lem.width, lem.height);

	if (lem.y > board.height) {
		gameOver = true;
	}

	//rocas
	for (let i = 0; i < rocaArray.length; i++) {
		let roca = rocaArray[i];
		roca.x += velocityX;
		context.drawImage(roca.img, roca.x, roca.y, roca.width, roca.height); 
		
		if (!roca.passed && lem.x > roca.x + roca.width) {
			score += 0.5;
			roca.passed = true;
		}
 
		if (detectCollision(lem, roca)) {
			gameOver = true;
		}

	}

	for (let i = 0; i < techoArray.length; i++) {
		let techo = techoArray[i];
		techo.x += velocityX;
		context.drawImage(techo.img, techo.x, techo.y, techo.width, techo.height);
	}


	//limpiar rocas
	while (rocaArray.length > 0 && rocaArray[0].x + rocaWidth < 0) {
		rocaArray.shift();
	}

	while (techoArray.length > 0 && techoArray[0].x + techoWidth < 0) {
		techoArray.shift();
	}

	//score
	context.fillStyle = "white";
	context.font = "45px sans-serif";
	context.fillText(score, 5, 45);

	if (gameOver) {
		context.fillText("GAME OVER", 5, 90);
	//	lemImg.src = "./boom.png";
	}
}

function placeRocas() {

	if (gameOver) {
		return;
	}

	let randomRocaY = rocaY - rocaHeight/4 - Math.random()*(rocaHeight/2);
	let openingSpace = board.height/4;

	let rocaFlip = {
		img : rocaFlipImg,
		x : rocaX,
		y : randomRocaY,
		width : rocaWidth,
		height : rocaHeight,
		passed : false
	}

	rocaArray.push(rocaFlip);

	let roca = {
		img : rocaImg,
		x : rocaX,
		y : randomRocaY + rocaHeight + openingSpace,
		width : rocaWidth,
		height : rocaHeight,
		passed : false
	}

	rocaArray.push(roca);
}


function placeTecho() {

	if (gameOver) {
		return;
	}

	let techo = {
		img : techoImg,
		x : techoX,
		y : techoY,
		width : techoWidth,
		height : techoHeight,
		passed : false
	}

	techoArray.push(techo);
}

let audio;
let audioExplosion = new Audio("explosion.mp3");
let explosionPlayed = false;

function playMusic() {
	let audio = new Audio("engine.mp3");
	audio.play()
} 

function stopMusic() {
	if (audio) {
		audio.pause();
	}
}


function playExplosion() {
	if (!explosionPlayed) {
		audioExplosion.currentTime = 0;
		audioExplosion.play()
		explosionPlayed = true;
	}
}

function moveLem(e) {
	if (e.code == "Space" || e.code == "ArrowUp") {
		velocityY = -6;
		lem.height = 98;
		lemImg.src = "./LEMon.png";
		playMusic();
		if (gameOver) {
			lem.y = lemY;
			rocaArray = [];
			score = 0;
			gameOver = false;
			explosionPlayed = false;

		}
	} else {
		stopMusic();
	}
}

document.addEventListener("keyup", function(e) {
	if (e.code == "Space" || e.code == "ArrowUp") {
		lemImg.src = "./LEM.png";
		lem.height = 71;
	}
});

function detectCollision(a, b) {
	return  a.x + 10 < b.x + b.width && //primeros dos renglones pa choques laterales
		a.x + a.width - 10 > b.x &&
		a.y + 6 < b.y + b.height && // para choques desde abajo
		a.y + 71 > b.y; // para choques desde arriba
}

let board;
let boardWidth = 900;
let boardHeight = 860;
let context;

window.onload = function() {
	board = document.getElementById("board");
	board.height = boardHeight;
	board.width = boardWidth;
	context = board.getContext("2d");


}

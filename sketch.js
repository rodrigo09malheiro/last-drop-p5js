// =====================================================
// Last Drop - Programa principal
// Aqui ficam: setup(), draw() e os eventos
// (mousePressed, keyPressed, etc.). A lógica do jogo fica na classe Jogo.
// Água a poupar: Water Saving in Times of Drought
// Rodrigo Fernandes Malheiro | 33103 | ECGM
// =====================================================

// Nota: no p5.js v2 o preload() deixou de existir.
// Quando houver sons e imagens, carregam-se com async/await no setup().

let jogo;

function setup() {
  createCanvas(800, 600);
  noSmooth();            // mantém o aspeto de pixel art
  textFont('monospace');
  jogo = new Jogo();
}

function draw() {
  jogo.atualizar();
  jogo.desenhar();
}

function mousePressed() {
  jogo.clicar();
}

function keyPressed() {
  jogo.teclar(key);
}
// =====================================================
// Last Drop - Programa principal
// Aqui ficam: setup(), draw() e os eventos
// (mousePressed, keyPressed, etc.). A lógica do jogo fica na classe Jogo.
// Tema: Water Saving in Times of Drought
// Rodrigo Fernandes Malheiro | 33103 | ECGM
// =====================================================

// Nota: no p5.js v2 o preload() deixou de existir.
// Quando houver sons e imagens, carregam-se com async/await no setup().

let jogo;

// Corre uma vez: cria a área de jogo e o objeto Jogo
function setup() {
  createCanvas(800, 600);
  noSmooth();            // mantém o aspeto de pixel art
  textFont('monospace');
  jogo = new Jogo();
}

// Corre em cada frame: primeiro a lógica, depois o desenho
function draw() {
  jogo.atualizar();
  jogo.desenhar();
}

// Clique do rato: entregue ao Jogo (botões do início e do resultado)
function mousePressed() {
  jogo.clicar();
}

// Tecla premida: entregue ao Jogo (atalhos do início e do resultado)
function keyPressed() {
  jogo.teclar(key);
}
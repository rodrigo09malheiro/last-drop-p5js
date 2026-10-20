// Classe Gota
// Responsabilidade: gota de água (e variantes contaminada/evaporação):
// posição, velocidade aleatória controlada, desenho e queda.

class Gota {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tipo = 'agua';                // mais tarde: 'contaminada' e 'bolha'
    this.velocidade = random(4, 6);    // aleatoriedade controlada
  }

  atualizar() {
    this.y += this.velocidade;
  }

  foraDoEcra() {
    return this.y > height;
  }

  mostrar() {
    noStroke();
    // Gota em pixel art
    fill(70, 150, 255);
    rect(this.x - 2, this.y, 4, 4);
    rect(this.x - 4, this.y + 4, 8, 6);
    rect(this.x - 3, this.y + 10, 6, 3);
    // Brilho
    fill(190, 225, 255);
    rect(this.x - 2, this.y + 5, 2, 3);
  }
}
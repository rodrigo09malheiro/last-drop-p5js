// Classe Balde
// Responsabilidade: balde controlado pelo rato (movimento horizontal)
// e deteção de colisões com as gotas.

class Balde {
  constructor() {
    this.largura = 90;
    this.altura = 44;
    this.x = width / 2;              // centro do balde
    this.y = height - 26 - 70;       // acima da faixa de identificação
    this.flash = 0;                  // frames de aviso depois de apanhar algo mau
  }

  // O rato move o balde na horizontal
  atualizar() {
    this.x = constrain(mouseX, this.largura / 2, width - this.largura / 2);
    if (this.flash > 0) this.flash--;
  }

  // Colisão retângulo-retângulo entre a gota e a boca do balde
  apanha(g) {
    const bx = this.x - this.largura / 2;
    const gx = g.x - g.largura / 2;
    return gx < bx + this.largura &&
           gx + g.largura > bx &&
           g.y < this.y + 14 &&
           g.y + g.altura > this.y;
  }

  avisar() {
    this.flash = 15;
  }

  mostrar() {
    noStroke();
    const x = this.x - this.largura / 2;
    const y = this.y;
    // Corpo do balde (vermelho a piscar quando se apanha algo mau)
    fill(this.flash > 0 ? color(220, 60, 60) : color(150, 150, 165));
    rect(x, y, this.largura, 8);                     // aro
    fill(this.flash > 0 ? color(190, 40, 40) : color(110, 115, 130));
    rect(x + 6, y + 8, this.largura - 12, this.altura - 8);
    rect(x + 12, y + this.altura, this.largura - 24, 4);
    // Brilho
    fill(190, 195, 210);
    rect(x + 12, y + 14, 4, this.altura - 14);
  }
}
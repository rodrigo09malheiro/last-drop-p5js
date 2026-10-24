// Classe Balde
// Responsabilidade: balde controlado pelo rato (movimento horizontal)
// e deteção de colisões com as gotas.

class Balde {
  constructor() {
    this.largura = 90;
    this.altura = 44;
    this.x = width / 2;              // centro do balde
    this.y = height - 26 - 70;       // acima da faixa de identificação
    this.framesAviso = 0;            // frames que faltam de aviso (vermelho) depois de apanhar algo mau
  }

  // O rato move o balde na horizontal
  atualizar() {
    this.x = constrain(mouseX, this.largura / 2, width - this.largura / 2);
    if (this.framesAviso > 0) this.framesAviso--;
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

  // Liga o aviso vermelho durante 15 frames (chamado ao apanhar uma gota má ou uma bolha)
  avisar() {
    this.framesAviso = 15;
  }

  // Desenha o balde em pixel art (fica vermelho enquanto o aviso está ativo)
  mostrar() {
    noStroke();
    const x = this.x - this.largura / 2;
    const y = this.y;
    const mau = this.framesAviso > 0;   // pisca a vermelho quando se apanha algo mau

    const contorno = color(40, 40, 52);
    const aro      = mau ? color(235, 90, 90)  : color(175, 180, 195);
    const corpo    = mau ? color(200, 55, 55)  : color(120, 126, 144);
    const sombra   = mau ? color(150, 35, 35)  : color(85, 90, 108);
    const brilho   = mau ? color(255, 160, 160) : color(205, 210, 225);
    const cinta    = mau ? color(105, 20, 20)   : color(40, 40, 52);   // linhas escuras bem visíveis

    // Pega
    fill(contorno);
    rect(x + 10, y - 14, 4, 14);
    rect(x + this.largura - 14, y - 14, 4, 14);
    rect(x + 10, y - 14, this.largura - 20, 4);

    // Contorno e corpo (ligeiramente mais estreito em baixo)
    fill(contorno);
    rect(x - 2, y - 2, this.largura + 4, 12);
    rect(x + 4, y + 8, this.largura - 8, this.altura - 6);
    rect(x + 10, y + this.altura, this.largura - 20, 6);

    fill(aro);
    rect(x, y, this.largura, 8);
    fill(corpo);
    rect(x + 6, y + 8, this.largura - 12, this.altura - 8);
    rect(x + 12, y + this.altura, this.largura - 24, 4);

    // Sombra do lado direito
    fill(sombra);
    rect(x + this.largura - 18, y + 8, 12, this.altura - 8);

    // Brilho
    fill(brilho);
    rect(x + 12, y + 12, 4, this.altura - 14);

    // Cintas (linhas): desenhadas por último, por cima de tudo, para se verem sempre
    fill(cinta);
    rect(x + 6, y + 20, this.largura - 12, 3);
    rect(x + 6, y + 34, this.largura - 12, 3);
  }
}
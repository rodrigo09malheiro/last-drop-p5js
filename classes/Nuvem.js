// Classe Nuvem
// Responsabilidade: desenhar a nuvem e gerar gotas de chuva
// consoante o estado da histerese do microfone.

class Nuvem {
  // config: valores da dificuldade (pctContaminadas e velocidadeGotas)
  constructor(config = {}) {
    this.x = width / 2;
    this.y = 60;
    this.largura = 160;
    this.velocidade = 1.5;
    this.direcao = 1;
    this.limiteDireito = 500; // a nuvem não passa por cima do sol nem do medidor de voz
    this.margem = 180;        // distância mínima aos lados (deixa livre o reservatório e o medidor de voz)
    this.intervaloGotas = 8;  // frames entre gotas
    this.contador = 0;
    this.chovendo = false;
    this.pctContaminadas = config.pctContaminadas ?? 0.2;
    this.velocidadeGotas = config.velocidadeGotas ?? [4, 6];
  }

  // Move a nuvem e devolve uma Gota nova se estiver a chover (senão null)
  atualizar(chovendo) {
    this.chovendo = chovendo;

    this.x += this.velocidade * this.direcao;
    if (this.x > this.limiteDireito) this.direcao = -1;
    if (this.x < this.margem) this.direcao = 1;

    if (!this.chovendo) {
      this.contador = 0;
      return null;
    }

    this.contador++;
    if (this.contador >= this.intervaloGotas) {
      this.contador = 0;
      const x = this.x + random(-this.largura / 3, this.largura / 3);
      // Aleatoriedade controlada: a percentagem de contaminadas vem da dificuldade
      const tipo = random() < this.pctContaminadas ? 'contaminada' : 'agua';
      return new Gota(x, this.y + 64, tipo, this.velocidadeGotas);
    }
    return null;
  }

  mostrar() {
    noStroke();
    // Clara quando não chove, cinzenta quando chove (com sombra por baixo)
    const base   = this.chovendo ? color(135, 145, 165) : color(245, 248, 255);
    const sombra = this.chovendo ? color(95, 105, 128)  : color(205, 216, 236);
    const brilho = this.chovendo ? color(165, 175, 195) : color(255, 255, 255);

    // Nuvem em blocos (pixel art)
    const p = 16;
    const x = this.x - this.largura / 2;
    const y = this.y;

    fill(base);
    rect(x + p * 2, y, p * 6, p);
    rect(x + p, y + p, p * 8, p);
    rect(x, y + p * 2, p * 10, p);
    rect(x + p, y + p * 3, p * 8, p);

    // Sombra na parte de baixo
    fill(sombra);
    rect(x + p, y + p * 3, p * 8, p);
    rect(x, y + p * 2 + p / 2, p * 10, p / 2);

    // Brilho em cima
    fill(brilho);
    rect(x + p * 3, y + 4, p * 3, 4);
    rect(x + p * 2, y + p + 4, p * 2, 4);
  }
}
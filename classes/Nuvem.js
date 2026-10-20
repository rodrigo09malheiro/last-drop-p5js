// Classe Nuvem
// Responsabilidade: desenhar a nuvem e gerar gotas de chuva
// consoante o estado da histerese do microfone.

class Nuvem {
  constructor() {
    this.x = width / 2;
    this.y = 60;
    this.largura = 160;
    this.velocidade = 1.5;
    this.direcao = 1;
    this.margem = 100;        // distância mínima aos lados do ecrã
    this.intervaloGotas = 8;  // frames entre gotas
    this.contador = 0;
    this.chovendo = false;
  }

  // Move a nuvem e devolve uma Gota nova se estiver a chover (senão null)
  atualizar(chovendo) {
    this.chovendo = chovendo;

    this.x += this.velocidade * this.direcao;
    if (this.x > width - this.margem) this.direcao = -1;
    if (this.x < this.margem) this.direcao = 1;

    if (!this.chovendo) {
      this.contador = 0;
      return null;
    }

    this.contador++;
    if (this.contador >= this.intervaloGotas) {
      this.contador = 0;
      const x = this.x + random(-this.largura / 3, this.largura / 3);
      return new Gota(x, this.y + 64);
    }
    return null;
  }

  mostrar() {
    noStroke();
    // Cinzenta quando chove, clara quando não
    fill(this.chovendo ? color(120, 130, 150) : color(240, 244, 252));

    // Nuvem em blocos (pixel art)
    const p = 16;
    const x = this.x - this.largura / 2;
    const y = this.y;
    rect(x + p * 2, y, p * 6, p);
    rect(x + p, y + p, p * 8, p);
    rect(x, y + p * 2, p * 10, p);
    rect(x + p, y + p * 3, p * 8, p);
  }
}
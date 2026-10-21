// Classe Reservatorio
// Responsabilidade: nível de água do reservatório, evaporação ao longo
// do tempo (acelerada pelo sol) e desperdício quando está cheio.
//
// A taxa de evaporação NÃO está aqui: vem da dificuldade (DIFICULDADES, em
// Jogo.js), que é o único sítio onde se ajusta.

class Reservatorio {
  // config: valores da dificuldade (capacidadeReservatorio, reservatorioInicial, evaporacao)
  constructor(config = {}) {
    this.capacidade = config.capacidadeReservatorio ?? 50;   // litros
    this.nivel = config.reservatorioInicial ?? 25;           // litros
    this.taxaEvaporacao = config.evaporacao ?? 0.6;          // litros/s com o sol a 1x
    this.litrosEvaporados = 0;                               // total perdido (para o HUD)

    // Posição e tamanho do depósito no ecrã
    this.x = 14;
    this.y = 140;
    this.w = 70;
    this.h = 260;

    this.vapor = [];   // partículas de vapor a subir do depósito
  }

  // dt em segundos; sol = multiplicador da intensidade do sol (1 = normal)
  atualizar(dt, sol) {
    // Evaporação contínua: cresce com o sol
    const perda = min(this.nivel, this.taxaEvaporacao * sol * dt);
    this.nivel -= perda;
    this.litrosEvaporados += perda;

    // Vapor a subir da superfície (mais vapor com mais sol)
    if (this.nivel > 0 && random() < 3 * sol * dt) {
      this.vapor.push({
        x: random(this.x + 6, this.x + this.w - 6),
        y: this.superficieY(),
        vy: random(0.4, 1.1),
        vida: 1,
        tam: random() < 0.5 ? 4 : 8
      });
    }
    for (let i = this.vapor.length - 1; i >= 0; i--) {
      const v = this.vapor[i];
      v.y -= v.vy;
      v.x += random(-0.4, 0.4);
      v.vida -= 0.012;
      if (v.vida <= 0) this.vapor.splice(i, 1);
    }
  }

  // Junta litros ao reservatório; devolve os litros que sobraram (desperdício)
  adicionar(litros) {
    const entra = min(litros, this.capacidade - this.nivel);
    this.nivel += entra;
    return litros - entra;
  }

  vazio() {
    return this.nivel <= 0;
  }

  // Cheio: já não cabe (quase) nada; a água que chegar é desperdiçada
  cheio() {
    return this.nivel >= this.capacidade - 0.5;
  }

  superficieY() {
    return this.y + this.h - (this.nivel / this.capacidade) * this.h;
  }

  // aviso = true faz a moldura piscar a vermelho (cheio e a chover)
  mostrar(aviso = false) {
    noStroke();

    // Título
    textAlign(CENTER, CENTER);
    textSize(11);
    fill(0);
    text('RESERVATÓRIO', this.x + this.w / 2, this.y - 12);

    // Fundo do depósito
    fill(30, 40, 60);
    rect(this.x, this.y, this.w, this.h);

    // Água (fica vermelha quando está quase a secar)
    const topo = this.superficieY();
    const baixo = this.nivel / this.capacidade < 0.2;
    fill(baixo ? color(230, 90, 70) : color(70, 150, 255));
    rect(this.x, topo, this.w, this.y + this.h - topo);
    fill(baixo ? color(250, 160, 140) : color(190, 225, 255));
    rect(this.x, topo, this.w, 4);

    // Marcas de 10 em 10 litros
    fill(255, 255, 255, 90);
    for (let l = 10; l < this.capacidade; l += 10) {
      const y = this.y + this.h - (l / this.capacidade) * this.h;
      rect(this.x, y, 10, 2);
    }

    // Moldura
    noFill();
    stroke(aviso && floor(millis() / 250) % 2 === 0 ? color(255, 60, 60) : color(0));
    strokeWeight(3);
    rect(this.x, this.y, this.w, this.h);
    noStroke();

    // Litros no reservatório
    textSize(13);
    fill(0);
    text(ceil(this.nivel) + ' / ' + this.capacidade + ' L', this.x + this.w / 2, this.y + this.h + 16);

    // Vapor (evaporação visível)
    for (const v of this.vapor) {
      fill(255, 255, 255, v.vida * 170);
      rect(v.x - v.tam / 2, v.y, v.tam, v.tam);
    }
  }
}
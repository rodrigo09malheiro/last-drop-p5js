// Classe Reservatorio
// Responsabilidade: nível de água do reservatório, evaporação ao longo
// do tempo (acelerada pelo sol), desperdício quando está cheio e o
// desenho do reservatório como uma estrutura em pixel art, no estilo
// das casas da aldeia.
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

    // Paredes da estrutura (o telhado fica por cima de y)
    this.x = 14;
    this.y = 175;
    this.w = 70;
    this.h = 225;

    // Janela onde se vê o nível da água
    this.janela = { x: this.x + 13, y: this.y + 22, w: this.w - 26, h: this.h - 80 };

    this.vapor = [];   // partículas de vapor a subir da chaminé
  }

  // dt em segundos; sol = multiplicador da intensidade do sol (1 = normal)
  atualizar(dt, sol) {
    // Evaporação contínua: cresce com o sol
    const perda = min(this.nivel, this.taxaEvaporacao * sol * dt);
    this.nivel -= perda;
    this.litrosEvaporados += perda;

    // Vapor a sair da chaminé (mais vapor com mais sol)
    if (this.nivel > 0 && random() < 3 * sol * dt) {
      this.vapor.push({
        x: this.x + this.w - 15 + random(-3, 3),
        y: this.y - 36,
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

  cheio() {
    return this.nivel >= this.capacidade - 0.01;
  }

  // ---------- Desenho ----------

  mostrar() {
    noStroke();
    const { x, y, w, h, janela: j } = this;
    const pisca = floor(millis() / 250) % 2 === 0;
    const cheio = this.cheio();
    const vazio = this.vazio();

    // Plataforma de terra (mesmas cores do chão da aldeia)
    fill(150, 100, 60);
    rect(x - 10, y + h, w + 20, 12);
    fill(125, 82, 48);
    rect(x - 10, y + h, w + 20, 4);

    // Paredes (mesma cor das casas) com juntas de tijolo
    fill(205, 160, 105);
    rect(x, y, w, h);
    fill(185, 140, 90);
    for (let ty = y + 24; ty < y + h; ty += 24) rect(x, ty, w, 2);

    // Telhado (mesma cor e forma das casas) e chaminé do vapor
    fill(90, 55, 30);
    rect(x + w - 20, y - 38, 10, 20);
    fill(160, 70, 45);
    triangle(x - 6, y, x + w / 2, y - 50, x + w + 6, y);

    // Moldura da janela (pisca quando está cheio ou vazio)
    if ((cheio || vazio) && pisca) {
      fill(vazio ? color(220, 50, 40) : color(255, 220, 60));
    } else {
      fill(90, 55, 30);
    }
    rect(j.x - 4, j.y - 4, j.w + 8, j.h + 8);

    // Interior da janela
    fill(30, 40, 60);
    rect(j.x, j.y, j.w, j.h);

    // Água visível na janela (fica vermelha quando está quase a secar)
    const fracao = constrain(this.nivel / this.capacidade, 0, 1);
    const topo = j.y + j.h - fracao * j.h;
    const baixo = fracao < 0.2;
    if (fracao > 0) {
      fill(baixo ? color(230, 90, 70) : color(70, 150, 255));
      rect(j.x, topo, j.w, j.y + j.h - topo);
      fill(baixo ? color(250, 160, 140) : color(190, 225, 255));
      rect(j.x, topo, j.w, 4);
    }

    // Marcas de 10 em 10 litros
    fill(255, 255, 255, 90);
    for (let l = 10; l < this.capacidade; l += 10) {
      rect(j.x, j.y + j.h - (l / this.capacidade) * j.h, 8, 2);
    }

    // Estado vazio: fundo seco e rachado
    if (vazio) {
      stroke(110, 70, 40);
      strokeWeight(2);
      line(j.x + 6, j.y + j.h - 2, j.x + 18, j.y + j.h - 16);
      line(j.x + 18, j.y + j.h - 16, j.x + 14, j.y + j.h - 28);
      line(j.x + 30, j.y + j.h - 2, j.x + 38, j.y + j.h - 20);
      noStroke();
    }

    // Texto dentro da janela nos estados cheio / vazio
    textAlign(CENTER, CENTER);
    textSize(11);
    if (cheio) {
      fill(0);
      text('CHEIO!', j.x + j.w / 2 + 1, j.y + 15);
      fill(255, 230, 80);
      text('CHEIO!', j.x + j.w / 2, j.y + 14);
    } else if (vazio) {
      fill(255, 90, 70);
      text('VAZIO', j.x + j.w / 2, j.y + j.h / 2);
    }

    // Cheio: água a transbordar pela parede (aviso de desperdício)
    if (cheio) {
      fill(70, 150, 255);
      for (let k = 0; k < 3; k++) {
        const yy = y + 4 + ((millis() / 6 + k * 70) % (h - 8));
        rect(x + w - 6, yy, 4, 8);
      }
    }

    // Porta (como as casas)
    fill(90, 55, 30);
    rect(x + w / 2 - 9, y + h - 30, 18, 30);

    // Torneira com pingo (só pinga se ainda há água)
    fill(80, 80, 90);
    rect(x - 10, y + h - 52, 20, 8);
    rect(x - 10, y + h - 52, 8, 16);
    if (this.nivel > 0) {
      fill(70, 150, 255);
      rect(x - 8, y + h - 34 + ((millis() / 8) % 30), 4, 6);
    }

    // Nome e litros por baixo da estrutura
    textAlign(CENTER, CENTER);
    textSize(11);
    fill(0);
    text('RESERVATÓRIO', x + w / 2, y + h + 26);
    textSize(13);
    if (cheio && pisca) {
      fill(200, 30, 30);
      text('DESPERDÍCIO!', x + w / 2, y + h + 44);
    } else {
      fill(0);
      text(ceil(this.nivel) + ' / ' + this.capacidade + ' L', x + w / 2, y + h + 44);
    }

    // Vapor (evaporação visível)
    for (const v of this.vapor) {
      fill(255, 255, 255, v.vida * 170);
      rect(v.x - v.tam / 2, v.y, v.tam, v.tam);
    }
  }
}
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

    // Paredes da estrutura: assenta no chão da aldeia (y = 480), como as casas
    // (o telhado fica por cima de y)
    this.x = 708;
    this.largura = 70;
    this.altura = 225;
    this.y = 480 - this.altura;

    // Janela onde se vê o nível da água
    this.janela = { x: this.x + 13, y: this.y + 22, largura: this.largura - 26, altura: this.altura - 80 };

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
        x: this.x + this.largura - 15 + random(-3, 3),
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

  // Vazio = sem água nenhuma: o jogo acaba (depois de uma pausa para mostrar o estado)
  vazio() {
    return this.nivel <= 0;
  }

  // Cheio = já não cabe mais um litro inteiro (a água que chegar é desperdiçada).
  // A folga de 1 L evita que a evaporação "apague" o estado a cada frame.
  cheio() {
    return this.nivel > this.capacidade - 1;
  }

  // ---------- Desenho ----------

  // aviso = true quando se chove com o reservatório cheio: telhado, janela e placa
  // piscam depressa (o aviso grande é desenhado pelo Jogo)
  mostrar(aviso = false) {
    noStroke();
    const { x, y, largura, altura, janela: j } = this;
    const pisca = floor(millis() / 250) % 2 === 0;
    const rapido = floor(millis() / 120) % 2 === 0;   // pisca depressa no aviso
    const cheio = this.cheio();
    const vazio = this.vazio();

    // Paredes (mesma cor das casas) com juntas de tijolo
    fill(205, 160, 105);
    rect(x, y, largura, altura);
    fill(185, 140, 90);
    for (let ty = y + 24; ty < y + altura; ty += 24) rect(x, ty, largura, 2);

    // Telhado em pixel art (mesma cor das casas) e chaminé do vapor
    fill(90, 55, 30);
    rect(x + largura - 20, y - 38, 10, 20);
    fill(aviso && rapido ? color(235, 50, 40) : color(160, 70, 45));
    desenharTelhado(x, y, largura, 50);

    // Moldura da janela: pisca depressa no aviso de cheio, fica amarela quando está
    // cheio (sem chover) e pisca a vermelho quando está vazio
    if (aviso) {
      fill(rapido ? color(255, 60, 50) : color(255, 220, 60));
    } else if (vazio && pisca) {
      fill(220, 50, 40);
    } else if (cheio) {
      fill(255, 220, 60);
    } else {
      fill(90, 55, 30);
    }
    rect(j.x - 4, j.y - 4, j.largura + 8, j.altura + 8);

    // Interior da janela
    fill(30, 40, 60);
    rect(j.x, j.y, j.largura, j.altura);

    // Água visível na janela (fica vermelha quando está quase a secar)
    const fracao = constrain(this.nivel / this.capacidade, 0, 1);
    const topo = j.y + j.altura - fracao * j.altura;
    const baixo = fracao < 0.2;
    if (fracao > 0) {
      fill(baixo ? color(230, 90, 70) : color(70, 150, 255));
      rect(j.x, topo, j.largura, j.y + j.altura - topo);
      fill(baixo ? color(250, 160, 140) : color(190, 225, 255));
      rect(j.x, topo, j.largura, 4);
    }

    // Marcas de 10 em 10 litros
    fill(255, 255, 255, 90);
    for (let l = 10; l < this.capacidade; l += 10) {
      rect(j.x, j.y + j.altura - (l / this.capacidade) * j.altura, 8, 2);
    }

    // Estado vazio: fundo seco e rachado
    if (vazio) {
      stroke(110, 70, 40);
      strokeWeight(2);
      line(j.x + 6, j.y + j.altura - 2, j.x + 18, j.y + j.altura - 16);
      line(j.x + 18, j.y + j.altura - 16, j.x + 14, j.y + j.altura - 28);
      line(j.x + 30, j.y + j.altura - 2, j.x + 38, j.y + j.altura - 20);
      noStroke();
    }

    // Texto dentro da janela nos estados cheio / vazio
    textAlign(CENTER, CENTER);
    textSize(11);
    if (cheio) {
      fill(0);
      text('CHEIO!', j.x + j.largura / 2 + 1, j.y + 15);
      fill(255, 230, 80);
      text('CHEIO!', j.x + j.largura / 2, j.y + 14);
    } else if (vazio) {
      fill(255, 90, 70);
      text('VAZIO', j.x + j.largura / 2, j.y + j.altura / 2);
    }

    // Cheio: água a transbordar pela parede (aviso de desperdício)
    if (cheio) {
      fill(70, 150, 255);
      for (let k = 0; k < 3; k++) {
        const yy = y + 4 + ((millis() / 6 + k * 70) % (altura - 8));
        rect(x + largura - 6, yy, 4, 8);
      }
    }

    // Porta (como as casas)
    fill(90, 55, 30);
    rect(x + largura / 2 - 9, y + altura - 30, 18, 30);

    // Torneira com pingo (só pinga se ainda há água)
    fill(80, 80, 90);
    rect(x - 10, y + altura - 52, 20, 8);
    rect(x - 10, y + altura - 52, 8, 16);
    if (this.nivel > 0) {
      fill(70, 150, 255);
      rect(x - 8, y + altura - 34 + ((millis() / 8) % 30), 4, 6);
    }

    // Placa por cima do telhado (por baixo está o chão, onde anda o balde)
    textAlign(CENTER, CENTER);
    if (aviso) {
      // Aviso: placa a piscar com CHEIO! e DESPERDÍCIO
      fill(25, 18, 14);
      rect(x - 15, y - 89, largura + 30, 40);
      fill(rapido ? color(235, 40, 40) : color(255, 200, 40));
      rect(x - 12, y - 86, largura + 24, 34);
      fill(rapido ? color(255) : color(120, 20, 10));
      textSize(17);
      text('CHEIO!', x + largura / 2, y - 76);
      textSize(11);
      text('DESPERDÍCIO', x + largura / 2, y - 59);
    } else {
      // Normal: nome e litros
      textSize(11);
      fill(0);
      text('RESERVATÓRIO', x + largura / 2, y - 76);
      textSize(13);
      text(ceil(this.nivel) + ' / ' + this.capacidade + ' L', x + largura / 2, y - 60);
    }

    // Vapor (evaporação visível)
    for (const v of this.vapor) {
      fill(255, 255, 255, v.vida * 170);
      rect(v.x - v.tam / 2, v.y, v.tam, v.tam);
    }
  }
}
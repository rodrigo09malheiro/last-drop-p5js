// Classe Gota
// Responsabilidade: gota de água (e variantes contaminada/bolha de evaporação):
// posição, velocidade aleatória controlada, desenho e movimento.
//   'agua'        -> cai; apanhada dá litros
//   'contaminada' -> cai; apanhada tira uma vida
//   'bolha'       -> sobe do chão (evaporação); apanhada tira uma vida

// Bolha de evaporação em pixel art: grelha de 10x10, cada "píxel" mede BOLHA_PX.
//   o = contorno laranja   f = interior claro   h = brilho   a = seta a subir
// Redonda, laranja e maior que as gotas (que são azuis ou verde-acastanhadas e
// em forma de pingo), para se distinguir logo.
const BOLHA_PIXELS = [
  '...oooo...',
  '..offffo..',
  '.offffffo.',
  'ofhhaafffo',
  'ofhaaaaffo',
  'ofaaaaaafo',
  'offfaafffo',
  '.offaaffo.',
  '..offffo..',
  '...oooo...'
];
const BOLHA_PX = 2;                       // desenho de 20 x 20 píxeis
const BOLHA_HITBOX = 16;                  // colisão um pouco menor que o desenho (2 px de folga)

class Gota {
  // x, y: posição inicial; tipo: 'agua', 'contaminada' ou 'bolha';
  // faixaVelocidade: [mínimo, máximo] em píxeis por frame (vem da dificuldade)
  constructor(x, y, tipo = 'agua', faixaVelocidade = [4, 6]) {
    this.x = x;                           // centro
    this.y = y;                           // topo da área de colisão
    this.tipo = tipo;
    this.largura = tipo === 'bolha' ? BOLHA_HITBOX : 8;
    this.altura = tipo === 'bolha' ? BOLHA_HITBOX : 13;
    // Aleatoriedade controlada: a faixa de velocidade das gotas vem da dificuldade
    this.velocidade = tipo === 'bolha' ? random(2, 3.5) : random(faixaVelocidade[0], faixaVelocidade[1]);
  }

  // Move a gota: a bolha sobe, as restantes caem
  atualizar() {
    if (this.tipo === 'bolha') this.y -= this.velocidade;
    else this.y += this.velocidade;
  }

  // True quando a gota já saiu do ecrã (a bolha por cima, as outras por baixo)
  foraDoEcra() {
    return this.tipo === 'bolha' ? this.y < -20 : this.y > height;
  }

  // True se apanhar esta gota tira uma vida (contaminada ou bolha)
  eMa() {
    return this.tipo !== 'agua';
  }

  // Desenha a gota (ou a bolha) em pixel art
  mostrar() {
    noStroke();
    if (this.tipo === 'bolha') {
      this.mostrarBolha();
      return;
    }

    // Gota (azul = água, verde-acastanhada = contaminada)
    const contaminada = this.tipo === 'contaminada';
    fill(contaminada ? color(110, 120, 40) : color(70, 150, 255));
    rect(this.x - 2, this.y, 4, 4);
    rect(this.x - 4, this.y + 4, 8, 6);
    rect(this.x - 3, this.y + 10, 6, 3);
    fill(contaminada ? color(170, 150, 60) : color(190, 225, 255));
    rect(this.x - 2, this.y + 5, 2, 3);
  }

  // Desenha a bolha a partir da grelha BOLHA_PIXELS, centrada na área de colisão
  mostrarBolha() {
    const cores = {
      o: color(230, 110, 40),
      f: color(255, 240, 200, 215),
      h: color(255),
      a: color(235, 90, 40)
    };
    const lado = BOLHA_PIXELS.length * BOLHA_PX;
    const x0 = this.x - lado / 2;
    const y0 = this.y + this.altura / 2 - lado / 2;
    for (let r = 0; r < BOLHA_PIXELS.length; r++) {
      for (let c = 0; c < BOLHA_PIXELS[r].length; c++) {
        const k = BOLHA_PIXELS[r][c];
        if (k === '.') continue;
        fill(cores[k]);
        rect(x0 + c * BOLHA_PX, y0 + r * BOLHA_PX, BOLHA_PX, BOLHA_PX);
      }
    }
  }
}
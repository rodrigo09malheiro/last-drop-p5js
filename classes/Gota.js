// Classe Gota
// Responsabilidade: gota de água (e variantes contaminada/bolha de evaporação):
// posição, velocidade aleatória controlada, desenho e movimento.
//   'agua'        -> cai; apanhada dá litros
//   'contaminada' -> cai; apanhada tira uma vida
//   'bolha'       -> sobe do chão (evaporação); apanhada tira uma vida

class Gota {
  constructor(x, y, tipo = 'agua') {
    this.x = x;
    this.y = y;
    this.tipo = tipo;
    this.largura = tipo === 'bolha' ? 16 : 8;
    this.altura = tipo === 'bolha' ? 16 : 13;
    this.velocidade = tipo === 'bolha' ? random(2, 3.5) : random(4, 6);  // aleatoriedade controlada
  }

  atualizar() {
    if (this.tipo === 'bolha') this.y -= this.velocidade;
    else this.y += this.velocidade;
  }

  foraDoEcra() {
    return this.tipo === 'bolha' ? this.y < -20 : this.y > height;
  }

  // Só a água boa e a contaminada contam como "gota"; a bolha é um perigo
  eMa() {
    return this.tipo !== 'agua';
  }

  mostrar() {
    noStroke();
    if (this.tipo === 'bolha') {
      // Bolha de evaporação em pixel art
      fill(255, 255, 255, 170);
      rect(this.x - 4, this.y, 8, 16);
      rect(this.x - 8, this.y + 4, 16, 8);
      fill(255, 120, 60, 200);
      rect(this.x - 2, this.y + 6, 4, 4);
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
}
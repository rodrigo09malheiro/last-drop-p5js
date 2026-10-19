// =====================================================
// Classe Jogo
// Responsabilidade: gerir os estados (início, execução, resultado),
// o tempo, a pontuação (litros recolhidos/desperdiçados), as vidas
// e a coordenação entre os restantes objetos.
// =====================================================

class Jogo {
  constructor() {
    // Estados possíveis: 'inicio', 'execucao', 'resultado'
    this.estado = 'inicio';

    // Tempo
    this.duracao = 60;      // segundos de jogo (será ajustado pela dificuldade)
    this.tempoInicio = 0;
    this.tempoRestante = this.duracao;

    // Pontuação (a ligar às colisões e ao reservatório mais tarde)
    this.litrosRecolhidos = 0;
    this.litrosDesperdicados = 0;
    this.vidas = 3;
  }

  // ---------- Controlo de estados ----------

  iniciar() {
    this.estado = 'execucao';
    this.tempoInicio = millis();
    this.tempoRestante = this.duracao;
    this.litrosRecolhidos = 0;
    this.litrosDesperdicados = 0;
    this.vidas = 3;
  }

  terminar() {
    this.estado = 'resultado';
  }

  voltarAoInicio() {
    this.estado = 'inicio';
  }

  // ---------- Atualização (lógica) ----------

  atualizar() {
    if (this.estado === 'execucao') {
      const decorrido = (millis() - this.tempoInicio) / 1000;
      this.tempoRestante = max(0, this.duracao - decorrido);

      if (this.tempoRestante <= 0 || this.vidas <= 0) {
        this.terminar();
      }
    }
  }

  // ---------- Desenho ----------

  desenhar() {
    switch (this.estado) {
      case 'inicio':
        this.desenharInicio();
        break;
      case 'execucao':
        this.desenharExecucao();
        break;
      case 'resultado':
        this.desenharResultado();
        break;
    }
    this.desenharIdentificacao();
  }

  desenharInicio() {
    background(30, 60, 90);

    textAlign(CENTER, CENTER);
    fill(255);
    textSize(56);
    text('LAST DROP', width / 2, 110);

    textSize(18);
    fill(200, 225, 255);
    text('Uma aldeia em seca depende do teu reservatório.', width / 2, 190);
    text('Faz chover com a voz e apanha a água com o balde.', width / 2, 218);
    text('Evita o desperdício e a evaporação!', width / 2, 246);

    // Modo de interação
    textSize(20);
    fill(255, 220, 120);
    text('Controlos', width / 2, 320);
    textSize(16);
    fill(255);
    text('VOZ (microfone): faz chover', width / 2, 355);
    text('RATO: move o balde na horizontal', width / 2, 380);

    // Espaço reservado para a escolha de dificuldade (próxima tarefa)

    // Pisca para chamar a atenção
    if (floor(millis() / 500) % 2 === 0) {
      textSize(22);
      fill(120, 255, 160);
      text('Clica para começar', width / 2, 480);
    }
  }

  desenharExecucao() {
    background(135, 195, 235);

    // Placeholder: aqui vão nuvem, gotas, balde, reservatório e HUD
    textAlign(LEFT, TOP);
    fill(0);
    textSize(18);
    text('Tempo: ' + ceil(this.tempoRestante) + ' s', 20, 20);
    text('Recolhidos: ' + this.litrosRecolhidos + ' L', 20, 46);
    text('Desperdiçados: ' + this.litrosDesperdicados + ' L', 20, 72);
    text('Vidas: ' + this.vidas, 20, 98);

    textAlign(CENTER, CENTER);
    textSize(16);
    fill(40);
    text('(jogo em construção - prime ESPAÇO para terminar)', width / 2, height / 2);
  }

  desenharResultado() {
    background(30, 60, 90);

    textAlign(CENTER, CENTER);
    fill(255);
    textSize(44);
    text('FIM DE JOGO', width / 2, 130);

    textSize(20);
    fill(200, 225, 255);
    text('Litros recolhidos: ' + this.litrosRecolhidos, width / 2, 230);
    text('Litros desperdiçados: ' + this.litrosDesperdicados, width / 2, 262);

    // Dica real de poupança de água (próxima tarefa)

    if (floor(millis() / 500) % 2 === 0) {
      textSize(22);
      fill(120, 255, 160);
      text('Clica para jogar outra vez', width / 2, 460);
    }
  }

  // Tema em inglês (canto inferior esquerdo) e identificação (canto inferior direito)
  desenharIdentificacao() {
    textSize(12);
    fill(255, 255, 255, 200);
    textAlign(LEFT, BOTTOM);
    text('Water Saving in Times of Drought', 10, height - 8);
    textAlign(RIGHT, BOTTOM);
    text('Rodrigo Malheiro | 33103 | ECGM', width - 10, height - 8);
  }

  // ---------- Eventos ----------

  clicar() {
    if (this.estado === 'inicio') {
      this.iniciar();
    } else if (this.estado === 'resultado') {
      this.voltarAoInicio();
    }
  }

  teclar(tecla) {
    // Temporário, só para testar a mudança de estados
    if (this.estado === 'execucao' && tecla === ' ') {
      this.terminar();
    }
  }
}
// =====================================================
// Classe Jogo
// Responsabilidade: gerir os estados (início, execução, resultado),
// o tempo, a pontuação (litros recolhidos/desperdiçados), as vidas
// e a coordenação entre os restantes objetos.
// =====================================================

// Valores de cada dificuldade: é aqui que se ajusta o equilíbrio do jogo.
//   vidas             -> vidas no início
//   tempo             -> duração do jogo (segundos)
//   velocidadeGotas   -> [mínimo, máximo] em píxeis por frame
//   pctContaminadas   -> de 0 a 1 (percentagem de gotas contaminadas)
//   intervaloBolhas   -> [mínimo, máximo] em ms entre bolhas de evaporação
//                        (o sol encurta este intervalo ao longo do jogo)
//   evaporacao        -> litros que o reservatório perde por segundo com o sol a 1x
//                        (TAXA DE EVAPORAÇÃO: é só aqui que se altera)
//   solMax            -> intensidade do sol no fim do jogo (1 = normal);
//                        a evaporação multiplica por este valor, a subir ao longo do tempo
//   capacidadeReservatorio / reservatorioInicial -> litros
//   margemMin/Max     -> distância dos limites de voz ao ruído ambiente
//                        (margem maior = é preciso falar mais alto)
const DIFICULDADES = {
  facil: {
    vidas: 5,
    tempo: 60,
    velocidadeGotas: [3.5, 5],
    pctContaminadas: 0.12,
    intervaloBolhas: [3500, 6000],
    evaporacao: 0.4,
    solMax: 1.8,
    capacidadeReservatorio: 50,
    reservatorioInicial: 30,
    margemMin: 0.02,
    margemMax: 0.04
  },
  normal: {
    vidas: 4,
    tempo: 60,
    velocidadeGotas: [4, 5.5],
    pctContaminadas: 0.18,
    intervaloBolhas: [2500, 4500],
    evaporacao: 0.6,
    solMax: 2,
    capacidadeReservatorio: 50,
    reservatorioInicial: 25,
    margemMin: 0.03,
    margemMax: 0.06
  },
  dificil: {
    vidas: 3,
    tempo: 50,
    velocidadeGotas: [4.5, 6.5],
    pctContaminadas: 0.28,
    intervaloBolhas: [1500, 3000],
    evaporacao: 1,
    solMax: 2.8,
    capacidadeReservatorio: 50,
    reservatorioInicial: 20,
    margemMin: 0.035,
    margemMax: 0.07
  }
};

class Jogo {
  constructor() {
    // Estados possíveis: 'inicio', 'execucao', 'resultado'
    this.estado = 'inicio';

    // Dificuldade escolhida no ecrã de início: 'facil', 'normal' ou 'dificil'
    // (os valores de cada nível estão em DIFICULDADES, no topo deste ficheiro)
    this.dificuldade = 'normal';
    this.config = DIFICULDADES.normal;

    // Tempo
    this.duracao = 60;      // segundos de jogo
    this.tempoInicio = 0;
    this.tempoRestante = this.duracao;

    // Pontuação (a ligar às colisões e ao reservatório mais tarde)
    this.litrosRecolhidos = 0;
    this.litrosDesperdicados = 0;
    this.vidas = 3;
    this.motivoFim = '';     // 'tempo' ou 'vidas'

    // Botões do ecrã de início (x, y, largura, altura, texto)
    this.botoesDificuldade = [
      { id: 'facil',   x: 170, y: 345, w: 140, h: 40, texto: 'FÁCIL' },
      { id: 'normal',  x: 330, y: 345, w: 140, h: 40, texto: 'NORMAL' },
      { id: 'dificil', x: 490, y: 345, w: 140, h: 40, texto: 'DIFÍCIL' }
    ];
    this.botaoComecar = { x: 280, y: 415, w: 240, h: 54, texto: 'COMEÇAR' };

    // Objetos do jogo
    this.microfone = new Microfone();
    this.nuvem = null;
    this.gotas = [];
    this.balde = null;
    this.reservatorio = null;
    this.proximaBolha = 0;   // ms até à próxima bolha de evaporação
  }

  // ---------- Controlo de estados ----------

  iniciar() {
    this.estado = 'execucao';

    // Aplica os valores da dificuldade escolhida
    this.config = DIFICULDADES[this.dificuldade];
    this.duracao = this.config.tempo;
    this.vidas = this.config.vidas;

    this.tempoInicio = millis();
    this.tempoRestante = this.duracao;
    this.litrosRecolhidos = 0;
    this.litrosDesperdicados = 0;
    this.motivoFim = '';

    this.microfone.definirMargens(this.config.margemMin, this.config.margemMax);
    this.microfone.iniciar();   // só calibra na primeira vez
    this.nuvem = new Nuvem(this.config);
    this.balde = new Balde();
    this.reservatorio = new Reservatorio(this.config);
    this.gotas = [];
    this.proximaBolha = millis() + this.config.intervaloBolhas[0];
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
      this.microfone.atualizar();

      // Durante a permissão/calibração do microfone o tempo não corre
      if (this.microfone.aEspera()) {
        this.tempoInicio = millis();
        return;
      }

      // Chove quando a histerese do microfone está ativa
      // (provisório: ESPAÇO também faz chover, para testar sem microfone)
      const chovendo = this.microfone.aFalar || keyIsDown(32);

      const novaGota = this.nuvem.atualizar(chovendo);
      if (novaGota) this.gotas.push(novaGota);

      // Evaporação: o reservatório perde água, cada vez mais depressa com o sol
      const sol = this.intensidadeSol();
      const dt = min(deltaTime, 100) / 1000;
      this.reservatorio.atualizar(dt, sol);

      // Bolhas de evaporação sobem do chão; com mais sol aparecem mais depressa
      if (millis() >= this.proximaBolha) {
        this.gotas.push(new Gota(random(110, 700), height - 30, 'bolha'));
        this.proximaBolha = millis() + random(this.config.intervaloBolhas[0], this.config.intervaloBolhas[1]) / sol;
      }

      this.balde.atualizar();

      for (let i = this.gotas.length - 1; i >= 0; i--) {
        const g = this.gotas[i];
        g.atualizar();

        if (this.balde.apanha(g)) {
          if (g.eMa()) {
            this.vidas--;            // contaminada ou bolha
            this.balde.avisar();
          } else {
            this.litrosRecolhidos++; // água boa
            // Reservatório cheio: a água que sobra é desperdício
            this.litrosDesperdicados += this.reservatorio.adicionar(1);
          }
          this.gotas.splice(i, 1);
        } else if (g.foraDoEcra()) {
          this.gotas.splice(i, 1);
        }
      }

      const decorrido = (millis() - this.tempoInicio) / 1000;
      this.tempoRestante = max(0, this.duracao - decorrido);

      // Fim de jogo: vidas a zero ou tempo esgotado
      if (this.vidas <= 0) {
        this.motivoFim = 'vidas';
        this.terminar();
      } else if (this.reservatorio.vazio()) {
        this.motivoFim = 'reservatorio';
        this.terminar();
      } else if (this.tempoRestante <= 0) {
        this.motivoFim = 'tempo';
        this.terminar();
      }
    }
  }

  // ---------- Desenho ----------

  desenhar() {
    cursor(ARROW);
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

  // ----- Ecrã de início -----

  desenharInicio() {
    this.desenharCenarioSeca();

    // Título com sombra
    textAlign(CENTER, CENTER);
    textSize(60);
    fill(90, 50, 20);
    text('LAST DROP', width / 2 + 4, 64);
    fill(255);
    text('LAST DROP', width / 2, 60);

    // Objetivo
    this.desenharPainel(110, 105, 580, 85);
    textSize(17);
    fill(255);
    text('Uma aldeia em seca depende do teu reservatório.', width / 2, 128);
    text('Faz chover com a voz e apanha a água com o balde.', width / 2, 152);
    fill(255, 220, 120);
    text('Evita o desperdício e a evaporação!', width / 2, 176);

    // Modo de interação (voz + rato)
    this.desenharPainel(110, 205, 280, 70);
    this.desenharPainel(410, 205, 280, 70);
    textSize(16);
    fill(255, 220, 120);
    text('VOZ (microfone)', 250, 225);
    text('RATO', 550, 225);
    textSize(14);
    fill(255);
    text('Fala alto para fazer chover', 250, 252);
    text('Move o balde na horizontal', 550, 252);

    // Escolha de dificuldade
    textSize(18);
    fill(255);
    text('Dificuldade', width / 2, 318);
    for (const b of this.botoesDificuldade) {
      this.desenharBotao(b, this.dificuldade === b.id);
    }

    // Botão de começar
    this.desenharBotao(this.botaoComecar, false, true);

    // Cursor de mão quando está por cima de um botão
    const todos = [...this.botoesDificuldade, this.botaoComecar];
    if (todos.some(b => this.dentro(mouseX, mouseY, b))) {
      cursor(HAND);
    }
  }

  // Cenário de seca em pixel art (céu, sol, aldeia e chão rachado)
  desenharCenarioSeca() {
    noStroke();

    // Céu em faixas
    fill(240, 190, 110);
    rect(0, 0, width, 200);
    fill(246, 203, 128);
    rect(0, 200, width, 150);
    fill(250, 218, 150);
    rect(0, 350, width, 130);

    // Sol grande
    fill(255, 236, 110);
    rect(660, 40, 90, 90);
    fill(255, 250, 175);
    rect(674, 54, 62, 62);
    fill(255, 236, 110);
    rect(699, 20, 12, 14);
    rect(699, 136, 12, 14);
    rect(640, 79, 14, 12);
    rect(756, 79, 14, 12);

    // Chão
    fill(150, 100, 60);
    rect(0, 480, width, height - 480);
    fill(125, 82, 48);
    rect(0, 480, width, 8);

    // Rachas no chão
    stroke(100, 62, 34);
    strokeWeight(3);
    line(60, 520, 100, 540);
    line(100, 540, 90, 570);
    line(250, 505, 290, 525);
    line(290, 525, 330, 520);
    line(520, 510, 560, 535);
    line(560, 535, 550, 565);
    line(700, 500, 740, 520);
    noStroke();

    // Casas da aldeia (nas laterais)
    this.desenharCasa(25, 410, 90, 70);
    this.desenharCasa(135, 430, 70, 50);
    this.desenharCasa(595, 430, 70, 50);
    this.desenharCasa(685, 405, 95, 75);
  }

  desenharCasa(x, y, w, h) {
    noStroke();
    fill(205, 160, 105);
    rect(x, y, w, h);
    fill(160, 70, 45);
    triangle(x - 6, y, x + w / 2, y - h * 0.45, x + w + 6, y);
    fill(90, 55, 30);
    rect(x + w / 2 - 8, y + h - 28, 16, 28);
    fill(120, 90, 60);
    rect(x + 8, y + 12, 14, 14);
  }

  desenharPainel(x, y, w, h) {
    noStroke();
    fill(25, 18, 14, 215);
    rect(x, y, w, h);
    fill(255, 220, 120);
    rect(x, y, w, 3);
    rect(x, y + h - 3, w, 3);
  }

  desenharBotao(b, selecionado, principal = false) {
    const hover = this.dentro(mouseX, mouseY, b);
    noStroke();

    // Borda
    if (selecionado) {
      fill(255, 220, 120);
    } else {
      fill(25, 18, 14);
    }
    rect(b.x - 3, b.y - 3, b.w + 6, b.h + 6);

    // Corpo
    if (principal) {
      fill(hover ? color(110, 215, 130) : color(70, 175, 95));
    } else if (selecionado) {
      fill(200, 90, 40);
    } else {
      fill(hover ? color(95, 70, 50) : color(60, 42, 30));
    }
    rect(b.x, b.y, b.w, b.h);

    textAlign(CENTER, CENTER);
    textSize(principal ? 24 : 16);
    fill(255);
    text(b.texto, b.x + b.w / 2, b.y + b.h / 2 + 1);
  }

  // ----- Ecrã de execução -----

  desenharExecucao() {
    background(135, 195, 235);

    // Sol, reservatório (com vapor), gotas, nuvem e balde
    this.desenharSol();
    this.reservatorio.mostrar();
    for (const g of this.gotas) g.mostrar();
    this.nuvem.mostrar();
    this.balde.mostrar();

    this.desenharHUD();

    textAlign(CENTER, CENTER);
    textSize(16);
    fill(40);
    text('(ENTER termina; ESPAÇO faz chover)', width / 2, height / 2 + 120);

    this.desenharMedidorVoz();
    this.desenharAvisoMicrofone();
  }

  // Sol que fica mais intenso (maior e mais vermelho) ao longo do jogo
  desenharSol() {
    const sol = this.intensidadeSol();
    const t = (sol - 1) / (this.config.solMax - 1 || 1);   // 0 a 1
    const tam = 36 + 34 * t;
    const cx = 650, cy = 95;
    const corSol = lerpColor(color(255, 236, 110), color(255, 130, 50), t);
    const corMiolo = lerpColor(color(255, 250, 175), color(255, 200, 110), t);
    const raio = 8 + 8 * t;

    noStroke();
    fill(corSol);
    rect(cx - tam / 2, cy - tam / 2, tam, tam);
    fill(corMiolo);
    rect(cx - tam / 3, cy - tam / 3, tam * 2 / 3, tam * 2 / 3);
    fill(corSol);
    rect(cx - 5, cy - tam / 2 - raio, 10, raio - 2);
    rect(cx - 5, cy + tam / 2 + 2, 10, raio - 2);
    rect(cx - tam / 2 - raio, cy - 5, raio - 2, 10);
    rect(cx + tam / 2 + 2, cy - 5, raio - 2, 10);

    textAlign(CENTER, CENTER);
    textSize(13);
    fill(0);
    text('SOL x' + sol.toFixed(1), cx, cy + 56);
  }

  // Intensidade do sol: 1 no início e solMax no fim do tempo
  intensidadeSol() {
    const progresso = constrain(1 - this.tempoRestante / this.duracao, 0, 1);
    return 1 + (this.config.solMax - 1) * progresso;
  }

  // HUD: litros e dificuldade (esquerda), tempo (centro) e vidas (direita)
  desenharHUD() {
    noStroke();
    fill(25, 18, 14, 200);
    rect(0, 0, width, 40);
    fill(255, 220, 120);
    rect(0, 40, width, 3);

    textSize(18);
    textAlign(LEFT, CENTER);
    fill(150, 210, 255);
    this.desenharGotaHUD(14, 12);
    fill(255);
    text(this.litrosRecolhidos + ' L', 36, 21);

    // Dificuldade escolhida
    textSize(14);
    fill(255, 220, 120);
    text(this.nomeDificuldade(), 130, 21);

    // Litros perdidos por evaporação
    fill(255, 170, 120);
    text('Evap.: ' + this.reservatorio.litrosEvaporados.toFixed(1) + ' L', 205, 21);
    textSize(18);

    // Tempo (fica vermelho nos últimos 10 segundos)
    textAlign(CENTER, CENTER);
    const t = ceil(this.tempoRestante);
    fill(t <= 10 ? color(255, 110, 110) : color(255));
    text('Tempo: ' + t + ' s', width / 2, 21);

    // Vidas em corações (cheios e vazios)
    const total = this.config.vidas;
    for (let i = 0; i < total; i++) {
      this.desenharCoracao(width - 30 - (total - 1 - i) * 30, 12, i < this.vidas);
    }
  }

  desenharGotaHUD(x, y) {
    noStroke();
    fill(70, 150, 255);
    rect(x + 4, y, 4, 4);
    rect(x + 2, y + 4, 8, 6);
    rect(x + 3, y + 10, 6, 3);
  }

  // Coração em pixel art (cheio = vermelho, vazio = cinzento escuro)
  desenharCoracao(x, y, cheio) {
    noStroke();
    fill(cheio ? color(230, 60, 70) : color(70, 60, 65));
    rect(x, y, 6, 6);
    rect(x + 10, y, 6, 6);
    rect(x - 2, y + 4, 20, 6);
    rect(x, y + 10, 16, 4);
    rect(x + 4, y + 14, 8, 3);
    if (cheio) {
      fill(255, 150, 150);
      rect(x + 1, y + 1, 3, 3);
    }
  }

  // Medidor de voz vertical com os limites mínimo e máximo (histerese)
  desenharMedidorVoz() {
    const mic = this.microfone;
    if (!mic.ativo) return;

    const x = 735, y = 120, w = 30, h = 260;
    const escala = max(0.15, mic.limiteMax * 2.5);   // volume que enche o medidor
    const paraY = (v) => y + h - constrain(v / escala, 0, 1) * h;

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    fill(0);
    text('VOZ', x + w / 2, y - 14);

    // Fundo e moldura
    fill(30, 40, 60);
    rect(x, y, w, h);

    // Nível atual (laranja quando a histerese está ativa = a chover)
    fill(mic.aFalar ? color(255, 160, 40) : color(90, 170, 240));
    const topo = paraY(mic.nivel);
    rect(x, topo, w, y + h - topo);

    // Linhas dos limites
    fill(255, 80, 80);
    rect(x - 6, paraY(mic.limiteMax) - 1, w + 12, 3);
    fill(120, 255, 140);
    rect(x - 6, paraY(mic.limiteMin) - 1, w + 12, 3);

    textAlign(RIGHT, CENTER);
    textSize(11);
    fill(180, 30, 30);
    text('máx', x - 10, paraY(mic.limiteMax));
    fill(20, 120, 40);
    text('mín', x - 10, paraY(mic.limiteMin));

    noFill();
    stroke(0);
    strokeWeight(2);
    rect(x, y, w, h);
    noStroke();
  }

  // Mensagem enquanto o microfone pede permissão, calibra ou falha
  desenharAvisoMicrofone() {
    const mic = this.microfone;
    textAlign(CENTER, CENTER);

    if (mic.aEspera()) {
      noStroke();
      fill(0, 0, 0, 170);
      rect(0, 0, width, height);
      fill(255);
      textSize(26);
      if (mic.pendente) {
        text('Permite o acesso ao microfone', width / 2, height / 2);
      } else {
        text('A calibrar o microfone... fica em silêncio', width / 2, height / 2 - 14);
        textSize(40);
        fill(255, 220, 120);
        text(mic.segundosCalibracao(), width / 2, height / 2 + 34);

        // Barra de progresso da calibração
        const bx = width / 2 - 150, by = height / 2 + 75, bw = 300, bh = 22;
        fill(30, 40, 60);
        rect(bx, by, bw, bh);
        fill(90, 170, 240);
        rect(bx, by, bw * mic.progressoCalibracao(), bh);
        noFill();
        stroke(255);
        strokeWeight(2);
        rect(bx, by, bw, bh);
        noStroke();
      }
    } else if (mic.erro) {
      textSize(14);
      fill(160, 30, 30);
      text('Microfone indisponível: usa ESPAÇO para chover', width / 2, height - 50);
    }
  }

  // ----- Ecrã de resultado -----

  desenharResultado() {
    background(30, 60, 90);

    textAlign(CENTER, CENTER);
    fill(255);
    textSize(44);
    text('FIM DE JOGO', width / 2, 110);

    textSize(18);
    fill(255, 220, 120);
    const mensagens = {
      vidas: 'Ficaste sem vidas!',
      reservatorio: 'O reservatório secou!',
      tempo: 'O tempo acabou!'
    };
    text(mensagens[this.motivoFim] || '', width / 2, 160);

    textSize(20);
    fill(200, 225, 255);
    text('Dificuldade: ' + this.nomeDificuldade(), width / 2, 205);
    text('Litros recolhidos: ' + this.litrosRecolhidos, width / 2, 245);
    text('Litros desperdiçados: ' + this.litrosDesperdicados, width / 2, 277);
    text('Vidas restantes: ' + this.vidas, width / 2, 309);
    text('Litros evaporados: ' + this.reservatorio.litrosEvaporados.toFixed(1), width / 2, 341);

    // Dica real de poupança de água (próxima tarefa)

    if (floor(millis() / 500) % 2 === 0) {
      textSize(22);
      fill(120, 255, 160);
      text('Clica para jogar outra vez', width / 2, 460);
    }
  }

  // Tema em inglês (canto inferior esquerdo) e identificação (canto inferior direito)
  desenharIdentificacao() {
    noStroke();
    fill(0, 0, 0, 140);
    rect(0, height - 26, width, 26);

    textSize(12);
    fill(255);
    textAlign(LEFT, BOTTOM);
    text('Water Saving in Times of Drought', 10, height - 7);
    textAlign(RIGHT, BOTTOM);
    text('Rodrigo Malheiro | 33103 | ECGM', width - 10, height - 7);
  }

  // ---------- Auxiliares ----------

  nomeDificuldade() {
    const b = this.botoesDificuldade.find(x => x.id === this.dificuldade);
    return b ? b.texto : '';
  }

  dentro(px, py, b) {
    return px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h;
  }

  // ---------- Eventos ----------

  clicar() {
    if (this.estado === 'inicio') {
      for (const b of this.botoesDificuldade) {
        if (this.dentro(mouseX, mouseY, b)) {
          this.dificuldade = b.id;
          return;
        }
      }
      if (this.dentro(mouseX, mouseY, this.botaoComecar)) {
        this.iniciar();
      }
    } else if (this.estado === 'resultado') {
      this.voltarAoInicio();
    }
  }

  teclar(tecla) {
    if (this.estado === 'inicio') {
      if (tecla === '1') this.dificuldade = 'facil';
      if (tecla === '2') this.dificuldade = 'normal';
      if (tecla === '3') this.dificuldade = 'dificil';
      if (tecla === 'Enter') this.iniciar();
    } else if (this.estado === 'execucao' && tecla === 'Enter') {
      // Temporário, só para testar a mudança de estados
      this.terminar();
    }
  }
}
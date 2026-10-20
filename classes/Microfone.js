// Classe Microfone
// Responsabilidade: ler o volume do microfone (p5.sound), fazer a
// calibração inicial (~4 s) e aplicar a histerese entre o limite
// mínimo e o máximo.

class Microfone {
  constructor() {
    this.mic = null;
    this.ativo = false;      // microfone a funcionar
    this.erro = false;       // permissão negada ou sem microfone
    this.pendente = false;   // à espera da permissão do browser
    this.calibrando = false;

    this.nivel = 0;          // volume suavizado (0 a 1)
    this.aFalar = false;     // estado da histerese

    // Calibração do ruído ambiente
    this.duracaoCalibracao = 4000; // ms
    this.inicioCalibracao = 0;
    this.somaRuido = 0;
    this.amostras = 0;
    this.ruidoBase = 0.01;

    // Distância ao ruído ambiente (mais tarde, depende da dificuldade)
    this.margemMin = 0.03;
    this.margemMax = 0.06;
    this.limiteMin = this.ruidoBase + this.margemMin;
    this.limiteMax = this.ruidoBase + this.margemMax;
  }

  // Tem de ser chamado num clique ou tecla (o browser exige gesto do utilizador)
  iniciar() {
    if (this.ativo || this.erro || this.pendente) return;
    this.pendente = true;

    if (typeof userStartAudio === 'function') userStartAudio();

    this.mic = new p5.AudioIn();
    this.mic.start(
      () => {
        this.pendente = false;
        this.ativo = true;
        this.calibrando = true;
        this.inicioCalibracao = millis();
        this.somaRuido = 0;
        this.amostras = 0;
      },
      () => {
        this.pendente = false;
        this.erro = true;
      }
    );
  }

  // Chamar em cada frame
  atualizar() {
    if (!this.ativo) return;

    this.nivel = lerp(this.nivel, this.mic.getLevel(), 0.3);

    if (this.calibrando) {
      this.somaRuido += this.nivel;
      this.amostras++;
      if (millis() - this.inicioCalibracao >= this.duracaoCalibracao) {
        this.terminarCalibracao();
      }
      return;
    }

    // Histerese: liga acima do máximo, só desliga abaixo do mínimo
    if (!this.aFalar && this.nivel > this.limiteMax) {
      this.aFalar = true;
    } else if (this.aFalar && this.nivel < this.limiteMin) {
      this.aFalar = false;
    }
  }

  terminarCalibracao() {
    this.calibrando = false;
    this.ruidoBase = this.amostras > 0 ? this.somaRuido / this.amostras : 0.01;
    this.limiteMin = this.ruidoBase + this.margemMin;
    this.limiteMax = this.ruidoBase + this.margemMax;
    this.aFalar = false;
  }

  // True enquanto o jogo deve esperar (permissão ou calibração)
  aEspera() {
    return this.pendente || this.calibrando;
  }

  // Segundos que faltam para acabar a calibração
  segundosCalibracao() {
    return max(0, ceil((this.duracaoCalibracao - (millis() - this.inicioCalibracao)) / 1000));
  }
}
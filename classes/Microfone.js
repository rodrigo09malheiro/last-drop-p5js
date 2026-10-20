// Classe Microfone
// Responsabilidade: ler o volume do microfone (p5.sound), fazer a
// calibração inicial (~4 s) e aplicar a histerese entre o limite
// mínimo e o máximo.

class Microfone {
  constructor() {
    this.stream = null;
    this.ctx = null;
    this.analisador = null;
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
  // Usa a Web Audio API diretamente: a p5.sound 2.x já não aceita callbacks
  // no AudioIn.start() e o getLevel() foi substituído.
  iniciar() {
    if (this.ativo || this.erro || this.pendente) return;
    this.pendente = true;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.pendente = false;
      this.erro = true;
      console.warn('Microfone: getUserMedia indisponível (usa localhost ou https)');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      })
      .then((stream) => {
        this.stream = stream;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.ctx.resume();
        const fonte = this.ctx.createMediaStreamSource(stream);
        this.analisador = this.ctx.createAnalyser();
        this.analisador.fftSize = 1024;
        this.amostrasAudio = new Float32Array(this.analisador.fftSize);
        fonte.connect(this.analisador);

        this.pendente = false;
        this.ativo = true;
        this.calibrando = true;
        this.inicioCalibracao = millis();
        this.somaRuido = 0;
        this.amostras = 0;
      })
      .catch((e) => {
        console.warn('Microfone: erro', e);
        this.pendente = false;
        this.erro = true;
      });
  }

  // Volume atual (RMS, 0 a 1)
  lerVolume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    this.analisador.getFloatTimeDomainData(this.amostrasAudio);
    let soma = 0;
    for (let i = 0; i < this.amostrasAudio.length; i++) {
      soma += this.amostrasAudio[i] * this.amostrasAudio[i];
    }
    return Math.sqrt(soma / this.amostrasAudio.length);
  }

  // Chamar em cada frame
  atualizar() {
    if (!this.ativo) return;

    this.nivel = lerp(this.nivel, this.lerVolume(), 0.3);

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
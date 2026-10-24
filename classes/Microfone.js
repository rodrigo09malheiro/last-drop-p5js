// Classe Microfone
// Responsabilidade: ler o volume do microfone (Web Audio API), medir o ruído
// ambiente no início de cada partida (calibração de 3 s) e aplicar a histerese
// entre o limite mínimo e o máximo.

class Microfone {
  constructor() {
    this.fluxo = null;       // MediaStream do microfone (guardado para o browser o manter ativo)
    this.contexto = null;    // AudioContext da Web Audio API
    this.analisador = null;  // AnalyserNode que dá o sinal de áudio
    this.dadosAudio = null;  // buffer onde se lê o sinal em cada frame
    this.ativo = false;      // microfone a funcionar
    this.erro = false;       // permissão negada ou sem microfone
    this.pendente = false;   // à espera da permissão do browser
    this.calibrando = false;

    this.nivel = 0;          // volume suavizado (0 a 1)
    this.aFalar = false;     // estado da histerese

    // Calibração do ruído ambiente
    this.duracaoCalibracao = 3000; // ms
    this.inicioCalibracao = 0;
    this.somaRuido = 0;
    this.amostras = 0;
    this.ruidoBase = 0.01;

    // Distância dos limites ao ruído ambiente (a dificuldade muda-a com definirMargens)
    this.margemMin = 0.03;
    this.margemMax = 0.06;
    this.limiteMin = this.ruidoBase + this.margemMin;
    this.limiteMax = this.ruidoBase + this.margemMax;
  }

  // Tem de ser chamado num clique ou tecla (o browser exige gesto do utilizador)
  // Usa a Web Audio API diretamente: a p5.sound 2.x já não aceita callbacks
  // no AudioIn.start() e o getLevel() foi substituído.
  iniciar() {
    // Microfone já a funcionar: em cada nova partida calibra outra vez
    if (this.ativo) {
      this.recalibrar();
      return;
    }
    if (this.erro || this.pendente) return;
    this.pendente = true;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.pendente = false;
      this.erro = true;
      // Aviso de diagnóstico (não é um log de debug): ajuda a perceber porque o microfone falhou
      console.warn('Microfone: getUserMedia indisponível (usa localhost ou https)');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      })
      .then((stream) => {
        this.fluxo = stream;
        this.contexto = new (window.AudioContext || window.webkitAudioContext)();
        this.contexto.resume();
        const fonte = this.contexto.createMediaStreamSource(stream);
        this.analisador = this.contexto.createAnalyser();
        this.analisador.fftSize = 1024;
        this.dadosAudio = new Float32Array(this.analisador.fftSize);
        fonte.connect(this.analisador);

        this.pendente = false;
        this.ativo = true;
        this.calibrando = true;
        this.inicioCalibracao = millis();
        this.somaRuido = 0;
        this.amostras = 0;
      })
      .catch((e) => {
        console.warn('Microfone: erro', e);   // aviso de diagnóstico (permissão negada, etc.)
        this.pendente = false;
        this.erro = true;
      });
  }

  // Volta a medir o ruído ambiente (chamado no início de cada partida)
  recalibrar() {
    this.calibrando = true;
    this.inicioCalibracao = millis();
    this.somaRuido = 0;
    this.amostras = 0;
    this.aFalar = false;
    this.nivel = this.lerVolume();   // não arrastar o volume da partida anterior
  }

  // Volume atual (RMS, 0 a 1)
  lerVolume() {
    if (this.contexto && this.contexto.state === 'suspended') this.contexto.resume();
    this.analisador.getFloatTimeDomainData(this.dadosAudio);
    let soma = 0;
    for (let i = 0; i < this.dadosAudio.length; i++) {
      soma += this.dadosAudio[i] * this.dadosAudio[i];
    }
    return Math.sqrt(soma / this.dadosAudio.length);
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

  // Muda a distância dos limites ao ruído ambiente (depende da dificuldade)
  definirMargens(minimo, maximo) {
    this.margemMin = minimo;
    this.margemMax = maximo;
    this.limiteMin = this.ruidoBase + this.margemMin;
    this.limiteMax = this.ruidoBase + this.margemMax;
  }

  // Fecha a calibração: o ruído ambiente médio passa a ser a base dos limites mín/máx
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

  // Progresso da calibração (0 a 1)
  progressoCalibracao() {
    return constrain((millis() - this.inicioCalibracao) / this.duracaoCalibracao, 0, 1);
  }

  // Segundos que faltam para acabar a calibração
  segundosCalibracao() {
    return max(0, ceil((this.duracaoCalibracao - (millis() - this.inicioCalibracao)) / 1000));
  }
}
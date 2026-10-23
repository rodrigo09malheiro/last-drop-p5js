# Last Drop

Exercício prático de **Sistemas Multimédia** (Engenharia da Computação Gráfica e Multimédia, IPVC, 2026-2027), desenvolvido em **P5.JS**.

- **Aluno:** Rodrigo Fernandes Malheiro (n.º 33103)
- **Tema atribuído:** *Water Saving in Times of Drought*

## Ideia

Uma aldeia em pixel art está em plena seca e depende de um reservatório que perde água continuamente por evaporação. O jogador faz chover com a voz, apanha a água com um balde e evita o desperdício, mantendo o reservatório acima de zero até ao fim do tempo.

## Como jogar

- **Voz (microfone):** quando o volume ultrapassa o limite máximo, a nuvem começa a chover; só pára quando o volume desce abaixo do limite mínimo (histerese). No início de cada partida há uma calibração do ruído ambiente (~3 s, em silêncio).
- **Rato:** move o balde na horizontal para apanhar as gotas.
- **Gotas:** a água azul enche o reservatório; as gotas contaminadas e as bolhas de evaporação, se apanhadas, tiram uma vida.
- **Desperdício:** chover com o reservatório cheio conta contra o jogador (litros desperdiçados + aviso no ecrã).
- **Fim de jogo:** acaba quando o tempo termina, as vidas chegam a zero ou o reservatório seca.
- **Atalhos de teclado (opcionais):** `1`/`2`/`3` escolhem a dificuldade e `Enter` começa; no ecrã final, `Enter` ou `R` repete e `Esc` ou `M` volta ao menu.

## Funcionalidades

- Três ecrãs: **Início** (instruções e escolha de dificuldade), **Execução** e **Resultado** (com opção de jogar outra vez ou voltar ao menu).
- Controlo por **microfone + rato**, com calibração do ruído ambiente e **histerese** entre dois limites de volume, mostrados num medidor de voz.
- **Três dificuldades** (Fácil, Normal, Difícil), configuradas num único objeto (`DIFICULDADES`, em `classes/Jogo.js`): vidas, tempo, velocidade das gotas, percentagem de contaminadas, evaporação, intensidade do sol e limites de voz.
- **Colisões** entre o balde e três tipos de gotas: água, contaminada e bolha de evaporação.
- **Aleatoriedade controlada** (tipo, posição e velocidade das gotas e das bolhas, dentro de intervalos definidos por dificuldade).
- **Feedback constante:** tempo, litros recolhidos, vidas, litros evaporados, litros desperdiçados, nível do reservatório e intensidade do sol.
- **Funcionalidade original:**
  - sistema de **desperdício** (chover com o reservatório cheio, ou deixar cair água ao chão com ele cheio, conta contra o jogador);
  - **sol cada vez mais intenso** que acelera a evaporação e faz surgir mais bolhas;
  - **dica real de poupança de água** no ecrã final, escolhida conforme o que aconteceu no jogo.

## Estado

Versão final de entrega. Estão implementados todos os pontos acima.

Não implementado: **sons** (chuva, recolha, aviso, música). A pasta `assets/sounds/` está vazia e o jogo não usa ficheiros de áudio. O feedback é só visual.

## Estrutura do repositório

```
last-drop-p5js/
├── index.html
├── sketch.js           # setup(), draw() e eventos
├── libs/
│   ├── p5.js           # p5.js v2.3.3
│   └── p5.sound.min.js # p5.sound (incluída; o microfone não a usa, ver nota abaixo)
├── classes/
│   ├── Jogo.js         # estados, dificuldades, pontuação, HUD e ecrãs
│   ├── Microfone.js    # leitura do volume, calibração e histerese
│   ├── Nuvem.js        # nuvem e geração de gotas
│   ├── Gota.js         # gotas de água, contaminadas e bolhas
│   ├── Balde.js        # balde controlado pelo rato e colisões
│   └── Reservatorio.js # nível, evaporação e desperdício
├── assets/
│   ├── img/            # vazia (todo o visual é desenhado em código)
│   └── sounds/         # vazia
├── docs/
│   ├── Last_Drop_Relatorio_Inicial.pdf
│   └── prototipo/      # ecrãs de baixa fidelidade
├── DIARIO.md           # diário de desenvolvimento e registo de uso de IA
└── README.md
```

## Como executar

Abrir o projeto através de um servidor local (por exemplo XAMPP em `http://localhost/...` ou a extensão *Live Server* do VS Code) e permitir o acesso ao microfone no navegador. O microfone não funciona se o `index.html` for aberto diretamente como ficheiro (`file://`).

## Créditos

- [p5.js](https://p5js.org/) v2.3.3.
- [p5.sound](https://p5js.org/reference/p5.sound/), incluída em `libs/` (traz o Tone.js 15.0.2). O microfone é lido diretamente com a Web Audio API (`getUserMedia` e `AnalyserNode`), porque a versão da p5.sound usada já não permite o `AudioIn` com callbacks.
- **Sons:** não são usados.
- **Imagens:** não são usados ficheiros de imagem; todo o pixel art é desenhado em código. Os ecrãs de baixa fidelidade em `docs/prototipo/` foram gerados com apoio de IA.
- **Dicas de poupança de água:** textos escritos para este projeto, com base em recomendações comuns de poupança de água.
- **Uso de IA:** o desenvolvimento teve apoio do Claude (Anthropic). O detalhe por sessão está em `DIARIO.md`.
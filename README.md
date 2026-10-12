# Last Drop

Exercício prático de **Sistemas Multimédia** (Engenharia da Computação Gráfica e Multimédia, IPVC, 2026-2027), desenvolvido em **P5.JS**.

- **Aluno:** Rodrigo Fernandes Malheiro (n.º 33103)
- **Tema atribuído:** *Water Saving in Times of Drought*

## Ideia

Uma aldeia em pixel art está em plena seca e depende de um reservatório que perde água continuamente por evaporação. O jogador faz chover com a voz, apanha a água com um balde e evita o desperdício, mantendo o reservatório acima de zero até ao fim do tempo.

## Interação (microfone + rato)

- **Voz (microfone):** quando o volume ultrapassa o limite máximo, a nuvem começa a chover; só pára quando o volume desce abaixo do limite mínimo (histerese). Há uma calibração inicial do ruído ambiente (~4 s).
- **Rato:** move o balde na horizontal para apanhar as gotas.

## Funcionalidades planeadas

- Três ecrãs: Início, Execução e Resultado/Repetir
- Calibração do microfone e histerese entre dois limites de volume
- Colisões: balde com gotas de água, gotas contaminadas e bolhas de evaporação
- Aleatoriedade controlada (tipo, posição e velocidade das gotas e obstáculos)
- Sons (chuva, recolha, aviso de desperdício, música de fundo, fim de jogo)
- Feedback constante: tempo, litros recolhidos, litros desperdiçados, vidas e reservatório
- **Funcionalidade original:** sistema de desperdício (chover com o reservatório cheio conta contra o jogador), sol cada vez mais intenso que acelera a evaporação e dica real de poupança de água no ecrã final

## Estrutura do repositório

```
last-drop-p5js/
├── index.html
├── sketch.js          # setup(), draw() e eventos (a criar)
├── libs/
│   ├── p5.js          # p5.js v2.3.3
│   └── p5.sound.min.js# p5.sound 0.4.1 (microfone e sons)
├── classes/           # Jogo, Microfone, Nuvem, Gota, Balde, Reservatorio (a criar)
├── assets/
│   ├── img/
│   └── sounds/
├── docs/
│   ├── Last_Drop_Relatorio_Inicial.pdf
│   └── prototipo/     # ecrãs de baixa fidelidade
├── DIARIO.md          # diário de desenvolvimento e registo de uso de IA
└── README.md
```

## Como executar

Abrir o projeto através de um servidor local (por exemplo XAMPP em `http://localhost/...` ou a extensão *Live Server* do VS Code) e permitir o acesso ao microfone no navegador. O microfone não funciona se o `index.html` for aberto diretamente como ficheiro.

## Estado

Fase inicial: ideia e protótipo de baixa fidelidade definidos (entrega de 12 de outubro de 2026).

## Créditos

Bibliotecas: [p5.js](https://p5js.org/) v2.3.3 e [p5.sound](https://www.npmjs.com/package/p5.sound) 0.4.1. Todo o restante material não original será indicado aqui e no relatório final.

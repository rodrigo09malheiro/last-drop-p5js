# Diário de Desenvolvimento – Last Drop

Aluno: Rodrigo Fernandes Malheiro (33103) · Sistemas Multimédia 2026-2027

## Sessão 1 – 12 de outubro de 2026

**Objetivo:** Definir a ideia do exercício e preparar o relatório inicial, o protótipo de baixa fidelidade e a apresentação.

**Atividades realizadas:**
- Li o enunciado e os requisitos obrigatórios.
- Respondi às perguntas de alinhamento (tema atribuído, número de aluno, estilo visual) e escolhi a ideia "Last Drop", com controlo por microfone + rato e estilo pixel art.
- Defini as funcionalidades, incluindo a funcionalidade original (sistema de desperdício, sol crescente e dica de poupança de água).
- Criei o repositório Git e fiz o primeiro commit com o README inicial.
- Preparei o relatório inicial (2 páginas), com os ecrãs de Início e Execução em baixa fidelidade, e a apresentação para a aula de 13 de outubro.

**Problemas:**
- Prazo curto: o relatório tinha de ser entregue no próprio dia (23:00).

**Solução:**
- Alinhei primeiro as decisões principais antes de escrever os documentos, para evitar mudanças depois.

**Decisões:**
- Controlo por microfone + rato.
- Estilo pixel art.
- O código será estruturado em classes (Jogo, Microfone, Nuvem, Gota, Balde, etc.).

### Utilização de IA (Sessão 1)

| Ferramenta | Finalidade | Resultado utilizado | Alterações/decisões do estudante |
|---|---|---|---|
| Claude (Anthropic) | Sugerir conceitos de jogo para o tema e estruturar o relatório inicial e a apresentação; gerar os ecrãs de baixa fidelidade e o README | Proposta "Last Drop", texto do relatório, slides, imagens do protótipo e README | Escolhi a ideia, o tipo de controlo e o estilo visual; confirmei o tema em inglês e as funcionalidades; revi os documentos antes de entregar |

## Sessão 2 – 19 de outubro de 2026

**Objetivo:** Planear o trabalho até à entrega (24 de outubro), organizar as tarefas no GitHub e incorporar as alterações pedidas pelo docente.

**Atividades realizadas:**
- Analisei o estado do projeto: o código do jogo ainda era só o esqueleto (classes vazias com comentários).
- Dividi o trabalho em 6 dias (de 19 a 24 de outubro, sem domingos), com um foco por dia.
- Corri um script com o GitHub CLI que criou as labels, 6 milestones (um por dia) e 20 issues com checklists.
- Criei o board em Projects e adicionei as 20 issues (18 em "A fazer" e 2 em "Feito").
- Incorporei as três alterações pedidas pelo docente, marcadas com a label `pedido-professora`: melhorar o design do repositório, melhorar a evaporação e adicionar dificuldades (Fácil/Normal/Difícil).
- Corrigi o texto de duas issues (Estrutura base e Sons).

**Problemas:**
- Dúvida sobre onde colocar e como correr o script de criação das issues.
- Confusão inicial com o calendário, porque o plano tinha de contar com o dia de hoje.

**Solução:**
- O script corre-se uma só vez, fora do repositório, com o Git Bash e o `gh auth login` feito antes.
- Confirmei que o plano começa hoje (dia 19) e termina no sábado (dia 24).

**Decisões:**
- Interpretei "design do repositório" como README e organização, e "evaporização" como a mecânica de evaporação do jogo.
- A evaporação passa a ter uma taxa configurável num só sítio, e as dificuldades usam um objeto de configuração por nível.
- Amanhã (dia 20) começa o microfone: calibração, histerese e medidor de voz.

### Utilização de IA (Sessão 2)

| Ferramenta | Finalidade | Resultado utilizado | Alterações/decisões do estudante |
|---|---|---|---|
| Claude (Anthropic) | Planear as tarefas por dia e gerar o script que cria labels, milestones e issues no GitHub | Plano de 6 dias, script `criar_issues.sh` e texto das 20 issues | Defini o prazo e os dias de trabalho, indiquei as alterações pedidas pelo docente, corri o script, criei o board e corrigi o texto de duas issues |

## Sessão 3 – 20 de outubro de 2026

**Objetivo:** Implementar os comportamentos e mecânicas base do balde e das gotas/nuvem, resolver o erro de carregamento do `Balde.js` e sincronizar as alterações com o repositório no GitHub.

**Atividades realizadas:**
- Diagnostiquei e corrigi o erro na consola (`Balde is not defined`), adicionando a tag `<script src="classes/Balde.js"></script>` no `index.html` antes do `Jogo.js`.
- Implementei o movimento do balde a acompanhar a posição horizontal do rato (`mouseX`), com restrição de limites através da função `constrain()` para não sair do canvas.
- Implementei 3 tipos de gotas (`agua`, `contaminada` e `bolha`) em `Gota.js`, com velocidades e comportamentos distintos.
- Configurei a aleatoriedade e spawn das gotas a partir da nuvem e a remoção automática do ecrã (`splice`) para evitar acumulação na memória.
- Resolvi a divergência de commits no Git (causada por um `git revert` anterior no ecrã remoto) alinhando o repositório local via `git fetch` e `git reset origin/main`, concluindo o `git push` das funcionalidades.

**Problemas:**
- A classe `Balde` não estava disponível no ecrã, gerando erro `null` / `undefined` na consola.
- Rejeição do `git push` devido a históricos divergentes entre o `main` local e o `origin/main` do GitHub.

**Solução:**
- Incluí a referência ao ficheiro `Balde.js` no `index.html` no local correto (antes do script do jogo).
- Executei `git fetch` e `git reset origin/main` para sincronizar a árvore de commits sem perder o código desenvolvido localmente, efetuando de seguida os commits estruturados e o `git push`.

**Decisões:**
- Manter o commit do Balde separado do das Gotas e Microfone para manter um histórico limpo e rastreável no Git.
- Validar as tarefas no código antes de fechar e assinalar as checklists dos *issues* correspondentes no GitHub.

### Utilização de IA (Sessão 3)

| Ferramenta | Finalidade | Resultado utilizado | Alterações/decisões do estudante |
|---|---|---|---|
| Claude (Anthropic) | Diagnóstico do erro de consola, apoio na resolução de conflitos/divergência do Git e validação do cumprimento das tarefas dos *issues*. | Passos de depuração do `index.html` e sequência de comandos Git (`fetch`, `reset`, `commit`, `push`). | Identifiquei a falha de inclusão do script no HTML, executei a sequência de comandos para alinhar o Git e procedi à marcação/fecho das *issues* no GitHub. |

## Sessão 4 – 21 de outubro de 2026

**Objetivo:** Implementar as dificuldades (Fácil/Normal/Difícil), a classe `Reservatorio` com nível, evaporação e desperdício, e melhorar a evaporação (pedidos da professora).

**Atividades realizadas:**
- Issue #13 (dificuldades): criei o objeto `DIFICULDADES` em `Jogo.js`, com uma configuração por nível: vidas, tempo, velocidade das gotas, percentagem de contaminadas, intervalo das bolhas, evaporação, sol máximo, reservatório e margens de voz. A dificuldade escolhida no ecrã de Início aplica-se ao arrancar o jogo e aparece no HUD e no ecrã de Resultado.
- Issue #12 (evaporação): a taxa de evaporação ficou só na configuração da dificuldade (um único sítio no código). Criei um sol que cresce ao longo do jogo e acelera a evaporação. Acrescentei vapor a subir do reservatório e os litros evaporados no HUD (`Evap.`) e no Resultado. O jogo termina quando o reservatório chega a 0.
- Issue #11 (`Reservatorio`): criei a classe com o nível de água, marcas de litros e o texto "X / 50 L" (fica vermelho abaixo de 20%). A água apanhada enche o reservatório.
- Reservatório cheio: ao chover com o reservatório cheio aparece um aviso a piscar ("Reservatório cheio!"), e a moldura do depósito pisca a vermelho. Os litros desperdiçados contam tanto na água apanhada como na que cai ao chão com o reservatório cheio. Aparecem em "Desp.: X L" por baixo do reservatório e no Resultado.
- Testei as mecânicas num browser de teste: água ao chão com o reservatório cheio e não cheio, água apanhada com o reservatório cheio, e o aviso a desaparecer quando paro de chover.

**Problemas:**
- Erro na consola (`Cannot read properties of null`) ao arrancar o jogo: o `this.reservatorio` estava a `null` porque o `iniciar()` falhava antes de o criar.
- A evaporação faz o nível baixar sempre, por isso o reservatório quase nunca estava exatamente em 50 L e o "cheio" nunca se verificava.

**Solução:**
- Defini "cheio" com uma pequena folga de 0,5 L (método `cheio()` em `Reservatorio.js`).

**Decisões:**
- Toda a afinação do equilíbrio do jogo (incluindo a evaporação) fica num só sítio, o objeto `DIFICULDADES`, e não dentro das classes.
- A água que cai ao chão com o reservatório cheio também conta como desperdício, para chover com o reservatório cheio penalizar o jogador mesmo sem apanhar a gota.

### Utilização de IA (Sessão 4)

| Ferramenta | Finalidade | Resultado utilizado | Alterações/decisões do estudante |
|---|---|---|---|
| Claude (Anthropic) | Acrescentar o aviso de reservatório cheio e o desperdício da água que cai ao chão, e testar as mecânicas num browser de teste | Alterações em `Jogo.js` e `Reservatorio.js` (`cheio()`, `desenharAvisoCheio()`, `desenharDesperdicio()`) | Decidi que a água ao chão também conta como desperdício, copiei os ficheiros para o projeto e confirmei no browser. |

## Sessão 5 – 22 de outubro de 2026

**Objetivo:** Integrar o reservatório na aldeia (ao nível do chão), remover o painel de fundo do medidor de voz alinhando-o à mesma altitude, corrigir a visibilidade das linhas do balde, calibrar automaticamente o microfone no início/reinício da partida, e finalizar o layout visual sem sobreposições.

**Atividades realizadas:**
- Reposicionamento do reservatório e medidor: o reservatório foi integrado no nível do chão da aldeia à direita (`y = 480`), e o medidor de voz foi colocado à esquerda na mesma altitude, perdendo o painel de fundo escuro para ficar mais integrado no cenário.
- Correção de visibilidade: as linhas/cintas do balde foram redesenhadas por último e com cores escuras para se destacarem perfeitamente sobre o corpo do balde.
- Acabamento em pixel art: o reservatório passou a ter um desenho em pixel art no estilo das casas, com estados cheio e vazio, e retoquei o balde, a nuvem e o resto do visual.
- Calibração automática do microfone: implementada a calibração automática sempre que uma nova partida é iniciada ou repetida.
- Limpeza de interface e sobreposições: ajuste das posições das casas e elementos do HUD (como o sol, nuvem e medidor) para evitar que se sobrepusessem, e atualização das mensagens de ajuda e controlo para focar totalmente na interação por voz.
- Testes das alterações visuais e mecânicas no browser de teste e preparação/envio dos commits correspondentes para o repositório GitHub (`rodrigo09malheiro/last-drop-p5js.git`).

**Problemas:**
- O medidor de voz original criava sobreposição visual com o telhado da casa e as legendas de texto ("máx", "mín", "VOZ") perdiam legibilidade sobre o céu.
- O reservatório flutuava sobre uma plataforma separada em vez de estar assente de forma natural no chão da aldeia.
- Os atalhos de teste por teclado (ESPAÇO e ENTER) ainda interferiam com o fluxo normal do jogo centrado na voz.

**Solução:**
- Remoção do painel de fundo do medidor, escurecimento dos textos de nível para garantir contraste, e relocalização do reservatório diretamente para o chão da aldeia, ajustando o texto dos litros para cima do telhado.
- Limpeza dos atalhos manuais de teste e garantia de que o microfone calibra de forma consistente a cada reinício.

**Decisões:**
- O medidor de voz mantém apenas a barra de nível dinâmica e as marcações de limite, eliminando o painel rígido para uma estética mais limpa e integrada.
- O jogo passa a depender exclusivamente da entrada de voz do microfone calibrado no arranque, removendo controlos de teclado desnecessários para a experiência final.

### Utilização de IA (Sessão 5)

| Ferramenta | Finalidade | Resultado utilizado | Alterações/decisões do estudante |
|---|---|---|---|
| Claude (Anthropic) | Ajustar a posição do reservatório para o nível do chão, remover o painel do medidor de voz, corrigir as linhas do balde e automatizar a calibração do microfone | Alterações de código nos ficheiros `Jogo.js`, `Reservatorio.js` e `Balde.js` | Analisei as propostas, apliquei e testei os ficheiros no projeto, e validei o comportamento visual e interativo antes de preparar os commits. |

## Sessão 6 – 23 de outubro de 2026

**Objetivo:** Fechar o jogo para a entrega: ecrã de Resultado completo com dica de poupança de água, opção de repetir, README final e diário atualizado.

**Atividades realizadas:**
- Ecrã de Resultado: mostra a dificuldade, o tempo jogado, os litros recolhidos, desperdiçados e evaporados e as vidas restantes.
- Dica real de poupança de água no ecrã final (`DICAS` em `Jogo.js`), escolhida conforme o que aconteceu: dicas sobre evaporação quando o reservatório secou, sobre desperdício quando houve água desperdiçada e dicas gerais nos restantes casos.
- Botões "JOGAR OUTRA VEZ" e "MENU" no ecrã de Resultado, com atalhos de teclado (`Enter`/`R` e `Esc`/`M`).
- A calibração do microfone acontece no início de cada partida.
- Redigi o README final (estado, funcionalidades, estrutura, como executar e créditos) e atualizei o `DIARIO.md` com as sessões em falta (issues #20 e #19).

**Problemas:**
- O README estava desatualizado: ainda dizia "fase inicial", indicava uma calibração de ~4 s (são 3 s) e uma versão errada da p5.sound.
- Os sons planeados (chuva, recolha, aviso, música) não ficaram implementados, e a pasta `assets/sounds/` está vazia.

**Solução:**
- Reescrevi o README a partir do código do projeto e registei nele, de forma explícita, o que não foi implementado (sons) e como o microfone é lido (Web Audio API em vez da p5.sound).

**Decisões:**
- O feedback do jogo fica só visual nesta versão, sem sons.
- A dica final depende do que aconteceu na partida, para ligar o resultado a um conselho real de poupança de água.

### Utilização de IA (Sessão 6)

| Ferramenta | Finalidade | Resultado utilizado | Alterações/decisões do estudante |
|---|---|---|---|
| Claude (Anthropic) | Redigir o README final a partir do código do projeto e atualizar o `DIARIO.md` com as sessões em falta | `README.md` final e entradas do diário | Revi os textos, confirmei o estado real do jogo e decidi deixar os sons de fora. |

## Sessão 7 – 24 de outubro de 2026

**Objetivo:** Concluir as tarefas pendentes de refinamento do jogo (calibração do microfone por partida, litros desperdiçados no HUD com décimas, aviso de reservatório cheio melhorado, medidor de voz reposicionado, remoção do texto do sol, telhados em pixel art, bolhas e refatoração/limpeza de código), preparar a documentação final e efetuar a entrega do projeto.

**Atividades realizadas:**
- Implementei a calibração do microfone no início de cada partida (quer ao iniciar pelo menu, quer ao repetir via botão ou tecla R), bloqueando o arranque do tempo e da chuva até a calibração terminar.
- Adicionei a contagem correta e a visualização dos litros desperdiçados (água boa que cai ao chão e excessos de capacidade) no HUD com arredondamento às décimas (ex.: 10.5 L) e no ecrã de Resultado, removendo o duplicado junto ao reservatório.
- Melhorei o aviso de reservatório cheio, tornando-o mais chamativo, intermitente (piscar rápido em cores fortes) e associado a um destaque visual no telhado, janela e placa do reservatório enquanto se sopra/fala.
- Reajustámos a posição vertical do medidor de voz para o ponto médio exato entre a nuvem e o chão, evitando sobreposições com elementos da UI.
- Removi o texto estático “Sol x1.n” do HUD, mantendo o crescimento progressivo do sol no cenário e reorganizando o espaço visual.
- Redesenhei todos os telhados (das casas da aldeia e do reservatório) utilizando blocos de pixel art em degraus em vez de triângulos vetoriais simples.
- Atualizei a lógica das dicas de poupança para serem selecionadas aleatoriamente entre as 11 opções disponíveis, mantendo-as fixas durante o ecrã de Resultado.
- Conduzi uma revisão exaustiva do código base para garantir a consistência de nomes, adicionar comentários descritivos em todas as funções e verificar a ausência de código morto ou logs órfãos.

**Problemas:**
- O contador de litros desperdiçados original apenas contabilizava o excesso ao encher o reservatório, ignorando a água que caía diretamente ao chão.
- O aviso de depósito cheio desaparecia instantaneamente devido à oscilação da evaporação logo no frame seguinte.
- Dificuldade inicial em manter a estabilidade do microfone e a calibração em ciclos repetidos de jogo.

**Solução:**
- Passei a somar o desperdício por queda direta e criei uma tolerância temporal (0,6 segundos) para o estado de cheio do reservatório.
- Centralizei a calibração numa função síncrona logo antes do arranque do loop principal de cada partida e seccionámos as regras de dificuldade.

**Decisões:**
- Manter o contador de desperdício exclusivamente no HUD superior para evitar poluição visual junto ao reservatório.
- Tornar as dicas de poupança independentes do resultado numérico do jogador para dinamizar a reJOGABILIDADE.

### Utilização de IA (Sessão 7)

| Ferramenta | Finalidade | Resultado utilizado | Alterações/decisões do estudante |
|---|---|---|---|
| Claude (Anthropic) | Apoio na implementação das issues #18 a #27, reestruturação visual de telhados e HUD, cálculo de posições do medidor de voz e geração do diário final. | Snippets de código para as classes (`Jogo`, `Reservatorio`, `Microfone`), lógica de cálculo de médias e estrutura em Markdown do diário. | Validei os pedaços de código adaptados ao projeto, testei comportamentos localmente e procedi aos envios finais via Git. |
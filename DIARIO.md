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
- [Outras atividades de hoje, se houver]

**Problemas:**
- Erro na consola (`Cannot read properties of null`) ao arrancar o jogo, porque o `iniciar()` falhava antes de criar o reservatório. [Confirma a causa que encontraste.]
- A evaporação faz o nível baixar sempre, por isso o reservatório quase nunca estava exatamente em 50 L e o "cheio" nunca se verificava.
- [Outros problemas]

**Solução:**
- [Como resolveste o erro da consola.]
- Defini "cheio" com uma pequena folga de 0,5 L (método `cheio()` em `Reservatorio.js`).

**Decisões:**
- Toda a afinação do equilíbrio do jogo (incluindo a evaporação) fica num só sítio, o objeto `DIFICULDADES`, e não dentro das classes.
- A água que cai ao chão com o reservatório cheio também conta como desperdício, para chover com o reservatório cheio penalizar o jogador mesmo sem apanhar a gota.
- [Outras decisões]

### Utilização de IA (Sessão 4)

| Ferramenta | Finalidade | Resultado utilizado | Alterações/decisões do estudante |
|---|---|---|---|
| Claude (Anthropic) | Acrescentar o aviso de reservatório cheio e o desperdício da água que cai ao chão, e testar as mecânicas num browser de teste | Alterações em `Jogo.js` e `Reservatorio.js` (`cheio()`, `desenharAvisoCheio()`, `desenharDesperdicio()`) | Decidi que a água ao chão também conta como desperdício, copiei os ficheiros para o projeto e confirmei no browser. [Se o resto também teve ajuda de IA, acrescenta aqui.] |

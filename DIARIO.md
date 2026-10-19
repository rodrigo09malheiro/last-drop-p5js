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

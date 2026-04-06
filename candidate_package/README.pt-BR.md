# Structured UI Renderer - Desafio de Refatoracao

## Objetivo

Voce ira refatorar e melhorar uma implementacao existente para torna-la escalavel, robusta e de facil manutencao, enquanto toma **decisoes razoaveis de produto/engenharia** com uma especificacao incompleta.

## Tempo

1-2 horas. Foque em qualidade.

**Importante:** Voce **nao** precisa implementar tratamento perfeito para todos os casos de borda nos dados fornecidos. **Priorizacao e suposicoes escritas com clareza** contam tanto quanto cobertura de codigo. Diga o que voce deixou de fora e por que.
No minimo, sua solucao deve renderizar corretamente ao menos o payload padrao `data` sem erros em tempo de execucao.

## Dados

- Payload padrao: [`src/mockData.ts`](src/mockData.ts) (`data`).
- Cenarios nomeados opcionais: `fixtures` no mesmo arquivo (por exemplo, `sections` ausente, titulo vazio). Use se for util; voce tambem pode apenas discutir no write-up.

## Requisitos (alguns sao propositalmente vagos)

### 1. Refatoracao

Melhore a estrutura, remova duplicacao e aumente a legibilidade.

### 2. Sistema de renderizacao extensivel (restricao arquitetural)

Implemente uma forma escalavel de renderizar diferentes tipos de secao (incluindo tipos adicionados por voce, por exemplo `callout`, e formatos legados/variados).

**Restricao obrigatoria:** Evite logica condicional centralizada (`if`/`else`/`switch`) como mecanismo principal de despacho de tipos de secao. Prefira um registro extensivel de renderizadores ou modelo baseado em estrategia.

### 3. Nova feature de secao (obrigatorio)

Adicione suporte para um novo tipo de secao: `metric` com `label` + `value`.

### 4. Tratamento de erro / seguranca

Trate dados invalidos ou parciais sem quebrar (por exemplo, campos nulos/ausentes, tipos de secao desconhecidos). **Secoes desconhecidas ou nao suportadas devem ser tratadas de forma segura para o usuario** - nao estamos prescrevendo exatamente a UI ou o texto; defenda sua escolha em **Assumptions & priorities** abaixo.

### 5. Tipagem

Use TypeScript corretamente. Prefira tipagem explicita e segura em vez de solucoes genericas ou frouxas. Evite `any` no design final (migracoes temporarias de `any` durante refatoracao sao aceitaveis se explicadas).

### 6. Componentizacao minima

Cada tipo de secao deve ter seu proprio componente dedicado (evite um unico "god component" para toda renderizacao de secoes).

### 7. Write-up de entrega (OBRIGATORIO)

#### Assumptions & priorities (subsecao obrigatoria)

Inclua uma lista com bullets cobrindo pelo menos:

- **Priority order** - o que voce atacou primeiro e o que pulou/simplificou.
- **Explicit out-of-scope** - o que voce decidiu nao resolver no tempo disponivel.
- **With more time** - as proximas 2-3 melhorias que voce faria.

#### Perguntas reflexivas (responda todas)

- O que voce mudou e por que?
- O que melhoraria em seguida?
- Como voce escalaria isso se o numero de tipos de secao crescesse ~10x?
- Como voce tratou dados desconhecidos/invalidos e payloads ambiguos (por exemplo, chaves legadas, itens mistos em listas)?
- Como voce testaria isso (quais casos, quais camadas - unitario vs integracao etc.)?
- Qual decisao voce revisitaria primeiro se isso fosse para producao amanha, e por que?
- Voce usou ferramentas de IA? Se sim, como?

Prefira solucoes simples e pragmaticas em vez de over-engineering. Nao se espera suporte completo para todos os casos de borda - priorizacao faz parte da avaliacao.

## Tarefas (checklist)

1. Refatoracao
2. Renderizacao extensivel
3. Adicionar tipo de secao `metric` (`label` + `value`)
4. Tratamento de erro / degradacao graciosa
5. Tipagem
6. Componentizar por tipo de secao
7. Write-up (Assumptions & priorities + perguntas reflexivas)

## Entrega

- Link do repositorio GitHub
- Garantir que o write-up no README ou em `SUBMISSION.md` esteja visivel no repositorio (o mesmo conteudo acima e suficiente).

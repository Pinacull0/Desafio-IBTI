# Checklist Completo do Desafio

Este arquivo resume **tudo** que o `README.md` exige, em formato de checklist.

## 1) Objetivo e regra geral

- [x] Refatorar a implementacao atual para ficar escalavel, robusta e de facil manutencao.
- [x] Tomar decisoes razoaveis de produto/engenharia mesmo com especificacao incompleta.
- [x] Preferir solucoes simples e pragmaticas, evitando over-engineering.
- [ ] Respeitar timebox de 1-2 horas com foco em qualidade.
- [x] Priorizar: nao precisa cobrir todos os edge cases.
- [x] Documentar claramente o que foi priorizado, simplificado e adiado.
- [x] Garantir no minimo que o payload padrao `data` renderize sem erro de runtime.

## 2) Dados a considerar

- [x] Usar o payload padrao em `src/mockData.ts` (`data`).
- [x] Considerar os cenarios opcionais em `fixtures` (ou justificar no write-up por que nao implementou).

## 3) Requisitos tecnicos obrigatorios

### 3.1 Refactor
- [x] Melhorar estrutura do codigo.
- [x] Remover duplicacao.
- [x] Aumentar legibilidade.

### 3.2 Renderizacao extensivel (restricao arquitetural)
- [x] Implementar forma escalavel de renderizar tipos diferentes de secao.
- [x] Suportar tipos adicionados por voce (ex.: `callout`) alem de formatos legados/variados.
- [x] Suportar variacoes/legados de payload.
- [x] **Nao usar `if/else/switch` centralizado como mecanismo principal de dispatch**.
- [x] Usar abordagem extensivel (ex.: registry/strategy).

### 3.3 Nova feature obrigatoria
- [x] Adicionar tipo de secao `metric`.
- [x] `metric` deve suportar `label` + `value`.

### 3.4 Tratamento de erro / seguranca
- [x] Tratar dados invalidos/parciais sem quebrar.
- [x] Cobrir campos nulos/ausentes.
- [x] Tratar tipo de secao desconhecido/nao suportado de forma segura para o usuario.
- [x] Justificar a escolha dessa estrategia no write-up.

### 3.5 Tipagem
- [x] Usar TypeScript corretamente.
- [x] Preferir tipagem explicita e segura.
- [x] Evitar solucao frouxa/generica demais.
- [x] Evitar `any` no design final.

### 3.6 Componentizacao minima
- [x] Cada tipo de secao deve ter componente dedicado.
- [x] Evitar "god component" para todas as secoes.

## 4) Write-up obrigatorio (README ou SUBMISSION.md)

### 4.1 Assumptions & priorities (subsecao obrigatoria)
- [x] Incluir **Priority order** (ordem do que foi atacado primeiro).
- [x] Incluir **Explicit out-of-scope** (o que ficou fora no timebox).
- [x] Incluir **With more time** (2-3 proximas melhorias).

### 4.2 Perguntas reflexivas (responder todas)
- [x] O que voce mudou e por que?
- [x] O que voce melhoraria em seguida?
- [x] Como escalaria se os tipos de secao crescessem ~10x?
- [x] Como tratou dados unknown/invalid e payload ambiguo (legado, lista mista etc.)?
- [x] Como testaria (casos e camadas: unitario/integracao)?
- [x] Qual decisao revisitaria primeiro em producao e por que?
- [x] Usou IA? Se sim, como?

## 5) Checklist final de tarefas (resumo)

- [x] 1. Refactor
- [x] 2. Renderizacao extensivel
- [x] 3. Tipo `metric` (`label` + `value`)
- [x] 4. Error handling / degradacao graciosa
- [x] 5. Tipagem
- [x] 6. Componentizacao por tipo de secao
- [x] 7. Write-up completo

## 6) Entrega

- [ ] Disponibilizar link do repositorio GitHub.
- [x] Garantir que o write-up esteja visivel no repo (`README` ou `SUBMISSION.md`).

## 7) Criterios praticos de aceite antes de enviar

- [x] O payload padrao `data` renderiza sem erro.
- [x] Seccoes desconhecidas nao quebram a UI.
- [x] `metric` aparece corretamente.
- [x] Nao existe dispatch central via `if/else/switch`.
- [x] Cada secao tem componente proprio.
- [x] Write-up cobre todas as perguntas obrigatorias.

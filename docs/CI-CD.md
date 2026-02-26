# CI/CD Pipeline

Este projeto utiliza GitHub Actions para automatizar testes, build e cobertura de código.

## Workflows

### 1. Test Workflow (`.github/workflows/test.yml`)

Executa automaticamente em:
- Push para branches `main` ou `develop`
- Pull Requests para `main` ou `develop`

**O que faz:**
- ✅ Testa com Node.js 18.x e 20.x
- ✅ Instala dependências
- ✅ Executa toda a suite de testes
- ✅ Gera relatório de cobertura
- ✅ Envia cobertura para Codecov

**Status:** Badge de status está no README

### 2. Build Workflow (`.github/workflows/build.yml`)

Executa automaticamente em:
- Push para branch `main`
- Pull Requests para `main`

**O que faz:**
- ✅ Compila TypeScript
- ✅ Verifica se `lib/` foi gerado corretamente
- ✅ Garante que a build está saudável

**Status:** Badge de status está no README

## Badges

O README inclui badges que mostram:

- 🧪 Status dos testes
- 🏗️ Status do build
- 📊 Cobertura de código (via Codecov)
- 📦 Versão npm
- 📄 Licença

## Configuração Local

### Rodar testes localmente

```bash
# Executar testes uma vez
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Verificar cobertura

Os relatórios de cobertura são gerados em `coverage/`:
- `coverage/index.html` - Relatório HTML interativo
- `coverage/coverage-final.json` - Formato JSON

Abra `coverage/index.html` no navegador para ver cobertura detalhada por arquivo.

## Requisitos de Cobertura

O projeto exige **80% de cobertura mínima** em:
- ✅ Branches
- ✅ Funções
- ✅ Linhas
- ✅ Statements

Se a cobertura cair abaixo disso, o build falha.

## Configuração Codecov

A cobertura é automaticamente enviada para [Codecov](https://codecov.io/) após cada push.

URL do projeto no Codecov:
```
https://codecov.io/gh/tlimao/cubit-ts
```

Os relatórios de cobertura são retidos por 30 dias no Codecov.

## Troubleshooting

### Testes falharam localmente?

1. Verifique Node.js: `node --version` (17.0.0+)
2. Instale dependências: `npm ci`
3. Execute testes: `npm test`

### Build falhou?

1. Verifique TypeScript: `npm run build`
2. Procure erros de compilação
3. Corrija e re-envie

### Cobertura abaixo do limite?

1. Verifique: `npm run test:coverage`
2. Abra `coverage/index.html`
3. Adicione testes para linhas não cobertas
4. Target: 80% mínimo

## Integração com Git

### Pre-commit (opcional)

Para garantir que testes passam antes de commitar:

```bash
npm install -D husky lint-staged

npx husky install
npx husky add .husky/pre-commit "npm test"
```

Isso executará testes automaticamente antes de cada commit.

## Próximos Passos

- [ ] Configurar Codecov para comentários em PRs
- [ ] Adicionar badges adicionais (downloads npm, etc)
- [ ] Configurar releases automáticas

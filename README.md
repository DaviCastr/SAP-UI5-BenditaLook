# Bendita Look - UI5

App UI5 (TypeScript, MVC) da loja Bendita Look, separado do backend [SAP-CAP-BenditaLook](https://github.com/DaviCastr/SAP-CAP-BenditaLook).

## Telas

| Rota | Acesso | Conteúdo |
|---|---|---|
| `#/` | Público | Vitrine com busca e filtro por categoria |
| `#/product/{id}` | Público | Fotos por cor, seleção de cor/tamanho, estoque e adicionar ao carrinho |
| `#/cart` | Público | Carrinho (salvo no navegador) e formulário de contato para enviar o pedido |
| `#/order/{número}/{código}` | Público (link do email) | Acompanhamento do pedido |
| `#/login` | - | Login da área administrativa (XSUAA) |
| `#/admin/:aba:` | Role `Admin` | Pedidos (status + WhatsApp), produtos, categorias e backup |
| `#/admin/product/{id}` | Role `Admin` | Editor do produto em draft: dados, cores, tamanhos/estoque e fotos |

## Estrutura

```
webapp/
  auth/          autenticação XSUAA (GitHub Pages) e mock (local)
  controller/    controllers das views; admin/ contém as seções da área administrativa
  model/         carrinho, formatters e modelos
  service/       pedidos, drafts, backup, upload/compressão de imagens
  util/          http, ambiente e tratamento de erros
  view/          views XML e fragments
  i18n/          textos
  config/        runtime-config.json (URLs do CAP e XSUAA)
```

São dois modelos OData V4: `catalog` (público, sempre carregado) e o modelo padrão do serviço admin, criado só após o login.

As fotos são redimensionadas no navegador (máx. 1200px, JPEG) antes do upload.

## Desenvolvimento local

Com o CAP rodando em `http://localhost:4004`:

```bash
npm install
npm start          # http://localhost:8080/index.html
```

O proxy local (`custom-proxy`) encaminha `/api/service/...` e `/auth/...` para o CAP. Em ambiente local o login é simulado e o proxy envia o usuário de desenvolvimento do CAP (`basicAuth` em `ui5-local.yaml`) apenas para o serviço admin.

## Publicação (GitHub Pages)

1. Faça o deploy do CAP no BTP Trial (ver README do CAP).
2. Preencha `webapp/config/runtime-config.json` com a URL do serviço CAP, o WhatsApp da loja e os dados do XSUAA (`authDomain`, `clientId`, `scope`), obtidos na service key do `BenditaLook-uaa`.
3. Faça push na `main`: o workflow `.github/workflows/deploy.yml` gera o build e publica na branch `gh-pages`.
4. Em Settings > Pages do repositório, selecione a branch `gh-pages`.

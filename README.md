# Projeto C.A.I.X.A. — Website

Website institucional do Projeto C.A.I.X.A., dedicado à prevenção primária do cancro infantil através da literacia em saúde e de experiências interativas com tecnologias XR.

Produção: [https://caixa.arditi.pt](https://caixa.arditi.pt)

## Tecnologias

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Docker com output standalone do Next.js

## Requisitos

Para desenvolvimento local:

- Node.js 22
- npm

Em alternativa, é possível executar a aplicação apenas com Docker e Docker Compose.

## Desenvolvimento local

Instalar as dependências:

```bash
npm ci
```

Criar o ficheiro local de variáveis de ambiente a partir do exemplo:

```bash
cp .env.example .env.local
```

No PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação fica disponível em [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `SITE_URL` | Sim em produção | URL pública e canónica, sem barra no fim. O valor de produção é `https://caixa.arditi.pt`. |
| `GOOGLE_SITE_VERIFICATION` | Não | Token da meta tag fornecido pelo Google Search Console. Deve conter apenas o token, não a tag HTML completa. |
| `APP_PORT` | Não | Porta publicada pelo Docker Compose. Por omissão é `3000`. |

O ficheiro `.env.local` não deve ser enviado para o GitHub. O repositório inclui apenas o ficheiro seguro [.env.example](./.env.example).

As variáveis relacionadas com SEO são utilizadas durante a compilação. Depois de as alterar, é necessário voltar a executar o build ou reconstruir a imagem Docker.

## Comandos disponíveis

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Cria uma compilação otimizada de produção. |
| `npm run start` | Inicia a compilação de produção. |
| `npm run lint` | Executa as verificações do ESLint. |

Antes de publicar alterações, executar:

```bash
npm run lint
npm run build
```

## Docker

O projeto utiliza `output: "standalone"` para produzir uma imagem de execução reduzida e independente das dependências de desenvolvimento.

Construir e iniciar com Docker Compose:

```bash
docker compose up -d --build
```

Consultar os logs:

```bash
docker compose logs -f website
```

Parar a aplicação:

```bash
docker compose down
```

Por omissão, o container expõe a aplicação em `http://localhost:3000`. Para utilizar outra porta no host:

```bash
APP_PORT=8080 docker compose up -d --build
```

Também é possível construir a imagem diretamente:

```bash
docker build \
  --build-arg SITE_URL=https://caixa.arditi.pt \
  --build-arg GOOGLE_SITE_VERIFICATION=TOKEN_DO_GOOGLE \
  -t caixa-web .
```

E executá-la:

```bash
docker run --rm -p 3000:3000 --name caixa-web caixa-web
```

Em produção, o container deve ficar atrás de um reverse proxy, como nginx ou Traefik, responsável pelo domínio, HTTPS e encaminhamento para a porta `3000`.

O website atual não utiliza MySQL nem necessita de qualquer outra base de dados para ser publicado.

## Rotas principais

| Rota | Conteúdo |
| --- | --- |
| `/` | Página institucional e respetivas secções. |
| `/noticias` | Arquivo completo de notícias e eventos. |
| `/noticias/[slug]` | Página individual de uma notícia. |
| `/base-cientifica` | Página reservada para os trabalhos científicos de referência. |
| `/sitemap.xml` | Sitemap gerado automaticamente. |
| `/robots.txt` | Regras de indexação e localização do sitemap. |
| `/opengraph-image` | Imagem social gerada pelo Next.js. |

## Gestão atual das notícias

As notícias estão definidas em [`lib/newsletterData.ts`](./lib/newsletterData.ts). Cada entrada contém:

- `slug`
- `publishedAt`
- título em português e inglês
- categoria em português e inglês
- data apresentada em português e inglês
- imagem e texto alternativo
- conteúdo em português e inglês

As imagens utilizadas pelas notícias devem ser guardadas em [`public/images`](./public/images).

Ao adicionar uma notícia:

1. Adicionar a imagem a `public/images`.
2. Criar a entrada correspondente em `lib/newsletterData.ts`.
3. Utilizar um `slug` único, apenas com letras minúsculas, números e hífenes.
4. Definir `publishedAt` no formato ISO `AAAA-MM-DD`.
5. Confirmar a notícia em `/noticias` e `/noticias/[slug]`.
6. Executar lint e build antes da publicação.

O sitemap inclui automaticamente todas as notícias presentes neste ficheiro.

## SEO e Google Search Console

O projeto inclui:

- Canonicals por página
- Metadados Open Graph e Twitter Cards
- Dados estruturados `WebSite`, `Organization` e `NewsArticle`
- Sitemap com as páginas e imagens das notícias
- `robots.txt` com referência ao sitemap
- Suporte para verificação do Google Search Console

Depois do deployment:

1. Confirmar [https://caixa.arditi.pt/robots.txt](https://caixa.arditi.pt/robots.txt).
2. Confirmar [https://caixa.arditi.pt/sitemap.xml](https://caixa.arditi.pt/sitemap.xml).
3. Verificar a propriedade no Google Search Console.
4. Submeter `https://caixa.arditi.pt/sitemap.xml` no relatório de Sitemaps.

A página `/base-cientifica` está temporariamente marcada como `noindex` enquanto não tiver os trabalhos científicos reais. Quando o conteúdo for adicionado, deve ser removido o `noindex` e a página deve ser incluída no sitemap.

## Estrutura principal

```text
app/                    Rotas, páginas e metadados do Next.js
components/             Componentes visuais e interativos
context/                Estado global do idioma
lib/                    Dados, traduções e configuração do website
public/images/          Imagens gerais e das notícias
public/partners/        Logótipos das entidades parceiras
public/team/            Fotografias da equipa
Dockerfile              Construção da imagem de produção
compose.yaml            Execução local ou no servidor com Docker Compose
```

## Notas de deployment

- O DNS de `caixa.arditi.pt` deve apontar para a infraestrutura de produção.
- O reverse proxy deve terminar o certificado HTTPS e encaminhar os pedidos para o container.
- O container possui um health check HTTP integrado.
- Segredos e credenciais nunca devem ser adicionados ao repositório.
- A mesma imagem Docker deve ser utilizada em todas as instâncias do mesmo deployment.

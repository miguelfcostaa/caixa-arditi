# Projeto C.A.I.X.A.

Website institucional dedicado à prevenção primária do cancro infantil através da literacia em saúde e de tecnologias XR.

Produção: [caixa.arditi.pt](https://caixa.arditi.pt)

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Docker

## Desenvolvimento local

Requer Node.js 22 e npm.

```bash
npm ci
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Verificações:

```bash
npm run lint
npm run build
```

## Variáveis de ambiente

Copiar `.env.example` para `.env.local`.

```env
SITE_URL=https://caixa.arditi.pt
GOOGLE_SITE_VERIFICATION=
```

Nunca enviar ficheiros `.env` para o GitHub.

## Docker

Iniciar:

```bash
docker compose up -d --build
```

Ver logs:

```bash
docker compose logs -f website
```

Parar:

```bash
docker compose down
```

A aplicação usa a porta `3000`. Em produção, deve ficar atrás de nginx, Traefik ou outro reverse proxy com HTTPS.

O website não utiliza MySQL.

## Notícias

As notícias estão em [`lib/newsletterData.ts`](./lib/newsletterData.ts).

As imagens estão em [`public/images`](./public/images).

Cada notícia precisa de:

- Slug único
- Data no formato `AAAA-MM-DD`
- Título, categoria e conteúdo em português e inglês
- Imagem e texto alternativo

## SEO

O projeto inclui sitemap, `robots.txt`, URLs canónicas, Open Graph e dados estruturados.

- Sitemap: [caixa.arditi.pt/sitemap.xml](https://caixa.arditi.pt/sitemap.xml)
- Robots: [caixa.arditi.pt/robots.txt](https://caixa.arditi.pt/robots.txt)

A página `/base-cientifica` permanece em `noindex` até receber conteúdo final.

## Deployment

O servidor precisa de:

- Docker e Docker Compose
- Acesso ao repositório GitHub
- DNS de `caixa.arditi.pt`
- Reverse proxy com HTTPS

Publicar:

```bash
git pull
docker compose up -d --build
```

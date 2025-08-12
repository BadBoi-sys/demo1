# Deploying to GitHub Pages

This project is a Vite + React app in the `Website/` directory. You can deploy it to GitHub Pages using GitHub Actions.

## Setup

1. Push this repository to GitHub.
2. Go to your repository's Settings → Pages → Build and deployment → Source: GitHub Actions.
3. Ensure your repo name is known (e.g. `username/repo`). For user/organization pages (username.github.io) the base is `/`. For project pages, set BASE_PATH to `/<repo>/`.

## Build locally (optional)

```bash
cd Website
npm ci
BASE_PATH=/<repo>/ npm run build
```

## Actions workflow

Add `.github/workflows/deploy.yml` at repo root to deploy on push to `main`.

```yaml
name: Deploy Website to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: Website
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: Website/package-lock.json

      - name: Install
        run: npm ci

      - name: Build
        env:
          BASE_PATH: '/<repo>/'
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: Website/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Replace `/<repo>/` with your repository name if you are deploying to a project page. For user pages (e.g., `username.github.io`), set `BASE_PATH` to `/` or omit it.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

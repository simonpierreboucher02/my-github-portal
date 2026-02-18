<p align="center">
  <img src="https://img.shields.io/badge/SPBoucher-GitHub%20Portal-blue?style=for-the-badge&logo=github" alt="SPBoucher GitHub Portal" />
</p>

<h1 align="center">SPBoucher GitHub Portal</h1>

<p align="center">
  <strong>Un portail web personnel pour explorer, visualiser et naviguer dans mes repositories GitHub avec coloration syntaxique, rendu Markdown, visualisation de notebooks Jupyter et bien plus encore.</strong>
</p>

<p align="center">
  <a href="https://github.com/simonpierreboucher02/my-github-portal">
    <img src="https://img.shields.io/github/stars/simonpierreboucher02/my-github-portal?style=flat-square&color=yellow" alt="Stars" />
  </a>
  <a href="https://github.com/simonpierreboucher02/my-github-portal/network/members">
    <img src="https://img.shields.io/github/forks/simonpierreboucher02/my-github-portal?style=flat-square&color=blue" alt="Forks" />
  </a>
  <a href="https://github.com/simonpierreboucher02/my-github-portal/issues">
    <img src="https://img.shields.io/github/issues/simonpierreboucher02/my-github-portal?style=flat-square&color=red" alt="Issues" />
  </a>
  <a href="https://github.com/simonpierreboucher02/my-github-portal/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/simonpierreboucher02/my-github-portal?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/simonpierreboucher02/my-github-portal">
    <img src="https://img.shields.io/github/repo-size/simonpierreboucher02/my-github-portal?style=flat-square&color=green" alt="Repo Size" />
  </a>
  <a href="https://github.com/simonpierreboucher02/my-github-portal/commits/main">
    <img src="https://img.shields.io/github/last-commit/simonpierreboucher02/my-github-portal?style=flat-square&color=purple" alt="Last Commit" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/highlight.js-11-f7df1e?style=flat-square" alt="highlight.js" />
</p>

<p align="center">
  <a href="https://www.spboucher.ai">
    <img src="https://img.shields.io/badge/Website-spboucher.ai-0969da?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
  </a>
  <a href="mailto:spbou4@protonmail.com">
    <img src="https://img.shields.io/badge/Email-spbou4%40protonmail.com-8B89CC?style=for-the-badge&logo=protonmail&logoColor=white" alt="Email" />
  </a>
</p>

---

## Apercu

**SPBoucher GitHub Portal** est une application web full-stack construite avec **Next.js 16** et **TypeScript** qui sert de portail personnel pour visualiser et explorer des repositories GitHub. L'application offre une experience similaire a GitHub avec la navigation de fichiers, la coloration syntaxique, l'historique des commits avec diffs colores, et des fonctionnalites de rendu avance pour les fichiers Markdown, HTML et Jupyter Notebook.

L'application est entierement responsive (mobile-first) et supporte un **mode clair et sombre** avec persistance du choix utilisateur.

---

## Fonctionnalites

### Navigation et exploration
- **Page d'accueil publique** avec grille de tous les repositories importes
- **Recherche en temps reel** par nom, description ou langage
- **Filtre par langage** de programmation via menu deroulant
- **Statistiques globales** : nombre de repos, langages et etoiles
- **Animations d'entree** fluides et echelonnees

### Visualisation de code
- **Navigateur de fichiers** avec navigation dans l'arborescence du repo
- **Coloration syntaxique** via highlight.js pour 40+ langages
- **Numeros de ligne** interactifs avec hover
- **Selection de branche** pour naviguer entre les branches Git
- **Barre de langages** avec pourcentages (comme sur GitHub)
- **Breadcrumb** de navigation dans les dossiers

### Rendu de fichiers speciaux
- **Markdown (.md, .mdx)** : rendu complet avec GitHub Flavored Markdown (tables, checkboxes, blocs de code avec syntax highlighting, images, blockquotes)
- **HTML (.html, .htm)** : rendu dans un iframe sandboxe securise
- **Jupyter Notebook (.ipynb)** : parsing complet du JSON avec affichage des cellules code/markdown, outputs texte/HTML/images, traceback d'erreurs, et info du kernel
- **Toggle Preview/Code** : basculer entre vue rendue et code source brut

### Historique des commits
- **Liste paginee** des commits avec avatar, message, auteur et date relative
- **Detail de commit** avec statistiques (+/-), liste des fichiers modifies et **diffs colores** (ajouts en vert, suppressions en rouge, hunks en bleu)
- **Navigation** entre commits et retour au repo

### Panneau d'administration
- **Authentification par mot de passe** avec stockage en session
- **Ajout de repositories** via URL GitHub directe ou format `owner/repo`
- **Suppression** de repositories avec confirmation
- **Validation** via l'API GitHub (recuperation automatique des metadonnees)

### Theme clair / sombre
- **Toggle** dans le header avec icones soleil/lune
- **30+ variables CSS** adaptees pour chaque theme
- **Coloration syntaxique** adaptee au theme (github-dark / github-light)
- **Diffs** avec couleurs adaptees
- **Persistance** du choix dans localStorage
- **Detection automatique** du theme systeme au premier chargement

### Design et UX
- **Glassmorphism** sur le header (backdrop-blur)
- **Titre en gradient** anime
- **Cartes** avec ombres elevees et hover avec translation
- **Design responsif** mobile-first avec hamburger menu
- **Animations fadeInUp** sur le contenu
- **Footer** informatif

---

## Stack technique

| Technologie | Version | Utilisation |
|---|---|---|
| **Next.js** | 16.1.6 | Framework React full-stack (App Router) |
| **TypeScript** | 5.x | Typage statique |
| **React** | 19.2.3 | UI components |
| **Tailwind CSS** | 4.x | Styling utilitaire responsive |
| **highlight.js** | 11.x | Coloration syntaxique (40+ langages) |
| **react-markdown** | 10.x | Rendu Markdown |
| **remark-gfm** | 4.x | GitHub Flavored Markdown |
| **rehype-highlight** | 7.x | Syntax highlighting dans le Markdown |
| **rehype-raw** | 7.x | Support HTML brut dans le Markdown |

---

## Architecture du projet

```
my-github-portal/
├── data/
│   └── repos.json                          # Base de donnees JSON des repos importes
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Layout principal + ThemeProvider
│   │   ├── page.tsx                        # Page d'accueil (grille repos + recherche)
│   │   ├── globals.css                     # Variables CSS (dark/light) + prose + notebook
│   │   ├── admin/
│   │   │   └── page.tsx                    # Panneau admin (login + CRUD repos)
│   │   ├── repo/[owner]/[name]/
│   │   │   ├── page.tsx                    # Code browser + commits
│   │   │   └── commit/[sha]/
│   │   │       └── page.tsx                # Detail commit + diffs colores
│   │   └── api/
│   │       ├── auth/route.ts               # Authentification admin
│   │       └── repos/
│   │           ├── route.ts                # GET/POST/DELETE repos
│   │           └── [owner]/[repo]/
│   │               ├── route.ts            # Info repo
│   │               ├── branches/route.ts   # Liste des branches
│   │               ├── commits/
│   │               │   ├── route.ts        # Liste des commits
│   │               │   └── [sha]/route.ts  # Detail d'un commit
│   │               ├── contents/route.ts   # Contenu d'un dossier
│   │               ├── file/route.ts       # Contenu d'un fichier
│   │               └── languages/route.ts  # Langages du repo
│   ├── components/
│   │   ├── Header.tsx                      # Header glassmorphism + nav + theme toggle
│   │   ├── RepoCard.tsx                    # Carte de repo avec ombres et hover
│   │   ├── FileViewer.tsx                  # Viewer universel (code/MD/HTML/notebook)
│   │   ├── CodeViewer.tsx                  # Viewer code avec highlight.js
│   │   └── ThemeProvider.tsx               # Context React pour le theme
│   └── lib/
│       ├── github.ts                       # Client API GitHub (fetch, parse URL)
│       └── store.ts                        # CRUD fichier JSON (repos.json)
├── next.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## Installation et demarrage

### Prerequis

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Cloner le repository
git clone https://github.com/simonpierreboucher02/my-github-portal.git
cd my-github-portal

# Installer les dependances
npm install
```

### Demarrage en developpement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3003**.

### Build de production

```bash
npm run build
npm start
```

### Configuration optionnelle

Pour augmenter la limite de requetes a l'API GitHub (60/h sans token vs 5000/h avec), creez un fichier `.env.local` :

```env
GITHUB_TOKEN=ghp_votre_token_github
```

---

## Utilisation

### Ajouter des repositories

1. Accedez au panneau admin : **http://localhost:3003/admin**
2. Connectez-vous avec le mot de passe : `admin123`
3. Collez une URL GitHub (`https://github.com/owner/repo`) ou le format court (`owner/repo`)
4. Cliquez sur **Ajouter**

### Explorer un repository

1. Cliquez sur une carte de repo depuis la page d'accueil
2. Naviguez dans les fichiers et dossiers
3. Les fichiers `.md`, `.html` et `.ipynb` s'ouvrent automatiquement en **mode Preview**
4. Utilisez le toggle **Preview/Code** pour voir le code source brut
5. Changez de branche via le selecteur

### Voir les commits

1. Depuis un repo, cliquez sur l'onglet **Commits**
2. Cliquez sur un commit pour voir le detail avec les diffs colores
3. Les statistiques d'ajouts/suppressions sont affichees par fichier

---

## API Routes

| Methode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/repos` | Liste tous les repos importes |
| `POST` | `/api/repos` | Ajoute un repo (auth requise) |
| `DELETE` | `/api/repos` | Supprime un repo (auth requise) |
| `POST` | `/api/auth` | Verification du mot de passe admin |
| `GET` | `/api/repos/:owner/:repo` | Info d'un repo GitHub |
| `GET` | `/api/repos/:owner/:repo/contents` | Contenu d'un dossier |
| `GET` | `/api/repos/:owner/:repo/file` | Contenu d'un fichier |
| `GET` | `/api/repos/:owner/:repo/commits` | Historique des commits |
| `GET` | `/api/repos/:owner/:repo/commits/:sha` | Detail d'un commit |
| `GET` | `/api/repos/:owner/:repo/branches` | Branches du repo |
| `GET` | `/api/repos/:owner/:repo/languages` | Langages du repo |

---

## Langages supportes (coloration syntaxique)

TypeScript, JavaScript, Python, Ruby, Go, Rust, Java, Kotlin, Swift, C, C++, C#, PHP, HTML, CSS, SCSS, Less, JSON, YAML, XML, Markdown, SQL, Bash/Shell, Dockerfile, Makefile, TOML, INI, R, Dart, Lua, Perl, Elixir, Erlang, Haskell, Clojure, Scala, HCL (Terraform), et plus via detection automatique.

---

## Auteurs

<table>
  <tr>
    <td align="center">
      <strong>Simon-Pierre Boucher</strong><br/>
      <a href="https://www.spboucher.ai">spboucher.ai</a><br/>
      <a href="mailto:spbou4@protonmail.com">spbou4@protonmail.com</a><br/>
      <a href="https://github.com/simonpierreboucher02">
        <img src="https://img.shields.io/badge/GitHub-simonpierreboucher02-181717?style=flat-square&logo=github" alt="GitHub" />
      </a>
    </td>
    <td align="center">
      <strong>Claude Opus 4.6</strong><br/>
      Co-auteur &middot; Anthropic AI<br/>
      <a href="https://claude.ai">claude.ai</a><br/>
      <a href="https://claude.com/claude-code">
        <img src="https://img.shields.io/badge/Claude_Code-Anthropic-7c3aed?style=flat-square" alt="Claude Code" />
      </a>
    </td>
  </tr>
</table>

---

## Contact

- **Site web** : [www.spboucher.ai](https://www.spboucher.ai)
- **Email** : [spbou4@protonmail.com](mailto:spbou4@protonmail.com)
- **GitHub** : [github.com/simonpierreboucher02](https://github.com/simonpierreboucher02)

---

<p align="center">
  <img src="https://img.shields.io/badge/Made_with-Next.js_16_%2B_TypeScript-000000?style=for-the-badge&logo=next.js" alt="Made with Next.js" />
  <img src="https://img.shields.io/badge/Co--authored_by-Claude_Opus_4.6-7c3aed?style=for-the-badge" alt="Co-authored by Claude" />
</p>

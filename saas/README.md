# SaaS Image Generator

SaaS Next.js pour générer des visuels produits à partir de pages Amazon / AliExpress via une extension Chrome.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** (PostgreSQL)
- **NextAuth.js** (authentification)

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Configurer la base de données :

Créez un fichier `.env` à partir de `.env.example` et configurez votre `DATABASE_URL` PostgreSQL.

3. Initialiser la base de données :

```bash
npx prisma generate
npx prisma db push
```

4. Générer une clé secrète pour NextAuth :

```bash
openssl rand -base64 32
```

Ajoutez-la dans `.env` comme `NEXTAUTH_SECRET`.

5. Lancer le serveur de développement :

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
saas/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth handler
│   │   │   └── signup/route.ts         # Inscription
│   │   └── jobs/route.ts               # API pour créer des jobs
│   ├── dashboard/page.tsx              # Liste des jobs
│   ├── job/[id]/page.tsx               # Détail d'un job
│   ├── login/page.tsx                  # Connexion
│   ├── signup/page.tsx                 # Inscription
│   ├── layout.tsx                      # Layout principal
│   ├── page.tsx                        # Landing page
│   └── globals.css                     # Styles globaux
├── components/
│   └── LogoutButton.tsx               # Bouton de déconnexion
├── lib/
│   ├── auth.ts                        # Configuration NextAuth
│   └── prisma.ts                      # Client Prisma
├── prisma/
│   └── schema.prisma                  # Schéma de base de données
└── types/
    └── next-auth.d.ts                 # Types TypeScript pour NextAuth
```

## Modèles de données

- **User** : Utilisateurs (email, passwordHash)
- **Job** : Jobs de génération (sourceImageUrl, style, ratio, status)
- **GeneratedImage** : Images générées (imageUrl, jobId)

## API Endpoints

### POST /api/jobs

Créer un nouveau job de génération.

**Headers :**
- Cookie avec session NextAuth

**Body :**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "style": "Fond blanc studio",
  "ratio": "1:1"
}
```

**Response :**
```json
{
  "jobId": "clx...",
  "message": "Job créé avec succès"
}
```

## Déploiement sur Vercel

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement :
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (votre domaine Vercel)
   - `NEXTAUTH_SECRET`
3. Vercel détectera automatiquement Next.js et déploiera

## Prochaines étapes

- Intégration de l'extension Chrome
- Remplacement des placeholders par une vraie génération d'images
- Webhooks pour les mises à jour de statut























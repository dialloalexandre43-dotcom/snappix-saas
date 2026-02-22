# Guide de configuration

## 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/saas_image_generator?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="votre-clé-secrète-ici"

# Fal.ai API (pour la génération d'images)
FAL_AI_API_KEY="votre-clé-api-fal-ai"
FAL_AI_MODEL_ID="fal-ai/flux"
```

### Générer NEXTAUTH_SECRET

Sur Windows (PowerShell) :
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

Sur Mac/Linux :
```bash
openssl rand -base64 32
```

## 2. Installation

```bash
cd saas
npm install
```

## 3. Configuration de la base de données

### Option 1 : PostgreSQL local

1. Installez PostgreSQL sur votre machine
2. Créez une base de données :
```sql
CREATE DATABASE saas_image_generator;
```
3. Mettez à jour `DATABASE_URL` dans `.env`

### Option 2 : PostgreSQL en ligne (recommandé pour Vercel)

Utilisez un service comme :
- [Supabase](https://supabase.com) (gratuit)
- [Neon](https://neon.tech) (gratuit)
- [Railway](https://railway.app) (gratuit avec limites)

Copiez l'URL de connexion dans `DATABASE_URL`.

## 4. Initialiser Prisma

```bash
npx prisma generate
npx prisma db push
```

## 5. Lancer le projet

```bash
npm run dev
```

Le site sera accessible sur http://localhost:3001

## 6. Configuration Fal.ai

### Obtenir votre clé API Fal.ai

1. Créez un compte sur [fal.ai](https://fal.ai)
2. Accédez à votre dashboard et récupérez votre clé API
3. Ajoutez-la dans votre fichier `.env` comme `FAL_AI_API_KEY`

### Modèle Fal.ai

Par défaut, le système utilise `fal-ai/flux`. Vous pouvez changer le modèle en modifiant `FAL_AI_MODEL_ID` dans votre `.env`.

Modèles populaires :
- `fal-ai/flux` - Modèle par défaut
- `fal-ai/flux-pro` - Version pro
- `fal-ai/flux-dev` - Version développement

**Note** : La structure de l'API Fal.ai peut varier selon le modèle. Si vous utilisez un modèle différent, vous devrez peut-être ajuster les paramètres dans `saas/lib/falai.ts`.

## 7. Tester l'API

Une fois connecté, vous pouvez tester l'endpoint `/api/jobs` avec :

```bash
curl -X POST http://localhost:3001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=VOTRE_TOKEN" \
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "style": "Fond blanc studio",
    "ratio": "1:1"
  }'
```

Pour obtenir le token, connectez-vous via l'interface web et récupérez le cookie depuis les DevTools.










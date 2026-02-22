# 🚀 Guide de lancement - SaaS Image Generator

## 📁 Structure recommandée : UN SEUL PROJET

**Recommandation** : Garder tout dans un seul projet monorepo. C'est plus simple à gérer, déployer et maintenir.

```
saas-image-generator/
├── web/                    # Application Next.js (SaaS)
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── extension/              # Extension Chrome
│   ├── manifest.json
│   ├── popup.html
│   └── ...
├── README.md
└── package.json           # Scripts pour gérer les deux
```

**Avantages** :
- ✅ Un seul repo Git
- ✅ Partage de code/types si nécessaire
- ✅ Déploiement simplifié
- ✅ Maintenance centralisée

---

## 🎯 Étapes de lancement

### Phase 1 : Préparation (Avant le déploiement)

#### 1.1 Nettoyer le projet
```bash
# Supprimer les fichiers de test (optionnel)
rm -rf saas/app/test-db
rm -rf saas/app/test-job
rm -rf saas/app/api/test-db
rm -rf saas/app/api/test-env
```

#### 1.2 Créer un repo Git
```bash
cd "C:\Users\aferr\Desktop\saas image"
git init
git add .
git commit -m "Initial commit - SaaS Image Generator"
```

#### 1.3 Créer un compte GitHub
1. Allez sur https://github.com
2. Créez un nouveau repository (ex: `saas-image-generator`)
3. Poussez votre code :
```bash
git remote add origin https://github.com/VOTRE_USERNAME/saas-image-generator.git
git branch -M main
git push -u origin main
```

---

### Phase 2 : Déploiement sur Vercel

#### 2.1 Créer un compte Vercel
1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub
3. Importez votre repository

#### 2.2 Configurer le projet
- **Framework Preset** : Next.js
- **Root Directory** : `saas` (important !)
- **Build Command** : `npm run build` (ou `cd saas && npm run build`)
- **Output Directory** : `.next`

#### 2.3 Variables d'environnement
Dans les paramètres du projet Vercel, ajoutez :

```
DATABASE_URL=postgresql://postgres.yvxfriiubqqrrussgpay:ezojbczvokoih@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=y9SfWopTR52o1UDUBgG/VKaFaRJwO4a2CNYcrDhchMk=
```

**Important** : Remplacez `NEXTAUTH_URL` par votre URL Vercel après le premier déploiement.

#### 2.4 Déployer
1. Cliquez sur "Deploy"
2. Attendez la fin du build
3. Notez votre URL (ex: `versailles-image-generator.vercel.app`)

---

### Phase 3 : Mettre à jour l'extension Chrome

#### 3.1 Modifier l'URL par défaut
Dans `extension/popup.html`, changez :
```html
<input 
  type="text" 
  id="api-url" 
  value="https://votre-domaine.vercel.app"  <!-- Votre URL Vercel -->
  placeholder="https://votre-domaine.vercel.app"
  required
>
```

#### 3.2 Mettre à jour le manifest
Dans `extension/manifest.json`, ajoutez votre domaine :
```json
"host_permissions": [
  "https://www.amazon.com/*",
  "https://www.amazon.fr/*",
  "https://www.amazon.co.uk/*",
  "https://www.aliexpress.com/*",
  "https://fr.aliexpress.com/*",
  "https://votre-domaine.vercel.app/*"  // Ajoutez votre domaine
]
```

#### 3.3 Tester l'extension
1. Rechargez l'extension dans Chrome
2. Testez sur une page produit Amazon/AliExpress
3. Vérifiez que l'API fonctionne avec votre domaine Vercel

---

### Phase 4 : Personnalisation (optionnel)

#### 4.1 Modifier les styles disponibles
Dans `saas/app/api/jobs/route.ts` et `extension/popup.html`, personnalisez les styles selon vos besoins.

#### 4.2 Personnaliser le branding
- Modifiez les couleurs dans `saas/app/globals.css`
- Changez le logo/nom dans toutes les pages
- Adaptez les textes selon votre cible

#### 4.3 Ajouter des fonctionnalités
- Galerie de styles
- Prévisualisation des styles
- Historique des créations
- Export en haute résolution

---

## 📋 Checklist de lancement

### Avant le lancement
- [ ] Code nettoyé (fichiers de test supprimés)
- [ ] Repository GitHub créé
- [ ] Code poussé sur GitHub
- [ ] Variables d'environnement préparées
- [ ] Base de données Supabase configurée

### Déploiement
- [ ] Compte Vercel créé
- [ ] Projet importé depuis GitHub
- [ ] Variables d'environnement configurées
- [ ] Build réussi sur Vercel
- [ ] Site accessible en ligne
- [ ] Authentification fonctionnelle

### Extension
- [ ] URL de production mise à jour dans le popup
- [ ] Manifest.json mis à jour
- [ ] Extension testée avec l'API de production
- [ ] Icônes créées (optionnel)

### Post-lancement
- [ ] Test complet du flux utilisateur
- [ ] Documentation utilisateur créée
- [ ] Page de support/contact ajoutée
- [ ] Analytics configuré (optionnel)

---

## 🎨 Personnalisation (optionnel)

### Suggestions de branding
- **Nom** : Personnalisez selon votre projet
- **Couleurs** : Adaptez la palette de couleurs
- **Styles** : Ajoutez vos propres styles de génération
- **Positionnement** : Adaptez selon votre cible

### Modifications à faire
1. **Landing page** : Adapter les textes selon votre cible
2. **Styles** : Personnaliser les options de style
3. **Design** : Adapter le thème visuel
4. **Fonctionnalités** : Ajouter les fonctionnalités spécifiques

---

## 🔧 Commandes utiles

### Développement local
```bash
# Lancer le serveur
cd saas
npm run dev

# Générer Prisma Client
npx prisma generate

# Pousser le schéma DB
npx prisma db push
```

### Déploiement
```bash
# Build de production
cd saas
npm run build

# Tester le build localement
npm start
```

### Git
```bash
# Commit et push
git add .
git commit -m "Description des changements"
git push origin main
```

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel
2. Vérifiez la console du navigateur
3. Vérifiez les logs Supabase
4. Testez les endpoints API individuellement

---

**Bon lancement ! 🚀**


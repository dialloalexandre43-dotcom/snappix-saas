# ⚡ Commandes rapides - SaaS Image Generator

## 📍 Important : Toujours être dans le bon dossier

Le `package.json` est dans le dossier `saas`, pas à la racine !

---

## 🚀 Commandes essentielles

### Se déplacer dans le bon dossier
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
```

### Installer les dépendances
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm install
```

### Lancer le serveur de développement
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```
Le serveur démarrera sur **http://localhost:3001**

### Générer Prisma Client
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npx prisma generate
```

### Mettre à jour la base de données
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npx prisma db push
```

### Build de production
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run build
```

---

## 🔧 Structure des dossiers

```
saas image/              ← Vous êtes ici (racine)
└── saas/                ← Le package.json est ICI
    ├── package.json     ← C'est ici !
    ├── app/
    ├── prisma/
    └── ...
```

---

## ⚠️ Erreur courante

**Erreur** : `Could not read package.json`

**Solution** : Assurez-vous d'être dans le dossier `saas` :
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
```

Puis réessayez votre commande npm.

---

## 💡 Astuce

Créez un alias PowerShell pour aller directement dans le bon dossier :

```powershell
function GoToSaaS {
    cd "C:\Users\aferr\Desktop\saas image\saas"
}

# Utilisation :
GoToSaaS
npm run dev
```






















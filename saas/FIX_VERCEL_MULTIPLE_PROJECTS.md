# 🔧 Corriger les projets Vercel multiples

## 🎯 Problème

Vous avez plusieurs projets Vercel qui se déploient en même temps :
- `snappix-saas`
- `snappix-saas-qcpx`
- `snappix-saas-76co`
- `saas`

**Résultat** : Chaque push déclenche 4 déploiements au lieu d'un seul ! ❌

---

## ✅ Solution : Nettoyer et consolider

### ÉTAPE 1 : Identifier le projet principal

1. Allez sur https://vercel.com/dashboard
2. Identifiez le projet que vous voulez **garder** (recommandé : `snappix-saas` ou `saas`)
3. Notez son nom exact

### ÉTAPE 2 : Supprimer les projets en double

Pour chaque projet en double :

1. Allez dans le projet Vercel
2. Cliquez sur **Settings** (⚙️)
3. Faites défiler jusqu'à **Danger Zone**
4. Cliquez sur **Delete Project**
5. Confirmez la suppression

**⚠️ Important** : Ne supprimez PAS le projet principal !

### ÉTAPE 3 : Vérifier la configuration du projet principal

Dans le projet que vous gardez :

1. Allez dans **Settings** > **Git**
2. Vérifiez que :
   - ✅ Le repository GitHub est correct
   - ✅ La branche est `main`
   - ✅ **Production Branch** est `main`

3. Allez dans **Settings** > **General**
4. Vérifiez que :
   - ✅ **Root Directory** est `saas`
   - ✅ **Framework Preset** est `Next.js`

### ÉTAPE 4 : Désactiver les déploiements automatiques en double

Si vous utilisez la CLI Vercel :

1. Vérifiez s'il y a un fichier `.vercel/project.json` dans votre repo
2. Si oui, supprimez-le :
   ```powershell
   cd "C:\Users\aferr\Desktop\saas image"
   Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue
   ```

### ÉTAPE 5 : Utiliser uniquement GitHub pour les déploiements

**Recommandation** : Utilisez uniquement les déploiements automatiques via GitHub, pas la CLI.

1. **Pour déployer** : Faites simplement `git push origin main`
2. **Vercel déploiera automatiquement** le projet principal

---

## 🚫 Ne plus utiliser `vercel --prod` en CLI

Si vous utilisez `npx vercel --prod`, cela peut créer de nouveaux projets.

**À la place** :
- ✅ Poussez sur GitHub : `git push origin main`
- ✅ Vercel déploiera automatiquement

---

## ✅ Vérification finale

Après nettoyage :

1. Faites un test :
   ```powershell
   git commit --allow-empty -m "Test deployment"
   git push origin main
   ```

2. Vérifiez sur Vercel Dashboard :
   - ✅ Un seul projet se déploie
   - ✅ Le déploiement est sur le projet principal

---

## 📋 Checklist

- [ ] Identifié le projet principal à garder
- [ ] Supprimé les projets en double (3 projets)
- [ ] Vérifié la configuration du projet principal
- [ ] Supprimé `.vercel/project.json` si présent
- [ ] Testé avec un push GitHub
- [ ] Confirmé qu'un seul projet se déploie

---

**Après ces étapes, vous n'aurez plus qu'un seul projet Vercel qui se déploie automatiquement ! 🎉**


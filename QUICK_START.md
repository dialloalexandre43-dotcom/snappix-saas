# 🚀 Guide de démarrage rapide

## 1. Lancer le SaaS (Serveur Next.js)

### Option A : Via le terminal
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

### Option B : Vérifier si déjà lancé
Ouvrez votre navigateur et allez sur : `http://localhost:3001`

Si la page se charge, le serveur est déjà en cours d'exécution ✅

---

## 2. Charger l'extension Chrome

### Étape 1 : Ouvrir la page des extensions
1. Ouvrez **Google Chrome**
2. Tapez dans la barre d'adresse : `chrome://extensions/`
3. Appuyez sur **Entrée**

### Étape 2 : Activer le mode développeur
1. En haut à droite, activez le **"Mode développeur"** (toggle)
2. Les options de développement apparaîtront

### Étape 3 : Charger l'extension
1. Cliquez sur **"Charger l'extension non empaquetée"** (ou "Load unpacked")
2. Naviguez vers : `C:\Users\aferr\Desktop\saas image\extension`
3. **Sélectionnez le dossier `extension`** (pas le dossier parent)
4. Cliquez sur **"Sélectionner le dossier"**

### Étape 4 : Vérifier
Vous devriez voir :
- ✅ L'extension "Snappix" dans la liste
- ✅ L'icône de l'extension dans la barre d'outils Chrome (en haut à droite)
- ✅ Le statut "Erreurs" devrait être à 0

---

## 3. Tester l'extension

### Étape 1 : Aller sur une page produit
1. Ouvrez un nouvel onglet Chrome
2. Allez sur une page produit **Amazon** ou **AliExpress**, par exemple :
   - Amazon : `https://www.amazon.fr/dp/B08XXXXXXX`
   - AliExpress : `https://fr.aliexpress.com/item/XXXXXXX.html`

### Étape 2 : Utiliser l'extension
1. Cliquez sur l'icône **Snappix** dans la barre d'outils Chrome
2. Le popup de l'extension s'ouvre
3. L'extension devrait automatiquement détecter l'image du produit
4. Vérifiez que l'URL de l'API est bien `http://localhost:3001`
5. Sélectionnez :
   - Un **style** (ex: "Studio Blanc", "Lifestyle Maison")
   - Un **format** (ex: "1024x1024", "1080x1080")
6. Cliquez sur **"Générer mes visuels"**

### Étape 3 : Vérifier les résultats
1. Vous serez redirigé vers la page du job créé
2. Les images seront générées en arrière-plan avec Fal.ai
3. Le statut du job passera de `PROCESSING` à `DONE` une fois les images générées

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```powershell
# Vérifier si le port 3001 est déjà utilisé
netstat -ano | findstr :3001

# Si un processus utilise le port, tuez-le :
# taskkill /PID <PID> /F
```

### L'extension ne s'affiche pas
- Vérifiez que vous avez bien sélectionné le dossier `extension` (pas le dossier parent)
- Vérifiez qu'il n'y a pas d'erreurs dans `chrome://extensions/`
- Cliquez sur "Recharger" (icône de rafraîchissement) sur la carte de l'extension

### Erreur "Impossible de se connecter à l'API"
- Vérifiez que le serveur Next.js est bien démarré sur le port 3001
- Vérifiez l'URL dans le popup de l'extension (doit être `http://localhost:3001`)
- Ouvrez la console Chrome (F12) pour voir les erreurs détaillées

### L'image n'est pas détectée
- L'extension fonctionne uniquement sur les pages produits Amazon/AliExpress
- Vérifiez que vous êtes bien sur une page produit (pas une page de recherche)
- Rechargez la page produit et réessayez

---

## 📝 Commandes utiles

### Lancer le serveur
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

### Vérifier que le serveur tourne
```powershell
# Ouvrir dans le navigateur
start http://localhost:3001
```

### Recharger l'extension après modifications
1. Allez sur `chrome://extensions/`
2. Cliquez sur l'icône de **rechargement** (🔄) sur la carte de l'extension Snappix

---

## ✅ Checklist de démarrage

- [ ] Serveur Next.js lancé sur `http://localhost:3001`
- [ ] Extension Chrome chargée dans `chrome://extensions/`
- [ ] Icône de l'extension visible dans la barre d'outils Chrome
- [ ] Testé sur une page produit Amazon/AliExpress
- [ ] L'extension détecte l'image du produit
- [ ] La génération d'images fonctionne

---

## 🎯 Prochaines étapes

Une fois que tout fonctionne :
1. Testez avec différents plans (FREE, STARTER, PRO)
2. Vérifiez que les restrictions de plan fonctionnent
3. Testez la génération d'images avec différents styles et formats

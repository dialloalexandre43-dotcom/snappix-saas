# 🚀 DÉMARRAGE RAPIDE

## ✅ ÉTAPE 1 : Lancer le serveur SaaS

Le serveur est en cours de démarrage. Attendez quelques secondes, puis :

1. **Ouvrez votre navigateur**
2. **Allez sur** : `http://localhost:3001`
3. Si la page se charge, le serveur est prêt ✅

**Si le serveur n'est pas lancé**, ouvrez un terminal et exécutez :
```powershell
cd "C:\Users\aferr\Desktop\saas image\saas"
npm run dev
```

---

## ✅ ÉTAPE 2 : Charger l'extension Chrome

### Instructions détaillées :

1. **Ouvrez Google Chrome**

2. **Tapez dans la barre d'adresse** : `chrome://extensions/`
   - Appuyez sur **Entrée**

3. **Activez le "Mode développeur"**
   - En haut à droite, activez le toggle "Mode développeur"
   - Les options de développement apparaîtront

4. **Cliquez sur "Charger l'extension non empaquetée"**
   - (ou "Load unpacked" en anglais)

5. **Sélectionnez le dossier extension**
   - Naviguez vers : `C:\Users\aferr\Desktop\saas image\extension`
   - **IMPORTANT** : Sélectionnez le dossier `extension` (pas le dossier parent)
   - Cliquez sur "Sélectionner le dossier"

6. **Vérifiez que l'extension est chargée**
   - Vous devriez voir "Snappix" dans la liste
   - L'icône de l'extension devrait apparaître dans la barre d'outils Chrome

---

## ✅ ÉTAPE 3 : Tester l'extension

1. **Allez sur une page produit Amazon ou AliExpress**
   - Exemple : `https://www.amazon.fr/dp/B08XXXXXXX`

2. **Cliquez sur l'icône Snappix** dans la barre d'outils Chrome

3. **Le popup s'ouvre** et devrait détecter automatiquement l'image du produit

4. **Vérifiez que l'URL de l'API est** : `http://localhost:3001`

5. **Sélectionnez un style et un format**, puis cliquez sur "Générer mes visuels"

---

## 🐛 PROBLÈMES COURANTS

### Le serveur ne démarre pas
- Vérifiez que le port 3001 n'est pas déjà utilisé
- Relancez : `npm run dev` dans le dossier `saas`

### L'extension ne s'affiche pas
- Vérifiez que vous avez sélectionné le bon dossier (`extension`)
- Vérifiez qu'il n'y a pas d'erreurs dans `chrome://extensions/`
- Cliquez sur "Recharger" (icône 🔄) sur la carte de l'extension

### Erreur de connexion à l'API
- Vérifiez que le serveur tourne sur `http://localhost:3001`
- Vérifiez l'URL dans le popup de l'extension
- Ouvrez la console Chrome (F12) pour voir les erreurs

---

## 📝 RÉSUMÉ

1. ✅ Serveur lancé → `http://localhost:3001`
2. ✅ Extension chargée → `chrome://extensions/`
3. ✅ Test sur page produit → Amazon/AliExpress

**Tout est prêt !** 🎉







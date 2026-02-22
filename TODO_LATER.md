# 📋 Actions à faire plus tard

## 🎯 Actions prioritaires (après les designs V0)

### 1. Acheter un nom de domaine
- **Action** : Acheter un nom de domaine pour le projet
- **Quand** : Après avoir finalisé les designs V0
- **Où** : Namecheap, Google Domains, ou autre registrar
- **Pourquoi** : Nécessaire pour :
  - Configuration Apple OAuth (nécessite un domaine)
  - Déploiement en production
  - URL professionnelle
  - Configuration des redirect URIs OAuth

### 2. Configurer Apple OAuth
- **Action** : Finaliser la configuration Apple Sign In
- **Quand** : Après avoir acheté le domaine
- **Dépendances** : 
  - Nom de domaine requis
  - Compte développeur Apple (99$/an)
- **Guide** : Voir `APPLE_OAUTH_SETUP.md`

### 3. Déploiement sur Vercel
- **Action** : Déployer l'application sur Vercel
- **Quand** : Après avoir acheté le domaine et configuré les OAuth
- **Dépendances** :
  - Nom de domaine
  - Variables d'environnement configurées
- **Guide** : Voir `LAUNCH_GUIDE.md`

---

## 📝 Notes importantes

- **Nom de domaine** : À acheter avant de configurer Apple OAuth
- **Apple OAuth** : Nécessite un domaine valide pour les redirect URIs
- **Google OAuth** : Peut fonctionner avec localhost pour les tests, mais nécessite le domaine pour la production

---

## ✅ Actions déjà faites

- ✅ Code Apple OAuth intégré
- ✅ Boutons Apple ajoutés
- ✅ Configuration NextAuth prête
- ✅ Guides de configuration créés

---

**Dernière mise à jour** : En attente de l'achat du nom de domaine





















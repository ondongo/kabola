# Kabola

Plateforme de **partage d’abonnements numériques** pour le marché africain (focus **Sénégal**) : rejoindre un groupe pour payer moins cher, ou proposer des places inutilisées et être rémunéré. Paiements locaux via **PayDunya** (Wave, Orange Money, Free Money…), **escrow logique** jusqu’à validation de l’accès, et **système de confiance** (score, vérification de factures).

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript** strict
- **Firebase** : Auth (Google uniquement), Firestore, Storage
- **Firebase Admin** (serveur) pour les mutations sécurisées et la session cookie
- **Zod** + **React Hook Form** (formulaires sensibles)
- **Tailwind CSS v4**
- **PayDunya** (HTTP/JSON) : [documentation](https://developers.paydunya.com/doc/FR/http_json)

## Prérequis

- Node.js 20+
- Compte Firebase (projet avec Auth, Firestore, Storage)
- Compte PayDunya Business (clés test puis production)

## Configuration

1. Copier `.env.example` vers `.env.local` et renseigner les variables.
2. Activer **Google** comme fournisseur d’authentification dans la console Firebase.
3. Déployer les règles : `firebase/firestore.rules` et `firebase/storage.rules` (via Firebase CLI ou console).

### Variables essentielles

| Variable | Rôle |
|----------|------|
| `NEXT_PUBLIC_FIREBASE_*` | SDK client (clé, domaine, projectId, bucket, appId) |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Admin SDK (service account JSON → email + clé privée avec `\n` échappés) |
| `NEXT_PUBLIC_APP_URL` | Base URL pour `return_url`, `cancel_url`, `callback_url` PayDunya |
| `PAYDUNYA_*` | Clés Master / Private / Token + URLs de callback |

En **local**, sans clés Firebase valides, le build utilise des **placeholders** côté client ; l’Admin SDK doit être valide pour les pages qui lisent Firestore côté serveur (ou utilisez `force-dynamic` + env réelles sur l’environnement de preview).

## Scripts

```bash
npm install
npm run dev
npm run build
npm start
npm run lint
```

## Architecture métier

### Authentification

- **Uniquement Google** (popup Firebase + cookie de session serveur via `/api/auth/session`).
- À la première connexion, création / mise à jour du document `users/{uid}` (server).

### Abonnements partagés

- Collection `subscriptions` : titre, service, prix par place, places, visibilité `public` | `private`, statut, etc.
- Collection `participations` : demandes / acceptation pour les groupes privés ; adhésion directe pour les publics (selon logique métier actuelle).

### Paiements (PayDunya)

1. Création d’une facture **checkout-invoice** avec `custom_data` (`paymentId`, `subscriptionId`).
2. Redirection vers la page PayDunya.
3. **IPN** (`/api/webhooks/paydunya`) : lecture du token, **confirmation serveur** via l’API `checkout-invoice/confirm/{token}` (source de vérité), mise à jour du document `payments`, notification et événement de confiance.

Les écritures sensibles (`payments`, etc.) passent par **Admin SDK** ; les règles Firestore interdisent l’écriture directe depuis le client.

### Vérification des factures

- Upload vers Storage (`invoices/{uid}/...`), traitement serveur (`finalizeInvoiceAfterUpload`) : extraction texte PDF (`pdf-parse`), règles métier (montants, cohérence), score et statut (`pending_review`, `auto_verified`, `flagged`, etc.).

### Modèle économique (réaliste, local)

- **Commission** : `PLATFORM_FEE_PERCENT` (ex. 10 %) + `PLATFORM_FIXED_FEE_XOF` (0 par défaut pour rester accessible).
- **Équilibre** : tarifs bas pour l’adoption, commission modérée pour couvrir frais PayDunya, support et modération ; marge pour futures options premium (mise en avant, assurance).

## Structure utile

- `src/app/` — routes App Router, API `session` et webhook PayDunya
- `src/services/` — actions serveur (Firestore Admin)
- `src/lib/firebase/` — client + Admin
- `src/schemas/`, `src/types/` — Zod et types métier
- `firebase/*.rules` — sécurité Firestore / Storage

## Licence

Projet privé — voir les conditions du dépôt.

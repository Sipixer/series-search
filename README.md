# Configuration

## Clonage du projet

Pour commencer, clônez le projet depuis GitHub :

```bash
git clone https://github.com/Sipixer/series-search.git
```

## Démarrage d'Elasticsearch

Assurez-vous d'avoir Docker installé, puis exécutez la commande suivante pour démarrer Elasticsearch en tant que conteneur :

```bash
docker compose up -d
```

## Démarrage de l'API

Accédez au répertoire `search-api` et installez les dépendances nécessaires :

```bash
cd search-api
npm install
```

Ensuite, lancez le serveur API en mode développement :

```bash
npm run dev
```

## Démarrage de l'interface utilisateur

Allez dans le répertoire `search-front` et installez les dépendances :

```bash
cd search-front
npm install
```

Enfin, démarrez l'application frontale en mode développement :

```bash
npm run dev
```

Assurez-vous de suivre ces étapes dans l'ordre spécifié pour garantir un déploiement et un fonctionnement corrects de l'application.

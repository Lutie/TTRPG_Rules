# Déploiement sur le NAS (Thalifen)

## Connexion SSH

```bash
ssh Lutie@192.168.1.21
```

## Mise à jour et redéploiement

```bash
cd /volume1/TTRPG_Rules/terre-natale
git pull
docker compose up -d --build
```

Pour ne rebuilder qu'une seule app :

```bash
docker compose up -d --build app-dash
docker compose up -d --build app-sheet
```

## Accès local

| App | URL |
|---|---|
| Dashboard | http://192.168.1.21:3100 |
| Fiche perso | http://192.168.1.21:8080 |

## Accès externe

| App | URL |
|---|---|
| Dashboard | https://dash.thalifen.synology.me |
| Fiche perso | https://sheet.thalifen.synology.me |

## Données persistantes

Les données du dashboard (personnages, campagnes, confrontations, PNJ) sont dans :

```
/volume1/TTRPG_Rules/terre-natale/app-dash/data/
```

## Commandes utiles

```bash
# Voir les logs d'un conteneur
docker compose logs -f app-dash
docker compose logs -f app-sheet

# Statut des conteneurs
docker compose ps

# Arrêter tout
docker compose down
```

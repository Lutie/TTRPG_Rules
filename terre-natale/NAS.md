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

```
Lutie@Thalifen-NAS:/volume1/TTRPG_Rules/terre-natale$ sudo docker exec terre-natale-app-sheet-1 ls -la /usr/share/nginx/html/assets/ | head -5
total 1820
drwxr-xr-x    1 root     root            70 Aug 28 13:30 .
drwxr-xr-x    1 root     root            76 Aug 28 13:30 ..
-rwxr-xr-x    1 root     root       1737242 Aug 28 13:30 index-CAY_0sMj.js
-rwxr-xr-x    1 root     root        119832 Aug 28 13:30 index-DNrSaE2L.css
```

cd /volume1/TTRPG_Rules/terre-natale && sudo docker compose pull && sudo docker compose up -d --build
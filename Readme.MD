#Projet M1IF13

(https://forge.univ-lyon1.fr/LIONEL.MEDINI/m1if13-2020/tree/master)


<a href="http://192.168.75.6/swagger-ui.html">Swagger</a>

<a href="http://192.168.75.6/v3/api-docs">OpenApi</a>

<a href="http://192.168.75.6/client">Client</a>

<a href="https://192.168.75.6/admin">Admin</a>

<a href="https://192.168.75.6">Vuejs</a>

# Règles du jeu

J'ai décidé d'implémenter deux variantes du jeu proposé de base dans le projet :

### Jeu multijoueur

- Le jeu se déroule en une ou plusieurs manches.
- Durant chaque manche, il y a une ou plusieurs cibles qui sont placées sur la carte.
- Chaque manche a une durée déterminée.
- Pour gagner une manche, il faut être le joueur qui à capturer le plus de cible durant le temps imparti **ou** être le premier joueur à capturer toutes les cibles.
- Pour capturer une cible il faut être à moins de 3 mètres de sa position.
- Le joueur ayant remporté le plus de manche gagne la partie.
- Quand une cible est capturée, elle reste sur la carte et peut être capturé par les autres joueurs.
- Des joueurs peuvent rejoindre ou quitter la partie entre les manches.

### Jeu un joueur
Le principe du jeu à un joueur reste relativement le même que la version multijoueur sauf que :
- Si le joueur ne capture pas toute les cible d'une manche, la partie est finie et il a perdu.
- Plus personne ne peux rejoindre la partie une fois qu'elle est lancée dans ce mode.

Lorsque la partie est créer, l'administrateur défini un nombre de joueurs minimum et un temps d'attente avant de lancer la partie.
Une fois qu'assez de joueur auront rejoins le lobby de la partie, elle se lancera automatiquement au bout du temps défini. C'est le même procédé entre chaque manche.

### Trophés
Il existe 5 trophées qui peuvent être débloqué en accomplissant une tâche définie. Lorsqu'un trophée est débloqué, le joueur est averti grâce à une notification et il peut retrouver la liste des trophées débloqués dans la page dédiée. L'implémentation des trophées est assez souple et complete pour pouvoir ajouter plein de nouveaux trophées variés.
 
 Pour résumer l'aspect technique, les trophées sont des objets qui possède un objet "Unlocker" qui va déterminer si oui ou non le trophée est débloqué (selon un contexte fournis). Chaque trophée est "abonné" à des event (fin de partie, cible capturée, etc) qui seront émis durant la partie
### Notifications
Il existe deux types de notifications :
- Applicative : dans la barre du menu il y a une icone "cloche" qui indique le nombre de notifications non lu. Lorsqu'on clique sur cette cloche la liste des notifications apparait et on peut marquer une notification comme "lû"
- Push Si le joueur l'accepte, il peut recevoir des notifications "windows" ou sur son téléphone.

Des notifications sont émises quand :
- Un trophée est débloqué
- Le joueur rejoint un lobby
- Le joueur quitte un lobby
- La manche commence
- La partie commence
- La manche est finie
- La partie est finie

Chaque joueur possède un "pool" de notification qui est vidé à chaque appel effectué sur la route prévue a cette effet
### Personnalisation

#### Avatar
Le joueur peux changer l'avatar qui seras utilisé durant les parties.
#### Temps de refresh
Le joueur peux modifier le temps de refresh entre deux :
- Rafraichissement des notifications
- Rafraichissement du lobby
- Rafraichissement du jeu
#### Theme sombre
Il existe un thème "Dark" et "Light"

#### Autres

- Un joueur ne peut rejoindre qu'une partie à la fois
- La liste des joueurs de la partie peux être consultée
- Les résultats d'une partie sous forme de classement sont accessible une fois la partie terminée. Si c'est une partie "solo" et que le joueur a perdu, aucun joueur n'est affiché dans le classement.
- Le serveur détermine automatiquement quel mode de jeu lancer, en fonction du nombre de joueurs présent ( 1 joueur : mode de jeu solo, au moins 2 joueurs : multi)
- Si un joueur subis trop d'erreur de rafraichissement durant la partie (10 consécutives), il est expulsé du lobby
- Si trop de joueur quitte le lobby pendant que la partie se lance, le compte à rebours est stoppé et la partie ne se lance pas.

### Gestion du cache

Le service worker va dans un premier temps mettre en cache l'app shell de l'application lors de son installation.

#### Pour la gestion du cache des tiles de leaflet 

Dans un premier temps j'ai essayé avec IndexDb mais j'avais eu le problème des Blob obscures qui m'empêchaient de stocker les réponses sous forme de Blob dans une table IndexDb. Je vous avais envoyé un mail et j'ai laissé mon ancien code du worker dans worker/old.js
Du coup dans la version actuelle, je stock les réponses dans un **objet js**.
Mon objet se présente ainsi : 
````js

cache = { id : response}

````

Comme id (clé) j'ai choisis de prendre **latitude + longitude + zoom** de la requête leaflet.

Lorsqu'un élément est ajouté au cache, **un timeout est lancé**.
 
 **A la fin du timeout, l'élément est automatiquement supprimé du cache.**
  
  Cela permet de supprimer les éléments inutilisés au bout d'un certain temps et de ne pas trop utiliser de mémoire lorsqu'un nombre important de tiles sont chargées.
  
  
Une mécanique importante du cache est que **lorsqu'un élément est récupéré depuis le cache, son timeout est réinitialisé**.
 
 Du coup, les éléments qui sont très régulièrement utilisé ne sont pas supprimé du cache et on s'assure que la majeure partie des éléments stocké sont ceux qui ont été utilisé récemment.

Pour éviter que le cache ne soit surchargé malgré tout, il existe deux seuils :

- La limite du cache
- La limite critique

Lorsque la limite du cache est atteinte (120 éléments stockés), le temps du timeout (initialement de 30 secondes) est divisé par 2.

Lorsque la limite critique est atteinte (170 éléments), le temps du timeout des nouveaux éléments est divisé par 4.

Cette politique permet de baisser drastiquement (et rapidement) le nombre d'éléments si le cache est surchargé.



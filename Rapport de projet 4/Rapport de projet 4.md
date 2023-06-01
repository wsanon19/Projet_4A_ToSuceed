<center>![Polytech Nancy | Concours Geipi Polytech ESSTIN - Polytech Nancy](Aspose.Words.6e2beb92-aaab-4c01-824e-39ed75478604.001.jpeg)	

**Rapport de projet 4A**

Création d’un service web

*ToSucceed*


![Qu&#39;est-ce qu&#39;une application Web ? Aperçu des formats - IONOS](Aspose.Words.6e2beb92-aaab-4c01-824e-39ed75478604.003.jpeg)




CIPRIANI Mael, IFRI Youssef, SANON Wilfried
</center>


<center>
**Introduction :**
</center>
Ce projet est une application pratique et concrète des concepts vus en cours de systèmes distribués. L’objectif étant de créer un service web interactif en utilisant le modèle MVC (Modèle, Vue, Contrôleur) en s’appuyant les différents outils étudiés en classe. Tout d’abord, l’application web est composée de deux partie. D’une part, la partie Back-end (Serveur) qui comporte toutes les fonctions essentielles nécessaires au bon fonctionnement de cette application. Le langage de programmation utilisé est Java notamment le framework Spring Boot. D’autre part, en ce qui concerne la partie Front-end (Client), une interface interactive a été développée afin que le client puisse utiliser ce service. Le framework qui a été ici utilisée est Angular. 

<center>
**Contexte et objectifs :**
</center>

`	`Les deux dernières années marquées par la pandémie mondiale de la Covid-19. Dans ce contexte historique, les écoles primaires et collèges ont dû fermer leurs portes au profit de confinements. En conséquence, les élèves étaient chargés de suivre leurs cours à distance. Face à une telle situation inédite, de nombreux établissements ont peiné à s’organiser afin d’assurer un suivi qualitatif de leurs élèves. Ainsi, pléthore d’enfants se sont vu accumuler des lacunes durant cette période. C’est pourquoi, face à ce constat amer, nous avons décidé de fournir une aide à ses enfants en difficulté. En effet, nous proposons une plateforme de cours en ligne allant du CP à la 3ème. En partenariat avec des professeurs titulaires, les élèves bénéficieront de cours qualitatifs ainsi que d’un accompagnement régulier afin de les soutenir autant que faire se peut durant cette période trouble.  Également, nous avons pensé à tous ces enfants souffrant de troubles psychologiques les empêchant de suivre une scolarité traditionnelle. C’est ainsi, avec notre solution, nous estimons pourvoir offrir une alternative à ces élèves. 










<center>
**Schéma relationnel de la base de données utilisée :**
</center>

Voici le diagramme de classes UML sur lequel l’application web s’est appuyée :
<center>
![DESCRIPTION DE L'IMAGE](https://github.com/macidevfr/Projet_4A/blob/Wilfried/img/im1.png?raw=true)
</center>


Ci-dessus, se trouvent différentes classes. Tout d’abord, la classe « User » désigne les personnes qui vont visiter l’application web. Chaque personne a un identifiant unique qui le différencie des autres. Également, il a un statut propre qui lui donne des permissions différentes en fonction de celui-ci : élève, professeur, administrateur. Par exemple, l’élève n’a pas la permission de poster un cours. Ensuite, une classe « cours », « abonnement », « commentaire », « message » et « messageDuJour », qui correspondent aux fonctionnalités que nous voulions faire apparaitre sur notre service. 


<center>***Architecture Back-End :***</center>

**Détails techniques de l’application back-end** 

*Type :* ***API REST*** 

*Architecture : **MVC***

*Language de programmation :  **JAVA 1.8***

*Outils utilisés :* ***framework spring (Spring data JPA, Spring Sécurité), framework JWT fournie par auth0, JPA avec l’implémentation hibernate.***

*Base de données connectée : **MySQL**.*

*Serveur d’hébergement : **Amazon Web Service***

*Lien dépôt Git : **https://github.com/macidevfr/Projet\_4A***

<center>**Résumé des fonctionnalités globales de l’application** </center>

*L’application ToSuceed a été conçue afin d’apporter une solution innovante dans le domaine de la formation de la petite enfance et des lycéens. Ainsi l’application offre les services suivants* 

- *Inscription/ Connexion*
- *Souscription à un abonnement* 
- *Ajout de Cours sur la plateforme*
- *Consultation de cours*
- *Notation des cours et Ajout de Commentaires*
- *Messagerie privée entre les utilisateurs*
- *Gestion de son profil*
- *Visualiser un message de jour sur la page d’Accueil de la plateforme*
- *Gestion des rôles (Administrateur)*

<center>**Structure détaillée de l’API ToSuceed :** 



![DESCRIPTION DE L'IMAGE](https://github.com/macidevfr/Projet_4A/blob/Wilfried/img/Capture1.png?raw=true)
</center>

Comme présenté sur la figure 1, chaque objet dispose d’un répertoire regroupant l’ensemble des données nécessaire à la manipulation de celui-ci. Les données contenues dans chacun de ces répertoires sont : 

- L’interface DAO : il s’agit de la couche d’accès à la base de données, mise en place à l’aide du jpaRepository. Cette interface facilite les interactions avec la base de données en évitant d’écrire les requêtes SQL. Elle garantit également l’interopérabilité en ce sens que l’application sera à mesure de communiquer avec des bases de données de plusieurs types différents sans avoir à changer le code source. 

- La couche Service : constituant une couche d’abstraction supplémentaire et contient la définition de toutes les fonctions du contrôleur. Ces fonctions font recours celle de l’interface DAO.

- La couche contrôleur : qui fait une injection de l’objet service à partir duquel, il a accès à l’ensemble des fonction prédéfinies.

- La couche Modèle : qui représente l’étiquette de l’objet. En effet elle contient les attributs de l’objet et ainsi que la définition des associations avec les autres objets grâce à Hibernate. 

Ainsi cette structure pourrait être résumée de la manière suivante : 

<center>

![](Aspose.Words.6e2beb92-aaab-4c01-824e-39ed75478604.008.png)![](Aspose.Words.6e2beb92-aaab-4c01-824e-39ed75478604.009.png)



![DESCRIPTION DE L'IMAGE](https://github.com/macidevfr/Projet_4A/blob/Wilfried/img/Capture%203.png?raw=true)





**Architecture Front-End :**
</center>
*Type :* ***Application Angular.***

*Language de programmation :  **TypeScript 9.0***

*Technologie Supplémentaire : **HTML 5, CSS 3***

*Framework : **Bootstrap***

*Serveur d’hébergement : **Amazon Web Service***

*Lien dépôt Git : **https://github.com/macidevfr/Projet\_4A***

<center>**Structure globale de l’application** </center>

Cette Application constitue la partie Front-end de l’application. Le framework Angular q permis de réaliser application web avec moins de pages en intégrant en partie le principe des SPA (Single Page Application) ou application web monopage.

L’arborescence de l’application : 
<center>
![DESCRIPTION DE L'IMAGE](https://github.com/macidevfr/Projet_4A/blob/Wilfried/img/Capture%204.png?raw=true)
</center>
On constate alors :

<center>
![DESCRIPTION DE L'IMAGE](https://github.com/macidevfr/Projet_4A/blob/Wilfried/img/Capture%205.png?raw=true)
</center>






- Le fichier **cours.components.ts** : contient les différents attributs de l’objet Cours ainsi que les fonctions permettant la manipulation de l’objet.
- Le fichier ***cours.component.html*** : représente la page d’affichage des cours 
- Le fichier ***cours.component.css*** : contient le style dédié à la page Cours et non partagée par les autres pages.
- Le fichier ***cours.component.spec.css*** : représente un fichier test.

- Le module de routage ***app.routing.module.ts*** : permettant d’assurer la navigation entre les différentes pages du site 

- Les gaurds : Les guards permettent de définir selon l’utilisateur, les autorisations d’accès à tel ou tel page du site. 

- L’intercepteur : qui récupère chaque requête du site et effectue un prétraitement

**Sécurité :**

La partie Sécurité de l’application est entièrement gérée grâce à Spring Sécurité (module du framework Spring et inséré dans l’application par importation de la librairie) et JWT fournie par auth0(également inséré par importation). Pour le projet ToSuceed, Spring sécurité et JWT ont été personnalisés afin d’assurer deux tâches principales :

- Se connecter de manière sécuriser sur l’application
- S’Assurer que les bons utilisateurs disposent du niveau d’accès approprié en fonction de son statut (Super\_Admin, prof, étudiant)

Ainsi Spring sécurité permet particulièrement de protéger les requêtes http effectuer sur le site en imposant trois niveaux de protection à chaque requête émise sur le site. Le premier niveau représente un pare-feu http, le second un Proxy et le dernier niveau est constitué par plusieurs filtres. 

JWT a permis de configurer le système de connexion à l’application. En effet lorsque l’utilisateur entre les bons identifiants de connexion, l’API crée un token et l’envoie au Front. Ce Token est alors stocké en local et permet à l’utilisateur d’avoir accès au site. Lors de la déconnexion, ce token est supprimé et toute tentative de navigation vers une page du site est redirigé vers la page de connexion. 

Ce token contient en plus, les informations sur le rôle de l’utilisateur. Ainsi l’application Angular (Front end) se servira de ces informations pour afficher le contenu autorisé en fonction du statut. Mais aussi, l’application Front pourra empêcher l’utilisateur d’aller vers une page à laquelle il n’a pas accès (cela est réalisé par le guard de l’application Front.)

**Déploiement :**

**	Nous avons déployé notre service à l’adresse suivante : <http://tosucceed.site/#/accueil> en deux étapes. D’une part, nous avons utilisé l’hébergeur « Amazon Web Services » a qui on a envoyé l’ensemble de notre projet : back-end en .jar et front-end en /dist. Suite à cela, nous avons reçu une clé privée qui nous permet de nous connecter à notre instance hébergée sur leurs serveurs. Également, nous avons obtenu une IP élastique avec laquelle nous pouvions entrer sur le site web : <http://13.37.112.147/>. D’autre part, nous avons eu recours à un GoDaddy.com qui a attribué à cette même IP un nom de domaine. Ainsi, nous avons pu accéder à notre service web d’une manière plus ergonomique et « user-friendly ». 




**Conclusion :**

**	Ainsi, ce projet nous a permis d’appliquer les connaissances vues en cours sur une application web concrète. En effet, nous avons mis en place l’architecture back-end à l’aide de nos compétences étudiées en cours. De plus, nous sommes montés en compétence durant ce projet. Nous avons pu appréhender le Framework « Angular » en ce qui concerne le front-end. Également, nous avons pu nous servir de Git qui est un outil collaboratif. Enfin, nous avons pu découvrir un aperçu de quelques notions en sécurité et en déploiement. 

`	`Voici quelques axes d’améliorations qui pourraient compléter ce service web :

`		`- Ajout d’un Dashboard général pour les administrateurs (statistiques…)

`		`- Ajout de la page de paiement 

`		`- Ajout d’un système de gestion de fichiers 

`	`*Nous remercions Polytech Nancy de nous avoir donné l’opportunité de réaliser un tel projet et M. Youcef pour sa pédagogie et son accompagnement durant cette expérience.*  

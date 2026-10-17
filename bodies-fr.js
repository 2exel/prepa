window.BODIES = window.BODIES || {};
window.BODIES.fr = {
m1l1:`<p>Chaque question réseau se rattache à une couche. Identifiez la couche, vous tenez la réponse.</p>
<p><b>Modèle OSI — 7 couches :</b></p>
<ul>
<li><b>1. physique</b> — câble, signal, fibre. (bit)</li>
<li><b>2. liaison de données</b> — MAC, Ethernet, commutateur. (trame)</li>
<li><b>3. réseau</b> — IP, routage, routeur. (paquet)</li>
<li><b>4. transport</b> — TCP, UDP, ports. (segment)</li>
<li><b>5. session</b> — gestion des sessions.</li>
<li><b>6. présentation</b> — encodage, chiffrement, compression (TLS s'en approche).</li>
<li><b>7. application</b> — HTTP, DNS, DHCP, SMTP, FTP.</li>
</ul>
<p><b>Modèle TCP/IP — 4 couches :</b> accès réseau (1+2) · Internet (3) · transport (4) · application (5+6+7).</p>
<p><b>Encapsulation :</b> chaque couche ajoute son en-tête : segment → paquet → trame → bits. À la réception, la décapsulation fait l'inverse.</p>
<p><b>À retenir :</b></p>
<ul><li>commutateur = couche 2 ; routeur = couche 3.</li><li>MAC = couche 2, IP = couche 3, port = couche 4.</li><li>TCP fiable et connecté, UDP rapide sans garantie.</li><li>DNS, DHCP et HTTP = couche 7.</li></ul>`,
m1l2:`<p>Tout le calcul d'adressage repose sur les puissances de 2. Ce tableau suffit pour la majorité des exercices :</p>
<p><code>128 64 32 16 8 4 2 1</code> — les valeurs des huit bits d'un octet.</p>
<p><b>Binaire → décimal :</b> 11000000 = 128+64 = 192 ; 10101000 = 128+32+8 = 168.</p>
<p><b>Décimal → binaire :</b> 200 = 128+64+8 = 11001000 ; 26 = 16+8+2 = 00011010.</p>
<p><b>Masques :</b> le masque sépare les bits de réseau des bits d'hôte.</p>
<ul>
<li>/24 = 255.255.255.0 → 256 adresses, 254 hôtes.</li>
<li>/25 = 255.255.255.128 → 128 adresses, 126 hôtes.</li>
<li>/26 = 255.255.255.192 → 64 adresses, 62 hôtes.</li>
<li>/27 = 255.255.255.224 → 32 adresses, 30 hôtes.</li>
<li>/28 = 255.255.255.240 → 16 adresses, 14 hôtes.</li>
<li>/29 = 255.255.255.248 → 8 adresses, 6 hôtes.</li>
<li>/30 = 255.255.255.252 → 4 adresses, 2 hôtes (liaison entre deux routeurs).</li>
</ul>
<p><b>Règle :</b> nombre d'adresses = 2^(32 − masque) ; hôtes = ce nombre − 2 (réseau et diffusion).</p>
<p><b>À retenir :</b> 2^7=128 · 2^6=64 · 2^5=32 · 2^4=16 · 2^3=8 · 2^2=4 · 2^1=2.</p>`,
m1l3:`<p>La compétence la plus rentable à l'examen. Méthode : calculer la taille de bloc, puis avancer depuis zéro.</p>
<p><b>Taille de bloc = 256 − valeur du masque dans le dernier octet.</b> Exemple : /26 → masque 192 → 256 − 192 = <b>64</b>.</p>
<p><b>Étapes :</b></p>
<ol><li>Déterminer le masque et la taille de bloc.</li><li>Écrire les débuts de réseaux : 0, 64, 128, 192 (taille 64).</li><li>Repérer le plus grand début inférieur ou égal à l'adresse.</li><li>Réseau = ce début ; diffusion = début + taille − 1.</li><li>Hôtes utilisables = entre les deux.</li></ol>
<p><b>Exemple corrigé :</b> 192.168.10.130/26</p>
<ul><li>Taille 64 → réseaux : .0, .64, .128, .192.</li><li>130 se situe entre 128 et 191.</li><li><b>Réseau : 192.168.10.128</b> · <b>diffusion : 192.168.10.191</b> · hôtes : .129 → .190 (62 hôtes).</li></ul>
<p><b>Deuxième exemple :</b> 172.16.8.200/27 → blocs de 32 → 200 tombe dans .192 → réseau 172.16.8.192, diffusion 172.16.8.223.</p>
<p><b>Masque inférieur à /24 :</b> le changement porte sur le troisième octet. /23 → blocs de 2 : 10.0, 10.2, 10.4…</p>
<p><b>À mémoriser :</b> /25→128 · /26→64 · /27→32 · /28→16 · /29→8 · /30→4.</p>`,
m1l4:`<p>Le routeur décide à partir de sa table de routage, pas de la seule adresse de destination.</p>
<p><b>Une entrée contient :</b> réseau de destination et masque · prochain saut (next hop) ou interface · métrique.</p>
<p><b>Règle du plus long préfixe :</b> si plusieurs routes correspondent, la plus précise (masque le plus grand) gagne. Exemple : /24 et /28 pour le même réseau → /28 est choisie.</p>
<p><b>Route par défaut :</b> 0.0.0.0/0, utilisée quand aucune route plus précise n'existe. C'est la sortie vers Internet.</p>
<p><b>Statique ou dynamique :</b> statique écrite à la main ; dynamique apprise par protocoles (OSPF en interne, BGP entre opérateurs).</p>
<p><b>À l'examen :</b> on donne une table et une adresse → appliquer le plus long préfixe, puis vérifier que le prochain saut est joignable.</p>
<p><b>À retenir :</b> 0.0.0.0/0 = défaut · 127.0.0.0/8 = boucle locale · 169.254.0.0/16 = link-local · 224.0.0.0/4 = multicast.</p>`,
m1l5:`<p><b>DHCP — comment une machine obtient son adresse ?</b> Quatre messages, à retenir par l'acronyme DORA :</p>
<ul><li><b>Discover</b> — la machine cherche un serveur (diffusion).</li><li><b>Offer</b> — le serveur propose une adresse.</li><li><b>Request</b> — la machine demande cette adresse.</li><li><b>Ack</b> — le serveur confirme, avec masque, passerelle, DNS et durée du bail (lease).</li></ul>
<p><b>DNS — traduire les noms en adresses.</b> Les enregistrements demandés :</p>
<ul><li><b>A</b> — nom vers IPv4 · <b>AAAA</b> — nom vers IPv6.</li><li><b>CNAME</b> — alias vers un autre nom.</li><li><b>MX</b> — serveur de messagerie · <b>TXT</b> — textes (SPF, vérification).</li><li><b>NS</b> — serveurs de noms du domaine · <b>PTR</b> — résolution inverse.</li></ul>
<p><b>Parcours d'une requête :</b> navigateur → cache local → DNS du fournisseur → racine → TLD (.com) → serveur du domaine → réponse, mise en cache selon le TTL.</p>
<p><b>À retenir :</b> DNS surtout UDP/53 (TCP/53 pour les gros transferts) · DHCP UDP/67 et 68 · les noms sont résolus avant la connexion, puis HTTP/HTTPS.</p>`,
m1l6:`<p><b>Commutateur :</b> travaille sur les adresses MAC, construit sa table et n'envoie la trame que sur le bon port ; s'il ne connaît pas la destination, il inonde (flooding).</p>
<p><b>Domaine de diffusion :</b> l'ensemble des ports d'un même VLAN. La diffusion ne traverse pas le routeur.</p>
<p><b>VLAN :</b> découpage logique d'un commutateur en réseaux isolés. Bénéfices : sécurité, moins de diffusion, flexibilité.</p>
<ul><li><b>Port access</b> — appartient à un seul VLAN (poste final).</li><li><b>Port trunk</b> — transporte plusieurs VLAN entre deux commutateurs, avec marquage 802.1Q.</li></ul>
<p><b>Routage inter-VLAN :</b> nécessite un routeur ou un commutateur de couche 3 — deux VLAN différents sont deux réseaux IP différents.</p>
<p><b>Question fréquente :</b> deux machines dans deux VLAN différents communiquent-elles ? Non, sauf via un routeur ou une passerelle.</p>`,
m2l1:`<p><b>Arborescence :</b> <code>/etc</code> configuration · <code>/var</code> variable et journaux · <code>/home</code> utilisateurs · <code>/proc</code> informations du noyau · <code>/bin</code> commandes.</p>
<p><b>Commandes indispensables :</b></p>
<ul><li><code>ls -l</code> · <code>cd</code> · <code>pwd</code> · <code>cp</code> · <code>mv</code> · <code>rm -r</code></li>
<li><code>find / -name fichier</code> · <code>grep -r "mot" /etc</code></li>
<li><code>ps aux</code> · <code>top</code> · <code>kill -9 PID</code></li>
<li><code>systemctl status|start|stop|enable service</code></li>
<li><code>journalctl -xe</code> pour les journaux</li>
<li><code>ip a</code> · <code>ss -tlnp</code> pour les ports ouverts</li>
<li><code>df -h</code> · <code>du -sh</code> pour l'espace disque</li></ul>
<p><b>À retenir :</b> <code>ss</code> remplace <code>netstat</code> · <code>systemctl</code> remplace <code>service</code> · journaux dans <code>/var/log</code>.</p>`,
m2l2:`<p><code>ls -l</code> affiche une chaîne du type <code>-rwxr-xr--</code> : type puis trois groupes de trois — propriétaire, groupe, autres.</p>
<p><b>Valeurs :</b> r = 4 · w = 2 · x = 1. On additionne : rwx = 7 · r-x = 5 · r-- = 4 · rw- = 6.</p>
<p><b>Exemples :</b></p>
<ul><li><code>chmod 755 fichier</code> → rwxr-xr-x.</li><li><code>chmod 644 fichier</code> → rw-r--r-- (fichier ordinaire).</li><li><code>chmod 600 cle</code> → rw------- (clé SSH, fichier sensible).</li><li><code>chown user:group fichier</code> change le propriétaire.</li></ul>
<p><b>Comptes :</b> <code>/etc/passwd</code> (comptes) · <code>/etc/shadow</code> (empreintes des mots de passe) · <code>/etc/group</code>.</p>
<p><b>sudo :</b> exécution avec les droits root, configurée dans <code>/etc/sudoers</code>.</p>
<p><b>Question fréquente :</b> que signifie 750 ? Propriétaire rwx, groupe r-x, autres aucun droit.</p>`,
m3l1:`<p><b>Ordre logique d'exécution</b> (important à l'examen) : FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.</p>
<p><b>Exemples :</b></p>
<ul><li>Toutes les lignes : <code>SELECT * FROM employes;</code></li><li>Filtrer : <code>SELECT nom FROM employes WHERE salaire &gt; 5000;</code></li><li>Grouper : <code>SELECT service, COUNT(*) FROM employes GROUP BY service;</code></li><li>Filtrer les groupes : <code>... GROUP BY service HAVING COUNT(*) &gt; 3;</code></li><li>Trier : <code>ORDER BY salaire DESC;</code></li></ul>
<p><b>Différence essentielle :</b> <code>WHERE</code> filtre les lignes avant l'agrégation, <code>HAVING</code> filtre les groupes après. On ne met pas de fonction d'agrégation dans WHERE.</p>
<p><b>Fonctions :</b> COUNT · SUM · AVG · MIN · MAX. <code>COUNT(*)</code> compte toutes les lignes, <code>COUNT(colonne)</code> ignore les NULL.</p>
<p><b>NULL :</b> ne se compare pas avec = mais avec <code>IS NULL</code> ou <code>IS NOT NULL</code>.</p>`,
m3l2:`<p>L'erreur classique : JOIN ne se contente pas de relier, il décide quelles lignes restent.</p>
<ul><li><b>INNER JOIN</b> — uniquement les lignes qui ont une correspondance dans <b>les deux tables</b>.</li>
<li><b>LEFT JOIN</b> — <b>toutes les lignes de la table de gauche</b> plus les correspondances ; sinon les colonnes de droite valent NULL.</li>
<li><b>RIGHT JOIN</b> — l'inverse : toutes les lignes de droite.</li>
<li><b>FULL OUTER JOIN</b> — toutes les lignes des deux tables, avec NULL là où il n'y a pas de correspondance.</li>
<li><b>CROSS JOIN</b> — produit cartésien (chaque ligne avec chaque ligne).</li></ul>
<p><b>Exemple :</b> <code>SELECT c.nom, o.id FROM clients c LEFT JOIN commandes o ON c.id = o.client_id;</code> → tous les clients, même ceux sans commande (o.id = NULL).</p>
<p><b>Règle :</b> « tous les éléments même sans correspondance » → LEFT JOIN ; « seulement ceux qui ont une correspondance » → INNER JOIN.</p>
<p><b>Piège :</b> une condition sur la table de droite placée dans WHERE après un LEFT JOIN le transforme pratiquement en INNER. Mettez-la dans ON.</p>`,
m3l3:`<p><b>Sous-requête :</b> <code>SELECT nom FROM employes WHERE salaire &gt; (SELECT AVG(salaire) FROM employes);</code></p>
<p><b>IN et EXISTS :</b> <code>WHERE id IN (SELECT client_id FROM commandes)</code> — EXISTS est souvent plus rapide avec un index.</p>
<p><b>UNION :</b> fusionne deux résultats compatibles ; UNION ALL conserve les doublons.</p>
<p><b>Index :</b> accélère la lecture sur une colonne utilisée dans WHERE/JOIN, ralentit l'écriture car il faut le mettre à jour. Ne pas indexer toutes les colonnes.</p>
<p><b>Transactions :</b> un ensemble d'opérations qui réussit entièrement ou échoue entièrement. Propriétés ACID : atomicité, cohérence, isolation, durabilité. Commandes : BEGIN · COMMIT · ROLLBACK.</p>
<p><b>Concurrence :</b> les verrous empêchent les modifications conflictuelles ; le niveau d'isolation règle le compromis.</p>`,
m4l1:`<p><b>MERISE :</b> MCD (conceptuel) → MLD (logique) → MPD (physique).</p>
<p><b>Éléments du MCD :</b> entités, attributs, identifiant, associations, cardinalités (0,1 / 1,1 / 0,n / 1,n).</p>
<p><b>Règles de transformation :</b></p>
<ul><li>Entité → table, identifiant → clé primaire.</li><li>Association 1,n — 1,1 → clé étrangère du côté n.</li><li>Association n,n → table de jointure avec les deux clés.</li></ul>
<p><b>UML :</b> diagramme de classes — attributs, opérations, multiplicités (0..1, 1..*). La clé primaire est souvent soulignée.</p>
<p><b>Question fréquente :</b> transformer un MCD en MLD → appliquer les règles dans l'ordre, sans oublier les tables de jointure.</p>`,
m4l2:`<p><b>Objectif :</b> supprimer les redondances et éviter les incohérences.</p>
<ul><li><b>1NF</b> — une seule valeur par cellule (pas de listes), et une clé pour chaque table.</li>
<li><b>2NF</b> — 1NF + aucune dépendance partielle : chaque colonne dépend de <b>toute</b> la clé composite.</li>
<li><b>3NF</b> — 2NF + aucune dépendance transitive : une colonne ne dépend pas d'une autre colonne non clé.</li></ul>
<p><b>Exemple 2NF :</b> table (commande, produit, nom_produit, quantité) avec clé (commande, produit) : nom_produit dépend du seul produit → à déplacer dans la table produits.</p>
<p><b>Exemple 3NF :</b> (employé, service, téléphone_service) : téléphone_service dépend du service, pas de l'employé → à déplacer dans la table services.</p>
<p><b>À l'examen :</b> identifier la clé, puis chercher la dépendance partielle (2NF) ou transitive (3NF).</p>`,
m5l1:`<p><b>O(1)</b> — temps constant : accès à un élément par son indice.</p>
<p><b>O(log n)</b> — recherche binaire : l'espace est divisé par deux à chaque étape.</p>
<p><b>O(n)</b> — parcours de tous les éléments une fois.</p>
<p><b>O(n log n)</b> — meilleurs tris généraux (fusion, tas).</p>
<p><b>O(n²)</b> — deux boucles imbriquées : tri à bulles, recherche linéaire dans une boucle.</p>
<p><b>Règles :</b> ignorer les constantes (O(2n) = O(n)) · garder le terme dominant (O(n² + n) = O(n²)) · une boucle sur la moitié du tableau reste O(n).</p>
<p><b>Question fréquente :</b> complexité de la recherche binaire → O(log n), à condition que le tableau soit <b>trié</b>.</p>`,
m5l2:`<ul><li><b>Tableau</b> — accès O(1) par indice, insertion/suppression O(n).</li>
<li><b>Liste chaînée</b> — insertion/suppression rapide si la position est connue, accès O(n).</li>
<li><b>Pile</b> — LIFO : dernier entré, premier sorti. Usages : annulation, évaluation d'expressions.</li>
<li><b>File</b> — FIFO : premier entré, premier sorti. Usages : ordonnancement, BFS.</li>
<li><b>Table de hachage</b> — recherche O(1) en moyenne, avec une bonne fonction de hachage.</li>
<li><b>Arbre binaire de recherche</b> — recherche O(log n) s'il est équilibré, O(n) s'il dégénère.</li></ul>
<p><b>Tris :</b> bulles O(n²) · insertion O(n²) mais correct sur petits volumes · fusion O(n log n) et stable · rapide O(n log n) en moyenne.</p>
<p><b>BFS et DFS :</b> BFS avec une file (plus court chemin sans poids), DFS avec une pile ou la récursion.</p>`,
m6l1:`<ul><li><b>Classe</b> — modèle ; <b>objet</b> — instance.</li>
<li><b>Encapsulation</b> — cacher les champs et exposer des méthodes (getters/setters).</li>
<li><b>Héritage</b> — une classe réutilise et spécialise une autre.</li>
<li><b>Polymorphisme</b> — même appel, comportement différent selon la classe réelle.</li>
<li><b>Abstraction</b> — interfaces et classes abstraites fixent le contrat sans l'implémentation.</li></ul>
<p><b>Exemple :</b> classe <code>Animal</code> avec <code>crier()</code> ; <code>Chien</code> et <code>Chat</code> la redéfinissent. Un appel <code>crier()</code> exécute la version de la classe réelle.</p>
<p><b>Question fréquente :</b> <b>surcharge</b> (même nom, paramètres différents, résolue à la compilation) contre <b>redéfinition</b> (réécriture dans une classe fille, résolue à l'exécution).</p>`,
m7l1:`<p><b>AD</b> est un annuaire qui stocke utilisateurs, groupes, machines et imprimantes, et permet une authentification centralisée.</p>
<ul><li><b>Contrôleur de domaine</b> — vérifie l'identité et applique les stratégies.</li>
<li><b>OU</b> — conteneur d'organisation pour appliquer des GPO.</li>
<li><b>Groupes</b> — base de la distribution des droits (RBAC).</li>
<li><b>Kerberos</b> — protocole d'authentification par défaut d'AD.</li></ul>
<p><b>Pourquoi en concours ?</b> Parce qu'il répond à la question des droits et de l'administration centralisée : qui accède à quoi, et qui applique la politique.</p>`,
m7l2:`<p><b>GPO</b> : stratégies de groupe appliquées aux objets — mots de passe, blocage USB, déploiement logiciel, sécurité. Liées au site, au domaine ou à l'OU ; en cas de conflit, l'objet le plus proche gagne.</p>
<p><b>RAID :</b></p>
<ul><li><b>RAID 0</b> — répartition sans redondance : performance, aucune protection.</li>
<li><b>RAID 1</b> — miroir : protection, moitié de la capacité.</li>
<li><b>RAID 5</b> — répartition avec parité répartie : tolère un disque en panne, minimum 3 disques.</li>
<li><b>RAID 6</b> — tolère deux pannes.</li>
<li><b>RAID 10</b> — miroir + répartition : performance et protection, au prix de la capacité.</li></ul>
<p><b>Sauvegardes :</b> complète, différentielle (depuis la dernière complète), incrémentale (depuis la dernière de tout type). Règle : copie hors site et test de restauration.</p>`,
m8l1:`<p><b>Symétrique</b> — une seule clé pour chiffrer et déchiffrer : AES. Rapide, mais il faut protéger et échanger la clé.</p>
<p><b>Asymétrique</b> — deux clés : publique et privée (RSA, ECC). Lent, utilisé pour l'échange et la signature.</p>
<p><b>Comment fonctionne HTTPS ?</b></p>
<ol><li>Le client se connecte et demande le certificat.</li><li>Il le vérifie (chaîne de confiance, validité, nom de domaine).</li><li>Échange d'une clé de session de façon asymétrique (ou Diffie-Hellman).</li><li>Le reste de la connexion est chiffré avec cette clé symétrique rapide.</li></ol>
<p><b>Pourquoi les deux ?</b> L'asymétrique résout l'échange de clé, le symétrique résout la vitesse. C'est la réponse attendue à l'examen.</p>`,
m8l2:`<p><b>La signature numérique</b> garantit l'intégrité (contenu non modifié), l'origine (le détenteur de la clé privée) et la non-répudiation.</p>
<p><b>Comment est-elle créée ?</b> On calcule une empreinte (hash) du message, chiffrée avec la clé <b>privée</b>. Le destinataire la déchiffre avec la clé <b>publique</b> et compare l'empreinte.</p>
<p><b>PKI :</b> une autorité de certification (CA) délivre des certificats liant une clé publique à une identité, signés par un certificat supérieur dans une chaîne de confiance. Un certificat contient : titulaire, clé publique, validité, signataire.</p>
<p><b>Empreinte :</b> SHA-256 — sens unique, longueur fixe, sensible à toute modification. MD5 et SHA-1 sont obsolètes en sécurité.</p>`,
m8l3:`<p><b>Failles OWASP majeures :</b></p>
<ul><li><b>Injection</b> (SQL/commande) — parade : requêtes préparées.</li>
<li><b>Contrôle d'accès défaillant</b> — vérifier les droits côté serveur, pas seulement dans l'interface.</li>
<li><b>XSS</b> — injection de JavaScript ; parade : échappement des sorties et CSP.</li>
<li><b>CSRF</b> — requête forgée au nom de l'utilisateur ; parade : jeton et SameSite.</li>
<li><b>Mauvaise configuration</b> — mots de passe par défaut, ports ouverts, sauvegardes exposées.</li></ul>
<p><b>Loi 09-08</b> (protection des données personnelles au Maroc) : finalité déterminée et légitime, information de la personne, consentement, droit d'accès et de rectification, durée de conservation limitée, déclaration à la CNDP. Les données sensibles exigent une autorisation.</p>
<p><b>Question fréquente :</b> authentification = qui êtes-vous ; autorisation = ce que vous pouvez faire.</p>`,
m9l1:`<p><b>NAT</b> — traduit les adresses privées en adresse publique. <b>PAT</b> — un seul IP partagé via les ports (le cas domestique).</p>
<p><b>Adresses privées :</b> 10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16. Non routées sur Internet.</p>
<p><b>Pare-feu :</b> filtre selon des règles (source, destination, port, protocole). Types : filtrage de paquets, stateful (suit l'état des connexions), proxy.</p>
<p><b>VPN :</b> tunnel chiffré. <b>Site à site</b> entre deux sites, <b>accès distant</b> pour un utilisateur. Protocoles : IPsec, VPN SSL/TLS, WireGuard.</p>
<p><b>Question fréquente :</b> pourquoi NAT pose problème à la VoIP ? Les ports changent ; il faut STUN/TURN ou l'ouverture de ports.</p>`,
m9l2:`<p><b>Méthodes :</b> GET (lire, sans effet) · POST (créer) · PUT (remplacer) · PATCH (modifier partiellement) · DELETE.</p>
<p><b>Codes :</b> 200 succès · 201 créé · 301 redirection permanente · 304 non modifié · 400 requête invalide · 401 non authentifié · 403 interdit · 404 introuvable · 429 trop de requêtes · 500 erreur serveur · 502/503/504 service indisponible.</p>
<p><b>En-têtes :</b> Content-Type · Authorization · Cache-Control · Set-Cookie (avec HttpOnly et Secure) · CORS.</p>
<p><b>HTTP et HTTPS :</b> HTTPS = HTTP dans TLS, port 443, garantit confidentialité, intégrité et authentification du serveur.</p>
<p><b>REST :</b> ressources par chemins, verbes HTTP, sans état — voir le module Architecture.</p>`,
m10l1:`<ul><li><b>Cas d'utilisation</b> — acteurs et fonctions (qui fait quoi).</li>
<li><b>Classes</b> — classes et relations : héritage, agrégation, composition, multiplicités.</li>
<li><b>Séquence</b> — échange de messages entre objets dans le temps.</li>
<li><b>Activité</b> — flux de travail, décisions, parallélisme.</li>
<li><b>États-transitions</b> — états d'un objet et transitions.</li></ul>
<p><b>Règle :</b> question sur l'enchaînement temporel → Séquence ; question sur la logique métier et les conditions → Activité.</p>`,
m10l2:`<p><b>Scrum — rôles :</b> Product Owner (priorités), Scrum Master (processus), équipe.</p>
<p><b>Événements :</b> Sprint (2 à 4 semaines) · Planning · Daily (15 min) · Review (démonstration) · Retrospective (amélioration).</p>
<p><b>Artefacts :</b> Product Backlog · Sprint Backlog · Increment.</p>
<p><b>Différence demandée :</b> Review = ce que nous avons produit (le produit). Retrospective = comment nous avons travaillé (le processus).</p>
<p><b>Tests :</b> unitaire · intégration · fonctionnel · non-régression · charge.</p>
<p><b>Patrons :</b> Singleton (instance unique) · Factory (création) · Observer (notification) · MVC (séparation).</p>`,
m11l1:`<p><b>Monolithe :</b> une seule application. Avantages : simplicité de déploiement au début. Inconvénients : mise à l'échelle sélective difficile, couplage, maintenance lourde avec la taille.</p>
<p><b>Microservices :</b> services petits et indépendants, chacun avec sa base et son déploiement. Avantages : mise à l'échelle ciblée, équipes autonomes, tolérance aux pannes. Inconvénients : complexité de distribution et d'observabilité, cohérence des données, latence réseau.</p>
<p><b>SOA :</b> services réutilisables via un bus (ESB) — plus ancien et plus centralisé.</p>
<p><b>REST :</b> ressources, verbes HTTP, sans état, JSON. <b>SOAP :</b> XML strict avec WSDL — plus lourd.</p>
<p><b>À l'examen :</b> comparer toujours selon trois critères : mise à l'échelle, complexité d'exploitation, cohérence des données.</p>`,
m11l2:`<p><b>ITIL :</b> cadre de gestion des services informatiques. Concepts attendus :</p>
<ul><li><b>Incident</b> — arrêt ou dégradation d'un service : objectif, rétablir vite.</li>
<li><b>Problème</b> — cause racine d'incidents répétés : objectif, l'éliminer.</li>
<li><b>Changement</b> — modification maîtrisée avec évaluation des risques.</li>
<li><b>Service Desk</b> — point de contact unique.</li>
<li><b>SLA</b> — accord de niveau de service.</li></ul>
<p><b>ERP :</b> système unifié de gestion (comptabilité, stocks, RH). <b>CRM :</b> gestion de la relation client. <b>EAI/ESB :</b> intégration des systèmes existants.</p>
<p><b>Question fréquente :</b> incident ou problème ? L'incident est le symptôme, le problème en est la cause racine.</p>`,
m12l1:`<ul><li><b>Principe de légalité :</b> l'administration est soumise au droit.</li>
<li><b>Acte administratif :</b> décision unilatérale produisant des effets juridiques ; recours pour excès de pouvoir devant le tribunal administratif, et recours en indemnisation.</li>
<li><b>Contrat administratif :</b> clauses exorbitantes (service public, puissance publique).</li>
<li><b>Service public :</b> activité assurée par l'administration pour un besoin général ; principes de continuité, d'égalité et de neutralité.</li>
<li><b>Responsabilité administrative :</b> pour faute, et pour risque dans certains cas.</li>
<li><b>Décentralisation et déconcentration :</b> la première transfère la décision à des organes locaux élus, la seconde délègue au sein de l'État.</li></ul>
<p><b>Ce qui est demandé :</b> une définition précise + un exemple + un principe juridique. Sans longueur inutile.</p>`,
m12l2:`<p><b>Structure d'une réponse rédigée :</b></p>
<ol><li><b>Introduction :</b> définir les termes et situer la question (3 à 5 lignes).</li><li><b>Développement :</b> deux ou trois idées, une par paragraphe : idée + explication + exemple.</li><li><b>Conclusion :</b> synthèse et position ou recommandation.</li></ol>
<p><b>Règles :</b> phrases courtes · un terme technique par idée · pas de remplissage · respecter le nombre de lignes demandé.</p>
<p><b>Culture générale :</b> pour chaque grand thème (numérisation, intelligence artificielle, protection des données, administration électronique), retenir trois points : définition, utilité, défi.</p>`
};

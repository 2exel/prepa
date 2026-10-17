Object.assign(window.BODIES.fr, {
m1l1:`<h2>Le contexte : que se passe-t-il quand vous envoyez un message WhatsApp ?</h2>
<p>Vous tapez « salut » et vous appuyez sur envoyer. Le message quitte votre téléphone, passe par le Wi-Fi, la box, le réseau de l'opérateur, la fibre, jusqu'à votre ami dans une autre ville. Sur ce chemin, tout est découpé en couches : chacune ajoute son « enveloppe », comme une lettre placée dans une enveloppe, puis dans une autre.</p>
<p><b>OSI</b> n'est pas une invention technique : c'est une <b>carte des responsabilités</b>. Chaque couche ne connaît que son travail et le rend à celle du dessus. À l'examen, 80 % des questions commencent par « à quelle couche ? ».</p>

<div class="dg">
<div class="cap">Schéma — les 7 couches OSI et leur protocole le plus courant</div>
<div class="l hot"><b>7. Application</b><span>HTTP · DNS · DHCP · SMTP · FTP</span><span class="p">l'utilisateur</span></div>
<div class="l"><b>6. Présentation</b><span>encodage · chiffrement TLS · compression</span><span class="p">comment présenter</span></div>
<div class="l"><b>5. Session</b><span>ouvrir et fermer la session</span><span class="p">qui parle à qui</span></div>
<div class="l"><b>4. Transport</b><span>TCP · UDP · ports</span><span class="p">livraison garantie ?</span></div>
<div class="l hot"><b>3. Réseau</b><span>IP · routage · routeur</span><span class="p">où aller ?</span></div>
<div class="l hot"><b>2. Liaison</b><span>MAC · Ethernet · commutateur</span><span class="p">quel port ?</span></div>
<div class="l"><b>1. Physique</b><span>câble · signal · fibre</span><span class="p">0 et 1</span></div>
</div>

<p><b>L'encapsulation</b> est la clé : le message descend, et chaque couche ajoute son en-tête :</p>
<div class="dg"><div class="cap">Schéma — construction de la trame</div>
<div class="l"><b>Application</b><span>« salut »</span><span class="p">data</span></div>
<div class="l"><b>+ Transport</b><span>en-tête TCP : ports source/destination, numéro de séquence</span><span class="p">segment</span></div>
<div class="l"><b>+ Réseau</b><span>en-tête IP : adresse source et destination</span><span class="p">paquet</span></div>
<div class="l"><b>+ Liaison</b><span>en-tête Ethernet : MAC source et destination</span><span class="p">trame</span></div>
<div class="l"><b>+ Physique</b><span>signal électrique ou lumière</span><span class="p">bits</span></div>
</div>

<p>À la réception, c'est l'inverse exact : chaque couche retire son en-tête et remet au-dessus. C'est la <b>décapsulation</b>.</p>
<p>Le modèle <b>TCP/IP</b> regroupe tout en 4 couches : accès réseau (1+2) · Internet (3) · transport (4) · application (5+6+7). L'examen peut demander les deux : sachez passer de l'un à l'autre.</p>

<h2>Exemple résolu : où travaille chaque protocole ?</h2>
<ul>
<li>Trouver le MAC d'une machine du réseau local ? <b>Liaison (2)</b> — via ARP.</li>
<li>Choisir la route entre deux réseaux ? <b>Réseau (3)</b> — IP et routage.</li>
<li>Garantir que le fichier arrive complet ? <b>Transport (4)</b> — TCP.</li>
<li>Traduire un nom de site en adresse ? <b>Application (7)</b> — DNS.</li>
</ul>

<div class="dg"><div class="cap">Moyen mnémotechnique</div>
<div class="l"><b>De haut en bas</b><span>All People Seem To Need Data Processing</span><span class="p">A P S T N D P</span></div>
<div class="l"><b>En français</b><span>Application · Présentation · Session · Transport · Réseau · Liaison · Physique</span><span class="p">7 → 1</span></div>
</div>

<h2>Erreurs fréquentes</h2>
<ul>
<li>« IP est en couche 4 » — faux : IP est en couche 3, TCP/UDP en couche 4.</li>
<li>Confondre commutateur (couche 2, MAC) et routeur (couche 3, IP).</li>
<li>Croire que les couches sont des machines : ce sont des responsabilités logicielles.</li>
</ul>
<div class="why"><b>Question d'examen :</b> à quelle couche travaille ARP ? — <b>Réponse :</b> couche liaison (2), car il associe une IP à une MAC.</div>`,
m1l2:`<h2>Le contexte : pourquoi 255 ? pourquoi /26 = 64 ?</h2>
<p>Une adresse IP, ce sont 4 nombres, et chaque nombre tient sur <b>8 bits</b>. Chaque bit vaut 0 ou 1, mais son poids change : 128, 64, 32, 16, 8, 4, 2, 1. En additionnant les poids des bits à 1, on obtient le nombre.</p>
<p>C'est pour cela que 255 existe : 128+64+32+16+8+4+2+1, tous les bits à 1.</p>

<div class="dg">
<div class="cap">Schéma — 8 bits et leurs poids</div>
<div class="dbits">
<div><b>1</b><small>128</small></div><div><b>1</b><small>64</small></div><div><b>0</b><small>32</small></div><div><b>0</b><small>16</small></div>
<div><b>1</b><small>8</small></div><div><b>0</b><small>4</small></div><div><b>0</b><small>2</small></div><div><b>0</b><small>1</small></div>
</div>
<div class="cap">Cet exemple = 128+64+8 = <b>200</b> → 11001000</div>
</div>

<p><b>Décimal vers binaire :</b> prenez le plus grand poids possible, soustrayez, recommencez. 200 : 200−128=72, 72−64=8, 8−8=0 → bits 128, 64 et 8 = 11001000.</p>
<p><b>Binaire vers décimal :</b> additionnez les poids des bits à 1. 10101000 = 128+32+8 = 168.</p>

<h2>Le masque : comment on découpe un réseau</h2>
<p>Le masque dit : ces bits sont le « réseau », les autres sont les « hôtes ». /24 = 24 bits réseau et 8 bits hôtes ; /26 = 26 bits réseau et 6 bits hôtes.</p>
<div class="dg">
<div class="cap">Schéma — /26 = 26 bits réseau + 6 bits hôtes</div>
<div class="dbits">
<div><b>1</b><small>128</small></div><div><b>1</b><small>64</small></div><div><b>1</b><small>32</small></div><div><b>1</b><small>16</small></div>
<div><b>1</b><small>8</small></div><div><b>1</b><small>4</small></div><div><b>1</b><small>2</small></div><div><b>1</b><small>1</small></div>
</div>
<div class="cap">192 = 128+64 → masque /26 = 255.255.255.192</div>
</div>
<p><b>Nombre d'adresses = 2^(32 − masque).</b> /26 → 2^6 = 64 adresses. Moins 2 (réseau et diffusion) = <b>62 hôtes</b>.</p>

<div class="dg"><div class="cap">Tableau à connaître par cœur</div>
<div class="l"><b>/24</b><span>255.255.255.0</span><span class="p">256 adresses · 254 hôtes</span></div>
<div class="l"><b>/25</b><span>255.255.255.128</span><span class="p">128 · 126</span></div>
<div class="l hot"><b>/26</b><span>255.255.255.192</span><span class="p">64 · 62</span></div>
<div class="l"><b>/27</b><span>255.255.255.224</span><span class="p">32 · 30</span></div>
<div class="l"><b>/28</b><span>255.255.255.240</span><span class="p">16 · 14</span></div>
<div class="l"><b>/29</b><span>255.255.255.248</span><span class="p">8 · 6</span></div>
<div class="l"><b>/30</b><span>255.255.255.252</span><span class="p">4 · 2</span></div>
</div>

<h2>Exemple résolu</h2>
<p>Convertir 26 en binaire : 26−16=10, 10−8=2, 2−2=0 → 00011010.</p>
<p>Quel est le masque /27 ? 32−27 = 5 bits hôtes → 2^5 = 32 adresses, donc la valeur du dernier octet = 256−32 = <b>224</b> → 255.255.255.224.</p>

<div class="dg"><div class="cap">Moyens mnémotechniques</div>
<div class="l"><b>Addition</b><span>128 64 32 16 8 4 2 1</span><span class="p">toujours</span></div>
<div class="l"><b>256 moins le masque</b><span>/n → adresses = 2^(32−n)</span><span class="p">sans calcul long</span></div>
</div>

<h2>Erreurs fréquentes</h2>
<ul>
<li>Croire que /26 = 26 hôtes. Non : /26 = 62 hôtes.</li>
<li>Oublier de retirer 2 (adresse réseau et diffusion).</li>
<li>Confondre le masque avec un nombre d'hôtes.</li>
</ul>
<div class="why"><b>Question d'examen :</b> combien d'hôtes dans un /28 ? — <b>Réponse :</b> 16 − 2 = <b>14</b>.</div>`,
m1l3:`<h2>Le contexte : une entreprise, un réseau, quatre services</h2>
<p>Vous avez 192.168.1.0/24 et quatre services : direction, technique, commercial, invités. Vous voulez isoler chacun. Solution : découper le /24 en quatre sous-réseaux /26.</p>
<p>Comment le savoir ? <b>Taille de bloc = 256 − valeur du masque dans le dernier octet.</b> /26 → 256 − 192 = <b>64</b>.</p>

<div class="dg">
<div class="cap">Schéma — un /24 découpé en quatre /26</div>
<div class="dgb">
<span>.0<small>réseau</small></span><span>.64<small>réseau</small></span><span class="hot">.128<small>réseau</small></span><span>.192<small>réseau</small></span>
</div>
<div class="cap">Chaque bloc = 64 adresses : la première est le réseau, la dernière la diffusion. Il reste 62 hôtes.</div>
</div>

<h2>La méthode en 5 étapes</h2>
<ol>
<li>Calculer le masque et la taille de bloc.</li>
<li>Écrire les débuts : 0, 64, 128, 192.</li>
<li>Repérer le bloc qui contient l'adresse : le plus grand début ≤ adresse.</li>
<li>Réseau = ce début ; diffusion = début + taille − 1.</li>
<li>Hôtes = entre les deux.</li>
</ol>

<h2>Exemple résolu 1</h2>
<p>Adresse : <b>192.168.10.130/26</b></p>
<ul>
<li>Taille 64 → réseaux .0, .64, .128, .192.</li>
<li>130 se situe entre 128 et 191.</li>
<li><b>Réseau : 192.168.10.128</b></li>
<li><b>Diffusion : 192.168.10.191</b> (128+64−1)</li>
<li><b>Hôtes : .129 → .190</b> (62 hôtes)</li>
</ul>

<h2>Exemple résolu 2</h2>
<p>Adresse : <b>172.16.8.200/27</b> → masque 224 → blocs de 32 → .0 .32 .64 .96 .128 .160 .192 .224.</p>
<p>200 est entre 192 et 223 → <b>réseau 172.16.8.192</b>, <b>diffusion 172.16.8.223</b>, hôtes .193 → .222.</p>

<h2>Exemple 3 : masque plus court que /24</h2>
<p>10.0.0.0/23 : le changement se fait dans le troisième octet. Bloc de 2 → 10.0, 10.2, 10.4…</p>

<div class="dg"><div class="cap">Moyens mnémotechniques</div>
<div class="l"><b>256 − masque</b><span>la taille du bloc, toujours</span><span class="p">64 pour /26</span></div>
<div class="l"><b>Compter par blocs</b><span>0 · 64 · 128 · 192</span><span class="p">sans binaire</span></div>
<div class="l"><b>−1 pour la diffusion</b><span>diffusion = début + taille − 1</span><span class="p">erreur classique</span></div>
</div>

<h2>Erreurs fréquentes</h2>
<ul>
<li>Oublier que la première adresse est le réseau, pas un hôte.</li>
<li>Calculer la diffusion comme « début + taille » au lieu de « −1 ».</li>
<li>Confondre adresse réseau et passerelle (souvent la première adresse utilisable).</li>
</ul>
<div class="why"><b>Question d'examen :</b> 10.0.0.130/25 — réseau et diffusion ? — <b>Réponse :</b> bloc de 128 → 130 est dans .128 → réseau 10.0.0.128, diffusion 10.0.0.255.</div>`,
m1l4:`<h2>Le contexte : comment un paquet trouve-t-il son chemin ?</h2>
<p>Imaginez un bureau de poste : chaque enveloppe porte une destination. L'employé ne connaît pas toutes les villes, mais il a un tableau : « si la destination est dans cette plage, envoie vers ce centre ». Le routeur est cet employé ; le tableau est la <b>table de routage</b>.</p>

<div class="dg">
<div class="cap">Schéma — le trajet d'un paquet vers Internet</div>
<div class="l"><b>PC</b><span>192.168.1.10 · passerelle 192.168.1.1</span><span class="p">hors de mon réseau ?</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>Routeur</b><span>table : 0.0.0.0/0 → 41.x.x.x (FAI)</span><span class="p">choisit la route</span></div>
<div class="arr">↓</div>
<div class="l"><b>FAI</b><span>BGP : réseaux des autres opérateurs</span><span class="p">routage inter-opérateurs</span></div>
<div class="arr">↓</div>
<div class="l"><b>Serveur</b><span>203.0.113.5</span><span class="p">destination</span></div>
</div>

<p><b>Une entrée contient 3 éléments :</b> réseau de destination + masque · prochain saut (next hop) ou interface · métrique.</p>
<p><b>Règle d'or — plus long préfixe :</b> si plusieurs routes correspondent, la <b>plus précise</b> gagne (masque le plus grand). Exemple : 10.0.0.0/8 via A et 10.1.0.0/16 via B. Un paquet vers 10.1.2.3 part par <b>B</b>, car /16 est plus précis que /8.</p>

<div class="dg"><div class="cap">Exemple — quelle route choisir ?</div>
<div class="l"><b>0.0.0.0/0</b><span>via 192.168.1.1</span><span class="p">par défaut</span></div>
<div class="l"><b>10.0.0.0/8</b><span>via 10.0.0.1</span><span class="p">général</span></div>
<div class="l hot"><b>10.1.0.0/16</b><span>via 10.1.0.254</span><span class="p">le plus précis → gagne</span></div>
<div class="cap">Destination 10.1.5.20 → envoyée à 10.1.0.254</div>
</div>

<p><b>Statique ou dynamique :</b> statique écrite à la main (petits réseaux, route par défaut) ; dynamique apprise entre routeurs : <b>OSPF</b> en interne, <b>BGP</b> entre opérateurs.</p>
<p><b>À quoi sert la métrique ?</b> Quand deux routes mènent à la même destination, on choisit la moins coûteuse. Mais <b>la précision passe d'abord</b>, la métrique ensuite.</p>

<div class="dg"><div class="cap">Moyens mnémotechniques</div>
<div class="l"><b>Le plus précis gagne</b><span>/28 avant /24 avant /8 avant /0</span><span class="p">plus long préfixe</span></div>
<div class="l"><b>0.0.0.0/0</b><span>« si je ne sais pas, je l'envoie à la porte »</span><span class="p">route par défaut</span></div>
</div>

<h2>Erreurs fréquentes</h2>
<ul>
<li>Choisir par métrique avant d'appliquer la règle du plus long préfixe.</li>
<li>Croire que 0.0.0.0/0 ne concerne que les réseaux locaux.</li>
<li>Oublier que le routeur a besoin du prochain saut, pas seulement du réseau.</li>
</ul>
<div class="why"><b>Question d'examen :</b> 172.16.0.0/16 via A et 172.16.5.0/24 via B. Où part 172.16.5.10 ? — <b>Réponse :</b> via B, car /24 est plus long que /16.</div>`,
m1l5:`<h2>Le contexte : un café avec Wi-Fi et 50 téléphones</h2>
<p>Vous ouvrez un café, 50 clients arrivent. Chaque téléphone a besoin d'une IP, d'une passerelle et d'un DNS. Vous ne les saisirez pas à la main : c'est le rôle de <b>DHCP</b>, qui distribue les adresses pour une durée limitée (bail).</p>

<div class="dg">
<div class="cap">Schéma — DORA, quatre messages</div>
<div class="l hot"><b>1. Discover</b><span>le client : « y a-t-il un serveur DHCP ? » (diffusion)</span><span class="p">UDP 67/68</span></div>
<div class="arr">↓</div>
<div class="l"><b>2. Offer</b><span>le serveur : « prenez 192.168.1.23 »</span><span class="p">proposition</span></div>
<div class="arr">↓</div>
<div class="l"><b>3. Request</b><span>le client : « d'accord, je veux cette adresse »</span><span class="p">demande</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>4. Ack</b><span>le serveur : « confirmé + masque + passerelle + DNS + durée »</span><span class="p">bail</span></div>
</div>

<p><b>Pourquoi quatre messages ?</b> Parce qu'il peut y avoir plusieurs serveurs DHCP. Discover part vers tous, les offres arrivent, le client en choisit une et demande, le serveur confirme. C'est la vraie raison, pas « c'est comme ça ».</p>

<h2>DNS : l'annuaire de l'Internet</h2>
<p>La machine ne comprend pas « google.com », seulement des nombres. DNS traduit le nom en adresse IP. Si DNS tombe, Internet paraît coupé même si la connexion fonctionne : plus personne ne traduit les noms.</p>

<div class="dg">
<div class="cap">Schéma — le parcours d'une requête google.com</div>
<div class="l"><b>1. Cache</b><span>navigateur / système / box</span><span class="p">réponse la plus rapide</span></div>
<div class="arr">↓ (absent)</div>
<div class="l"><b>2. Résolveur FAI</b><span>le DNS de l'opérateur</span><span class="p">demande pour vous</span></div>
<div class="arr">↓</div>
<div class="l"><b>3. Racine → .com</b><span>« demandez au serveur .com »</span><span class="p">délégation</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>4. Serveur du domaine</b><span>renvoie A = 142.250.x.x</span><span class="p">réponse finale</span></div>
</div>

<p><b>Les enregistrements demandés :</b> A (nom→IPv4) · AAAA (nom→IPv6) · CNAME (alias) · MX (messagerie) · TXT (textes et vérification) · NS (serveurs de noms) · PTR (inverse).</p>
<p><b>TTL</b> est la durée de vie de la réponse en cache. TTL court = changements rapides mais plus de requêtes.</p>

<div class="dg"><div class="cap">Moyens mnémotechniques</div>
<div class="l"><b>DORA</b><span>Discover · Offer · Request · Ack</span><span class="p">4 étapes</span></div>
<div class="l"><b>DNS = annuaire</b><span>sans le numéro, pas de contact</span><span class="p">analogie</span></div>
<div class="l"><b>A / MX / CNAME</b><span>adresse / mail / alias</span><span class="p">les plus demandés</span></div>
</div>

<h2>Erreurs fréquentes</h2>
<ul>
<li>Croire que DNS utilise uniquement TCP — c'est UDP/53 par défaut.</li>
<li>Confondre MX (messagerie) et A (adresse).</li>
<li>Croire que DHCP ne donne que l'IP — il donne aussi passerelle et DNS.</li>
</ul>
<div class="why"><b>Question d'examen :</b> quel est l'ordre des messages DHCP ? — <b>Réponse :</b> Discover → Offer → Request → Ack.</div>`,
m1l6:`<h2>Le contexte : un open space de 40 personnes</h2>
<p>Tout le monde est branché sur le même commutateur. Problème : chaque diffusion (broadcast) part vers tous, et le réseau sature. Solution : découper le commutateur en unités logiques — les <b>VLAN</b>. Chaque VLAN est un réseau isolé, même si les machines sont sur le même commutateur.</p>

<div class="dg">
<div class="cap">Schéma — un commutateur, deux VLAN</div>
<div class="l hot"><b>VLAN 10</b><span>Direction : 192.168.10.0/24</span><span class="p">ports access 1-8</span></div>
<div class="l hot"><b>VLAN 20</b><span>Invités : 192.168.20.0/24</span><span class="p">ports access 9-16</span></div>
<div class="arr">↓ trunk 802.1Q</div>
<div class="l"><b>Switch 2</b><span>transporte VLAN 10 et 20 avec étiquette</span><span class="p">trunk</span></div>
</div>

<p><b>Comment fonctionne un commutateur ?</b> Il apprend les adresses MAC : « cette MAC est sur le port 5 ». Quand une trame arrive, il regarde la MAC de destination et l'envoie uniquement au bon port. S'il ne la connaît pas, il inonde (<b>inondation</b>).</p>
<p><b>Port access :</b> relié à un poste, appartient à un seul VLAN. <b>Port trunk :</b> lien entre commutateurs, transporte plusieurs VLAN, chaque trame porte une étiquette 802.1Q.</p>

<h2>Pourquoi faut-il du routage inter-VLAN ?</h2>
<p>VLAN 10 et VLAN 20 sont deux réseaux IP différents. Leurs machines ne communiquent pas directement, même sur le même commutateur. Il faut un <b>routeur</b> ou un <b>commutateur de couche 3</b> (SVI). C'est une question très fréquente.</p>

<div class="dg"><div class="cap">Exemple — communiquent-ils ?</div>
<div class="l"><b>PC-A</b><span>192.168.10.5 /24 · VLAN 10</span><span class="p">—</span></div>
<div class="l"><b>PC-B</b><span>192.168.20.5 /24 · VLAN 20</span><span class="p">—</span></div>
<div class="l hot"><b>Réponse</b><span>non, sans routeur ni L3</span><span class="p">deux réseaux distincts</span></div>
</div>

<div class="dg"><div class="cap">Moyens mnémotechniques</div>
<div class="l"><b>VLAN = pièce</b><span>chaque pièce a sa porte (passerelle)</span><span class="p">isolation</span></div>
<div class="l"><b>Trunk = couloir</b><span>tout le monde y passe, étiqueté</span><span class="p">802.1Q</span></div>
<div class="l"><b>Access = une porte</b><span>un poste, un VLAN</span><span class="p">sans étiquette</span></div>
</div>

<h2>Erreurs fréquentes</h2>
<ul>
<li>Croire qu'un VLAN exige plusieurs commutateurs — non, un seul suffit.</li>
<li>Oublier que la communication inter-VLAN exige du routage.</li>
<li>Confondre trunk et access dans la configuration.</li>
</ul>
<div class="why"><b>Question d'examen :</b> deux machines sur le même commutateur mais dans deux VLAN différents communiquent-elles ? — <b>Réponse :</b> non, sauf via un routeur ou un commutateur de couche 3.</div>`
});

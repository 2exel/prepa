window.BODIES = window.BODIES || {};
window.BODIES.en = {
m1l1:`<p>Every networking question maps to a layer. Identify the layer and you have the answer.</p>
<p><b>OSI — 7 layers:</b></p>
<ul>
<li><b>1. physical</b> — cable, signal, fibre. (bit)</li>
<li><b>2. data link</b> — MAC, Ethernet, switch. (frame)</li>
<li><b>3. network</b> — IP, routing, router. (packet)</li>
<li><b>4. transport</b> — TCP, UDP, ports. (segment)</li>
<li><b>5. session</b> — session management.</li>
<li><b>6. presentation</b> — encoding, encryption, compression (TLS sits close by).</li>
<li><b>7. application</b> — HTTP, DNS, DHCP, SMTP, FTP.</li>
</ul>
<p><b>TCP/IP — 4 layers:</b> network access (1+2) · internet (3) · transport (4) · application (5+6+7).</p>
<p><b>Encapsulation:</b> each layer adds a header: segment → packet → frame → bits. On receipt, decapsulation reverses it.</p>
<p><b>Remember:</b></p>
<ul><li>switch = layer 2, router = layer 3.</li><li>MAC = layer 2, IP = layer 3, port = layer 4.</li><li>TCP is reliable and connection-oriented; UDP is fast with no guarantees.</li><li>DNS, DHCP and HTTP = layer 7.</li></ul>`,
m1l2:`<p>All addressing math rests on powers of two. This table covers most exercises:</p>
<p><code>128 64 32 16 8 4 2 1</code> — the values of the eight bits in one octet.</p>
<p><b>Binary → decimal:</b> 11000000 = 128+64 = 192; 10101000 = 128+32+8 = 168.</p>
<p><b>Decimal → binary:</b> 200 = 128+64+8 = 11001000; 26 = 16+8+2 = 00011010.</p>
<p><b>Masks:</b> the mask separates network bits from host bits.</p>
<ul>
<li>/24 = 255.255.255.0 → 256 addresses, 254 hosts.</li>
<li>/25 = 255.255.255.128 → 128 addresses, 126 hosts.</li>
<li>/26 = 255.255.255.192 → 64 addresses, 62 hosts.</li>
<li>/27 = 255.255.255.224 → 32 addresses, 30 hosts.</li>
<li>/28 = 255.255.255.240 → 16 addresses, 14 hosts.</li>
<li>/29 = 255.255.255.248 → 8 addresses, 6 hosts.</li>
<li>/30 = 255.255.255.252 → 4 addresses, 2 hosts (link between routers).</li>
</ul>
<p><b>Rule:</b> addresses = 2^(32 − mask); hosts = that number − 2 (network and broadcast).</p>
<p><b>Memorise:</b> 2^7=128 · 2^6=64 · 2^5=32 · 2^4=16 · 2^3=8 · 2^2=4 · 2^1=2.</p>`,
m1l3:`<p>The highest-value skill in the exam. Method: compute the block size, then walk up from zero.</p>
<p><b>Block size = 256 − mask value in the last octet.</b> Example: /26 → mask 192 → 256 − 192 = <b>64</b>.</p>
<p><b>Steps:</b></p>
<ol><li>Find the mask and the block size.</li><li>Write network starts: 0, 64, 128, 192 (size 64).</li><li>Pick the largest start that is ≤ the address.</li><li>Network = that start; broadcast = start + size − 1.</li><li>Usable hosts sit between the two.</li></ol>
<p><b>Worked example:</b> 192.168.10.130/26</p>
<ul><li>Size 64 → networks .0, .64, .128, .192.</li><li>130 lies between 128 and 191.</li><li><b>Network: 192.168.10.128</b> · <b>broadcast: 192.168.10.191</b> · hosts .129 → .190 (62 hosts).</li></ul>
<p><b>Second example:</b> 172.16.8.200/27 → blocks of 32 → 200 falls in .192 → network 172.16.8.192, broadcast 172.16.8.223.</p>
<p><b>Masks shorter than /24:</b> the change moves into the third octet. /23 → blocks of 2: 10.0, 10.2, 10.4…</p>
<p><b>Memorise:</b> /25→128 · /26→64 · /27→32 · /28→16 · /29→8 · /30→4.</p>`,
m1l4:`<p>A router decides from its routing table, not from the destination address alone.</p>
<p><b>An entry holds:</b> destination network and mask · next hop or interface · metric.</p>
<p><b>Longest prefix match:</b> when several routes match, the most specific mask wins. Example: /24 and /28 for the same network → /28 is chosen.</p>
<p><b>Default route:</b> 0.0.0.0/0, used when no more specific route exists. It is the exit to the internet.</p>
<p><b>Static vs dynamic:</b> static is written by hand; dynamic is learned by protocols (OSPF internally, BGP between operators).</p>
<p><b>In the exam:</b> given a table and a destination, apply longest prefix match, then check the next hop is reachable.</p>
<p><b>Remember:</b> 0.0.0.0/0 = default · 127.0.0.0/8 = loopback · 169.254.0.0/16 = link-local · 224.0.0.0/4 = multicast.</p>`,
m1l5:`<p><b>DHCP — how does a machine get its address?</b> Four messages, remembered as DORA:</p>
<ul><li><b>Discover</b> — the client broadcasts looking for a server.</li><li><b>Offer</b> — the server proposes an address.</li><li><b>Request</b> — the client asks for that address.</li><li><b>Ack</b> — the server confirms, with mask, gateway, DNS and lease duration.</li></ul>
<p><b>DNS — turning names into addresses.</b> The records you will be asked about:</p>
<ul><li><b>A</b> — name to IPv4 · <b>AAAA</b> — name to IPv6.</li><li><b>CNAME</b> — alias to another name.</li><li><b>MX</b> — mail server · <b>TXT</b> — text records (SPF, verification).</li><li><b>NS</b> — domain name servers · <b>PTR</b> — reverse lookup.</li></ul>
<p><b>A lookup path:</b> browser → local cache → ISP resolver → root → TLD (.com) → authoritative server → answer, cached according to TTL.</p>
<p><b>Remember:</b> DNS mostly UDP/53 (TCP/53 for large transfers) · DHCP UDP/67 and 68 · names are resolved before the connection, then HTTP/HTTPS runs.</p>`,
m1l6:`<p><b>Switch:</b> works with MAC addresses, builds a MAC table and forwards a frame only to the right port; if the destination is unknown it floods.</p>
<p><b>Broadcast domain:</b> all ports in the same VLAN. Broadcasts do not cross a router.</p>
<p><b>VLAN:</b> a logical split of one switch into isolated networks. Benefits: security, less broadcast, flexibility.</p>
<ul><li><b>Access port</b> — belongs to one VLAN (end device).</li><li><b>Trunk port</b> — carries several VLANs between switches, tagged with 802.1Q.</li></ul>
<p><b>Inter-VLAN routing:</b> needs a router or a layer-3 switch — different VLANs are different IP networks.</p>
<p><b>Frequent question:</b> can two hosts in different VLANs communicate? Not directly; only through a router or gateway.</p>`,
m2l1:`<p><b>Layout:</b> <code>/etc</code> configuration · <code>/var</code> variable data and logs · <code>/home</code> users · <code>/proc</code> kernel information · <code>/bin</code> commands.</p>
<p><b>Essential commands:</b></p>
<ul><li><code>ls -l</code> · <code>cd</code> · <code>pwd</code> · <code>cp</code> · <code>mv</code> · <code>rm -r</code></li>
<li><code>find / -name file</code> · <code>grep -r "word" /etc</code></li>
<li><code>ps aux</code> · <code>top</code> · <code>kill -9 PID</code></li>
<li><code>systemctl status|start|stop|enable service</code></li>
<li><code>journalctl -xe</code> for logs</li>
<li><code>ip a</code> · <code>ss -tlnp</code> for listening ports</li>
<li><code>df -h</code> · <code>du -sh</code> for disk usage</li></ul>
<p><b>Remember:</b> <code>ss</code> replaces <code>netstat</code> · <code>systemctl</code> replaces <code>service</code> · logs live in <code>/var/log</code>.</p>`,
m2l2:`<p><code>ls -l</code> shows a string such as <code>-rwxr-xr--</code>: type, then three groups of three — owner, group, others.</p>
<p><b>Values:</b> r = 4 · w = 2 · x = 1. Add them: rwx = 7 · r-x = 5 · r-- = 4 · rw- = 6.</p>
<p><b>Examples:</b></p>
<ul><li><code>chmod 755 file</code> → rwxr-xr-x.</li><li><code>chmod 644 file</code> → rw-r--r-- (ordinary file).</li><li><code>chmod 600 key</code> → rw------- (SSH key, sensitive file).</li><li><code>chown user:group file</code> changes the owner.</li></ul>
<p><b>Accounts:</b> <code>/etc/passwd</code> (accounts) · <code>/etc/shadow</code> (password hashes) · <code>/etc/group</code>.</p>
<p><b>sudo:</b> run with root rights, configured in <code>/etc/sudoers</code>.</p>
<p><b>Frequent question:</b> what does 750 mean? Owner rwx, group r-x, others nothing.</p>`,
m3l1:`<p><b>Logical execution order</b> (important in exams): FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.</p>
<p><b>Examples:</b></p>
<ul><li>All rows: <code>SELECT * FROM employees;</code></li><li>Filter: <code>SELECT name FROM employees WHERE salary &gt; 5000;</code></li><li>Group: <code>SELECT department, COUNT(*) FROM employees GROUP BY department;</code></li><li>Filter groups: <code>... GROUP BY department HAVING COUNT(*) &gt; 3;</code></li><li>Sort: <code>ORDER BY salary DESC;</code></li></ul>
<p><b>Key difference:</b> <code>WHERE</code> filters rows before aggregation, <code>HAVING</code> filters groups after. Never put an aggregate in WHERE.</p>
<p><b>Functions:</b> COUNT · SUM · AVG · MIN · MAX. <code>COUNT(*)</code> counts all rows; <code>COUNT(column)</code> ignores NULLs.</p>
<p><b>NULL:</b> compare with <code>IS NULL</code> or <code>IS NOT NULL</code>, never with =.</p>`,
m3l2:`<p>The classic mistake: JOIN does not just connect tables, it decides which rows survive.</p>
<ul><li><b>INNER JOIN</b> — only rows with a match in <b>both tables</b>.</li>
<li><b>LEFT JOIN</b> — <b>all rows of the left table</b> plus matches; otherwise right-hand columns are NULL.</li>
<li><b>RIGHT JOIN</b> — the mirror: all rows of the right table.</li>
<li><b>FULL OUTER JOIN</b> — all rows from both tables, NULL where there is no match.</li>
<li><b>CROSS JOIN</b> — Cartesian product (every row with every row).</li></ul>
<p><b>Example:</b> <code>SELECT c.name, o.id FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;</code> → every customer, including those with no order (o.id = NULL).</p>
<p><b>Rule:</b> "all items even without a match" → LEFT JOIN; "only those with a match" → INNER JOIN.</p>
<p><b>Trap:</b> a condition on the right table in WHERE after a LEFT JOIN effectively turns it into an INNER JOIN. Put it in ON instead.</p>`,
m3l3:`<p><b>Subquery:</b> <code>SELECT name FROM employees WHERE salary &gt; (SELECT AVG(salary) FROM employees);</code></p>
<p><b>IN and EXISTS:</b> <code>WHERE id IN (SELECT customer_id FROM orders)</code> — EXISTS is often faster with an index.</p>
<p><b>UNION:</b> merges two compatible result sets; UNION ALL keeps duplicates.</p>
<p><b>Indexes:</b> speed up reads on columns used in WHERE/JOIN and slow writes because they must be maintained. Do not index everything.</p>
<p><b>Transactions:</b> a set of operations that either all succeed or all fail. ACID: atomicity, consistency, isolation, durability. Commands: BEGIN · COMMIT · ROLLBACK.</p>
<p><b>Concurrency:</b> locks prevent conflicting writes; the isolation level sets the trade-off.</p>`,
m4l1:`<p><b>MERISE:</b> conceptual → logical → physical model.</p>
<p><b>Conceptual model elements:</b> entities, attributes, identifier, associations, cardinalities (0,1 / 1,1 / 0,n / 1,n).</p>
<p><b>Conversion rules:</b></p>
<ul><li>Entity → table; identifier → primary key.</li><li>1,n — 1,1 association → foreign key on the n side.</li><li>n,n association → junction table holding both keys.</li></ul>
<p><b>UML:</b> class diagram — attributes, operations, multiplicities (0..1, 1..*). The primary key is usually underlined.</p>
<p><b>Frequent question:</b> convert a conceptual model to tables → apply the rules in order and do not forget junction tables.</p>`,
m4l2:`<p><b>Goal:</b> remove redundancy and avoid inconsistent data.</p>
<ul><li><b>1NF</b> — one value per cell (no lists) and a key for every table.</li>
<li><b>2NF</b> — 1NF plus no partial dependency: every column depends on the <b>whole</b> composite key.</li>
<li><b>3NF</b> — 2NF plus no transitive dependency: a column does not depend on another non-key column.</li></ul>
<p><b>2NF example:</b> table (order, product, product_name, quantity) keyed by (order, product): product_name depends on product alone → move it to the products table.</p>
<p><b>3NF example:</b> (employee, department, department_phone): department_phone depends on the department, not the employee → move it to the departments table.</p>
<p><b>In the exam:</b> identify the key, then look for a partial (2NF) or transitive (3NF) dependency.</p>`,
m5l1:`<p><b>O(1)</b> — constant time: array access by index.</p>
<p><b>O(log n)</b> — binary search: the space halves at every step.</p>
<p><b>O(n)</b> — one pass over all elements.</p>
<p><b>O(n log n)</b> — the best general-purpose sorts (merge, heap).</p>
<p><b>O(n²)</b> — two nested loops: bubble sort, linear search inside a loop.</p>
<p><b>Rules:</b> drop constants (O(2n) = O(n)) · keep the dominant term (O(n² + n) = O(n²)) · a loop over half the array is still O(n).</p>
<p><b>Frequent question:</b> complexity of binary search → O(log n), provided the data is <b>sorted</b>.</p>`,
m5l2:`<ul><li><b>Array</b> — O(1) access by index, O(n) insert/delete.</li>
<li><b>Linked list</b> — fast insert/delete once the position is known, O(n) access.</li>
<li><b>Stack</b> — LIFO: last in, first out. Uses: undo, expression evaluation.</li>
<li><b>Queue</b> — FIFO: first in, first out. Uses: scheduling, BFS.</li>
<li><b>Hash table</b> — O(1) average lookup with a good hash function.</li>
<li><b>Binary search tree</b> — O(log n) when balanced, O(n) when degenerate.</li></ul>
<p><b>Sorting:</b> bubble O(n²) · insertion O(n²) but fine on small data · merge O(n log n) and stable · quick O(n log n) average.</p>
<p><b>BFS and DFS:</b> BFS with a queue (shortest path without weights), DFS with a stack or recursion.</p>`,
m6l1:`<ul><li><b>Class</b> — blueprint; <b>object</b> — instance.</li>
<li><b>Encapsulation</b> — hide fields behind methods (getters/setters).</li>
<li><b>Inheritance</b> — a class reuses and specialises another.</li>
<li><b>Polymorphism</b> — the same call behaving differently per actual class.</li>
<li><b>Abstraction</b> — interfaces and abstract classes define the contract without the implementation.</li></ul>
<p><b>Example:</b> class <code>Animal</code> with <code>speak()</code>; <code>Dog</code> and <code>Cat</code> override it. Calling <code>speak()</code> runs the version of the real class.</p>
<p><b>Frequent question:</b> <b>overloading</b> (same name, different parameters, resolved at compile time) versus <b>overriding</b> (redefined in a subclass, resolved at runtime).</p>`,
m7l1:`<p><b>AD</b> is a directory that stores users, groups, machines and printers, and enables centralised authentication.</p>
<ul><li><b>Domain controller</b> — verifies identity and enforces policy.</li>
<li><b>OU</b> — organisational container for applying GPOs.</li>
<li><b>Groups</b> — the basis of role-based access control.</li>
<li><b>Kerberos</b> — the default AD authentication protocol.</li></ul>
<p><b>Why it matters in the exam:</b> it answers the question of permissions and central administration — who accesses what, and who applies policy.</p>`,
m7l2:`<p><b>GPO</b>: group policies applied to objects — passwords, USB blocking, software deployment, security. Linked to a site, domain or OU; when they conflict, the closest object wins.</p>
<p><b>RAID:</b></p>
<ul><li><b>RAID 0</b> — striping, no redundancy: speed, no protection.</li>
<li><b>RAID 1</b> — mirror: protection, half the capacity.</li>
<li><b>RAID 5</b> — striping with distributed parity: tolerates one failed disk, minimum three disks.</li>
<li><b>RAID 6</b> — tolerates two failures.</li>
<li><b>RAID 10</b> — mirror plus striping: speed and protection at the cost of capacity.</li></ul>
<p><b>Backups:</b> full, differential (since the last full), incremental (since the last of any kind). Rule: keep an off-site copy and test restores.</p>`,
m8l1:`<p><b>Symmetric</b> — one key to encrypt and decrypt: AES. Fast, but the key must be protected and exchanged.</p>
<p><b>Asymmetric</b> — two keys, public and private (RSA, ECC). Slow, used for key exchange and signatures.</p>
<p><b>How HTTPS works:</b></p>
<ol><li>The client connects and requests the certificate.</li><li>It verifies it (chain of trust, validity, domain name).</li><li>A session key is exchanged asymmetrically (or via Diffie-Hellman).</li><li>The rest of the connection uses that fast symmetric key.</li></ol>
<p><b>Why both?</b> Asymmetric solves key exchange, symmetric solves speed. That is the expected exam answer.</p>`,
m8l2:`<p><b>A digital signature</b> guarantees integrity (content unchanged), origin (holder of the private key) and non-repudiation.</p>
<p><b>How it is built:</b> compute a hash of the message and encrypt it with the <b>private</b> key. The receiver decrypts with the <b>public</b> key and compares the hash.</p>
<p><b>PKI:</b> a certificate authority issues certificates binding a public key to an identity, signed by a higher certificate in a chain of trust. A certificate holds: subject, public key, validity, issuer.</p>
<p><b>Hashing:</b> SHA-256 — one way, fixed length, sensitive to any change. MD5 and SHA-1 are obsolete for security.</p>`,
m8l3:`<p><b>Major OWASP risks:</b></p>
<ul><li><b>Injection</b> (SQL/command) — defence: prepared statements.</li>
<li><b>Broken access control</b> — enforce permissions server-side, not only in the UI.</li>
<li><b>XSS</b> — JavaScript injection; defence: output encoding and CSP.</li>
<li><b>CSRF</b> — a request forged in the user's name; defence: tokens and SameSite.</li>
<li><b>Misconfiguration</b> — default passwords, open ports, exposed backups.</li></ul>
<p><b>Law 09-08</b> (Moroccan personal data protection): defined and legitimate purpose, informing the person, consent, right of access and rectification, limited retention, declaration to the CNDP. Sensitive data needs authorisation.</p>
<p><b>Frequent question:</b> authentication = who you are; authorisation = what you may do.</p>`,
m9l1:`<p><b>NAT</b> — translates private addresses to a public one. <b>PAT</b> — one public IP shared across ports (the home case).</p>
<p><b>Private ranges:</b> 10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16. Not routed on the internet.</p>
<p><b>Firewall:</b> filters by rules (source, destination, port, protocol). Types: packet filter, stateful (tracks connections), proxy.</p>
<p><b>VPN:</b> an encrypted tunnel. <b>Site-to-site</b> between two sites, <b>remote access</b> for a user. Protocols: IPsec, SSL/TLS VPN, WireGuard.</p>
<p><b>Frequent question:</b> why does NAT break VoIP? Ports change; you need STUN/TURN or port forwarding.</p>`,
m9l2:`<p><b>Methods:</b> GET (read, no side effect) · POST (create) · PUT (replace) · PATCH (partial update) · DELETE.</p>
<p><b>Codes:</b> 200 success · 201 created · 301 permanent redirect · 304 not modified · 400 bad request · 401 unauthenticated · 403 forbidden · 404 not found · 429 too many requests · 500 server error · 502/503/504 service unavailable.</p>
<p><b>Headers:</b> Content-Type · Authorization · Cache-Control · Set-Cookie (with HttpOnly and Secure) · CORS.</p>
<p><b>HTTP vs HTTPS:</b> HTTPS is HTTP inside TLS on port 443, giving confidentiality, integrity and server authentication.</p>
<p><b>REST:</b> resources by path, HTTP verbs, stateless — see the architecture module.</p>`,
m10l1:`<ul><li><b>Use case</b> — actors and functions (who does what).</li>
<li><b>Class</b> — classes and relationships: inheritance, aggregation, composition, multiplicities.</li>
<li><b>Sequence</b> — messages exchanged between objects over time.</li>
<li><b>Activity</b> — workflow, decisions, parallelism.</li>
<li><b>State machine</b> — an object's states and transitions.</li></ul>
<p><b>Rule:</b> question about time-ordered interaction → Sequence; question about business logic and conditions → Activity.</p>`,
m10l2:`<p><b>Scrum roles:</b> Product Owner (priorities), Scrum Master (process), team.</p>
<p><b>Events:</b> Sprint (2–4 weeks) · Planning · Daily (15 min) · Review (demo) · Retrospective (improvement).</p>
<p><b>Artefacts:</b> Product Backlog · Sprint Backlog · Increment.</p>
<p><b>The difference asked about:</b> Review = what we produced (the product). Retrospective = how we worked (the process).</p>
<p><b>Testing:</b> unit · integration · functional · regression · load.</p>
<p><b>Patterns:</b> Singleton (single instance) · Factory (creation) · Observer (notification) · MVC (separation).</p>`,
m11l1:`<p><b>Monolith:</b> a single application. Advantages: simple to deploy at first. Drawbacks: selective scaling is hard, coupling, maintenance grows heavy with size.</p>
<p><b>Microservices:</b> small independent services, each with its own database and deployment. Advantages: targeted scaling, autonomous teams, fault isolation. Drawbacks: distributed complexity and observability, data consistency, network latency.</p>
<p><b>SOA:</b> reusable services behind a bus (ESB) — older and more centralised.</p>
<p><b>REST:</b> resources, HTTP verbs, stateless, JSON. <b>SOAP:</b> strict XML with WSDL — heavier.</p>
<p><b>In the exam:</b> always compare on three criteria: scaling, operational complexity, data consistency.</p>`,
m11l2:`<p><b>ITIL:</b> a framework for IT service management. Expected concepts:</p>
<ul><li><b>Incident</b> — a service outage or degradation: restore service fast.</li>
<li><b>Problem</b> — the root cause of repeated incidents: eliminate it.</li>
<li><b>Change</b> — a controlled modification with risk assessment.</li>
<li><b>Service Desk</b> — single point of contact.</li>
<li><b>SLA</b> — service level agreement.</li></ul>
<p><b>ERP:</b> a unified system for core business (accounting, stock, HR). <b>CRM:</b> customer relationship management. <b>EAI/ESB:</b> integrating existing systems.</p>
<p><b>Frequent question:</b> incident or problem? The incident is the symptom; the problem is the root cause.</p>`,
m12l1:`<ul><li><b>Principle of legality:</b> the administration is bound by law.</li>
<li><b>Administrative act:</b> a unilateral decision producing legal effects; it can be challenged for excess of power before the administrative court, and through damages claims.</li>
<li><b>Administrative contract:</b> exorbitant clauses (public service, public authority).</li>
<li><b>Public service:</b> an activity run by the administration for a general need; principles of continuity, equality and neutrality.</li>
<li><b>Administrative liability:</b> for fault, and for risk in specific cases.</li>
<li><b>Decentralisation and deconcentration:</b> the first transfers decisions to elected local bodies, the second delegates within the State.</li></ul>
<p><b>What is expected:</b> a precise definition, an example, a legal principle. No padding.</p>`,
m12l2:`<p><b>Structure of a written answer:</b></p>
<ol><li><b>Introduction:</b> define the terms and frame the question (3–5 lines).</li><li><b>Body:</b> two or three ideas, one per paragraph — idea, explanation, example.</li><li><b>Conclusion:</b> synthesis and a position or recommendation.</li></ol>
<p><b>Rules:</b> short sentences · one technical term per idea · no filler · respect the requested length.</p>
<p><b>General culture:</b> for each big theme (digitalisation, artificial intelligence, data protection, e-government), keep three points: definition, benefit, challenge.</p>`
};

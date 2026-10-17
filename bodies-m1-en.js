Object.assign(window.BODIES.en, {
m1l1:`<h2>The context: what happens when you send a WhatsApp message?</h2>
<p>You type "hi" and press send. The message leaves your phone, crosses Wi-Fi, the router, your operator's network, fibre, until it reaches a friend in another city. Along that path everything is split into layers: each adds its own "envelope", like a letter inside an envelope inside another.</p>
<p><b>OSI</b> is not a technical invention, it is a <b>map of responsibilities</b>. Each layer knows only its job and hands the result up. In the exam, most questions start with "which layer?" — and the layer gives you the answer.</p>

<div class="dg">
<div class="cap">Diagram — the 7 OSI layers and the protocol you will meet in each</div>
<div class="l hot"><b>7. Application</b><span>HTTP · DNS · DHCP · SMTP · FTP</span><span class="p">the user</span></div>
<div class="l"><b>6. Presentation</b><span>encoding · TLS encryption · compression</span><span class="p">how to present it</span></div>
<div class="l"><b>5. Session</b><span>open and close the session</span><span class="p">who talks to whom</span></div>
<div class="l"><b>4. Transport</b><span>TCP · UDP · ports</span><span class="p">guaranteed delivery?</span></div>
<div class="l hot"><b>3. Network</b><span>IP · routing · router</span><span class="p">where to go</span></div>
<div class="l hot"><b>2. Data link</b><span>MAC · Ethernet · switch</span><span class="p">which port</span></div>
<div class="l"><b>1. Physical</b><span>cable · signal · fibre</span><span class="p">0 and 1</span></div>
</div>

<p><b>Encapsulation</b> is the key: the message goes down and each layer adds a header:</p>
<div class="dg"><div class="cap">Diagram — how the frame is built</div>
<div class="l"><b>Application</b><span>"hi"</span><span class="p">data</span></div>
<div class="l"><b>+ Transport</b><span>TCP header: source/destination ports, sequence number</span><span class="p">segment</span></div>
<div class="l"><b>+ Network</b><span>IP header: source and destination address</span><span class="p">packet</span></div>
<div class="l"><b>+ Data link</b><span>Ethernet header: source and destination MAC</span><span class="p">frame</span></div>
<div class="l"><b>+ Physical</b><span>electrical signal or light</span><span class="p">bits</span></div>
</div>

<p>On receipt the reverse happens exactly: each layer strips its header and passes the rest up. That is <b>decapsulation</b>.</p>
<p>The <b>TCP/IP</b> model groups everything into four layers: network access (1+2) · internet (3) · transport (4) · application (5+6+7). Know both and how to map one onto the other.</p>

<h2>Worked example: where does each protocol work?</h2>
<ul>
<li>Finding the MAC of a machine on the local network? <b>Data link (2)</b> — via ARP.</li>
<li>Choosing the route between two networks? <b>Network (3)</b> — IP and routing.</li>
<li>Guaranteeing a file arrives complete? <b>Transport (4)</b> — TCP.</li>
<li>Turning a site name into an address? <b>Application (7)</b> — DNS.</li>
</ul>

<div class="dg"><div class="cap">Memory hook</div>
<div class="l"><b>Top to bottom</b><span>All People Seem To Need Data Processing</span><span class="p">A P S T N D P</span></div>
<div class="l"><b>Bottom to top</b><span>Please Do Not Throw Sausage Pizza Away</span><span class="p">P D N T S P A</span></div>
</div>

<h2>Common mistakes</h2>
<ul>
<li>"IP is layer 4" — wrong: IP is layer 3, TCP/UDP are layer 4.</li>
<li>Confusing switch (layer 2, MAC) with router (layer 3, IP).</li>
<li>Thinking layers are separate devices: they are software responsibilities.</li>
</ul>
<div class="why"><b>Exam question:</b> which layer does ARP work at? — <b>Answer:</b> data link (2), because it maps an IP to a MAC.</div>`,
m1l2:`<h2>The context: why 255? why is /26 equal to 64?</h2>
<p>An IP address is four numbers, and each number fits in <b>8 bits</b>. Each bit is 0 or 1, but its weight changes: 128, 64, 32, 16, 8, 4, 2, 1. Add the weights of the bits set to 1 and you get the number.</p>
<p>That is where 255 comes from: 128+64+32+16+8+4+2+1, every bit set.</p>

<div class="dg">
<div class="cap">Diagram — 8 bits and their weights</div>
<div class="dbits">
<div><b>1</b><small>128</small></div><div><b>1</b><small>64</small></div><div><b>0</b><small>32</small></div><div><b>0</b><small>16</small></div>
<div><b>1</b><small>8</small></div><div><b>0</b><small>4</small></div><div><b>0</b><small>2</small></div><div><b>0</b><small>1</small></div>
</div>
<div class="cap">This example = 128+64+8 = <b>200</b> → 11001000</div>
</div>

<p><b>Decimal to binary:</b> take the largest weight that fits, subtract, repeat. 200: 200−128=72, 72−64=8, 8−8=0 → bits 128, 64, 8 = 11001000.</p>
<p><b>Binary to decimal:</b> add the weights where the bit is 1. 10101000 = 128+32+8 = 168.</p>

<h2>The mask: how a network is divided</h2>
<p>The mask says: these bits are the "network", the rest are "hosts". /24 means 24 network bits and 8 host bits; /26 means 26 network bits and 6 host bits.</p>
<div class="dg">
<div class="cap">Diagram — /26 = 26 network bits + 6 host bits</div>
<div class="dbits">
<div><b>1</b><small>128</small></div><div><b>1</b><small>64</small></div><div><b>1</b><small>32</small></div><div><b>1</b><small>16</small></div>
<div><b>1</b><small>8</small></div><div><b>1</b><small>4</small></div><div><b>1</b><small>2</small></div><div><b>1</b><small>1</small></div>
</div>
<div class="cap">192 = 128+64 → mask /26 = 255.255.255.192</div>
</div>
<p><b>Addresses = 2^(32 − mask).</b> /26 → 2^6 = 64 addresses. Minus 2 (network and broadcast) = <b>62 hosts</b>.</p>

<div class="dg"><div class="cap">Table to know by heart</div>
<div class="l"><b>/24</b><span>255.255.255.0</span><span class="p">256 addresses · 254 hosts</span></div>
<div class="l"><b>/25</b><span>255.255.255.128</span><span class="p">128 · 126</span></div>
<div class="l hot"><b>/26</b><span>255.255.255.192</span><span class="p">64 · 62</span></div>
<div class="l"><b>/27</b><span>255.255.255.224</span><span class="p">32 · 30</span></div>
<div class="l"><b>/28</b><span>255.255.255.240</span><span class="p">16 · 14</span></div>
<div class="l"><b>/29</b><span>255.255.255.248</span><span class="p">8 · 6</span></div>
<div class="l"><b>/30</b><span>255.255.255.252</span><span class="p">4 · 2</span></div>
</div>

<h2>Worked example</h2>
<p>Convert 26 to binary: 26−16=10, 10−8=2, 2−2=0 → 00011010.</p>
<p>What is the /27 mask? 32−27 = 5 host bits → 2^5 = 32 addresses, so the last octet = 256−32 = <b>224</b> → 255.255.255.224.</p>

<div class="dg"><div class="cap">Memory hooks</div>
<div class="l"><b>Addition</b><span>128 64 32 16 8 4 2 1</span><span class="p">always</span></div>
<div class="l"><b>256 minus mask</b><span>/n → addresses = 2^(32−n)</span><span class="p">no long maths</span></div>
</div>

<h2>Common mistakes</h2>
<ul>
<li>Thinking /26 means 26 hosts. It means 62 hosts.</li>
<li>Forgetting to subtract 2 (network and broadcast).</li>
<li>Confusing the mask with a host count.</li>
</ul>
<div class="why"><b>Exam question:</b> how many hosts in a /28? — <b>Answer:</b> 16 − 2 = <b>14</b>.</div>`,
m1l3:`<h2>The context: one company, one network, four departments</h2>
<p>You have 192.168.1.0/24 and four departments: management, technical, sales, guests. You want each isolated. Solution: split the /24 into four /26 subnets.</p>
<p>How do you know? <b>Block size = 256 − mask value in the last octet.</b> /26 → 256 − 192 = <b>64</b>.</p>

<div class="dg">
<div class="cap">Diagram — one /24 split into four /26</div>
<div class="dgb">
<span>.0<small>network</small></span><span>.64<small>network</small></span><span class="hot">.128<small>network</small></span><span>.192<small>network</small></span>
</div>
<div class="cap">Each block holds 64 addresses: the first is the network, the last is broadcast. 62 hosts remain.</div>
</div>

<h2>The method in five steps</h2>
<ol>
<li>Work out the mask and block size.</li>
<li>Write the starts: 0, 64, 128, 192.</li>
<li>Find the block containing the address: largest start ≤ address.</li>
<li>Network = that start; broadcast = start + size − 1.</li>
<li>Hosts sit between them.</li>
</ol>

<h2>Worked example 1</h2>
<p>Address: <b>192.168.10.130/26</b></p>
<ul>
<li>Size 64 → networks .0, .64, .128, .192.</li>
<li>130 sits between 128 and 191.</li>
<li><b>Network: 192.168.10.128</b></li>
<li><b>Broadcast: 192.168.10.191</b> (128+64−1)</li>
<li><b>Hosts: .129 → .190</b> (62 hosts)</li>
</ul>

<h2>Worked example 2</h2>
<p>Address: <b>172.16.8.200/27</b> → mask 224 → blocks of 32 → .0 .32 .64 .96 .128 .160 .192 .224.</p>
<p>200 is between 192 and 223 → <b>network 172.16.8.192</b>, <b>broadcast 172.16.8.223</b>, hosts .193 → .222.</p>

<h2>Example 3: mask shorter than /24</h2>
<p>10.0.0.0/23: the change happens in the third octet. Blocks of 2 → 10.0, 10.2, 10.4…</p>

<div class="dg"><div class="cap">Memory hooks</div>
<div class="l"><b>256 − mask</b><span>the block size, every time</span><span class="p">64 for /26</span></div>
<div class="l"><b>Count in blocks</b><span>0 · 64 · 128 · 192</span><span class="p">no binary</span></div>
<div class="l"><b>−1 for broadcast</b><span>broadcast = start + size − 1</span><span class="p">classic error</span></div>
</div>

<h2>Common mistakes</h2>
<ul>
<li>Forgetting the first address is the network, not a host.</li>
<li>Computing broadcast as "start + size" instead of "−1".</li>
<li>Confusing network address with the gateway (usually the first usable).</li>
</ul>
<div class="why"><b>Exam question:</b> 10.0.0.130/25 — network and broadcast? — <b>Answer:</b> block 128 → 130 is in .128 → network 10.0.0.128, broadcast 10.0.0.255.</div>`,
m1l4:`<h2>The context: how does a packet find its way?</h2>
<p>Think of a post office: every envelope carries a destination. The clerk does not know every town, but has a table: "if the destination is in this range, send it to that hub". The router is the clerk; the table is the <b>routing table</b>.</p>

<div class="dg">
<div class="cap">Diagram — a packet's path to the internet</div>
<div class="l"><b>PC</b><span>192.168.1.10 · gateway 192.168.1.1</span><span class="p">outside my network?</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>Router</b><span>table: 0.0.0.0/0 → 41.x.x.x (ISP)</span><span class="p">picks the route</span></div>
<div class="arr">↓</div>
<div class="l"><b>ISP</b><span>BGP: other operators' networks</span><span class="p">inter-operator routing</span></div>
<div class="arr">↓</div>
<div class="l"><b>Server</b><span>203.0.113.5</span><span class="p">destination</span></div>
</div>

<p><b>An entry has three parts:</b> destination network + mask · next hop or interface · metric.</p>
<p><b>Golden rule — longest prefix:</b> when several routes match, the <b>most specific</b> (largest mask) wins. Example: 10.0.0.0/8 via A and 10.1.0.0/16 via B. A packet to 10.1.2.3 leaves via <b>B</b>, because /16 is more specific than /8.</p>

<div class="dg"><div class="cap">Example — which route is chosen?</div>
<div class="l"><b>0.0.0.0/0</b><span>via 192.168.1.1</span><span class="p">default</span></div>
<div class="l"><b>10.0.0.0/8</b><span>via 10.0.0.1</span><span class="p">general</span></div>
<div class="l hot"><b>10.1.0.0/16</b><span>via 10.1.0.254</span><span class="p">most specific → wins</span></div>
<div class="cap">Destination 10.1.5.20 → sent to 10.1.0.254</div>
</div>

<p><b>Static vs dynamic:</b> static is written by hand (small networks, default route); dynamic is learned between routers: <b>OSPF</b> internally, <b>BGP</b> between operators.</p>
<p><b>What is the metric for?</b> When two routes lead to the same destination, the cheaper one wins. But <b>specificity comes first</b>, the metric only breaks ties.</p>

<div class="dg"><div class="cap">Memory hooks</div>
<div class="l"><b>Most specific wins</b><span>/28 before /24 before /8 before /0</span><span class="p">longest prefix</span></div>
<div class="l"><b>0.0.0.0/0</b><span>"if I don't know, send it to the door"</span><span class="p">default route</span></div>
</div>

<h2>Common mistakes</h2>
<ul>
<li>Choosing by metric before applying the longest prefix rule.</li>
<li>Thinking 0.0.0.0/0 only applies to local networks.</li>
<li>Forgetting the router needs a reachable next hop, not just a network.</li>
</ul>
<div class="why"><b>Exam question:</b> 172.16.0.0/16 via A and 172.16.5.0/24 via B. Where does 172.16.5.10 go? — <b>Answer:</b> via B, because /24 is longer than /16.</div>`,
m1l5:`<h2>The context: a café with Wi-Fi and 50 phones</h2>
<p>You open a café and 50 customers arrive. Every phone needs an IP, a gateway and a DNS server. You will not type them by hand: that is <b>DHCP</b>, handing out addresses for a limited time (the lease).</p>

<div class="dg">
<div class="cap">Diagram — DORA, four messages</div>
<div class="l hot"><b>1. Discover</b><span>client: "is there a DHCP server?" (broadcast)</span><span class="p">UDP 67/68</span></div>
<div class="arr">↓</div>
<div class="l"><b>2. Offer</b><span>server: "take 192.168.1.23"</span><span class="p">proposal</span></div>
<div class="arr">↓</div>
<div class="l"><b>3. Request</b><span>client: "agreed, I want that address"</span><span class="p">request</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>4. Ack</b><span>server: "confirmed + mask + gateway + DNS + duration"</span><span class="p">lease</span></div>
</div>

<p><b>Why four messages?</b> Because there may be several DHCP servers. Discover reaches all, offers come back, the client picks one and asks for it, the server confirms. That is the real reason.</p>

<h2>DNS: the internet's phone book</h2>
<p>The machine does not understand "google.com", only numbers. DNS translates the name into an IP. If DNS fails, the internet looks broken even though the connection works: nothing translates names any more.</p>

<div class="dg">
<div class="cap">Diagram — the path of a google.com lookup</div>
<div class="l"><b>1. Cache</b><span>browser / OS / router</span><span class="p">fastest answer</span></div>
<div class="arr">↓ (miss)</div>
<div class="l"><b>2. ISP resolver</b><span>the operator's DNS</span><span class="p">asks on your behalf</span></div>
<div class="arr">↓</div>
<div class="l"><b>3. Root → .com</b><span>"ask the .com server"</span><span class="p">referral</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>4. Authoritative server</b><span>returns A = 142.250.x.x</span><span class="p">final answer</span></div>
</div>

<p><b>Records you will be asked about:</b> A (name→IPv4) · AAAA (name→IPv6) · CNAME (alias) · MX (mail) · TXT (text and verification) · NS (name servers) · PTR (reverse).</p>
<p><b>TTL</b> is how long the answer stays cached. Short TTL = fast changes but more queries.</p>

<div class="dg"><div class="cap">Memory hooks</div>
<div class="l"><b>DORA</b><span>Discover · Offer · Request · Ack</span><span class="p">4 steps</span></div>
<div class="l"><b>DNS = phone book</b><span>no number, no call</span><span class="p">analogy</span></div>
<div class="l"><b>A / MX / CNAME</b><span>address / mail / alias</span><span class="p">most asked</span></div>
</div>

<h2>Common mistakes</h2>
<ul>
<li>Thinking DNS only uses TCP — UDP/53 is the default.</li>
<li>Confusing MX (mail) with A (address).</li>
<li>Thinking DHCP only gives an IP — it also gives gateway and DNS.</li>
</ul>
<div class="why"><b>Exam question:</b> what is the DHCP message order? — <b>Answer:</b> Discover → Offer → Request → Ack.</div>`,
m1l6:`<h2>The context: an open-plan office with 40 people</h2>
<p>Everyone is plugged into the same switch. Problem: every broadcast goes to everyone, and the network slows down. Solution: split the switch into logical units — <b>VLANs</b>. Each VLAN is an isolated network, even if the machines share the same switch.</p>

<div class="dg">
<div class="cap">Diagram — one switch, two VLANs</div>
<div class="l hot"><b>VLAN 10</b><span>Management: 192.168.10.0/24</span><span class="p">access ports 1-8</span></div>
<div class="l hot"><b>VLAN 20</b><span>Guests: 192.168.20.0/24</span><span class="p">access ports 9-16</span></div>
<div class="arr">↓ trunk 802.1Q</div>
<div class="l"><b>Switch 2</b><span>carries VLAN 10 and 20 with tags</span><span class="p">trunk</span></div>
</div>

<p><b>How does a switch work?</b> It learns MAC addresses: "this MAC is on port 5". When a frame arrives it looks at the destination MAC and sends it only to the right port. If unknown, it floods (<b>flooding</b>).</p>
<p><b>Access port:</b> connected to an end device, one VLAN. <b>Trunk port:</b> link between switches, carries several VLANs, every frame tagged with 802.1Q.</p>

<h2>Why is inter-VLAN routing needed?</h2>
<p>VLAN 10 and VLAN 20 are two different IP networks. Their machines do not talk directly, even on the same switch. You need a <b>router</b> or a <b>layer-3 switch</b> (SVI). This is a very common exam question.</p>

<div class="dg"><div class="cap">Example — do they communicate?</div>
<div class="l"><b>PC-A</b><span>192.168.10.5 /24 · VLAN 10</span><span class="p">—</span></div>
<div class="l"><b>PC-B</b><span>192.168.20.5 /24 · VLAN 20</span><span class="p">—</span></div>
<div class="l hot"><b>Answer</b><span>no, without a router or L3</span><span class="p">two distinct networks</span></div>
</div>

<div class="dg"><div class="cap">Memory hooks</div>
<div class="l"><b>VLAN = room</b><span>each room has its door (gateway)</span><span class="p">isolation</span></div>
<div class="l"><b>Trunk = corridor</b><span>everyone passes, tagged</span><span class="p">802.1Q</span></div>
<div class="l"><b>Access = one door</b><span>one device, one VLAN</span><span class="p">untagged</span></div>
</div>

<h2>Common mistakes</h2>
<ul>
<li>Thinking a VLAN needs separate switches — one switch is enough.</li>
<li>Forgetting that talking between VLANs requires routing.</li>
<li>Mixing up trunk and access in configuration.</li>
</ul>
<div class="why"><b>Exam question:</b> two machines on the same switch but in different VLANs — do they communicate? — <b>Answer:</b> no, except through a router or a layer-3 switch.</div>`
});

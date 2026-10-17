window.BODIES = window.BODIES || {};
window.BODIES.ar = window.BODIES.ar || {};
Object.assign(window.BODIES.ar, {
m1l1:`<h2>السياق: ماذا يحدث لما تصيفط رسالة فـ WhatsApp؟</h2>
<p>كتكتب «سلام» وكتضغط إرسال. الرسالة كتخرج من تليفونك، كتدوز على Wi-Fi، على الراوتر (routeur)، على شبكة المشغّل، على الألياف البصرية، حتى توصل لصاحبك فمدينة أخرى. فهاد الطريق كل حاجة مقسّمة لطبقات: كل طبقة كتزيد «غلاف» ديالها، بحال ملي كتحط ظرف داخل ظرف.</p>
<p><b>OSI</b> ماشي اختراع تقني، هو <b>خريطة مسؤوليات</b>: كل طبقة كتعرف غير الخدمة ديالها وكتعطيها للي فوقها. وفالمباراة، 80% من الأسئلة كتبدا بـ«فين كاين هاد الشي؟» — يعني فأي طبقة.</p>

<div class="dg">
<div class="cap">الرسم — 7 طبقات OSI، ومعاها أشهر بروتوكول فكل طبقة</div>
<div class="l hot"><b>7. Application</b><span>HTTP · DNS · DHCP · SMTP · FTP</span><span class="p">المستعمل</span></div>
<div class="l"><b>6. Présentation</b><span>الترميز · التشفير TLS · الضغط</span><span class="p">كيفاش نعرضو</span></div>
<div class="l"><b>5. Session</b><span>فتح وإغلاق الجلسة</span><span class="p">شكون كيهدر مع شكون</span></div>
<div class="l"><b>4. Transport</b><span>TCP · UDP · المنافذ (ports)</span><span class="p">التوصيل المضمون؟</span></div>
<div class="l hot"><b>3. Réseau</b><span>IP · التوجيه · routeur</span><span class="p">وين كتمشي؟</span></div>
<div class="l hot"><b>2. Liaison</b><span>MAC · Ethernet · commutateur</span><span class="p">للمنفذ الصحيح</span></div>
<div class="l"><b>1. Physique</b><span>الكابل · الإشارة · الألياف</span><span class="p">0 و 1</span></div>
</div>

<p><b>التغليف (encapsulation)</b> هو المفتاح: الرسالة كتنزل من فوق لتحت، وكل طبقة كتزيد رأس (header) ديالها:</p>
<div class="dg"><div class="cap">الرسم — كيفاش كتبنى الحزمة</div>
<div class="l"><b>Application</b><span>«سلام»</span><span class="p">data</span></div>
<div class="l"><b>+ Transport</b><span>رأس TCP: منفذ المصدر والهدف + رقم التسلسل</span><span class="p">segment</span></div>
<div class="l"><b>+ Réseau</b><span>رأس IP: عنوان المصدر والهدف</span><span class="p">paquet</span></div>
<div class="l"><b>+ Liaison</b><span>رأس Ethernet: MAC المصدر والهدف</span><span class="p">trame</span></div>
<div class="l"><b>+ Physique</b><span>إشارة كهربائية أو ضوء</span><span class="p">bits</span></div>
</div>

<p><b>في الاستقبال</b> كيوقع العكس بالضبط: كل طبقة كتحيّد الغلاف ديالها وتسلم لللي فوقها، حتى توصل الرسالة للتطبيق. هادشي هو <b>décapsulation</b>.</p>
<p><b>نموذج TCP/IP</b> كيجمع الطبقات ف 4: accès réseau (1+2) · Internet (3) · transport (4) · application (5+6+7). فالمباراة كيتسأل بجوج، فخاصك تعرف التحويل بيناتهم.</p>

<h2>مثال محلول: أين يشتغل كل بروتوكول؟</h2>
<ul>
<li>كيقلب على MAC ديال جهاز فشبكة محلية؟ <b>Liaison (2)</b> — عبر ARP.</li>
<li>كيختار الطريق بين شبكتين؟ <b>Réseau (3)</b> — IP والتوجيه.</li>
<li>كيضمن أن الملف وصل كامل بلا نقصان؟ <b>Transport (4)</b> — TCP.</li>
<li>كيترجم اسم موقع لعنوان؟ <b>Application (7)</b> — DNS.</li>
</ul>

<div class="dg"><div class="cap">حيلة الحفظ</div>
<div class="l"><b>من فوق لتحت</b><span>«All People Seem To Need Data Processing»</span><span class="p">A P S T N D P</span></div>
<div class="l"><b>بالعربية</b><span>«تطبيق ← تقديم ← جلسة ← نقل ← شبكة ← ربط ← فيزيائي»</span><span class="p">7 → 1</span></div>
</div>

<h2>أخطاء شائعة</h2>
<ul>
<li>«IP فطبقة 4» — غالط: IP فطبقة 3، وTCP/UDP فطبقة 4.</li>
<li>خلط بين commutateur (طبقة 2، كيخدم بـ MAC) وrouteur (طبقة 3، كيخدم بـ IP).</li>
<li>الاعتقاد أن الطبقات «أجهزة»: هي مسؤوليات برمجية، ماشي بالضرورة أجهزة منفصلة.</li>
</ul>

<div class="why"><b>سؤال مباراة:</b> في أي طبقة يعمل بروتوكول ARP؟ — <b>الجواب:</b> طبقة الربط (2)، حيت كيربط عنوان IP بعنوان MAC.</div>`,
m1l2:`<h2>السياق: علاش 255؟ وعلاش /26 كتعني 64؟</h2>
<p>كل عنوان IP هو 4 أرقام، وكل رقم كيتخزن ف <b>8 بتات</b>. كل بت إما 0 أو 1، ولكن الوزن ديالو كيتبدل: 128، 64، 32، 16، 8، 4، 2، 1. ملي كتجمع الأوزان ديال البتات اللي فيها 1، كتحصل على الرقم.</p>
<p>هادشي هو السبب فـ255: هي 128+64+32+16+8+4+2+1 = كل البتات مشعّلة.</p>

<div class="dg">
<div class="cap">الرسم — 8 بتات وأوزانها</div>
<div class="dbits">
<div><b>1</b><small>128</small></div><div><b>1</b><small>64</small></div><div><b>0</b><small>32</small></div><div><b>0</b><small>16</small></div>
<div><b>1</b><small>8</small></div><div><b>0</b><small>4</small></div><div><b>0</b><small>2</small></div><div><b>0</b><small>1</small></div>
</div>
<div class="cap">هاد المثال = 128+64+8 = <b>200</b> → أي 11001000</div>
</div>

<p><b>من عشري لثنائي:</b> خد الرقم وطرح منو أكبر وزن ممكن، وعاود. مثلاً 200: 200−128=72، 72−64=8، 8−8=0 → البتات 128 و64 و8 = 11001000.</p>
<p><b>من ثنائي لعشري:</b> جمع الأوزان اللي فوقها 1. مثلاً 10101000 = 128+32+8 = 168.</p>

<h2>القناع (masque): كيفاش كنقسمو الشبكة</h2>
<p>القناع كيقول: هاد البتات هي «الشبكة»، والباقي «الأجهزة». /24 كتعني 24 بت للشبكة و8 للأجهزة؛ /26 كتعني 26 للشبكة و6 للأجهزة.</p>
<div class="dg">
<div class="cap">الرسم — /26 = 26 بت شبكة + 6 بت أجهزة</div>
<div class="dbits">
<div><b>1</b><small>128</small></div><div><b>1</b><small>64</small></div><div><b>1</b><small>32</small></div><div><b>1</b><small>16</small></div>
<div><b>1</b><small>8</small></div><div><b>1</b><small>4</small></div><div><b>1</b><small>2</small></div><div><b>1</b><small>1</small></div>
</div>
<div class="cap">192 = 128+64 → القناع /26 = 255.255.255.192</div>
</div>
<p><b>عدد العناوين = 2^(32 − القناع).</b> /26 → 2^6 = 64 عنواناً. ناقص 2 (الشبكة والبث) = <b>62 جهازاً</b>.</p>

<div class="dg"><div class="cap">جدول تحفظو عن ظهر قلب</div>
<div class="l"><b>/24</b><span>255.255.255.0</span><span class="p">256 عنوان · 254 جهاز</span></div>
<div class="l"><b>/25</b><span>255.255.255.128</span><span class="p">128 · 126</span></div>
<div class="l hot"><b>/26</b><span>255.255.255.192</span><span class="p">64 · 62</span></div>
<div class="l"><b>/27</b><span>255.255.255.224</span><span class="p">32 · 30</span></div>
<div class="l"><b>/28</b><span>255.255.255.240</span><span class="p">16 · 14</span></div>
<div class="l"><b>/29</b><span>255.255.255.248</span><span class="p">8 · 6</span></div>
<div class="l"><b>/30</b><span>255.255.255.252</span><span class="p">4 · 2</span></div>
</div>

<h2>مثال محلول</h2>
<p>حوّل 26 لثنائي: 26−16=10، 10−8=2، 2−2=0 → 00011010.</p>
<p>ما هو قناع /27؟ 32−27=5 بت للأجهزة → 2^5=32 عنواناً، والقيمة فـoctet الأخير = 256−32 = <b>224</b> → 255.255.255.224.</p>

<div class="dg"><div class="cap">حيلة الحفظ</div>
<div class="l"><b>الجمع</b><span>128 64 32 16 8 4 2 1</span><span class="p">دايماً</span></div>
<div class="l"><b>الطرح من 256</b><span>قناع /n → عناوين = 2^(32−n)</span><span class="p">بلا حسابات طويلة</span></div>
</div>

<h2>أخطاء شائعة</h2>
<ul>
<li>الاعتقاد أن /26 = 26 جهازاً. لا: /26 = 62 جهازاً.</li>
<li>نسيان طرح 2 (عنوان الشبكة وعنوان البث).</li>
<li>حساب القناع كـ«عدد الأجهزة» بدل «عدد بتات الشبكة».</li>
</ul>
<div class="why"><b>سؤال مباراة:</b> كم جهازاً في /28؟ — <b>الجواب:</b> 16 عنواناً − 2 = <b>14</b>.</div>`,
m1l3:`<h2>السياق: شركة عندها شبكة واحدة و4 أقسام</h2>
<p>عندك 192.168.1.0/24، وعندك 4 أقسام: الإدارة، التقني، التجاري، الضيوف. بغيتي كل قسم يكون معزول. الحل: تقسم /24 لأربع شبكات فرعية (sous-réseaux) بـ/26.</p>
<p>كيفاش كنعرفو؟ <b>حجم البلوك = 256 − قيمة القناع فالoctet الأخير.</b> /26 → 256 − 192 = <b>64</b>.</p>

<div class="dg">
<div class="cap">الرسم — /24 مقسّمة لأربع شبكات /26</div>
<div class="dgb">
<span>.0<small>network</small></span><span>.64<small>network</small></span><span class="hot">.128<small>network</small></span><span>.192<small>network</small></span>
</div>
<div class="cap">كل بلوك فيه 64 عنواناً: أول واحد = الشبكة، وآخر واحد = البث. الباقي 62 جهازاً.</div>
</div>

<h2>الطريقة ف 5 خطوات</h2>
<ol>
<li>حسب القناع وحجم البلوك.</li>
<li>كتب بدايات الشبكات: 0، 64، 128، 192.</li>
<li>شوف فأي بلوك كاين العنوان: أكبر بداية أصغر من العنوان.</li>
<li>الشبكة = هاد البداية. البث = البداية + الحجم − 1.</li>
<li>الأجهزة = ما بين الشبكة والبث.</li>
</ol>

<h2>مثال محلول 1</h2>
<p>العنوان: <b>192.168.10.130/26</b></p>
<ul>
<li>الحجم 64 → الشبكات: .0، .64، .128، .192.</li>
<li>130 كاين بين 128 و191.</li>
<li><b>الشبكة: 192.168.10.128</b></li>
<li><b>البث: 192.168.10.191</b> (128+64−1)</li>
<li><b>الأجهزة: .129 → .190</b> (62 جهازاً)</li>
</ul>

<h2>مثال محلول 2</h2>
<p>العنوان: <b>172.16.8.200/27</b> → القناع 224 → الحجم 32 → الشبكات: .0 .32 .64 .96 .128 .160 .192 .224.</p>
<p>200 كاين بين 192 و223 → <b>الشبكة 172.16.8.192</b>، <b>البث 172.16.8.223</b>، الأجهزة .193 → .222.</p>

<h2>مثال 3: قناع أقل من /24</h2>
<p>10.0.0.0/23: التغيير كيوقع فالثالث octet. الحجم = 2 → الشبكات: 10.0، 10.2، 10.4…</p>

<div class="dg"><div class="cap">حيلة الحفظ</div>
<div class="l"><b>256 − القناع</b><span>هي حجم البلوك، دايماً</span><span class="p">64 لـ/26</span></div>
<div class="l"><b>عدّ بالبلوك</b><span>0 · 64 · 128 · 192</span><span class="p">بلا ما تحسب بالثنائي</span></div>
<div class="l"><b>−1 للبث</b><span>البث = البداية + الحجم − 1</span><span class="p">خطأ شائع</span></div>
</div>

<h2>أخطاء شائعة</h2>
<ul>
<li>نسيان أن أول عنوان هو الشبكة، وماشي جهاز.</li>
<li>حساب البث كـ«البداية + الحجم» بدل «−1».</li>
<li>الخلط بين عنوان الشبكة وعنوان البوابة (البوابة عادة أول عنوان قابل للاستعمال).</li>
</ul>
<div class="why"><b>سؤال مباراة:</b> 10.0.0.130/25 — ما هي الشبكة والبث؟ — <b>الجواب:</b> الحجم 128 → 130 فبلوك .128 → الشبكة 10.0.0.128، البث 10.0.0.255.</div>`,
m1l4:`<h2>السياق: كيفاش كتعرف الحزمة طريقها؟</h2>
<p>تصور مكتب بريد: كل ظرف عليه عنوان الوجهة. الموظف ما كيعرفش المدينة كلها، ولكن عندو جدول: «إذا كانت الوجهة فهاد النطاق، صيفطها لهاد المركز». الراوتر (routeur) هو هاد الموظف، والجدول هو <b>table de routage</b>.</p>

<div class="dg">
<div class="cap">الرسم — مسار الحزمة من جهازك للإنترنت</div>
<div class="l"><b>PC</b><span>192.168.1.10 · gateway 192.168.1.1</span><span class="p">يحسب: الوجهة برا شبكتي؟</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>Routeur</b><span>table: 0.0.0.0/0 → 41.x.x.x (FAI)</span><span class="p">يختار المسار</span></div>
<div class="arr">↓</div>
<div class="l"><b>FAI</b><span>BGP: شبكات أخرى</span><span class="p">توجيه بين المشغّلين</span></div>
<div class="arr">↓</div>
<div class="l"><b>Serveur</b><span>203.0.113.5</span><span class="p">الوجهة</span></div>
</div>

<p><b>الجدول فيه 3 أعمدة:</b> الشبكة الهدف + القناع · البوابة التالية (next hop) أو الواجهة · المقياس (metric).</p>
<p><b>قاعدة ذهبية — plus long préfixe:</b> إذا طابقو عدة مسارات، كتفوز <b>الأكثر تحديداً</b> (القناع الأكبر). مثلاً عندك 10.0.0.0/8 → via A، و10.1.0.0/16 → via B. الحزمة لـ10.1.2.3 كتمشي عبر <b>B</b>، حيت /16 أدق من /8.</p>

<div class="dg"><div class="cap">مثال — أي مسار تختار؟</div>
<div class="l"><b>0.0.0.0/0</b><span>via 192.168.1.1</span><span class="p">افتراضي</span></div>
<div class="l"><b>10.0.0.0/8</b><span>via 10.0.0.1</span><span class="p">عام</span></div>
<div class="l hot"><b>10.1.0.0/16</b><span>via 10.1.0.254</span><span class="p">الأدق → يفوز</span></div>
<div class="cap">الوجهة 10.1.5.20 → تُرسل إلى 10.1.0.254</div>
</div>

<p><b>static vs dynamic:</b> static كتكتبها بيدك (شبكات صغيرة، أو route افتراضي). dynamic كتتعلمها الراوترات من بعضها: <b>OSPF</b> داخل المؤسسة، <b>BGP</b> بين المشغّلين.</p>
<p><b>لماذا metric؟</b> ملي عندك جوج طرق لنفس الوجهة، كتختار الأقل تكلفة (عدد القفزات، سرعة الرابط...). ولكن <b>قاعدة الدقة أولا</b>، من بعد metric.</p>

<div class="dg"><div class="cap">حيلة الحفظ</div>
<div class="l"><b>الأدق يفوز</b><span>/28 قبل /24 قبل /8 قبل /0</span><span class="p">plus long préfixe</span></div>
<div class="l"><b>0.0.0.0/0</b><span>«إذا ما عرفتش، صيفطو للباب»</span><span class="p">route par défaut</span></div>
</div>

<h2>أخطاء شائعة</h2>
<ul>
<li>اختيار المسار بـmetric قبل ما تطبق قاعدة الدقة.</li>
<li>الاعتقاد أن 0.0.0.0/0 خاصة بالشبكات المحلية.</li>
<li>نسيان أن الراوتر يحتاج معرفة البوابة التالية، ماشي غير الشبكة.</li>
</ul>
<div class="why"><b>سؤال مباراة:</b> عندك 172.16.0.0/16 via A و172.16.5.0/24 via B. إلى أين تُرسل الحزمة 172.16.5.10؟ — <b>الجواب:</b> عبر B، لأن /24 أطول من /16.</div>`,
m1l5:`<h2>السياق: قهوة فيها Wi-Fi و50 تليفون</h2>
<p>حلّيت قهوة، وجا 50 زبون. كل تليفون خاصو عنوان IP، بوابة، وDNS. واش غادي تدخل لكل واحد بيدك؟ طبعاً لا. هادشي كيديرو <b>DHCP</b>: خادم كيوزع العناوين أوتوماتيكياً لمدة محددة (bail).</p>

<div class="dg">
<div class="cap">الرسم — DORA: أربع رسائل وخلاص</div>
<div class="l hot"><b>1. Discover</b><span>الجهاز: «واش كاين شي خادم DHCP؟» (بث)</span><span class="p">UDP 67/68</span></div>
<div class="arr">↓</div>
<div class="l"><b>2. Offer</b><span>الخادم: «خد هاد العنوان 192.168.1.23»</span><span class="p">اقتراح</span></div>
<div class="arr">↓</div>
<div class="l"><b>3. Request</b><span>الجهاز: «موافق، بغيت هاد العنوان»</span><span class="p">تأكيد الطلب</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>4. Ack</b><span>الخادم: «مزيان + القناع + البوابة + DNS + المدة»</span><span class="p">bail</span></div>
</div>

<p><b>علاش 4 رسائل؟</b> حيت ممكن يكون كاين أكثر من خادم DHCP. Discover كيمشي للجميع، والعرض كيجي من واحد أو أكثر، والجهاز كيختار واحد ويطلب، والخادم كيأكد. هذا هو السبب الحقيقي، ماشي «حيت هكذا». </p>

<h2>DNS: دفتر الهاتف ديال الإنترنت</h2>
<p>الجهاز ما كيفهمش «google.com»، كيفهم غير الأرقام. DNS كيترجم الاسم لعنوان IP. إلى كان DNS طايح، الإنترنت كيبان «مقطوع» حتى إلا كان الاتصال خدام — حيت ما كاينش شكون يترجم الأسماء.</p>

<div class="dg">
<div class="cap">الرسم — مسار طلب google.com</div>
<div class="l"><b>1. Cache</b><span>فالمتصفح / النظام / الراوتر</span><span class="p">أسرع جواب</span></div>
<div class="arr">↓ (ماكاينش)</div>
<div class="l"><b>2. Résolveur FAI</b><span>خادم DNS ديال المشغّل</span><span class="p">كيسأل بالنيابة</span></div>
<div class="arr">↓</div>
<div class="l"><b>3. Racine → .com</b><span>«سير سول خادم .com»</span><span class="p">توجيه</span></div>
<div class="arr">↓</div>
<div class="l hot"><b>4. Serveur du domaine</b><span>يعطي A = 142.250.x.x</span><span class="p">الجواب النهائي</span></div>
</div>

<p><b>السجلات (records) اللي كيتسألو:</b> A (اسم→IPv4) · AAAA (اسم→IPv6) · CNAME (اسم مستعار) · MX (خادم البريد) · TXT (نصوص وتحقق) · NS (خوادم الأسماء) · PTR (عكسي).</p>
<p><b>TTL</b> هو مدة بقاء الجواب فالكاش. TTL صغير = تغييرات سريعة، ولكن طلبات أكثر.</p>

<div class="dg"><div class="cap">حيلة الحفظ</div>
<div class="l"><b>DORA</b><span>Discover · Offer · Request · Ack</span><span class="p">4 خطوات</span></div>
<div class="l"><b>DNS = الهاتف</b><span>ما كتعرفش الرقم؟ ما كتوصلش</span><span class="p">تشبيه</span></div>
<div class="l"><b>A / MX / CNAME</b><span>عنوان / بريد / اسم آخر</span><span class="p">الأكثر سؤالاً</span></div>
</div>

<h2>أخطاء شائعة</h2>
<ul>
<li>الاعتقاد أن DNS كيخدم بـTCP فقط — الأصل UDP/53.</li>
<li>الخلط بين MX (البريد) وA (العنوان).</li>
<li>الاعتقاد أن DHCP كيعطي غير IP — كيعطي حتى البوابة وDNS.</li>
</ul>
<div class="why"><b>سؤال مباراة:</b> ما ترتيب رسائل DHCP؟ — <b>الجواب:</b> Discover → Offer → Request → Ack.</div>`,
m1l6:`<h2>السياق: مكتب مفتوح فيه 40 موظف</h2>
<p>كل الموظفين مربوطين بنفس السويتش. مشكل: كل بث (broadcast) كيمشي للجميع، والشبكة كتتقل. والحل: نقسمو السويتش لوحدات منطقية — <b>VLAN</b>. كل VLAN = شبكة معزولة، حتى إلا كانو الأجهزة على نفس السويتش.</p>

<div class="dg">
<div class="cap">الرسم — سويتش واحد، جوج VLAN</div>
<div class="l hot"><b>VLAN 10</b><span>الإدارة: 192.168.10.0/24</span><span class="p">access ports 1-8</span></div>
<div class="l hot"><b>VLAN 20</b><span>الضيوف: 192.168.20.0/24</span><span class="p">access ports 9-16</span></div>
<div class="arr">↓ trunk 802.1Q</div>
<div class="l"><b>Switch 2</b><span>يحمل VLAN 10 و20 بوسم (tag)</span><span class="p">trunk</span></div>
</div>

<p><b>كيفاش كيخدم السويتش؟</b> كيتعلم عناوين MAC: «هاد الMAC كاين فالمنفذ 5». ملي تجيه trame، كيشوف الMAC الوجهة وكيصيفطها غير للمنفذ المناسب. إلى ما عرفش، كيبثّ للجميع (<b>inondation</b>).</p>
<p><b>Access port:</b> منفذ مربوط بجهاز نهائي، كينتمي لVLAN واحد. <b>Trunk port:</b> الرابط بين السويتشات، كيحمل عدة VLANات، وكل trame كتاخد وسم (tag) 802.1Q باش يعرف المستقبل لأي VLAN كتنتمي.</p>

<h2>علاش خاصنا التوجيه بين VLANات؟</h2>
<p>VLAN 10 وVLAN 20 هوما شبكتين IP مختلفين. الأجهزة فيهم ما كيتواصلوش مباشرة، حتى إلا كانو على نفس السويتش. خاصك <b>routeur</b> أو <b>سويتش طبقة 3</b> (SVI). هاد النقطة كتتسأل بزاف فالمباريات.</p>

<div class="dg"><div class="cap">مثال — هل يتواصلان؟</div>
<div class="l"><b>PC-A</b><span>192.168.10.5 /24 · VLAN 10</span><span class="p">—</span></div>
<div class="l"><b>PC-B</b><span>192.168.20.5 /24 · VLAN 20</span><span class="p">—</span></div>
<div class="l hot"><b>الجواب</b><span>لا، بلا راوتر أو L3</span><span class="p">شبكتان مختلفتان</span></div>
</div>

<div class="dg"><div class="cap">حيلة الحفظ</div>
<div class="l"><b>VLAN = غرفة</b><span>كل غرفة عندها باب (بوابة)</span><span class="p">عزل</span></div>
<div class="l"><b>Trunk = ممر</b><span>كيدوز منه الجميع بوسم</span><span class="p">802.1Q</span></div>
<div class="l"><b>Access = باب واحد</b><span>جهاز واحد، VLAN واحد</span><span class="p">بدون وسم</span></div>
</div>

<h2>أخطاء شائعة</h2>
<ul>
<li>الاعتقاد أن VLAN كتحتاج سويتشات منفصلة — لا، نفس السويتش كيديرها.</li>
<li>نسيان أن التواصل بين VLANات خاصو توجيه.</li>
<li>الخلط بين trunk وaccess فالإعداد.</li>
</ul>
<div class="why"><b>سؤال مباراة:</b> جهازان فنفس السويتش ولكن VLAN مختلف: هل يتواصلان؟ — <b>الجواب:</b> لا، إلا عبر راوتر أو سويتش طبقة 3.</div>`
});

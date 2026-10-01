/* Research snapshot only. No merchant scripts, tracking, or customer credentials. */
'use strict';

const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = (value) => { try { const url = new URL(value); return url.protocol === 'https:' ? escapeHtml(url.href) : '#'; } catch { return '#'; } };
const money = (value) => Number(value).toLocaleString('zh-CN', {minimumFractionDigits:0, maximumFractionDigits:2});
const familyLabel = (family) => ({'ChatGPT 200美元档_核条件':'ChatGPT 200美元档 · 需核条件','ChatGPT 旧Pro续费':'ChatGPT 旧 Pro 续费 · 需核条件','档位待确认':'商家档位待确认'}[family] || family);
let research;

const priceNotes = {
  'ChatGPT Plus':'AI卡商城的101元是14 USDT的店铺展示估算；老实人119元为USDT支付的人民币标价，同规格支付宝125元。',
  'ChatGPT Pro 5X':'不同充值渠道与覆盖条件分别保留。UID当日页面为680元；旧搜索索引570元未纳入此表。',
  'ChatGPT 200美元档_核条件':'商家使用10x、20x和200美元档等不同名称。新开、恢复与旧用户续费可能交付不同权益，不可仅按价格认作相同SKU。',
  'ChatGPT 旧Pro续费':'这些商品包含原订阅、账单地区、到期时间或恢复入口限制；请展开详情。名称为10x的续费不等于承诺保留旧20x权益。',
  'ChatGPT Plus 长周期':'显示季卡或年卡一次性总价。按月均排序只是算术比较；质保期未必覆盖整个订阅周期。',
  'ChatGPT Pro 25X':'救赎的3200元商品当日标为售罄。缺货报价保留用于比较，不能当作可立即购买。',
  'Claude Pro':'Claude360无质保与有质保分别报价。未核实获取条件的优惠后价未用于排序。',
  'Claude Max 5X':'贝贝880元商品当日缺货；Claude360950元商品无质保。不能仅凭价格判断可交付性。',
  'Claude Max 20X':'贝贝1850元商品当日缺货，已保留库存标记。',
  '档位待确认':'商家原名写“Plus 5x”，未确认是否实际交付Pro 100美元档，独立保留。'
};

function renderPrices() {
  if (!research) return;
  const family = $('family-filter').value;
  const search = $('price-search').value.trim().toLowerCase();
  const channel = $('channel-filter').value;
  const sort = $('sort-filter').value;
  const metric = (offer) => sort === 'monthly' ? offer.price / offer.months : offer.price;
  let rows = research.offers.filter((o) => o.family === family && (!channel || o.channel === channel) && (!$('exclude-estimates').checked || o.currency !== 'CNY展示估算') && (!search || [o.merchant,o.title,o.channel,o.condition].join(' ').toLowerCase().includes(search)));
  const rawCount = rows.length;
  if ($('lowest-only').checked) {
    const lowest = new Map();
    for (const o of rows) if (!lowest.has(o.site_id) || metric(o) < metric(lowest.get(o.site_id))) lowest.set(o.site_id,o);
    rows = [...lowest.values()];
  }
  rows.sort((a,b) => (sort === 'desc' ? metric(b)-metric(a) : metric(a)-metric(b)) || a.site_id-b.site_id);
  $('result-count').textContent = `${new Set(rows.map(o=>o.site_id)).size} 家商家 · ${rows.length} 条展示报价${$('lowest-only').checked ? `（筛选内共 ${rawCount} 条）` : ''}`;
  $('plan-note').textContent = priceNotes[family] || '';
  $('price-empty').hidden = rows.length > 0;
  $('price-rows').innerHTML = rows.map((o,i) => {
    const estimate = o.currency === 'CNY展示估算';
    const cycle = o.months === 1 ? '1个月' : `${o.months}个月`;
    const stock = o.stock.includes('售罄') || o.stock.includes('缺货') ? `<span class="badge">${escapeHtml(o.stock)}</span>` : '';
    return `<tr><td>${String(i+1).padStart(2,'0')}</td><td><span class="merchant-name">${escapeHtml(o.merchant)}</span><span class="product-name">${escapeHtml(o.title)}</span></td><td><div class="quote-value">${estimate ? '≈' : ''}¥${money(o.price)}</div><div class="quote-cycle">${cycle}${o.months>1 ? ` · 月均 ¥${money(o.price/o.months)}` : ''}</div>${estimate ? '<span class="badge">店铺人民币估算</span>' : ''}</td><td><span class="channel-tag">${escapeHtml(o.channel)}</span></td><td><details class="price-details"><summary>${stock || '查看账号与售后条件'}</summary><div class="detail-content"><p><b>账号：</b>${escapeHtml(o.condition)}</p><p><b>付款：</b>${escapeHtml(o.pay)}</p><p><b>库存：</b>${escapeHtml(o.stock)}</p><p><b>售后：</b>${escapeHtml(o.warranty)}</p>${o.notes ? `<p><b>备注：</b>${escapeHtml(o.notes)}</p>` : ''}<p>${escapeHtml(o.checked)} · ${escapeHtml(o.level)}</p></div></details></td><td><a class="source-link" href="${safeUrl(o.source)}" target="_blank" rel="noopener noreferrer">原页面 ↗</a></td></tr>`;
  }).join('');
  document.querySelectorAll('[data-family]').forEach(button => {
    const active = button.dataset.family === family;
    button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
  });
}

function updateChannels() {
  const selected = $('family-filter').value;
  const channels = [...new Set(research.offers.filter(o=>o.family===selected).map(o=>o.channel))];
  $('channel-filter').innerHTML = '<option value="">全部渠道</option>' + channels.map(ch=>`<option value="${escapeHtml(ch)}">${escapeHtml(ch)}</option>`).join('');
}

function renderAgency() {
  $('agency-cards').innerHTML = research.agency.map((a,i) => `<article class="agency-card"><div class="card-kicker"><span>${escapeHtml(a[0])}</span><span>${String(i+1).padStart(2,'0')}</span></div><h3>${escapeHtml(a[1])}</h3><p class="fee">${escapeHtml(a[2])}</p><p class="nature">${escapeHtml(a[3])}</p><details class="agency-details"><summary>加入步骤与结算规则</summary><div class="agency-detail-content"><p><b>收入口径：</b>${escapeHtml(a[4])}</p><ol>${a[5].split('→').map(step=>`<li>${escapeHtml(step.trim())}</li>`).join('')}</ol><p>${escapeHtml(a[6])}</p><p class="warning">${escapeHtml(a[7])}</p><a class="source-link" href="${safeUrl(a[8])}" target="_blank" rel="noopener noreferrer">核对合作规则 ↗</a><div class="evidence-tag">${escapeHtml(a[9])}</div></div></details></article>`).join('');
}

function renderGrowth() {
  $('growth-cards').innerHTML = research.growth.map(g=>`<article class="growth-card"><h3>${escapeHtml(g[0])}</h3><div class="growth-channel">${escapeHtml(g[1])}</div><p>${escapeHtml(g[2])}</p><div class="growth-flow"><p>${escapeHtml(g[4])}</p></div><details><summary>证据边界与判断</summary><p><b>自报／未核：</b>${escapeHtml(g[3])}</p><p><b>判断：</b>${escapeHtml(g[5])}</p><p>${escapeHtml(g[7])}</p></details><p><a class="source-link" href="${safeUrl(g[6])}" target="_blank" rel="noopener noreferrer">查看公开来源 ↗</a></p></article>`).join('');
}

const missingReasons = {
  13:'当前选中API商品，GPT分类具体价格未核',16:'页面仅gro分类，0件商品',18:'服务页可读，当前商品页未核',20:'混合入口9.99美元起，未核Plus具体价',22:'未读出当前价，未代用其他域名报价',27:'服务及教程可读，具体商品价未核',37:'资源页当日读取404',38:'服务分类可读，具体商品价未核',39:'当日原站未核，浏览器空白页',42:'未取得可靠当日报价'
};
function renderDirectory() {
  if (!research) return;
  const search = $('directory-search').value.trim().toLowerCase();
  const rows = Object.values(research.sites).filter(s=>!search || [s.name,s.url,s.x].join(' ').toLowerCase().includes(search));
  $('directory-count').textContent = `${rows.length} / 42 个入口`;
  $('directory-cards').innerHTML = rows.map(s=>{
    const count = research.offers.filter(o=>o.site_id===s.id).length;
    let domain;try { domain = new URL(s.url).hostname; } catch { domain=''; }
    return `<article class="directory-card"><h3>${escapeHtml(s.name)}<span>${String(s.id).padStart(2,'0')}</span></h3><div class="directory-domain">${escapeHtml(domain)}</div><div class="directory-status ${count ? '' : 'unverified'}">${count ? `已核 ${count} 条当日页面报价` : escapeHtml(missingReasons[s.id] || '未取得当日报价')}</div><div class="directory-actions"><a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">网站 ↗</a>${s.x ? `<a href="${safeUrl(s.x)}" target="_blank" rel="noopener noreferrer">推特主页 ↗</a>` : ''}</div></article>`;
  }).join('') || '<div class="empty-state">没有找到匹配的商家。</div>';
}

function calculateContribution() {
  const read = (id,max=Infinity) => Math.min(max,Math.max(0,Number($(id).value)||0));
  const sale=read('calc-sale');
  const contribution=sale-read('calc-cost')-sale*read('calc-fee',100)/100-sale*read('calc-reserve',100)/100-read('calc-labor')-read('calc-acquisition');
  $('calc-contribution').textContent = `¥${contribution.toFixed(2)}`;
  $('calc-small').textContent = contribution > 0 ? `${Math.ceil(500/contribution)} 单` : '无法覆盖';
  $('calc-large').textContent = contribution > 0 ? `${Math.ceil(5000/contribution)} 单` : '无法覆盖';
  document.querySelector('.calc-output').classList.toggle('negative',contribution<=0);
}

async function init() {
  calculateContribution();
  document.querySelectorAll('.calc-inputs input').forEach(input=>input.addEventListener('input',calculateContribution));
  try {
    const response=await fetch('data/research.json',{cache:'no-cache'});
    if (!response.ok) throw new Error(`Dataset HTTP ${response.status}`);
    const data=await response.json();
    if (!Array.isArray(data.offers) || !data.sites || !Array.isArray(data.agency) || !Array.isArray(data.growth)) throw new Error('Dataset invalid');
    research=data;
    const priority=['ChatGPT Plus','ChatGPT Pro 5X','ChatGPT 200美元档_核条件','ChatGPT 旧Pro续费','ChatGPT Pro 25X','ChatGPT Go','Claude Pro','Claude Max 5X','Claude Max 20X'];
    const families=[...new Set(research.offers.map(o=>o.family))].sort((a,b)=>{
      const ai=priority.indexOf(a),bi=priority.indexOf(b);
      return (ai<0 ? 999:ai)-(bi<0 ? 999:bi)||a.localeCompare(b,'zh-CN');
    });
    $('family-filter').innerHTML=families.map(f=>`<option value="${escapeHtml(f)}">${escapeHtml(familyLabel(f))}</option>`).join('');
    $('family-filter').value='ChatGPT Plus';updateChannels();renderPrices();renderAgency();renderGrowth();renderDirectory();
    $('family-filter').addEventListener('change',()=>{updateChannels();renderPrices();});
    for (const id of ['channel-filter','sort-filter','lowest-only','exclude-estimates']) $(id).addEventListener('change',renderPrices);
    $('price-search').addEventListener('input',renderPrices);
    $('directory-search').addEventListener('input',renderDirectory);
    document.querySelectorAll('[data-family]').forEach(button=>button.addEventListener('click',()=>{$('family-filter').value=button.dataset.family;updateChannels();renderPrices();}));
  } catch(error) {
    $('load-error').hidden=false;
    $('result-count').textContent='报价加载失败，请刷新重试';
    console.error('Research data could not be loaded',error);
  }
}
init();

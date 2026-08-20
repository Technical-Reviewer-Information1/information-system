(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  function el(n, a, t) { const e = document.createElementNS(NS, n); for (const k in a) if (a[k] != null) e.setAttribute(k, a[k]); if (t != null) e.textContent = t; return e; }

  /* ===== STEP 1 図 ===== */
  const FLOWS = {
    'あ': { t: '本部 ⇄ 配送センター', d: '配送情報など。<strong>どの店に、どの商品を、いくつ届けるか</strong>を伝えます。' +
        '<br>→ <strong>店コードが必要</strong>（どの店に届けるかを示すため）。ポイント会員IDは<strong>不要</strong>（配送センターでは使う場面がありません）。' },
    'い': { t: '店舗 ⇄ 本部', d: '売上・購買情報など。<strong>どの店で、いつ、何が、誰に売れたか</strong>を本部に送ります。' +
        '<br>→ <strong>店コードもポイント会員IDも必要</strong>（店別の売上分析にも、顧客の購買分析にも使います）。' },
    'う': { t: '顧客 ⇄ 店舗', d: 'レジでのやりとり。顧客は<strong>ポイントカードを提示</strong>して商品を購入します。' +
        '<br>→ <strong>ポイント会員IDが必要</strong>。店コードはこの場面では不要です（店はすでに分かっているため）。' }
  };
  let cur = null;
  function drawSys() {
    const W = 620, H = 260;
    const svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'LikeWingの情報システムの図' });
    const defs = el('defs');
    [['a1', '#858a92'], ['a2', '#123a6b']].forEach(m => {
      const mk = el('marker', { id: m[0], markerWidth: 7, markerHeight: 7, refX: 6, refY: 3, orient: 'auto' });
      mk.appendChild(el('path', { d: 'M0,0 L6,3 L0,6 z', fill: m[1] }));
      defs.appendChild(mk);
    });
    svg.appendChild(defs);
    const box = (x, y, w, h, l1, l2) => {
      svg.appendChild(el('rect', { x: x, y: y, width: w, height: h, rx: 3, class: 'node' }));
      svg.appendChild(el('text', { x: x + w / 2, y: y + (l2 ? h / 2 - 8 : h / 2), class: 'ntx' }, l1));
      if (l2) svg.appendChild(el('text', { x: x + w / 2, y: y + h / 2 + 8, class: 'ntx' }, l2));
    };
    box(20, 24, 118, 44, 'LikeWing', '配送センター');
    box(230, 24, 108, 44, 'LikeWing', '店舗');
    box(440, 24, 90, 44, '顧客');
    box(20, 186, 118, 40, 'メーカー');
    box(230, 186, 108, 44, 'LikeWing', '本部');
    // 商品の流れ
    svg.appendChild(el('path', { d: 'M138,46 L226,46', class: 'goods' }));
    svg.appendChild(el('text', { x: 168, y: 38, class: 'cap' }, '商品'));
    svg.appendChild(el('path', { d: 'M338,46 L436,46', class: 'goods' }));
    svg.appendChild(el('text', { x: 372, y: 38, class: 'cap' }, '商品'));
    svg.appendChild(el('path', { d: 'M78,182 L78,72', class: 'goods' }));
    svg.appendChild(el('text', { x: 84, y: 130, class: 'cap' }, '商品'));
    svg.appendChild(el('path', { d: 'M226,208 L142,206', class: 'goods' }));
    svg.appendChild(el('text', { x: 158, y: 200, class: 'cap' }, '発注情報など'));
    // 情報の流れ（あ・い・う）
    const info = [
      { k: 'あ', d: 'M240,184 L110,72', lx: 148, ly: 128, cap: '配送情報など', cx: 150, cy: 142 },
      { k: 'い', d: 'M284,182 L284,72', lx: 292, ly: 128, cap: '売上・購買情報など', cx: 296, cy: 142 },
      { k: 'う', d: 'M436,58 L342,58', lx: 380, ly: 76, cap: '', cx: 0, cy: 0 }
    ];
    info.forEach(f => {
      const p = el('path', { d: f.d, class: 'info' + (cur === f.k ? ' on' : ''), 'data-k': f.k });
      p.addEventListener('click', () => { cur = f.k; drawSys(); show(); });
      svg.appendChild(p);
      const t = el('text', { x: f.lx, y: f.ly, class: 'ilab' + (cur === f.k ? ' on' : ''), 'data-k': f.k }, '（' + f.k + '）');
      t.addEventListener('click', () => { cur = f.k; drawSys(); show(); });
      svg.appendChild(t);
      if (f.cap) svg.appendChild(el('text', { x: f.cx, y: f.cy, class: 'cap' }, f.cap));
    });
    svg.appendChild(el('text', { x: 440, y: 200, class: 'cap' }, '── 商品の流れ'));
    svg.appendChild(el('text', { x: 440, y: 216, class: 'cap', fill: '#123a6b' }, '── 情報の流れ'));
    const b = $('sysBox'); b.innerHTML = ''; b.appendChild(svg);
  }
  function show() {
    const n = $('sysNote'); n.className = 'note ok';
    n.innerHTML = '<strong>（' + cur + '）' + FLOWS[cur].t + '</strong><br>' + FLOWS[cur].d;
  }

  /* ===== STEP 2 ===== */
  const PICKS = [
    { k: 'ア', nm: 'Ⅰ　店コード', a: ['あ', 'い'], why: '「どの店に届けるか」（あ）と「どの店の売上か」（い）で必要です。レジで顧客とやりとりする（う）では、店はすでに分かっているので不要です。' },
    { k: 'イ', nm: 'Ⅱ　ポイント会員ID', a: ['い', 'う'], why: '顧客がカードを提示する（う）と、その購買情報を本部が分析する（い）で必要です。<strong>配送センターでは使う場面がないので（あ）は不要</strong>です。' }
  ];
  let sel = { 0: {}, 1: {} }, done = {};
  function drawPick() {
    $('pickBox').innerHTML = PICKS.map((p, i) =>
      '<div style="border:1px solid var(--line);border-radius:3px;padding:12px;margin-bottom:10px">' +
      '<div style="font-weight:700;margin-bottom:6px">' + p.nm + '　はどの流れで必要か</div>' +
      '<div class="flowpick" data-i="' + i + '">' + ['あ', 'い', 'う'].map(k =>
        '<label class="' + (sel[i][k] ? 'on' : '') + '"><input type="checkbox" data-i="' + i + '" data-k="' + k + '"' +
        (sel[i][k] ? ' checked' : '') + '> ' + k + '</label>').join('') + '</div>' +
      '<div class="btn-row" style="margin-top:10px"><button class="btn" data-chk="' + i + '">確かめる</button></div>' +
      '<div class="note" id="pfb' + i + '" hidden style="margin-top:8px"></div></div>').join('');
    $('pickBox').querySelectorAll('input[data-k]').forEach(x => x.addEventListener('change', () => {
      sel[+x.dataset.i][x.dataset.k] = x.checked; drawPick();
    }));
    $('pickBox').querySelectorAll('button[data-chk]').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.chk, p = PICKS[i];
      const got = ['あ', 'い', 'う'].filter(k => sel[i][k]);
      const ok = got.join('') === p.a.join('');
      const fb = $('pfb' + i);
      fb.hidden = false; fb.className = 'note ' + (ok ? 'ok' : 'ng');
      fb.innerHTML = (ok ? '正解。' : 'あなたの答え：' + (got.join('・') || 'なし') + '　正解は <strong>' + p.a.join('・') + '</strong>。') + p.why;
      done[i] = ok;
      const c = Object.keys(done).length, r = Object.values(done).filter(Boolean).length;
      const n = $('pickNote');
      n.className = 'note ' + (c === 2 ? (r === 2 ? 'ok' : 'warn') : 'info');
      n.innerHTML = c + ' / 2 問（正解 ' + r + ' 問）' +
        (c === 2 ? '<br>選択肢では「あ，い」が③、「い，う」が⑤なので、本文の答えは【ア】③　【イ】⑤ です。' : '');
    }));
    if (!Object.keys(done).length) { $('pickNote').className = 'note info'; $('pickNote').textContent = '0 / 2 問'; }
  }

  /* ===== STEP 3 POS ===== */
  const ITEMS = [
    { n: 'おにぎり', p: 140 }, { n: '牛乳', p: 220 }, { n: '弁当', p: 550 },
    { n: 'お茶', p: 130 }, { n: 'パン', p: 180 }, { n: 'アイス', p: 160 }
  ];
  let log = [], seed = 20260820;
  function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
  function addSale(i, mem, hour) {
    const it = ITEMS[i];
    log.push({ t: (hour === undefined ? (7 + Math.floor(rnd() * 15)) : hour), n: it.n, p: it.p, m: mem });
  }
  function drawPOS() {
    $('posBox').innerHTML = ITEMS.map((it, i) =>
      '<button class="p" data-i="' + i + '">' + it.n + '<span class="pr">' + it.p + '円</span></button>').join('');
    $('posBox').querySelectorAll('.p').forEach(b => b.addEventListener('click', () => {
      addSale(+b.dataset.i, $('memOn').checked); render();
    }));
    render();
  }
  function render() {
    $('posN').textContent = log.length + ' 件';
    const sum = log.reduce((a, x) => a + x.p, 0);
    $('posSum').textContent = sum.toLocaleString() + ' 円';
    const mem = log.filter(x => x.m).length;
    $('posMem').textContent = log.length ? Math.round(mem / log.length * 100) + '％' : '—';
    const last = log.slice(-6).reverse();
    $('posTable').innerHTML = '<thead><tr><th>時刻</th><th>商品</th><th>金額</th><th>会員ID</th></tr></thead><tbody>' +
      (last.length ? last.map(x => '<tr><td class="mono">' + x.t + '時台</td><td>' + x.n + '</td><td class="mono">' + x.p + '</td>' +
        '<td class="mono">' + (x.m ? 'P-' + (1000 + Math.floor(rnd() * 8999)) : '（なし）') + '</td></tr>').join('')
        : '<tr><td colspan="4" style="color:var(--ink-3)">まだ記録がありません</td></tr>') + '</tbody>';
    const cnt = ITEMS.map(it => log.filter(x => x.n === it.n).length);
    if (log.length >= 3) {
      $('posChart').innerHTML = '';
      window.Chart.bar($('posChart'), { labels: ITEMS.map(i => i.n), values: cnt, aria: '商品別の売れた個数', H: 250 });
      const top = ITEMS[cnt.indexOf(Math.max.apply(null, cnt))].n;
      const n = $('posNote');
      n.className = 'note ok';
      n.innerHTML = 'いま売れ筋の1位は <strong>' + top + '</strong> です。POSシステムは「<strong>いつ・どの商品が・どんな価格で・いくつ売れたか</strong>」を記録します。' +
        'ここにポイント会員IDが加わると、<strong>誰が買ったか</strong>まで分かるので、年代別の傾向や、次に買いそうな商品の予測にも使えます。' +
        '<br><span class="small">これが本部（い の流れ）に送られ、発注や品ぞろえの判断に使われます。</span>';
    } else {
      $('posChart').innerHTML = '';
      $('posNote').className = 'note info';
      $('posNote').textContent = '商品を3件以上打つと、集計結果が表示されます。';
    }
  }

  function init() {
    drawSys(); drawPick(); drawPOS();
    $('posAuto').addEventListener('click', () => {
      for (let i = 0; i < 100; i++) {
        const w = [3, 2, 4, 3, 2, 1];
        let r = rnd() * w.reduce((a, b) => a + b, 0), k = 0;
        while (r > w[k]) { r -= w[k]; k++; }
        addSale(k, rnd() < 0.7);
      }
      render();
    });
    $('posClear').addEventListener('click', () => { log = []; render(); });
    $('vTable').innerHTML = '<thead><tr><th>特性</th><th>意味</th><th>例</th></tr></thead><tbody>' +
      '<tr><td><strong>多様性（Variety）</strong></td><td>文字・数値・画像・位置情報など、種類も形式もさまざま</td><td>SNSの投稿、写真、センサーの値</td></tr>' +
      '<tr><td><strong>頻度（Velocity）</strong></td><td>リアルタイムに収集・更新され続ける</td><td>1秒ごとに届く購買データ</td></tr>' +
      '<tr><td><strong>量（Volume）</strong></td><td>従来の方法では扱いきれないほど膨大</td><td>全国の店舗の全レジデータ</td></tr></tbody>';
    $('sysTable').innerHTML = '<thead><tr><th>分野</th><th>システム</th><th>内容</th></tr></thead><tbody>' +
      '<tr><td>小売業</td><td>POSシステム（販売時点情報管理システム）</td><td>いつ・どの商品が・どんな価格で・いくつ売れたかを管理する。</td></tr>' +
      '<tr><td>通信</td><td>SNS</td><td>人と人との交流や、情報の拡散・収集ができる。</td></tr>' +
      '<tr><td>交通</td><td>高度道路交通システム（ITS）</td><td>事故や渋滞、環境対策などの課題を解決する。</td></tr>' +
      '<tr><td>金融</td><td>ATM・電子決済システム</td><td>入出金や送金をネットワーク経由で処理する。</td></tr>' +
      '<tr><td>医療</td><td>電子カルテ・遠隔医療</td><td>診療情報を共有し、離れた場所からも診療できる。</td></tr></tbody>';
    Quiz.choice('q1Box', 'q1Note', [
      { k: 'ア', q: 'Ⅰ　店コード が必要とされる情報の流れは',
        ch: ['あ', 'い', 'う', 'あ，い', 'あ，う', 'い，う', 'あ，い，う'], a: 3,
        why: '配送（あ）では「どの店に届けるか」、売上報告（い）では「どの店の売上か」で必要です。レジ（う）では不要。' },
      { k: 'イ', q: 'Ⅱ　ポイント会員ID が必要とされる情報の流れは',
        ch: ['あ', 'い', 'う', 'あ，い', 'あ，う', 'い，う', 'あ，い，う'], a: 5,
        why: 'レジでの提示（う）と、本部での購買分析（い）で必要です。配送センター（あ）では使う場面がありません。' }
    ], '本文の答えは【ア】③　【イ】⑤ です。');
    Quiz.choice('q2Box', 'q2Note', [
      { k: 'ウ', q: 'ビッグデータの活用事例として最も適当なものは',
        ch: ['社内に蓄積された会議記録を活用し、業務の改善点を検討する', '数百人の顧客アンケートを集計し、商品の売上動向を分析する', 'SNS上の投稿を分析し、商品の広告などをより効果的に行う', 'SNS上の口コミを人手で確認し、問題のある投稿があれば即時に対応する'],
        a: 2, why: 'SNSの投稿は<strong>多様・大量・リアルタイム</strong>という3Vをすべて満たします。⓪と①は量が限られ、③は<strong>人手</strong>で確認しているのでビッグデータの活用とはいえません。' }
    ], '本文の答えは【ウ】② です。');
    window.Terms.glossary($('glossBox'), ['情報システム', 'POSシステム', 'ビッグデータ', 'IoT', '人工知能', '可用性', '個人情報']);
    window.Terms.attach();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

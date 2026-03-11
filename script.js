let data = [
    { id: 1, sym: 'EURUSD#', type: 'sell', lot: '0.1', entry: '182.930', close: '182.962', time: '2026.03.03 13:21:47', profit: -20, bar: 'sl' },
    { id: 2, sym: 'GOLD#', type: 'sell', lot: '0.1', entry: '5206.56', close: '5183.98', time: '2026.03.03 13:25:00', profit: 35665, bar: 'none' },
    { id: 3, sym: 'GOLD#', type: 'sell', lot: '0.05', entry: '5203.05', close: '5183.98', time: '2026.03.03 13:25:00', profit: 15061, bar: 'tp' },
    { id: 4, sym: 'USDJPY#', type: 'buy', lot: '0.05', entry: '157.618', close: '157.617', time: '2026.03.04 02:56:39', profit: -5, bar: 'none' },
    { id: 5, sym: 'USDJPY#', type: 'buy', lot: '0.1', entry: '157.603', close: '157.617', time: '2026.03.04 02:56:39', profit: 140, bar: 'none' },
    { id: 6, sym: 'USDJPY#', type: 'buy', lot: '0.1', entry: '157.610', close: '157.617', time: '2026.03.04 02:56:39', profit: 70, bar: 'none' },
    { id: 7, sym: 'USDJPY#', type: 'buy', lot: '0.1', entry: '157.619', close: '157.617', time: '2026.03.04 02:56:39', profit: -20, bar: 'none' },
    { id: 8, sym: 'USDJPY#', type: 'buy', lot: '0.1', entry: '157.619', close: '157.617', time: '2026.03.04 02:56:39', profit: -20, bar: 'none' },
    { id: 9, sym: 'USDJPY#', type: 'buy', lot: '0.1', entry: '157.619', close: '157.617', time: '2026.03.04 02:56:39', profit: -20, bar: 'none' },
    { id: 10, sym: 'USDJPY#', type: 'buy', lot: '0.1', entry: '157.618', close: '157.617', time: '2026.03.04 02:56:39', profit: -10, bar: 'none' }
  ];
  
  function formatNum(num) {
    if (typeof num === 'string') return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  
  function renderApp() {
    const list = document.getElementById('trades-wrapper');
    list.innerHTML = '';
  
    data.forEach(t => {
      const pColor = t.profit >= 0 ? 'blue-text' : 'red-text';
      if (t.isBal) {
        list.insertAdjacentHTML('beforeend', `
          <div class="row-item ${t.bar}" onclick="openEdit(${t.id})">
            <div class="side-bar"></div>
            <div class="col-left">
              <div class="title-main">${t.sym}</div>
              <div class="sub-text">${t.sub}</div>
            </div>
            <div class="col-right">
              <div class="profit-val blue-text">${formatNum(t.profit)}</div>
              <div class="sub-text">${t.time}</div>
            </div>
          </div>
        `);
      } else {
        const tColor = t.type === 'buy' ? 'type-buy' : 'type-sell';
        list.insertAdjacentHTML('beforeend', `
          <div class="row-item ${t.bar}" onclick="openEdit(${t.id})">
            <div class="side-bar"></div>
            <div class="col-left">
              <div class="title-main">${t.sym} <span class="${tColor}">${t.type} <span style="font-weight:600;">${t.lot}</span></span></div>
              <div class="sub-text" id="prc-${t.id}">${t.entry} → ${t.close}</div>
            </div>
            <div class="col-right">
              <div class="profit-val ${pColor}" id="prof-${t.id}">${formatNum(t.profit)}</div>
              <div class="sub-text">${t.time}</div>
            </div>
          </div>
        `);
      }
    });
    updateSummary();
  }
  
  function updateSummary() {
    document.getElementById('sum-dep').innerText = document.getElementById('s-dep').value;
    document.getElementById('sum-prof').innerText = document.getElementById('s-prof').value;
    document.getElementById('sum-swap').innerText = document.getElementById('s-swap').value;
    document.getElementById('sum-com').innerText = document.getElementById('s-com').value;
    document.getElementById('sum-bal').innerText = document.getElementById('s-bal').value;
  }
  
  function updateBattery() {
    document.getElementById('bat-fill').style.width = document.getElementById('s-bat').value + "%";
    document.getElementById('bat-txt').innerText = document.getElementById('s-bat').value;
  }
  
  function slideTo(index, element) {
    const pill = document.getElementById('pill');
    const offset = element.offsetLeft;
    const width = element.offsetWidth;
    // 1px inner padding constraint
    const calc_width = width - 2;
    if (calc_width >= 50) {
      pill.style.width = calc_width + 'px';
      pill.style.transform = `translateX(${offset + 1}px)`;
    } else {
      pill.style.width = '60px';
      pill.style.transform = `translateX(${offset - 13}px)`;
    }
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
  }
  
  // Ensure the top slider pill is perfectly aligned on initial load
  setTimeout(() => {
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) slideTo(0, activeBtn);
  }, 50);
  
  function openEdit(id) {
    const t = data.find(x => x.id === id);
    document.getElementById('edit-id').value = id;
    document.getElementById('e-sym').value = t.sym;
    document.getElementById('e-type').value = t.isBal ? 'balance' : t.type;
    document.getElementById('e-lot').value = t.lot || '';
    document.getElementById('e-profit').value = t.profit;
    document.getElementById('e-entry').value = t.entry || t.sub || '';
    document.getElementById('e-close').value = t.close || '';
    document.getElementById('e-time').value = t.time;
    document.getElementById('e-bar').value = t.bar || 'none';
    document.getElementById('edit-modal').classList.add('active');
  }
  
  function saveEdit() {
    const id = parseInt(document.getElementById('edit-id').value);
    const t = data.find(x => x.id === id);
    t.sym = document.getElementById('e-sym').value;
    const typ = document.getElementById('e-type').value;
    t.isBal = (typ === 'balance');
    t.type = typ;
    t.lot = document.getElementById('e-lot').value;
    t.profit = parseFloat(document.getElementById('e-profit').value);
    if (t.isBal) {
      t.sub = document.getElementById('e-entry').value;
    } else {
      t.entry = document.getElementById('e-entry').value;
      t.close = document.getElementById('e-close').value;
    }
    t.time = document.getElementById('e-time').value;
    t.bar = document.getElementById('e-bar').value;
    closeModals();
    renderApp();
  }
  
  function deleteTrade() {
    const id = parseInt(document.getElementById('edit-id').value);
    data = data.filter(x => x.id !== id);
    closeModals();
    renderApp();
  }
  
  function addNewTrade() {
    const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
    data.push({
      id: newId,
      sym: 'NEW#',
      type: 'buy',
      lot: '0.1',
      entry: '0.00',
      close: '0.00',
      time: '2026.01.01 12:00:00',
      profit: 0,
      bar: 'none'
    });
    closeModals();
    renderApp();
  
    const container = document.getElementById('list-container');
    container.scrollTop = container.scrollHeight;
    setTimeout(() => {
      openEdit(newId);
    }, 100);
  }
  
  function toggleTheme() {
    const app = document.getElementById('mt5-app');
    const btn = document.getElementById('theme-toggle-btn');
    app.classList.toggle('light-mode');
    if (app.classList.contains('light-mode')) {
      btn.innerHTML = "🌙 ダークモードに切替";
    } else {
      btn.innerHTML = "☀️ ライトモードに切替";
    }
  }
  
  function openSettings() {
    document.getElementById('settings-modal').classList.add('active');
  }
  function closeModals() {
    document.getElementById('edit-modal').classList.remove('active');
    document.getElementById('settings-modal').classList.remove('active');
  }
  
  function generatePNG() {
    closeModals();
    const target = document.getElementById('mt5-app');
    const isLight = target.classList.contains('light-mode');
    const bgColor = isLight ? '#ffffff' : '#000000';
    setTimeout(() => {
      html2canvas(target, { scale: 3, useCORS: true, backgroundColor: bgColor }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'mt5-history.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      });
    }, 300);
  }
  
  // Initialize Sortable JS for Drag and Drop
  function initSortable() {
    const list = document.getElementById('trades-wrapper');
    new Sortable(list, {
      animation: 150,
      delay: 250, // Require holding for 250ms before dragging to avoid accidental drags
      delayOnTouchOnly: true,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      onEnd: function (evt) {
        // Update array state to match the DOM visually
        const movedItem = data.splice(evt.oldIndex, 1)[0];
        data.splice(evt.newIndex, 0, movedItem);
        renderApp();
      }
    });
  }
  
  setInterval(() => {
    const clockEl = document.getElementById('clock-time');
    if (clockEl) {
      clockEl.innerText = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }, 1000);
  
  // Boot up after DOM is ready
  window.addEventListener('load', () => {
    renderApp();
    initSortable();
  });
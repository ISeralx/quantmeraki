/* ==========================================================================
   QuantMeraki · comportamiento común
   - Modo claro/oscuro (claro por defecto, se recuerda en el navegador)
   - Menús desplegables, sección activa, avisos de borrador
   - Desplegables, "ver solución", pestañas, filtros y búsqueda
   - Progreso guardado en el navegador (QM.store / QM.done)
   ========================================================================== */
(function(){
  'use strict';
  var root=document.documentElement;
  var QM=window.QM=window.QM||{};
  function each(sel,fn,ctx){Array.prototype.forEach.call((ctx||document).querySelectorAll(sel),fn);}
  QM.each=each;

  /* ---------- almacenamiento seguro ---------- */
  QM.store={
    get:function(k,d){try{var v=localStorage.getItem('qm:'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}},
    set:function(k,v){try{localStorage.setItem('qm:'+k,JSON.stringify(v));}catch(e){}},
    remove:function(k){try{localStorage.removeItem('qm:'+k);}catch(e){}}
  };
  /* elementos hechos: QM.done('pregunta:juego-del-dado') */
  QM.isDone=function(id){return !!(QM.store.get('done',{})[id]);};
  QM.setDone=function(id,on){var d=QM.store.get('done',{});if(on)d[id]=Date.now();else delete d[id];QM.store.set('done',d);document.dispatchEvent(new CustomEvent('qm-progress',{detail:{id:id,on:on}}));};
  QM.doneList=function(){return QM.store.get('done',{});};
  /* mejores marcas: QM.best('calculo-60', 23) devuelve la mejor */
  QM.best=function(key,val){var b=QM.store.get('best',{});if(typeof val==='number'&&(b[key]===undefined||val>b[key])){b[key]=val;QM.store.set('best',b);}return b[key];};
  QM.history=function(key,entry){var h=QM.store.get('hist',{});h[key]=h[key]||[];if(entry){h[key].push(entry);if(h[key].length>50)h[key].shift();QM.store.set('hist',h);}return h[key];};

  /* ---------- modo claro / oscuro ---------- */
  QM.theme=function(){return root.getAttribute('data-theme')==='dark'?'dark':'light';};
  QM.color=function(name){return getComputedStyle(root).getPropertyValue('--'+name).trim();};
  function applyTheme(t,save){
    root.setAttribute('data-theme',t);
    if(save){try{localStorage.setItem('qm-theme',t);}catch(e){}}
    each('[data-theme-toggle]',function(b){
      b.setAttribute('aria-pressed',String(t==='dark'));
      b.setAttribute('aria-label',t==='light'?'Cambiar a modo oscuro':'Cambiar a modo claro');
      b.title=t==='light'?'Modo oscuro':'Modo claro';
    });
    document.dispatchEvent(new CustomEvent('qm-theme',{detail:t}));
  }
  applyTheme(QM.theme(),false);
  each('[data-theme-toggle]',function(b){b.addEventListener('click',function(){applyTheme(QM.theme()==='light'?'dark':'light',true);});});

  /* ---------- sección y página activas ---------- */
  var section=document.body.getAttribute('data-section');
  var file=(location.pathname.split('/').pop()||'index.html');
  if(section){
    each('.tabbar [data-tab="'+section+'"]',function(a){a.setAttribute('aria-current','page');});
    each('.nav [data-nav="'+section+'"]',function(a){a.classList.add('on');});
    if(section==='progreso')each('.tools [data-nav="progreso"]',function(a){a.setAttribute('aria-current','page');});
  }
  each('.menu a',function(a){if(a.getAttribute('href')===file)a.setAttribute('aria-current','page');});

  /* ---------- menús desplegables ---------- */
  function closeMenus(except){each('.dd-btn',function(b){if(b!==except){b.setAttribute('aria-expanded','false');var m=b.nextElementSibling;if(m)m.hidden=true;}});}
  each('.dd-btn',function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();var m=b.nextElementSibling,open=m.hidden;
      closeMenus(b);m.hidden=!open;b.setAttribute('aria-expanded',String(open));
    });
  });
  document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('.dd'))closeMenus();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenus();});

  /* ---------- aviso flotante ---------- */
  var toastT=0;
  QM.toast=function(msg){
    var t=document.getElementById('toast');
    if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t);}
    t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true;},3400);
  };
  /* enlaces que todavía no existen en el borrador */
  each('[data-soon]',function(el){
    el.addEventListener('click',function(e){
      e.preventDefault();
      var v=el.getAttribute('data-soon');
      QM.toast(v&&v.length>3?v:'Borrador: esta página todavía no está montada.');
    });
  });

  /* ---------- desplegables (acordeón) ---------- */
  each('.acc-btn',function(b){
    b.addEventListener('click',function(){
      var open=b.getAttribute('aria-expanded')!=='true',p=document.getElementById(b.getAttribute('aria-controls'));
      b.setAttribute('aria-expanded',String(open));if(p)p.hidden=!open;
    });
  });

  /* ---------- "ver solución" y similares ----------
     <button data-reveal="idObjetivo" data-alt="Ocultar solución">Ver solución</button> */
  each('[data-reveal]',function(b){
    var label=b.textContent;
    b.addEventListener('click',function(){
      var t=document.getElementById(b.getAttribute('data-reveal'));if(!t)return;
      t.hidden=!t.hidden;b.setAttribute('aria-expanded',String(!t.hidden));
      b.textContent=t.hidden?label:(b.getAttribute('data-alt')||label);
      if(!t.hidden){t.dispatchEvent(new CustomEvent('qm-reveal',{bubbles:true}));if(window.MathJax&&MathJax.typesetPromise)MathJax.typesetPromise([t]).catch(function(){});}
    });
  });

  /* ---------- pestañas ----------
     <div role="tablist"><button role="tab" aria-controls="panelA" aria-selected="true">…</button></div> */
  each('[role="tablist"]',function(list){
    var tabs=list.querySelectorAll('[role="tab"]');
    /* si todas las pestañas controlan el mismo panel, la página lo rellena al oír "qm-tab" */
    var shared=Array.prototype.every.call(tabs,function(x){return x.getAttribute('aria-controls')===tabs[0].getAttribute('aria-controls');});
    function select(t){
      Array.prototype.forEach.call(tabs,function(x){
        var on=x===t;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;
        if(!shared){var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on;}
      });
      list.dispatchEvent(new CustomEvent('qm-tab',{detail:t,bubbles:true}));
    }
    Array.prototype.forEach.call(tabs,function(t,i){
      t.addEventListener('click',function(){select(t);});
      t.addEventListener('keydown',function(e){
        var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!k)return;e.preventDefault();
        var n=tabs[(i+k+tabs.length)%tabs.length];select(n);n.focus();
      });
    });
  });

  /* ---------- filtros y búsqueda ----------
     <div data-filter-root>
       <div class="chips"><button class="chip" data-filter="cat:all" aria-pressed="true">Todas</button>
                          <button class="chip" data-filter="cat:probabilidad">Probabilidad</button></div>
       <select class="sel" data-filter-select="lvl">…<option value="all">…</select>
       <label class="search"><input data-search></label>
       <span data-count></span>
       <div data-item data-tags="cat:probabilidad lvl:2">…</div>
       <p class="empty" data-empty hidden>…</p>
     </div> */
  function norm(s){return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();}
  QM.norm=norm;
  each('[data-filter-root]',function(rootEl){
    var state={},q='';
    var items=rootEl.querySelectorAll('[data-item]');
    function apply(){
      var shown=0;
      Array.prototype.forEach.call(items,function(it){
        var tags=' '+(it.getAttribute('data-tags')||'')+' ',ok=true;
        Object.keys(state).forEach(function(k){if(state[k]!=='all'&&tags.indexOf(' '+k+':'+state[k]+' ')<0)ok=false;});
        if(ok&&q)ok=norm(it.textContent).indexOf(q)>=0;
        it.hidden=!ok;if(ok)shown++;
      });
      each('[data-count]',function(c){c.textContent=shown+(shown===1?' resultado':' resultados');},rootEl);
      each('[data-empty]',function(e){e.hidden=shown>0;},rootEl);
    }
    each('[data-filter]',function(b){
      var kv=b.getAttribute('data-filter').split(':');
      if(b.getAttribute('aria-pressed')==='true')state[kv[0]]=kv[1];
      b.addEventListener('click',function(){
        state[kv[0]]=kv[1];
        each('[data-filter^="'+kv[0]+':"]',function(o){o.setAttribute('aria-pressed',String(o===b));},rootEl);
        apply();
      });
    },rootEl);
    each('[data-filter-select]',function(s){
      var k=s.getAttribute('data-filter-select');state[k]=s.value;
      s.addEventListener('change',function(){state[k]=s.value;apply();});
    },rootEl);
    each('[data-search]',function(inp){inp.addEventListener('input',function(){q=norm(inp.value.trim());apply();});},rootEl);
    apply();
  });

  /* ---------- marcas de "hecho" en listas ----------
     <span class="check" data-done-mark="pregunta:juego-del-dado"></span> */
  function paintDone(){each('[data-done-mark]',function(c){c.classList.toggle('on',QM.isDone(c.getAttribute('data-done-mark')));});}
  paintDone();document.addEventListener('qm-progress',paintDone);
  /* botón que marca como hecho: <button data-done-toggle="id">Marcar como hecho</button> */
  each('[data-done-toggle]',function(b){
    var id=b.getAttribute('data-done-toggle'),on0=b.textContent,off0=b.getAttribute('data-alt')||'Hecho';
    function paint(){var on=QM.isDone(id);b.setAttribute('aria-pressed',String(on));b.textContent=on?off0:on0;}
    b.addEventListener('click',function(){QM.setDone(id,!QM.isDone(id));paint();});paint();
  });


  /* ---------- biblioteca personal ----------
     QM.store es la ÚNICA puerta al almacenamiento. Hoy guarda en el navegador; cuando haya
     cuentas (login con Google), se cambia QM.store por una sincronización con el servidor
     y ninguna página tiene que tocarse.
     <button class="savebtn" type="button" data-save="leccion:valor-esperado" data-save-title="Valor esperado"
             data-save-type="Lección" data-save-href="leccion-valor-esperado.html" data-save-mins="15">
       <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg><span class="lbl">Guardar</span></button> */
  function libEmit(){document.dispatchEvent(new CustomEvent('qm-lib'));}
  QM.lib={
    list:function(){return QM.store.get('lib',[]);},
    has:function(id){return QM.lib.list().some(function(x){return x.id===id;});},
    save:function(item){var l=QM.lib.list().filter(function(x){return x.id!==item.id;});item.at=Date.now();l.unshift(item);QM.store.set('lib',l);libEmit();},
    remove:function(id){QM.store.set('lib',QM.lib.list().filter(function(x){return x.id!==id;}));libEmit();},
    toggle:function(item){if(QM.lib.has(item.id))QM.lib.remove(item.id);else QM.lib.save(item);return QM.lib.has(item.id);}
  };
  each('[data-save]',function(b){
    var item={id:b.getAttribute('data-save'),title:b.getAttribute('data-save-title')||document.title.split(' · ')[0],
      type:b.getAttribute('data-save-type')||'',href:b.getAttribute('data-save-href')||file,mins:+(b.getAttribute('data-save-mins')||0)};
    function paint(){
      var on=QM.lib.has(item.id),l=b.querySelector('.lbl');
      b.setAttribute('aria-pressed',String(on));b.classList.toggle('on',on);
      if(l)l.textContent=on?'Guardado':'Guardar';
      b.setAttribute('aria-label',on?'Quitar de mi biblioteca':'Guardar en mi biblioteca');
    }
    b.addEventListener('click',function(e){e.preventDefault();var on=QM.lib.toggle(item);QM.toast(on?'Guardado en tu biblioteca.':'Quitado de tu biblioteca.');});
    document.addEventListener('qm-lib',paint);paint();
  });


  /* ---------- números de sección grandes: <p class="kicker"><b>02</b> / Tus marcas</p> ---------- */
  each('.kicker b',function(b){if(/^\s*\d{1,2}\s*$/.test(b.textContent)){b.classList.add('kn');b.parentNode.classList.add('kn-on');}});

  /* ---------- índice lateral que sigue la lectura ---------- */
  var toc=document.querySelector('.toc');
  if(toc&&'IntersectionObserver' in window){
    var links=toc.querySelectorAll('a[href^="#"]');var map={};
    Array.prototype.forEach.call(links,function(a){map[a.getAttribute('href').slice(1)]=a;});
    var obs=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){Array.prototype.forEach.call(links,function(a){a.removeAttribute('aria-current');});var a=map[e.target.id];if(a)a.setAttribute('aria-current','true');}});
    },{rootMargin:'-20% 0px -70% 0px'});
    Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el)obs.observe(el);});
  }
})();

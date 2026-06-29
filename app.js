(function(){
  const content = window.JINX_CONTENT;
  const root = document.getElementById('app');
  if(!content || !root) return;

  function setMeta(){
    document.title = content.meta.title;
    setMetaValue('description', content.meta.description);
    setMetaValue('keywords', content.meta.keywords);
    setMetaValue('twitter:title', content.meta.title);
    setMetaValue('twitter:description', content.meta.description);
    setPropertyValue('og:title', content.meta.title);
    setPropertyValue('og:description', content.meta.description);
    setPropertyValue('og:site_name', content.meta.siteName);
    setPropertyValue('og:locale', content.meta.locale);

    const schema = {
      '@context':'https://schema.org',
      '@graph':[
        {'@type':'WebSite','@id':'https://jinx2.ru/#website',url:'https://jinx2.ru/',name:'Jinx',description:content.meta.description,inLanguage:'ru'},
        {'@type':'Organization','@id':'https://jinx2.ru/#org',name:content.meta.siteName,url:'https://jinx2.ru/',foundingDate:'2024'},
        {'@type':'SoftwareApplication','@id':'https://jinx2.ru/#app',name:'Jinx',applicationCategory:'SocialNetworkingApplication',operatingSystem:'iOS, Android, Web',description:content.meta.description,offers:{'@type':'Offer',price:'0',priceCurrency:'RUB'}},
        {'@type':'FAQPage','@id':'https://jinx2.ru/#faq',mainEntity:content.faq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))}
      ]
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function setMetaValue(name,value){
    const node = document.querySelector(`meta[name="${name}"]`);
    if(node) node.setAttribute('content', value);
  }

  function setPropertyValue(property,value){
    const node = document.querySelector(`meta[property="${property}"]`);
    if(node) node.setAttribute('content', value);
  }

  function escapeHtml(value){
    return String(value)
      .replaceAll('&','&amp;')
      .replace('<','&lt;')
      .replace('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  const ICONS = {
    reply: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>',
    repost: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>',
    like: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>',
    views: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg>',
    verified: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>'
  };

  function paragraphList(items){
    return items.map(text=>`<p>${escapeHtml(text)}</p>`).join('');
  }

  function sectionBlocks(blocks){
    return blocks.map(block=>{
      const paragraphs = paragraphList(block.paragraphs || []);
      const listTitle = block.listTitle ? `<h4>${escapeHtml(block.listTitle)}</h4>` : '';
      const list = block.list ? `<ul>${block.list.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';
      return `<h3>${escapeHtml(block.heading)}</h3>${paragraphs}${listTitle}${list}`;
    }).join('');
  }

  function headHtml(letter, name, handle, meta, isFaq){
    return `
      <div class="card-head">
        <div class="avatar${isFaq ? ' faq-avatar' : ''}" data-tooltip="Имитация · профиль пользователя">${escapeHtml(letter)}</div>
        <div class="card-meta">
          <div class="card-top">
            <span class="card-name" data-tooltip="Имитация · отображение имени">${escapeHtml(name)}</span>
            <span class="card-verified" aria-label="Verified" data-tooltip="Имитация · значок верификации">${ICONS.verified}</span>
            <span class="card-handle" data-tooltip="Имитация · @handle пользователя">${escapeHtml(handle)}</span>
          </div>
          <span class="card-tag" data-tooltip="Имитация · дата публикации">${escapeHtml(meta)}</span>
        </div>
        <button class="card-menu" type="button" aria-label="More" data-tooltip="Имитация · меню действий">${ICONS.more}</button>
      </div>`;
  }

  function actionBar(metrics){
    const m = metrics || {replies:'1.2K',reposts:'340',likes:'8.7K',views:'92K'};
    return `
      <div class="card-actions" aria-label="Post actions">
        <div class="action-left">
          <button class="action reply" type="button" data-tooltip="Имитация · комментарии пока недоступны" aria-label="Reply">${ICONS.reply}<span class="action-num">${escapeHtml(m.replies)}</span></button>
          <button class="action repost" type="button" data-tooltip="Имитация · репосты появятся с релизом" aria-label="Repost">${ICONS.repost}<span class="action-num">${escapeHtml(m.reposts)}</span></button>
          <button class="action like like-action" type="button" data-tooltip="Имитация · поставь лайк позже" aria-label="Like">${ICONS.like}<span class="action-num">${escapeHtml(m.likes)}</span></button>
          <button class="action view" type="button" data-tooltip="Имитация · статистика просмотров появится в релизе 1.0" aria-label="Views">${ICONS.views}<span class="action-num">${escapeHtml(m.views)}</span></button>
        </div>
        <div class="action-right">
          <button class="action bookmark" type="button" data-tooltip="Имитация · закладки появятся позже" aria-label="Bookmark">${ICONS.bookmark}</button>
          <button class="action share" type="button" data-tooltip="Поделиться ссылкой на эту карточку" aria-label="Share">${ICONS.share}</button>
        </div>
      </div>`;
  }

  function heroPost(){
    const stats = content.hero.stats.map(stat=>`<div class="stat" data-tooltip="Имитация · статистика для прототипа"><b>${escapeHtml(stat.value)}</b><span>${escapeHtml(stat.label)}</span></div>`).join('');
    return `
      <section class="post" id="hero" data-nav="hero" aria-label="${escapeHtml(content.hero.brand)}">
        <article class="card">
          ${headHtml('J', content.hero.brand, content.hero.handle, content.hero.tag, false)}
          <div class="card-body">
            <h1 class="hero-logo">${escapeHtml(content.hero.brand)}</h1>
            <span class="hero-subtitle">${escapeHtml(content.hero.subtitle)}</span>
            <h2 class="post-title" style="margin-top:8px">${escapeHtml(content.hero.title)}</h2>
            <p style="color:var(--muted);font-size:.95rem;line-height:1.5">${escapeHtml(content.hero.description)}</p>
            <div class="stat-row">${stats}</div>
          </div>
          ${actionBar({replies:'12.8K',reposts:'4.2K',likes:'301K',views:'4.2M'})}
        </article>
      </section>`;
  }

  function newsPost(item,index){
    const replies = item.metrics.comments || '1.2K';
    const likes = item.metrics.likes || '24K';
    const reposts = Math.floor(parseFloat(likes) * 0.15) + 'K';
    const views = Math.floor(parseFloat(likes) * 5) + 'K';
    return `
      <section class="post" id="${escapeHtml(item.id)}" data-nav="${index === 0 ? 'news-0' : item.id}" aria-label="${escapeHtml(item.title)}">
        <article class="card">
          ${headHtml('J', content.hero.brand, content.hero.handle, `${escapeHtml(content.newsLabel)} · ${escapeHtml(item.tag)} · ${escapeHtml(item.date)}`, false)}
          <div class="card-body">
            <h2 class="post-title">${escapeHtml(item.title)}</h2>
            <div class="post-copy">${paragraphList(item.body)}</div>
          </div>
          ${actionBar({replies,reposts,likes,views})}
        </article>
      </section>`;
  }

  function infoPost(section){
    return `
      <section class="post" id="${escapeHtml(section.id)}" data-nav="${escapeHtml(section.id)}" aria-label="${escapeHtml(section.title)}">
        <article class="card">
          ${headHtml('J', content.hero.brand, content.hero.handle, escapeHtml(section.tag), false)}
          <div class="card-body">
            <h2 class="post-title">${escapeHtml(section.title)}</h2>
            <div class="post-copy">${sectionBlocks(section.blocks)}</div>
          </div>
          ${actionBar({replies:section.metrics.comments,reposts:'12K',likes:section.metrics.likes,views:'1.2M'})}
        </article>
      </section>`;
  }

  function faqPost(item,index){
    return `
      <section class="post" id="${escapeHtml(item.id)}" data-nav="${index === 0 ? 'faq-0' : item.id}" aria-label="${escapeHtml(item.question)}">
        <article class="card">
          ${headHtml('?', 'Jinx FAQ', content.hero.handle, `${escapeHtml(content.ui.faq)} · #${String(index + 1).padStart(2,'0')}`, true)}
          <div class="card-body">
            <h2 class="post-title">${escapeHtml(item.question)}</h2>
            <div class="post-copy"><p>${escapeHtml(item.answer)}</p></div>
          </div>
          ${actionBar({replies:`${820 + index * 181}`,reposts:`${3 + index}K`,likes:`${24 + index * 7}K`,views:`${200 + index * 40}K`})}
        </article>
      </section>`;
  }

  function footerPost(){
    return `
      <section class="post" id="footer" data-nav="footer" aria-label="Jinx Network">
        <article class="card">
          ${headHtml('J', content.hero.brand, content.hero.handle, escapeHtml(content.ui.jinxNetwork), false)}
          <div class="card-body">
            <h2 class="post-title">${escapeHtml(content.footer.copyright)}</h2>
            <p style="color:var(--muted);font-size:.92rem;line-height:1.55">${escapeHtml(content.hero.description)}</p>
            <div class="footer-tags">${escapeHtml(content.footer.tags)}</div>
          </div>
          ${actionBar({replies:content.ui.footerComments,reposts:'∞',likes:content.ui.footerLikes,views:'P2P'})}
        </article>
      </section>`;
  }

  function render(){
    const posts = [
      heroPost(),
      ...content.news.map(newsPost),
      ...content.sections.map(infoPost),
      ...content.faq.map(faqPost),
      footerPost()
    ];

    root.innerHTML = `
      <header class="topbar">
        <div class="brand-lockup">
          <span class="brand-name">${escapeHtml(content.hero.brand)}</span>
        </div>
        <nav class="feed-tabs" aria-label="Feed navigation">
          ${content.nav.map((item,index)=>`<button class="feed-tab${index===0?' active':''}" type="button" data-target="${escapeHtml(item.target)}">${escapeHtml(item.label)}</button>`).join('')}
        </nav>
        <div class="top-actions" aria-hidden="true"></div>
      </header>
      <main class="feed" id="feed" role="main">
        ${posts.join('')}
      </main>
      <div class="progress-dots" aria-label="Feed progress"></div>
    `;
  }

  function bind(){
    const feed = document.getElementById('feed');
    const posts = Array.from(document.querySelectorAll('.post'));
    const progress = document.querySelector('.progress-dots');
    const navButtons = Array.from(document.querySelectorAll('[data-target]'));
    const titles = posts.map(post=>{
      const heading = post.querySelector('.post-title, .hero-logo');
      return heading ? heading.textContent.trim() : post.id;
    });
    const metas = posts.map(post=>{
      const meta = post.querySelector('.card-tag');
      return meta ? meta.textContent.trim() : content.hero.handle;
    });
    progress.innerHTML = `
      <div class="progress-head" aria-hidden="true">
        <span class="progress-signal"></span>
        <span class="progress-head-copy">
          <span class="progress-kicker">Jinx feed</span>
          <span class="progress-active-title">${escapeHtml(titles[0])}</span>
        </span>
      </div>
      <div class="progress-stack">
        ${posts.map((post,index)=>{
          const number = String(index + 1).padStart(2,'0');
          return `<button class="progress-dot${index===0?' active':''}" type="button" data-post="${escapeHtml(post.id)}" data-title="${escapeHtml(titles[index])}" data-meta="${escapeHtml(metas[index])}" data-index="${number}" aria-label="${escapeHtml(titles[index])}">
            <span class="progress-dot-orb" aria-hidden="true"><span class="progress-dot-index">${number}</span></span>
            <span class="progress-dot-copy" aria-hidden="true">
              <span class="progress-dot-title">${escapeHtml(titles[index])}</span>
              <span class="progress-dot-meta">${escapeHtml(metas[index])}</span>
            </span>
          </button>`;
        }).join('')}
      </div>
      <div class="progress-readout" aria-hidden="true"><span class="progress-current">01</span><span class="progress-total">${String(posts.length).padStart(2,'0')}</span></div>
    `;

    let suppressHashScroll = false;
    let suppressObserver = false;
    let suppressDotsScroll = false;
    let currentActiveId = null;
    const STORAGE_KEY = 'jinx:lastPostId';

    function smoothScrollTo(top){
      const previousSnap = feed.style.scrollSnapType;
      feed.style.scrollSnapType = 'none';
      suppressDotsScroll = true;
      feed.scrollTo({top, behavior:'smooth'});
      const restore = ()=>{
        feed.style.scrollSnapType = previousSnap;
        feed.removeEventListener('scrollend', restore);
      };
      feed.addEventListener('scrollend', ()=>{
        restore();
        suppressDotsScroll = false;
        scrollProgressDotsToActive();
      });
      setTimeout(()=>{
        restore();
        suppressDotsScroll = false;
        scrollProgressDotsToActive();
      }, 1200);
    }

    function scrollToPost(id, updateHash){
      const target = document.getElementById(id);
      if(!target) return;
      smoothScrollTo(target.offsetTop);
      try{
        sessionStorage.setItem(STORAGE_KEY, id);
      }catch(e){}
      if(updateHash && location.hash.replace('#','') !== id){
        suppressHashScroll = true;
        history.replaceState(null, '', '#' + id);
      }
    }

    function scrollProgressDotsToActive(){
      const activeDot = progress.querySelector('.progress-dot.active');
      if(!activeDot) return;
      const isHorizontal = progress.scrollWidth > progress.clientWidth + 4;
      if(isHorizontal){
        const dotLeft = activeDot.offsetLeft;
        const containerWidth = progress.clientWidth;
        const dotWidth = activeDot.offsetWidth;
        const targetScroll = dotLeft - containerWidth / 2 + dotWidth / 2;
        const maxScroll = progress.scrollWidth - containerWidth;
        progress.scrollTo({left: Math.max(0, Math.min(maxScroll, targetScroll)), behavior:'smooth'});
      }else{
        const dotTop = activeDot.offsetTop;
        const containerHeight = progress.clientHeight;
        const dotHeight = activeDot.offsetHeight;
        const targetScroll = dotTop - containerHeight / 2 + dotHeight / 2;
        const maxScroll = progress.scrollHeight - containerHeight;
        progress.scrollTo({top: Math.max(0, Math.min(maxScroll, targetScroll)), behavior:'smooth'});
      }
    }

    function updateProgress(id){
      if(id === currentActiveId) return;
      const index = Math.max(0, posts.findIndex(post=>post.id === id));
      if(index < 0) return;
      currentActiveId = id;
      const dots = Array.from(document.querySelectorAll('.progress-dot'));
      dots.forEach((dot,dotIndex)=>{
        dot.classList.toggle('active', dot.dataset.post === id);
        dot.classList.toggle('visited', dotIndex <= index);
      });
      const current = progress.querySelector('.progress-current');
      if(current) current.textContent = String(index + 1).padStart(2,'0');
      const fill = progress.querySelector('.progress-rail-fill');
      if(fill){
        const percent = posts.length > 1 ? index / (posts.length - 1) * 100 : 100;
        fill.style.height = percent + '%';
        fill.style.width = percent + '%';
      }
      const activeTitle = progress.querySelector('.progress-active-title');
      if(activeTitle) activeTitle.textContent = titles[index] || '';
    }

    function restoreFromHash(){
      let targetId = '';
      const hashId = location.hash.replace('#','');
      if(hashId && document.getElementById(hashId)) targetId = hashId;
      else{
        try{
          const savedId = sessionStorage.getItem(STORAGE_KEY);
          if(savedId && document.getElementById(savedId)) targetId = savedId;
        }catch(e){}
      }
      if(!targetId) return false;

      const target = document.getElementById(targetId);
      suppressObserver = true;
      suppressDotsScroll = true;
      const previousSnap = feed.style.scrollSnapType;
      feed.style.scrollSnapType = 'none';

      const apply = ()=>{
        feed.scrollTop = target.offsetTop;
        updateProgress(targetId);
        scrollProgressDotsToActive();
      };

      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          apply();
          feed.style.scrollSnapType = previousSnap;
          suppressDotsScroll = false;
          setTimeout(()=>{suppressObserver = false;}, 900);
        });
      });
      return true;
    }
    updateProgress(posts[0].id);
    currentActiveId = posts[0].id;

    document.querySelectorAll('.like-action').forEach(button=>{
      button.addEventListener('click',()=>button.classList.toggle('active'));
    });

    document.querySelectorAll('[data-target]').forEach(button=>{
      button.addEventListener('click',()=>{
        scrollToPost(button.dataset.target, true);
      });
    });

    document.querySelectorAll('.progress-dot').forEach(button=>{
      button.addEventListener('click',()=>{
        scrollToPost(button.dataset.post, true);
      });
    });

    document.querySelectorAll('.action.share').forEach(button=>{
      button.addEventListener('click',()=>{
        const clickedPost = button.closest('.post');
        const activeDot = progress.querySelector('.progress-dot.active');
        const currentId = clickedPost ? clickedPost.id : activeDot ? activeDot.dataset.post : posts[0].id;
        const url = location.href.split('#')[0] + '#' + currentId;
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(url).then(()=>{
            showToast('Ссылка скопирована');
          }).catch(()=>{
            fallbackCopy(url);
          });
        }else{
          fallbackCopy(url);
        }
      });
    });

    function fallbackCopy(text){
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      try{document.execCommand('copy'); showToast('Ссылка скопирована');}catch(e){showToast('Не удалось скопировать');}
      document.body.removeChild(textarea);
    }

    let toastEl = null;
    let toastTimer = null;
    function showToast(message){
      if(!toastEl){
        toastEl = document.createElement('div');
        toastEl.className = 'share-toast';
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = message;
      toastEl.classList.add('visible');
      if(toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(()=>{toastEl.classList.remove('visible');}, 1800);
    }

    const observer = new IntersectionObserver(entries=>{
      if(suppressObserver) return;
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = entry.target.id;
          if(id === currentActiveId) return;
          const nav = entry.target.dataset.nav;
          updateProgress(id);
          navButtons.forEach(button=>button.classList.toggle('active',button.dataset.target===nav));
          if(!suppressDotsScroll) scrollProgressDotsToActive();
          try{sessionStorage.setItem(STORAGE_KEY, id);}catch(e){}
          if(!suppressHashScroll && location.hash.replace('#','') !== id){
            history.replaceState(null, '', '#' + id);
          }
          suppressHashScroll = false;
        }
      });
    },{root:feed,threshold:[0.55,0.85]});

    posts.forEach(post=>observer.observe(post));

    feed.addEventListener('scroll',()=>{
      if(suppressObserver) return;
      if(feed.scrollTimeout) clearTimeout(feed.scrollTimeout);
      feed.scrollTimeout = setTimeout(()=>{
        const scrollCenter = feed.scrollTop + feed.clientHeight / 2;
        let closest = posts[0];
        let closestDist = Infinity;
        for(const post of posts){
          const dist = Math.abs(post.offsetTop + post.offsetHeight / 2 - scrollCenter);
          if(dist < closestDist){closestDist = dist; closest = post;}
        }
        try{sessionStorage.setItem(STORAGE_KEY, closest.id);}catch(e){}
        if(location.hash.replace('#','') !== closest.id){
          history.replaceState(null, '', '#' + closest.id);
        }
        updateProgress(closest.id);
      }, 200);
    },{passive:true});

    window.addEventListener('keydown',event=>{
      if(event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const activeIndex = posts.findIndex(post=>Math.abs(post.getBoundingClientRect().top) < window.innerHeight * .4);
      const nextIndex = event.key === 'ArrowDown' ? Math.min(posts.length - 1, activeIndex + 1) : Math.max(0, activeIndex - 1);
      const next = posts[nextIndex];
      if(next) scrollToPost(next.id, true);
    });

    if(!restoreFromHash() && location.hash){
      // hash указан, но карточка не найдена — ничего не делаем
    }

    // Tooltip для всех элементов с data-tooltip (имитация)
    let tooltipEl = null;
    let activeTooltipTarget = null;
    let tooltipHideTimer = null;

    function ensureTooltip(){
      if(tooltipEl) return tooltipEl;
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'jx-tooltip';
      tooltipEl.setAttribute('role', 'tooltip');
      document.body.appendChild(tooltipEl);
      return tooltipEl;
    }

    function positionTooltip(target){
      const tip = ensureTooltip();
      const raw = target.dataset.tooltip || '';
      // Разделяем на префикс (например "Имитация") и остальной текст
      const m = raw.match(/^([^·•|·\s]+)\s*[·•|]\s*(.*)$/);
      let html;
      if(m){
        const word = m[1].trim();
        const rest = m[2].trim();
        html = '<span class="jx-tooltip-label"><b>' + escapeHtml(word) + '</b>' + escapeHtml(rest) + '</span>';
      }else{
        html = '<span class="jx-tooltip-label">' + escapeHtml(raw) + '</span>';
      }
      tip.innerHTML = html;
      tip.style.visibility = 'hidden';
      tip.classList.add('visible');
      tip.classList.remove('below');
      const tipRect = tip.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      const margin = 10;
      let top = rect.top + rect.height / 2 - tipRect.height / 2;
      let left = rect.left - tipRect.width - margin;
      let placed = 'left';
      // если не помещается слева — пробуем справа
      if(left < 8){
        left = rect.right + margin;
        placed = 'right';
      }
      // если не помещается справа — сверху (below)
      if(left + tipRect.width > window.innerWidth - 8){
        left = Math.max(8, rect.left + rect.width / 2 - tipRect.width / 2);
        top = rect.top - tipRect.height - margin;
        if(top < 8) top = rect.bottom + margin;
        tip.classList.add('below');
      }
      // вертикальные границы
      if(tip.classList.contains('below')){
        top = Math.max(8, Math.min(window.innerHeight - tipRect.height - 8, top));
      }else{
        top = Math.max(8, Math.min(window.innerHeight - tipRect.height - 8, top));
      }
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
      tip.style.visibility = 'visible';
    }

    function showTooltip(target){
      if(tooltipHideTimer){clearTimeout(tooltipHideTimer); tooltipHideTimer = null;}
      activeTooltipTarget = target;
      positionTooltip(target);
    }

    function hideTooltip(){
      activeTooltipTarget = null;
      if(tooltipHideTimer) clearTimeout(tooltipHideTimer);
      tooltipHideTimer = setTimeout(()=>{
        if(tooltipEl){
          tooltipEl.classList.remove('visible');
          tooltipEl.classList.remove('below');
        }
      }, 80);
    }

    document.body.addEventListener('mouseover', e=>{
      const target = e.target.closest('[data-tooltip]');
      if(target && target !== activeTooltipTarget){
        showTooltip(target);
      }
    });
    document.body.addEventListener('mouseout', e=>{
      const target = e.target.closest('[data-tooltip]');
      if(target){
        const related = e.relatedTarget;
        if(!related || !target.contains(related)){
          hideTooltip();
        }
      }
    });
    window.addEventListener('scroll', ()=>{if(activeTooltipTarget) hideTooltip();}, {passive:true});
    window.addEventListener('resize', ()=>{if(activeTooltipTarget) positionTooltip(activeTooltipTarget);});
  }

  setMeta();
  render();
  bind();
})();

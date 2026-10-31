/**
 * Mahmuda Khatun (Malala) Personal Portfolio
 * Main Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Data Initialization & Safe Fallback
  // -------------------------------------------------------------------------
  const data = (typeof PORTFOLIO_DATA !== 'undefined') ? PORTFOLIO_DATA : {
    images: [],
    videos: [],
    games: [],
    docs: [],
    profile: {}
  };

  // State Management
  let currentFilteredImages = [...data.images];
  let currentFilteredVideos = [...data.videos];
  let activeLightboxIndex = 0;

  // -------------------------------------------------------------------------
  // 2. Preloader & Smooth Entrance
  // -------------------------------------------------------------------------
  const preloader = document.getElementById('sitePreloader');
  const progressBar = document.getElementById('preloaderProgress');
  
  if (progressBar) {
    let progress = 10;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setTimeout(() => {
          if (preloader) preloader.classList.add('fade-out');
        }, 350);
      }
      progressBar.style.width = `${progress}%`;
    }, 60);
  } else if (preloader) {
    preloader.classList.add('fade-out');
  }

  // -------------------------------------------------------------------------
  // 3. Ambient Cursor Glow
  // -------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // -------------------------------------------------------------------------
  // 4. Header Scroll Spy & Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Scroll spy
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        mobileNavLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { passive: true });

  // Mobile Drawer toggles
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Interactive 3D Parallax Tilt
  // -------------------------------------------------------------------------
  const initTiltEffect = (element) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let bounds;
    let isHovered = false;

    const onMouseEnter = () => {
      bounds = element.getBoundingClientRect();
      isHovered = true;
    };

    const onMouseMove = (e) => {
      if (!isHovered) return;
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const normX = (mouseX / bounds.width) - 0.5;
      const normY = (mouseY / bounds.height) - 0.5;

      const tiltX = -normY * 12; // deg
      const tiltY = normX * 12;

      element.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const onMouseLeave = () => {
      isHovered = false;
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    element.addEventListener('mouseenter', onMouseEnter);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);
  };

  // Attach tilt to statically declared elements
  document.querySelectorAll('[data-tilt]').forEach(initTiltEffect);

  // -------------------------------------------------------------------------
  // 6. Section 3: Creative Works (Featured Spotlight)
  // -------------------------------------------------------------------------
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const featuredItems = [
      // Logo
      {
        type: 'logo',
        title: 'Official Personal Logo & Brand Crest',
        badge: 'Identity Crest',
        category: 'Brand Identity',
        file: data.profile.logo || 'assets/logo/mahmuda_khatun_logo.jpg',
        thumb: data.profile.logo || 'assets/logo/mahmuda_khatun_logo.jpg',
        desc: 'Royal golden crown and floral wreath crest framing the Mahmuda Khatun AI brandmark with original calligraphy and colors.',
        meta: 'SVG & High-Res JPEG'
      },
      // Top Videos
      ...data.videos.filter(v => v.featured).slice(0, 3).map(v => ({
        type: 'video',
        id: v.id,
        title: v.title,
        badge: 'Featured Video',
        category: v.category,
        file: v.file,
        thumb: v.thumbnail,
        desc: v.description,
        meta: `${v.duration} • ${v.resolution}`
      })),
      // Top Images
      ...data.images.filter(i => i.featured).slice(0, 4).map(i => ({
        type: 'image',
        id: i.id,
        title: i.title,
        badge: 'Featured Visual',
        category: i.category,
        file: i.file,
        thumb: i.file,
        desc: i.description,
        meta: `${i.dimensions} • ${i.size}`
      })),
      // Games
      ...data.games.map(g => ({
        type: 'game',
        id: g.id,
        title: g.title,
        badge: g.badge,
        category: g.category,
        file: g.file,
        thumb: g.previewImg || 'assets/images/ChatGPT_Image_Oct_4_2026_10_36_27_AM.png',
        desc: g.description,
        meta: 'Interactive Browser Project'
      }))
    ];

    featuredGrid.innerHTML = featuredItems.map((item, idx) => `
      <article class="featured-card glass-panel" data-tilt data-type="${item.type}" data-idx="${idx}">
        <div class="featured-media">
          <span class="featured-badge-pill">${item.badge}</span>
          <img src="${item.thumb}" alt="${item.title}" loading="lazy" onerror="this.src='assets/logo/mahmuda_khatun_logo.jpg'" />
          <div class="featured-overlay"></div>
        </div>
        <div class="featured-body">
          <h3 class="featured-title">${item.title}</h3>
          <p class="featured-desc">${item.desc}</p>
          <div class="featured-footer">
            <span class="featured-meta">${item.meta}</span>
            <button class="btn btn-sm btn-secondary btn-feature-act" data-type="${item.type}" data-file="${item.file}" data-title="${item.title}">
              <span>${item.type === 'game' ? 'Play' : item.type === 'video' ? 'Watch' : 'View'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    featuredGrid.querySelectorAll('.featured-card').forEach(initTiltEffect);

    // Event listeners for featured items
    featuredGrid.querySelectorAll('.btn-feature-act').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.dataset.type;
        const file = btn.dataset.file;
        const title = btn.dataset.title;

        if (type === 'image' || type === 'logo') {
          openLightboxBySrc(file, title);
        } else if (type === 'video') {
          const vidObj = data.videos.find(v => v.file === file) || { file, title, duration: '', resolution: '', description: '' };
          openVideoModal(vidObj);
        } else if (type === 'game') {
          openGameModal(file, title);
        }
      });
    });

    featuredGrid.querySelectorAll('.featured-card').forEach((card) => {
      card.addEventListener('click', () => {
        const btn = card.querySelector('.btn-feature-act');
        if (btn) btn.click();
      });
    });
  }

  // -------------------------------------------------------------------------
  // 7. Section 4: Image Gallery Rendering, Search & Categories
  // -------------------------------------------------------------------------
  const imagesGrid = document.getElementById('imagesGrid');
  const imageSearchInput = document.getElementById('imageSearchInput');
  const clearImageSearch = document.getElementById('clearImageSearch');
  const imageCategoryPills = document.getElementById('imageCategoryPills');
  const imagesEmptyState = document.getElementById('imagesEmptyState');
  const resetImagesFilter = document.getElementById('resetImagesFilter');

  let activeImageCategory = 'all';
  let activeImageQuery = '';

  const renderImages = () => {
    if (!imagesGrid) return;

    currentFilteredImages = data.images.filter((img) => {
      const matchesCategory = (activeImageCategory === 'all') || (img.category === activeImageCategory);
      const matchesQuery = !activeImageQuery || (
        img.title.toLowerCase().includes(activeImageQuery) ||
        img.description.toLowerCase().includes(activeImageQuery) ||
        img.category.toLowerCase().includes(activeImageQuery) ||
        img.tags.some(t => t.toLowerCase().includes(activeImageQuery))
      );
      return matchesCategory && matchesQuery;
    });

    if (currentFilteredImages.length === 0) {
      imagesGrid.style.display = 'none';
      if (imagesEmptyState) imagesEmptyState.style.display = 'block';
      return;
    }

    imagesGrid.style.display = 'grid';
    if (imagesEmptyState) imagesEmptyState.style.display = 'none';

    imagesGrid.innerHTML = currentFilteredImages.map((img, idx) => `
      <div class="image-card" data-tilt data-index="${idx}">
        <div class="image-card-thumb">
          <img src="${img.file}" alt="${img.title}" loading="lazy" onerror="this.onerror=null; this.src='assets/logo/mahmuda_khatun_logo.jpg';" />
          <span class="image-card-badge">${img.dimensions}</span>
          <div class="image-zoom-indicator">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          </div>
          <div class="image-overlay">
            <div class="image-overlay-info">
              <h4 class="image-card-title">${img.title}</h4>
              <div class="image-card-meta">
                <span class="image-card-cat">${img.category}</span>
                <span class="image-card-size">${img.size}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach tilt and click to new cards
    imagesGrid.querySelectorAll('.image-card').forEach((card) => {
      initTiltEffect(card);
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index, 10);
        openLightboxByIndex(idx);
      });
    });
  };

  // Image Category Filter Pills
  if (imageCategoryPills) {
    imageCategoryPills.querySelectorAll('.cat-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        imageCategoryPills.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeImageCategory = pill.dataset.filter;
        renderImages();
      });
    });
  }

  // Image Search
  if (imageSearchInput) {
    imageSearchInput.addEventListener('input', (e) => {
      activeImageQuery = e.target.value.trim().toLowerCase();
      if (clearImageSearch) {
        clearImageSearch.classList.toggle('visible', activeImageQuery.length > 0);
      }
      renderImages();
    });
  }

  if (clearImageSearch) {
    clearImageSearch.addEventListener('click', () => {
      imageSearchInput.value = '';
      activeImageQuery = '';
      clearImageSearch.classList.remove('visible');
      renderImages();
    });
  }

  if (resetImagesFilter) {
    resetImagesFilter.addEventListener('click', () => {
      activeImageCategory = 'all';
      activeImageQuery = '';
      if (imageSearchInput) imageSearchInput.value = '';
      if (clearImageSearch) clearImageSearch.classList.remove('visible');
      if (imageCategoryPills) {
        imageCategoryPills.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        const allPill = imageCategoryPills.querySelector('[data-filter="all"]');
        if (allPill) allPill.classList.add('active');
      }
      renderImages();
    });
  }

  // Initial render of images
  renderImages();

  // -------------------------------------------------------------------------
  // 8. Section 5: Video Gallery Rendering & Interactive Hover Preview
  // -------------------------------------------------------------------------
  const videosGrid = document.getElementById('videosGrid');
  const videoSearchInput = document.getElementById('videoSearchInput');
  const clearVideoSearch = document.getElementById('clearVideoSearch');
  const videoCategoryPills = document.getElementById('videoCategoryPills');
  const videosEmptyState = document.getElementById('videosEmptyState');
  const resetVideosFilter = document.getElementById('resetVideosFilter');

  let activeVideoCategory = 'all';
  let activeVideoQuery = '';

  const renderVideos = () => {
    if (!videosGrid) return;

    currentFilteredVideos = data.videos.filter((vid) => {
      const matchesCategory = (activeVideoCategory === 'all') || (vid.category === activeVideoCategory);
      const matchesQuery = !activeVideoQuery || (
        vid.title.toLowerCase().includes(activeVideoQuery) ||
        vid.description.toLowerCase().includes(activeVideoQuery) ||
        vid.category.toLowerCase().includes(activeVideoQuery) ||
        vid.tags.some(t => t.toLowerCase().includes(activeVideoQuery))
      );
      return matchesCategory && matchesQuery;
    });

    if (currentFilteredVideos.length === 0) {
      videosGrid.style.display = 'none';
      if (videosEmptyState) videosEmptyState.style.display = 'block';
      return;
    }

    videosGrid.style.display = 'grid';
    if (videosEmptyState) videosEmptyState.style.display = 'none';

    videosGrid.innerHTML = currentFilteredVideos.map((vid, idx) => `
      <div class="video-card glass-panel" data-tilt data-index="${idx}">
        <div class="video-thumb-wrap">
          <span class="video-res-pill">${vid.resolution}</span>
          <span class="video-duration-pill">${vid.duration}</span>
          
          <img src="${vid.thumbnail}" alt="${vid.title} Poster" class="video-poster-img" loading="lazy" onerror="this.src='assets/logo/mahmuda_khatun_logo.jpg';" />
          
          <video class="video-hover-preview" muted loop playsinline preload="none">
            <source src="${vid.file}" type="video/mp4" />
          </video>

          <div class="video-play-overlay">
            <div class="play-circle-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
            </div>
          </div>
        </div>

        <div class="video-card-body">
          <h4 class="video-card-title">${vid.title}</h4>
          <p class="video-card-desc">${vid.description}</p>
          <div class="video-card-footer">
            <span class="video-cat-badge">${vid.category}</span>
            <span class="video-size-badge">${vid.size}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Attach tilt and hover preview
    videosGrid.querySelectorAll('.video-card').forEach((card) => {
      initTiltEffect(card);

      const previewVideo = card.querySelector('.video-hover-preview');
      let playPromise = null;

      card.addEventListener('mouseenter', () => {
        if (previewVideo && window.matchMedia('(pointer: fine)').matches) {
          previewVideo.classList.add('playing');
          previewVideo.currentTime = 0;
          playPromise = previewVideo.play().catch(() => {});
        }
      });

      card.addEventListener('mouseleave', () => {
        if (previewVideo && window.matchMedia('(pointer: fine)').matches) {
          previewVideo.classList.remove('playing');
          if (playPromise !== null) {
            playPromise.then(() => {
              previewVideo.pause();
            }).catch(() => {
              previewVideo.pause();
            });
          } else {
            previewVideo.pause();
          }
        }
      });

      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index, 10);
        const vidObj = currentFilteredVideos[idx];
        if (vidObj) openVideoModal(vidObj);
      });
    });
  };

  // Video Filter Pills
  if (videoCategoryPills) {
    videoCategoryPills.querySelectorAll('.cat-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        videoCategoryPills.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeVideoCategory = pill.dataset.filter;
        renderVideos();
      });
    });
  }

  // Video Search
  if (videoSearchInput) {
    videoSearchInput.addEventListener('input', (e) => {
      activeVideoQuery = e.target.value.trim().toLowerCase();
      if (clearVideoSearch) {
        clearVideoSearch.classList.toggle('visible', activeVideoQuery.length > 0);
      }
      renderVideos();
    });
  }

  if (clearVideoSearch) {
    clearVideoSearch.addEventListener('click', () => {
      videoSearchInput.value = '';
      activeVideoQuery = '';
      clearVideoSearch.classList.remove('visible');
      renderVideos();
    });
  }

  if (resetVideosFilter) {
    resetVideosFilter.addEventListener('click', () => {
      activeVideoCategory = 'all';
      activeVideoQuery = '';
      if (videoSearchInput) videoSearchInput.value = '';
      if (clearVideoSearch) clearVideoSearch.classList.remove('visible');
      if (videoCategoryPills) {
        videoCategoryPills.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        const allPill = videoCategoryPills.querySelector('[data-filter="all"]');
        if (allPill) allPill.classList.add('active');
      }
      renderVideos();
    });
  }

  // Initial render of videos
  renderVideos();

  // -------------------------------------------------------------------------
  // 9. Lightbox Modal for Images
  // -------------------------------------------------------------------------
  const imageLightboxModal = document.getElementById('imageLightboxModal');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxTags = document.getElementById('lightboxTags');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  const updateLightboxContent = () => {
    const imgObj = currentFilteredImages[activeLightboxIndex];
    if (!imgObj) return;

    lightboxTitle.textContent = imgObj.title;
    lightboxMeta.textContent = `${imgObj.category} • ${imgObj.dimensions} • ${imgObj.size}`;
    lightboxImg.src = imgObj.file;
    lightboxImg.alt = imgObj.title;
    lightboxCaption.textContent = imgObj.description;
    lightboxDownloadBtn.href = imgObj.file;
    lightboxDownloadBtn.setAttribute('download', imgObj.originalName || `${imgObj.title}.jpg`);

    lightboxTags.innerHTML = (imgObj.tags || []).map(t => `<span class="code-pill">${t}</span>`).join('');
  };

  const openLightboxByIndex = (index) => {
    if (!imageLightboxModal || !currentFilteredImages.length) return;
    activeLightboxIndex = (index >= 0 && index < currentFilteredImages.length) ? index : 0;
    updateLightboxContent();
    imageLightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const openLightboxBySrc = (src, title) => {
    const idx = currentFilteredImages.findIndex(img => img.file === src);
    if (idx !== -1) {
      openLightboxByIndex(idx);
    } else {
      lightboxTitle.textContent = title || 'Visual Asset';
      lightboxMeta.textContent = 'Official Desktop Asset';
      lightboxImg.src = src;
      lightboxCaption.textContent = title;
      lightboxDownloadBtn.href = src;
      lightboxTags.innerHTML = '';
      imageLightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (!imageLightboxModal) return;
    imageLightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (imageLightboxModal) {
    imageLightboxModal.addEventListener('click', (e) => {
      if (e.target === imageLightboxModal) closeLightbox();
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeLightboxIndex = (activeLightboxIndex - 1 + currentFilteredImages.length) % currentFilteredImages.length;
      updateLightboxContent();
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activeLightboxIndex = (activeLightboxIndex + 1) % currentFilteredImages.length;
      updateLightboxContent();
    });
  }

  // -------------------------------------------------------------------------
  // 10. Video Player Modal
  // -------------------------------------------------------------------------
  const videoPlayerModal = document.getElementById('videoPlayerModal');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalMeta = document.getElementById('videoModalMeta');
  const modalVideoElement = document.getElementById('modalVideoElement');
  const modalVideoSource = document.getElementById('modalVideoSource');
  const videoModalDesc = document.getElementById('videoModalDesc');
  const videoModalTags = document.getElementById('videoModalTags');
  const videoDownloadBtn = document.getElementById('videoDownloadBtn');
  const videoCloseBtn = document.getElementById('videoCloseBtn');

  const openVideoModal = (vidObj) => {
    if (!videoPlayerModal) return;
    videoModalTitle.textContent = vidObj.title;
    videoModalMeta.textContent = `${vidObj.category} • ${vidObj.duration} • ${vidObj.resolution}`;
    videoModalDesc.textContent = vidObj.description;
    videoDownloadBtn.href = vidObj.file;
    videoDownloadBtn.setAttribute('download', vidObj.originalName || `${vidObj.title}.mp4`);

    modalVideoSource.src = vidObj.file;
    modalVideoElement.load();
    modalVideoElement.play().catch(() => {});

    videoModalTags.innerHTML = (vidObj.tags || []).map(t => `<span class="code-pill">${t}</span>`).join('');

    videoPlayerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    if (!videoPlayerModal) return;
    modalVideoElement.pause();
    modalVideoSource.src = '';
    videoPlayerModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (videoCloseBtn) videoCloseBtn.addEventListener('click', closeVideoModal);
  if (videoPlayerModal) {
    videoPlayerModal.addEventListener('click', (e) => {
      if (e.target === videoPlayerModal) closeVideoModal();
    });
  }

  // -------------------------------------------------------------------------
  // 11. Games & Apps Modal
  // -------------------------------------------------------------------------
  const gamePlayerModal = document.getElementById('gamePlayerModal');
  const gameModalTitle = document.getElementById('gameModalTitle');
  const gameModalMeta = document.getElementById('gameModalMeta');
  const gameIframe = document.getElementById('gameIframe');
  const gameReloadBtn = document.getElementById('gameReloadBtn');
  const gameNewTabBtn = document.getElementById('gameNewTabBtn');
  const gameCloseBtn = document.getElementById('gameCloseBtn');

  let currentGameSrc = '';

  const openGameModal = (fileSrc, title) => {
    if (!gamePlayerModal || !gameIframe) return;
    currentGameSrc = fileSrc;
    gameModalTitle.textContent = title;
    gameModalMeta.textContent = fileSrc.includes('bear') ? 'Arcade Game • Procedural Canvas' : 'Interactive Utility Tool';
    gameIframe.src = fileSrc;
    gameNewTabBtn.href = fileSrc;

    gamePlayerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeGameModal = () => {
    if (!gamePlayerModal || !gameIframe) return;
    gameIframe.src = 'about:blank';
    gamePlayerModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (gameReloadBtn) {
    gameReloadBtn.addEventListener('click', () => {
      if (gameIframe && currentGameSrc) gameIframe.src = currentGameSrc;
    });
  }

  if (gameCloseBtn) gameCloseBtn.addEventListener('click', closeGameModal);
  if (gamePlayerModal) {
    gamePlayerModal.addEventListener('click', (e) => {
      if (e.target === gamePlayerModal) closeGameModal();
    });
  }

  // Games Section launch buttons
  const btnLaunchBearGame = document.getElementById('btnLaunchBearGame');
  const btnLaunchBearGameModal = document.getElementById('btnLaunchBearGameModal');
  const btnLaunchCalcModal = document.getElementById('btnLaunchCalcModal');
  const btnLaunchCalcModal2 = document.getElementById('btnLaunchCalcModal2');

  if (btnLaunchBearGame) btnLaunchBearGame.addEventListener('click', () => openGameModal('assets/games/bear-chase-game.html', 'Bear Chase Run 🐻'));
  if (btnLaunchBearGameModal) btnLaunchBearGameModal.addEventListener('click', () => openGameModal('assets/games/bear-chase-game.html', 'Bear Chase Run 🐻'));
  if (btnLaunchCalcModal) btnLaunchCalcModal.addEventListener('click', () => openGameModal('assets/games/calculator.html', 'Precision Glassmorphism Calculator'));
  if (btnLaunchCalcModal2) btnLaunchCalcModal2.addEventListener('click', () => openGameModal('assets/games/calculator.html', 'Precision Glassmorphism Calculator'));

  // -------------------------------------------------------------------------
  // 12. Documents Preview Modal
  // -------------------------------------------------------------------------
  const docPreviewModal = document.getElementById('docPreviewModal');
  const docModalTitle = document.getElementById('docModalTitle');
  const docModalMeta = document.getElementById('docModalMeta');
  const docModalDownloadBtn = document.getElementById('docModalDownloadBtn');
  const docCloseBtn = document.getElementById('docCloseBtn');
  const docStageContainer = document.getElementById('docStageContainer');

  const openDocModal = (fileSrc, title, type = 'pdf') => {
    if (!docPreviewModal || !docStageContainer) return;
    docModalTitle.textContent = title;
    docModalMeta.textContent = type === 'pdf' ? 'Official PDF Document' : 'Verified Assessment Certificate';
    docModalDownloadBtn.href = fileSrc;
    docModalDownloadBtn.setAttribute('download', fileSrc.split('/').pop());

    if (type === 'pdf') {
      docStageContainer.innerHTML = `<iframe src="${fileSrc}" class="doc-modal-frame" title="${title}"></iframe>`;
    } else {
      docStageContainer.innerHTML = `<img src="${fileSrc}" alt="${title}" style="max-width:95%; max-height:95%; object-fit:contain; border-radius:10px; box-shadow:0 10px 40px rgba(0,0,0,0.8);" />`;
    }

    docPreviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDocModal = () => {
    if (!docPreviewModal || !docStageContainer) return;
    docStageContainer.innerHTML = '';
    docPreviewModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (docCloseBtn) docCloseBtn.addEventListener('click', closeDocModal);
  if (docPreviewModal) {
    docPreviewModal.addEventListener('click', (e) => {
      if (e.target === docPreviewModal) closeDocModal();
    });
  }

  // Document Launch buttons
  const btnPreviewCv = document.getElementById('btnPreviewCv');
  const btnViewCvDoc = document.getElementById('btnViewCvDoc');
  const btnViewScoreDoc = document.getElementById('btnViewScoreDoc');
  const btnViewAiTrainDoc = document.getElementById('btnViewAiTrainDoc');

  if (btnPreviewCv) btnPreviewCv.addEventListener('click', () => openDocModal('assets/docs/MAHMUDA-Resume.pdf', 'Mahmuda Khatun — Official CV', 'pdf'));
  if (btnViewCvDoc) btnViewCvDoc.addEventListener('click', () => openDocModal('assets/docs/MAHMUDA-Resume.pdf', 'Mahmuda Khatun — Official CV', 'pdf'));
  if (btnViewScoreDoc) btnViewScoreDoc.addEventListener('click', () => openDocModal('assets/images/Apnar_Projukti_Gyan_Score_60.png', 'Technology Knowledge Assessment Report (Malala Rahman)', 'img'));
  if (btnViewAiTrainDoc) btnViewAiTrainDoc.addEventListener('click', () => openDocModal('assets/docs/AI-Training-Module.pdf', 'AI Based Basic Technology Training Module', 'pdf'));

  // -------------------------------------------------------------------------
  // 13. Global Keyboard Shortcuts (Escape, ArrowLeft, ArrowRight)
  // -------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeVideoModal();
      closeGameModal();
      closeDocModal();
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    } else if (imageLightboxModal && imageLightboxModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft' && lightboxPrevBtn) {
        lightboxPrevBtn.click();
      } else if (e.key === 'ArrowRight' && lightboxNextBtn) {
        lightboxNextBtn.click();
      }
    }
  });

  // -------------------------------------------------------------------------
  // 14. Contact Form Validation & Submission
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      let isValid = true;

      // Validate name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate subject
      if (!subjectInput.value) {
        subjectInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        subjectInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate message
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (!isValid) return;

      // Success feedback
      const submitBtn = document.getElementById('btnSubmitForm');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Message Sent!</span>
        `;

        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.style.display = 'block';
          formStatus.innerHTML = `
            <strong>Thank you, ${nameInput.value.trim()}!</strong>
            <p>Your message regarding <em>${subjectInput.value}</em> has been prepared. You can also send directly via email client:</p>
            <a href="mailto:mahmuda.khatun.portfolio@gmail.com?subject=${encodeURIComponent(subjectInput.value)}&body=${encodeURIComponent(messageInput.value)}" class="btn btn-sm btn-primary" style="margin-top:0.75rem; display:inline-flex;">Open in Email App</a>
          `;
        }

        contactForm.reset();
      }, 700);
    });
  }

  // -------------------------------------------------------------------------
  // 15. Dynamic Metrics Counter
  // -------------------------------------------------------------------------
  const statImages = document.getElementById('statImages');
  const statVideos = document.getElementById('statVideos');
  const countImgAll = document.getElementById('countImgAll');
  const countVidAll = document.getElementById('countVidAll');

  if (statImages) statImages.textContent = `${data.images.length}+`;
  if (statVideos) statVideos.textContent = `${data.videos.length}+`;
  if (countImgAll) countImgAll.textContent = `${data.images.length}`;
  if (countVidAll) countVidAll.textContent = `${data.videos.length}`;

  console.log(`Portfolio initialized successfully: ${data.images.length} images, ${data.videos.length} videos, ${data.games.length} games.`);
});

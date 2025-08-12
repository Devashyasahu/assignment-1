/*
  ==============================================
  Book Interaction Logic
  - Handles continuous scroll-driven book opening.
  - Creates smooth, realistic page turning animation.
  - Manages scroll progress and rotation angles.
  ==============================================
  */
  const book = document.getElementById('book');
  const cover = document.getElementById('cover');
  const pages = document.querySelectorAll('.page');
  const body = document.body;
  const pageElements = [cover, ...pages];
  
  // Store how much the book has been opened (0 = closed, 1 = fully open)
  let scrollProgress = 0;
  let isAnimating = false;

  function updateBookRotation(progress) {
    // Calculate rotation for each page element
    pageElements.forEach((element, index) => {
      const totalPages = pageElements.length;
      const pageThreshold = index / totalPages;
      const nextThreshold = (index + 1) / totalPages;
      
      let rotation = 0;
      if (progress >= pageThreshold) {
        // Page should be turning or turned
        const pageProgress = Math.min(1, (progress - pageThreshold) / (nextThreshold - pageThreshold));
        rotation = pageProgress * -180;
      }
      
      element.style.transform = `rotateY(${rotation}deg)`;
      
      // Add shadow effects during rotation
      if (rotation > -90 && rotation < 0) {
        const shadowIntensity = Math.abs(rotation) / 90;
        element.style.boxShadow = `-${15 + shadowIntensity * 10}px 0 ${30 + shadowIntensity * 20}px rgba(0, 0, 0, ${0.2 + shadowIntensity * 0.3})`;
      } else if (rotation <= -90) {
        element.style.boxShadow = '-25px 0 50px rgba(0, 0, 0, 0.5)';
      } else {
        element.style.boxShadow = '';
      }
    });
    
    // Update book open state
    if (progress > 0) {
      book.classList.add('open');
    } else {
      book.classList.remove('open');
    }
    
    // Control page scrolling
    if (progress >= 1) {
      body.style.overflow = 'auto';
    } else {
      body.style.overflow = 'hidden';
    }
  }

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // Smooth scroll sensitivity
    const scrollSensitivity = 0.0015;
    scrollProgress += e.deltaY * scrollSensitivity;
    
    // Clamp progress between 0 and 1
    scrollProgress = Math.max(0, Math.min(1, scrollProgress));
    
    // Update book rotation
    updateBookRotation(scrollProgress);
    
    // Throttle rapid scrolling
    if (!isAnimating) {
      isAnimating = true;
      setTimeout(() => { isAnimating = false; }, 50);
    }
  }, { passive: false });
  
  // Initialize book in closed state
  updateBookRotation(0);

  /*
  ==============================================
  Form Submission & Confetti
  - Handles the volunteer form submission with visual feedback.
  - Triggers a confetti animation for a celebratory effect.
  ==============================================
  */
  const form = document.getElementById('volForm');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = form.name.value.trim() || "Friend";
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = "Thanks, " + (name.split(' ')[0] || name) + "!";
    btn.style.background = "linear-gradient(90deg, #6d2f08, #8b4513)";
    burstConfetti(btn);
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Join the Team";
      btn.style.background = "";
      form.reset();
    }, 2200);
  });

  function burstConfetti(anchor) {
    const root = document.createElement('div');
    root.style.position = 'fixed';
    root.style.left = '50%';
    root.style.top = '50%';
    root.style.transform = 'translate(-50%, -50%)';
    root.style.pointerEvents = 'none';
    root.style.zIndex = 9999;
    document.body.appendChild(root);
    const colors = ['#f94144', '#f9c74f', '#90be6d', '#577590', '#f9844a', '#277da1'];
    for (let i = 0; i < 28; i++) {
      const s = document.createElement('div');
      const size = 6 + Math.random() * 10;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.background = colors[Math.floor(Math.random() * colors.length)];
      s.style.position = 'absolute';
      s.style.left = '0';
      s.style.top = '0';
      s.style.borderRadius = (Math.random() > 0.6 ? '3px' : '50%');
      s.style.opacity = 1;
      s.style.transform = `translate3d(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px, 0) rotate(${Math.random() * 360}deg)`;
      s.style.transition = 'transform 1.2s cubic-bezier(.2,.8,.2,1), opacity 1.2s ease';
      root.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate3d(${(Math.random() - 0.5) * 450}px, ${-200 - Math.random() * 200}px, 0) rotate(${Math.random() * 720}deg)`;
        s.style.opacity = 0;
      });
    }
    setTimeout(() => root.remove(), 1300);
  }
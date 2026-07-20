document.addEventListener('DOMContentLoaded', () => {
    // Initial load animations
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.slide-up');
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Video Modal Logic
    const videoTriggers = document.querySelectorAll('.video-preview-trigger');
    const modalOverlay = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const muteBtn = document.getElementById('mute-btn');
    const iconUnmuted = document.getElementById('icon-unmuted');
    const iconMuted = document.getElementById('icon-muted');

    if (modalOverlay && modalVideo) {
        // Open Modal
        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const videoSrc = trigger.getAttribute('data-video-src');
                if (videoSrc) {
                    modalVideo.src = videoSrc;
                }
                modalOverlay.classList.add('active');
                modalVideo.currentTime = 0; // Restart video
                modalVideo.play();
            });
        });

        // Close Modal logic
        const closeModal = () => {
            modalOverlay.classList.remove('active');
            modalVideo.pause();
        };

        closeModalBtn.addEventListener('click', closeModal);

        // Click outside video to close
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Mute/Unmute Logic
        muteBtn.addEventListener('click', () => {
            modalVideo.muted = !modalVideo.muted;
            if (modalVideo.muted) {
                iconUnmuted.classList.add('hidden');
                iconMuted.classList.remove('hidden');
            } else {
                iconUnmuted.classList.remove('hidden');
                iconMuted.classList.add('hidden');
            }
        });
    }
    // Hamburger Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            // Prevent body scrolling when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // Carousel Scroll Progress & Arrow Logic
    const carousels = document.querySelectorAll('.carousel-wrapper');
    
    carousels.forEach(wrapper => {
        const scrollArea = wrapper.querySelector('.carousel-scroll-area');
        const progressBar = wrapper.querySelector('.progress-fill');
        const prevBtn = wrapper.querySelector('.prev-arrow');
        const nextBtn = wrapper.querySelector('.next-arrow');
        
        if (scrollArea) {
            const updateProgress = () => {
                if (!progressBar) return;
                const scrollLeft = scrollArea.scrollLeft;
                const scrollWidth = scrollArea.scrollWidth - scrollArea.clientWidth;
                
                if (scrollWidth > 0) {
                    const scrollPercentage = (scrollLeft / scrollWidth) * 100;
                    progressBar.style.width = `${scrollPercentage}%`;
                } else {
                    progressBar.style.width = '0%';
                }
            };

            scrollArea.addEventListener('scroll', updateProgress, { passive: true });
            window.addEventListener('resize', updateProgress);
            
            // Initial call
            setTimeout(updateProgress, 100);
            
            // Arrow Looping Logic
            if (prevBtn && nextBtn) {
                const getScrollAmount = () => {
                    const firstItem = scrollArea.firstElementChild;
                    return firstItem ? firstItem.offsetWidth + 30 : scrollArea.clientWidth * 0.5;
                };

                nextBtn.addEventListener('click', () => {
                    const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;
                    if (scrollArea.scrollLeft >= maxScroll - 10) { // At the end, loop to start
                        scrollArea.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scrollArea.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                    }
                });
                
                prevBtn.addEventListener('click', () => {
                    if (scrollArea.scrollLeft <= 10) { // At the start, loop to end
                        const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;
                        scrollArea.scrollTo({ left: maxScroll, behavior: 'smooth' });
                    } else {
                        scrollArea.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                    }
                });
            }
        }
    });

    // Stop iframe videos when they scroll out of view
    const allIframes = document.querySelectorAll('.carousel-scroll-area iframe');
    if ('IntersectionObserver' in window) {
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When an iframe goes out of view, reset its source to stop it from playing in the background
                if (!entry.isIntersecting) {
                    const iframe = entry.target;
                    const currentSrc = iframe.src;
                    if (currentSrc && currentSrc !== 'about:blank' && currentSrc.includes('drive.google.com')) {
                        iframe.dataset.src = currentSrc;
                        iframe.src = 'about:blank';
                    }
                } else {
                    const iframe = entry.target;
                    if (iframe.src === 'about:blank' || iframe.src === '' || iframe.src === window.location.href) {
                        iframe.src = iframe.dataset.src;
                    }
                }
            });
        }, { threshold: 0.2 });

        allIframes.forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }

    // Timeline Scroll Animation
    const experienceSection = document.getElementById('experience');
    const timelineProgress = document.getElementById('timelineProgress');

    if (experienceSection && timelineProgress) {
        window.addEventListener('scroll', () => {
            const sectionRect = experienceSection.getBoundingClientRect();
            const viewportMiddle = window.innerHeight / 2;
            let progress = 0;
            
            if (sectionRect.top < viewportMiddle) {
                const scrollDistance = viewportMiddle - sectionRect.top;
                const totalDistance = sectionRect.height;
                progress = (scrollDistance / totalDistance) * 100;
                progress = Math.max(0, Math.min(100, progress));
            }
            
            timelineProgress.style.height = `${progress}%`;
        });
        window.dispatchEvent(new Event('scroll'));
    }

    // Coverflow effect for Long Format videos
    const longGrid = document.querySelector('.long-grid');
    const longPreviews = document.querySelectorAll('.long-preview');

    if (longGrid && longPreviews.length > 0) {
        const updateCoverflow = () => {
            if (window.innerWidth < 1025) return; // Only on desktop
            const gridCenter = longGrid.getBoundingClientRect().left + (longGrid.clientWidth / 2);
            
            let closestPreview = null;
            let minDistance = Infinity;

            longPreviews.forEach(preview => {
                const rect = preview.getBoundingClientRect();
                const previewCenter = rect.left + (rect.width / 2);
                const distanceFromCenter = Math.abs(gridCenter - previewCenter);
                
                if (distanceFromCenter < minDistance) {
                    minDistance = distanceFromCenter;
                    closestPreview = preview;
                }
                
                // Remove active class from all first
                preview.classList.remove('active-center');
            });

            if (closestPreview) {
                closestPreview.classList.add('active-center');
            }
        };

        longGrid.addEventListener('scroll', updateCoverflow);
        window.addEventListener('resize', updateCoverflow);
        setTimeout(updateCoverflow, 100);
    }
});

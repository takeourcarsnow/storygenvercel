document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const elements = {
        body: document.body,
        themeToggle: document.getElementById('theme-toggle'),
        ageSlider: document.getElementById('age-slider'),
        ageDescription: document.getElementById('age-description'),
        generateBtn: document.getElementById('generate-btn'),
        storyContainer: document.querySelector('.story-container'),
        storyContent: document.querySelector('.story-content'),
        storyText: document.getElementById('story-text'),
        loadingAnimation: document.querySelector('.loading-animation'),
        shareButtons: document.querySelector('.share-buttons'),
        copyBtn: document.getElementById('copy-btn'),
        newStoryBtn: document.getElementById('new-story-btn')
    };

    // Constants
    const LOADING_MESSAGES = [
        "Renkamos idėjos... ✨",
        "Mezgama istorija... 🧶",
        "Kuriami veikėjai... 👥",
        "Piešiami vaizdai... 🎨",
        "Dėliojami žodžiai... 📝",
        "Beriami burtai... 🪄",
        "Pridedama magijos... ✨",
        "Tikrinama gramatika... 📚",
        "Puošiama istorija... 🎭",
        "Baigiami paskutiniai potėpiai... 🖌️"
    ];

    const AGE_RANGES = {
        1: { text: '3-6 metų vaikams', emoji: '👶' },
        2: { text: '7-9 metų vaikams', emoji: '📖' },
        3: { text: '10-12 metų vaikams', emoji: '📚' },
        4: { text: '13+ metų vaikams', emoji: '🎯' }
    };

    // Story options
    const options = {
        time: ["Seniai seniai", "Ateityje", "Dabar", "Žiemą", "Vasarą", "Paslaptingą naktį", "Prieš šimtą metų", "Sapnų karalystėje", "Saulėtą rytą", "Rudens popietę", "Mėnesienoje", "Aušros metu", "Per Kalėdas", "Pavasario žydėjime", "Vidurnaktį"],
        place: ["Stebuklingame miške", "Pilyje", "Kosmose", "Po vandeniu", "Debesų karalystėje", "Saldainių šalyje", "Požemių labirinte", "Milžinų šalyje", "Nykštukų kaimelyje", "Krištolo oloje", "Vaivorykštės tilte", "Šokolado fabrike", "Ledo rūmuose", "Paslaptingoje bibliotekoje", "Skraidančioje saloje", "Gintaro pilyje", "Povandeniniame mieste", "Žvaigždžių uoste", "Stebuklingame sode", "Veidrodžių labirinte"],
        character: ["Princesė ir drakonas", "Nykštukai", "Kalbantys gyvūnai", "Burtininkai", "Robotai", "Drąsus riteris ir fėja", "Išmintinga pelėda", "Maži elfai", "Skraidantis vienaragis", "Linksmasis trolis", "Stebuklingas katinas", "Mažasis astronautas", "Drąsusis liūtukas", "Šokanti undinėlė", "Išradingasis nykštukas", "Muzikantas lokys", "Skraidantis dailininkas", "Miegantis milžinas", "Stebuklinga varlė", "Šaunusis piratas"],
        mood: ["Linksma", "Nuotykių", "Paslaptinga", "Stebuklinga", "Draugiška", "Pamokanti", "Juokinga", "Romantiška", "Jaudinanti", "Įkvepianti", "Džiaugsminga", "Išdykusi", "Šilta", "Žaisminga", "Svajonių", "Drąsi", "Magijos kupina", "Netikėta", "Šmaikšti", "Jautri"]
    };

    // Theme handling
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        elements.body.classList.add(`${savedTheme}-theme`);
    };

    const toggleTheme = () => {
        elements.body.classList.toggle('light-theme');
        elements.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', elements.body.classList.contains('light-theme') ? 'light' : 'dark');
    };

    // Age slider handling
    const updateAgeDescription = (value) => {
        const { text, emoji } = AGE_RANGES[value];
        elements.ageDescription.innerHTML = `<span class="age-emoji">${emoji}</span><span class="age-text">${text}</span>`;
    };

    // Loading animation
    const showLoadingAnimation = () => {
        const loadingMessages = elements.loadingAnimation.querySelector('.loading-messages');
        const sparklesContainer = elements.loadingAnimation.querySelector('.loading-sparkles');
        let messageIndex = 0;

        elements.storyContainer.style.display = 'block';
        elements.loadingAnimation.classList.add('visible');
        elements.storyContent.style.display = 'none';

        // Create sparkles
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.innerHTML = '✨';
            sparkle.style.setProperty('--tx', `${Math.random() * 200 - 100}px`);
            sparkle.style.setProperty('--ty', `${Math.random() * 200 - 100}px`);
            sparklesContainer.appendChild(sparkle);
        }

        const messageInterval = setInterval(() => {
            loadingMessages.textContent = LOADING_MESSAGES[messageIndex];
            messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        }, 2000);

        return () => {
            clearInterval(messageInterval);
            elements.loadingAnimation.classList.remove('visible');
            sparklesContainer.innerHTML = '';
        };
    };

    // Typewriter effect
    const typewriterEffect = (element, text, speed = 30) => {
        return new Promise(resolve => {
            let i = 0;
            element.innerHTML = '';
            
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.innerHTML = '|';
            element.appendChild(cursor);

            const type = () => {
                if (i < text.length) {
                    if (text.charAt(i) === '\n') {
                        element.insertBefore(document.createElement('br'), cursor);
                    } else {
                        element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                    }
                    i++;
                    setTimeout(type, speed);
                } else {
                    cursor.remove();
                    resolve();
                }
            };

            type();
        });
    };

    // Initialize swipers with random selection (avoiding first and last slides)
const initializeSwipers = () => {
    const swiperElements = {
        time: '.time-swiper',
        place: '.place-swiper',
        character: '.character-swiper',
        mood: '.mood-swiper'
    };

    const swipers = {};
    
    // Get random initial slides for each swiper (avoiding first and last)
    const getRandomInitialSlides = () => {
        const selections = {};
        
        for (const [key, selector] of Object.entries(swiperElements)) {
            const totalSlides = document.querySelectorAll(`${selector} .swiper-slide`).length;
            // Exclude first and last slides from random selection
            const minIndex = 1; // Skip first slide
            const maxIndex = totalSlides - 2; // Skip last slide
            selections[key] = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
        }
        
        return selections;
    };

    const initialSlides = getRandomInitialSlides();
    
    // Initialize each swiper with its random initial slide
    for (const [key, elementSelector] of Object.entries(swiperElements)) {
        const element = document.querySelector(elementSelector);
        swipers[key] = new Swiper(element, {
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
            initialSlide: initialSlides[key], // Set random initial slide (excluding first and last)
            navigation: {
                nextEl: element.querySelector('.swiper-button-next'),
                prevEl: element.querySelector('.swiper-button-prev')
            },
            pagination: {
                el: element.querySelector('.swiper-pagination'),
                clickable: true
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                968: { slidesPerView: 3 }
            }
        });
    }
    return swipers;
};

    // Story display
    const displayStory = async (story) => {
        elements.storyContainer.style.display = 'block';
        elements.storyContent.style.display = 'block';
        elements.shareButtons.style.display = 'none';
        elements.storyText.innerHTML = '';

        elements.storyContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        await typewriterEffect(elements.storyText, story);

        elements.shareButtons.style.display = 'flex';
        elements.shareButtons.style.opacity = '0';
        setTimeout(() => {
            elements.shareButtons.style.transition = 'opacity 0.5s ease';
            elements.shareButtons.style.opacity = '1';
        }, 100);
    };

    // Generate button handler
    const handleGenerateClick = async () => {
        const getSelectedValue = (swiperClass) => 
            document.querySelector(`${swiperClass} .swiper-slide-active`)?.dataset.value;

        const selectedValues = {
            time: getSelectedValue('.time-swiper'),
            place: getSelectedValue('.place-swiper'),
            characters: getSelectedValue('.character-swiper'),
            mood: getSelectedValue('.mood-swiper'),
            ageGroup: elements.ageSlider.value
        };

        const missingSelections = Object.entries(selectedValues)
            .filter(([key, value]) => !value && key !== 'ageGroup')
            .map(([key]) => ({
                time: 'laiką',
                place: 'vietą',
                characters: 'veikėjus',
                mood: 'nuotaiką'
            })[key]);

        if (missingSelections.length > 0) {
            alert(`Prašome pasirinkti: ${missingSelections.join(', ')} 🎯`);
            return;
        }

        const buttonText = elements.generateBtn.querySelector('.button-text');
        elements.generateBtn.disabled = true;
        buttonText.textContent = 'Kuriama... 🌟';

        const stopLoading = showLoadingAnimation();

        try {
            const response = await fetch('/api/generate-story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedValues)
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            stopLoading();
            await displayStory(data.story);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Įvyko klaida! Bandykite dar kartą. 😔');
            stopLoading();
        } finally {
            elements.generateBtn.disabled = false;
            buttonText.textContent = 'Generuoti';
        }
    };

    // Share functionality
    const shareStory = (platform) => {
        const storyText = elements.storyText.textContent;
        const shareText = encodeURIComponent(`Pasaka sukurta su Pasakų Burtininku:\n\n${storyText.substring(0, 200)}...`);
        const shareUrl = encodeURIComponent(window.location.href);
        const shareLinks = {
            twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`
        };
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    };

    // Create fireflies
    const createFireflies = () => {
        const existingFirefly = document.querySelector('.firefly');
        if (existingFirefly) {
            existingFirefly.remove();
        }

        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        for (let i = 0; i < 30; i++) {
            const glow = document.createElement('div');
            glow.className = 'firefly-glow';
            
            const tx = Math.random() * 200 - 100;
            const ty = Math.random() * 200 - 100;
            const duration = 6 + Math.random() * 4;
            const delay = -Math.random() * 10;
            
            glow.style.setProperty('--tx', `${tx}px`);
            glow.style.setProperty('--ty', `${ty}px`);
            glow.style.setProperty('--duration', `${duration}s`);
            glow.style.setProperty('--delay', `${delay}s`);
            glow.style.left = `${Math.random() * 100}%`;
            glow.style.top = `${Math.random() * 100}%`;
            
            firefly.appendChild(glow);
        }
        
        document.body.appendChild(firefly);
    };

    // Event listeners
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.ageSlider.addEventListener('input', (e) => updateAgeDescription(e.target.value));
    elements.generateBtn.addEventListener('click', handleGenerateClick);
    elements.copyBtn?.addEventListener('click', async () => {
        const storyText = elements.storyText.textContent;
        try {
            await navigator.clipboard.writeText(storyText);
            const copyBtn = elements.copyBtn;
            copyBtn.querySelector('.share-text').textContent = 'Nukopijuota! ✓';
            setTimeout(() => {
                copyBtn.querySelector('.share-text').textContent = 'Kopijuoti';
            }, 2000);
        } catch (err) {
            alert('Nepavyko nukopijuoti teksto');
        }
    });

    document.querySelector('.share-btn.twitter')?.addEventListener('click', () => shareStory('twitter'));
    document.querySelector('.share-btn.facebook')?.addEventListener('click', () => shareStory('facebook'));
    
    elements.newStoryBtn?.addEventListener('click', () => {
        elements.storyContainer.style.display = 'none';
        document.querySelector('.story-settings').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Initialize swipers
    const swipers = initializeSwipers();

    // Initialize fireflies with performance optimization
    if (window.requestIdleCallback) {
        requestIdleCallback(createFireflies);
    } else {
        setTimeout(createFireflies, 0);
    }

    // Error handling
    window.addEventListener('error', (e) => {
        if (e.message.includes('Swiper')) {
            console.error('Swiper initialization error:', e);
            alert('Įvyko klaida inicializuojant pasirinkimus. Perkraukite puslapį.');
        }
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        const cursor = elements.storyText.querySelector('.typing-cursor');
        if (document.hidden && cursor) {
            cursor.style.animationPlayState = 'paused';
        } else if (cursor) {
            cursor.style.animationPlayState = 'running';
        }
    });

    // Handle window resize for better mobile experience
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const swiperInstances = document.querySelectorAll('.swiper');
            swiperInstances.forEach(instance => {
                const swiperInstance = instance.swiper;
                if (swiperInstance) {
                    swiperInstance.update();
                }
            });
        }, 250);
    });

    // Clean up function for page unload
    window.addEventListener('beforeunload', () => {
        // Clear any ongoing animations or intervals
        const cursor = document.querySelector('.typing-cursor');
        if (cursor) cursor.remove();
        
        // Clear any loading states
        const loadingAnimation = document.querySelector('.loading-animation');
        if (loadingAnimation) loadingAnimation.classList.remove('visible');
    });

    // Initialize theme on load
    initTheme();
});
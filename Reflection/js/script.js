/* --- GLOBAL APPLICATION STATE --- */
        let streamActiveInstance = null;
        let activeFacingMode = "user";

        // Predefined Extensive Library pool (Extensible to 150-200)
        const affirmationBank = [
            "I forgive myself.",
            "I am enough.",
            "I am growing every day.",
            "I choose peace today.",
            "I trust my journey.",
            "I embrace every lesson.",
            "I deserve kindness.",
            "I am stronger than yesterday.",
            "I welcome new beginnings.",
            "I let go of what I cannot control.",
            "I honor my feelings.",
            "I believe in myself.",
            "I am becoming who I need to be.",
            "I choose hope over fear.",
            "My heart is healing.",
            "Every breath is a fresh start.",
            "I am proud of how far I've come.",
            "I deserve rest.",
            "I trust the timing of my life.",
            "I am worthy of love.",
            "I release yesterday.",
            "I choose gratitude.",
            "I find beauty in small moments.",
            "I am learning to love myself.",
            "Everything begins with one small step.",
            "Today is enough.",
            "I welcome peace into my heart.",
            "Healing is not a race.",
            "I bloom in my own season.",
            "The best is yet to come.",
            "Tidak apa-apa untuk beristirahat.",
            "Aku menerima diriku apa adanya.",
            "Aku sedang bertumbuh.",
            "Aku tidak harus sempurna.",
            "Pelan-pelan juga tetap maju.",
            "Hari ini aku sudah berusaha.",
            "Aku bangga pada diriku.",
            "Aku berhak bahagia.",
            "Aku memilih memaafkan diriku.",
            "Aku pantas dicintai.",
            "Semua luka akan menemukan jalannya untuk sembuh.",
            "Aku percaya pada proses hidupku.",
            "Aku boleh menangis.",
            "Aku sedang belajar menjadi lebih baik.",
            "Tidak apa-apa jika belum tahu semua jawabannya.",
            "Aku adalah rumah terbaik bagi diriku sendiri.",
            "Aku memilih untuk tetap berharap.",
            "Aku menghargai setiap langkah kecilku.",
            "Hari ini cukup.",
            "Aku berhak merasa tenang.",
            "Aku bukan kegagalanku.",
            "Aku lebih kuat dari yang kusadari.",
            "Aku tidak sendiri.",
            "Aku layak mendapatkan kedamaian.",
            "Aku bersyukur masih diberi kesempatan hari ini.",
            "Aku percaya setiap badai akan berlalu.",
            "Aku menerima masa laluku.",
            "Aku siap menyambut masa depan.",
            "Aku belajar dari setiap pengalaman.",
            "Aku akan baik-baik saja.",
            "Kamu sudah melakukan yang terbaik.",
            "Terima kasih sudah bertahan sejauh ini.",
            "Tidak apa-apa jika hari ini terasa berat.",
            "Kamu berhak bahagia.",
            "Kamu lebih kuat dari yang kamu kira.",
            "Setiap langkah kecil memiliki arti.",
            "Kamu pantas dicintai tanpa syarat.",
            "Berikan dirimu ruang untuk bernapas.",
            "Tidak semua hal harus sempurna.",
            "Hari esok membawa harapan baru.",
            "Peluk dirimu dengan kasih sayang.",
            "Tidak apa-apa untuk memulai lagi.",
            "Percayalah pada waktumu sendiri.",
            "Kamu sedang bertumbuh, walaupun belum terlihat.",
            "Teruslah berjalan meski perlahan.",
            "Semesta belum selesai menuliskan ceritamu.",
            "Jangan menyerah pada dirimu sendiri.",
            "Ada cahaya setelah malam.",
            "Satu senyuman bisa mengubah hari.",
            "Kebaikan selalu menemukan jalannya kembali.",
            "Your story still matters.",
            "You are never truly alone.",
            "Be gentle with yourself.",
            "Small progress is still progress.",
            "Choose kindness, especially for yourself.",
            "The sun will rise again.",
            "Your heart knows the way.",
            "Every ending creates a beginning.",
            "Hope lives inside you.",
            "Your future self is cheering for you.",
            "Take one breath at a time.",
            "There is beauty in healing.",
            "You have survived every difficult day.",
            "Keep your heart open.",
            "You are loved more than you know.",
            "You matter.",
            "One day at a time.",
            "Your light still shines.",
            "Peace begins within.",
            "The journey itself is beautiful.",
            "Trust yourself a little more.",
            "Everything will unfold in its own time.",
            "The little things are enough.",
            "Keep believing in tomorrow."
        ];

        const mirrorOverlaysBank = [
            "Take a look.",
            "The person in front of you has survived every bad day until today.",
            "You are enough.",
            "Keep going.",
            "Everything will be okay.",
            "Smile, you are doing wonderfully."
        ];

        /* --- STAGE 1: NARRATIVE SCREEN RUNNER --- */
        document.addEventListener("DOMContentLoaded", () => {
            executeNarrativeSequence();
            restoreSystemStoredData();
            runStatisticsCounter();
        });

        function executeNarrativeSequence() {
            const narrativeStages = ['n1', 'n2', 'n3', 'n4', 'n5'];
            let activeDelayIndex = 0;

            function renderNextSlide() {
                if (activeDelayIndex > 0) {
                    document.getElementById(narrativeStages[activeDelayIndex - 1]).classList.remove('active');
                }
                if (activeDelayIndex < narrativeStages.length) {
                    const currentElement = document.getElementById(narrativeStages[activeDelayIndex]);
                    currentElement.classList.add('active');
                    activeDelayIndex++;
                    
                    // Controlled sequence timeline
                    if(activeDelayIndex < narrativeStages.length) {
                        setTimeout(renderNextSlide, 2200);
                    }
                }
            }
            renderNextSlide();
        }

        function exitOpeningScreen() {
            const targetScreen = document.getElementById('opening-screen');
            targetScreen.style.opacity = '0';
            setTimeout(() => {
                targetScreen.style.display = 'none';
            }, 1000);
        }

        /* --- STAGE 2: SYSTEM THEME ENGINE (DARK/LIGHT) --- */
        function toggleThemeSystem() {
            const htmlNode = document.documentElement;
            const currentTheme = htmlNode.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlNode.setAttribute('data-theme', targetTheme);
            localStorage.setItem('reflection_sys_theme', targetTheme);
            
            // Icon transition handling
            const themeIcon = document.getElementById('theme-icon');
            themeIcon.className = targetTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        /* --- STAGE 3: SMART CAMERA IMPLEMENTATION --- */
        async function initializeCamera() {
            const videoComponent = document.getElementById('webcam');
            const initButton = document.getElementById('capture-trigger');
            
            if (streamActiveInstance) {
                streamActiveInstance.getTracks().forEach(track => track.stop());
            }

            const configurations = {
                video: { facingMode: activeFacingMode },
                audio: false
            };

            try {
                streamActiveInstance = await navigator.mediaDevices.getUserMedia(configurations);
                videoComponent.srcObject = streamActiveInstance;
                initButton.innerHTML = `<i class="fas fa-camera"></i> Capture`;
                launchOverlayTextLoop();
            } catch (exception) {
                console.error("Hardware mirror error: ", exception);
                alert("Gagal mengakses kamera perangkatmu. Sistem otomatis masuk mode mockup/simulasi.");
            }
        }

        function toggleMirrorDirection() {
            activeFacingMode = activeFacingMode === "user" ? "environment" : "user";
            initializeCamera();
        }

        function triggerFullscreenMode() {
            const cameraBoxElement = document.querySelector('.mirror-box');
            if (cameraBoxElement.requestFullscreen) {
                cameraBoxElement.requestFullscreen();
            }
        }

        function launchOverlayTextLoop() {
            const targetOverlay = document.getElementById('overlay-quote');
            let cycleIndex = 0;
            setInterval(() => {
                targetOverlay.style.opacity = '0';
                setTimeout(() => {
                    cycleIndex = (cycleIndex + 1) % mirrorOverlaysBank.length;
                    targetOverlay.innerText = mirrorOverlaysBank[cycleIndex];
                    targetOverlay.style.opacity = '1';
                }, 500);
            }, 8000); // Transitions seamlessly as per prompt specs
        }

        /* --- STAGE 4: AFFIRMATION SELECTOR --- */
        function fetchRandomAffirmation() {
            const outputBoard = document.getElementById('quote-board');
            outputBoard.style.opacity = '0';
            setTimeout(() => {
                const selectorIndex = Math.floor(Math.random() * affirmationBank.length);
                outputBoard.innerText = `"${affirmationBank[selectorIndex]}"`;
                outputBoard.style.opacity = '1';
            }, 300);
        }

        /* --- STAGE 5: ACTIVE MOOD INTERACTION --- */
function processMoodSelection(emojiSymbol, labelString) {
    const messageOutput = document.getElementById('mood-response');
    localStorage.setItem('reflection_stored_mood', labelString);

    switch (labelString) {

        case 'Happy':
            messageOutput.innerText = "Hari ini hatimu sedang dipenuhi kebahagiaan. Semoga senyum itu tetap menemanimu, dan jangan lupa menikmati setiap momen indah yang hadir.";
            break;

        case 'Content':
            messageOutput.innerText = "Rasa cukup adalah bentuk kebahagiaan yang sederhana. Semoga hatimu selalu menemukan alasan untuk bersyukur, sekecil apa pun itu.";
            break;

        case 'Calm':
            messageOutput.innerText = "Ketenangan adalah hadiah yang berharga. Nikmati momen ini, dengarkan napasmu, dan biarkan pikiranmu beristirahat.";
            break;

        case 'Neutral':
            messageOutput.innerText = "Hari ini mungkin terasa biasa saja, dan itu tidak apa-apa. Hidup tidak selalu tentang pencapaian besar, terkadang bertahan dan tetap berjalan sudah merupakan kemenangan.";
            break;

        case 'Sad':
            messageOutput.innerText = "Kesedihan bukanlah tanda kelemahan. Tidak apa-apa jika hari ini kamu belum baik-baik saja. Beristirahatlah, peluk dirimu sendiri, dan percayalah bahwa perasaan ini akan berlalu.";
            break;

        case 'Overwhelmed':
            messageOutput.innerText = "Saat semuanya terasa terlalu berat, ingatlah bahwa kamu tidak harus memikul semuanya sekaligus. Berhenti sejenak, bernapaslah, dan hadapi satu hal dalam satu waktu. Kamu sudah berjuang sejauh ini.";
            break;

        default:
            messageOutput.innerText = "Terima kasih sudah meluangkan waktu untuk mengenali perasaanmu hari ini. ❤️";
    }
}

        /* --- STAGE 6: CORE LOCALSTORAGE DIARY SYSTEM --- */
        function commitJournalEntry() {
            const currentContent = document.getElementById('journal-editor').value;
            localStorage.setItem('reflection_stored_journal', currentContent);
            alert("Rasa syukurmu malam ini aman didekap oleh sistem penyimpanan.");
        }

        /* --- STAGE 7: INTERACTIVE PROGRESS TRACKER --- */
        function evaluateChallengeProgress() {
            const checklistNodes = document.querySelectorAll('.task-check');
            let verifiedCounter = 0;
            
            checklistNodes.forEach(box => { if(box.checked) verifiedCounter++; });
            
            const operationalRatio = Math.round((verifiedCounter / checklistNodes.length) * 100);
            document.getElementById('challenge-progress').style.width = `${operationalRatio}%`;
            
            const progressLabel = document.getElementById('progress-status');
            if (operationalRatio === 100) {
                progressLabel.innerHTML = `<strong>Progress: 100% — 🎉 Great Job!</strong>`;
            } else {
                progressLabel.innerText = `Progress: ${operationalRatio}%`;
            }
            
            // Persistent task compilation saving
            const analyticalMap = Array.from(checklistNodes).map(node => node.checked);
            localStorage.setItem('reflection_challenge_matrix', JSON.stringify(analyticalMap));
        }

        /* --- STAGE 8: AUDIO INTEGRATION ARCHITECTURE --- */
        let currentAudio = null; // Tempat menyimpan audio yang sedang berjalan

        // Mapping nama tombol ke file audio asli
        // Kamu bisa pakai link internet (untuk tes langsung) atau file lokal di folder music/ kamu
        const audioFiles = {
        'Rain': 'rain.mp3',
        'Ocean': 'ocean.mp3',
        'Forest': 'forest.mp3',
        'Piano': 'piano.mp3'
        };

        function controlAudioTracks(domElement, toneProfile) {
            const isPlaying = domElement.classList.contains('playing');
            
            // 1. Matikan semua status visual 'playing' di tombol lain
            document.querySelectorAll('.track-card').forEach(card => card.classList.remove('playing'));
            
            // 2. Jika ada musik yang sedang berputar, hentikan dan reset ke awal
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // 3. Jika tombol yang diklik sebelumnya tidak sedang bermain, jalankan musiknya
            if (!isPlaying) {
                domElement.classList.add('playing');
                
                // Ambil file audio berdasarkan tombol yang diklik (Rain/Ocean/dll)
                currentAudio = new Audio(audioFiles[toneProfile]);
                currentAudio.loop = true; // Supaya musiknya berputar terus-menerus (ambient effect)
                
                // Jalankan audio (ditangkap dengan .catch jika diblokir kebijakan browser)
                currentAudio.play().catch(err => {
                    console.log("Pemutaran audio diblokir oleh browser sebelum ada interaksi pengguna:", err);
                });
                
                console.log(`Audio Streaming Engine Initialized For: ${toneProfile}`);
            } else {
                // Jika tombol yang sama diklik lagi, musik otomatis berhenti (efek toggle)
                currentAudio = null;
            }
        }

        /* --- STAGE 9: RUNTIME STATS ACCELERATOR --- */
        function runStatisticsCounter() {
            const displayElement = document.getElementById('counter-fact');
            let initialCount = 0;
            const targetCeiling = 90;
            
            const countingInterval = setInterval(() => {
                if(initialCount >= targetCeiling) {
                    clearInterval(countingInterval);
                } else {
                    initialCount++;
                    displayElement.innerText = `${initialCount}%`;
                }
            }, 25);
        }

        /* --- DATA LIFECYCLE MANAGEMENT --- */
        function restoreSystemStoredData() {
            // Restore Configuration Theme
            const cachedTheme = localStorage.getItem('reflection_sys_theme');
            if(cachedTheme) {
                document.documentElement.setAttribute('data-theme', cachedTheme);
                document.getElementById('theme-icon').className = cachedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }

            // Restore Diary text inputs
            const cachedJournal = localStorage.getItem('reflection_stored_journal');
            if(cachedJournal) document.getElementById('journal-editor').value = cachedJournal;

            // Update Time-stamps
            const formatRules = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('live-date').innerText = new Date().toLocaleDateString('id-ID', formatRules);

            // Restore Checklist conditions
            const checkedCache = localStorage.getItem('reflection_challenge_matrix');
            if(checkedCache) {
                const proceduralArray = JSON.parse(checkedCache);
                const boxes = document.querySelectorAll('.task-check');
                proceduralArray.forEach((stateValue, pointerIndex) => {
                    if(boxes[pointerIndex]) boxes[pointerIndex].checked = stateValue;
                });
                evaluateChallengeProgress();
            }
        }
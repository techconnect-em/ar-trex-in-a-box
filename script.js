AFRAME.registerComponent("ar-controller", {
  init: function () {
    this.scanningOverlay = document.getElementById("scanning-overlay");
    this.captureButton = document.getElementById("capture");
    this.websiteButton = document.getElementById("website-button");
    this.releaseButton = document.getElementById("release-button");
    this.feedButton = document.getElementById("feed-button");
    this.dinosaurModel = this.el.querySelector("#dinosaur");
    
    // T-Rex ステータス管理
    this.statusPanel = document.getElementById("trex-status");
    this.happinessLevel = document.getElementById("happiness-level");
    this.hungerLevel = document.getElementById("hunger-level");
    this.feedCount = document.getElementById("feed-count");
    
    // T-Rex の状態
    this.trexStatus = {
      happiness: 100,
      hunger: 50,
      feedCount: 0,
      lastFeedTime: Date.now()
    };
    
    // 音響効果
    this.sounds = {
      roar: document.getElementById("roar-sound"),
      footstep: document.getElementById("footstep-sound"),
      eating: document.getElementById("eating-sound")
    };
    
    // アニメーション設定をオブジェクトの配列として管理
    this.animations = [
      { clip: "idle", duration: 7000, timeScale: 1.5, sound: null },
      { clip: "roar", duration: 6000, timeScale: 1, sound: "roar" },
      { clip: "attack_tail", duration: 4800, timeScale: 1, sound: "footstep" },
    ];
    this.currentIndex = 0;
    this.isFeeding = false;

    if (this.dinosaurModel) {
      this.playNextAnimation();
    }
    
    // ステータス更新タイマー
    this.startStatusUpdater();
  },

  playNextAnimation: function () {
    const currentAnim = this.animations[this.currentIndex];

    // 現在のアニメーションを設定
    this.dinosaurModel.setAttribute("animation-mixer", {
      clip: currentAnim.clip,
      timeScale: currentAnim.timeScale,
      loop: "repeat",
    });
    
    // 音響効果の再生
    this.playSound(currentAnim.sound);

    // 次のアニメーションのタイマーをセット
    setTimeout(() => {
      if (!this.isFeeding) { // 餌やり中でなければ通常のアニメーション循環
        this.currentIndex = (this.currentIndex + 1) % this.animations.length;
        this.playNextAnimation();
      }
    }, currentAnim.duration);

    this.createShareModal();
    this.setupEventListeners();
    this.setupButtons();
  },
  
  // 音響効果の再生
  playSound: function(soundName) {
    if (soundName && this.sounds[soundName]) {
      try {
        this.sounds[soundName].currentTime = 0;
        this.sounds[soundName].play().catch(e => {
          console.log("Sound play failed:", e);
        });
      } catch (error) {
        console.log("Sound error:", error);
      }
    }
  },
  
  // T-Rex の餌やり機能
  feedTrex: function() {
    if (this.isFeeding) return; // 餌やり中は重複実行を防ぐ
    
    this.isFeeding = true;
    this.trexStatus.feedCount++;
    this.trexStatus.hunger = Math.min(100, this.trexStatus.hunger + 30);
    this.trexStatus.happiness = Math.min(100, this.trexStatus.happiness + 20);
    this.trexStatus.lastFeedTime = Date.now();
    
    // 餌やりアニメーション（特別なアニメーション）
    this.dinosaurModel.setAttribute("animation-mixer", {
      clip: "roar", // 餌やり時は吠えるアニメーション
      timeScale: 1.2,
      loop: "once",
    });
    
    // 餌やり音の再生
    this.playSound("eating");
    
    // 餌やりエフェクトの表示
    this.showFeedingEffect();
    
    // ステータスパネルの表示
    this.statusPanel.classList.add('visible');
    
    // ステータス表示の更新
    this.updateStatusDisplay();
    
    // 3秒後に通常のアニメーション循環に戻る
    setTimeout(() => {
      this.isFeeding = false;
      this.playNextAnimation();
    }, 3000);
    
    // 10秒後にステータスパネルを隠す
    setTimeout(() => {
      this.statusPanel.classList.remove('visible');
    }, 10000);
  },
  
  // 餌やりエフェクトの表示
  showFeedingEffect: function() {
    // 肉のエモジエフェクト
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const effect = document.createElement('div');
        effect.className = 'feeding-effect';
        effect.textContent = '🍖';
        effect.style.left = (50 + Math.random() * 20 - 10) + '%';
        effect.style.top = (50 + Math.random() * 20 - 10) + '%';
        document.body.appendChild(effect);
        
        setTimeout(() => {
          document.body.removeChild(effect);
        }, 1500);
      }, i * 200);
    }
    
    // パーティクルエフェクト
    this.createParticles();
  },
  
  // パーティクルエフェクトの作成
  createParticles: function() {
    const colors = ['#ffeb3b', '#ff9800', '#f44336', '#4caf50'];
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = (50 + Math.random() * 30 - 15) + '%';
        particle.style.top = '60%';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animation = 'particleFloat 2s ease-out forwards';
        document.body.appendChild(particle);
        
        setTimeout(() => {
          document.body.removeChild(particle);
        }, 2000);
      }, i * 100);
    }
  },
  
  // ステータス表示の更新
  updateStatusDisplay: function() {
    // 幸福度の表示
    if (this.trexStatus.happiness > 80) {
      this.happinessLevel.textContent = '😄';
    } else if (this.trexStatus.happiness > 60) {
      this.happinessLevel.textContent = '😊';
    } else if (this.trexStatus.happiness > 40) {
      this.happinessLevel.textContent = '😐';
    } else if (this.trexStatus.happiness > 20) {
      this.happinessLevel.textContent = '😢';
    } else {
      this.happinessLevel.textContent = '😭';
    }
    
    // 空腹度の表示
    if (this.trexStatus.hunger > 80) {
      this.hungerLevel.textContent = '🍖🍖🍖';
    } else if (this.trexStatus.hunger > 60) {
      this.hungerLevel.textContent = '🍖🍖';
    } else if (this.trexStatus.hunger > 40) {
      this.hungerLevel.textContent = '🍖';
    } else if (this.trexStatus.hunger > 20) {
      this.hungerLevel.textContent = '🥩';
    } else {
      this.hungerLevel.textContent = '💀';
    }
    
    // 餌やり回数
    this.feedCount.textContent = this.trexStatus.feedCount;
  },
  
  // ステータス自動更新システム
  startStatusUpdater: function() {
    setInterval(() => {
      const now = Date.now();
      const timeSinceLastFeed = now - this.trexStatus.lastFeedTime;
      
      // 時間経過による空腹度と幸福度の減少
      if (timeSinceLastFeed > 30000) { // 30秒毎
        this.trexStatus.hunger = Math.max(0, this.trexStatus.hunger - 1);
        this.trexStatus.happiness = Math.max(0, this.trexStatus.happiness - 0.5);
        this.trexStatus.lastFeedTime = now;
        
        if (this.statusPanel.classList.contains('visible')) {
          this.updateStatusDisplay();
        }
      }
    }, 5000); // 5秒毎にチェック
  },

  setupEventListeners: function () {
    this.el.addEventListener("targetFound", () => {
      console.log("マーカーを認識しました");
      if (this.scanningOverlay) {
        this.scanningOverlay.style.display = "none";
      }
    });
    
    // タッチ・スワイプインタラクション
    this.setupTouchInteraction();
  },
  
  // タッチ・スワイプインタラクション
  setupTouchInteraction: function() {
    const scene = document.querySelector('a-scene');
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    scene.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    });
    
    scene.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = touchEndTime - touchStartTime;
      
      // 長押し検出（1秒以上）
      if (deltaTime > 1000 && Math.abs(deltaX) < 50 && Math.abs(deltaY) < 50) {
        this.playSpecialDance();
        return;
      }
      
      // スワイプ検出（150px以上の移動）
      if (Math.abs(deltaX) > 150 || Math.abs(deltaY) > 150) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // 横スワイプ
          if (deltaX > 0) {
            this.turnTrex('right');
          } else {
            this.turnTrex('left');
          }
        } else {
          // 縦スワイプ
          if (deltaY > 0) {
            this.makeTrexSit();
          } else {
            this.makeTrexRoar();
          }
        }
      } else if (deltaTime < 500) {
        // 短いタップ（500ms以下）
        this.petTrex();
      }
    });
  },
  
  // T-Rexを撫でる（タップ）
  petTrex: function() {
    console.log("T-Rex をタップしました");
    this.trexStatus.happiness = Math.min(100, this.trexStatus.happiness + 5);
    
    // 短い喜びアニメーション
    this.dinosaurModel.setAttribute("animation-mixer", {
      clip: "idle",
      timeScale: 2.0,
      loop: "once",
    });
    
    // ハートエフェクト
    this.showHeartEffect();
    
    // 一時的にステータス表示
    this.statusPanel.classList.add('visible');
    this.updateStatusDisplay();
    
    setTimeout(() => {
      this.statusPanel.classList.remove('visible');
    }, 3000);
  },
  
  // T-Rexを回転させる（スワイプ）
  turnTrex: function(direction) {
    console.log(`T-Rex を${direction}に回転`);
    const currentRotation = this.dinosaurModel.getAttribute('rotation');
    const newY = direction === 'right' ? currentRotation.y + 90 : currentRotation.y - 90;
    
    this.dinosaurModel.setAttribute('animation', {
      property: 'rotation',
      to: `${currentRotation.x} ${newY} ${currentRotation.z}`,
      dur: 1000,
      easing: 'easeInOutQuad'
    });
    
    this.playSound('footstep');
  },
  
  // T-Rexを座らせる（下スワイプ）
  makeTrexSit: function() {
    console.log("T-Rex を座らせる");
    const currentScale = this.dinosaurModel.getAttribute('scale');
    
    this.dinosaurModel.setAttribute('animation', {
      property: 'scale',
      to: `${currentScale.x} ${currentScale.y * 0.7} ${currentScale.z}`,
      dur: 1000,
      easing: 'easeInOutQuad'
    });
    
    // 2秒後に元の大きさに戻す
    setTimeout(() => {
      this.dinosaurModel.setAttribute('animation', {
        property: 'scale',
        to: `${currentScale.x} ${currentScale.y} ${currentScale.z}`,
        dur: 1000,
        easing: 'easeInOutQuad'
      });
    }, 2000);
  },
  
  // T-Rexを吠えさせる（上スワイプ）
  makeTrexRoar: function() {
    console.log("T-Rex を吠えさせる");
    this.dinosaurModel.setAttribute("animation-mixer", {
      clip: "roar",
      timeScale: 1.5,
      loop: "once",
    });
    
    this.playSound('roar');
    
    // 画面振動効果（対応デバイスのみ）
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  },
  
  // 特別なダンス（長押し）
  playSpecialDance: function() {
    console.log("特別なダンスを開始");
    this.trexStatus.happiness = Math.min(100, this.trexStatus.happiness + 15);
    
    // 連続アニメーション
    const danceSequence = [
      { clip: "attack_tail", duration: 1000 },
      { clip: "roar", duration: 1000 },
      { clip: "idle", duration: 1000 },
      { clip: "attack_tail", duration: 1000 }
    ];
    
    let currentStep = 0;
    const executeDance = () => {
      if (currentStep < danceSequence.length) {
        const step = danceSequence[currentStep];
        this.dinosaurModel.setAttribute("animation-mixer", {
          clip: step.clip,
          timeScale: 1.8,
          loop: "once",
        });
        
        currentStep++;
        setTimeout(executeDance, step.duration);
      } else {
        // ダンス終了後に通常アニメーションに戻る
        this.playNextAnimation();
      }
    };
    
    executeDance();
    
    // 特別なパーティクルエフェクト
    this.showSpecialEffect();
  },
  
  // ハートエフェクト
  showHeartEffect: function() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'feeding-effect';
        heart.textContent = '💖';
        heart.style.left = (45 + Math.random() * 10) + '%';
        heart.style.top = (40 + Math.random() * 10) + '%';
        document.body.appendChild(heart);
        
        setTimeout(() => {
          document.body.removeChild(heart);
        }, 1500);
      }, i * 300);
    }
  },
  
  // 特別なエフェクト（長押し時）
  showSpecialEffect: function() {
    const emojis = ['✨', '🌟', '💫', '🎉', '🎊'];
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const effect = document.createElement('div');
        effect.className = 'feeding-effect';
        effect.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        effect.style.left = (30 + Math.random() * 40) + '%';
        effect.style.top = (30 + Math.random() * 40) + '%';
        effect.style.fontSize = (20 + Math.random() * 10) + 'px';
        document.body.appendChild(effect);
        
        setTimeout(() => {
          document.body.removeChild(effect);
        }, 1500);
      }, i * 100);
    }
  },

  createShareModal: function () {
    const modalHTML = `
            <div id="share-modal" class="share-modal hidden">
                <div class="modal-content">
                    <div class="image-container">
                        <img id="captured-image" class="captured-image">
                    </div>
                    <p class="save-text">画像長押しで保存できます</p>
                    <div class="modal-buttons">
                        <button id="share-button" class="modal-btn share-btn">共有する</button>
                        <button id="close-modal" class="modal-btn close-btn">閉じる</button>
                    </div>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    this.shareModal = document.getElementById("share-modal");
    this.capturedImage = document.getElementById("captured-image");
    this.shareButton = document.getElementById("share-button");
    this.closeModal = document.getElementById("close-modal");
  },

  setupButtons: function () {
    if (this.captureButton) {
      this.captureButton.addEventListener("click", async () => {
        const scene = document.querySelector("a-scene");

        // キャプチャ前にデフォルトのダウンロード動作を防ぐための設定
        const originalGetCanvas = scene.components.screenshot.getCanvas;
        scene.components.screenshot.getCanvas = function () {
          const canvas = originalGetCanvas.apply(this, arguments);
          // デフォルトのダウンロードポップアップを防ぐ
          canvas.toBlob = function () {};
          return canvas;
        };

        // A-Frameシーンのスクリーンショットを取得
        const sceneCanvas =
          scene.components.screenshot.getCanvas("perspective");

        const video = document.querySelector("video");

        // 最終的なキャプチャ用キャンバスを作成
        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = window.innerWidth;
        finalCanvas.height = window.innerHeight;
        const ctx = finalCanvas.getContext("2d");

        // 背景（カメラ映像）を描画
        if (video) {
          ctx.drawImage(video, 0, 0, finalCanvas.width, finalCanvas.height);
        }

        // A-Frameシーン（3Dモデル）を重ねて描画
        if (sceneCanvas) {
          ctx.drawImage(
            sceneCanvas,
            0,
            0,
            finalCanvas.width,
            finalCanvas.height
          );
        }

        // キャプチャした画像データをモーダルに表示
        this.capturedImage.src = finalCanvas.toDataURL("image/png");
        this.shareModal.classList.remove("hidden");

        // 元のgetCanvas関数を復元
        scene.components.screenshot.getCanvas = originalGetCanvas;
      });

      // シェアボタンの処理
      if (this.shareButton) {
        this.shareButton.addEventListener("click", async () => {
          try {
            // キャプチャした画像をBlobに変換
            const response = await fetch(this.capturedImage.src);
            const blob = await response.blob();
            const file = new File([blob], "ar-capture.png", {
              type: "image/png",
            });

            // Web Share APIを使用
            if (navigator.share) {
              await navigator.share({
                files: [file],
                title: "AR Capture",
                text: "Check out my AR capture!",
              });
            } else {
              // シェアAPI非対応の場合はダウンロード
              const link = document.createElement("a");
              link.href = this.capturedImage.src;
              link.download = "ar-capture.png";
              link.click();
            }
          } catch (error) {
            console.error("Failed to share:", error);
          }
        });
      }
      // 閉じるボタンの処理
      if (this.closeModal) {
        this.closeModal.addEventListener("click", () => {
          this.shareModal.classList.add("hidden");
        });
      }

      // モーダル外クリックで閉じる
      this.shareModal.addEventListener("click", (event) => {
        if (event.target === this.shareModal) {
          this.shareModal.classList.add("hidden");
        }
      });
    }

    // Webサイトボタンの処理
    if (this.websiteButton) {
      this.websiteButton.addEventListener("click", () => {
        window.open("https://www.instagram.com/techconnect.em/", "_blank");
      });
    }

    // 外に出すボタンの処理
    if (this.releaseButton) {
      this.releaseButton.addEventListener('click', () => {
        window.location.href = 'https://palanar.com/ar_contents/t-rex-running';
      });
    }
    
    // 餌やりボタンの処理
    if (this.feedButton) {
      this.feedButton.addEventListener('click', () => {
        this.feedTrex();
      });
    }
  },
});

AFRAME.registerComponent("ar-controller", {
  init: function () {
    this.scanningOverlay = document.getElementById("scanning-overlay");
    this.captureButton = document.getElementById("capture");
    this.websiteButton = document.getElementById("website-button");
    this.releaseButton = document.getElementById("release-button");
    this.feedButton = document.getElementById("feed-button");
    this.dinosaurModel = this.el.querySelector("#dinosaur");
    console.log("Dinosaur model:", this.dinosaurModel);
    
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
    
    // 音響効果（振動のみ）
    this.soundEffects = {
      roar: true,
      footstep: true,
      eating: true
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
      // モデルが読み込まれるまで待機
      this.dinosaurModel.addEventListener('model-loaded', () => {
        console.log('T-Rex model loaded');
        this.playNextAnimation();
      });
      
      // すでに読み込まれている場合もあるので、直接実行も試す
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
    
    // 音響効果は無効化
    // this.playSound(currentAnim.sound);

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
  
  // 音響効果は完全に無効化
  // playSound: function(soundName) {
  //   // 音響効果は無効化されました
  // },
  
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
    
    // 餌やり音の再生は無効化
    // this.playSound("eating");
    
    // 餌やりエフェクトの表示（肉エモジのみ）
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
    
    // T-Rexモデルへの直接クリックイベント
    if (this.dinosaurModel) {
      console.log("Setting up T-Rex click listeners");
      this.dinosaurModel.addEventListener('click', (e) => {
        console.log('T-Rex clicked!');
        this.petTrex();
      });
      
      // A-Frameのカーソルイベントも追加
      this.dinosaurModel.addEventListener('mouseenter', () => {
        console.log('Mouse entered T-Rex');
        this.dinosaurModel.setAttribute('material', 'color', '#ffeeaa');
      });
      
      this.dinosaurModel.addEventListener('mouseleave', () => {
        console.log('Mouse left T-Rex');
        this.dinosaurModel.removeAttribute('material');
      });
    } else {
      console.log("Dinosaur model not found!");
    }
    
    // タッチインタラクション（タップのみ）
    this.setupTouchInteraction();
    
    // デバッグ用の全体クリックイベント
    document.addEventListener('click', (e) => {
      console.log('Global click detected at:', e.clientX, e.clientY);
      
      // 画面の中央付近をクリックした場合はT-Rexをタップしたとみなす
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;
      
      // 中央から200px以内のクリックはT-Rexのタップとして処理
      if (Math.abs(e.clientX - centerX) < 200 && Math.abs(e.clientY - centerY) < 200) {
        console.log('T-Rex area clicked!');
        this.petTrex();
      }
    });
  },
  
  // タッチインタラクション（タップのみ）
  setupTouchInteraction: function() {
    const scene = document.querySelector('a-scene');
    let touchStartTime = 0;
    
    scene.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
    });
    
    scene.addEventListener('touchend', (e) => {
      const touchEndTime = Date.now();
      const deltaTime = touchEndTime - touchStartTime;
      
      // 短いタップ（500ms以下）のみ処理
      if (deltaTime < 500) {
        console.log('Touch tap detected');
        
        // 中央付近のタップはT-Rexのタップとして処理
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const centerX = screenWidth / 2;
        const centerY = screenHeight / 2;
        
        if (Math.abs(touchEndX - centerX) < 200 && Math.abs(touchEndY - centerY) < 200) {
          console.log('T-Rex touch tap detected!');
          this.petTrex();
        }
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
      this.feedButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 他のクリックイベントを止める
        this.feedTrex();
      });
    }
  },
});

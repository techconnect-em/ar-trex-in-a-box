AFRAME.registerComponent('ar-controller', {
    init: function() {
        this.model = this.el.querySelector('#dinosaur');
        this.debugEl = document.getElementById('debug');
        this.releaseButton = document.getElementById('release-button');
        this.captureButton = document.getElementById('capture');
        this.scanningOverlay = document.getElementById('scanning-overlay'); // 追加
        this.isLargeSize = false;
        
        this.setupModelHandlers();
        this.setupEventListeners();
        this.setupButtons();
    },

  
    setupModelHandlers: function() {
        // モデルのロード完了時の処理
        this.model.addEventListener('model-loaded', () => {
            this.updateDebug('モデルが読み込まれました');
            const mesh = this.model.getObject3D('mesh');
            if (mesh) {
                // テクスチャとマテリアルの設定
                mesh.traverse((node) => {
                    if (node.isMesh) {
                        // マテリアルの設定を最適化
                        node.material.needsUpdate = true;
                        node.material.side = THREE.DoubleSide;
                        node.material.transparent = true;
                        node.material.alphaTest = 0.5;
                        
                        // テクスチャのアップデートを強制
                        if (node.material.map) {
                            node.material.map.needsUpdate = true;
                        }
                        
                        this.updateDebug('マテリアルを更新しました');
                    }
                });

                // アニメーションの確認と設定
                if (mesh.animations && mesh.animations.length > 0) {
                    this.updateDebug(`アニメーション数: ${mesh.animations.length}`);
                    mesh.animations.forEach(anim => {
                        this.updateDebug(`アニメーション名: ${anim.name}`);
                    });
                    
                    // アニメーションミキサーの設定を更新
                    this.model.setAttribute('animation-mixer', {
                        timeScale: 1.5,
                        loop: 'repeat'
                    });
                }
                
                this.model.setAttribute('visible', true);
            }
        });

        // モデルのロードエラー時の処理
        this.model.addEventListener('model-error', (error) => {
            this.updateDebug(`モデルエラー: ${error.detail.src}`);
            console.error('モデルエラー:', error);
        });
    },

 setupEventListeners: function() {
        this.el.addEventListener('targetFound', () => {
            this.updateDebug('マーカーを認識しました');
            this.model.setAttribute('visible', true);
            
            // アニメーションを再開
            this.model.components['animation-mixer'].play();

            // スキャンオーバーレイを非表示
            if (this.scanningOverlay) {
                this.scanningOverlay.classList.add('hidden');
            }
        });

        this.el.addEventListener('targetLost', () => {
            this.updateDebug('マーカーをロストしました');
        });
    },

    setupButtons: function() {
        // 箱から出すボタンの処理
        if (this.releaseButton) {
            this.releaseButton.addEventListener('click', () => {
                if (!this.isLargeSize) {
                    this.updateDebug('モデルを拡大します');
                    
                    // スケールアニメーション
                    this.model.setAttribute('animation__scale', {
                        property: 'scale',
                        to: '0.5 0.5 0.5',
                        dur: 1500,
                        easing: 'easeOutElastic'
                    });
                    
                    // 位置アニメーション
                    this.model.setAttribute('animation__position', {
                        property: 'position',
                        to: '0 0 1',
                        dur: 1500,
                        easing: 'easeOutQuad'
                    });

                    // アニメーション速度を上げる
                    this.model.setAttribute('animation-mixer', {
                        timeScale: 2.0,
                        loop: 'repeat'
                    });

                    this.releaseButton.textContent = '放出済み';
                    this.releaseButton.style.backgroundColor = 'rgba(128, 128, 128, 0.8)';
                    this.isLargeSize = true;
                }
            });
        }

        // 写真撮影ボタンの処理
        if (this.captureButton) {
            this.captureButton.addEventListener('click', () => {
                this.updateDebug('写真を撮影します');
                const scene = document.querySelector('a-scene');
                const img = scene.components.screenshot.getCanvas('perspective');
                
                // 画像をダウンロード
                const link = document.createElement('a');
                link.setAttribute('download', 'ar-dinosaur.png');
                link.setAttribute('href', img.toDataURL('image/png'));
                link.click();
            });
        }
    },


});
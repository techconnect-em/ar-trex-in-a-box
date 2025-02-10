AFRAME.registerComponent('ar-controller', {
    init: function() {
        this.model = this.el.querySelector('#dinosaur');
        this.debugEl = document.getElementById('debug');
        this.releaseButton = document.getElementById('release-button');
        this.captureButton = document.getElementById('capture');
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
                // アニメーションの確認
                if (mesh.animations && mesh.animations.length > 0) {
                    this.updateDebug(`利用可能なアニメーション: ${mesh.animations.length}個`);
                    mesh.animations.forEach(anim => {
                        this.updateDebug(`- ${anim.name}`);
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
                    this.model.setAttribute('animation__scale', {
                        property: 'scale',
                        to: '0.5 0.5 0.5',
                        dur: 1000,
                        easing: 'easeOutElastic'
                    });
                    
                    this.model.setAttribute('animation__position', {
                        property: 'position',
                        to: '0 0 1',
                        dur: 1000,
                        easing: 'easeOutQuad'
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

    updateDebug: function(message) {
        if (this.debugEl) {
            this.debugEl.innerHTML += `<div>${message}</div>`;
            console.log(message);
        }
    }
});
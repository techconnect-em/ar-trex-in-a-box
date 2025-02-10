AFRAME.registerComponent('ar-controller', {
    init: function() {
        this.model = this.el.querySelector('#dinosaur');
        this.debugEl = document.getElementById('debug');
        this.setupModelHandlers();
        this.setupEventListeners();
    },

    setupModelHandlers: function() {
        // モデルのロード完了時の処理
        this.model.addEventListener('model-loaded', () => {
            this.updateDebug('メッシュが存在します');
            const mesh = this.model.getObject3D('mesh');
            if (mesh) {
                if (mesh.animations && mesh.animations.length > 0) {
                    this.updateDebug(`アニメーション数: ${mesh.animations.length}`);
                }
                // モデルが読み込まれたら表示を確実に有効化
                this.model.setAttribute('visible', true);
            } else {
                this.updateDebug('メッシュが存在しません');
            }
        });

        // モデルのロードエラー時の処理
        this.model.addEventListener('model-error', (error) => {
            this.updateDebug(`モデルエラー: ${error.detail.src}`);
            console.error('モデルエラー:', error);
        });
    },

    updateDebug: function(message) {
        if (this.debugEl) {
            this.debugEl.innerHTML += `<div>${message}</div>`;
            console.log(message);
        }
    },

    setupEventListeners: function() {
        this.el.addEventListener('targetFound', () => {
            this.updateDebug('マーカーを認識しました');
            // マーカー認識時にモデルを確実に表示
            this.model.setAttribute('visible', true);
            document.querySelectorAll('.ar-only').forEach(el => {
                el.style.display = 'block';
            });
        });

        this.el.addEventListener('targetLost', () => {
            this.updateDebug('マーカーをロストしました');
            document.querySelectorAll('.ar-only').forEach(el => {
                el.style.display = 'none';
            });
        });

        // 「箱から出す」ボタンの処理
        const releaseButton = document.getElementById('release-button');
        if (releaseButton) {
            releaseButton.addEventListener('click', () => {
                this.updateDebug('モデルを拡大します');
                this.model.setAttribute('animation__scale', {
                    property: 'scale',
                    to: '1 1 1',
                    dur: 1000,
                    easing: 'easeOutElastic'
                });
                
                this.model.setAttribute('animation__position', {
                    property: 'position',
                    to: '0 0.5 0',
                    dur: 1000,
                    easing: 'easeOutQuad'
                });
            });
        }
    }
});
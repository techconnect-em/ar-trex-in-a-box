AFRAME.registerComponent('ar-controller', {
    init: function() {
        // 要素の参照を取得
        this.scanningOverlay = document.getElementById('scanning-overlay');
        this.captureButton = document.getElementById('capture');
        this.websiteButton = document.getElementById('website-button');
        this.releaseButton = document.getElementById('release-button');
        this.dinosaurModel = this.el.querySelector('#dinosaur');
        
        // イベントリスナーのセットアップ
        this.setupEventListeners();
        this.setupButtons();
    },

    setupEventListeners: function() {
        this.el.addEventListener('targetFound', () => {
            console.log('マーカーを認識しました');
            if (this.scanningOverlay) {
                this.scanningOverlay.style.display = 'none';
            }
        });
    },

    setupButtons: function() {
        // 撮影ボタンの処理
        if (this.captureButton) {
            this.captureButton.addEventListener('click', () => {
                console.log('写真を撮影します');
                const scene = document.querySelector('a-scene');
                const img = scene.components.screenshot.getCanvas('perspective');
                
                // 画像をダウンロード
                const link = document.createElement('a');
                link.download = 'ar-dinosaur.png';
                link.href = img.toDataURL('image/png');
                link.click();
            });
        }

        // Webサイトボタンの処理
        if (this.websiteButton) {
            this.websiteButton.addEventListener('click', () => {
                window.open('https://www.instagram.com/techconnect.em/', '_blank');
            });
        }

        // 外に出すボタンの処理（基本実装）
        if (this.releaseButton) {
            this.releaseButton.addEventListener('click', () => {
                // TODO: AR平面認識への切り替え処理
                // まずは単純な拡大アニメーションを実装
                if (this.dinosaurModel) {
                    this.dinosaurModel.setAttribute('animation__scale', {
                        property: 'scale',
                        to: '2 2 2',
                        dur: 1500,
                        easing: 'easeOutElastic'
                    });
                    
                    this.dinosaurModel.setAttribute('animation__position', {
                        property: 'position',
                        to: '0 0 -2',
                        dur: 1500,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }
    }
});
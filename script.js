// ARコントローラーコンポーネントの定義
AFRAME.registerComponent('ar-controller', {
    init: function() {
        this.model = this.el.querySelector('#dinosaur');
        this.releaseButton = document.getElementById('release-button');
        this.isLargeSize = false;
        this.setupEventListeners();
    },

    setupEventListeners: function() {
        // マーカー認識時の処理
        this.el.addEventListener('targetFound', () => {
            console.log('マーカーを認識しました');
            this.model.setAttribute('visible', true);
            this.showARElements();
        });

        // マーカーロスト時の処理
        this.el.addEventListener('targetLost', () => {
            console.log('マーカーをロストしました');
            this.hideARElements();
        });

        // 箱から出すボタンの処理
        this.releaseButton.addEventListener('click', () => {
            if (!this.isLargeSize) {
                this.releaseDinosaur();
                this.isLargeSize = true;
            }
        });
    },

    showARElements: function() {
        document.querySelectorAll('.ar-only').forEach(el => {
            el.style.display = 'block';
        });
    },

    hideARElements: function() {
        document.querySelectorAll('.ar-only').forEach(el => {
            el.style.display = 'none';
        });
    },

    releaseDinosaur: function() {
        // 恐竜モデルを大きくするアニメーション
        this.model.setAttribute('animation', {
            property: 'scale',
            to: '2 2 2',
            dur: 1000,
            easing: 'easeOutElastic'
        });
        
        // 位置を調整するアニメーション
        this.model.setAttribute('animation__position', {
            property: 'position',
            to: '0 0 0',
            dur: 1000,
            easing: 'easeOutQuad'
        });

        // ボタンのテキストを変更
        this.releaseButton.textContent = '放出済み';
        this.releaseButton.style.backgroundColor = 'rgba(128, 128, 128, 0.8)';
    }
});

// 写真撮影機能の初期化
document.addEventListener('DOMContentLoaded', function() {
    const captureButton = document.getElementById('capture');
    
    captureButton.addEventListener('click', function() {
        const scene = document.querySelector('a-scene');
        const img = scene.components.screenshot.getCanvas('perspective');
        
        // 画像をダウンロード
        const link = document.createElement('a');
        link.setAttribute('download', 'ar-dinosaur.png');
        link.setAttribute('href', img.toDataURL('image/png'));
        link.click();
    });
});
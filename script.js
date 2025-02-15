AFRAME.registerComponent('ar-controller', {
    init: function() {
        this.scanningOverlay = document.getElementById('scanning-overlay');
        this.captureButton = document.getElementById('capture');
        this.websiteButton = document.getElementById('website-button');
        this.releaseButton = document.getElementById('release-button');
        this.dinosaurModel = this.el.querySelector('#dinosaur');
        
        this.createShareModal();
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

    createShareModal: function() {
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
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        this.shareModal = document.getElementById('share-modal');
        this.capturedImage = document.getElementById('captured-image');
        this.shareButton = document.getElementById('share-button');
        this.closeModal = document.getElementById('close-modal');
    },

    setupButtons: function() {
    if (this.captureButton) {
        this.captureButton.addEventListener('click', async () => {
            const scene = document.querySelector('a-scene');

            // キャプチャ前にデフォルトのダウンロード動作を防ぐための設定
            const originalGetCanvas = scene.components.screenshot.getCanvas;
            scene.components.screenshot.getCanvas = function() {
                const canvas = originalGetCanvas.apply(this, arguments);
                // デフォルトのダウンロードポップアップを防ぐ
                canvas.toBlob = function() {};
                return canvas;
            };

            // A-Frameシーンのスクリーンショットを取得
            const sceneCanvas = scene.components.screenshot.getCanvas('perspective');

            const video = document.querySelector('video');

            // 最終的なキャプチャ用キャンバスを作成
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = window.innerWidth;
            finalCanvas.height = window.innerHeight;
            const ctx = finalCanvas.getContext('2d');

            // 背景（カメラ映像）を描画
            if (video) {
                ctx.drawImage(video, 0, 0, finalCanvas.width, finalCanvas.height);
            }

            // A-Frameシーン（3Dモデル）を重ねて描画
            if (sceneCanvas) {
                ctx.drawImage(sceneCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
            }

            // キャプチャした画像データをモーダルに表示
            this.capturedImage.src = finalCanvas.toDataURL('image/png');
            this.shareModal.classList.remove('hidden');

            // 元のgetCanvas関数を復元
            scene.components.screenshot.getCanvas = originalGetCanvas;
        });
      
    }
      

        // Webサイトボタンの処理
        if (this.websiteButton) {
            this.websiteButton.addEventListener('click', () => {
                window.open('https://www.instagram.com/techconnect.em/', '_blank');
            });
        }

        // 外に出すボタンの処理
        if (this.releaseButton) {
            this.releaseButton.addEventListener('click', () => {
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
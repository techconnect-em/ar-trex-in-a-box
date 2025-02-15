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
                // シーン全体をキャプチャ
                const scene = document.querySelector('a-scene');
                
                // スクリーンショットを取得
                const canvas = scene.components.screenshot.getCanvas('perspective');
                
                // キャンバスのアスペクト比を調整
                const aspectRatio = window.innerHeight / window.innerWidth;
                const finalCanvas = document.createElement('canvas');
                const ctx = finalCanvas.getContext('2d');
                
                finalCanvas.width = window.innerWidth;
                finalCanvas.height = window.innerHeight;
                
                // 背景色を設定（透明にする場合は不要）
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
                
                // 元のキャンバスを描画
                ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);
                
                // 調整したキャンバスの内容をモーダルに表示
                this.capturedImage.src = finalCanvas.toDataURL('image/png');
                this.shareModal.classList.remove('hidden');
            });
        }
    },

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
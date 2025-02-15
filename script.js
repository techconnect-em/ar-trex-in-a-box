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
            // まず、A-Frameのスクリーンショットコンポーネントを呼び出して3Dシーンのキャンバスを確保
            // ※注意：レンダラーがpreserveDrawingBuffer: trueなら、キャンバスの内容が保持されます。
            scene.components.screenshot.capture('perspective');
            const sceneCanvas = scene.components.screenshot.getCanvas('perspective');
            
            // MindARのカメラ映像を取得（通常、ARシーンには <video> 要素があるのでこれでOK）
            const video = document.querySelector('video');
            
            // 最終的なキャプチャ用キャンバスを作成
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = window.innerWidth;
            finalCanvas.height = window.innerHeight;
            const ctx = finalCanvas.getContext('2d');
            
            // まず背景（カメラ映像）を描画
            if (video) {
                ctx.drawImage(video, 0, 0, finalCanvas.width, finalCanvas.height);
            }
            // 次に3Dシーン（A-Frameのキャンバス）を重ねて描画
            if (sceneCanvas) {
                ctx.drawImage(sceneCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
            }
            
            // 最終画像をデータURLに変換し、モーダルに表示
            this.capturedImage.src = finalCanvas.toDataURL('image/png');
            // モーダルを表示（クラス "hidden" を外す）
            this.shareModal.classList.remove('hidden');
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
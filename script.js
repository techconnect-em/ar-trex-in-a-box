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
        // 撮影ボタンの処理
        if (this.captureButton) {
            this.captureButton.addEventListener('click', async () => {
                const scene = document.querySelector('a-scene');
                const canvas = scene.components.screenshot.getCanvas('perspective');
                const aspectRatio = window.innerHeight / window.innerWidth;
                const finalCanvas = document.createElement('canvas');
                const ctx = finalCanvas.getContext('2d');
                
                finalCanvas.width = window.innerWidth;
                finalCanvas.height = window.innerHeight;
                
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
                ctx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);
                
                this.capturedImage.src = finalCanvas.toDataURL('image/png');
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
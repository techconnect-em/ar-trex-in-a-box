setupModelHandlers: function() {
    // モデルのロード完了時の処理
    this.model.addEventListener('model-loaded', () => {
        console.log('モデルが読み込まれました');
        
        // アニメーションミキサーの設定
        const mesh = this.model.getObject3D('mesh');
        if (mesh) {
            // モデルに含まれるアニメーションを確認
            const animations = mesh.animations;
            if (animations && animations.length > 0) {
                console.log('利用可能なアニメーション:', animations.map(a => a.name));
                
                // アニメーションミキサーの再設定
                this.model.removeAttribute('animation-mixer');
                this.model.setAttribute('animation-mixer', {
                    clip: 'Take 001',  // アニメーションクリップ名
                    loop: 'repeat',
                    timeScale: 1,
                    crossFadeDuration: 0.3
                });
            }

            // マテリアルの設定を確認
            if (mesh.material) {
                console.log('マテリアル設定:', mesh.material);
            }
        }
    });

    // モデルのロードエラー時の処理
    this.model.addEventListener('model-error', (error) => {
        console.error('モデルの読み込みエラー:', error);
    });
},
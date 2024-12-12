<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FBX Animation</title>
  <style>
    body { margin: 0; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script type="module">
    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
    import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/controls/OrbitControls.js';
    import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/loaders/FBXLoader.js';

    let scene, camera, renderer, mixer, clock;

    function init() {
      // シーンのセットアップ
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xeeeeee);

      // カメラのセットアップ
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 2, 5);

      // レンダラーのセットアップ
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // 照明の追加
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5);
      scene.add(directionalLight);

      // コントロールの追加
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;

      // クロックの初期化
      clock = new THREE.Clock();

      // FBXの読み込み
      loadFBX('path/to/your/model.fbx');
      
      // ウィンドウリサイズ対応
      window.addEventListener('resize', onWindowResize);

      animate();
    }

    function loadFBX(path) {
      const loader = new FBXLoader();

      loader.load(
        path,
        (object) => {
          // アニメーションミキサーを作成
          mixer = new THREE.AnimationMixer(object);

          // アニメーションを取得して再生
          if (object.animations.length > 0) {
            const action = mixer.clipAction(object.animations[0]);
            action.play();
          }

          // モデルをシーンに追加
          scene.add(object);
        },
        (xhr) => {
          console.log(`FBX読み込み進行: ${(xhr.loaded / xhr.total) * 100}% 完了`);
        },
        (error) => {
          console.error('FBX読み込みエラー:', error);
        }
      );
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);

      // アニメーションミキサーを更新
      if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    }

    // 初期化関数を呼び出し
    init();
  </script>
</body>
</html>

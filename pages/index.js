
import { useEffect } from 'react'
// import dynamic from 'next/dynamic'
// import { ArToolkitProfile, ArToolkitSource, ArToolkitContext, ArMarkerControls } from 'arjs/three.js/build/ar-threex.js'
import { ArToolkitProfile, ArToolkitContext, ArToolkitSource, ArMarkerControls } from '@ar-js-org/ar.js/three.js/build/ar-threex'
import * as THREE from 'three'
// import GLTFLoader from 'three-gltf-loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
// import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
// import dynamic from 'next/dynamic'
// import * as GLTFLoader from 'three/examples/jsm/loaders/GLTFLoader'
// import aaa from 'three/examples/jsm/loaders/GLTFLoader.js'
// require('three')

// import * as abc from 'three/examples/jsm/loaders/GLTFLoader'

export default function Home () {
  useEffect(() => {
    // global.THREE = window.THREE = THREE
    ArToolkitContext.baseURL = './'
    // init renderer
    var renderer = new THREE.WebGLRenderer({
      // antialias: true,
      alpha: true,
      physicalCorrectLights: true,
      premultipliedAlpha: true,
      antialias: true,
      toneMapping: 1
    })
    // renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    // renderer.setPixelRatio( 2 );
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    document.body.appendChild(renderer.domElement)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.gammaOutput = true
    renderer.physicallyCorrectLights = true
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.outputEncoding = THREE.sRGBEncoding
    // array of functions for the rendering loop
    var onRenderFcts = []

    // 這是總場景，最大的那個場景
    var scene = new THREE.Scene()
    // var ambient = new THREE.AmbientLight(0x404040) // 环境光
    // // ambient.position.set(0, 100, 100)
    // scene.add(ambient)
    // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6)
    // hemiLight.position.set(0, 100, 0)
    // scene.add(hemiLight)
    // const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    // dirLight.position.set(0, 100, 100)
    // scene.add(dirLight)

    // const PointLight = new THREE.PointLight(0xffffff, 0x444444, 0.6)
    // PointLight.position.set(0, 100, 0)
    // scene.add(PointLight)

    // const SpotLight = new THREE.SpotLight(0xffffff, 0x444444, 0.6)
    // SpotLight.position.set(0, 100, 0)
    // scene.add(SpotLight)

    /// ///////////////////////////////////////////////////////////////////////////////
    // Initialize a basic camera
    /// ///////////////////////////////////////////////////////////////////////////////

    // Create a camera
    var camera = new THREE.Camera()
    scene.add(camera)

    const artoolkitProfile = new ArToolkitProfile()
    artoolkitProfile.sourceWebcam()

    const arToolkitSource = new ArToolkitSource(artoolkitProfile.sourceParameters)

    arToolkitSource.init(function onReady () {
      onResize()
    })

    // handle resize
    window.addEventListener('resize', function () {
      onResize()
    })
    function onResize () {
      arToolkitSource.onResizeElement()
      arToolkitSource.copyElementSizeTo(renderer.domElement)
      if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
      }
    }

    /// /////////////////////////////////////////////////////////////////////////////
    //          initialize arToolkitContext
    /// /////////////////////////////////////////////////////////////////////////////

    // create atToolkitContext
    var arToolkitContext = new ArToolkitContext({
      cameraParametersUrl: ArToolkitContext.baseURL + 'camera_para.dat',
      detectionMode: 'mono'
    })

    // initialize it
    arToolkitContext.init(function onCompleted () {
    // copy projection matrix to camera
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
    })

    // update artoolkit on every frame
    onRenderFcts.push(function () {
      if (arToolkitSource.ready === false) return

      arToolkitContext.update(arToolkitSource.domElement)
    })

    /// /////////////////////////////////////////////////////////////////////////////
    //          Create a ArMarkerControls
    /// /////////////////////////////////////////////////////////////////////////////

    // 這裡存放marker掃描後出現的場景
    var markerGroup = new THREE.Group()
    scene.add(markerGroup)

    var markerControls = new ArMarkerControls(arToolkitContext, markerGroup, {
      type: 'pattern',
      patternUrl: 'patt.hiro'
    })

    /// ///////////////////////////////////////////////////////////////////////////////
    // add an object in the scene
    /// ///////////////////////////////////////////////////////////////////////////////

    var markerScene = new THREE.Scene()
    markerGroup.add(markerScene)

    // var mesh = new THREE.AxesHelper()
    // markerScene.add(mesh)

    // // add a torus knot
    // var geometry = new THREE.BoxGeometry(1, 1, 1)
    // var material = new THREE.MeshNormalMaterial({
    //   transparent: true,
    //   opacity: 0.5,
    //   side: THREE.DoubleSide
    // })
    // var mesh = new THREE.Mesh(geometry, material)
    // mesh.position.y = geometry.parameters.height / 2
    // markerScene.add(mesh)

    // var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16)
    // var material = new THREE.MeshNormalMaterial()
    // var mesh = new THREE.Mesh(geometry, material)
    // mesh.position.y = 0.5
    // markerScene.add(mesh)

    // onRenderFcts.push(function (delta) {
    //   mesh.rotation.x += delta * Math.PI
    // })

    // const ktx2Loader = new KTX2Loader()
    //   .setTranscoderPath('three/examples/js/libs/basis/')
    //   .detectSupport(renderer)
    // 新模型
    const loader = new GLTFLoader()
    // loader.setKTX2Loader(ktx2Loader)
    // loader.setMeshoptDecoder(MeshoptDecoder)
    // 加載gltf文件
    loader.load('/test5/scene.gltf', gltf => {
    // loader.load('coffeemat.glb', gltf => {
      // loader.load('jaychou.glb', gltf => {
    //   gltf.scene.traverse(child => {
    //     if (child.material) child.material.metalness = 0

      // })
      // gltf.scene.traverse(child => {
      //   if (child.isMesh) {
      //     child.castShadow = true
      //     child.receiveShadow = true

      //     if (child.material.map) {
      //       child.material.map.anisotropy = 8
      //     }
      //   }
      // })
      // gltf.scene.traverse(function (child) {
      //   if (child.isMesh) {
      //     child.material.emissive = child.material.color
      //     child.material.emissiveMap = child.material.map
      //   }
      // })
      // model is a THREE.Group (THREE.Object3D)
      // const mixer = new THREE.AnimationMixer(gltf.scene)
      // // animations is a list of THREE.AnimationClip
      // for (const anim of gltf.animations) {
      //   mixer.clipAction(anim).play()
      // }
      // // settings in `sceneList` "Monster"
      gltf.scene.scale.set(0.5, 0.5, 0.5)
      gltf.scene.rotation.set(-1.5, 0, 0)
      // gltf.scene.rotation.copy(new THREE.Euler(0, -3 * Math.PI / 4, 0))
      // gltf.scene.position.set(2, 1, 0)
      console.log(gltf)
      markerScene.add(gltf.scene)
      // markerGroup.add({ gltf, mixer })
      // objs.push({ gltf, mixer })
    })
    /// ///////////////////////////////////////////////////////////////////////////////
    //  render the whole thing on the page
    /// ///////////////////////////////////////////////////////////////////////////////
    onRenderFcts.push(function () {
      renderer.render(scene, camera)
    })

    // run the rendering loop
    var lastTimeMsec = null
    requestAnimationFrame(function animate (nowMsec) {
    // keep looping
      requestAnimationFrame(animate)
      // measure time
      lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
      lastTimeMsec = nowMsec
      // call each update function
      onRenderFcts.forEach(function (onRenderFct) {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000)
      })
    })
  }, [])

  return (
    <div
      style={{ width: '800px', height: '800px' }}
      // ref={mount => { mount = mount }}
    />
  )
}

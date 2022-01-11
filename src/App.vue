<template>
    <ThreeWrap :start="start" />
</template>

<script setup lang="ts">
import { ThreeWrap, Vue3ThreeWrap } from 'vue3-three-wrap'
import * as THREE from 'three'
import { createExtendedMaterial } from './extendMaterial'

// build boxes
const buildBox = function (x: number, material: any) {
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(),
        createExtendedMaterial({
            original: material,
            parameters: { color: 'blue' },
            header: 'vec4 red = rgba(1., 0., 0., 1.);',
            fragment: { '@}': 'gl_FragColor = red; }' },
        })
    )
    box.scale.setScalar(0.5)
    box.position.x = x
    box.position.z = -3
    return box
}

// add the box
// `start` runs once when the scene is ready
const start: Vue3ThreeWrap.Start = (opts) => {
    opts.camera.position.x = 3
    opts.camera.position.y = 5
    opts.camera.lookAt(0, 0, -3)
    const sun = new THREE.DirectionalLight()
    sun.position.x = -2
    sun.position.z = 5
    opts.scene.add(sun)

    const mats = [
        THREE.LineBasicMaterial,
        THREE.LineDashedMaterial,
        THREE.MeshBasicMaterial,
        THREE.MeshDepthMaterial,
        THREE.MeshLambertMaterial,
        THREE.MeshMatcapMaterial,
        THREE.MeshNormalMaterial,
        THREE.MeshPhongMaterial,
        THREE.MeshPhysicalMaterial,
        THREE.MeshStandardMaterial,
        THREE.MeshToonMaterial,
        THREE.PointsMaterial,
        // THREE.RawShaderMaterial,
        // THREE.ShaderMaterial,
        THREE.ShadowMaterial,
        // THREE.SpriteMaterial,
    ]
    mats.map((mat, i) => buildBox(i - mats.length * 0.5, mat)).forEach(
        (box) => {
            opts.scene.add(box)
        }
    )
}
</script>
<template>
    <ThreeWrap :start="start" :update="update" />
</template>

<script setup lang="ts">
import { ThreeWrap, Vue3ThreeWrap } from 'vue3-three-wrap'
import * as THREE from 'three'
import { extendMaterial } from './extendMaterial'

// build boxes
const buildBox = function (x: number, material: any) {
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(),
        extendMaterial({
            original: material,
            properties: { color: 'blue' },
            // uniforms: {
            //     testUniform: { value: 0.3 },
            // },
            // header: 'uniform float testUniform;',
            // fragment: {
            //     '?}': 'gl_FragColor = vec4(vec3(testUniform), 1.);',
            // },
        })
    )
    box.scale.setScalar(0.5)
    box.position.x = x
    return box
}

const sun = new THREE.DirectionalLight()
const group = new THREE.Group()

// add the box
// `start` runs once when the scene is ready
const start: Vue3ThreeWrap.Start = (opts) => {
    opts.camera.position.x = 3
    opts.camera.position.y = 2
    opts.camera.lookAt(0, 0, -3)
    sun.position.x = -2
    sun.position.z = 5
    opts.scene.add(sun)

    opts.scene.background = new THREE.Color('black')

    const mats = [
        // THREE.LineBasicMaterial,
        // THREE.LineDashedMaterial,
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
        // THREE.ShadowMaterial,
        // THREE.RawShaderMaterial,
        // THREE.ShaderMaterial,
        // THREE.SpriteMaterial,
    ]
    mats.map((mat, i) => buildBox(i - mats.length * 0.5, mat)).forEach(
        (box) => {
            group.add(box)
        }
    )
    opts.scene.add(group)
    group.position.z = -3
}

const update: Vue3ThreeWrap.Update = (opts) => {
    // sun.position.z = Math.sin(Date.now() * 0.001) * 10
    group.rotation.y = Date.now() * 0.0003
}
</script>
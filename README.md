# Extending Materials

Simplified fork of [Fyrestar's material extension methods](https://github.com/Fyrestar/THREE.extendMaterial).

Function for extending built-in materials. Creates a `ShaderMaterial` that matches the desired material, along with your own edits to the shader and custom uniforms.

`npm install extend-material`

```javascript
import { extendMaterial } from 'extend-material'

const myMaterial = extendMaterial({
    // Class of the material you'd like to extend
    original: THREE.MeshBasicMaterial,

    // Will be prepended to vertex and fragment code
    header: 'varying vec3 vEye;',

    // Will be prepended to vertex code
    headerVertex: '',

    // Will be prepended to fragment code
    headerFragment: '',

    // Insert code lines by hinting at a existing
    vertex: {
        // Inserts the line after #include <fog_vertex>

        '#include <fog_vertex>': 'vEye = normalize(cameraPosition - w.xyz);',

        // Replaces a line (@ prefix) inside of the project_vertex include

        project_vertex: {
            '@vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );':
                'vec4 mvPosition = modelViewMatrix * vec4( transformed * 0.5, 1.0 );',
        },
    },
    fragment: {
        '#include <envmap_fragment>':
            'diffuseColor.rgb += pow(dot(vNormal, vEye), 3.0);',
    },

    // Properties to apply to the new THREE.ShaderMaterial
    properties: {
        skinning: true,
    },

    // Uniforms (will be applied to existing or added) as value or uniform object
    uniforms: {
        // Use a value directly
        diffuse: new THREE.Color(0xffffff),
    },
})
```

## Patching shader code

Code can be appended, prepended and replaced by providing some indicating line code (typically includes like above) and a prefix to define if the code should be appended, prepended to the hinted line or replace it.

| Prefix | Insertion |
| ------ | --------- |
| none   | append    |
| ?      | prepend   |
| @      | replace   |

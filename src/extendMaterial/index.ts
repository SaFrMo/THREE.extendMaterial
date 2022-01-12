import * as THREE from 'three'
import { applyPatches } from './applyPatches'

export const extendMaterial = function <T extends THREE.Material>(
    opts: MaterialExtendConfig<T>
) {
    // Prep config
    // ====================
    const original = opts.original

    const header = opts.header ?? ''
    const headerVertex = opts.headerVertex ?? ''
    const headerFragment = opts.headerFragment ?? ''

    // TODO: endVertex? endFragment?

    const vertex = opts.vertex ?? {}
    const fragment = opts.fragment ?? {}

    const parameters = opts.properties
        ? Array.isArray(opts.properties)
            ? opts.properties
            : [opts.properties]
        : [{}]

    // Save shader
    // ====================
    // ShaderLib (https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib.js)
    // contains properties with the same name as the material, but:
    // - lowercase
    // - without `line`, `mesh`, or `material`
    // Let's calculate the short name and save it...
    const materialShortName = original.name
        .toLowerCase()
        .replace('line', '')
        .replace('mesh', '')
        .replace('material', '')
    // ...then use it to find the original shaders
    const originalVertex = THREE.ShaderLib[materialShortName]?.vertexShader
    const originalFragment = THREE.ShaderLib[materialShortName]?.fragmentShader

    // Instantiate material
    // ====================
    const material = new original(...parameters)
    const properties: THREE.ShaderMaterialParameters = {
        fragmentShader: '',
        vertexShader: '',
        lights: Object.keys(
            THREE.ShaderLib[materialShortName].uniforms
        ).includes('ambientLightColor'),
    }

    // Make sure we have both before continuing
    if (!originalVertex || !originalFragment) {
        console.log(
            `Missing ShaderLib entry for ${original.name} (checked under ${materialShortName}). Using base material ${original.name}`
        )
        return material
    }

    // Update shaders
    // ====================
    const sharedHeader = header + '\n'

    const finalMaterial = new THREE.ShaderMaterial(properties)

    finalMaterial.vertexShader =
        sharedHeader +
        (headerVertex ? headerVertex + '\n' : '') +
        applyPatches(originalVertex, vertex)
    finalMaterial.fragmentShader =
        sharedHeader +
        (headerFragment ? headerFragment + '\n' : '') +
        applyPatches(originalFragment, fragment)
    finalMaterial.uniforms = THREE.ShaderLib[materialShortName].uniforms

    Object.keys(material).forEach((key) => {
        ;(finalMaterial as any)[key] =
            (finalMaterial as any)[key] ?? (material as any)[key]
        finalMaterial.uniforms[key === 'color' ? 'diffuse' : key] = {
            value: (material as any)[key],
        }
    })

    // add custom uniforms
    const uniformsSource = opts.uniforms ?? {}
    Object.keys(uniformsSource).forEach((key) => {
        finalMaterial.uniforms[key] = uniformsSource[key]
    })

    return finalMaterial
}

import * as THREE from 'three'
import { applyPatches } from './applyPatches'

interface MaterialExtendConfig<T extends THREE.Material> {
    original: { new (...args: any[]): T }

    header?: string
    headerVertex?: string
    headerFragment?: string

    vertex?: LineReplacements
    fragment?: LineReplacements

    parameters?: any
    uniforms?: any

    // TODO: templates support?
    // https://github.com/Fyrestar/THREE.extendMaterial#templates
}
interface MaterialExtendProperties extends THREE.ShaderMaterialParameters {
    // fragmentShader: string
    // vertexShader: string
}

export const createExtendedMaterial = function <T extends THREE.Material>(
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

    const parameters = opts.parameters
        ? Array.isArray(opts.parameters)
            ? opts.parameters
            : [opts.parameters]
        : [{}]
    const uniforms = opts.uniforms ?? {}

    // const orig = new THREE.WebGLPrograms(). // new original(...parameters)
    // orig.def

    // Instantiate material
    // ====================
    const material = new original(...parameters)
    const properties: MaterialExtendProperties = {
        fragmentShader: '',
        vertexShader: '',
    }

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
    properties.uniforms = (material as any).uniforms

    // Make sure we have both before continuing
    if (!originalVertex || !originalFragment) {
        console.log(
            `Missing ShaderLib entry for ${original.name} (checked under ${materialShortName}). Using base material ${original.name}`
        )
        return new original(...parameters)
    }

    // Update shaders
    // ====================
    const sharedHeader = header + '\n'
    properties.vertexShader =
        sharedHeader +
        (headerVertex ? headerVertex + '\n' : '') +
        applyPatches(originalVertex, vertex)
    properties.fragmentShader =
        sharedHeader +
        (headerFragment ? headerFragment + '\n' : '') +
        applyPatches(originalFragment, fragment)

    // Apply updates
    // ====================
    // material.setValues(properties)
    // console.log(properties)

    const finalMaterial = new THREE.ShaderMaterial(properties)
    console.log(material.defines)

    Object.keys(material).forEach((key) => {
        console.log(
            key,
            // (opts?.parameters as any)?.[key] ??
            (finalMaterial as any)[key] ?? (material as any)[key]
        )
        ;(finalMaterial as any)[key] =
            // (opts?.parameters as any)?.[key] ??
            (finalMaterial as any)[key] ?? (material as any)[key]
    })
    console.log(finalMaterial)
    return finalMaterial
}

// extendMaterial(THREE.MeshPhysicalMaterial, {
//     material: {},
// })

// goal:
/*
const mat = new ExtendedMaterial({
    original: THREE.MeshBasicMaterial,
    header: '',
    headerVertex: '',
    headerFragment: '',

    vertex: {
        'source line': 'append line',
        'include file': {
            'source line (in included file)': 'append line'
        }
    },

    fragment: { 
       // see vertex
    },

    properties: {
        // material properties
    },

    uniforms: {
        // Use a value directly, uniform object will be created for or ..
		diffuse: new THREE.Color(0xffffff),

		// ... provide the uniform object, by declaring a shared: true property and such you can ensure
		// the object will be shared across materials rather than cloned.
		emissive: {
			shared: true, // This uniform can be shared across all materials it gets assigned to, sharing the value
			mixed : true, // When creating a material with/from a template this will be passed through
			linked: true, // To share them when used as template but not when extending them further, this ensures you don’t have
						  // to sync. uniforms from your original material with the depth material for shadows for example (see Demo)
			value: new THREE.Color('pink')
		}
    }
})

Patching shader code:
Prefix  Insertion
none	append
?	    prepend
@	    replace
*/

import * as THREE from 'three'

export const applyPatches = (original: string, map: LineReplacements) => {
    let output = original

    for (let name in map) {
        const val = map[name]

        if (typeof val === 'string') {
            // String replacement
            const slicedLine = name.slice(1)

            // regular replacement
            switch (name[0]) {
                case '@':
                    // Replace
                    output = output.replace(slicedLine, val)
                    break
                case '?':
                    // Prepend
                    output = output.replace(slicedLine, val + '\n' + slicedLine)
                    break
                default:
                    // Insert after
                    // if (!output) {
                    // console.error(
                    //     "THREE.patchShader: chunk not found '%s'",
                    //     name
                    // )
                    // } else {
                    output = output.replace(name, name + '\n' + val)
                    // }
                    break
            }
        } else {
            // Chunk replacement
            if (THREE.ShaderChunk[name] === undefined) {
                console.error(
                    'ShaderMaterial.extend: ShaderChunk "%s" not found',
                    name
                )
            } else {
                output = output.replace(
                    '#include <' + name + '>',
                    applyPatches(THREE.ShaderChunk[name], val)
                )
            }
        }
    }

    return output
}

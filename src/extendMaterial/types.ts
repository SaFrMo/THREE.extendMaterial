type Defines = Record<string, any>
type Properties = {
    defines?: Defines
    lights?: boolean
    [key: string]: any
}
type LineReplacements = Record<string, string | Record<string, string>>

interface MaterialExtendConfig<T extends THREE.Material> {
    original: { new (...args: any[]): T }

    header?: string
    headerVertex?: string
    headerFragment?: string

    vertex?: LineReplacements
    fragment?: LineReplacements

    properties?: Properties
    uniforms?: Record<string, any>

    // TODO: templates support?
    // https://github.com/Fyrestar/THREE.extendMaterial#templates
}

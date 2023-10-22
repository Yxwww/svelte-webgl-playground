declare module '*.glsl' {
  const value: string
  export default value
}
declare module '*.vert' {
  const value: string
  export default value
}
declare module '*.frag' {
  const value: string
  export default value
}
declare interface NodeModule {
  hot: {
    accept(path?: string, callback?: () => void): void
  }
}

type Maybe<T> = T | void

type Vec2 = [number, number]
type Vec3 = [number, number, number]
type Vec4 = [number, number, number, number]

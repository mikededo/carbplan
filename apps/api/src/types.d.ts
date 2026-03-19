declare module 'bun' {
  interface Env {
    ENVIRONMENT?: 'development' | 'production'
  }
}

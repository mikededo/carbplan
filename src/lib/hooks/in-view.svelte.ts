type InViewOptions = {
  threshold?: number
  triggerOnce?: boolean
}

export class InView {
  isInView = $state(false)
  get ref() {
    return this.#element
  }

  set ref(element: HTMLElement | null) {
    if (this.#element) {
      this.#observer?.unobserve(this.#element)
    }

    this.#element = element

    if (element) {
      this.#observer?.observe(element)
    }
  }

  #element: HTMLElement | null = $state(null)

  #observer: IntersectionObserver | null = null

  #triggerOnce: boolean

  constructor(options: InViewOptions = {}) {
    const threshold = options.threshold ?? 0.1
    this.#triggerOnce = options.triggerOnce ?? false

    if (typeof window !== 'undefined') {
      this.#observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.isInView = true
            if (this.#triggerOnce) {
              this.#observer?.disconnect()
            }
          } else if (!this.#triggerOnce) {
            this.isInView = false
          }
        },
        { threshold }
      )
    }
  }

  destroy() {
    this.#observer?.disconnect()
  }
}

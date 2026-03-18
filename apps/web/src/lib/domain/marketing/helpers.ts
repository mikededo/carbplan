type TransformType = 'scale' | 'translateX' | 'translateY'

type VisibilityStyleOptions = {
  delay?: number
  offset?: number
  transform?: TransformType
}

const DEFAULTS = {
  offset: 20,
  scale: 0.95,
  transform: 'translateY'
} as const

/**
 * Generates inline styles for visibility-based animations.
 * Used across landing page components for consistent enter animations.
 */
export const entryStyles = (
  isVisible: boolean,
  options: VisibilityStyleOptions = {}
): string => {
  const { delay, offset = DEFAULTS.offset, transform = DEFAULTS.transform } = options

  const opacity = `opacity: ${isVisible ? 1 : 0}`

  let transformValue: string
  if (transform === 'scale') {
    transformValue = `transform: scale(${isVisible ? 1 : DEFAULTS.scale})`
  } else {
    const px = isVisible ? 0 : offset
    transformValue = `transform: ${transform}(${px}px)`
  }

  const delayValue = delay !== undefined ? `; transition-delay: ${delay}ms` : ''

  return `${opacity}; ${transformValue}${delayValue};`
}

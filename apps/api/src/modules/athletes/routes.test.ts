import { getAthletesPath, getMeAthletesPath } from '$modules/athletes/routes'

describe('getAthletesPath', () => {
  it('returns the correct runtime value', () => {
    expect(getAthletesPath('/profile')).toBe('/v1/athletes/profile')
  })

  it('returns a literal type, not a wide string', () => {
    const path = getAthletesPath('/profile')
    expectTypeOf(path).toEqualTypeOf<'/v1/athletes/profile'>()
  })

  it('does not return a wide string type', () => {
    const path = getAthletesPath('/profile')
    expectTypeOf(path).not.toEqualTypeOf<string>()
  })
})

describe('getMeAthletesPath', () => {
  it('returns the correct runtime value', () => {
    expect(getMeAthletesPath('/profile')).toBe('/v1/athletes/me/profile')
  })

  it('returns a literal type, not a wide string', () => {
    const path = getMeAthletesPath('/profile')
    expectTypeOf(path).toEqualTypeOf<'/v1/athletes/me/profile'>()
  })

  it('does not return a wide string type', () => {
    const path = getMeAthletesPath('/profile')
    expectTypeOf(path).not.toEqualTypeOf<string>()
  })
})

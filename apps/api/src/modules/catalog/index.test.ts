import type { Treaty } from '@elysiajs/eden'

import type { CatalogService } from '$modules/catalog/services'

import * as CatalogContracts from '@carbplan/contracts/catalog'
import { treaty } from '@elysiajs/eden'
import { okAsync } from 'neverthrow'

import { catalogModule } from '$modules/catalog'
import { createAuthServerStub } from '$test/stubs/auth-server'
import { createStub } from '$test/stubs/helpers'

const catalogService = createStub<CatalogService>(['createBrand', 'updateBrand'])
const createCatalogApp = ({ isAdmin }: { isAdmin?: boolean } = {}) => treaty(catalogModule({
  auth: createAuthServerStub({
    authSession: isAdmin === undefined
      ? null
      : { session: { id: 'session-id' }, user: { id: 'athlete-id', isAdmin } }
  }),
  services: {
    catalog: catalogService
  }
}))

const shouldBeAdminProtected = <T extends Record<number, unknown>>(
  promise: (app: ReturnType<typeof createCatalogApp>) => Promise<Treaty.TreatyResponse<T>>
) => {
  it('returns 401 for unauthenticated users', async () => {
    const app = createCatalogApp()
    const response = await promise(app)
    expect(response.status).toBe(401)
  })

  it('returns 403 for non-admin users', async () => {
    const app = createCatalogApp({ isAdmin: false })
    const response = await promise(app)
    expect(response.status).toBe(403)
  })
}

describe('catalog HTTP contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('[POST] /v1/catalog/brand ', () => {
    const requestBody = {
      isActive: true,
      name: 'Brand One',
      slug: 'brand-one'
    }

    shouldBeAdminProtected((app) => app.v1.catalog.brand.post(requestBody))

    it('allows admin users', async () => {
      const model: CatalogContracts.CreateBrandResponse = {
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        description: null,
        id: crypto.randomUUID(),
        isActive: true,
        logoUrl: null,
        name: 'Brand One',
        slug: 'brand-one',
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        website: null
      }
      catalogService.createBrand.mockReturnValue(okAsync(model))

      const app = createCatalogApp({ isAdmin: true })
      const response = await app.v1.catalog.brand.post(requestBody)
      expect(response.status).toBe(200)
      CatalogContracts.CreateBrandResponseSchema.parse(response.data)
    })
  })

  describe('[PATCH] /v1/catalog/brand/:brandId', () => {
    const brandId = crypto.randomUUID()

    shouldBeAdminProtected(
      (app) => app.v1.catalog.brand({ brandId }).patch({ name: 'brand name' })
    )

    // FIXME: NoContent fail when passing null/undefined: https://github.com/elysiajs/elysia/pull/1810
    it.skip('allows admin users', async () => {
      catalogService.updateBrand.mockReturnValue(okAsync(true))

      const app = createCatalogApp({ isAdmin: true })
      const response = await app.v1.catalog.brand({ brandId }).patch({ name: 'brand name' })
      expect(response.status).toBe(200)
      CatalogContracts.UpdateBrandResponseSchema.parse(response.data)
    })
  })
})

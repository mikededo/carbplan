
import { treaty } from '@elysiajs/eden'
import { okAsync } from 'neverthrow'

import { catalogModule } from '$modules/catalog'
import { createAuthServerStub } from '$test/stubs/auth-server'

const createCatalogApp = ({ isAdmin }: { isAdmin?: boolean } = {}) => treaty(catalogModule({
  auth: createAuthServerStub({
    authSession: isAdmin === undefined
      ? null
      : { session: { id: 'session-id' }, user: { id: 'athlete-id', isAdmin } }
  }),
  services: {
    catalog: {
      createBrand: () => okAsync({
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        description: null,
        id: crypto.randomUUID(),
        isActive: true,
        logoUrl: null,
        name: 'Brand One',
        slug: 'brand-one',
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        website: null
      })
    }
  }
}))

const requestBody = {
  isActive: true,
  name: 'Brand One',
  slug: 'brand-one'
}

describe('catalog HTTP contract', () => {
  describe('[POST] /v1/catalog/brand ', () => {
    it('returns 401 for unauthenticated users', async () => {
      const app = createCatalogApp()
      const response = await app.v1.catalog.brand.post(requestBody)
      expect(response.status).toBe(401)
    })

    it('returns 403 for non-admin users', async () => {
      const app = createCatalogApp({ isAdmin: false })
      const response = await app.v1.catalog.brand.post(requestBody)
      expect(response.status).toBe(403)
    })

    it('allows admin users', async () => {
      const app = createCatalogApp({ isAdmin: true })
      const response = await app.v1.catalog.brand.post(requestBody)
      expect(response.status).toBe(200)
    })
  })
})

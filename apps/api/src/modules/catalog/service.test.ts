import type { CreateBrandData, CreateBrandDataResult } from '$modules/catalog/model'
import type { CatalogRepository } from '$modules/catalog/repository'
import type { UserRepository } from '$modules/user/repository'

import { okAsync } from 'neverthrow'

import { CatalogServiceImpl } from '$modules/catalog/services'
import { UserNotPlatformAdminError } from '$modules/user/model'
import { createStub } from '$test/stubs/helpers'

const model: Required<CreateBrandData> = {
  description: 'brand description',
  isActive: true,
  logoUrl: 'https://example.com/logo.png',
  name: 'brand name',
  slug: 'brand-slug',
  website: 'https://example.com'
}
const catalogRepository = createStub<CatalogRepository>(['createBrand'])
const userRepository = createStub<UserRepository>(['isUserPlatformAdmin'])
const service = new CatalogServiceImpl(catalogRepository, userRepository)

describe('catalog service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('.createBrand', () => {
    it('creates a brand if user is a platform admin', async () => {
      const resultModel: CreateBrandDataResult = {
        ...model,
        createdAt: new Date(),
        id: 'brand-id',
        updatedAt: new Date()
      }
      catalogRepository.createBrand.mockReturnValue(okAsync(resultModel))
      userRepository.isUserPlatformAdmin.mockReturnValue(okAsync(true))

      await expect(service.createBrand(model)).toBeOkAsyncWith(resultModel)
    })

    it('returns an error if the user is a platform admin', async () => {
      userRepository.isUserPlatformAdmin.mockReturnValue(okAsync(false))
      await expect(service.createBrand(model)).toBeErrAsyncWith(new UserNotPlatformAdminError())
    })
  })
})

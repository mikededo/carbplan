import type { ResultAsync } from 'neverthrow'

import type { CreateBrandData, CreateBrandDataResult, CreateBrandError } from '$modules/catalog/model'
import type { CatalogRepository } from '$modules/catalog/repository'
import type { UserRepository } from '$modules/user/repository'

import { err } from 'neverthrow'

import { UserNotPlatformAdminError } from '$modules/user/model'

export type CatalogService = {
  createBrand: (data: CreateBrandData) => ResultAsync<CreateBrandDataResult, CreateBrandError | UserNotPlatformAdminError>
}

export class CatalogServiceImpl implements CatalogService {
  constructor(
    private readonly repository: CatalogRepository,
    private readonly userRepository: UserRepository
  ) { }

  createBrand(data: CreateBrandData): ResultAsync<CreateBrandDataResult, CreateBrandError | UserNotPlatformAdminError> {
    return this.userRepository.isUserPlatformAdmin('')
      .andThen(
        (isAdmin) => isAdmin ? this.repository.createBrand(data) : err(new UserNotPlatformAdminError())
      )
  }
}

import type { BrandId, UserId } from '@carbplan/db'
import type { ResultAsync } from 'neverthrow'

import type { CreateBrandData, CreateBrandDataResult, CreateBrandError, UpdateBrandData, UpdateBrandError } from '$modules/catalog/model'
import type { CatalogRepository } from '$modules/catalog/repository'
import type { UserRepository } from '$modules/user/repository'

import { errAsync } from 'neverthrow'

import { UserNotPlatformAdminError } from '$modules/user/model'

type AuthGuardedArgs = { userId: UserId }
type CreateBrandArgs = { data: CreateBrandData } & AuthGuardedArgs
type UpdateBrandArgs = {
  brandId: BrandId
  data: UpdateBrandData
} & AuthGuardedArgs
export type CatalogService = {
  createBrand: (args: CreateBrandArgs) => ResultAsync<CreateBrandDataResult, CreateBrandError | UserNotPlatformAdminError>
  updateBrand: (args: UpdateBrandArgs) => ResultAsync<boolean, UpdateBrandError | UserNotPlatformAdminError>
}

export class CatalogServiceImpl implements CatalogService {
  constructor(
    private readonly repository: CatalogRepository,
    private readonly userRepository: UserRepository
  ) { }

  createBrand({ data, userId }: CreateBrandArgs): ResultAsync<CreateBrandDataResult, CreateBrandError | UserNotPlatformAdminError> {
    return this.withAdminGuard(userId, () => this.repository.createBrand(data))
  }

  updateBrand({ brandId, data, userId }: UpdateBrandArgs): ResultAsync<boolean, UpdateBrandError | UserNotPlatformAdminError> {
    return this.withAdminGuard(userId, () => this.repository.updateBrand(brandId, data))
  }

  private withAdminGuard<T, E>(
    id: UserId,
    callback: () => ResultAsync<T, E>
  ): ResultAsync<T, E | UserNotPlatformAdminError> {
    return this.userRepository.isUserPlatformAdmin(id).andThen(
      (isAdmin): ResultAsync<T, E | UserNotPlatformAdminError> => isAdmin ? callback() : errAsync(new UserNotPlatformAdminError())
    )
  }
}

import type { BrandId, ProductId, UserId } from '@carbplan/db'
import type { ResultAsync } from 'neverthrow'

import type {
  CreateBrandData,
  CreateBrandDataResult,
  CreateBrandError,
  CreateProductData,
  CreateProductDataResult,
  CreateProductError,
  UpdateBrandData,
  UpdateBrandError,
  UpdateProductData,
  UpdateProductError
} from '$modules/catalog/model'
import type { CatalogRepository } from '$modules/catalog/repository'
import type { UserRepository } from '$modules/user/repository'

import { errAsync } from 'neverthrow'

import { UserNotPlatformAdminError } from '$modules/user/model'

type AuthGuardedArgs<T> = { data: T } & { userId: UserId }
type UpdateBrandArgs = { brandId: BrandId } & AuthGuardedArgs<UpdateBrandData>
type UpdateProductArgs = { productId: ProductId } & AuthGuardedArgs<UpdateProductData>
export type CatalogService = {
  createBrand: (args: AuthGuardedArgs<CreateBrandData>) => ResultAsync<CreateBrandDataResult, CreateBrandError | UserNotPlatformAdminError>
  createProduct: (args: AuthGuardedArgs<CreateProductData>) => ResultAsync<CreateProductDataResult, CreateProductError | UserNotPlatformAdminError>
  updateBrand: (args: UpdateBrandArgs) => ResultAsync<boolean, UpdateBrandError | UserNotPlatformAdminError>
  updateProduct: (args: UpdateProductArgs) => ResultAsync<boolean, UpdateProductError | UserNotPlatformAdminError>
}

export class CatalogServiceImpl implements CatalogService {
  constructor(
    private readonly repository: CatalogRepository,
    private readonly userRepository: UserRepository
  ) { }

  createBrand({ data, userId }: AuthGuardedArgs<CreateBrandData>): ResultAsync<CreateBrandDataResult, CreateBrandError | UserNotPlatformAdminError> {
    return this.withAdminGuard(userId, () => this.repository.createBrand(data))
  }

  createProduct({ data, userId }: AuthGuardedArgs<CreateProductData>): ResultAsync<CreateProductDataResult, CreateProductError | UserNotPlatformAdminError> {
    return this.withAdminGuard(userId, () => this.repository.createProduct(data))
  }

  updateBrand({ brandId, data, userId }: UpdateBrandArgs): ResultAsync<boolean, UpdateBrandError | UserNotPlatformAdminError> {
    return this.withAdminGuard(userId, () => this.repository.updateBrand(brandId, data))
  }

  updateProduct({ data, productId, userId }: UpdateProductArgs): ResultAsync<boolean, UpdateProductError | UserNotPlatformAdminError> {
    return this.withAdminGuard(userId, () => this.repository.updateProduct(productId, data))
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

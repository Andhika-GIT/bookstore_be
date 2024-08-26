import { EntityRepository, Populate } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';

export async function handleFindOrFail<T extends object>(
  repository: EntityRepository<T>,
  query: any,
  populate?: Populate<T>, //
): Promise<T> {
  try {
    const entity = await repository.findOneOrFail(query, {
      populate,
      failHandler: (entityName: string) => {
        throw new NotFoundException(`${entityName} not found`);
      },
    });
    return entity;
  } catch (error) {
    console.log(error);
    if (error instanceof NotFoundException) {
      throw error;
    } else {
      console.error(`Failed to find entity:`, error);
      throw new Error('Internal Server Error');
    }
  }
}

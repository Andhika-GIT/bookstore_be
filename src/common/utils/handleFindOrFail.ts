// src/utils/error-handling.ts

import { EntityRepository } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';

export async function handleFindOrFail<T extends object>(
  repository: EntityRepository<T>,
  query: any,
): Promise<T> {
  try {
    const entity = await repository.findOneOrFail(query, {
      failHandler: (entityName: string) => {
        throw new NotFoundException(`${entityName} not found`);
      },
    });
    return entity;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error; // Re-throw NotFoundException to handle it elsewhere
    } else {
      console.error(`Failed to find entity:`, error);
      throw new Error('Internal Server Error');
    }
  }
}

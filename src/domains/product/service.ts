import logger from '../../libraries/log/logger';

import Model, { IProduct } from './schema';
import { AppError } from '../../libraries/error-handling/AppError';

const model: string = 'product';

// Create function with type annotations
const create = async (data: IProduct): Promise<IProduct> => {
  try {
    const item = new Model(data);
    const saved = await item.save();
    logger.info(`create(): ${model} created`, {
      id: saved._id
    });
    return saved;
  } catch (error) {
    logger.error(`create(): Failed to create ${model}`, error);
    throw new AppError(`Failed to create ${model}`, (error as Error).message);
  }
};

// Define the type for the search query
interface SearchQuery {
  keyword?: string;
}

// Define the search function with type annotations
const search = async (query: SearchQuery): Promise<IProduct[]> => {
  try {
    const { keyword } = query ?? {};
    const filter: Record<string, unknown> = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const items = await Model.find(filter);
    logger.info('search(): filter and count', {
      filter,
      count: items.length
    });

    return items;
  } catch (error) {
    logger.error(`search(): Failed to search ${model}`, error);
    throw new AppError(
      `Failed to search ${model}`,
      (error as Error).message,
      400
    );
  }
};

// Define the getById function
const getById = async (id: string): Promise<IProduct | null> => {
  try {
    const item = await Model.findById(id);
    logger.info(`getById(): ${model} fetched`, { id });
    return item;
  } catch (error) {
    logger.error(`getById(): Failed to get ${model}`, error);
    throw new AppError(`Failed to get ${model}`, (error as Error).message);
  }
};

const updateById = async (
  id: string,
  data: Partial<IProduct>
): Promise<IProduct | null> => {
  try {
    const item = await Model.findByIdAndUpdate(id, data, { new: true });
    logger.info(`updateById(): ${model} updated`, { id });
    return item;
  } catch (error) {
    logger.error(`updateById(): Failed to update ${model}`, error);
    throw new AppError(`Failed to update ${model}`, (error as Error).message);
  }
};

const deleteById = async (id: string): Promise<boolean> => {
  try {
    await Model.findByIdAndDelete(id);
    logger.info(`deleteById(): ${model} deleted`, { id });
    return true;
  } catch (error) {
    logger.error(`deleteById(): Failed to delete ${model}`, error);
    throw new AppError(`Failed to delete ${model}`, (error as Error).message);
  }
};

export { create, search, getById, updateById, deleteById };

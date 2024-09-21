import logger from '../../libraries/log/logger';
import Student from './schema';
import { AppError } from '../../libraries/error-handling/AppError';

const model: string = 'Student';

interface IData {
  [key: string]: any;
}

const create = async (data: IData): Promise<any> => {
  try {
    const item = new Student(data);
    const saved = await item.save();
    logger.info(`create(): ${model} created`, {
      id: saved._id
    });
    return saved;
  } catch (error: any) {
    logger.error(`create(): Failed to create Student`, error);
    throw new AppError(`Failed to create Student`, error.message);
  }
};

interface SearchQuery {
  keyword?: string;
}

const search = async (query: SearchQuery): Promise<any[]> => {
  try {
    const { keyword } = query ?? {};
    const filter: any = {};
    if (keyword) {
      filter.or = [
        { name: { regex: keyword, options: 'i' } },
        { description: { regex: keyword, options: 'i' } }
      ];
    }
    const items = await Student.find(filter);
    logger.info('search(): filter and count', {
      filter,
      count: items.length
    });
    return items;
  } catch (error: any) {
    logger.error(`search(): Failed to search Student`, error);
    throw new AppError(`Failed to search Student`, error.message, 400);
  }
};

const getById = async (id: string): Promise<any> => {
  try {
    const item = await Student.findById(id);
    logger.info(`getById(): Student fetched`, { id });
    return item;
  } catch (error: any) {
    logger.error(`getById(): Failed to get Student`, error);
    throw new AppError(`Failed to get Student`, error.message);
  }
};

const updateById = async (id: string, data: IData): Promise<any> => {
  try {
    const item = await Student.findByIdAndUpdate(id, data, { new: true });
    logger.info(`updateById(): Student updated`, { id });
    return item;
  } catch (error: any) {
    logger.error(`updateById(): Failed to update Student`, error);
    throw new AppError(`Failed to update Student`, error.message);
  }
};

const deleteById = async (id: string): Promise<boolean> => {
  try {
    await Student.findByIdAndDelete(id);
    logger.info(`deleteById(): Student deleted`, { id });
    return true;
  } catch (error: any) {
    logger.error(`deleteById(): Failed to delete Student`, error);
    throw new AppError(`Failed to delete Student`, error.message);
  }
};

export { create, search, getById, updateById, deleteById };

import productRoutes from './product';
import { Router } from 'express';

const defineRoutes = async (expressRouter: Router): Promise<void> => {
  productRoutes(expressRouter);
};

export default defineRoutes;

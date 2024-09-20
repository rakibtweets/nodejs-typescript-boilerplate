import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import logger from '../libraries/log/logger';
import schema from './config.schema';

interface ConfigSchema {
  [key: string]: any; // Adjust the type definition according to your schema structure
}

class Config {
  private static instance: Config | null = null;
  public config: ConfigSchema;

  private constructor() {
    logger.info('Loading and validating config for the first time...');
    this.config = this.loadAndValidateConfig();
    Config.instance = this;
    logger.info('Config loaded and validated');
  }

  private loadAndValidateConfig(): ConfigSchema {
    const environment: string = process.env.NODE_ENV || 'development';

    // 1. Load environment file from one level up using __dirname
    const envFile: string = `.env.${environment}`;
    const envPath: string = path.join(__dirname, '..', envFile);
    if (!fs.existsSync(envPath)) {
      throw new Error(`Environment file not found: ${envPath}`);
    }
    dotenv.config({ path: envPath });

    // 2. Load config file based on environment
    const configFile: string = path.join(
      __dirname,
      `config.${environment}.json`
    );
    if (!fs.existsSync(configFile)) {
      throw new Error(`Config file not found: ${configFile}`);
    }

    let config: ConfigSchema = JSON.parse(fs.readFileSync(configFile, 'utf-8'));

    const sharedConfigFile: string = path.join(__dirname, 'config.shared.json');
    if (fs.existsSync(sharedConfigFile)) {
      const sharedConfig: ConfigSchema = JSON.parse(
        fs.readFileSync(sharedConfigFile, 'utf-8')
      );
      config = { ...sharedConfig, ...config };
    }

    const finalConfig: ConfigSchema = {};
    const schemaKeys = schema.describe().keys;

    for (const key in schemaKeys) {
      if (Object.prototype.hasOwnProperty.call(process.env, key)) {
        finalConfig[key] = process.env[key]; // Prioritize environment variables
      } else if (Object.prototype.hasOwnProperty.call(config, key)) {
        finalConfig[key] = config[key]; // Fallback to config file value
      }
    }

    // 4. Load the schema file
    if (!schema) {
      throw new Error('Schema file not found');
    }

    const { error, value: validatedConfig } = schema.validate(finalConfig);
    if (error) {
      const missingProperties = error.details.map(
        (detail: any) => detail.path[0]
      );
      throw new Error(
        `Config validation error: missing properties ${missingProperties}`
      );
    }

    return validatedConfig;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export default Config.getInstance().config;

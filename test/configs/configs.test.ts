import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Config from '../../src/configs'; // Adjust the import path as needed
import schema from '../../src/configs/config.schema'; // Mock schema
import logger from '../../src/libraries/log/logger';

jest.mock('fs');
jest.mock('path');
jest.mock('dotenv');
jest.mock('../../src/libraries/log/logger');
jest.mock('../../src/configs/config.schema');

describe('Config class', () => {
  const mockEnvironment = 'test';
  const mockEnvFile = `.env.${mockEnvironment}`;
  const mockEnvPath = path.join(__dirname, '..', mockEnvFile);
  const mockConfigFile = path.join(__dirname, `config.${mockEnvironment}.json`);
  const mockSharedConfigFile = path.join(__dirname, 'config.shared.json');

  const mockConfig = {
    key1: 'value1',
    key2: 'value2'
  };

  const mockSharedConfig = {
    sharedKey: 'sharedValue'
  };

  const mockFinalConfig = {
    key1: 'value1',
    key2: 'value2',
    sharedKey: 'sharedValue'
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should load and validate the config successfully', () => {
    // Mock environment variable
    process.env.NODE_ENV = mockEnvironment;

    // Mock file existence checks
    (fs.existsSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === mockEnvPath || filePath === mockConfigFile) {
        return true;
      }
      if (filePath === mockSharedConfigFile) {
        return true;
      }
      return false;
    });

    // Mock file reads
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath === mockConfigFile) {
        return JSON.stringify(mockConfig);
      }
      if (filePath === mockSharedConfigFile) {
        return JSON.stringify(mockSharedConfig);
      }
      return '';
    });

    // Mock dotenv config
    (dotenv.config as jest.Mock).mockImplementation(() => ({
      parsed: { ENV_KEY: 'envValue' }
    }));

    // Mock schema validation
    (schema.validate as jest.Mock).mockReturnValue({
      error: null,
      value: mockFinalConfig
    });

    // Call the Config class (it will trigger the constructor automatically)
    const configInstance = Config.getInstance().config;

    // Verify the config was loaded and validated
    expect(fs.existsSync).toHaveBeenCalledWith(mockEnvPath);
    expect(fs.existsSync).toHaveBeenCalledWith(mockConfigFile);
    expect(fs.existsSync).toHaveBeenCalledWith(mockSharedConfigFile);

    expect(fs.readFileSync).toHaveBeenCalledWith(mockConfigFile, 'utf-8');
    expect(fs.readFileSync).toHaveBeenCalledWith(mockSharedConfigFile, 'utf-8');

    expect(dotenv.config).toHaveBeenCalledWith({ path: mockEnvPath });

    expect(schema.validate).toHaveBeenCalledWith(
      expect.objectContaining(mockFinalConfig)
    );

    expect(logger.info).toHaveBeenCalledWith(
      'Loading and validating config for the first time...'
    );
    expect(configInstance).toEqual(mockFinalConfig);
  });

  it('should throw an error if the environment file is missing', () => {
    process.env.NODE_ENV = mockEnvironment;

    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

    expect(() => {
      Config.getInstance();
    }).toThrow(`Environment file not found: ${mockEnvPath}`);
  });

  it('should throw an error if the config file is missing', () => {
    process.env.NODE_ENV = mockEnvironment;

    (fs.existsSync as jest.Mock)
      .mockReturnValueOnce(true) // Mock environment file exists
      .mockReturnValueOnce(false); // Mock config file doesn't exist

    expect(() => {
      Config.getInstance();
    }).toThrow(`Config file not found: ${mockConfigFile}`);
  });

  it('should throw an error if config validation fails', () => {
    process.env.NODE_ENV = mockEnvironment;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockConfig));
    (dotenv.config as jest.Mock).mockImplementation(() => ({}));

    const mockValidationError = {
      details: [{ path: ['key1'] }]
    };

    (schema.validate as jest.Mock).mockReturnValue({
      error: mockValidationError,
      value: null
    });

    expect(() => {
      Config.getInstance();
    }).toThrow('Config validation error: missing properties key1');
  });
});

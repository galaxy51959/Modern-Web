import path from 'path';
import { initSnapshotSerializer } from '@scripts/jest-config/utils';
import createPlugin, { setJestConfigForBFF } from '../../src/cli/bff';

initSnapshotSerializer({ cwd: path.resolve(__dirname, '../..') });

describe('testing-plugin-bff', () => {
  const appDir = path.normalize(path.resolve(__dirname, './fixtures/bff1'));
  const mockUtils: any = {
    _jestConfig: {},
    get jestConfig() {
      return this._jestConfig;
    },
    setJestConfig(config: any, options: { force?: boolean } = {}) {
      if (options.force) {
        this._jestConfig = config;
      }
      this._jestConfig = Object.assign(this._jestConfig, config);
    },
  };

  test('plugin', async () => {
    expect(createPlugin).toBeDefined();
    expect(createPlugin).toBeInstanceOf(Function);
  });

  test('setJestConfigForBFF', async () => {
    await setJestConfigForBFF({
      pwd: appDir,
      userConfig: {},
      plugins: [],
      routes: [],
      utils: mockUtils,
    });

    expect(mockUtils.jestConfig).toMatchSnapshot();
  });

  test('testTimeout should not set in projects', async () => {
    mockUtils.setJestConfig({
      testTimeout: 1000,
    });
    await setJestConfigForBFF({
      pwd: appDir,
      userConfig: {},
      plugins: [],
      routes: [],
      utils: mockUtils,
    });

    expect(mockUtils.jestConfig).toMatchSnapshot();
  });
});

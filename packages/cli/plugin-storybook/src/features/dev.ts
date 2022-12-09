import { Import, getPort } from '@modern-js/utils';
import type { PluginAPI, ModuleTools } from '@modern-js/module-tools-v2';
import { valid } from './utils/valid';

const storybook: typeof import('@storybook/react/standalone') = Import.lazy(
  '@storybook/react/standalone',
  require,
);
const constants: typeof import('./constants') = Import.lazy(
  './constants',
  require,
);
const gen: typeof import('./utils/genConfigDir') = Import.lazy(
  './utils/genConfigDir',
  require,
);
const webpackConfig: typeof import('./utils/webpackConfig') = Import.lazy(
  './utils/webpackConfig',
  require,
);

export interface IRunDevOption {
  isTsProject?: boolean;
  stories: string[];
  isModuleTools?: boolean;
}

export const runDev = async (
  api: PluginAPI<ModuleTools>,
  { isTsProject = false, stories, isModuleTools = false }: IRunDevOption,
) => {
  const appContext = api.useAppContext();
  const modernConfig = api.useResolvedConfigContext();
  const { appDirectory, port } = appContext;

  if (!valid({ stories, isModuleTools, isTs: isTsProject })) {
    return;
  }

  const configDir = await gen.generateConfig(appDirectory, {
    isTsProject,
    stories,
    // TODO: 运行runtime相关功能的时候再处理
    modernConfig,
  });

  const handleWebpack = await webpackConfig.getCustomWebpackConfigHandle({
    appContext,
    configDir,
    modernConfig,
  });

  // NB: must set NODE_ENV
  process.env.NODE_ENV = 'development';

  storybook({
    ci: true,
    mode: 'dev',
    port: await getPort(port || constants.STORYBOOK_PORT),
    configDir,
    customFinalWebpack: handleWebpack,
  });
};

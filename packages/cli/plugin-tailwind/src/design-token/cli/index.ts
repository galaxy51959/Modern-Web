import { lazyImport, createRuntimeExportsUtils } from '@modern-js/utils';
import type { CliPlugin, LegacyAppTools } from '@modern-js/app-tools';
import { DesignSystem } from '../../types';

export const designTokenPlugin = (
  { pluginName } = { pluginName: '@modern-js/plugin-tailwindcss' },
): CliPlugin<LegacyAppTools> => ({
  name: '@modern-js/plugin-design-token',

  setup(api) {
    let pluginsExportsUtils: any;
    const resolveConfig = lazyImport('tailwindcss/resolveConfig', require);

    const PLUGIN_IDENTIFIER = 'designToken';

    const getDesignTokens = (designSystem?: DesignSystem) => {
      const tailwindcssConfig: Record<string, any> = {};

      tailwindcssConfig.theme = designSystem ? { ...designSystem } : {};

      // not use default design token when designToken.defaultTheme is false or theme is false
      if (!designSystem) {
        tailwindcssConfig.presets = [];
      }

      // when only designSystem exist, need remove supportStyledComponents
      if (designSystem) {
        delete tailwindcssConfig.theme.supportStyledComponents;
      }
      return resolveConfig(tailwindcssConfig).theme || {};
    };

    return {
      config() {
        const appContext = api.useAppContext();

        pluginsExportsUtils = createRuntimeExportsUtils(
          appContext.internalDirectory,
          'plugins',
        );

        return {
          source: {
            alias: {
              '@modern-js/runtime/plugins': pluginsExportsUtils.getPath(),
            },
          },
        };
      },

      modifyEntryImports({ entrypoint, imports }: any) {
        const userConfig = api.useResolvedConfigContext();
        const designSystem = userConfig.source?.designSystem ?? {};

        if (
          typeof designSystem === 'object' &&
          designSystem.supportStyledComponents
        ) {
          const designTokens = getDesignTokens(userConfig.source.designSystem);
          imports.push({
            value: '@modern-js/runtime/plugins',
            specifiers: [
              {
                imported: PLUGIN_IDENTIFIER,
              },
            ],
            initialize: `
  const designTokens = ${JSON.stringify(designTokens)};
            `,
          });
        }

        return {
          entrypoint,
          imports,
        };
      },

      modifyEntryRuntimePlugins({ entrypoint, plugins }: any) {
        const userConfig = api.useResolvedConfigContext();
        const designSystem = userConfig.source?.designSystem ?? {};
        let useSCThemeProvider = true;
        if (designSystem) {
          // when designSystem exist, designToken.styledComponents`s default value is false.
          useSCThemeProvider = designSystem?.supportStyledComponents || false;
        }

        if (
          typeof designSystem === 'object' &&
          designSystem.supportStyledComponents
        ) {
          plugins.push({
            name: PLUGIN_IDENTIFIER,
            options: `{token: designTokens, useStyledComponentsThemeProvider: ${
              useSCThemeProvider ? 'true' : 'false'
            }, useDesignTokenContext: false}`,
          });
        }
        return {
          entrypoint,
          plugins,
        };
      },

      addRuntimeExports() {
        pluginsExportsUtils.addExport(
          `export { default as designToken } from '${pluginName}/runtime-design-token'`,
        );
      },
    };
  },
});

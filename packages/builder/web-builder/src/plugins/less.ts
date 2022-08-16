import { LESS_REGEX } from '../shared';
import { BuilderPlugin, LessLoaderOptions } from '../types';

export function PluginLess(): BuilderPlugin {
  return {
    name: 'web-builder-plugin-less',
    setup(api) {
      api.modifyWebpackChain(async (chain, utils) => {
        const config = api.getBuilderConfig();
        const { applyOptionsChain } = await import('@modern-js/utils');
        const { applyBaseCSSRule } = await import('./css');
        const getLessLoaderOptions = () => {
          const excludes: RegExp[] = [];

          const addExcludes = (items: RegExp | RegExp[]) => {
            if (Array.isArray(items)) {
              excludes.push(...items);
            } else {
              excludes.push(items);
            }
          };

          const mergedOptions = applyOptionsChain<
            LessLoaderOptions,
            { addExcludes: (excludes: RegExp | RegExp[]) => void }
          >(
            {
              lessOptions: { javascriptEnabled: true },
              sourceMap: false,
            },
            config.tools?.less || {},
            { addExcludes },
          );

          return {
            options: mergedOptions,
            excludes,
          };
        };
        const { options, excludes } = getLessLoaderOptions();
        const rule = chain.module
          .rule(utils.CHAIN_ID.RULE.LESS)
          .test(LESS_REGEX)
          .exclude.add(excludes)
          .end();
        await applyBaseCSSRule(rule, config, api.context, utils);
        rule
          .use(utils.CHAIN_ID.USE.LESS)
          .loader(require.resolve('less-loader'))
          .options(options);
      });
    },
  };
}

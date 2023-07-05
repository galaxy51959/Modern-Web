import path from 'path';
import type { DocPlugin } from '@modern-js/doc-core';
import type {
  PluginOptions,
  SupportLanguages,
  ExtendedPageData,
} from './types';
import { docgen } from './docgen';
import { apiDocMap } from './constants';

/**
 * The plugin is used to generate api doc for files..
 */
export function pluginApiDocgen(options?: PluginOptions): DocPlugin {
  const {
    entries = {},
    apiParseTool = 'react-docgen-typescript',
    appDir = process.cwd(),
  } = options || {};
  return {
    name: '@modern-js/doc-plugin-api-docgen',
    async beforeBuild(config) {
      // only support zh and en
      const languages = (
        config.themeConfig?.locales?.map(locale => locale.lang) ||
        config.locales?.map(locale => locale.lang) ||
        []
      ).filter(lang => lang === 'zh' || lang === 'en') as SupportLanguages[];
      // Problem: the document will be generated but we cannot search it.
      // Because we can not decide the route of the module doc, while the user decide where the module doc is located.In other words, we can not take the search index of the module doc in the lack of route path.
      await docgen({
        entries,
        apiParseTool,
        languages,
        appDir,
      });
    },
    extendPageData(pageData) {
      (pageData as ExtendedPageData).apiDocMap = { ...apiDocMap };
    },
    markdown: {
      globalComponents: [
        path.join(__dirname, '..', 'static', 'global-components', 'API.tsx'),
      ],
    },
  };
}

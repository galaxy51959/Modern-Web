import path from 'path';
import { downloadPackage, getPackageInfo } from '@modern-js/codesmith';
import { requireModule } from './module';

export { getPackageMeta } from './getPackageMeta';

export async function installPlugins(plugins: string[], registryUrl?: string) {
  return Promise.all(
    plugins.map(async plugin => {
      if (plugin.startsWith('file:')) {
        const pluginPath = path.join(process.cwd(), plugin.slice(5));
        return {
          templatePath: pluginPath,
          module: requireModule(pluginPath),
        };
      }
      if (path.isAbsolute(plugin)) {
        return {
          templatePath: plugin,
          module: requireModule(plugin),
        };
      }
      const { name, version } = getPackageInfo(plugin);
      const pluginPath = await downloadPackage(name, version, {
        registryUrl,
        install: true,
      });
      return {
        templatePath: pluginPath,
        module: requireModule(pluginPath),
      };
    }),
  );
}

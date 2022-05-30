/* -----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/
/**
 * @packageDocumentation
 * @module hub-extension
 */

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { ITranslator } from '@jupyterlab/translation';

/**
 * The command IDs used by the plugin.
 */
export namespace CommandIDs {
  export const controlPanel: string = 'hub:control-panel';

  export const logout: string = 'hub:logout';

  export const restart: string = 'hub:restart';
}

/**
 * Activate the jupyterhub extension.
 */
function activateHubExtension(
  app: JupyterFrontEnd,
  paths: JupyterFrontEnd.IPaths,
  translator: ITranslator,
  palette: ICommandPalette | null
): void {
  const trans = translator.load('jupyterlab');
  const hubHost = paths.urls.hubHost || '';
  const hubPrefix = paths.urls.hubPrefix || '';
  const hubUser = paths.urls.hubUser || '';
  const hubServerName = paths.urls.hubServerName || '';
  const baseUrl = paths.urls.base;

  // Bail if not running on JupyterHub.
  if (!hubPrefix) {
    return;
  }

  console.debug('hub-extension: Found configuration ', {
    hubHost: hubHost,
    hubPrefix: hubPrefix
  });

  // If hubServerName is set, use JupyterHub 1.0 URL.
  const restartUrl = hubServerName
    ? hubHost + URLExt.join(hubPrefix, 'spawn', hubUser, hubServerName)
    : hubHost + URLExt.join(hubPrefix, 'spawn');

  const { commands } = app;

  commands.addCommand(CommandIDs.restart, {
    label: trans.__('Restart Server'),
    caption: trans.__('Request that the Hub restart this server'),
    execute: () => {
      window.open(restartUrl, '_blank');
    }
  });

  commands.addCommand(CommandIDs.controlPanel, {
    label: trans.__('Hub Control Panel'),
    caption: trans.__('Open the Hub control panel in a new browser tab'),
    execute: () => {
      window.open(hubHost + URLExt.join(hubPrefix, 'home'), '_blank');
    }
  });

  commands.addCommand(CommandIDs.logout, {
    label: trans.__('Log Out'),
    caption: trans.__('Log out of the Hub'),
    execute: () => {
      window.location.href = hubHost + URLExt.join(baseUrl, 'logout');
    }
  });

  // Add palette items.
  if (palette) {
    const category = trans.__('Hub');
    palette.addItem({ category, command: CommandIDs.controlPanel });
    palette.addItem({ category, command: CommandIDs.logout });
  }
}

/**
 * Initialization data for the hub-extension.
 */
const hubExtension: JupyterFrontEndPlugin<void> = {
  activate: activateHubExtension,
  id: 'jupyter.extensions.hub-extension',
  requires: [JupyterFrontEnd.IPaths, ITranslator],
  optional: [ICommandPalette],
  autoStart: true
};

/**
 * Plugin to load menu description based on settings file
 */
const hubExtensionMenu: JupyterFrontEndPlugin<void> = {
  activate: () => void 0,
  id: 'jupyter.extensions.hub-extension:plugin',
  autoStart: true
};


export default [
  hubExtension,
  hubExtensionMenu,
] as JupyterFrontEndPlugin<any>[];

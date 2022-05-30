// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ServerConnection, ServiceManager } from '@jupyterlab/services';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import { IConnectionLost } from './tokens';

/**
 * A default connection lost handler, which brings up an error dialog.
 */
export const ConnectionLost: IConnectionLost = async function (
  manager: ServiceManager.IManager,
  err: ServerConnection.NetworkError,
  translator?: ITranslator
): Promise<void> {
  return new Promise((res, rej) => {
    /* do nothing */
  });
};

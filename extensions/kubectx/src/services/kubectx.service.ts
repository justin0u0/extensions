import { execFile } from "child_process";
import util from "util";

import { commandOutputToArray } from "../lib/cli.parser";
import { getBrewExecutablePath, getKubeConfig } from "../lib/cli";

const execFilePromise = util.promisify(execFile);

const kubectx = getBrewExecutablePath("kubectx");
const kubectl = getBrewExecutablePath("kubectl");

const kubeConfig = getKubeConfig();

if (kubeConfig) {
  process.env.KUBECONFIG = kubeConfig;
}

export const getCurrentContext = async () => {
  const { stdout } = await execFilePromise(`${kubectx}`, ["-c"], {
    env: {
      ...process.env,
      KUBECTL: kubectl,
    }
  });

  const currentContext = commandOutputToArray(stdout)[0];

  return currentContext;
};

export const getAllContextes = async () => {
  const { stdout } = await execFilePromise(`${kubectx}`, [], {
    env: {
      ...process.env,
      KUBECTL: kubectl,
    }
  });

  const contextes = commandOutputToArray(stdout);

  return contextes;
};

export const switchContext = async (newContextName: string) => {
  await execFilePromise(`${kubectx}`, [newContextName], {
    env: {
      ...process.env,
      KUBECTL: kubectl,
    }
  });
};

export default {
  getAllContextes,
  getCurrentContext,
  switchContext,
};

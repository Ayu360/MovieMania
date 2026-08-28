const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = '$RNFirebaseDisableSPM = true';

module.exports = function withDisableRNFirebaseSPM(config) {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf8');
      if (!contents.includes(MARKER)) {
        contents = `${MARKER}\n${contents}`;
        fs.writeFileSync(podfilePath, contents);
      }
      return cfg;
    },
  ]);
};

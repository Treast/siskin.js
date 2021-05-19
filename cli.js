#!/usr/bin/env node

const process = require('process');
const fs = require('fs');
const path = require('path');

const CWD = process.cwd();
const CONFIG_FILENAME = 'siskin.config.js';
const CONFIG_PATH = path.join(CWD, CONFIG_FILENAME);

const [, , templateName, ...variables] = process.argv;
let transformations = [];

const readConfigFile = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(CONFIG_PATH)) reject(`No ${CONFIG_FILENAME} file found in current working directory`);

    const config = require(CONFIG_PATH);
    resolve(config);
  });
};

const execConfigFile = (data) => {
  return new Promise((resolve, reject) => {
    const template = data.templates.find((t) => t.name === templateName);
    transformations = template.transformations;

    if (!template) reject(`No template ${templateName} found.`);

    const promises = [];

    template.files.forEach((file) => {
      const promise = new Promise((innerResolve) => {
        const fromFile = path.join(CWD, file.from);
        const fileName = path.basename(fromFile);
        const fileNameReplaced = replaceVariables(fileName);

        const toFilePath = path.join(CWD, file.to);
        const toFile = path.join(toFilePath, fileNameReplaced);

        fs.mkdirSync(toFilePath, { recursive: true });

        fs.copyFileSync(fromFile, toFile);

        fs.readFile(toFile, (err, data) => {
          if (err) reject(err.message);

          const newFileContent = replaceVariables(data);

          fs.writeFile(toFile, newFileContent, () => {
            innerResolve();
          });
        });
      });

      promises.push(promise);
    });

    Promise.all(promises).then(() => resolve());
  });
};

const replaceVariables = (string) => {
  let s = String(string);

  const localTransformations = transformations;

  variables.forEach((variable, index) => {
    let v = variable;

    if (localTransformations[index + 1]) {
      v = localTransformations[index + 1](variables);
      localTransformations.splice(index + 1, 1);
    }

    s = s.replace(new RegExp(`\\$__${index + 1}__\\$`, 'gm'), v);
  });

  Object.entries(localTransformations).forEach(([key, transformation]) => {
    s = s.replace(new RegExp(`\\$__${key}__\\$`, 'gm'), transformation(variables));
  });

  return s;
};

const checkArgs = () => {
  return new Promise((resolve, reject) => {
    if (!templateName) reject('Please provide a template name.');

    resolve();
  });
};

const run = () => {
  checkArgs()
    .then(() => readConfigFile())
    .then((config) => execConfigFile(config))
    .then(() => console.log('Templating finished !'))
    .catch((err) => {
      console.log(err);
      process.stderr.write(err.toString());
      return 0;
    });
};

run();

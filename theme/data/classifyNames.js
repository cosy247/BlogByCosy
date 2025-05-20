import config from '../../config';

const multipleClassifyNames = config.menus
  .filter((m) => m.type === 'classify' && m.classify.multiple)
  .map((m) => m.classify.name);

const singleClassifyNames = config.menus.filter((m) => m.type === 'classify' && !m.classify.multiple).map((m) => m.classify.name);

const classifyNames = multipleClassifyNames.concat(singleClassifyNames);

export { multipleClassifyNames, singleClassifyNames, classifyNames };

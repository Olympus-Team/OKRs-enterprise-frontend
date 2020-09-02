module.exports = {
  '*.{ts,js}': ['yarn lint:files', 'yarn lint:eslint', 'yarn lint:prettier'],
  '*.vue': ['yarn lint:files', 'yarn lint:eslint', 'yarn lint:prettier'],
  '*.{css,scss}': ['yarn lint:prettier'],
};

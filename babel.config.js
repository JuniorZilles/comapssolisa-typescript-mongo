module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@controllers': './src/api/controllers',
          '@models': './src/api/models',
          '@repositories': './src/api/repositories',
          '@services': './src/api/services',
          '@errors': './src/api/errors',
          '@validations': './src/api/validations',
          '@middlewares': './src/api/middlewares',
          '@interfaces': './src/api/interfaces'
        }
      }
    ]
  ],
  ignore: ['**/*.spec.ts']
}

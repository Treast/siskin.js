module.exports = {
  templates: [
    {
      name: 'example', // Name of the template used on command-line (siskin example ...)
      files: [
        {
          from: './.siskin/foo.js',
          to: './src/',
        },
        {
          from: './.siskin/$__0__$.js',
          to: './src/',
        },
      ],
      transformations: {
        0: (args) => {
          return args[0][0].toUpperCase() + args[0].substring(1); // Capitalize first argument
        },
      },
    },
  ],
};

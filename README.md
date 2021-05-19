# siskin.js

`siskin.js` is a **simple & lightweight template generator** with zero dependency. With **one command-line**, you can create **multiple new files** based on a custom template.

## Installation

`npm install siskin.js --save-dev`

## How to use (example)

- Create a `siskin.config.js` at the root of your project. Basic configuration should look like this :

```javascript
module.exports = {
  templates: [
    {
      name: 'example', // Name of the template used on command-line (siskin example ...)
      files: [
        {
          from: './.siskin/foo.js',
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
```

- Create your template file (here `./siskin/foo.js`)

```javascript
console.log('Hello $__0__$');
```

- Run the command-line

`siskin example World`

Here, our `$__0__$` will be replaced by our first argument, in this cas `World`. You can have any number of arguments & placeholders, you just have to increment the number (`$__1__$`, `$__2__$` and so on...).

When the command is done, a new file is created (`./src/foo.js`), with the content :
`console.log('Hello World');`

## Transformations

You can pipe transformations before variable assignment. In your `siskin.config.js` file, add a `transformations` object to your template. Using the **argument number as key**, you can define a function that will return a string. This function receive an array with all arguments.

If you want to reuse another argument without alter it, you can use whatever number as key.

## Dynamic filenames

You can use placeholder in filename, such as `$__0__$.js`, if you want dynamic filenames.

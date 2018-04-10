# Sky fighters game

Based on my son, Harrison’s “Book of Skyfighters”.  An imaginary world which includes the “Manjerlies” whom live inside us all. Little egg shaped people who help build and repair our bodies.


## Usage

You need [Node.js and npm](https://nodejs.org/). You should also have git installed, but it's not mandatory.

Install dependencies

`yarn install`

Run a development build...

`yarn start`

...or a production build.

`yarn production`

Development builds will copy `phaser.min.js` together with `phaser.map` and `phaser.js`
Your ES6 code will be transpiled into ES5 and concatenated into a single file.
A sourcemap for your code will also be included (by default `game.map.js`).

Production builds will only copy `phaser.min.js`. Your ES6 code will be transpiled and
minified using UglifyJS.

Any modification to the files inside the `./src` and `./static` folder will trigger a full page reload.

If you modify the contents of other files, please manually restart the server.

## License

This project is released under the MIT License.

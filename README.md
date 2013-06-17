# generator-fe

A generator for [yeoman](https://github.com/yeoman/yo) to kickstart web projects frontend using bootstrap, foundation, sass and assemble.

During the installation you will be given a choice to kickstart a foundation, LESS based bootstrap or SASS based bootstrap project.

## Getting started

- Make sure you have installed [yo](https://github.com/yeoman/yo): `npm install -g yo` and [grunt](http://gruntjs.com/): `npm install -g grunt-cli`.
- If you plan to use Foundation or Bootstrap SASS, you will need [SASS](http://sass-lang.com/): `gem install sass`.
- Install the generator: `npm install -g generator-fe`
- Run: `yo fe`
- Run: `grunt server`

You will need to use `sudo` on Mac for all `npm -g` and `gem` commands.

If you're getting an error that the port 35729 is taken, you probably have Live Reload App running. You can [choose a different port](https://github.com/doctyper/grunt-contrib-watch/#live-reloading) for the current instance of the grunt livereload server, or for your Live Reload App,.

## TODO

* jshint
* images
* sprites generation (maybe)
* html validation

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)


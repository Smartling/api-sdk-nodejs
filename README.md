[Smartling Translation API](http://docs.smartling.com)
=================

This repository contains the Nodejs SDK for accessing the Smartling Translation API.

The Smartling Translation API lets developers to internationalize their website or app by automating the translation and integration of their site content.
Developers can upload resource files and download the translated files in a language of their choosing. There are options to allow for professional translation, community translation and machine translation.

For a full description of the Smartling Translation API, please read the docs at: http://docs.smartling.com

Engines support
---------------
* `1.x.x` - node < 18
* `2.x.x` - node >= 18

Publishing to NPM
-----------------

1. Make your changes.
2. Put `*.*.*` semver tag.
3. Tag triggers `.github/workflows/publish.yml` github action which pushes this package to NPM.

NPM integration setup
---------------------

1. In [package](https://www.npmjs.com/package/smartling-api-sdk-nodejs) settings at npmjs.com we set up `Trusted Pubkished` integration with github repo.
2. In repo we have `.github/workflows/publish.yml` github action for publishing.

Bug tracker
-----------

Have a bug? Please create an issue here on GitHub!

https://github.com/Smartling/api-sdk-nodejs/issues

Hacking
-------

To get source code, clone the repo:

`git clone git@github.com:Smartling/api-sdk-nodejs.git`

Then compile the javascript:

`npm install && npm run build`

To contribute, fork it and follow [general GitHub guidelines](http://help.github.com/fork-a-repo/) with pull request.

## Dead Simple Countdown Widget

**Dead Simple Countdown Widget** Is an easy to use, extendable, WordPress 
plugin that adds a countdown timer widget to your site. The widget 
currently comes with two simple color schemes (themes) built in as well 
as support for adding your own via action and filter hooks.

### Features:
* Two built in color schemes (themes) configurable per widget
  * Black & White
  * Blue & White
* Optionally apply no color scheme
* Custom titles and expiration text
* Numbers animate from zero to remaining time on load
* Mobile friendly
* Action and Filter hooks for adding additional themes and styles
* WordPress Coding Standards compliant

### Installation:
#### Manual
_Note: Manual installation requires node to build asset files. Node version 
8.9 is used for development, however older versions may work._

1. Clone this repository locally: `git clone https://github.com/DaveLak/dead-simple-countdown-widget.git`
1. Enter the project directory: `cd dead-simple-countdown-widget/`
1. Install the dev-dependecies with yarn or npm: `yarn install` or `npm install`
1. Build and bundle production ready files: `yarn run package` or `npm run-script package`

When step four completes the ready-to-use plugin files can be found in 
`release/dead-simple-countdown-widget/` or in the `release/dead-simple-countdown-widget.zip` 
file. You can either upload the zip file from the wp-admin by navigating to Plugins -> Add New -> Upload or upload the `release/dead-simple-countdown-widget/` directory to you're website's `wp-content/plugins` folder with SFTP (or FTP).


### Future development:
Additional features will be added to this plugin as time permits. 
A non-exhaustive list of features being considered includes:
* Gutenberg integration
* Additional themes
* Ability to add select custom styles with a color-picker
* Exposed JavaScript API
* Additional Actions & Filters
* Count-up

Have something you'd like to see added? [Open an issues](https://github.com/DaveLak/dead-simple-countdown-widget/issues/new)!


## Dead Simple Countdown Widget

**Dead Simple Countdown Widget** Is an easy to use, extendable, WordPress 
plugin that adds a countdown timer widget to your site. The widget 
currently comes with two simple color schemes (themes) built in as well 
as support for adding your own via action and filter hooks.

### Features:
* Two built in color schemes (themes) configurable per widget
  * Black & White
  * Blue & White
* Optionally apply no color scheme at all
* Custom titles and expiration text
* Numbers animate from zero to remaining time on load
* Mobile friendly
* Action and Filter hooks for adding additional themes and styles
* WordPress Coding Standards compliant

### Screenshots:

![Dead Simple Countdown - Black and White](.github/Dead-Simple-Countdown-Black-and-White.png "Black & White")

![Dead Simple Countdown - Black and White Expired](.github/Dead-Simple-Countdown-Black-and-White-Expired.png "Black & White Expired")

![Dead Simple Countdown - Blue and White](.github/Dead-Simple-Countdown-Blue-and-White.png "Blue & White")

![Dead Simple Countdown - Blue and White Expired](.github/Dead-Simple-Countdown-Blue-and-White-Expired.png "Blue & White Expired")

![Dead Simple Countdown - No Theme](.github/Dead-Simple-Countdown-No-Style.png "No Style")

![Dead Simple Countdown - No Style Expired](.github/Dead-Simple-Countdown-No-Style-Expired.png "No Style Expired")

### Installation:

This plugin is currently only available from this repo. Only manual installation
is possible at this time. Publishing to Wordpress.org is planed for the near 
future however so check back if you require installation from the wp-admin.

##### Manual

First Download `dead-simple-countdown-widget.zip` from the [Releases page](https://github.com/DaveLak/dead-simple-countdown-widget/releases)

This file contains the ready-to-use plugin code. From here you can either:
 
* Unzip and upload it directly to your sites `/wp-content/plugins/' directory with FTP or SFTP.

or

* Navigate to your wp-admin dashboard, select "Plugins" -> "Add New" from the menu
and upload the zip file as is.

##### Manual From Source
>_Note: Installation from source requires Node.js to build asset files. Node version 
8.9 is used for development and is recomended, however older versions may work._

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


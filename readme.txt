=== BooKey Table ===
Contributors: bookeyltd, andreyk
Tags: hourly, booking, notifications
Requires PHP: 7.4
Requires at least: 6.6
Tested up to: 6.7
Version: 0.2.0
Stable tag: 0.2.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Provides hourly based booking table on your website.

== Description ==

BooKey Table provides hourly based booking table on your WordPress website.

It also provides e-mail/Viber/Telegram booking status notification system for website owner.

Features include:

* Flexible and easy for use hourly booking grid
* Week/two weeks/month booking table
* Booking request status updates notifications via e-mail/Viber/Telegram
* Detailed booking history on [BooKey](https://bookey.ltd/) website

Official [BooKey](https://bookey.ltd/) WordPress plugin by BooKey team.
For more information please visit our [plugin page](https://bookey.ltd/plugin).
For getting plugin code, please visit [GitHub](https://github.com/BooKey-com-ua/bookey-grid).

== Installation ==

1. Install the plugin either via the WordPress plugin directory, or by uploading the files to your web server (in the /wp-content/plugins/ directory).
1. Activate the plugin through the 'Plugins' menu in WordPress.
1. Navigate to the 'BooKey' settings page to configure your BooKey Table.
1. Add 'BooKey Table' block from tools list or [bookey_grid] shortcode into your page.

More information on using the plugin is [available here](https://bookey.ltd/plugin).

= Setting up the plugin =

If you have an issue or question please submit a support ticket and we'll get back to you as soon as we can.

1. Create your account on [BooKey](https://bookey.ltd/) website and navigate to [plugin settings](https://bookey.ltd/plugin) page.

1. Set your website address at 'Website address' and change working time of your service if needed. After pressing the 'Create' button system will provide you with 'Plugin key'.

1. Go to 'Tariff' tab and activate preferable tariff. Both of them have free trial periods.

1. Navigate to your website admin panel. Once you've installed the "BooKey Table" plugin click on the "BooKey" item in your WordPress menu.

1. Set your 'Plugin Key' from BooKey website [plugin settings](https://bookey.ltd/plugin) page in corresponding field, save changes and reload the page.

1. With use of 'Language' option you can set the table language. It does not depends on website language and will stay same according to language you selected here.

1. With use of 'Show calendar' option you can show or hide calendar and extra information on page.

== Important notes ==

Plugin is checking the current subscription status by sending request to [BooKey](https://bookey.ltd/) website once per 24 hour. 
In case if tariff is expired, the booking option will stop working for visitor and website admins.
When the new tariff is selected on the [plugin settings](https://bookey.ltd/plugin) page, it will be automatically implemented on your website
in next 24 hours or by immediate settings update after pressing 'Save Settings' on BooKey plugin page in admin console of your website.
[BooKey Privacy Policy](https://bookey.ltd/en/docs/privacy)

== Source code ==

The plugin `build` folder contains only files built with npm. To get source code please visit plugin [GitHub](https://github.com/BooKey-com-ua/bookey-grid) page.

The project folders structure includes:
* `build` folder contains compiled files;
* `includes` folder contains WordPress actions and filters file;
* `languages` folder contains plugin multilingual support files;
* `src` folder contains TypeScrypt source code.

To reproduce the `build` folder of the plugin please use the following commands:
  `
  git clone https://github.com/BooKey-com-ua/bookey-grid.git
  cd bookey-grid
  npm install
  npm run build
  `

== Frequently Asked Questions ==

Please contact us via email/Viber/Telegram/Facebook. You can find our contacts on our [BooKey](https://bookey.ltd/) website.

== Screenshots ==
1. BooKey table on a website page with BooKey Gutenberg block or shortcode.

== Changelog ==

= 0.2.0 =
* Rework

= 0.1.0 =
* First release

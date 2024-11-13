# BooKey Table plugin

A plugin that provides hourly based booking table on your WordPress website.

## Compatibility with WordPress versions

**The current version of the plugin (on the `master` branch) works only with WordPress versions higher than 6.6**.

For a lower version please try it on your own **risk**.

## Compilation

```
git clone https://github.com/BooKey-com-ua/bookey-grid.git
cd bookey-grid
npm install
npm run build
```

## Features

* Flexible and easy for use hourly booking grid
* Week/two weeks/month booking table
* Booking request status updates notifications via E-mail/Viber/Telegram
* Detailed booking history on [BooKey](https://bookey.ltd/) website

## Screenshot

![screenshot](https://bookey.ltd/landing/02_desk_light_en.webp "Screenshot showing BooKey grid table.")

## Installation in WordPress admin console

1. Install the plugin either via the WordPress plugin directory, or by uploading the files to your web server (in the `/wp-content/plugins/` directory).
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Navigate to the 'BooKey' settings page to configure your BooKey Table.
4. Add 'BooKey Table' block from tools list or [bookey_grid] shortcode into your page.

### Setting up the plugin

1. Create your account on [BooKey](https://bookey.ltd/) website and navigate to [plugin settings](https://bookey.ltd/plugin) page.
2. Set your website address at 'Website address' and change working time of your service if needed. After pressing the 'Create' button system will provide you with 'Plugin key'.
3. Go to 'Tariff' tab and activate preferable tariff. Both of them have free trial periods.
4. Navigate to your website admin panel. Once you've installed the "BooKey Table" plugin click on the "BooKey" item in your WordPress menu. 
5. Set your 'Plugin Key' from BooKey website [plugin settings](https://bookey.ltd/plugin) page in corresponding field, save changes and reload the page.
6. With use of 'Language' option you can set the table language. It does not depends on website language and will stay same according to language you selected here.
7. With use of 'Show calendar' option you can show or hide calendar and extra information on page.

### Important notes ###

Plugin is checking the current subscription status by sending request to [BooKey](https://bookey.ltd/) website once per 24 hour. 
In case if tariff is expired, the booking option will stop working for visitor and website admins.
When the new tariff is selected on the [plugin settings](https://bookey.ltd/plugin) page, it will be automatically implemented on your website
in next 24 hours or by immediate settings update after pressing 'Save Settings' on BooKey plugin page in admin console of your website.

Detailed information on data processing you can find in our [BooKey Privacy Policy](https://bookey.ltd/en/docs/privacy)
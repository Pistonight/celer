Starting from devtool v2.3.0, you can configure custom icons to use in the route in the `icons` property of the `_config` section. Example:
```yaml
_config:
  icons:
    my-icon: https://example.com/my-icon.png
    my-local-icon: icons/my-icon.png
    shrine: icons/shrine_modified.png # You can also override the default icons
```

You can then use the icon in the route by specifying the icon name in the `icon` property. Example:
```yaml
_route:
  section:
  - Do something:
      icon: my-icon
```

**Note: Currently, regardless of using web or local icons, only PNG format is supported.**

# Using an icon from the web
The easiest way to use an icon is to specify the URL to the image. Example:
```yaml
_config:
  icons:
    my-icon: https://example.com/my-icon.png
```
Note that only `https` protocol is allowed, not `http`.

# Using an icon from the local file system
You can also use an icon from the local file system. The path is relative to the `module-path` (see [Sharing Module Between Routes](./Modular%20Route.md#sharing-module-between-routes)). Example:
```yaml
_config:
  icons:
    my-local-icon: icons/my-icon.png
```

The icon data will be included in the bundled route. It is recommended to use the `-z` option when bundling to compress the bundle to reduce the size.

# Using data URLs
You can also use data URLs to specify the icon. Example:
```yaml
_config:
  icons:
    my-icon: data:image/png;base64,<base64 encoded image data>
```
It's not recommended to do this, but it's possible.

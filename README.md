# opencode-pass-file-as-path

An OpenCode V2 server plugin that removes selected file attachments during prompt admission. The literal `@path` remains in the prompt text, so the model receives a path instead of the file contents.

## Compatibility

Requires OpenCode V2 and `@opencode/plugin` 2.x. Tested with `@opencode/plugin` 2.2.5.

## Install

```sh
opencode plugin add opencode-pass-file-as-path
```

Check for updates or update the package with:

```sh
opencode plugin check
opencode plugin update opencode-pass-file-as-path
```

Configure extensions with the object form:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    {
      "package": "opencode-pass-file-as-path",
      "options": {
        "extensions": ["prefab", "unity"]
      }
    }
  ]
}
```

The string form uses the default `.prefab` extension:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["opencode-pass-file-as-path"]
}
```

Configuration reloads without restarting OpenCode.

## Options

`extensions` accepts a string or an array of strings. Matching is case-insensitive, and the leading dot is optional. Invalid or empty options fall back to `.prefab`.

```json
{
  "options": {
    "extensions": ["prefab", ".UNITY"]
  }
}
```

## Behavior

- A server prompt hook filters attachments before attachment materialization.
- Only local `file:` URIs with a matching extension are filtered.
- Matching uses the URI pathname, not the attachment name or query string.
- Malformed URIs and non-`file:` schemes are preserved.
- The `@path` text is not removed.
- No external configuration is changed, and the plugin does not read file contents.

By default, `@Assets/Wall.prefab` remains as text with no attachment, while `@Assets/Scene.unity` still attaches unless `.unity` is configured.

## Limitations

- Only attachments already present in `prompt.files` are filtered.
- A matching attachment is filtered even without a corresponding mention, which may leave no useful path in the prompt.
- The model can still read the path later with file-reading tools.
- This is a server-only plugin with no TUI or GUI component.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm test
npm run typecheck
npm run check
```

For a local checkout, configure `package` with the absolute path to this directory:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    {
      "package": "/absolute/path/to/opencode-pass-file-as-path",
      "options": { "extensions": [".prefab"] }
    }
  ]
}
```

CI runs `npm ci`, `npm run check`, and `npm pack --dry-run`.

## Release

```sh
npm run check
npm pack --dry-run
npm publish
```

After publishing, verify in a clean project with `opencode plugin add opencode-pass-file-as-path` and a prompt containing `@Assets/Wall.prefab`.

## License

MIT

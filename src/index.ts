import { Plugin } from "@opencode/plugin"
import { normalizeExtensions, stripAttachments } from "./filter.mjs"

export default Plugin.define({
  id: "opencode-pass-file-as-path",
  async setup(ctx) {
    const extensions = normalizeExtensions(ctx.options.extensions)
    await ctx.session.hook("prompt", (event) => {
      if (event.prompt.files) {
        event.prompt.files = stripAttachments(event.prompt.files, extensions)
      }
    })
  },
})

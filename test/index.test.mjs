import assert from "node:assert/strict"
import test from "node:test"
import plugin from "../src/index.ts"

async function runPlugin(options, event) {
  let hookName
  let callback
  await plugin.setup({
    options: options ?? {},
    session: {
      hook: async (name, handler) => {
        hookName = name
        callback = handler
        return { dispose: async () => {} }
      },
    },
  })
  await callback(event)
  return hookName
}

test("registers prompt hook and filters configured extensions without changing text", async () => {
  const event = {
    prompt: {
      text: "@Assets/Scene.unity and @Assets/Wall.prefab",
      files: [{ uri: "file:///Assets/Scene.unity" }, { uri: "file:///Assets/Wall.prefab" }],
    },
  }

  assert.equal(plugin.id, "opencode-pass-file-as-path")
  assert.equal(await runPlugin({ extensions: ["unity"] }, event), "prompt")
  assert.deepEqual(event.prompt.files, [{ uri: "file:///Assets/Wall.prefab" }])
  assert.equal(event.prompt.text, "@Assets/Scene.unity and @Assets/Wall.prefab")
})

test("uses the default extension when options are absent", async () => {
  const event = { prompt: { files: [{ uri: "file:///Assets/Wall.prefab" }] } }
  await runPlugin(undefined, event)
  assert.deepEqual(event.prompt.files, [])
})

test("leaves prompts without files unchanged", async () => {
  const event = { prompt: { text: "@Assets/Wall.prefab" } }
  await runPlugin(undefined, event)
  assert.deepEqual(event, { prompt: { text: "@Assets/Wall.prefab" } })
})

test("normalizes a string extension option", async () => {
  const event = { prompt: { files: [{ uri: "file:///Assets/Scene.unity" }] } }
  await runPlugin({ extensions: "unity" }, event)
  assert.deepEqual(event.prompt.files, [])
})

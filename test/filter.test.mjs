import assert from "node:assert/strict"
import test from "node:test"
import { normalizeExtensions, stripAttachments } from "../src/filter.mjs"

test("normalizes default, empty, invalid, string, duplicate, and mixed-case options", () => {
  assert.deepEqual(normalizeExtensions(undefined), [".prefab"])
  assert.deepEqual(normalizeExtensions([]), [".prefab"])
  assert.deepEqual(normalizeExtensions([null, 3, {}]), [".prefab"])
  assert.deepEqual(normalizeExtensions("UNITY"), [".unity"])
  assert.deepEqual(normalizeExtensions(["UNITY", ".prefab", "unity"]), [".unity", ".prefab"])
})

test("filters matching local URI pathnames and preserves unrelated or malformed URIs", () => {
  const files = [
    { uri: "file:///Assets/Wall.prefab" },
    { uri: "file:///Assets/WALL.PREFAB?start=2#part" },
    { uri: "file:///Assets/Wall%2eprefab" },
    { uri: "FILE:///Assets/Upper.prefab" },
    { uri: "file:///Assets/notprefab" },
    { uri: "file:///Assets/foo.prefab.txt" },
    { uri: "file:///Assets/foo.prefab/" },
    { uri: "https://example.test/Thing.prefab" },
    { uri: "data:text/plain,Thing.prefab" },
    { uri: "media://asset/Thing.prefab" },
    { uri: "not a uri" },
    { uri: "file:///Assets/Bad%ZZ.prefab" },
    { uri: undefined },
    { uri: "" },
  ]

  assert.deepEqual(stripAttachments(files), files.slice(4))
})

test("filters configured extensions using normalized options", () => {
  const files = [{ uri: "file:///Assets/Scene.unity" }, { uri: "file:///Assets/Wall.prefab" }]
  assert.deepEqual(stripAttachments(files, normalizeExtensions(["UNITY"])), [files[1]])
})

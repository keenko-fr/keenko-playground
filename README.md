# Keenko Playground

Keenko Playground is the public reference consumer used by KEE-4 to dogfood Keenko with Codex and Claude. Reusable engineering conventions belong to Keenko, not this repository.

## Bootstrap baseline

This restart was created through `keenko create` from Keenko `0.1.0` packed from [`keenko-fr/keenko-playbook` commit `3b1a2a778b40b7b0259c6950f1dc9199d2a8e8c0`](https://github.com/keenko-fr/keenko-playbook/commit/3b1a2a778b40b7b0259c6950f1dc9199d2a8e8c0), the merge commit for KEE-14 / PR #9.

Keenko `0.1.0` is not published to npm yet. `vendor/keenko/keenko-0.1.0-3b1a2a7.tgz` is therefore the immutable installation artifact for this baseline. `vendor/keenko/SHA256SUMS` records its integrity, and bootstrap verification reproduces it byte-for-byte from the exact source commit. The tarball is an installation artifact, not a second convention source.

## Development

Follow the generated canonical guidance, especially [dependency and runtime requirements](.keenko/docs/core/dependencies.md), [verification](.keenko/docs/core/verification.md), and the [convention index](.keenko/docs/conventions/README.md).

```sh
bun install --frozen-lockfile
bun run check
```

Project-specific facts and decisions live in [`CONTEXT.md`](CONTEXT.md) and [`docs/project/`](docs/project/). Generated Keenko guidance and native skill copies are read-only outputs of the Keenko lifecycle.

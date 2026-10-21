#!/usr/bin/env bash
# Publish the demos to GitHub Pages as prebuilt static files on the `gh-pages` branch.
#
# The wasm is built here rather than in CI because it links the local ../rustnn checkout.
# Run after `wasm-pack build` and the vendor build in README.md; pass --no-push to only
# assemble the site in site/.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
site="$root/site"
tjs="vendor/transformers.js/packages"
ort_web="$tjs/transformers-onnxruntime/node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs"
ort_common="$tjs/transformers-onnxruntime/node_modules/onnxruntime-common/dist/esm"

cd "$root"
rm -rf "$site"
mkdir -p "$site"
cp index.html embeddings.js playground.html main.js rustnn-provider.js style.css "$site/"
mkdir -p "$site/pkg"
cp pkg/rustnn_webnn_browser_demo.js pkg/rustnn_webnn_browser_demo_bg.wasm "$site/pkg/"
# Same paths as the import map in index.html; -L copies through pnpm's symlinks.
for path in \
  "$tjs/transformers/dist/transformers.web.js" \
  "$tjs/transformers-onnxruntime/dist/transformers-onnxruntime.web.js" \
  "$ort_web" \
  "$ort_common"; do
  mkdir -p "$site/$(dirname "$path")"
  cp -RL "$path" "$site/$path"
done
touch "$site/.nojekyll"
du -sh "$site"

[[ "${1:-}" == "--no-push" ]] && exit 0

source_rev="$(git rev-parse --short HEAD)"
rustnn_rev="$(git -C ../rustnn rev-parse --short HEAD)"
tjs_rev="$(git -C vendor/transformers.js rev-parse --short HEAD)"
remote="$(git remote get-url origin)"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -R "$site/." "$tmp/"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy demos from $source_rev" \
  -m "rustnn $rustnn_rev (with local changes if any), transformers.js $tjs_rev."
git push -f "$remote" gh-pages

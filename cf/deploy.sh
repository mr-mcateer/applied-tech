#!/usr/bin/env bash
# Publish the committed site to Cloudflare at promptaisolutions.com/applied-tech/.
# Deploys HEAD only (git archive), so uncommitted edits never go live. Add --dry to stage without deploying.
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
S="$HOME/Desktop/Claude Projects/02_TOOLS/Inkscape_CLI_Integration/plugins/house-core/skills/sys-publish/scripts/sitepub"
OUT="$(mktemp -d)"; [ -n "$OUT" ] || exit 1
git -C "$REPO" archive HEAD | tar -x -C "$OUT"
"$S" "$OUT" --name applied-tech --path /applied-tech \
  --route 'promptaisolutions.com/applied-tech*' --proj "$REPO/cf/applied-tech" "$@"

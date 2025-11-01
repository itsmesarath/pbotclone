#!/usr/bin/env bash
set -euo pipefail

DEFAULT_ROOT="../exports"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DEFAULT_DEST="$DEFAULT_ROOT/fabio-bot-$TIMESTAMP"

DEST="${1:-}"
REMOTE="${2:-}"

if [[ -z "$DEST" ]]; then
  mkdir -p "$DEFAULT_ROOT"
  DEST="$DEFAULT_DEST"
fi

if [[ -e "$DEST" ]]; then
  echo "Error: destination path '$DEST' already exists." >&2
  exit 1
fi

mkdir -p "$DEST"

git archive --format=tar HEAD | tar -x -C "$DEST"

(
  cd "$DEST"
  git init -q -b main >/dev/null 2>&1 || {
    git init -q >/dev/null 2>&1
    git checkout -b main >/dev/null 2>&1 || true
  }
  git add .
  git commit -m "Initial commit of Fabio bot" >/dev/null
  if [[ -n "$REMOTE" ]]; then
    git remote add origin "$REMOTE"
  fi
)

cat <<SUMMARY
New repository created at: $DEST

$(
  if [[ -n "$REMOTE" ]]; then
    echo "Remote 'origin' set to: $REMOTE"
  fi
)

Next steps:
  cd "$DEST"
$(
  if [[ -n "$REMOTE" ]]; then
    echo "  git push -u origin main"
  else
    cat <<'NO_REMOTE'
  git remote add origin <your-remote-url>
  git push -u origin main
NO_REMOTE
  fi
)
SUMMARY

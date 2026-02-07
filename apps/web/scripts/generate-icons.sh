#!/bin/bash
# Generate PWA icons from SVG
# Requires: inkscape or rsvg-convert
SIZES="72 96 128 144 152 192 384 512"
SVG_FILE="public/icons/icon-192x192.svg"
OUTPUT_DIR="public/icons"

for SIZE in $SIZES; do
  echo "Generating ${SIZE}x${SIZE} icon..."
  if command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w $SIZE -h $SIZE "$SVG_FILE" > "$OUTPUT_DIR/icon-${SIZE}x${SIZE}.png"
  elif command -v convert &> /dev/null; then
    convert -background none -resize ${SIZE}x${SIZE} "$SVG_FILE" "$OUTPUT_DIR/icon-${SIZE}x${SIZE}.png"
  else
    echo "No image converter found. Install rsvg-convert or imagemagick."
    exit 1
  fi
done

# Apple touch icon
cp "$OUTPUT_DIR/icon-180x180.png" "$OUTPUT_DIR/apple-touch-icon.png" 2>/dev/null || true
echo "Done!"

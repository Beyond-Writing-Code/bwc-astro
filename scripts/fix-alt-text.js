#!/usr/bin/env node

/**
 * Fix missing alt text in blog post images
 * Extracts alt text from the caption (italic text below image)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Get all markdown files recursively
function getMarkdownFiles(dir) {
  const files = [];
  const items = readdirSync(dir);

  items.forEach((item) => {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  });

  return files;
}

const files = getMarkdownFiles('src/content/posts');
let totalFixed = 0;

files.forEach((file) => {
  let content = readFileSync(file, 'utf8');
  let modified = false;

  // Match images with empty alt text followed by optional caption
  // Pattern: ![](/path/to/image.jpg)\n\n_Caption text_
  const pattern = /!\[\]\((\/images\/[^)]+)\)(\n\n_([^_]+)_)?/g;

  content = content.replace(pattern, (match, imagePath, captionBlock, captionText) => {
    modified = true;
    totalFixed++;

    if (captionText) {
      // Extract first sentence from caption, remove attribution
      let altText = captionText
        .split(/\. |Photo by|Image by/)[0]
        .replace(/^["']|["']$/g, '') // Remove quotes
        .trim();

      // Limit length
      if (altText.length > 100) {
        altText = altText.substring(0, 97) + '...';
      }

      return `![${altText}](${imagePath})${captionBlock || ''}`;
    } else {
      // No caption - use generic description based on filename
      const filename = imagePath
        .split('/')
        .pop()
        .replace(/\.(jpg|png|webp|gif)$/i, '');
      const altText = filename.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      return `![${altText}](${imagePath})`;
    }
  });

  if (modified) {
    writeFileSync(file, content, 'utf8');
    console.log(`✓ Fixed ${file}`);
  }
});

console.log(`\n✅ Fixed ${totalFixed} images across ${files.length} files`);

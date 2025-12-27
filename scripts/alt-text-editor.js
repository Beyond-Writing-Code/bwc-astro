#!/usr/bin/env node

/**
 * Alt Text Editor - Interactive tool to add proper alt text to images
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import express from 'express';

const app = express();
const PORT = 3456;

app.use(express.json());
app.use(express.static('public'));

// Get all markdown files
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

// Extract images from markdown files
function extractImages() {
  const files = getMarkdownFiles('src/content/posts');
  const images = [];

  files.forEach((file) => {
    const content = readFileSync(file, 'utf8');
    const lines = content.split('\n');

    // Find all images
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const [fullMatch, altText, imagePath] = match;

      // Get surrounding context (3 lines before and after)
      const matchIndex = content.substring(0, match.index).split('\n').length - 1;
      const contextStart = Math.max(0, matchIndex - 3);
      const contextEnd = Math.min(lines.length, matchIndex + 4);
      const context = lines.slice(contextStart, contextEnd).join('\n');

      images.push({
        file,
        altText,
        imagePath,
        context,
        fullMatch,
        index: match.index,
      });
    }
  });

  return images;
}

let allImages = extractImages();
let currentIndex = 0;

// API endpoints
app.get('/api/current', (req, res) => {
  if (currentIndex >= allImages.length) {
    return res.json({ done: true, total: allImages.length });
  }

  const image = allImages[currentIndex];
  res.json({
    ...image,
    file: relative(process.cwd(), image.file),
    currentIndex,
    total: allImages.length,
    done: false,
  });
});

app.post('/api/save', (req, res) => {
  const { altText } = req.body;

  if (currentIndex >= allImages.length) {
    return res.json({ error: 'No more images' });
  }

  const image = allImages[currentIndex];

  // Read file
  let content = readFileSync(image.file, 'utf8');

  // Replace the image markdown
  const newMarkdown = `![${altText}](${image.imagePath})`;
  content = content.replace(image.fullMatch, newMarkdown);

  // Write back
  writeFileSync(image.file, content, 'utf8');

  console.log(`✓ Updated: ${relative(process.cwd(), image.file)} - "${altText}"`);

  currentIndex++;
  res.json({ success: true });
});

app.post('/api/skip', (req, res) => {
  currentIndex++;
  res.json({ success: true });
});

app.post('/api/reset', (req, res) => {
  allImages = extractImages();
  currentIndex = 0;
  res.json({ success: true, total: allImages.length });
});

// Serve HTML interface
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Alt Text Editor</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }
    .progress {
      font-size: 14px;
      color: #666;
      margin-bottom: 10px;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #4CAF50;
      transition: width 0.3s;
    }
    .image-section {
      margin-bottom: 30px;
    }
    .image-container {
      text-align: center;
      margin-bottom: 20px;
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
    }
    img {
      max-width: 100%;
      max-height: 500px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .image-path {
      font-size: 12px;
      color: #999;
      margin-top: 10px;
      font-family: monospace;
    }
    .context {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      border-left: 4px solid #2196F3;
    }
    .context h3 {
      margin-top: 0;
      font-size: 14px;
      color: #666;
    }
    .context pre {
      white-space: pre-wrap;
      margin: 0;
      font-size: 13px;
      line-height: 1.6;
    }
    .file-info {
      font-size: 13px;
      color: #666;
      margin-bottom: 15px;
      font-family: monospace;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    .current-alt {
      background: #fff3cd;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 10px;
      font-family: monospace;
      font-size: 14px;
    }
    input[type="text"] {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      font-family: inherit;
    }
    input[type="text"]:focus {
      outline: none;
      border-color: #4CAF50;
    }
    .buttons {
      display: flex;
      gap: 10px;
    }
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }
    .btn-save {
      background: #4CAF50;
      color: white;
      flex: 1;
    }
    .btn-save:hover {
      background: #45a049;
    }
    .btn-skip {
      background: #ff9800;
      color: white;
    }
    .btn-skip:hover {
      background: #e68900;
    }
    .btn-reset {
      background: #f44336;
      color: white;
    }
    .done {
      text-align: center;
      padding: 40px;
    }
    .done h2 {
      color: #4CAF50;
      margin-bottom: 10px;
    }
    .helper {
      background: #e3f2fd;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
      border-left: 4px solid #2196F3;
    }
    .helper h4 {
      margin: 0 0 10px 0;
      color: #1976D2;
    }
    .helper ul {
      margin: 0;
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Alt Text Editor</h1>
      <div class="progress" id="progress">Loading...</div>
      <div class="progress-bar">
        <div class="progress-fill" id="progressBar" style="width: 0%"></div>
      </div>
    </div>

    <div id="content">Loading...</div>
  </div>

  <script>
    let currentImage = null;

    async function loadCurrent() {
      const res = await fetch('/api/current');
      const data = await res.json();

      if (data.done) {
        document.getElementById('content').innerHTML = \`
          <div class="done">
            <h2>✅ All Done!</h2>
            <p>You've reviewed all \${data.total} images.</p>
            <button class="btn-reset" onclick="reset()">Start Over</button>
          </div>
        \`;
        updateProgress(data.total, data.total);
        return;
      }

      currentImage = data;
      updateProgress(data.currentIndex + 1, data.total);

      document.getElementById('content').innerHTML = \`
        <div class="helper">
          <h4>Good Alt Text Tips:</h4>
          <ul>
            <li>Describe what's in the image concisely</li>
            <li>Don't start with "Image of" or "Picture of"</li>
            <li>Keep it under 125 characters if possible</li>
            <li>Consider the context of the article</li>
          </ul>
        </div>

        <div class="file-info">File: \${data.file}</div>

        <div class="image-section">
          <div class="image-container">
            <img src="\${data.imagePath}" alt="\${data.altText || 'No alt text'}" />
            <div class="image-path">\${data.imagePath}</div>
          </div>
        </div>

        <div class="context">
          <h3>Context:</h3>
          <pre>\${escapeHtml(data.context)}</pre>
        </div>

        <div class="form-group">
          <label>Current Alt Text:</label>
          <div class="current-alt">\${data.altText || '(empty)'}</div>

          <label for="altText">New Alt Text:</label>
          <input
            type="text"
            id="altText"
            value="\${data.altText}"
            placeholder="Enter descriptive alt text..."
            autofocus
          />
        </div>

        <div class="buttons">
          <button class="btn-save" onclick="save()">Save & Next</button>
          <button class="btn-skip" onclick="skip()">Skip</button>
        </div>
      \`;

      // Focus input and select text
      const input = document.getElementById('altText');
      input.focus();
      input.select();

      // Handle Enter key
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') save();
      });
    }

    function updateProgress(current, total) {
      const percent = (current / total) * 100;
      document.getElementById('progress').textContent = \`Image \${current} of \${total}\`;
      document.getElementById('progressBar').style.width = percent + '%';
    }

    async function save() {
      const altText = document.getElementById('altText').value.trim();

      if (!altText) {
        alert('Please enter alt text');
        return;
      }

      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ altText })
      });

      loadCurrent();
    }

    async function skip() {
      await fetch('/api/skip', { method: 'POST' });
      loadCurrent();
    }

    async function reset() {
      if (confirm('Start over from the beginning?')) {
        await fetch('/api/reset', { method: 'POST' });
        loadCurrent();
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Load first image
    loadCurrent();
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`\n✨ Alt Text Editor running at http://localhost:${PORT}\n`);
  console.log(`Found ${allImages.length} images to review\n`);
  console.log(`Press Ctrl+C to stop\n`);
});

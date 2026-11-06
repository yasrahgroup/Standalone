#!/usr/bin/env node

/**
 * Prepare API directory for public deployment
 * This script bundles api-public/* using esbuild into standalone .js functions in api/
 * ensuring only public-facing functions are deployed and all internal imports are fully resolved
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceDir = path.join(rootDir, 'api-public');
const targetDir = path.join(rootDir, 'api');

console.log('Preparing public API deployment (bundling standalone .js functions)...');
console.log(`Source: ${sourceDir}`);
console.log(`Target: ${targetDir}`);

// Remove existing api directory if it exists
if (fs.existsSync(targetDir)) {
  console.log('Removing existing api directory...');
  fs.rmSync(targetDir, { recursive: true, force: true });
}

// Create api directory
fs.mkdirSync(targetDir, { recursive: true });

async function bundleDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      await bundleDirectory(srcPath, destPath);
    } else if (entry.name.endsWith('.ts')) {
      const outPath = destPath.replace(/\.ts$/, '.js');
      await esbuild.build({
        entryPoints: [srcPath],
        outfile: outPath,
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node20',
        packages: 'external',
        sourcemap: 'inline',
      });
      console.log(`Bundled: ${path.relative(rootDir, srcPath)} -> ${path.relative(rootDir, outPath)}`);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

await bundleDirectory(sourceDir, targetDir);

console.log('Public API bundling complete.');

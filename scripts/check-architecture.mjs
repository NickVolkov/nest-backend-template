import fs from 'node:fs';
import path from 'node:path';

const coreRoot = path.resolve('canonical-module/src/core');
const failures = [];

function visit(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const filename = path.join(folder, entry.name);
    if (entry.isDirectory()) visit(filename);
    else if (entry.isFile() && filename.endsWith('.ts')) checkFile(filename);
  }
}

function checkFile(filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const normalized = filename.split(path.sep).join('/');

  if (normalized.includes('/dto/')) {
    const forbidden = [
      [/from\s+['"]zod['"]/, 'imports zod'],
      [/\.(pick|omit|extend)\s*\(/, 'composes a schema'],
      [/(^|\n)\s*(export\s+)?(const|type|interface)\s+/m, 'declares schema data or a type'],
    ];
    for (const [pattern, reason] of forbidden) {
      if (pattern.test(source)) failures.push(`${normalized}: DTO file ${reason}`);
    }
  }

  if (
    (normalized.includes('/repository/') || normalized.includes('/use-cases/')) &&
    /from\s+['"]@\/core\/[^'"]+\/dto\//.test(source)
  ) {
    failures.push(`${normalized}: repository/use case imports from dto/`);
  }
}

visit(coreRoot);

if (failures.length > 0) {
  console.error(['Architecture check failed:', ...failures.map((item) => `- ${item}`)].join('\n'));
  process.exitCode = 1;
} else {
  console.log('Architecture check passed.');
}

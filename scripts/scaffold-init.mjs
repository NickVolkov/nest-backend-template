import { existsSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const skipApmInstall = process.env.SCAFFOLD_SKIP_APM === '1';

function fail(message) {
  console.error(`scaffold:init: ${message}`);
  process.exit(1);
}

function execute(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
  });

  if (result.error?.code === 'ENOENT') {
    fail(`required command not found: ${command}`);
  }

  if (result.status !== 0) {
    if (options.capture) {
      process.stderr.write(result.stderr ?? '');
    }
    fail(`${command} ${args.join(' ')} failed`);
  }

  return result.stdout?.trim() ?? '';
}

function isInsideGitWorktree() {
  const result = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  return result.status === 0;
}

function normalizeProjectName() {
  const fallbackName = basename(root).toLowerCase();
  const packagePath = join(root, 'package.json');
  const apmPath = join(root, 'apm.yml');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

  if (!packageJson.name || packageJson.name === 'nest-backend-template') {
    packageJson.name = fallbackName;
    writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  }

  const apm = readFileSync(apmPath, 'utf8');
  if (apm.startsWith('name: nest-backend-template\n')) {
    writeFileSync(
      apmPath,
      apm.replace('name: nest-backend-template\n', `name: ${packageJson.name}\n`),
    );
  }
}

for (const requiredFile of ['package.json', 'apm.yml', 'docs/engineering']) {
  if (!existsSync(join(root, requiredFile))) {
    fail(`run this command from a freshly generated project (${requiredFile} is missing)`);
  }
}

if (isInsideGitWorktree()) {
  fail(
    'the project is already inside a Git worktree; run scaffold:init immediately after scaffoldrr creates the files and before git init',
  );
}

execute('git', ['config', 'user.name'], { capture: true });
execute('git', ['config', 'user.email'], { capture: true });

normalizeProjectName();
rmSync(join(root, 'CLAUDE.md'), { force: true });
symlinkSync('AGENTS.md', join(root, 'CLAUDE.md'));

if (!skipApmInstall) {
  execute('apm', ['install']);
}

execute('git', ['init', '--initial-branch=main']);
execute('git', ['add', '--all']);
execute('git', ['commit', '-m', 'Initialize project from Nest backend template']);

console.log('\nProject initialized. Next: pnpm install');

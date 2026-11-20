import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function textFiles() {
  const output = [];
  const skip = new Set([
    'node_modules',
    '.git',
    '.expo',
    'dist',
    'web-build',
    'coverage',
    'assets',
  ]);
  const extensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.example', '.toml']);

  function walk(directory) {
    for (const entry of readdirSync(directory)) {
      const full = join(directory, entry);
      const name = relative(root, full).replaceAll('\\', '/');
      if (skip.has(entry) || name.startsWith('.')) continue;
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (extensions.has(entry.slice(entry.lastIndexOf('.')))) {
        output.push({ name, contents: readFileSync(full, 'utf8') });
      }
    }
  }

  walk(root);
  return output;
}

test('app identity is HB Plus everywhere in source and documentation', () => {
  const files = textFiles().filter((file) => !file.name.startsWith('tests/'));
  const offenders = files
    .filter((file) => /securegate/i.test(file.contents))
    .map((file) => file.name);

  assert.deepEqual(offenders, [], `Found old branding in: ${offenders.join(', ')}`);
  assert.match(read('app.config.js'), /name:\s*'HB Plus'/);
  assert.match(read('package.json'), /"name":\s*"hbplus-auth"/);
});

test('login screen contains the exact required heading and subtitle', () => {
  const constants = read('src/constants/index.ts');
  const login = read('src/screens/LoginScreen.tsx');

  assert.match(constants, /WELCOME_HEADING\s*=\s*'Welcome to HB Plus\.'/);
  assert.match(
    constants,
    /LOGIN_SUBTITLE\s*=\s*"Sign in to access your organization's workspace\."/,
  );
  assert.match(login, /WELCOME_HEADING/);
  assert.match(login, /LOGIN_SUBTITLE/);
  assert.match(login, /HBPlusLogo/);
  assert.match(read('src/components/GoogleSignInButton.tsx'), /Sign in with Google/);
});

test('domain restriction uses exact equality and the exact rejection message', () => {
  const domain = read('src/utils/domainValidation.ts');
  const appConfig = read('src/config/app.ts');

  assert.match(domain, /return parts\[1\] === ALLOWED_EMAIL_DOMAIN/);
  assert.match(appConfig, /'Access restricted\. Please login using your official domain email\.'/);
  assert.doesNotMatch(domain, /includes\s*\(/);
  assert.doesNotMatch(domain, /contains\s*\(/);
});

test('unauthorized sign-out and protected routes are implemented', () => {
  const authContext = read('src/context/AuthContext.tsx');
  const protectedLayout = read('app/(protected)/_layout.tsx');

  assert.match(authContext, /await signOut\(auth\)/);
  assert.match(authContext, /signOutFromProvider\(\)/);
  assert.match(authContext, /setUser\(null\)/);
  assert.match(authContext, /isAllowedEmailDomain\(firebaseUser\.email\)/);
  assert.match(protectedLayout, /if \(!user\) return <Redirect href="\/login" \/>/);
});

test('admin privileges come from trusted sources, not a client env list', () => {
  const allSource = textFiles()
    .filter((file) => !file.name.startsWith('tests/'))
    .map((file) => file.contents)
    .join('\n');
  const rules = read('firestore.rules');

  assert.doesNotMatch(allSource, /ADMIN_EMAILS/);
  assert.match(rules, /request\.resource\.data\.role == 'user'/);
  assert.match(rules, /request\.auth\.token\.admin == true/);
  assert.match(read('src/context/AuthContext.tsx'), /tokenResult\.claims\.admin === true/);
  assert.match(read('src/services/profile.service.ts'), /export function createFallbackProfile/);
});

test('native Google sign-in does not pre-filter the hosted domain', () => {
  assert.doesNotMatch(read('src/services/googleSignIn.native.ts'), /hostedDomain/);
});

test('README and testing report are present and accurate', () => {
  const readme = read('README.md');
  const report = read('TESTING.md');

  for (const section of [
    '## 1. Project Overview',
    '## 6. Web Deployment',
    '## 7. Testing Report',
  ]) {
    assert.ok(readme.includes(section), `README missing section: ${section}`);
  }
  assert.match(report, /NOT TESTED/);
  assert.match(report, /Unauthorized personal Gmail/);
});

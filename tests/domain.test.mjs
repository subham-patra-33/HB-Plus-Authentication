import assert from 'node:assert/strict';
import test from 'node:test';

process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN = 'hbplus.fit';

const {
  DomainRestrictionError,
  assertAllowedEmailDomain,
  emailDomain,
  isAllowedEmailDomain,
  normalizeEmail,
} = await import('../src/utils/domainValidation.ts');
const { ACCESS_RESTRICTED_MESSAGE } = await import('../src/config/app.ts');

test('normalizes email addresses', () => {
  assert.equal(normalizeEmail('  Person@HBPlus.Fit  '), 'person@hbplus.fit');
  assert.equal(normalizeEmail(null), '');
});

test('extracts only the domain from a well-formed email', () => {
  assert.equal(emailDomain('person@hbplus.fit'), 'hbplus.fit');
  assert.equal(emailDomain('person@gmail.com'), 'gmail.com');
  assert.equal(emailDomain('not-an-email'), '');
});

test('accepts exact @hbplus.fit addresses only', () => {
  assert.equal(isAllowedEmailDomain('member@hbplus.fit'), true);
  assert.equal(isAllowedEmailDomain('  Member@HBPLUS.FIT '), true);
  assert.equal(isAllowedEmailDomain('member@gmail.com'), false);
  assert.equal(isAllowedEmailDomain('user@evil-hbplus.fit'), false);
  assert.equal(isAllowedEmailDomain('user@hbplus.fit.attacker.com'), false);
  assert.equal(isAllowedEmailDomain('user@hbplus.fit@evil.com'), false);
  assert.equal(isAllowedEmailDomain('hbplus.fit'), false);
  assert.equal(isAllowedEmailDomain(null), false);
});

test('assertion throws the exact required rejection message', () => {
  assert.doesNotThrow(() => assertAllowedEmailDomain('member@hbplus.fit'));
  assert.throws(
    () => assertAllowedEmailDomain('member@gmail.com'),
    (error) => {
      assert.ok(error instanceof DomainRestrictionError);
      assert.equal(error.message, ACCESS_RESTRICTED_MESSAGE);
      assert.equal(
        error.message,
        'Access restricted. Please login using your official domain email.',
      );
      return true;
    },
  );
});

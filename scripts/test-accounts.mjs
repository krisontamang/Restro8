import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolvePublicRoute,passwordIssue,emailIssue,authMessage,subscriptionIsCurrent,isSafePublicKey} from '../src/lib/accountRules.ts';

test('every workspace alias routes through the verified account gate',()=>{
  for(const path of ['/app','/app/','/account','/workspace','/pos','/dashboard']) assert.equal(resolvePublicRoute(path),'account');
  assert.equal(resolvePublicRoute('/','?view=app'),'account');
  assert.equal(resolvePublicRoute('/','?view=workspace'),'account');
  assert.equal(resolvePublicRoute('/demo'),'demo');
});
test('public account routes have explicit, fail-closed destinations',()=>{
  const routes={'/':'landing','/np':'landing','/login':'login','/signin':'login','/auth':'login','/signup':'signup','/forgot-password':'forgot','/reset-password':'reset','/auth/callback':'callback','/menu':'menu','/unknown':'not-found'};
  for(const [path,route] of Object.entries(routes)) assert.equal(resolvePublicRoute(path),route);
  assert.equal(resolvePublicRoute('/login','?next=https://malicious.example'),'login');
  assert.equal(resolvePublicRoute('/app/anything'),'not-found');
});
test('registration passphrases and email boundaries',()=>{
  assert.ok(passwordIssue('short')); assert.equal(passwordIssue('a memorable unique passphrase'),null);
  assert.equal(passwordIssue('x'.repeat(128)),null); assert.ok(passwordIssue('x'.repeat(129)));
  assert.equal(emailIssue('  owner@example.test  '),null);
  for(const email of ['','owner','owner@','@example.test','a b@example.test',`${'x'.repeat(250)}@example.test`]) assert.ok(emailIssue(email));
});
test('subscription display never treats a browser success or expired plan as active',()=>{
  const now=Date.parse('2026-09-17T00:00:00Z');
  for(const status of ['pending','paid','success','past_due','unpaid','canceled','expired','SuperAdmin']) assert.equal(subscriptionIsCurrent({status,current_period_end:'2027-01-01'},now),false);
  for(const end of [null,'invalid','2026-09-16','2026-09-17T00:00:00Z']) assert.equal(subscriptionIsCurrent({status:'active',current_period_end:end},now),false);
  assert.equal(subscriptionIsCurrent(null,now),false);
  assert.equal(subscriptionIsCurrent({status:'active',current_period_end:'2027-01-01'},now),true);
  assert.equal(subscriptionIsCurrent({status:'trialing',current_period_end:'2027-01-01'},now),true);
});
test('auth failures are actionable without exposing server internals or secrets',()=>{
  assert.match(authMessage({code:'invalid_credentials'}),/incorrect/);
  assert.match(authMessage({code:'email_not_confirmed'}),/Verify your email/);
  assert.match(authMessage({status:429}),/Too many/);
  assert.match(authMessage({code:'signup_disabled'}),/not open/);
  assert.doesNotMatch(authMessage({message:'database credentials SECRET'}),/SECRET/);
});
test('actual client key guard rejects secrets, non-anon JWTs and malformed configuration',()=>{
  for(const key of [undefined,'','sb_secret_bad','service_role','random-string','header.bad.sig']) assert.equal(isSafePublicKey(key),false);
  for(const role of ['authenticated','service_role','admin',undefined]) assert.equal(isSafePublicKey('h.'+Buffer.from(JSON.stringify({role})).toString('base64url')+'.s'),false);
  assert.equal(isSafePublicKey('h.'+Buffer.from(JSON.stringify({role:'anon'})).toString('base64url')+'.s'),true);
  assert.equal(isSafePublicKey('sb_publishable_'+ 'a'.repeat(25)),true);
});
test('public account components contain no simulated login or local role grants',()=>{
  const auth=readFileSync(new URL('../src/components/auth/AuthDashboardView.tsx',import.meta.url),'utf8');
  assert.match(auth,/signInWithPassword/); assert.match(auth,/resetPasswordForEmail/); assert.match(auth,/updateUser/);
  assert.doesNotMatch(auth,/localStorage|888888|SuperAdmin|setTimeout/);
  const root=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  assert.match(root,/import\.meta\.env\.DEV \? lazy/);
  assert.doesNotMatch(root,/setItem|handleLaunchWorkspace/);
});
test('migration runner excludes the unsafe legacy prototype',()=>{
  const files=readdirSync(new URL('../supabase/migrations/',import.meta.url));
  assert.ok(files.some(name=>name.includes('restro8_account_foundation')));
  assert.ok(!files.some(name=>name==='20260917_security_rls_policies.sql'));
});

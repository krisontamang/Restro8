# Restro8 public site and account launch plan

## Original direction
Calm hospitality software: warm ivory, graphite, deep sage, a soft apricot accent, the existing dining/infinity logo and Plus Jakarta Sans. Original headline and workflow-led storytelling. No competitor imagery, testimonials, certifications or copied copy.

## Build order
1. Replace the oversized landing page with a focused responsive product story, interactive sample-data dashboard preview, feature walkthrough, server-configured plans and FAQ.
2. Replace simulated login/OTP/admin escalation with Supabase email/password authentication, signup confirmation, password recovery, password visibility, accessible field errors and real sign-out.
3. Route /app through verified authentication. Keep the legacy local workspace explicitly separate at /demo, never silently treat browser data as a paying customer's cloud workspace.
4. Add persistent onboarding and subscription read models with tenant isolation. Client code must never grant a paid entitlement. Billing requires an approved provider, real server prices and verified payment events.
5. Verify 414x896 mobile, 1440 desktop, keyboard use, reduced motion, deep links, invalid credentials, missing configuration, protected-route boundaries, build and regression tests.

## Discovered launch blockers (before changes)
- Login grants SuperAdmin after a timer, without checking credentials.
- Registration/password reset/OTP success messages are simulated.
- /app is public and trusts a locally selected role.
- The connected Supabase public schema is empty; operational restaurant data currently lives in local browser storage.
- Existing SQL file has unsafe public insertion and overly broad menu/table access; do not deploy it unchanged.
- No payment provider, merchant credentials, approved prices, SMTP/redirect/domain configuration or published terms have been verified.

## Honesty boundary
Deliver working code and verified configured services. Do not call the complete product sell-ready until operational cloud persistence, billing, tenant isolation and recovery are exercised end to end. A UI flag is never subscription authorization.

# Grama-Yatri Firestore Security Specification

## 1. Data Invariants
- A ping must reference a valid stop ID.
- The `timestamp` should be fresh (close to server time).
- A user can only report pings if they are authenticated (for this app, we'll allow anonymous reports but encourage auth).

## 2. The "Dirty Dozen" Payloads (Denial Test Cases)
1. **Identity Theft:** Ping with `reporterName` but empty `stopId`.
2. **Resource Poisoning:** Ping with 10KB `reporterName`.
3. **Invalid Enum:** Ping with `type: "TELEPORTED"`.
4. **Time Travel:** Ping with `timestamp` from the year 2099.
5. **Backdated Ping:** Ping with `timestamp` from yesterday.
6. **Unknown Field:** Ping with `isVerified: true` (Ghost Field).
7. **Malicious ID:** Ping with doc ID `../../../etc/passwd`.
8. **Null Values:** Ping with `null` fields.
9. **Spamming:** Too many writes from one source (handled by rate limiting if possible).
10. **Wrong Type:** `timestamp` as a string.
11. **Empty Strings:** `stopId: ""` or `reporterName: ""`.
12. **Unauthorized Delete:** Attempting to delete someone else's ping.

## 3. Test Runner (Mock)
- `tests/firestore.rules.test.ts` will verify these denials.

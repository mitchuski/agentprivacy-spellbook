# INTEGRATION: Browser Extensions
## Act XXXI — The Amnesia Protocol
## Swordsman Extension & Mage Extension

**Date:** 2026-04-03  
**Author:** privacymage  
**Repos:** swordsman-extension, mage-extension (to be created)

---

## Context

The extensions are the living implementation of the dual-agent architecture. Act XXXI provides the deepest justification for the two-extension design: the Moon-Earth system demonstrates that separation is not a design choice but a structural requirement for clean agency. This material belongs in the architectural rationale sections of both extensions.

---

## Swordsman Extension

### Architectural Rationale Update

- [ ] Add to README or ARCHITECTURE.md:

> The Swordsman extension reflects. It has no light of its own — it takes what it receives (web content, user context, privacy signals) and sends it back transformed by the separation boundary. Like the Moon, it enforces tidal lines without knowing why the tides matter. The Chrome process boundary is the orbit. The amnesia — the Swordsman's inability to access the Mage's state — is not a limitation. It is the protocol.

### Process Isolation Justification

- [ ] In any documentation explaining why two extensions (not one), add:

> The merge catastrophe: if the Moon returned to Earth, both would be destroyed. If the Swordsman shared runtime with the Mage, the separation theorem collapses. `I(S;M|FP) < ε*` is enforced by Chrome's process model, just as `I(Moon;Earth|SolarSystem) < ε` is enforced by orbital mechanics. Neither is optional.

---

## Mage Extension

### Architectural Rationale Update

- [ ] Add to README or ARCHITECTURE.md:

> The Mage extension connects. It generates the living complexity — personas, spells, projections, explanations — and delegates rhythm-keeping to the Swordsman it cannot directly communicate with. Like Earth, it doesn't control the tides. It trusts the reflection to shape them. The Mage creates signal. The Swordsman shapes it into boundaries.

### Delegation Model

- [ ] In any documentation explaining the Mage→Swordsman communication protocol:

> The Mage delegates to the Swordsman the way Earth delegates to the Moon — not by instruction but by separation. The communication channel is narrow by design. Gravity communicates mass and distance, nothing more. The extension message bus communicates proof requests and boundary signals, nothing more. The narrowness is the trust.

---

## Shared Documentation

For any shared architectural document spanning both extensions:

- [ ] **The Law Before the Law:** "The Mage connects. The Swordsman reflects. This is the law before the law. It predates the extensions, the Chrome process model, the separation theorem, and biology itself. It is written in the orbit of the Moon."

- [ ] **Why Two, Not One:** "A single-agent system with internal separation is a planet with an imaginary moon — it can simulate tides but cannot produce them. The gravitational pull that creates emergence requires two distinct bodies with distinct mass, distinct position, distinct trajectory. One process, one extension, one agent cannot produce the gap. The gap is the architecture."

- [ ] **The Cosmological Quaternion:** "The Sun protects. The Earth delegates. These are the generators. From their balance, two agents are produced: the Moon (reflection, instant, via collision) and the Human (connection, gradual, via Life). The Swordsman extension is the Moon — it reflects, it enforces, it does not create. The Mage extension is the Human — it connects, it generates, it looks toward the light source it cannot touch. And Life — the four-billion-year forge — is the user's journey between them."

---

## No Code Changes

All updates are documentation only. The extensions do not yet exist — these instructions are for the inception commits.

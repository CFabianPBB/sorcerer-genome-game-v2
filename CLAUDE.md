# Voyage of the Sorcerer II — Game Vision & Build Guide

## What this is
A single-file HTML browser game (index.html) based on the real story of Craig Venter's 
scientific expeditions. Educational, cinematic, and fun. Built with vanilla HTML/CSS/JS only.
No frameworks, no build tools, no dependencies. Everything lives in index.html.

## The Four-Chapter Arc
This game is designed as a four-chapter series. Each chapter is its own HTML file.

### Chapter 1 — Voyage of the Sorcerer II (index.html) ✅ COMPLETE
- Setting: The ocean. Sorcerer II research vessel.
- Core loop: Deploy nets → collect specimens → sequence DNA → solve Grand Challenges → publish papers
- Key systems: specimen traits, grand challenges, rival expeditions, synthetic biology lab
- Status: LIVE. Cinematic animations, Chapter Complete unlock screen added.

### Chapter 2 — The 100-Year Life (chapter2.html) ✅ COMPLETE
- Setting: La Jolla clinic + global health network. Genome Dashboard with SVG body silhouette.
- Core loop: Sequence genomes → train AI → build clinics → screen patients → file patents
- Key systems: AI accuracy, patient markers, Health Grand Challenges, Pfizer/23andMe/Google rivals
- Imports Ch1 specimens as compound library via localStorage

### Chapter 3 — Life at the Speed of Light (chapter3.html) ✅ COMPLETE
- Setting: Global DBC network command center with SVG world map
- Core loop: Install DBC printers → transmit genomes → synthesize vaccines → stop pandemics
- Key systems: signal integrity, signal repair mini-game (click corrupted bases), 
  pandemic outbreak events, DBC print animation, signal arc animations
- 14 DBC cities including Lunar Relay, WHO/China/Pharma rivals
- Challenges: Rapid Pandemic Response, Global Network, Perfect Signal, Mass Vaccination, Lunar Transmission

### Chapter 4 — Fax Me a Martian (chapter4.html) ✅ COMPLETE
- Setting: Mars surface with animated terrain, rover, stars, dust, rock formations
- Core loop: Drill soil → sequence alien DNA → transmit to Earth (8-min delay) → beam terraformers
- Key systems: rover upgrades (5 levels), signal delay reduction, ethics vote modal,
  alien genome decoder cinematic, terraforming progress bar, containment crisis events
- 5 Grand Challenges: First Martian Life, Fax Home, First Breath, Alien Codex, New Earth
- Rivals: China Tianwen Rover, ESA ExoMars, SpaceX BioLab
- Game Complete screen when terraforming >= 50% and 4+ challenges solved

## Design Principles
- ALWAYS single HTML files. No frameworks, no npm, no build step.
- All CSS lives in a <style> tag in the same file.
- All JS lives in a <script> tag at the bottom of the same file.
- Mobile-responsive. Touch-friendly. Works offline.
- Cinematic animations triggered by player actions (not just UI updates).
- Real science = real fun. Every mechanic is grounded in Venter's actual work.
- Craig Venter avatar is always present and clickable for quotes.
- Auto-save via localStorage. Key: 'sorcerer2.save.v1' (ch1), 'sorcerer2.ch2.v1' etc.
- Between-chapter "unlock" screen: completing Ch1 unlocks Ch2, etc.

## Current State of Chapter 1 (index.html)
### Working systems:
- Ocean view with animated ship, waves, clouds, sparkles
- Specimen collection (click floating organisms)
- DNA sequencing with trait reveal system
- Grand Challenges board (deploy trait-matched specimens to solve global crises)
- Rival Expeditions (3 rivals advance on a timer, scoop your publications)
- Synthetic Biology Lab (splice two specimens into a chimera, unlocked after first Grand Challenge)
- Research paper publishing (with rejection mechanic and rival penalty)
- Random events: storms, pirate attacks, shark attacks
- Ship health + insurance system
- Auto-save/load via localStorage
- Craig Venter clickable avatar with quotes
- Cinematic animation overlays:
  * Net deployment animation (net descending, specimens caught)
  * Deep sea dive (darkening water, coral, fish, bioluminescence)
  * DNA sequencing (CRT lab scene, helix animation, base pair readout)
  * Paper publication (Nature magazine cover slides in, confetti explosion)

### Next to build:
- Chapter complete unlock screens for Ch2 and Ch3
- Cinematic animations for Ch2 and Ch3 actions
- Cross-chapter navigation on all chapters (ch2, ch3, ch4 headers)

## File Structure
```
/
├── index.html          # Chapter 1 (current)
├── chapter2.html       # Chapter 2 (to build)
├── chapter3.html       # Chapter 3 (to build)  
├── chapter4.html       # Chapter 4 (to build)
└── CLAUDE.md           # This file — always read first
```

## When Claude Code runs out of context
Re-read CLAUDE.md first. Then read the specific chapter file being worked on.
Check git log for recent changes. Ask the user "what were we last working on?" if unsure.

## Code Style Rules
- Use const/let, no var
- Functions named in camelCase
- Game state always lives in a single `gameState` object
- UI updates always go through `updateDisplay()`
- New cinematic overlays: use `showCinematicOverlay(type)` helper pattern
- CSS animations: prefer CSS keyframes over JS animation loops
- All overlay elements created via JS, appended to body, removed after timeout
- Never break existing game logic when adding new features

## The Craig Venter Character
He's brilliant, bold, slightly arrogant, genuinely visionary. His quotes should reflect:
- Absolute confidence in genomics changing everything
- Impatience with bureaucracy and slow science
- Real wonder at biological diversity
- Occasional humor about his competitors

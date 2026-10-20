# Research

## Audience and tone

The brief calls for a spooky, playful experience appropriate for ages 10+. The design therefore uses mystery, anticipation, stylized silhouettes, warm magic, and a friendly payoff—never gore, realistic violence, or suffering.

## Direction explored

Three scene ideas were considered: a flooded ghost carnival, a rooftop witch garden, and a moonlit hilltop manor. The manor was selected because its strong silhouette creates a clear phone-scale focal point while naturally supporting several discoverable regions: bell, attic, graveyard, and pumpkin patch.

## Interaction findings applied

- Touch targets are at least 54 CSS pixels and also work as native keyboard buttons.
- A short riddle changes into progressively clearer hints at roughly eight-second intervals.
- Every trigger gives movement and synthesized audio feedback, while incorrect choices give a soft, non-punishing response.
- Browser audio starts only after the Enter gesture to comply with mobile autoplay rules.
- The system reduced-motion preference preselects “Calmer motion” before entry; the user can override it.

## Asset and licensing decision

No external visual or audio assets are used. The scene is original HTML/CSS artwork. Ambient wind, hum, bells, chimes, and story sounds are synthesized at runtime with the Web Audio API. Google Fonts are loaded from Google Fonts under their respective open font licenses; system fallbacks remain functional offline.


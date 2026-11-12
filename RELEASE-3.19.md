# 3.19 — Reference-inspired Ganesha

12 November 2026. The supplied seated Ganesha illustration was used as a visual reference only. Its original raster file was not copied into the website. This is an original stylized geometric interpretation, not a scanned reconstruction or a claim to exact unseen-angle fidelity.

- Replaced the simple monochrome statue with a dedicated local 3D model: warm peach skin, four arms, sculpted ears, painted eye details, tapered curled trunk, crown, blue/gold halo, jewelry, offering bowl and pink lotus base.
- Bead chains use instancing. The model is bundled with the existing local Three.js scene; no external model/CDN/API is introduced.
- Added a semantic close-up toggle with camera reframing. Station overlays hide during close-up; direct activity links and prayer remain available. Return-to-center restores the courtyard camera. Close-up is disabled until the 3D scene is ready and when fallback is used.
- Existing siamsi 3D vessel, authentication, random outcomes and database behavior are preserved. No production deployment.

Validation: 52 tests passed and 8 routes built. Browser tested close-up, camera rotation and returning to the courtyard. Inspected 1280px and 390px layouts; mobile page width did not overflow. No new hardware performance claim. Mobile close-up screenshot saved for handoff.

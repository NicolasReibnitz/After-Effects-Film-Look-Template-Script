// Apply color correction FX to the 'Color Correction' layer in the active comp
namespace _ColorCorrection {
	export function applyEffects(layer: AVLayer) {
		// app.beginUndoGroup('Apply Color Correction FX');

		/* === Glow === */

		const glow = layer.effect.addProperty('ADBE Glo2');
		Utils.setEffectProp(glow, 'Glow Threshold', (50 / 100) * 255);
		Utils.setEffectProp(glow, 'Glow Radius', 1000);
		Utils.setEffectProp(glow, 'Glow Intensity', 0.2);
		Utils.setEffectProp(glow, 'Glow Operation', 6); // Screen

		/* === CC Vignette === */

		const vignette = layer.effect.addProperty('CC Vignette');
		Utils.setEffectProp(vignette, 'Amount', 100);

		/* === Levels === */

		const levels = layer.effect.addProperty('ADBE Easy Levels2');
		Utils.setEffectProp(levels, 'Output Black', 0.030517578125);
		Utils.setEffectProp(levels, 'Output White', 0.91552734375);

		// app.endUndoGroup();
	}
}

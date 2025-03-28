// Add Grain FX to the "Grain" layer in the active comp
namespace _Grain {
	export function applyEffects(layer: AVLayer) {
		// app.beginUndoGroup('Apply Grain FX');

		/* === NOISE === */

		const noise = layer.effect.addProperty('ADBE Noise2');
		Utils.setEffectProp(noise, 'ADBE Noise2-0001', 30); // Amount of Noise
		Utils.setEffectProp(noise, 'ADBE Noise2-0002', 0); // Use color noise

		/* === GAUSSIAN BLUR === */

		const blur = layer.effect.addProperty('ADBE Gaussian Blur 2');
		Utils.setEffectProp(blur, 'Blurriness', 10);
		Utils.setEffectProp(blur, 'Repeat Edge Pixels', true);

		/* === UNSHARP MASK === */

		const unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');
		Utils.setEffectProp(unsharp, 'Amount', 300);
		Utils.setEffectProp(unsharp, 'Radius', 3);

		// app.endUndoGroup();
	}
}

// Apply flicker FX to the 'Flicker' layer in the active comp
namespace _Flicker {
	export function applyEffects(layer: AVLayer) {
		/* === EXPOSURE === */

		const exposure = layer.effect.addProperty('ADBE Exposure2');
		Utils.setEffectProp(exposure, 'Exposure', 'wiggle(12, 0.1)', true);
	}
}

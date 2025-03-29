// Apply Gate Weave FX to the 'Gate Weave' layer in the active comp
namespace _GateWeaveNewsReel {
	export function applyEffects(layer: AVLayer) {
		/* === TRANSFORM === */

		const transform = layer.effect.addProperty('ADBE Geometry2');
		Utils.setEffectProp(
			transform,
			'Position',
			'x = wiggle(12, 3)[0];\n' + 'y = wiggle(3, 0.9, 3, 4)[1];\n' + '[x, y];',
			true
		);
		Utils.setEffectProp(transform, 'Scale Width', 102);
		Utils.setEffectProp(transform, 'Scale Height', 102);
	}
}

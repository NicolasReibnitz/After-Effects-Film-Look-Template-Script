// Apply Gate Weave FX to the 'Gate Weave' layer in the active comp
namespace _GateWeave {
	export function applyEffects(layer: AVLayer) {
		// app.beginUndoGroup('Apply Gate Weave FX');

		/* === TRANSFORM === */

		const transform = layer.effect.addProperty('ADBE Geometry2');
		Utils.setEffectProp(
			transform,
			'Position',
			'x = wiggle(12, 1)[0];\n' + 'y = wiggle(3, 0.3, 3, 4)[1];\n' + '[x, y];',
			true
		);
		Utils.setEffectProp(transform, 'Scale Width', 101.5);
		Utils.setEffectProp(transform, 'Scale Height', 101.5);

		// app.endUndoGroup();
	}
}

// Create a "Damage" solid layer with 4K 4:3 settings and proper effects
namespace _Damage {
	export function applyEffects(layer: AVLayer) {
		// app.beginUndoGroup('Apply Damage FX');

		/* === FIRST FRACTAL NOISE === */

		const fractal1 = layer.effect.addProperty('ADBE Fractal Noise');
		Utils.setEffectProp(fractal1, 'Contrast', 1000);
		Utils.setEffectProp(fractal1, 'Brightness', -460);
		Utils.setEffectProp(fractal1, 'Uniform Scaling', false);
		Utils.setEffectProp(fractal1, 'Scale Width', 600);
		Utils.setEffectProp(fractal1, 'Scale Height', 1000);
		Utils.setEffectProp(fractal1, 'Scale Height', 'wiggle(24, 400)', true);
		Utils.setEffectProp(fractal1, 'Complexity', 7);
		Utils.setEffectProp(fractal1, 'Random Seed', 'time * 24', true);

		/* === EXTRACT === */

		const extract = layer.effect.addProperty('ADBE Extract');
		Utils.setEffectProp(extract, 'Black Point', 20);
		Utils.setEffectProp(extract, 'Black Softness', 20);

		/* === SECOND FRACTAL NOISE === */

		const fractal2 = layer.effect.addProperty('ADBE Fractal Noise');
		Utils.setEffectProp(fractal2, 'Contrast', 313);
		Utils.setEffectProp(fractal2, 'Brightness', 40);
		Utils.setEffectProp(fractal2, 'Scale', 50);
		Utils.setEffectProp(fractal2, 'Blending Mode', 9);

		/* === CC TONER === */

		const toner = layer.effect.addProperty('CC Toner');
		Utils.setEffectProp(toner, 'Midtones', [0.184, 0.765, 0.369]); // #2FC35E normalized

		// app.endUndoGroup();
	}
}

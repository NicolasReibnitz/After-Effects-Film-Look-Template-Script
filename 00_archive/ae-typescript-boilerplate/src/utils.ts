let setEffectPropEnabled = false;
const file = new File('~/Documents/list-of-set-properties.tsv');
const columns = [];
columns.push('Layer Name');
columns.push('Effect Name');
columns.push('Property Name');
columns.push('Default Property Value');
columns.push('New Property Value');
columns.push('Is Expression');
columns.push('Default Expression');
columns.push('New Expression');

if (file.open('w')) {
	file.writeln(columns.join('\t'));
	file.close();
}

namespace Utils {
	export function getPropertyTypeName(typeNum: number): string {
		switch (typeNum) {
			case PropertyType.PROPERTY:
				return 'Property';
			case PropertyType.INDEXED_GROUP:
				return 'Indexed Group';
			case PropertyType.NAMED_GROUP:
				return 'Named Group';
			default:
				return 'Unknown';
		}
	}

	export function logEffectProp(effect: _PropertyClasses, name: string, value: unknown, isExpression?: boolean) {
		const columns = [];
		const isEffect = effect.isEffect;
		const layerName = isEffect ? effect.parentProperty.parentProperty.name : effect.name || '';
		const effectName = isEffect ? effect.name : '';
		const prop = (effect as PropertyGroup).property(name) as Property;
		const defaultPropValue = prop.value;
		const propValue = isExpression ? '' : value;
		const propExpression = isExpression ? (value as string).replace(/\r?\n/g, ' ') : '';
		const defaultExpression = prop.expressionEnabled ? prop.expression.replace(/\r?\n/g, ' ') : '';

		columns.push(layerName); // Layer Name
		columns.push(effectName); // Effect Name
		columns.push(name); // Property Name
		columns.push(defaultPropValue); // Property Value Before
		columns.push(propValue); // Property Value After
		columns.push(isExpression ? 'true' : 'false'); // Property Expression
		columns.push(defaultExpression); // Default Expression
		columns.push(propExpression); // New Expression

		if (file.open('a')) {
			file.writeln(columns.join('\t'));
			file.close();
		}
	}

	export function cleanProject(compName: string) {
		const trash = [];
		if (file.open('a')) {
			for (let i = 1; i <= app.project.items.length; i++) {
				const itemName = app.project.item(i).name;
				// file.writeln(itemName);
				if (itemName === compName || itemName.substring(0, 2) === '# ') {
					trash.push(app.project.item(i));
					// app.project.item(i).remove();
					// file.writeln(itemName + ' removed from project.');
				}
				//  else {
				// 	file.writeln(itemName);
				// }
			}

			for (let j = 0; j < trash.length; j++) {
				file.writeln(trash[j].name);
				trash[j].remove();
			}
			file.close();
		}
	}

	export function enableSetEffectProp(enable: boolean) {
		setEffectPropEnabled = enable;
	}

	export function setEffectProp(
		effect: _PropertyClasses,
		name: string,
		value: unknown,
		isExpression?: boolean
	): void {
		if (!setEffectPropEnabled) return;
		const prop = (effect as PropertyGroup).property(name) as Property;

		if (prop && prop.setValue) {
			Utils.logEffectProp(effect, name, value, isExpression);
			try {
				if (isExpression) prop.expression = value as string;
				else prop.setValue(value);
			} catch (e: unknown) {
				showCatchError(effect as AVLayer, name, value, e);
			}
		} else {
			throw new Error("Effect property '" + name + "' not found or not settable.");
		}
	}

	export function showCatchError(effect: AVLayer, name: string, value: unknown, error: unknown): void {
		alert(
			effect.name +
				'\nSET EFFECT PROPERTY ERROR:' +
				'\n\nCannot set "' +
				name +
				'" to "' +
				value +
				'".\n\n[' +
				(error as Error).description +
				']'
		);
	}

	export function addSolid(
		comp: CompItem,
		name: string,
		color: ThreeDColorValue,
		width: number,
		height: number,
		blendMode: BlendingMode | null,
		isAdjustment?: boolean
	) {
		const solid = comp.layers.addSolid(color, '# ' + name, width, height, 1);
		if (blendMode) solid.blendingMode = blendMode;
		if (isAdjustment) solid.adjustmentLayer = true;
		return solid;
	}

	export function listLayerEffects(comp: CompItem) {
		const postfix = setEffectPropEnabled ? comp.name : comp.name + '-defaults';
		const file = new File('~/Documents/list-of-layer-effects-' + postfix + '.txt');
		const file2 = new File('~/Documents/list-of-layer-effects-' + postfix + '.tsv');
		const columns = [];

		let layersList = '';
		let currentProp = '';

		if (file2.open('w')) {
			columns.push('Layer Name');
			columns.push('Effect Index');
			columns.push('Effect Name');
			columns.push('Effect Match Name');
			columns.push('Property Index');
			columns.push('Property Name');
			columns.push('Property Match Name');
			columns.push('Property Value');
			columns.push('Property Value Type');
			columns.push('Property Type');
			columns.push('Property Expression');

			file2.writeln(columns.join('\t'));

			try {
				for (let layerIndex = 1; layerIndex <= comp.numLayers; layerIndex++) {
					const layer = comp.layer(layerIndex);
					const effects = layer.property('Effects') as PropertyGroup;
					let effectsList = '';
					layersList += layerIndex + '. ' + layer.name + '\n';

					for (let effectIndex = 1; effectIndex <= effects.numProperties; effectIndex++) {
						const effect = effects.property(effectIndex) as PropertyGroup;

						effectsList += '	' + effectIndex + '. ' + effect.name + ' (' + effect.matchName + ')\n';

						let propsList = '';

						for (let propertyIndex = 1; propertyIndex <= effect.numProperties; propertyIndex++) {
							const prop = effect.property(propertyIndex) as Property;
							const propHasValues =
								prop.propertyValueType !== PropertyValueType.NO_VALUE &&
								prop.propertyValueType !== PropertyValueType.CUSTOM_VALUE;
							const propValue = propHasValues ? prop.value : '';
							currentProp = layer.name + '>' + effect.matchName + '>' + prop.matchName;

							columns.length = 0;
							columns.push(layer.name);
							columns.push(effectIndex.toString());
							columns.push(effect.name);
							columns.push(effect.matchName);
							columns.push(propertyIndex.toString());
							columns.push(prop.name);
							columns.push(prop.matchName);
							columns.push(propValue?.toString());
							columns.push(typeof propValue);
							columns.push(Utils.getPropertyTypeName(prop.propertyType));
							columns.push(prop.expressionEnabled ? prop.expression.replace(/\r?\n/g, ' ') : '');

							const result =
								'		' +
								layer.name +
								'.' +
								effect.matchName +
								'.' +
								propertyIndex.toString() +
								'. ' +
								prop.name +
								' (' +
								prop.matchName +
								'): ' +
								propValue?.toString() +
								' (' +
								typeof propValue +
								') [' +
								prop.propertyType +
								']\n';

							file2.writeln(columns.join('\t'));

							propsList += result;
						}

						effectsList += propsList;
					}

					layersList += effectsList + '\n';
				}
			} catch (e) {
				file2.close();
				alert((e as Error).description + '\n' + currentProp);
			}
			file2.close();
		} else {
			alert('Could not open file for writing.' + '\n' + file2.fullName);
		}

		if (file.open('w')) {
			file.writeln(comp.name + ':\n\n' + layersList + '\n');
			file.close();
		} else {
			alert('Could not open file for writing.' + '\n' + file.fullName);
		}
	}
}

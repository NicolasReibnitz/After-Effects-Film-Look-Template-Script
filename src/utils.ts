let setEffectPropEnabled = false;

namespace Utils {
	export function initListOfSetPropertiesFile(): void {
		const file = new File('~/Documents/list-of-set-properties.tsv');
		file.encoding = 'UTF8';

		const columns = [];
		columns.push('Layer Name');
		columns.push('Effect Name');
		columns.push('Property Name');
		columns.push('Default Property Value');
		columns.push('New Property Value');
		columns.push('Is Expression');

		if (file.open('w')) {
			file.writeln(columns.join('\t'));
			file.close();
		}
	}

	export function getCompName(style: string) {
		return 'Generated_' + style.replace(' ', '_') + '_Comp';
	}

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
		const file = new File('~/Documents/list-of-set-properties.tsv');
		file.encoding = 'UTF8';

		const columns = [];
		let defaultPropValue;

		const isEffect = effect.isEffect;
		const layerName = isEffect
			? effect.parentProperty.parentProperty.name.replace(/^# /g, '')
			: effect.name.replace(/^# /g, '') || '';
		const effectName = isEffect ? effect.name : '';
		const prop = (effect as PropertyGroup).property(name) as Property;
		const propValue = isExpression ? (value as string).replace(/(\r\n|\r|\n)/g, ' ') : value;

		if (isExpression) {
			defaultPropValue = prop.expressionEnabled ? prop.expression.replace(/(\r\n|\r|\n)/g, ' ') : '';
		} else {
			defaultPropValue = prop.value;
		}

		columns.push(layerName); // Layer Name
		columns.push(effectName); // Effect Name
		columns.push(name); // Property Name
		columns.push(defaultPropValue); // Property Value Before
		columns.push(propValue); // Property Value After
		columns.push(isExpression ? 'true' : 'false'); // Property Expression

		if (file.open('a')) {
			file.writeln(columns.join('\t'));
			file.close();
		}
	}

	export function listLayerEffectsOfAllComps() {
		for (let i = 1; i <= app.project.items.length; i++) {
			if (app.project.item(i).typeName === 'Composition') {
				Utils.listLayerEffects(app.project.item(i) as CompItem);
			}
		}
	}

	export function cleanProject() {
		const trash = [];

		for (let i = 1; i <= app.project.items.length; i++) {
			const itemName = app.project.item(i).name;
			if (itemName.indexOf('Generated_') === 0 || itemName.indexOf('# ') === 0) {
				trash.push(app.project.item(i));
			}
		}

		for (let j = 0; j < trash.length; j++) {
			trash[j].remove();
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
		file.encoding = 'UTF8';
		file2.encoding = 'UTF8';
		file.lineFeed = 'Unix';
		file2.lineFeed = 'Unix';

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
					layersList += layerIndex + '. ' + layer.name.replace(/^# /g, '') + '\n';

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
							columns.push(layer.name.replace(/^# /g, ''));
							columns.push(effectIndex.toString());
							columns.push(effect.name);
							columns.push(effect.matchName);
							columns.push(propertyIndex.toString());
							columns.push(prop.name);
							columns.push(prop.matchName);
							columns.push(propValue?.toString());
							columns.push(typeof propValue);
							columns.push(Utils.getPropertyTypeName(prop.propertyType));
							columns.push(prop.expressionEnabled ? prop.expression.replace(/(\r\n|\r|\n)/g, ' ') : '');

							const result =
								'		' +
								layer.name.replace(/^# /g, '') +
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
								'] ' +
								(prop.expressionEnabled ? prop.expression.replace(/(\r\n|\r|\n)/g, ' ') : '') +
								'\n';

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

	export function importPsdToComp() {
		const comp = app.project.activeItem;
		if (!(comp instanceof CompItem)) {
			alert('Please select a composition.');
			return;
		}

		// 1. Choose a PSD file
		const psdFile = File.openDialog('Select a PSD file to import', '*.psd', false);

		if (!psdFile || !(psdFile instanceof File)) {
			alert('Please select a single PSD file.');
			return;
		}

		app.beginUndoGroup('Import PSD and Add as First Layer');

		// 2. Import the file into the project
		const importOptions = new ImportOptions(psdFile);

		if (!importOptions.canImportAs(ImportAsType.FOOTAGE)) {
			alert('This PSD cannot be imported as footage.');
			return;
		}
		importOptions.importAs = ImportAsType.FOOTAGE;
		const imported = app.project.importFile(importOptions) as FootageItem;

		// 3. Add it as the first layer in the comp
		const newLayer = comp.layers.add(imported);
		newLayer.moveToEnd(); // This makes it layer 1

		app.endUndoGroup();
	}
}

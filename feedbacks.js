module.exports = function (instance) {
	instance.log('info', 'Registering feedback definitions');
	try {
	  return {
		powerOnState: {
		  type: 'advanced',
		  name: 'Power On Indicator',
		  description: 'Show checkmark and color when amp is on',
		  options: [],
		  callback: () => {
			if (instance.state.power === 'ON') {
			  return { text: 'Power On ✓', bgcolor: '#228B22' }; // Forest green
			}
			return { text: 'Power On', bgcolor: '#000000', color: '#808080' }; // Black + grey
		  },
		},
		powerOffState: {
		  type: 'advanced',
		  name: 'Power Off Indicator',
		  description: 'Show checkmark and color when amp is off',
		  options: [],
		  callback: () => {
			if (instance.state.power === 'OFF') {
			  return { text: 'Power Off ✓', bgcolor: '#8B0000' }; // Deep red
			}
			return { text: 'Power Off', bgcolor: '#000000', color: '#808080' }; // Black + grey
		  },
		},
		inputSensitivity: {
		  type: 'advanced',
		  name: 'Input Sensitivity Display',
		  description: 'Updates button text with current sensitivity and stereo/mono status',
		  options: [
			{ type: 'number', label: 'Input IID', id: 'inputId', default: 100, min: 100, max: 103 },
		  ],
		  callback: ({ options }) => {
			const name = instance.state.inputNames[options.inputId] || `Input ${options.inputId}`;
			const sens = instance.state.inputSensitivities[options.inputId] || 'Unknown';
			let stereoStatus = '';
			if (options.inputId === 100 || options.inputId === 102) {
			  stereoStatus = instance.state.stereoPairs[options.inputId] === true ? ' (Stereo)' : ' (Mono)';
			} else if (options.inputId === 101) {
			  stereoStatus = instance.state.stereoPairs[100] === true ? ' (Stereo)' : ' (Mono)';
			} else if (options.inputId === 103) {
			  stereoStatus = instance.state.stereoPairs[102] === true ? ' (Stereo)' : ' (Mono)';
			}
			return { text: `${name} Sens: ${sens}${stereoStatus}` };
		  },
		},
		inputTrim: {
		  type: 'advanced',
		  name: 'Input Trim Display',
		  description: 'Updates button text with current trim and stereo/mono status',
		  options: [
			{ type: 'number', label: 'Input IID', id: 'inputId', default: 100, min: 100, max: 400 },
		  ],
		  callback: ({ options }) => {
			const name = instance.state.inputNames[options.inputId] || `Input ${options.inputId}`;
			const trim = instance.state.inputGains[options.inputId] !== undefined ? instance.state.inputGains[options.inputId] : 'Unknown';
			let stereoStatus = '';
			if (options.inputId === 100 || options.inputId === 102 || options.inputId === 200) {
			  stereoStatus = instance.state.stereoPairs[options.inputId] === true ? ' (Stereo)' : ' (Mono)';
			} else if (options.inputId === 101) {
			  stereoStatus = instance.state.stereoPairs[100] === true ? ' (Stereo)' : ' (Mono)';
			} else if (options.inputId === 103) {
			  stereoStatus = instance.state.stereoPairs[102] === true ? ' (Stereo)' : ' (Mono)';
			} else if (options.inputId === 201) {
			  stereoStatus = instance.state.stereoPairs[200] === true ? ' (Stereo)' : ' (Mono)';
			}
			return { text: `${name} Trim: ${trim}${stereoStatus}` };
		  },
		},
		generatorGain: {
		  type: 'advanced',
		  name: 'Generator Gain Display',
		  description: 'Updates button text with current generator gain',
		  options: [],
		  callback: () => {
			const name = instance.state.inputNames[400] || 'Generator';
			const gain = instance.state.generatorGain !== null ? instance.state.generatorGain : 'Unknown';
			return { text: `${name} Gain: ${gain}` };
		  },
		},
		zoneSzoneStatus: {
		  type: 'advanced',
		  name: 'Zone Status Display',
		  description: 'Updates button text with zone status',
		  options: [
			{ type: 'number', label: 'Zone ID', id: 'zoneId', default: 1, min: 1, max: 4 },
		  ],
		  callback: ({ options }) => {
			const zoneName = instance.state.zoneNames?.[options.zoneId] || `Zone ${options.zoneId}`;
			const isStereo = instance.state.zoneLinks[options.zoneId] === true;
			const inputId = instance.state.zoneInputs[options.zoneId];
			const inputName = instance.state.inputNames[inputId] || (inputId ? `Input ${inputId}` : 'None');
			const gain = instance.state.zoneGains?.[options.zoneId] ?? 'Unknown';
			return { text: `${zoneName}: ${isStereo ? 'Stereo' : 'Mono'} - ${inputName} - ${gain}dB` };
		  },
		},
	  };
	} catch (err) {
	  instance.log('error', `Feedback registration failed: ${err.message}`);
	  return {};
	}
  };
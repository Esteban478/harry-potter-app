import React from 'react';
import { Autocomplete } from './Autocomplete';

interface WandSelectorProps {
  wandCore: string | null;
  wandWood: string | null;
  wandLength: number | null;
  onWandChange: (field: 'wandCore' | 'wandWood' | 'wandLength', value: string | number | null) => void;
}

const WandSelector: React.FC<WandSelectorProps> = ({ wandCore, wandWood, wandLength, onWandChange }) => {
  // Placeholder arrays for core and wood types
  const coreTypes = ['Phoenix Feather', 'Dragon Heartstring', 'Unicorn Hair'];
  const woodTypes = ['Oak', 'Holly', 'Maple', 'Elm'];

  return (
    <div className="wand-selector">
      <h3>Wand</h3>
      <Autocomplete
        options={coreTypes.map(core => ({ name: core, id: core }))}
        labelKey="name"
        valueKey="id"
        onChange={(value) => onWandChange('wandCore', value?.name || null)}
        placeholder="Select wand core"
        value={wandCore ? { name: wandCore, id: wandCore } : null}
      />
      <Autocomplete
        options={woodTypes.map(wood => ({ name: wood, id: wood }))}
        labelKey="name"
        valueKey="id"
        onChange={(value) => onWandChange('wandWood', value?.name || null)}
        placeholder="Select wand wood"
        value={wandWood ? { name: wandWood, id: wandWood } : null}
      />
      <div>
        <label htmlFor="wandLength">Wand Length: {wandLength || 0} inches</label>
        <input
          type="range"
          id="wandLength"
          min="6"
          max="20"
          step="0.5"
          value={wandLength || 0}
          onChange={(e) => onWandChange('wandLength', parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

export default WandSelector;
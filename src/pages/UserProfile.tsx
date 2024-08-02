import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUserContext';
import { useData } from '../hooks/useDataContext';
import { Autocomplete } from '../components/Autocomplete';
import { Select } from '../components/Select';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { UserProfile } from '../types';
import { getOrdinalSuffix } from '../utils/getOrdinalSuffix';
import '../styles/General.css';
import '../styles/UserProfile.css';

const UserProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile } = useUser();
  const { characters, spells, options, loading: dataLoading, error: dataError } = useData();
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [avatarSeed, setAvatarSeed] = useState('');
  const [avatarSvg, setAvatarSvg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      setEditedProfile(userProfile);
      setAvatarSeed(userProfile.profilePicture || '');
      setLoading(false);
    }
  }, [userProfile]);

  useEffect(() => {
    if (avatarSeed) {
      const avatar = createAvatar(adventurer, { seed: avatarSeed });
      setAvatarSvg(avatar.toString());
    }
  }, [avatarSeed]);

  const handleInputChange = (name: keyof UserProfile, value: unknown) => {
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({ ...editedProfile, profilePicture: avatarSeed });
    alert('Profile updated successfully!');
  };

  const generateNewAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
  };

  if (loading || dataLoading) return <div>Loading...</div>;
  if (dataError) return <div>Error: {dataError}</div>;

  return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <div className="avatar-section">
        <div dangerouslySetInnerHTML={{ __html: avatarSvg }} />
        <button onClick={generateNewAvatar}>Generate New Avatar</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickname">Nickname:</label>
          <input
            type="text"
            id="nickname"
            value={editedProfile.nickname || ''}
            onChange={(e) => handleInputChange('nickname', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="favoriteCharacter">Favorite Character:</label>
          <Autocomplete
            options={characters.map(char => ({ name: char.name, id: char.id }))}
            labelKey="name"
            valueKey="id"
            onChange={(value) => handleInputChange('favoriteCharacter', value?.name)}
            placeholder="Select a character"
            value={editedProfile.favoriteCharacter ? { name: editedProfile.favoriteCharacter, id: editedProfile.favoriteCharacter } : null}
          />
        </div>
        <div>
          <label htmlFor="favoriteSpell">Favorite Spell:</label>
          <Autocomplete
            options={spells.map(spell => ({ name: spell.name, id: spell.id }))}
            labelKey="name"
            valueKey="id"
            onChange={(value) => handleInputChange('favoriteSpell', value?.name)}
            placeholder="Select a spell"
            value={editedProfile.favoriteSpell ? { name: editedProfile.favoriteSpell, id: editedProfile.favoriteSpell } : null}
          />
        </div>
        <div>
          <label htmlFor="wandCore">Wand Core:</label>
          <Autocomplete
            options={options?.wandCores.map(core => ({ name: core, id: core })) || []}
            labelKey="name"
            valueKey="id"
            onChange={(value) => handleInputChange('wandCore', value?.name)}
            placeholder="Select a wand core"
            value={editedProfile.wandCore ? { name: editedProfile.wandCore, id: editedProfile.wandCore } : null}
          />
        </div>
        <div>
          <label htmlFor="wandWood">Wand Wood:</label>
          <Autocomplete
            options={options?.wandWoods.map(wood => ({ name: wood, id: wood })) || []}
            labelKey="name"
            valueKey="id"
            onChange={(value) => handleInputChange('wandWood', value?.name)}
            placeholder="Select a wand wood"
            value={editedProfile.wandWood ? { name: editedProfile.wandWood, id: editedProfile.wandWood } : null}
          />
        </div>
        <div>
          <label htmlFor="wandLength">Wand Length:</label>
          <input
            type="range"
            id="wandLength"
            min="6"
            max="15"
            step="0.5"
            value={editedProfile.wandLength || 6}
            onChange={(e) => handleInputChange('wandLength', parseFloat(e.target.value))}
          />
          <span>{editedProfile.wandLength || 6} inches</span>
        </div>
        <div>
          <label htmlFor="patronus">Patronus:</label>
          <Autocomplete
            options={options?.patronuses.map(patronus => ({ name: patronus, id: patronus })) || []}
            labelKey="name"
            valueKey="id"
            onChange={(value) => handleInputChange('patronus', value?.name)}
            placeholder="Select a patronus"
            value={editedProfile.patronus ? { name: editedProfile.patronus, id: editedProfile.patronus } : null}
          />
        </div>
        <div>
          <label htmlFor="quidditchPosition">Quidditch Position:</label>
          <Select
            options={options?.quidditchPositions.map(position => ({ name: position, value: position })) || []}
            labelKey="name"
            valueKey="value"
            onChange={(value) => handleInputChange('quidditchPosition', value?.value)}
            placeholder="Select a position"
            value={editedProfile.quidditchPosition ? { name: editedProfile.quidditchPosition, value: editedProfile.quidditchPosition } : null}
          />
        </div>
        <div>
          <label htmlFor="hogwartsYear">Hogwarts Year:</label>
          <Select
            options={options?.hogwartsYears.map(year => ({ name: `${year}${getOrdinalSuffix(year)} Year`, value: year })) || []}
            labelKey="name"
            valueKey="value"
            onChange={(value) => handleInputChange('hogwartsYear', value?.value)}
            placeholder="Select a year"
            value={editedProfile.hogwartsYear ? { name: `${editedProfile.hogwartsYear}${getOrdinalSuffix(editedProfile.hogwartsYear)} Year`, value: editedProfile.hogwartsYear } : null}
          />
        </div>
        <div>
          <label htmlFor="biography">Biography:</label>
          <textarea
            id="biography"
            value={editedProfile.biography || ''}
            onChange={(e) => handleInputChange('biography', e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfilePage;
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../hooks/useUserContext';
import { useData } from '../hooks/useDataContext';
import { Autocomplete } from '../components/Autocomplete';
import { Select } from '../components/Select';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { UserProfile } from '../types';
import { getOrdinalSuffix } from '../utils/getOrdinalSuffix';
import { uploadImage } from '../utils/imageUpload';
import '../styles/General.css';
import '../styles/UserProfile.css';

const UserProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile } = useUser();
  const { characters, spells, options, loading: dataLoading, error: dataError } = useData();
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [avatarSeed, setAvatarSeed] = useState('');
  const [avatarSvg, setAvatarSvg] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setAvatarSvg(avatar.toDataUri());
    }
  }, [avatarSeed]);

  const handleInputChange = (name: keyof UserProfile, value: unknown) => {
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateNewAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
    setImagePreview(null);
    setUploadedImage(null);
    setEditedProfile(prev => ({ ...prev, profilePicture: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = editedProfile.profilePicture;
    if (uploadedImage && userProfile) {
      imageUrl = await uploadImage(uploadedImage, userProfile.uid);
    } else if (avatarSvg) {
      imageUrl = avatarSvg;
    }
    await updateUserProfile({ ...editedProfile, profilePicture: imageUrl });
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Reset to original profile when cancelling edit
      setEditedProfile(userProfile || {});
      setAvatarSeed(userProfile?.profilePicture || '');
      setImagePreview(null);
      setUploadedImage(null);
    }
  };

const renderProfileImage = () => {
  if (imagePreview) {
    return <img src={imagePreview} alt="Profile preview" className="profile-image" />;
  } else if (editedProfile.profilePicture) {
    return <img src={editedProfile.profilePicture} alt="Profile" className="profile-image" />;
  } else if (avatarSvg) {
    return <img src={avatarSvg} alt="Generated avatar" className="profile-image" />;
  } else {
    return <div>No image available</div>;
  }
};

  if (loading || dataLoading) return <div className="page-container">Loading...</div>;
  if (dataError) return <div className="page-container">Error: {dataError}</div>;

  return (
    <div className="page-container user-profile">
      <h1>User Profile</h1>
      <button onClick={toggleEditMode}>
        {editMode ? 'Cancel Edit' : 'Edit Profile'}
      </button>
      <div className="avatar-section">
        {renderProfileImage()}
        {editMode && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <button onClick={() => fileInputRef.current?.click()}>Upload Image</button>
            <button onClick={generateNewAvatar}>Generate New Avatar</button>
          </>
        )}
      </div>
      {editMode ? (
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
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Nickname:</strong> {userProfile?.nickname || 'Not set'}</p>
          <p><strong>Favorite Character:</strong> {userProfile?.favoriteCharacter || 'Not set'}</p>
          <p><strong>Favorite Spell:</strong> {userProfile?.favoriteSpell || 'Not set'}</p>
          <p><strong>Wand Core:</strong> {userProfile?.wandCore || 'Not set'}</p>
          <p><strong>Wand Wood:</strong> {userProfile?.wandWood || 'Not set'}</p>
          <p><strong>Wand Length:</strong> {userProfile?.wandLength ? `${userProfile?.wandLength} inches` : 'Not set'}</p>
          <p><strong>Patronus:</strong> {userProfile?.patronus || 'Not set'}</p>
          <p><strong>Quidditch Position:</strong> {userProfile?.quidditchPosition || 'Not set'}</p>
          <p><strong>Hogwarts Year:</strong> {userProfile?.hogwartsYear ? `${userProfile?.hogwartsYear}${getOrdinalSuffix(userProfile?.hogwartsYear)} Year` : 'Not set'}</p>
          <p><strong>Biography:</strong> {userProfile?.biography || 'Not set'}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../hooks/useUserContext';
import { useData } from '../hooks/useDataContext';
import { Autocomplete } from '../components/Autocomplete';
import { Select } from '../components/Select';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { UserProfile } from '../types';
import { getOrdinalSuffix } from '../utils/getOrdinalSuffix';
import { MAX_DIMENSION, MAX_FILE_SIZE, MIN_DIMENSION, uploadImage, validateFile } from '../utils/imageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPencil} from '@fortawesome/free-solid-svg-icons';
import '../styles/General.css';
import '../styles/UserProfile.css';

const UserProfilePage: React.FC = () => {
  const { userProfile, updateUserProfile } = useUser();
  const { characters, potions, spells, options, loading: dataLoading, error: dataError } = useData();
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [avatarSvg, setAvatarSvg] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setEditedProfile(userProfile);
      setLoading(false);
    }
  }, [userProfile]);

  const handleInputChange = (name: keyof UserProfile, value: unknown) => {
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const clearError = () => {
    setError(null);
  };

  const generateNewAvatar = () => {
    const avatarSeed = Math.random().toString(36).substring(9);
    const avatar = createAvatar(adventurer, { seed: avatarSeed });
    setAvatarSvg(avatar.toDataUri());
    setImagePreview(null);
    setUploadedImage(null);
    setEditedProfile(prev => ({ ...prev, profilePicture: null }));
    clearError();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null); // Clear any previous errors
      const isValid = await validateFile(file);
      if (isValid) {
        setUploadedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError(`Invalid file. Please ensure your image is a JPG or PNG file, between ${MIN_DIMENSION}x${MIN_DIMENSION} and ${MAX_DIMENSION}x${MAX_DIMENSION} pixels, and no larger than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    let imageUrl = editedProfile.profilePicture;
    if (uploadedImage && userProfile) {
      try {
        imageUrl = await uploadImage(uploadedImage, userProfile.uid);
      } catch (error) {
        setError('Failed to upload image. Please try again.');
        return;
      }
    } else if (avatarSvg) {
      imageUrl = avatarSvg;
    }
    try {
      await updateUserProfile({ ...editedProfile, profilePicture: imageUrl });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

const toggleEditMode = () => {
  setEditMode(!editMode);
  if (editMode) {
    // Reset to original profile when cancelling edit
    setEditedProfile(userProfile || {});
    setImagePreview(null);
    setUploadedImage(null);
    clearError(); // Clear any error messages
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

  if (loading || dataLoading) return <div className="user-profile"><LoadingSpinner/></div>;
  if (dataError) return <div className="user-profile"><ErrorMessage message={dataError}/></div>;

  return (
    <div className="user-profile">
      <div className="user-profile-heading">
        <h1>
          User Profile
        </h1>
        <FontAwesomeIcon
          onClick={toggleEditMode}
          icon={editMode ? faTimes : faPencil}
        />
      </div>
      <div className="avatar-section">
        {renderProfileImage()}
        {editMode && (
          <>
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <div className="profile-image-buttons">
              <button onClick={() => fileInputRef.current?.click()}>Upload Image</button>
              <button onClick={generateNewAvatar}>Generate Avatar</button>
            </div>
          </>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
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
          <label htmlFor="favoritePotion">Favorite Potion:</label>
          <Autocomplete
            options={potions.map(potion => ({ name: potion.attributes.name, id: potion.id }))}
            labelKey="name"
            valueKey="id"
            onChange={(value) => handleInputChange('favoritePotion', value?.name)}
            placeholder="Select a potion"
            value={editedProfile.favoritePotion ? { name: editedProfile.favoritePotion, id: editedProfile.favoritePotion } : null}
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
          <p><strong>Favorite Potion:</strong> {userProfile?.favoritePotion || 'Not set'}</p>
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
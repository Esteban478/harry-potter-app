import { useState, useEffect, useRef } from 'react';
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
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 1000;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

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
  const [error, setError] = useState<string | null>(null);

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

  const clearError = () => {
    setError(null);
  };

  const generateNewAvatar = () => {
    const newSeed = Math.random().toString(36).substring(9);
    setAvatarSeed(newSeed);
    setImagePreview(null);
    setUploadedImage(null);
    setEditedProfile(prev => ({ ...prev, profilePicture: null }));
    clearError();
  };

  const checkMagicNumbers = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = function(e) {
      if (e.target?.readyState === FileReader.DONE) {
        const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        // Check for JPEG or PNG headers
        const isValid = header.startsWith('ffd8') || header === '89504e47';
        resolve(isValid);
      }
    };
    reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };

  const validateFile = async (file: File): Promise<boolean> => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
      console.log('Invalid file type');
      return false;
    }

    // Check magic numbers
    const isValidMagicNumber = await checkMagicNumbers(file);
    if (!isValidMagicNumber) {
      console.log('Invalid file content');
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.log('File too large');
      return false;
    }

    // Check image dimensions
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const isValidDimensions = 
            img.width >= MIN_DIMENSION &&
            img.height >= MIN_DIMENSION &&
            img.width <= MAX_DIMENSION &&
            img.height <= MAX_DIMENSION;
          
          if (!isValidDimensions) {
            console.log('Invalid image dimensions');
          }
          
          resolve(isValidDimensions);
        };
      };
    });
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
    setAvatarSeed(userProfile?.profilePicture || '');
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
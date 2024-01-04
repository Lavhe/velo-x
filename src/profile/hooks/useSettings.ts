import {useCallback, useState} from 'react';
import {useUserContext} from 'velo-x/auth';
import {useNavigation} from '@react-navigation/native';
import {Type as ProfileType, schema} from '../schema';
import {schema as userSchema} from 'velo-x/auth';
import {
  Collections,
  Filter,
  useCreateOrUpdateDocument,
  useDocuments,
} from 'velo-x/firebase';

export enum Status {
  SUCCESS,
  ERROR,
}

const DEFAULT_PROFILE: () => ProfileType = () => schema.parse({});

export function useSettings() {
  const {navigate, goBack} = useNavigation();
  const {currentProfile, currentUser, setCurrentUser} = useUserContext();
  const {
    data: profiles,
    loading: docsLoading,
    error: docsError,
  } = useDocuments(
    schema,
    Collections.PROFILES,
    Filter('user', '==', currentUser?.id),
  );

  console.log({id: currentUser?.id});
  const {addDocument, updateDocument} = useCreateOrUpdateDocument(
    schema,
    Collections.PROFILES,
  );
  const {updateDocument: updateUserDocument} = useCreateOrUpdateDocument(
    userSchema,
    Collections.USERS,
  );
  const [loading, setLoading] = useState(docsLoading);
  const [error, setError] = useState(docsError);

  const [profile, setProfile] = useState<ProfileType>({
    ...DEFAULT_PROFILE(),
    ...(currentProfile || {}),
  });

  const saveChanges = async () => {
    setLoading(true);
    setError('');

    try {
      const profileIndex = profiles?.findIndex(p => p.id === profile?.id) ?? -1;
      const dbProfile = {
        ...profile,
      };

      let newProfileId = profile.id ?? '';
      if (profileIndex >= 0 && profile.id) {
        await updateDocument(profile.id, dbProfile);
      } else {
        newProfileId = await addDocument(dbProfile);
      }

      await updateUserDocument(currentUser?.id ?? '', {
        selectedProfile: newProfileId,
      });

      setCurrentUser(p => ({
        ...p!,
        selectedProfile: newProfileId,
      }));
    } catch (err) {
      setError((err as any).message);
    } finally {
      setLoading(false);
    }

    return goBack();
  };

  const selectProfile = useCallback(
    async (id?: string) => {
      const selected = profiles?.find(p => p.id === id);

      if (selected && id) {
        setProfile(selected);

        await updateUserDocument(currentUser?.id ?? '', {
          selectedProfile: id,
        });

        setCurrentUser(p => ({
          ...p!,
          selectedProfile: id,
        }));
      } else {
        setProfile(DEFAULT_PROFILE());
      }
    },
    [profiles],
  );

  return {
    loading,
    error,
    saveChanges,
    profile,
    setProfile,
    profiles,
    selectedProfileId: profile.id,
    selectProfile,
  };
}

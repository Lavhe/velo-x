import {schema} from 'velo-x/drive';
import {
  Collections,
  Filter,
  useCreateOrUpdateDocument,
  useDocuments,
} from 'velo-x/firebase';

export function useRuns({profileId}: {profileId: string}) {
  console.log({profileId});
  const {
    data: runs,
    loading: docsLoading,
    error: docsError,
  } = useDocuments(
    schema,
    Collections.RUNS,
    Filter('profile.id', '==', profileId),
  );

  const {deleteDocument, loading, error} = useCreateOrUpdateDocument(
    schema,
    Collections.RUNS,
  );

  return {
    loading: docsLoading || loading,
    error: docsError || error,
    deleteRun: deleteDocument,
    runs,
  };
}

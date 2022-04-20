import { useAuthState } from '../auth';
import { useOwnedTagDocs, addTag, removeTag } from '../data';

export interface TagInput {
  label: string;
}

export interface Tag extends TagInput {
  userId: string;
  created: Date;
}

export interface TagDocument extends Tag {
  id: string;
}

export interface Tags {
  docs: TagDocument[];
  add: (tag: TagInput) => Promise<string | undefined>;
  remove: (tagId: string) => Promise<void> | undefined;
  loading: boolean;
  errorMessage: string;
}

export const useTags = (): Tags => {
  const [user] = useAuthState();
  const [tagDocs, loading, errorMessage] = useOwnedTagDocs();

  const add = async (tag: TagInput) => {
    if (!user) return;

    return addTag({
      ...tag,
      userId: user?.uid,
      created: new Date(),
    });
  };

  const remove = (itemId: string) => {
    return removeTag(itemId);
  };

  const tagDocsSortedByCreated = tagDocs.sort(
    (a, b) => b.created?.getTime() || 0 - a.created?.getTime() || 0
  );

  return {
    docs: tagDocsSortedByCreated,
    add,
    remove,
    loading,
    errorMessage,
  };
};

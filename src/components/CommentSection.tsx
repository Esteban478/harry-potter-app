import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUserContext';
import { addComment, getComments } from '../services/api';
import Comment from './Comment';
import NoComments from './NoComments';
import { Comment as CommentType } from '../types';
import '../styles/CommentSection.css';

interface CommentSectionProps {
  characterId?: string;
  potionId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ characterId, potionId }) => {
  const { userProfile } = useUser();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [characterId, potionId]);

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for:', characterId ? `character ${characterId}` : `potion ${potionId}`);
      const fetchedComments = await getComments(characterId, potionId);
      console.log('Fetched comments:', fetchedComments);
      setComments(fetchedComments);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      await addComment(newComment, userProfile.uid, characterId, potionId);
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      {userProfile && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>
      )}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onUpdate={fetchComments}
          />
        ))
      ) : (
        <NoComments />
      )}
    </div>
  );
};

export default CommentSection;
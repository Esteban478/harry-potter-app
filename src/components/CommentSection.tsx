import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUserContext';
import { addComment, getComments } from '../services/api';
import Comment from './Comment';
import { Comment as CommentType } from '../types';
import NoComments from './NoComments';

interface CommentSectionProps {
  characterId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ characterId }) => {
  const { userProfile } = useUser();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('CommentSection mounted, characterId:', characterId);
    fetchComments();
  }, [characterId]);

  const fetchComments = async () => {
    console.log('Fetching comments...');
    try {
      const fetchedComments = await getComments(characterId);
      console.log('Fetched comments:', fetchedComments);
      setComments(fetchedComments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
      setLoading(false);
    }
  };

  console.log('Render - loading:', loading, 'error:', error, 'comments:', comments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    try {
      await addComment(
        characterId,
        userProfile.uid,
        userProfile.nickname || 'Anonymous',
        newComment,
        userProfile.profilePicture || '../public/placeholder-wizard.png'
      );
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
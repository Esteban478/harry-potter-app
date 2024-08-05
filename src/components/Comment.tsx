import React, { useState } from 'react';
import { useUser } from '../hooks/useUserContext';
import { updateComment, deleteComment } from '../services/api';
import { Comment as CommentType } from '../types';
import '../styles/Comments.css';

interface CommentProps {
  comment: CommentType;
  onUpdate: () => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onUpdate }) => {
  const { userProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = async () => {
    await updateComment(comment.id, editedContent);
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(comment.id);
      onUpdate();
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <img 
          src={comment.userProfilePicture || '/placeholder-wizard.png'} 
          alt={`${comment.userNickname}'s avatar`} 
          className="comment-avatar"
        />
        <div className="comment-info">
          <strong>{comment.userNickname}</strong>
          <span>{comment.createdAt.toDate().toLocaleString()}</span>
        </div>
      </div>
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p>{comment.content}</p>
      )}
      {userProfile?.uid === comment.userId && (
        <div className="comment-actions">
          {isEditing ? (
            <>
              <button onClick={handleEdit}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
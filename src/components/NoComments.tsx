import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUserContext';

const NoComments: React.FC = () => {
  const { userProfile } = useUser();

  return (
    <div className="no-comments">
      <p>No comments yet.</p>
      {!userProfile ? (
        <p>
          <Link to="/auth">Sign up or log in</Link> to be the first to comment!
        </p>
      ) : (
        <p>Be the first to comment!</p>
      )}
    </div>
  );
};

export default NoComments;
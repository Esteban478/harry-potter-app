interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="error-message" role="alert">
      <p>Error: {message}</p>
    </div>
  );
};

export default ErrorMessage;
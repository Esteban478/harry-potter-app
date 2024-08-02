import '../styles/PasswordStrengthMeter.css';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(password);

  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'yellow';
      case 4:
        return 'lightgreen';
      case 5:
        return 'green';
      default:
        return 'gray';
    }
  };

  const getLabel = () => {
    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return '';
    }
  };

  if (password.length === 0) {
    return null;  // Return null when password is empty
  }

  return (
    <div className="password-strength-meter">
      <div className="strength-meter" style={{ width: `${strength * 20}%`, backgroundColor: getColor() }}></div>
      <p style={{ color: getColor() }}>{getLabel()}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
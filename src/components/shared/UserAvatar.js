// src/components/UserAvatar.js
import { Avatar } from 'primereact/avatar';

// Función para validar si existe una imagen válida
const isValidImage = (image) => {
  return image && image !== 'null' && image !== 'src' && image.trim() !== '';
};

// Función para obtener las iniciales del usuario
const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) return 'U'; // Valor por defecto
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Función para asignar un color basado en el nombre
const getRandomColor = (firstName) => {
  const colors = [
    '#e74c3c',
    '#3498db',
    '#2ecc71',
    '#f1c40f',
    '#9b59b6',
    '#1abc9c',
    '#34495e',
  ];
  if (!firstName) return colors[0];
  return colors[firstName.charCodeAt(0) % colors.length];
};

const UserAvatar = ({
  image,
  firstName,
  lastName,
  size = 'large',
  shape = 'circle',
  style = {},
  className = '',
}) => {
  return isValidImage(image) ? (
    <Avatar
      image={image}
      shape={shape}
      size={size}
      className='shadow-1'
      style={style}
    />
  ) : (
    <Avatar
      label={getInitials(firstName, lastName)}
      shape={shape}
      size={size}
      className={className}
      style={{
        backgroundColor: getRandomColor(firstName),
        color: 'white',
        fontWeight: 'bold',
        ...style,
      }}
    />
  );
};

export default UserAvatar;

import { useState } from "react";

const Avatar = ({ user, size = "md", className = "" }) => {
  const [imageError, setImageError] = useState(false);
  
  // Get first letter of the name
  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Generate a consistent color based on the name
  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-500";
    
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500"
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (user.profilePic && !imageError) {
    return (
      <div className={`${sizeClass} ${className}`}>
        <img
          src={user.profilePic}
          alt={user.fullName}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClass} ${getAvatarColor(user.fullName)} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
    >
      {getInitials(user.fullName)}
    </div>
  );
};

export default Avatar;

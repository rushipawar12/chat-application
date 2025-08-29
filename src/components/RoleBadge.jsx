import React from 'react';
import { Shield, User, Users } from 'lucide-react';

const RoleBadge = ({ role }) => {
  const getRoleConfig = (role) => {
    switch (role) {
      case 'Admin':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: Shield,
          iconColor: 'text-red-600'
        };
      case 'Staff':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: Users,
          iconColor: 'text-blue-600'
        };
      case 'Agent':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: User,
          iconColor: 'text-green-600'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: User,
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getRoleConfig(role);
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
      <IconComponent size={12} className={`mr-1 ${config.iconColor}`} />
      {role}
    </div>
  );
};

export default RoleBadge;

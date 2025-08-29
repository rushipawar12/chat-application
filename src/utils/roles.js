// Role hierarchy and permissions
export const ROLES = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
  AGENT: 'Agent'
};

export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 3,
  [ROLES.STAFF]: 2,
  [ROLES.AGENT]: 1
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canChatWith: [ROLES.ADMIN, ROLES.STAFF, ROLES.AGENT],
    canBroadcast: true,
    canSellProducts: true,
    canDeleteMessages: true,
    canManageUsers: true,
    canViewAllChats: true
  },
  [ROLES.STAFF]: {
    canChatWith: [ROLES.ADMIN, ROLES.STAFF],
    canBroadcast: false,
    canSellProducts: false,
    canDeleteMessages: false,
    canManageUsers: false,
    canViewAllChats: false
  },
  [ROLES.AGENT]: {
    canChatWith: [ROLES.ADMIN, ROLES.STAFF],
    canBroadcast: false,
    canSellProducts: false,
    canDeleteMessages: false,
    canManageUsers: false,
    canViewAllChats: false
  }
};

export const canUserChatWith = (currentUserRole, targetUserRole) => {
  const permissions = ROLE_PERMISSIONS[currentUserRole];
  return permissions?.canChatWith.includes(targetUserRole) || false;
};

export const hasPermission = (userRole, permission) => {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions?.[permission] || false;
};

export const getRoleLevel = (role) => {
  return ROLE_HIERARCHY[role] || 0;
};

export const canManageRole = (managerRole, targetRole) => {
  return getRoleLevel(managerRole) > getRoleLevel(targetRole);
};

export const getRoleColor = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        icon: 'text-red-600'
      };
    case ROLES.STAFF:
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: 'text-blue-600'
      };
    case ROLES.AGENT:
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: 'text-green-600'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        icon: 'text-gray-600'
      };
  }
};

export const getRoleDescription = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'Full system access with user management and product selling capabilities';
    case ROLES.STAFF:
      return 'Can chat with Admin and other Staff members';
    case ROLES.AGENT:
      return 'Can chat with Admin and Staff members';
    default:
      return 'Limited access';
  }
};

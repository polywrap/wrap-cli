export const sanitizeUserPath = (userSubPath: string): boolean => 
  !(userSubPath.indexOf('\0') !== -1 || !/^[a-z0-9]+$/.test(userSubPath))
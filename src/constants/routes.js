export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  USER_PROFILE: '/user/profile',
  PROPERTIES: '/properties',
  SUPPORT:'/supportMesssage',
  PROPERTY_DETAILS: (id: string) => `/properties/${id}`,
  SEARCH: '/search',
};

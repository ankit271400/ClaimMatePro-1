export function useAuth() {
  // Authentication removed - all users have access to features
  return {
    user: { id: 'anonymous-user', name: 'Guest User' },
    isLoading: false,
    isAuthenticated: true, // Always authenticated for open access
  };
}

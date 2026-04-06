export function logout() {
  localStorage.removeItem('token');
  // Add any other cleanup logic if needed
}

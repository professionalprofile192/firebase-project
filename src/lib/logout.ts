export function logout() {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch (e) {}
  
    // redirect user
    window.location.href = "/login";
  }
  
const checkAndRefreshToken = async () => {
  const accessToken = localStorage.getItem("access");
  const refreshToken = localStorage.getItem("refresh");

  if (accessToken) {
    try {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

      if (expirationTime < Date.now()) {
        // Access token is expired, attempt to refresh
        const response = await fetch(`/users/api/token/refresh/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.status === 200) {
          const newTokens = await response.json();
          localStorage.setItem("access", newTokens.access);
          localStorage.setItem("refresh", newTokens.refresh);
          window.location.replace(indexPath);
        } else {
          // Handle the case where refreshing the token failed
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      }
    } catch (error) {
      console.error("Error decoding or refreshing token:", error);
      // Handle the error, e.g., by redirecting to the login page
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
  }
};

// Call checkAndRefreshToken when the page is loaded
checkAndRefreshToken();

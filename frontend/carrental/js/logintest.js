document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm'); // Ensure this is the ID of your login form
  
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const loginData = {
            username: document.getElementById('username').value, // For email/username during login
            password: document.getElementById('password').value, // Ensure you have an input with id="password" in your HTML
        };
  
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
  
            const data = await response.json();
            if (response.ok) {
                alert('Login successful');
                // Optionally, handle post-login success, e.g., redirect or local storage token save
                window.location.href = '/carrental.html'; // Adjust the path as needed or implement other post-login actions
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert(error.message);
        }
    });
});

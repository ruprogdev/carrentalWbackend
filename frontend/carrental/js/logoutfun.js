document.addEventListener('DOMContentLoaded', () => {

const wrapper = window.sharedElements?.wrapper; 
const btnLogin = document.getElementById('loginButton');
const btnLogout = document.getElementById('logoutButton');

//FUNCTION 2 handle Logout
function logout() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            console.log("Logged out successfully");
            checkLoginStatus();
        }
    })
    .catch(error => console.error('Logout Error', error));
}

//function 2 check LogStatus & update UI

function checkLoginStatus() {
    fetch('/auth/status', {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if(data.loggedIn) {
            btnLogin.classList.add('hidden');
            btnLogout.classList.remove('hidden');
        } else {
                btnLogin.classList.remove('hidden');
                btnLogout.classList.add('hidden');
        }        
    })
    .catch(error => console.error('Error checking login status', error));
}

//check login status 2 update UI

checkLoginStatus();

//Logout EventListener

if (btnLogout) {
    btnLogout.addEventListener('click', logout);
}

if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        wrapper?.classList.add('active-popup');
    });
}
});
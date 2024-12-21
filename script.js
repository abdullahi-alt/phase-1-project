const BASE_URL = 'http://localhost:3000';

const homeSection = document.getElementById('homeSection');
const coursesSection = document.getElementById('coursesSection');
const mentorsSection = document.getElementById('mentorsSection');
const forumSection = document.getElementById('forumSection');
const mentalHealthSection = document.getElementById('mentalHealthSection');
const profileSection = document.getElementById('profileSection');
const loginSection = document.getElementById('loginSection');

const profileNavItem = document.getElementById('profileNavItem');
const loginNavItem = document.getElementById('loginNavItem');
const logoutNavItem = document.getElementById('logoutNavItem');

const coursesContainer = document.getElementById('coursesContainer');
const mentorsContainer = document.getElementById('mentorsContainer');
const forumThreadsContainer = document.getElementById('forumThreadsContainer');
const mentalHealthList = document.getElementById('mentalHealthList');
const profileContent = document.getElementById('profileContent');

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

let currentUser = null;

// Check login state on load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    fetchUser().then(() => updateNavState());
  } else {
    updateNavState();
  }
});

document.getElementById('navLinks').addEventListener('click', (e) => {
  const page = e.target.getAttribute('data-page');
  if (page) {
    e.preventDefault();
    navigateTo(page);
  }
});

document.body.addEventListener('click', (e) => {
  const page = e.target.getAttribute('data-page');
  if (page) {
    e.preventDefault();
    navigateTo(page);
  }
});

function navigateTo(page) {
  hideAllSections();
  switch(page) {
    case 'home':
      homeSection.classList.remove('hidden');
      break;
    case 'courses':
      coursesSection.classList.remove('hidden');
      fetchCourses();
      break;
    case 'mentors':
      mentorsSection.classList.remove('hidden');
      fetchMentors();
      break;
    case 'forum':
      forumSection.classList.remove('hidden');
      fetchForumThreads();
      break;
    case 'mentalHealth':
      mentalHealthSection.classList.remove('hidden');
      fetchMentalHealthTips();
      break;
    case 'profile':
      profileSection.classList.remove('hidden');
      showUserProfile();
      break;
    case 'login':
      loginSection.classList.remove('hidden');
      break;
    case 'logout':
      logout();
      navigateTo('home');
      break;
    default:
      homeSection.classList.remove('hidden');
  }
}

function hideAllSections() {
  homeSection.classList.add('hidden');
  coursesSection.classList.add('hidden');
  mentorsSection.classList.add('hidden');
  forumSection.classList.add('hidden');
  mentalHealthSection.classList.add('hidden');
  profileSection.classList.add('hidden');
  loginSection.classList.add('hidden');
}

// Fetch Functions
function fetchCourses() {
  coursesContainer.innerHTML = '';
  fetch(`${BASE_URL}/courses`)
    .then(res => res.json())
    .then(data => {
      data.forEach(course => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <h3>${course.title}</h3>
          <p>${course.description}</p>
        `;
        coursesContainer.appendChild(div);
      });
    })
    .catch(err => console.error('Error fetching courses:', err));
}

function fetchMentors() {
  mentorsContainer.innerHTML = '';
  fetch(`${BASE_URL}/mentors`)
    .then(res => res.json())
    .then(data => {
      data.forEach(mentor => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <h3>${mentor.name}</h3>
          <p>${mentor.bio}</p>
          <p><strong>Expertise:</strong> ${mentor.expertise}</p>
        `;
        mentorsContainer.appendChild(div);
      });
    })
    .catch(err => console.error('Error fetching mentors:', err));
}

function fetchForumThreads() {
  forumThreadsContainer.innerHTML = '';
  fetch(`${BASE_URL}/forum_threads`)
    .then(res => res.json())
    .then(data => {
      data.forEach(thread => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <h3>${thread.title}</h3>
          <p><strong>Category:</strong> ${thread.category}</p>
        `;
        forumThreadsContainer.appendChild(div);
      });
    })
    .catch(err => console.error('Error fetching forum threads:', err));
}

function fetchMentalHealthTips() {
  mentalHealthList.innerHTML = '';
  fetch(`${BASE_URL}/mental_health_tips`)
    .then(res => res.json())
    .then(data => {
      data.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip.tip;
        mentalHealthList.appendChild(li);
      });
    })
    .catch(err => console.error('Error fetching mental health tips:', err));
}

// Login logic
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`)
    .then(res => res.json())
    .then(users => {
      if (users.length > 0) {
        const user = users[0];
        if (user.password === password) {
          localStorage.setItem('authToken', 'fake-jwt-token');
          currentUser = user;
          loginMessage.textContent = "Login successful!";
          loginMessage.style.color = "green";
          updateNavState();
          setTimeout(() => {
            navigateTo('profile');
          }, 1000);
        } else {
          loginMessage.textContent = "Invalid password.";
          loginMessage.style.color = "red";
        }
      } else {
        loginMessage.textContent = "User not found.";
        loginMessage.style.color = "red";
      }
    })
    .catch(err => console.error('Error logging in:', err));
});

function fetchUser() {
  const token = localStorage.getItem('authToken');
  if (!token) return Promise.resolve(null);
  // In real scenarios, we'd verify token or have a /me endpoint.
  return fetch(`${BASE_URL}/users/1`)
    .then(res => res.json())
    .then(user => {
      currentUser = user;
      return user;
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      return null;
    });
}

function showUserProfile() {
  if (!currentUser) {
    profileContent.innerHTML = "<p>Please log in to view your profile.</p>";
    return;
  }
  profileContent.innerHTML = `
    <h3>${currentUser.username}</h3>
    <p>Email: ${currentUser.email}</p>
    <p>Bio: ${currentUser.bio}</p>
    <p>Interests: ${currentUser.interests.join(', ')}</p>
  `;
}

function logout() {
  localStorage.removeItem('authToken');
  currentUser = null;
  updateNavState();
}

function updateNavState() {
  const isLoggedIn = !!localStorage.getItem('authToken');
  if (isLoggedIn) {
    profileNavItem.classList.remove('hidden');
    logoutNavItem.classList.remove('hidden');
    loginNavItem.classList.add('hidden');
  } else {
    profileNavItem.classList.add('hidden');
    logoutNavItem.classList.add('hidden');
    loginNavItem.classList.remove('hidden');
  }
}

// Start on home
navigateTo('home');

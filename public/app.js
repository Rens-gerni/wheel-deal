function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getInitials(firstName, lastName = '') {
  let initials = firstName.charAt(0).toUpperCase();
  if (lastName) {
    initials += lastName.charAt(0).toUpperCase();
  }
  return initials;
}

const avatarColors = [
  '#E31837', '#FF6B35', '#FFC857', '#004E89', '#1A659E',
  '#15616D', '#1982C4', '#6A4C93', '#8AC926', '#FFCA3A'
];

function getAvatarColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}


const demoUsers = [
  {
    id: 'user1',
    firstName: 'Rens',
    lastName: 'Leonen',
    username: '@collector_Rens',
    email: 'Rens@example.com',
    password: 'password123',
    bio: 'Hot Wheels collector since 2015'
  },
  {
    id: 'user2',
    firstName: 'Francis',
    lastName: 'Gebriel',
    username: '@francis_g',
    email: 'francis@example.com',
    password: 'password123',
    bio: 'Custom Hot Wheels builder'
  },
  {
    id: 'user3',
    firstName: 'John',
    lastName: 'Santos',
    username: '@john_s',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Treasure Hunter enthusiast'
  },
  {
    id: 'user4',
    firstName: 'Bianca',
    lastName: 'Reyes',
    username: '@bianca_collects',
    email: 'bianca@example.com',
    password: 'password123',
    bio: 'Vintage Hot Wheels specialist'
  },
  {
    id: 'user5',
    firstName: 'Gebriel',
    lastName: 'Mendoza',
    username: '@gebriel_m',
    email: 'gebriel@example.com',
    password: 'password123',
    bio: 'Diecast custom painter'
  }
];

const demoPosts = [
  {
    id: 'post1',
    userId: 'user1',
    title: '2024 Super Treasure Hunt Find!',
    content: 'Finally found the 2024 Super Treasure Hunt Nissan GT-R!',
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop',
    likes: ['user2', 'user3', 'user4'],
    comments: [
      { id: 'c1', userId: 'user2', text: 'Wow, that\'s amazing! Congrats!' },
      { id: 'c2', userId: 'user4', text: 'That\'s such a nice find!' }
    ],
    timestamp: Date.now() - 86400000
  },
  {
    id: 'post2',
    userId: 'user2',
    title: 'New Additions to My Collection',
    content: 'Added these new castings to my display shelf today.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop',
    likes: ['user1', 'user5'],
    comments: [
      { id: 'c3', userId: 'user3', text: 'Great collection!' }
    ],
    timestamp: Date.now() - 172800000
  },
  {
    id: 'post3',
    userId: 'user3',
    title: 'Custom Mustang Build',
    content: 'Check out my latest custom-painted Mustang build.',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop',
    likes: ['user1', 'user2', 'user4', 'user5'],
    comments: [
      { id: 'c4', userId: 'user5', text: 'The paint job is incredible!' }
    ],
    timestamp: Date.now() - 259200000
  },
  {
    id: 'post4',
    userId: 'user4',
    title: 'Vintage 1982 Camaro',
    content: 'Just added this 1982 original Hot Wheels Camaro to my vintage collection!',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
    likes: ['user1', 'user2', 'user3', 'user5'],
    comments: [
      { id: 'c5', userId: 'user3', text: 'That\'s a classic!' },
      { id: 'c6', userId: 'user5', text: 'So jealous of your vintage collection!' }
    ],
    timestamp: Date.now() - 43200000
  },
  {
    id: 'post5',
    userId: 'user5',
    title: 'Custom Chrome Porsche 918',
    content: 'Just finished this custom chrome paint job on a Porsche 918! What do you think?',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
    likes: ['user1', 'user2', 'user3', 'user4'],
    comments: [
      { id: 'c7', userId: 'user2', text: 'That is stunning! You have talent!' },
      { id: 'c8', userId: 'user4', text: 'I would trade for that in a heartbeat!' }
    ],
    timestamp: Date.now() - 10800000
  },
  {
    id: 'post6',
    userId: 'user4',
    title: 'Looking for 90s First Editions',
    content: 'Looking for 1990s First Editions - let me know what you have!',
    image: null,
    likes: ['user1', 'user5'],
    comments: [
      { id: 'c9', userId: 'user1', text: 'I have a few! Let\'s connect!' }
    ],
    timestamp: Date.now() - 21600000
  },
  {
    id: 'post7',
    userId: 'user5',
    title: 'New Painting Station!',
    content: 'New custom painting station setup complete! Ready to create more!',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    likes: ['user2', 'user3', 'user4'],
    comments: [],
    timestamp: Date.now() - 3600000
  }
];

function loadData(key, defaultValue) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let users = loadData('wheeldeal_users', demoUsers);
let posts = loadData('wheeldeal_posts', demoPosts);
let currentUser = loadData('wheeldeal_currentUser', null);

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

function normalizeApiPost(post) {
  if (post.author && !users.some(user => user.id === post.author.id)) users.push(post.author);
  return {
    ...post,
    timestamp: post.createdAt ? new Date(post.createdAt).getTime() : (post.timestamp || Date.now()),
    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : []
  };
}

async function loadPostsFromApi() {
  try {
    const data = await apiRequest('/api/posts', { method: 'GET', headers: {} });
    posts = (data.posts || []).map(normalizeApiPost);
    saveData('wheeldeal_posts', posts);
  } catch (error) {
    console.warn('Could not load posts from API:', error.message);
  }
}


function signIn(emailOrUsername, password) {
  const user = users.find(u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password);
  if (user) {
    currentUser = user;
    saveData('wheeldeal_currentUser', currentUser);
    return true;
  }
  return false;
}

function signUp(firstName, lastName, email, username, password, bio = '') {
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already exists' };
  }
  
  if (users.find(u => u.username === username)) {
    return { success: false, error: 'Username already exists' };
  }
  
  const newUser = {
    id: generateId(),
    firstName,
    lastName,
    username,
    email,
    password,
    bio
  };
  
  users.push(newUser);
  saveData('wheeldeal_users', users);
  currentUser = newUser;
  saveData('wheeldeal_currentUser', currentUser);
  return { success: true, user: newUser };
}

async function signOut() {
  try { await apiRequest('/api/auth/logout', { method: 'POST', body: '{}' }); } catch (error) { console.warn(error.message); }
  currentUser = null;
  saveData('wheeldeal_currentUser', null);
  window.location.href = 'index.html';
}

function getUserById(userId) {
  return users.find(u => u.id === userId);
}


function renderAvatar(user, size = 40) {
  if (!user) {
    return '';
  }
  
  const initials = getInitials(user.firstName, user.lastName);
  const bgColor = getAvatarColor(user.id);
  
  return `
    <div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'Rajdhani', sans-serif;
      font-weight: bold;
      font-size: ${size * 0.4}px;
      border: 2px solid var(--border);
      flex-shrink: 0;
    ">
      ${initials}
    </div>
  `;
}


function renderPost(post) {
  const author = getUserById(post.userId);
  const isOwnPost = currentUser && currentUser.id === post.userId;
  const isLiked = currentUser && post.likes.includes(currentUser.id);
  const likeClass = isLiked ? 'liked' : '';

  return `
    <article class="post" data-post-id="${post.id}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <a href="profile.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
          ${renderAvatar(author)}
          <h3 style="margin:0;">${author ? author.firstName + ' ' + author.lastName : 'Unknown'}</h3>
        </a>
        
        ${isOwnPost ? `
          <!-- Three-dot menu for own posts -->
          <div class="dropdown">
            <button class="dropdown-toggle" style="background:transparent;border:none;color:var(--text-dim);padding:8px;cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;" data-bs-toggle="dropdown">
              ⋮
            </button>
            <ul class="dropdown-menu" style="background:var(--bg-card);border:1px solid var(--border);">
              <li><a class="dropdown-item edit-post-btn" href="#" style="color:var(--text-muted);" data-post-id="${post.id}">Edit</a></li>
              <li><hr class="dropdown-divider" style="border-color:var(--border);"></li>
              <li><a class="dropdown-item delete-post-btn" href="#" style="color:var(--red);" data-bs-toggle="modal" data-bs-target="#deletePostModal" data-post-id="${post.id}">Delete</a></li>
            </ul>
          </div>
        ` : ''}
      </div>
      
      ${post.title ? `<h2 style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:var(--text-white);margin-bottom:10px;">${post.title}</h2>` : ''}
      
      ${post.image ? `<img src="${post.image}" alt="Post Image" style="width:100%;max-width:400px;height:220px;object-fit:cover;border-radius:var(--radius);margin-bottom:14px;background:var(--bg-card2);">` : ''}
      
      <p class="post-content">${post.content}</p>
      
      <!-- Action buttons -->
      <div style="display:flex;gap:16px;margin-bottom:12px;">
        <button class="like-btn" style="background:transparent;border:none;padding:0;display:flex;align-items:center;gap:8px;cursor:pointer;" data-post-id="${post.id}">
          <span style="font-size:1.3rem;transition:color 0.2s;" class="${likeClass}">❤️</span>
          <span class="like-count" style="color:var(--text-dim);font-size:0.85rem;">${post.likes.length}</span>
        </button>
        
        <button class="comment-toggle-btn" style="background:transparent;border:none;padding:0;display:flex;align-items:center;gap:8px;cursor:pointer;" data-post-id="${post.id}">
          <span style="font-size:1.3rem;color:var(--text-dim);">💬</span>
          <span class="comment-count" style="color:var(--text-dim);font-size:0.85rem;">${post.comments.length}</span>
        </button>
      </div>
      
      <!-- Comments section -->
      <div class="comments-section" id="comments-${post.id}" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);display:none;">
        <div style="margin-bottom:12px;">
          <form class="comment-form" data-post-id="${post.id}" style="display:flex;gap:8px;">
            <input type="text" class="comment-input" placeholder="Add a comment..." required style="flex:1;">
            <button type="submit" style="padding:8px 16px;">Post</button>
          </form>
        </div>
        
        <div class="comments-list" data-post-id="${post.id}">
          ${post.comments.map(comment => {
            const commentAuthor = getUserById(comment.userId);
            return `
              <div class="comment" style="margin-bottom:8px;padding:8px 0;">
                <strong style="color:var(--text-white);font-size:0.85rem;">${commentAuthor ? commentAuthor.firstName : 'Unknown'}:</strong>
                <span style="color:var(--text-muted);font-size:0.85rem;">${comment.text}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </article>
  `;
}

// Render posts in container (filter by user if userId provided)
function renderPosts(containerId, userId = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let postsToRender = [...posts].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  
  if (userId) {
    postsToRender = postsToRender.filter(p => p.userId === userId);
  }
  
  container.innerHTML = postsToRender.length ? postsToRender.map(post => renderPost(post)).join('') : '<div class="empty-state" style="padding:24px;text-align:center;color:var(--text-muted)"><h3>No posts yet</h3><p>Be the first collector to share a find.</p><a href="createpost.html">Create a post</a></div>';
  attachPostEventListeners();
}


const hotWheelsImages = [
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop'
];

async function createPost(title, content, image = null, tags = '', category = 'Collection Showcase') {
  if (!currentUser) { window.location.href = 'index.html'; return null; }
  const postImage = image || null;
  const data = await apiRequest('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content, image: postImage, tags, category })
  });
  const post = normalizeApiPost(data.post);
  posts.unshift(post);
  saveData('wheeldeal_posts', posts);
  return post;
}

async function updatePost(postId, newTitle, newContent) {
  const data = await apiRequest(`/api/posts/${encodeURIComponent(postId)}`, {
    method: 'PUT', body: JSON.stringify({ title: newTitle, content: newContent })
  });
  const index = posts.findIndex(p => p.id === postId);
  if (index >= 0) posts[index] = normalizeApiPost(data.post);
  saveData('wheeldeal_posts', posts);
  return true;
}

async function deletePost(postId) {
  await apiRequest(`/api/posts/${encodeURIComponent(postId)}`, { method: 'DELETE', body: '{}' });
  posts = posts.filter(p => p.id !== postId);
  saveData('wheeldeal_posts', posts);
  return true;
}

async function toggleLike(postId) {
  if (!currentUser) { window.location.href = 'index.html'; return; }
  await apiRequest(`/api/posts/${encodeURIComponent(postId)}/like`, { method: 'POST', body: '{}' });
  await loadPostsFromApi();
  refreshAllPosts();
}

async function addComment(postId, text) {
  if (!currentUser) { window.location.href = 'index.html'; return; }
  await apiRequest(`/api/posts/${encodeURIComponent(postId)}/comments`, {
    method: 'POST', body: JSON.stringify({ text })
  });
  await loadPostsFromApi();
}

function refreshAllPosts() {
  if (document.getElementById('feed-posts')) renderPosts('feed-posts');
  if (document.getElementById('profile-recent-posts') && currentUser) renderPosts('profile-recent-posts', currentUser.id);
  if (document.getElementById('community-build-posts')) renderPosts('community-build-posts');
}


function attachPostEventListeners() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try { await toggleLike(e.currentTarget.dataset.postId); } catch (error) { alert(error.message); }
    });
  });
  
  document.querySelectorAll('.comment-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = e.currentTarget.dataset.postId;
      const commentsSection = document.getElementById(`comments-${postId}`);
      if (commentsSection) {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
      }
    });
  });
  
  document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const postId = e.currentTarget.dataset.postId;
      const input = e.currentTarget.querySelector('.comment-input');
      const text = input.value.trim();
      
      if (text) {
        try { await addComment(postId, text); refreshAllPosts(); } catch (error) { alert(error.message); }
      }
    });
  });
  
  document.querySelectorAll('.edit-post-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const postId = e.target.dataset.postId;
      const post = posts.find(p => p.id === postId);
      
      if (post) {
        const newTitle = prompt('Edit post title:', post.title || '');
        if (newTitle === null || !newTitle.trim()) return;
        const newContent = prompt('Edit your caption:', post.content || '');
        if (newContent !== null && newContent.trim()) {
          updatePost(postId, newTitle.trim(), newContent.trim()).then(refreshAllPosts).catch(error => alert(error.message));
        }
      }
    });
  });
  
  document.querySelectorAll('.delete-post-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const postId = e.target.dataset.postId;
      document.getElementById('deletePostModal').dataset.postId = postId;
    });
  });
}


document.addEventListener('DOMContentLoaded', async () => {
  const authPages = ['feed.html', 'explore.html', 'restocks.html', 'profile.html', 'createpost.html', 'dashboard.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (authPages.includes(currentPage)) {
    try {
      const session = await apiRequest('/api/auth/me', { method: 'GET', headers: {} });
      currentUser = session.user;
      saveData('wheeldeal_currentUser', currentUser);
    } catch (error) {
      currentUser = null;
      saveData('wheeldeal_currentUser', null);
      window.location.href = 'index.html';
      return;
    }
  }
  await loadPostsFromApi();
  
  const navProfileArea = document.getElementById('nav-profile');
  if (navProfileArea && currentUser) {
    navProfileArea.innerHTML = `
      <a href="#" style="display:flex;align-items:center;gap:10px;text-decoration:none;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:0.9rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);padding:8px 16px;border-radius:var(--radius);transition:color var(--transition),background var(--transition);" data-bs-toggle="dropdown">
        ${renderAvatar(currentUser, 28)}
        Profile
      </a>
      <ul class="dropdown-menu" style="background:var(--bg-card);border:1px solid var(--border);">
        <li><a class="dropdown-item" href="profile.html" style="color:var(--text-muted);">Profile</a></li>
        <li><hr class="dropdown-divider" style="border-color:var(--border);"></li>
        <li><a class="dropdown-item" id="sign-out-btn" href="#" style="color:var(--red);">Sign Out</a></li>
      </ul>
    `;
    
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signOut();
      });
    }
  }
  
  if (document.getElementById('profile-banner-content') && currentUser) {
    const user = currentUser;
    const totalPosts = posts.filter(p => p.userId === user.id).length;
    const totalHearts = posts
      .filter(p => p.userId === user.id)
      .reduce((sum, post) => sum + post.likes.length, 0);
    
    document.getElementById('profile-banner-content').innerHTML = `
      ${renderAvatar(user, 100)}
      <h1>${user.firstName} ${user.lastName}</h1>
      <p>${user.username}</p>
      <button>Edit Profile</button>
    `;
    
    document.getElementById('user-stats').innerHTML = `
      <div class="stat-card">
        <h3>${totalPosts}</h3>
        <p>Total Posts</p>
      </div>
      <div class="stat-card">
        <h3>${totalHearts}</h3>
        <p>Total Hearts</p>
      </div>
    `;
  }
  
  if (document.getElementById('feed-posts')) renderPosts('feed-posts');
  if (document.getElementById('profile-recent-posts') && currentUser) renderPosts('profile-recent-posts', currentUser.id);
  if (document.getElementById('community-build-posts')) renderPosts('community-build-posts');
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submit = document.getElementById('login-submit');
      const message = document.getElementById('login-message');
      submit.disabled = true; submit.textContent = 'Signing In...';
      message.textContent = '';
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailOrUsername: document.getElementById('login-email').value.trim(),
            password: document.getElementById('login-password').value
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
        currentUser = data.user;
        saveData('wheeldeal_currentUser', currentUser);
        window.location.href = 'feed.html';
      } catch (err) {
        message.textContent = err.message.includes('Failed to fetch') ? 'Cannot connect to the server. Start it with npm start, then open http://localhost:3000.' : err.message;
        message.style.color = 'var(--red)';
      } finally {
        submit.disabled = false; submit.textContent = 'Sign In';
      }
    });
  }

  const signInTab = document.getElementById('sign-in-tab');
  if (signInTab) {
    signInTab.addEventListener('click', () => {
      document.getElementById('login-email')?.focus();
      document.getElementById('login-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Show/hide the forgot-password panel.
  const forgotBtn = document.getElementById('forgot-password-btn');
  const forgotPanel = document.getElementById('forgot-password-panel');
  if (forgotBtn && forgotPanel) {
    forgotBtn.addEventListener('click', () => {
      forgotPanel.hidden = !forgotPanel.hidden;
      if (!forgotPanel.hidden) document.getElementById('reset-email')?.focus();
    });
  }

  const forgotForm = document.getElementById('forgot-password-form');
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('reset-request-message');
      const submit = document.getElementById('reset-request-submit');
      submit.disabled = true; submit.textContent = 'Sending...'; msg.textContent = '';
      try {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: document.getElementById('reset-email').value.trim() })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not request a reset link.');
        msg.textContent = data.message; msg.style.color = 'var(--text-muted)';
      } catch (err) {
        msg.textContent = err.message.includes('Failed to fetch') ? 'Cannot connect to the server. Start it with npm start.' : err.message;
        msg.style.color = 'var(--red)';
      } finally { submit.disabled = false; submit.textContent = 'Send Reset Link'; }
    });
  }

  const resetForm = document.getElementById('reset-password-form');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('reset-password-message');
      const submit = document.getElementById('reset-password-submit');
      submit.disabled = true; submit.textContent = 'Updating...'; msg.textContent = '';
      try {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: document.getElementById('reset-token').value.trim(), password: document.getElementById('reset-new-password').value })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not update password.');
        msg.textContent = data.message; msg.style.color = 'var(--text-muted)';
        resetForm.reset();
      } catch (err) { msg.textContent = err.message; msg.style.color = 'var(--red)'; }
      finally { submit.disabled = false; submit.textContent = 'Update Password'; }
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      if (password !== confirmPassword) { alert('Passwords do not match!'); return; }
      const submit = signupForm.querySelector('button[type="submit"]');
      submit.disabled = true;
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: document.getElementById('signup-firstname').value.trim(),
            lastName: document.getElementById('signup-lastname').value.trim(),
            email: document.getElementById('signup-email').value.trim(),
            username: document.getElementById('signup-username').value.trim(), password
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to create account.');
        currentUser = data.user; saveData('wheeldeal_currentUser', currentUser);
        window.location.href = 'feed.html';
      } catch (err) { alert(err.message.includes('Failed to fetch') ? 'Cannot connect to the server. Start it with npm start, then open http://localhost:3000.' : err.message); }
      finally { submit.disabled = false; }
    });
  }
  
  const createPostForm = document.getElementById('create-post-form');
  if (createPostForm) {
    createPostForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title')?.value || '';
      const description = document.getElementById('description')?.value || '';
      const imageInput = document.getElementById('image');
      
      const createPostWithImage = async (imageUrl) => {
        if (!title.trim() || !description.trim()) { alert('Please enter a title and caption.'); return; }
        const submit = createPostForm.querySelector('button[type="submit"]');
        if (submit) { submit.disabled = true; submit.textContent = 'Publishing...'; }
        try {
          await createPost(title.trim(), description.trim(), imageUrl);
          window.location.href = 'feed.html';
        } catch (error) {
          alert(error.message);
          if (submit) { submit.disabled = false; submit.textContent = 'Publish Post'; }
        }
      };
      
      if (imageInput && imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
          createPostWithImage(event.target.result);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
    
        createPostWithImage(null);
      }
    });
  }
  
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
      const postId = document.getElementById('deletePostModal').dataset.postId;
      try {
        await deletePost(postId); refreshAllPosts();
        const modal = bootstrap.Modal.getInstance(document.getElementById('deletePostModal'));
        if (modal) modal.hide();
      } catch (error) { alert(error.message); }
    });
  }


  const exploreSearch = document.querySelector('.search-section input');
  const exploreSearchButton = document.querySelector('.search-section button');
  if (exploreSearch && exploreSearchButton) {
    const runExploreSearch = () => {
      const query = exploreSearch.value.trim().toLowerCase();
      let shown = 0;
      document.querySelectorAll('.featured-collections .car-card').forEach(card => {
        const match = card.innerText.toLowerCase().includes(query);
        card.hidden = !match;
        if (match) shown++;
      });
      let result = document.getElementById('explore-search-result');
      if (!result) {
        result = document.createElement('p'); result.id = 'explore-search-result';
        result.style.color = 'var(--text-muted)'; exploreSearch.closest('.search-section').after(result);
      }
      result.textContent = query ? `${shown} result(s) for “${exploreSearch.value.trim()}”.` : 'Showing all featured collections.';
    };
    exploreSearchButton.addEventListener('click', runExploreSearch);
    exploreSearch.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); runExploreSearch(); } });
  }

  const notificationButton = document.getElementById('enable-restock-notifications');
  if (notificationButton) {
    notificationButton.addEventListener('click', async () => {
      if (!('Notification' in window)) { alert('This browser does not support desktop notifications. Restock reminders can still be saved on this device.'); return; }
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          notificationButton.textContent = 'Notifications Enabled';
          new Notification('Wheel Deal', { body: 'Restock notifications are enabled for this browser.' });
        } else alert('Notifications were not enabled. You can change this in your browser settings.');
      } catch (error) { alert('Please open Wheel Deal through localhost or HTTPS to enable notifications.'); }
    });
  }
  document.querySelectorAll('.restock-card button').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.restock-card');
      const name = card?.querySelector('h3')?.textContent.trim();
      if (!name) return;
      const saved = JSON.parse(localStorage.getItem('wheeldeal_restock_alerts') || '[]');
      if (saved.includes(name)) {
        localStorage.setItem('wheeldeal_restock_alerts', JSON.stringify(saved.filter(item => item !== name)));
        button.textContent = 'Notify Me';
      } else {
        saved.push(name); localStorage.setItem('wheeldeal_restock_alerts', JSON.stringify(saved));
        button.textContent = 'Alert Saved ✓';
      }
    });
    const card = button.closest('.restock-card');
    const name = card?.querySelector('h3')?.textContent.trim();
    const saved = JSON.parse(localStorage.getItem('wheeldeal_restock_alerts') || '[]');
    if (name && saved.includes(name)) button.textContent = 'Alert Saved ✓';
  });

  const profileContent = document.getElementById('profile-banner-content');
  if (profileContent && currentUser) {
    const editButton = profileContent.querySelector('button');
    if (editButton) editButton.addEventListener('click', async () => {
      const firstName = prompt('First name:', currentUser.firstName || '');
      if (firstName === null) return;
      const lastName = prompt('Last name:', currentUser.lastName || '');
      if (lastName === null) return;
      const username = prompt('Username (without @ is okay):', (currentUser.username || '').replace(/^@/, ''));
      if (username === null) return;
      const bio = prompt('Bio:', currentUser.bio || '');
      if (bio === null) return;
      try {
        const result = await apiRequest('/api/auth/profile', { method: 'PUT', body: JSON.stringify({ firstName, lastName, username, bio }) });
        currentUser = result.user; saveData('wheeldeal_currentUser', currentUser);
        window.location.reload();
      } catch (error) { alert(error.message); }
    });
  }

  document.querySelectorAll('.quick-access .card').forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.setAttribute('role', 'link');
    card.tabIndex = 0;
    const targets = ['profile.html', 'explore.html', 'feed.html'];
    const go = () => { window.location.href = currentUser ? targets[index] : 'index.html#login-form'; if (!currentUser) document.getElementById('login-email')?.focus(); };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
});

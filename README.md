# Wheel Deal — Hot Wheels Collector Community

## Project description
Wheel Deal is a responsive collector community website for sharing die-cast car finds, discovering collections, commenting on posts, liking posts, and saving restock alerts.

## Technologies
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Node.js and Express REST API
- `express-session` for session login
- `bcryptjs` for password hashing
- JSON file storage (`data/db.json`) for this local class-project version

## Main features
- Account registration and login using email or username
- Forgot/reset password flow for local development (reset token appears in the server terminal; no email is sent)
- Authenticated feed, profile, explore, restock, and create-post pages
- Create posts with a caption and optional image
- Like/unlike posts, add comments, edit own posts, and delete own posts
- Edit profile name, username, and bio
- Search/filter featured collection cards
- Save or remove local restock alerts and request browser notifications
- Responsive page styling and local SVG image assets

## Run in VS Code
1. Install Node.js LTS.
2. Extract this project and open the `wheeldeal_backend` folder in VS Code.
3. Open the integrated terminal in that folder.
4. Run `npm install`.
5. Run `npm start`.
6. Open `http://localhost:3000` in your browser.
7. Check `http://localhost:3000/api/health` to confirm the API is running.

Do not open the HTML files directly with `file://`; the frontend uses the API served by the local server.

## Pages
- `index.html` — login and password reset
- `signup.html` — account registration
- `feed.html` — community posts
- `explore.html` — featured collections and search
- `restocks.html` — upcoming releases and saved alerts
- `profile.html` — profile and recent posts
- `createpost.html` — create a community post
- `dashboard.html` — project landing page

## API routes
- `GET /api/health` — server status
- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — sign in
- `POST /api/auth/logout` — sign out
- `GET /api/auth/me` — current signed-in user
- `POST /api/auth/forgot-password` — request a local reset token
- `POST /api/auth/reset-password` — set a new password with a valid token
- `PUT /api/auth/profile` — edit the signed-in user's profile
- `GET /api/posts` — list posts
- `POST /api/posts` — create a post (sign-in required)
- `PUT /api/posts/:id` — edit your own post
- `DELETE /api/posts/:id` — delete your own post
- `POST /api/posts/:id/like` — like/unlike a post
- `POST /api/posts/:id/comments` — add a comment

## Notes
- The password reset token is printed in the terminal running `npm start`. Email delivery has not been configured, so this is for a local demo only.
- The JSON file database is suitable for a local classroom demo, not a public production deployment. Set a strong `SESSION_SECRET` and use a proper database/email provider before deployment.
- Run through the features in a browser before submission; browser permission prompts for notifications depend on the browser and local-host security rules.

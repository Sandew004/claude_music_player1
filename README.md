Glass Music: Netlify + Google Drive
1. Prepare Google Drive
Put your MP3s in one Drive folder.
Right-click the folder > Share > General access > Anyone with the link: Viewer.
Copy the folder ID: the last part of the folder URL (drive.google.com/drive/folders/THIS_PART).
2. Create a Google API key
Go to console.cloud.google.com > create a project.
APIs & Services > Library > enable Google Drive API.
APIs & Services > Credentials > Create credentials > API key.
Edit the key > API restrictions > restrict to Google Drive API only.
3. Deploy to Netlify
Option A (Git): push this folder to GitHub > Netlify > Add new site > Import from Git.
Option B (CLI):
npm i -g netlify-cli
netlify login
netlify init        # or: netlify deploy --prod
Note: drag-and-drop deploys do NOT run functions; use Git or CLI.
4. Set environment variables
Netlify > Site configuration > Environment variables:
DRIVE_API_KEY = your API key
DRIVE_FOLDER_ID = your folder ID
Then trigger a redeploy.
5. Use it
Add or remove MP3s in the Drive folder. Reload the site (or right-click > Refresh library) and the changes appear. No redeploy needed.
Notes
Cursor effects: click = ripple + squish, right-click = blue ripple + custom menu, loading = spinning ring. The cursor is hidden on touch devices.
Songs are listed newest first. Titles come from file names.
Private folders would need a Google service account instead of an API key (ask if you want that version).
Drive limits heavy public downloads; for a personal player this is fine.

https://drive.google.com/drive/folders/1cSZq6GYz0gBytkAVPHHuRwE5lM6Giz28?usp=sharing

1cSZq6GYz0gBytkAVPHHuRwE5lM6Giz28
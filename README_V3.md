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
Update v2
Audio now streams through `netlify/functions/stream.mjs` (range chunks, API key stays private). Delete the old `stream.js` if it is still in your repo.
Test streaming: copy a song `id` from `/api/songs` and open `/api/stream/THE_ID` in a browser tab. It should play or download; if it shows JSON, that is Google's error message.
Keyboard: Space play/pause, arrows seek/volume, N/P next/previous, S shuffle, R repeat, F favorite, M mute, / search.
Update v3
Album art: upload an image to the same Drive folder with the same name as the song (`Song.mp3` + `Song.jpg`/`.png`/`.webp`). Case is ignored. Keep it under 5 MB (a 1000 px square is ideal). HEIC is not supported by browsers.
Mini player: click the pop-out button (or press O). Chrome/Edge open an always-on-top floating window; other browsers open a normal small window. Keep the main tab open, since the audio plays there.
Windows media panel: shows the album art, title and artist. For the source name to read "Glass Music", install the site as an app (the install button appears in the Library header in Chrome/Edge).
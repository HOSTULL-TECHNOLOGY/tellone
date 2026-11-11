TBH ONE: WEBSITE PREVIEW
========================

This folder is a complete, clickable preview of the TBH One website: every public page in five languages, the shop, sign-in and all 16 dashboards.

It was produced from the real Next.js project. The site was built, every page was pre-rendered to HTML, and the paths were made relative. What you see is the actual website, not a mock-up.


HOW TO OPEN IT
--------------
1. Unzip TBH-One-Website-Preview.zip. Do not open the files from inside the ZIP.
2. Open the TBH-One-Website-Preview folder.
3. Double-click index.html.

The site opens in your web browser. No server, installation or internet connection is needed. It was tested in Chrome by double-clicking. It should also work in Edge, Firefox and Safari, but those were not tested.

Keep the folder together: index.html needs the "pages" and "assets" folders beside it. You can move or copy the whole folder anywhere.


WHAT IS INSIDE
--------------
  index.html   Start here. It opens pages/index.html, the homepage.
  pages/       5,111 pages:
                 - English (995 pages);
                 - Pidgin, Yoruba, Hausa and Igbo (996 each);
                 - the 16 dashboards (130 pages);
                 - the homepage and a "page not found" page.
               Pages are named after their address. For example, en__shop__merch.html is /shop/merch.
  assets/      Everything the pages use:
                 _next/   scripts and styles (fonts are embedded in the styles)
                 brand/   logos and app icons
                 people/  candidate artwork
                 media/   campaign posters
                 shop/    product photos
                 audio/   the 7 theme songs, each in normal (128 kbps) and Data Saver (48 kbps) quality
                 fonts/   Noto Serif Display and Noto Sans (SIL Open Font License)


THINGS TO TRY
-------------
- Theme song: the green player bar under the menu stays at the top of every page.
    - Press Play, and choose another song from the list.
    - Turn Autoplay on or off.
    - Open Lyrics to read the words; on phones, the song list is there too.
    - Moving to another page carries on with the same song from the same point.
- Menus: simple dropdowns on desktop (Shop is a direct link), the three-line menu on a phone or narrow window.
- Dark mode: the moon button next to the search icon. For Light, Dark or System theme and Data Saver, use the
  sliders icon in the top bar.
- Language (globe, top bar): English, Pidgin, Yoruba, Hausa, Igbo.
- Search: the magnifying glass in the header.
- Shop:
    - choose a product, a size and a colour;
    - add it to the cart, then check out (the payment is simulated; no money moves);
    - then Track My Order.
- Join: the sign-up form gives you a member ID and QR code.
- Dashboards:
    - click Login, then choose a name under "Demo accounts";
    - "Demo Reviewer" has all 16 roles: switch between them with the role menu at the top of the dashboard.
- Where TBH One is active: on the homepage, click any state or diaspora country to see its figures.
- Projects: swipe or use the arrows to move through all the projects.
- The app: the homepage and the "Get the App" page show the design of the TBH One mobile app.
- Register pop-up: after 15 seconds, or halfway down a page, an invitation to register appears once a week.
- Staying signed in: after signing in, go back to the website. The top bar shows your name, with links to your
  dashboard and to Sign out.

Demo codes:
  - text-message code: 123456
  - password: demo1234
  - two-factor code: 246810 (asked for roles above Member)


WHAT A PREVIEW CANNOT DO
------------------------
This is a frontend prototype. There is no server or database behind it.

- Saving: sign-ins, carts, orders, sign-ups, approvals and other actions are saved only in this browser, on this computer. Clearing your browser data resets them. Nothing is shared between people or devices.
- Nothing is sent: no text messages, emails, WhatsApp messages or payments. Every confirmation is simulated.
- AI assistant ("Talk to Us"): it answers from a fixed set of approved answers. The live AI needs the full project running on a server with an API key.
- Not yet available: the WhatsApp sign-in and WhatsApp support line, the live social feeds and the TV stream. They wait for official accounts and are marked as such on the site.
- Demo content: figures, prices, news and leaderboards are demo content, labelled "Demo data".
- Photos of people: these are the photos supplied for review. Some must be licensed or replaced before the
  site goes public: one is an Adobe Stock preview with a watermark, and the photos of NYSC members and election
  officials need care on a campaign site. See the developer handoff in the source project.
- Theme song across pages: each page here is a separate file, so the song restarts from where it was, after a
  moment. On the hosted website it plays without a break.
- Translations: the Pidgin, Yoruba, Hausa and Igbo pages show English text under a "draft translation" notice until translators supply the text.
- Firefox only: Firefox may limit some features on files opened straight from disk. If anything misbehaves there, use Chrome or Edge, or run the local server below.


IF YOUR BROWSER BLOCKS SOMETHING (optional)
-------------------------------------------
Double-clicking works in Chrome. If a browser refuses to play audio or load a page from disk, serve the folder instead. With Python installed:

  cd TBH-One-Website-Preview
  python3 -m http.server 8080

Then open http://localhost:8080 in the browser.


PUT THE PREVIEW ONLINE (optional)
---------------------------------
This folder can be dragged onto Netlify Drop (https://app.netlify.com/drop) as it is. Drag the TBH-One-Website-Preview folder itself, the one that contains index.html, not the ZIP and not a parent folder. Netlify shows "Page not found" when index.html is not at the top of what you upload.

For the full website with a server, use the source project in TBH-One-Complete-Website.zip. Its README explains the Netlify setup.

# Jeff.Q Productions

A portfolio website where Jeff Qiu shows his films and commercials, built to feel like watching a reel. See it at **[jeffqproductions.github.io](https://jeffqproductions.github.io/)**.

## The idea

The site borrows the language of film. The films sit on a reel that curves away into the dark, and the one at the front plays. Along the bottom runs a timeline with ticks like an editor's, and a pink needle marks where you are. A timecode counts the frames in the corner of the playing film, and a pink line under it fills as it plays.

Everything sits on black, with fine dust drifting slowly behind the page. The dust comes back in the loader, where the name is drawn in it.

The type is Syne for titles and Geist for everything else, in three colors: off-white, grey and one pink accent.

## What it does

- **The loader.** The name fills with dust as the page loads. At 100 it runs up off the screen like the next frame on a projector, and the page comes up after it.
- **The reel.** You can move through the films with a scroll, a drag, a swipe, the arrow keys or the numbers on the timeline. The film at the front plays, and each film picks up where it stopped. The sound is off until you turn it on.
- **Project pages.** A click on the film at the front opens its page, rising from the bottom. The text stays in place while the stills scroll past, and Jeff's signature draws itself under the text in one stroke.
- **Info.** It slides in from the right with a short intro, the services, the email and the socials. Close or Esc closes it.
- **The pointer.** An empty ring follows the mouse and opens into a pink ring over links.
- **Addresses and sharing.** Every film has its own address, such as [/mongolia/](https://jeffqproductions.github.io/mongolia/), and Info has [/#info](https://jeffqproductions.github.io/#info). A shared link to a film shows that film's own card: its still, its title and its place on the timeline. The browser's back button closes a project page.
- **Phones.** The cards turn square, and each film has its own square cut, framed shot by shot on what matters in it, at about a quarter of the file size.
- **For everyone.** It works with the keyboard, calms down for people who ask for reduced motion, and describes every still for screen readers. Without WebGL, the dust is left out and the page stays plain black.

## How it's built

Plain HTML, CSS and JavaScript, with no framework and no build step. The dust is drawn in WebGL, and the pointer moves with GSAP.

The design was made in Figma at 1280 × 832, on a 12-column grid with 40px margins and 16px gutters. The CSS follows that grid, so the page keeps its proportions on bigger screens. Below 1024px the layout reflows for tablets, and below 640px for phones.

| File | What it does |
| --- | --- |
| `index.html` | The page: the bar, the reel, the title and its details, the timeline, Info |
| `styles.css` | The layout and the type, on the 12-column grid |
| `reel.js` | The films and everything around them: the reel, the timeline, the timecode, the project pages, Info |
| `loader.js` | The name in dust that opens the site |
| `backdrop.js` | The dust drifting behind the page |
| `cursor.js` | The ring that follows the pointer |
| `mongolia/` and the other films' folders | Each film's address: the page a shared link reads for the film's card, which then opens the film on the reel |
| `404.html` | The page for a wrong address: the reel with nothing on it and the way back |
| `robots.txt`, `sitemap.xml` | Where search engines find the site |
| `assets/` | The films, their stills, the tab icon and the share cards |

## Credits

Design by Anna Fesenko. Films by Jeff Qiu.

[jqproductions@outlook.com](mailto:jqproductions@outlook.com)

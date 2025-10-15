# BetterYoutubeSubs
Filter the videos that show up in your YouTube subscription feed to better manage the content you want to watch. <br>
Firefox: https://addons.mozilla.org/en-US/firefox/addon/better-youtube-subs/

This is something i made for myself that i'm just putting out into the world in case someone also finds it useful. If you're running into issues, i won't know to fix it or that something is wrong in the first place unless you contact me since all my testing is "it works on my machine." 

## Features
### Filter by
- Type
  - Videos
  - Shorts
  - Live Streams
- Watch Status
  - Unwatched
  - Continue Watching
  - Finished
- Favorite Filter
  - Set your favorite filters to the quick toggle
  - Set to Unwatched Videos by default

### Channel Filters
Whitelist or blacklist a channel's content by keywords in the videos' title

## How to use
### Filters
On the subscriptions page, in the upper right next to manage, will be two drop down menus labeled 'type' and 'show'. Then select which filter you want to see for the page's videos to update. A type and watch status filter can be applied at the same. Click on the star button to toggle the favorite set of filters. Set to unwatched videos by default, you can go into the options menu to pick your own from the drop down selectors. Clicking the button again while viewing your favorite will bring you back to the filters you had applied before switching.

### Channel Filters
You can add and remove entries to the white/black list in the extension's options from the extensions page. Type the channel name and the keywords into the input boxes to add a new entry. The filter looks to see if the text entered for the channel and title is contained within the actual text displayed on YouTube. For the black list, you are able to set the title to the char "*" to specify all videos for the scenario of the YouTube feature of pushing videos to your page that's technically from another channel due to a person you subscribe to being one of the uploaders. Hover over any of the listed entries and click the X next to it to remove it. You can also import and export your filters using the buttons at the top on the options page. The import must be a json and will add all entries from the import into your current list while ignoring any duplicates.

### Other Details
The video preview you get when hovering over some videos has been disabled since, in the past, filering breaks it on some videos. This might not be an issue in the current version of Youtube but i'm just not a fan of it so i keep it included. If you care enough to use this extension with previews, message me and i can add it as an option. 

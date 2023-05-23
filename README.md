# BetterYoutubeSubs
Filter the videos that show up in your YouTube subscription feed to better manage the content you want to watch. <br>
Firefox: https://addons.mozilla.org/en-US/firefox/addon/better-youtube-subs/

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
On the subscriptions page, in the upper right next to manage, will be two drop down menus labeled 'type' and 'show'. Then select which filter you want to see for the page's videos to update. Setting the type to shorts will disable the show dropdown since YouTube doesn't have a progress bar and shorts so they can only ever appear as "unwatched." A type and watch status filter can be applied at the same. Click on the star button to toggle the favorite set of filters. Set to unwatched videos by default, you can go into the options menu to pick your own from the drop down selectors. Clicking the button again while viewing your favorite will bring you back to the filters you had applied before switching. You favorite can also be auto applied when you open the subscriptions page through a setting in the options page. 

### Channel Filters
You can add and remove entries to the white/black list in the extension's options from the extensions page. Type the channel name and the keywords into the input boxes to add a new entry. Hover over any of the listed entries and click the X next to it to remove it. You can also import and export your filters using the buttons at the top on the options page. The import must be a json and will add all entries from the import into your current list while ignoring any duplicates.

At the bottom of the page there is a button called "Show More" and that will cause more videos to load in since I disabled the automatic loading of videos when you scroll. The reason for this is because if there's a filter applied that hides most or all the videos being loaded in, the page will be stuck in a loop of always loading in more videos. The video preview you get when hovering over a video has also been disabled since it didn't play nice when filtering videos.

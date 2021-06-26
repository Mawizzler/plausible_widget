# Plausible iOS/macOS Widget

I created a widget for iOS/macOS with [Scriptable.app](https://apps.apple.com/de/app/scriptable/id1405459188) & [Plausible Analytics](https://plausible.io) to always have an eye on my website traffic.

## Installation

There are 2 options to install this widget. For both options, make sure to download [Scriptable](https://apps.apple.com/de/app/scriptable/id1405459188) from the AppStore before starting with the installation of the widget.

1. Install with ScriptDude

[![Download with ScriptDude](https://scriptdu.de/download.svg)](https://scriptdu.de/?name=Plausible+Analytics+Widgets&source=https%3A%2F%2Fraw.githubusercontent.com%2FMawizzler%2Fplausible_widget%2Fmain%2Fwidget.js&docs=https%3A%2F%2Fgithub.com%2FMawizzler%2Fplausible_widget%2Fblob%2Fmain%2FREADME.md#generator)

2. Manual Installation

Click the "+"-Icon in the Scriptable-app.
Copy all the text from the [widget.js](https://github.com/Mawizzler/plausible_widget/blob/main/widget.js) file.
Replace the top two variables with your own plausible site name and API Key. You can generate your API Key in the settings of your plausible account.
```
const PLAUSIBLE_SITE = ""
const API_KEY = ""
```
Add a Scriptable-widget to your homescreen and select the Plausible Widget Script.
Set the Parameter Text to the timerange you want (Default is Last 7 days).

- **7d** (Last 7 days)
- **30d** (Last 30 days)
- **month** (Current Month)
- **6mo** (Last 6 Months)
- **12mo** (Last 12 Months)

## Examples
![alt text](https://imgur.com/RW2mJ0f.png)

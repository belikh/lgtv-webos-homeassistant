---
title: Notifications | webOS TV Developer
id: notifications-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
created: '2026-08-28T02:16:48.258468Z'
source: https://webostv.developer.lge.com/develop/guides/notifications
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:16:48.257327Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

Notifications | webOS TV Developer

Search
Open menu

SearchSign In

webOS News

Flutter for webOS TV is Now Available for Developers!
Flutter for webOS TV is now officially available, enabling developers to build, package, and run Flutter apps directly on webOS TV devices using the flutter-webOS SDK.

LG Gallery+ Turns LG TVs Into Design Elements That Personalize Your Living Space
LG announced the availability of LG Gallery+, a new visual curation service that enriches living spaces to reflect the unique style and mood of each user.

Search
Close menu

Guides

Notifications

Because TV users spend most of their time on immersive activities, sending notifications is not allowed on webOS TV. All types of notifications are reserved as system-related events.
There are two types of notifications:

Toasts

Alerts

Note
Toasts and alerts are only available in system apps, not 3rd party apps.
Toasts
The purpose of toasts is to inform users, but without requiring action from users. Toasts appear as an overlay at the bottom of the screen.
Key features of toasts

Non-modal notifications that appear as an overlay on the experience

Transient in nature, and disappears after 5 seconds

Appear one at a time, in the order received

Do not require action from users
The toast notification can be shown on the screen with the virtual keyboard simultaneously.
Alerts
Alerts are reserved for critical system events. The purpose of alerts is to inform users about something critical and require immediate action by users to maintain the quality of experience. Alerts appear at the bottom (Before webOS25) or the center (After webOS26) section of the screen, on top of whichever app is currently in use.
The alert messages have the below design layout:
Key features of alerts

Show dialogs on top of whichever app is currently in use, including the Home Screen

Can be modal or non-modal

Require action from users

Offer users one or more possible actions from which to choose

Can trigger an app to pause content below, if defined by the app

Cannot be muted or throttled by users

Let you dictate whether background content will pause or not
A alert cannot use other features in the background until the alert window is closed. When the button displayed in the alert popup is pressed, the alert popup will close. In the case of Non-Modal, you can close it by selecting an area outside the Popup or by pressing the 'Home', 'Exit', or 'Back' key on the remote. Generally, Non-Modal should be used, and Modal should be avoided unless in special cases. Modal is used when the user must confirm something, indicate progress, is required by regulation, or cannot easily recall it.
If the virtual keyboard is present when an alert is generated, the virtual keyboard will animate off the screen before the alert appears. Alerts will never overlay the virtual keyboard. See  Virtual Keyboard  for more information. However, the appearance of an alert will cause the virtual keyboard to hide. The virtual keyboard will reappear after the alert is dismissed. If users select a text field when a non-modal alert is displayed on the screen, the alert will be self-dismissed before the virtual keyboard appears. Users cannot interact with text fields in the content area, while the modal alert is displayed on the screen.

No Headings
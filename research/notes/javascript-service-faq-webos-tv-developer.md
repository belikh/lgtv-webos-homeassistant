---
title: JavaScript Service FAQ | webOS TV Developer
id: javascript-service-faq-webos-tv-developer
tags:
- lgtv-webos-ha-root-1a89ff
- locus-companion-lifecycle-enact-vs-js-service-vs-systemd-persistence
created: '2026-08-28T02:15:13.234785Z'
updated: '2026-08-28T02:33:55.760983Z'
source: https://webostv.developer.lge.com/develop/guides/js-service-faq
source_domain: webostv.developer.lge.com
fetched_at: '2026-08-28T02:15:13.233373Z'
fetch_provider: builtin
status: draft
type: note
tier: unknown
content_type: unknown
deprecated: false
---

JavaScript Service FAQ | webOS TV Developer

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

JavaScript Service FAQ
Q1. How do I test my service?

To test the JS service, see the following articles.
App Testing on webOS TV
Testing a JS service with CLI
Testing a JS service with Simulator
Q2. How do I debug my service?

A useful CLI tool, ares-inspect, included in the SDK, enables debugging. Use the following command to launch Node Inspector in your browser for the HelloWorldService example. About using CLI for debugging JS service, you can also find information from Launch Node Inspector.
ares-inspect -d emulator -s com.mycom.helloworldservice.service -o
For more information on using node-inspector, see their Github page.
Q3. Why does my service quit after 5 seconds, with a "No active activities" message?

There is a 5-second timer built into the webos-service library, which causes services to exit if they're not currently active. For purposes of this timer, a service is considered to be active if either of the following is true:
It has a subscription taken on it from another application or service
It has received a message to which it has not responded yet [with message.respond()]
Q4. Why does my service never exit?

As a corollary to the above, if your service seems to be hanging around when it should have already quit, there are a couple of possibilities. It may have gotten a message that it never called respond() on, or it may have an outstanding subscription from another service, or it might just be stuck in an infinite loop.
Q5. How can I change the idle timeout to last longer?

There will be an API added to the Service object to support manipulating the timer. For now, you have to do this through the ActivityManager object:
var Service = require("webos-service");
var service = new Service("com.example.myservice");
service.activityManager.idleTimeout = 15;
// this timeout is in seconds
Q6. How do I disable the idle timeout permanently?

First, make sure you need to do that.
In general, you want to work with the standard service lifecycle, rather than against it. In particular, if your service is waiting for some condition to change, you'd be better off registering an activity with ActivityManager, and having ActivityManager re-launch your service when the conditions are met.
The best way to disable the timeout is to create an ActivityManager activity that you keep "live" for the time that you need to service to keep running. This is the best way to do this because it not only causes the timer to be disabled but will also protect your service from being killed by the ActivityManager if someone enables the idle-task-killing feature of ActivityManager.
// create an Activity
var keepAlive;
service.activityManager.create("keepAlive", function(activity) {
keepAlive = activity;
});
// When you&#39;re done, complete the activity
service.activityManager.complete(keepAlive, function(activity) {
console.log("completed activity");
});
Q7. When I try to send a message to my service, I get a 'Service does not exist' error, what does that mean, and how can I fix it?

This means that the hub doesn't know about your service. Here are some things to check:

Check that the service name in the application exactly matches the service name the service registers under.
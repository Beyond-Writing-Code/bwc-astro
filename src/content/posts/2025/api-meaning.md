---
title: "Don't tell me what API stands for"
date: '2025-04-25'
originalDate: '2022-06-06'
excerpt: 'Let’s talk about what an API actually is. When I first learned about APIs, all I ever heard for a definition was what the letters stood for: Application Programming Interface. As if that told me anyth...'
categories: ['coding']
tags: ['API']
featuredImage: '/images/posts/2025/api-meaning.jpg'
---

Let’s talk about what an API actually is.

When I first learned about APIs, all I ever heard for a definition was what the letters stood for: Application Programming Interface. As if _that_ told me anything useful.

The only “what it stands for” that I’ve found less useful was learning what REST stands for, as in “REST APIs”. That expansion is so useless to me that I’m not even going to share it here.

If you didn’t know REST, did you go look it up? Am I right or what??

# An interface is an agreement

So what is an Application Programming Interface? Let’s start with the “interface” part. When you hear that word, think “agreement”.

Consider, for a moment, a microwave:

![microwave](/images/posts/2025/microwave.jpeg)
_Photo by [Erik Mclean](https://unsplash.com/@introspectivedsgn?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=medium&utm_medium=referral)_

You have an agreement with your microwave. When you press ‘3’ and ‘0’ and ‘Start’, your microwave will respond in a predictable way: it will start heating your food and maybe spin a carousel, it will display a countdown timer for 30 seconds, and it will beep when the time’s up.

This agreement, and the keyboard (and display and beeping) that let it be executed, are the interface. Specifically, this is a _user_ interface, because you are the user of the microwave.

So far, so good?

# The programmer’s agreement

Now, let’s say you have an app on your mobile device that lets you control your microwave. I don’t know why you’d want to do this. This sounds like a recipe for overcooked food, or a mess splattered all over your microwave. But let’s say that’s what you have.

![Person holding phone with coffee cup nearby](/images/posts/2025/api-meaning-phone-coffee.jpg)
_Just going to heat up my coffee… from the next room. (Photo by [Paul Hanaoka](https://unsplash.com/es/@plhnk?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=medium&utm_medium=referral))_

You now press ‘3’ and ‘0’ and ‘Start’ on your phone, and your microwave responds. There’s still a user interface here — the interface between you and the phone is the user interface.

But there’s also another interface here: between the mobile app and the microwave. There’s an agreement between the developers of the mobile app and the developers of the microwave: when the app sends data in a specific format to the microwave, the microwave will do stuff, and maybe even send some data back to the mobile app when it’s done.

That’s not a user interface, between the app and the microwave. That’s a programming interface… an _application programming interface_. An API.

# Is it “an API” or “APIs”?

One more thing to know: people play fast and loose with the term “API”. It is used to refer to the overall interface between two systems. It can also be used to refer to a specific subset of the interface, which could also be called an _endpoint_: maybe the microwave has a “cook” API, a “set timer” API, and a “toggle light” API for that light I always wish was brighter when I’m standing at the stove making dinner. And these APIs are part of the larger API. 🙃

In case that wasn’t enough, a server that provides the API might also be called an API. As in: “the microwave API \[server\] is down, so the APIs \[the actual endpoints\] aren’t responding, and the app won’t work.” Fortunately, you can usually figure it out from context.

---

Did this clarify things for you? Do you have a real world use case for the ability to microwave something while not physically present in front of the microwave? What other abbreviations do you know where just knowing what the letters stood for didn’t help much at all in understanding what it means? And shout out any good resources you know for understanding what REST APIs actually are!

Originally posted 6 June 2022 on [Medium](https://bouncingleaf.medium.com/stop-telling-me-what-api-stands-for-80336be81e4d).

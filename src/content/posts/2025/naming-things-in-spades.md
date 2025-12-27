---
title: 'Naming things, in spades'
date: '2025-04-25'
originalDate: '2022-05-30'
excerpt: 'Naming things is hard. One of the hardest things in computer science, as the saying goes. I once spent a full day trying to find the perfect name. Does that seem excessive? Well, consider these factor...'
categories: ['coding', 'work']
tags: ['coding practices']
featuredImage: '/images/posts/2025/naming-things-in-spades.jpg'
---

Naming things is hard. One of the hardest things in computer science, as [the saying](https://www.martinfowler.com/bliki/TwoHardThings.html) goes.

I once spent a full day trying to find the perfect name. Does that seem excessive? Well, consider these factors:

- I was coding a major feature of the application. All users, whether they were customers or colleagues, would use whatever name I chose. It would even be an option on the main menu.
- A large part of the codebase would also use the name. Developers would see it a lot.
- I refused to choose an obscure name or a name so long that it would get abbreviated. Nobody should have to ask what it meant.
- Many potential names were already in common use for related, but not identical, concepts. Some of those names would even appear on the same screens.

I finally found the perfect name. We integrated it into the application design, the code, and the way we talked and thought about that feature.

You know where this is going, don’t you…

Many months later, we changed one of the tools we used as developers. The new tool used the same name for yet another related, but not identical, concept. 😭 After much agonizing, we changed the name of the feature, and I spent another full day updating every reference to it across the entire application and all of our documentation.

So, as someone experienced in the sport of naming things, I can help. Let me make it easier for you.

# S

That’s right… `S`.

True story: I once spent hours trying to troubleshoot a program where all of the variables had single letter names. By the time I figured out how `C`, `D`, `E`, `H`, `P`, `M`, `N`, `R`, `S`, and `W` all fit together, I had forgotten what I was looking for and why.

Also, it was causing a production issue, and it was several hours past my bedtime. I was groggy and desperately trying to fix everything before user traffic started to pick up in the early morning hours.

![Painted letters on tiles](/images/posts/2025/playing-cards-spades.jpeg)

_Photo by [Surendran MP](https://unsplash.com/@sure_mp?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=medium&utm_medium=referral)_

“It seemed like a good idea at the time,” the code’s author said when I confronted him about it the next day. 😠

Would it help to have comments telling you what `C`, `D`, `E`, `H`, `P`, `M`, `N`, `R`, `S`, and `W` all represent? Maybe, but sooner or later someone’s going to change the code without updating the comments, and then the outdated comments might actually make things more confusing.

So, rule one: No single letter variables. Please and thank you.

The only exception might be a small `for` loop where it’s clear that `c` or `i` is a simple counter, like this:

```
for (let i = 0; i < 9; i++) ...
```

Otherwise, please call a spade a `spade`, not an `S`.

# Say what you mean

That said, `info` is not much better than `i`. Info about what? You can do better than that.

92.84% of the time, adding `info` and `data` and `details` doesn’t contribute to the conversation. It’s okay for `customer` to refer to an object with all the details about the customer. You don’t need to call it `customerDetails` or `customerInfo`. Think of how much nicer it will look when you use dot notation: `customer.firstName` beats `customerData.firstName`.

Granted, 7._something_% of the time (I can’t be bothered to do the math on my made-up statistic), you won’t have a choice. You _have_ to differentiate between `customer` and `customerDetails`, and there’s just no getting around it. You’ll know those times when you see them. Keep it simple until the code strong-arms you into doing otherwise.

Rule two, then: call a spade a `spade`, not a `digToolInfo`.

![Person using a spade to dig in garden soil](/images/posts/2025/naming-things-digging.jpg)

_Someone using a `digToolInfo` to `unsettle()` some `plantingSubstrate`. (Photo by [Anaya Katlego](https://unsplash.com/@anaya_katlego?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=medium&utm_medium=referral))_

# Keep it short

You don’t call the bank and ask “what is the current value of the total amount of money in my account?” You don’t call the bank at all these days, but that’s beside the point. You’d just ask: “what’s my balance?” No need to call it `currentValueOfTheTotalAmountOfMoneyInTheAccount` when it’s a `balance`.

It might be a `currentBalance` if you need to distinguish it from some other kind of balance — `previousBalance`, maybe, or `projectedBalance`. If `balance` is just as clear, though, use it.

How DO people get their bank balances these days, anyway? I log in to my bank website and look it up, but I bet by now that’s old school. Probably you record a video of yourself dancing to a song about your bank balance and post it to TikTok, and a bot from your bank will text you with the value and a relevant movie clip as commentary.

![Person dancing joyfully while someone else records them with a phone camera](/images/posts/2025/naming-things-dancing.jpg)

_Just checking that bank balance (Photo by [Amanda Vick](https://unsplash.com/@amandavickcreative?utm_source=medium&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=medium&utm_medium=referral))_

Rule three: it isn’t a`compactToolUsedForDiggingInOrderToPlantInTheGarden`.

Okay, I think you’re getting the idea. Call that spade a spade, and you’re good to go.

---

Have you ever had to deal with code that just made no sense? Did you get angry at whoever wrote that garbage, only to look it up and find that _you_ wrote it, six months prior? I feel you. Worst programmer ever is Me From The Past.

Think of it this way instead: you’re so much better of a programmer now than you were six months ago! Learning and growing, that’s how you’re rocking it. Go you!

Originally posted 30 May 2022 on [Medium](https://bouncingleaf.medium.com/naming-variables-in-spades-cb3126c34f8).

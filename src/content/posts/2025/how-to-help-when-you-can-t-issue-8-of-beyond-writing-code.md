---
title: "How to help when you can't, issue 8 of Beyond Writing Code"
date: "2025-07-09"
excerpt: "Sometimes the best help is just being there and suffering with a friend."
categories: ["helping","troubleshooting"]
tags: ["Beyond Writing Code newsletter","helping others","bonus story","suffer with a friend"]
featuredImage: "/images/posts/2025/how-to-help-when-you-can-t-issue-8-of-beyond-writing-code-1.jpg"
published: true
comments: []
---

_Beyond Writing Code #8_

_July 9, 2025_

"Don't suffer alone, suffer with a friend!"

One of my favorite pieces of advice. Stuck on something? Don't spin your wheels by yourself. Ask for help!

But there's a reason I say "suffer with a friend" here. Sometimes, I see a request for help from another developer, and I don't know how to assist. But if nobody else is answering, I'll often try to help regardless.

Why? I have been stuck on tough coding problems by myself, with no support. It's stressful. At a minimum, I want every anguished cry to get a response. There's no need to suffer alone.

![black and tan german shepherd on green grass field during daytime](/images/posts/2025/how-to-help-when-you-can-t-issue-8-of-beyond-writing-code-1.jpg)

*"Now what?" Photo by [Anna Dudkova](https://unsplash.com/@annadudkova?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/black-and-tan-german-shepherd-on-green-grass-field-during-daytime-Y9XRyobtsBI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)​*

And sometimes, I manage to be useful anyway, even if I have no idea what the person should do.

How is that possible? How can we answer someone's questions if we don't know the answer?

## What if it was just you?

Years ago, I was stuck on some problem, and I asked myself this question:

What would I do if this was the single most important problem the company had, and I was the only person in the whole company who could solve it?

Nobody to call for help. No way to hand the problem off to a more knowledgeable coworker. Doesn't matter if it takes me a while, but I have to solve it, just me and whatever resources I can find.

The idea here is not to raise the stakes, but to force me to consider all of my options and get creative. Otherwise, I might try two or three things and then give up easily and ask a colleague.

Or worse, I might procrastinate on solving it because I'm intimidated. That's why it has to be the "most important" problem: I can't just ignore it and work on something else for a while.

Now, I'm only suggesting _imagining_ this, not actually doing this. When you've tried and you're stuck, ask for help rather than spinning your wheels.

And I've solved many tough problems by doing something else for a while. Like eating. The thing I couldn't figure out in the hour before lunch? I have solved it in five minutes after lunch.

But before you decide that you're just plain stuck, I do recommend a round or two of "what if it was up to me?" to see if it generates more ideas.

## Example

It looks like this:

Let's say I'm getting a weird error that mentions a package I'm using. When I back out my code changes, no more error. But I don't know why my code is causing the error.

I have tried a web search for the error, but the results are all from 2017. The current version of the package shouldn't have this problem. I upgraded the package to the latest version, just to be sure, but it didn't help.

Besides, another team uses this package, and they aren't having this problem. I looked at their code, but I don't see how it's any different from mine.

Okay, imagining that I have to solve this on my own... What else could I try?

*   I could search Slack and email to see if anyone has mentioned this before. You never know.
*   I could report it as a bug and see if the package maintainers can help, but I'm pretty sure the problem is my code, not the package.
*   I guess I could start with known good code, and then add my code changes a little at a time until I get the error. That might take a while, but it might help narrow it down.
*   Or I could start with my broken code and remove my changes a little at a time until it works. That might be faster in this case.
*   What else is different for the other team? Their application doesn't require the user to sign on... is that relevant? Hmm...
*   Wait, this package uses a config file. Is the other team's file the same as mine?

## Two player mode

You can use a similar mental trick to help someone else. Imagine that they have to solve the same problem, and you're the only one who can help.

They tell you what they've tried. They didn't find any clues on Slack, email, or in the config file. They narrowed it down to a specific code change, but they still don't see what's wrong. User sign-on doesn't seem to be relevant.

Since you know even less about the problem than the person you're trying to help, start with some questions: What does this package do? What exactly are you trying to accomplish with your code change? Is there another way to do that?

Maybe you'll realize that the code change they're making isn't even the right answer for the problem they're trying to solve. You can't help them fix their code, but you can help them avoid the code change entirely.

If not, you could look at their code. You don't know what most of it does, but maybe you'll see... something? The brain's capacity for recognizing patterns is amazing.

You notice that their code seems to rely on some variables being set up. You remember having a problem once, three or four years ago, because you assumed your variables were set up a certain way and they weren't.

"Have you confirmed that your variables are set up the way you expect?"

"Yeah, I looked at those values, they're correct."

Okay, that's not it. Still staring at their code, you notice a reference in the code to something you've never heard of.

"What's this on line 37?"

"Oh, that's a third party service we use."

"Could that be affecting this?"

"I don't think so. Unless... wait, let me check something."

Fifteen minutes later, they have figured out that their code change affects the third party service, which in turn affects the user data, which affects the package, causing the error. They don't know how to fix it yet, but they are back in business with troubleshooting.

## Better than a rubber duck

"Rubber duck debugging" is describing your problem to a rubber duck. Yep. The trick: just the act of clarifying your thoughts enough to explain it to someone else, even an inanimate someone else, is often sufficient to let you come up with the solution, or at least a few more troubleshooting ideas.

![](/images/posts/2025/how-to-help-when-you-can-t-issue-8-of-beyond-writing-code-2.jpg)

*"I could block the third party service call and see what happens. I'll try that. Thanks for listening." (photo by Getty images from Unsplash)*

If all you can do is listen to someone who is stuck, you might simply be an especially encouraging and friendly rubber duck. But that's not bad. That might be all they need.

But your ability to ask questions back will be an advantage, as will your ability to think: "if I had to solve this problem, what would I try next?"

With two people troubleshooting, you have a better chance at pattern recognition, at seeing things from different perspectives, at connecting things to different experiences from the past.

And the "what if only I could help" trick gets your brain to let go of the conclusion that you don't have anything to offer just because the solution wasn't apparent to you when you first heard the question. If you have to help, then it doesn't matter whether or not you know the answer. You have to try to figure it out anyway. You'll get creative.

## Connections with others

Helping someone else out helps you build genuine connections with others. Even, or maybe even especially, if you aren't the hero rescuing someone but simply another human willing to be there and try.

Many of my best professional connections have come from working alongside someone else on a challenging problem. Which is how this topic came to mind.

Do you enjoy networking? Not the "routing traffic between computers" type, the "meeting new people" variety.

This statistic is made up, but: 99% of people dread networking.

I had a lot to say about it, so I put that in a blog post: [I attended networking events so you don't have to](https://www.beyondwritingcode.com/2025/07/09/better-than-networking-events/).

And one of my suggestions for what to do instead was helping others. I said:

Even if you can’t help and the other person is still stuck, at least they aren’t stuck _and alone_.

That statement deserved a deeper dive, and here we are.

## How's the book going?

As you may know, you might be reading it. All of the blog writing, the newsletter writing, is potential book material.

But beyond that, I have signed up for a Book Proposal Power Program, run by staff from The Book Academy (of which I'm a graduate). Luvvie Ajayi Jones, who runs The Book Academy, is on sabbatical to get some writing done, but she's left us videos with her words of wisdom. Also, the folks she has working with her on The Book Academy are on point.

The goal: eight weeks to get a book proposal done. Starting this week. It's on!

I think of you as I write. Those of you who are developers, and those who are not. People I've worked with, and people I have other connections with. You may have known me since I was a kid, or you may have never even met me in person. We might have last talked yesterday, or years ago.

However it is, I'm glad we're connected.

## Drop me a note, plus a bonus story about the Red Sox

I would love to hear from you. Hit reply and let me know what's on your mind. Yes, I do actually read replies, and if I don't answer you it's probably sitting in my outbox unsent, oops.

_DMARC vs. demarc_

I also had some email deliverability issues recently due to my custom domain name being new. Whew, good thing I am no stranger to DNS records, because this week I learned about email authentication and DMARC.

No, it's not the same as a demarc. Demarc is short for demarcation line. In my time working in network engineering for an internet company, "demarc" referred specifically to the line between what was telephone company (telco) property and what was our property as an internet provider.

Our side of the demarc, we fix it. Their side of the demarc, we don't touch it.

I worked a late shift, so I often took over problems that hadn't been resolved during the day. One day, the ongoing problem was that the T1 line for the Boston Red Sox was down, and had been down for several hours. Back then, a T1 was the primo way for your business to connect to the internet. So this was not good.

After much troubleshooting, as well as politely ignoring my coworker who had a new bogus theory once an hour, I was pretty sure that the trouble was on the telco side. I needed them to reset the line, which they could at least attempt from their office without even dispatching someone to the customer site.

The problem: my company had recently been acquired by said telco. From the customer's perspective, "they" were also "us," even though it was two separate businesses. And the guy from the telco side of the house wasn't buying my theory and refused to reset the line. Time to escalate to management.

Sometime around 9pm, I was sitting in the network operations center, a dark room lit only by the glow of multiple monitors. I was on the phone with the tech from the Red Sox, who was getting to be an old friend by this point.

I don't think we were even saying anything on our call. Just hanging out, with each of us typing and trying to figure out what to do next.

Then he says: "You know, I wonder..."

"Yes?"

There's a pause.

"Oh, shh—" he says. Then, more cheerfully: "No... wait a minute..."

I stare at my screen. I've been sending their circuit a ping for hours with no response.

It has just started responding.

"You're pinging. Your circuit is up. What did you do..."

"Well, there's this box on the wall with four lights. I'm probably not supposed to touch it—"

I'm thinking, _yep, that's on the telco side of the demarc._

"—but I noticed that one of the lights was red. Green, green, green, red. That didn't seem right. So I figured, why not, and I hit the reset button."

In other words, he has just done what I've been trying to convince the telco guy to do.

![Animated clip of Patrick Stewart as Jean-Luc Picard of Star Trek, doing a facepalm](/images/posts/2025/how-to-help-when-you-can-t-issue-8-of-beyond-writing-code-3.jpg)

When the customer fixes the problem for you.

He continues: "When I did that, all of the lights turned red. That's when I swore. But after a few seconds, all four lights went green. We're online!"

"Nice work!" I said. "We're hiring, by the way."

And then I called the telco guy and let him know that the customer had reset his equipment for him and we were all set. Sheesh.

* * *

Know someone else who would enjoy this? They can subscribe here: [https://www.beyondwritingcode.com/connect/](https://www.beyondwritingcode.com/connect/)​

Thanks for reading!

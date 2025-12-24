---
title: 'Developers do more than code'
date: '2025-12-15'
originalDate: '2025-12-15'
excerpt: 'People who define the role of the developer as “someone who writes code” may be surprised to learn that developers do much more than write code. Those of us who have lived the role know otherwise. So ...'
categories: ['coding', 'productivity', 'work']
tags: ['making mistakes', 'not just coding', 'what developers do']
featuredImage: '/images/posts/2025/developers-do-more-than-code.jpg'
---

People who define the role of the developer as “someone who writes code” may be surprised to learn that developers do much more than write code. Those of us who have lived the role know otherwise.

So I thought. And yet, last week I walked right into that “developers just write code” mindset myself, right here in my blog. Did you catch it? I sure didn’t!

## Look what I messed up

Some people choose to conceal their errors. I’m more of the type to shout: “Hey, everybody! Check out this foolish thing I just did!”

I’ve gotten so good at laughing at myself when I make mistakes that I now think I’m pretty funny.

![](/images/posts/2025/creature-feature-1.png)

Things I’ve said when I mess up:

> Mom always said I should serve as an example to others! Hey, she didn’t specify “example of what to do” or “example of what _not_ to do.”

I like that joke, but it’s not true at all. Mom never said that. (What _did_ she always say? “Let’s make a list.” She was a big fan of making lists.)

Or how about this:

> I’m required to break production at least once per year! It’s in my contract.

That’s not true either. But it has been helpful as a reminder to others that mistakes are just part of the job.

Well. [Last week](https://www.beyondwritingcode.com/2025/12/10/ai-and-i-built-a-website-yesterday/), I shared that I had gotten my new website “95%” working in a few hours. The “last 5%” took the rest of the day, I reported.

Huge, huge correction: What I had accomplished in a few hours was getting it 95% _coded_. Not 95% done.

As I’ve been trying to tell people for years (never mind in every conversation this year about how AI will or won’t replace developers), “coded” and “done” are two different states.

Who needs a definition of done, though, when you’re working by yourself? Me, apparently.

![](/images/posts/2025/creature-feature-2.png)

Getting it “done” enough to actually deploy it to [bouncingleaf.com](https://bouncingleaf.com) (where it resides as of this morning) took a lot longer than the rest of the day.

## What else do developers do?

**Code quality.** Would you like the code to be readable by humans, maintainable, and consistent? I would. I made sure my code got the thumbs-up from TypeScript checking, ES Lint, and Prettier for code formatting.

**Security.** I had it check for vulnerable packages and fix the most severe ones. Good to go, right? Not so fast. There’s plenty more to check. I had AI do a security audit and it found a bunch more things to fix.

**Performance.** Lots of images on my site, was I optimizing them? I was not. Checking bundle size? I was not. Lazy loading? I was not.

**Unit tests.** Even with AI running the show, unit tests still give you increased confidence that by fixing thing B, or implementing thing C, you didn’t just break thing A.

**Accessibility.** Fortunately, I’d asked for this from the start, so there wasn’t much to check here.

**Responsive design.** Same.

**Search Engine Optimization (SEO).** As someone used to running authenticated sites, I’m not used to thinking about SEO. AI handled some SEO basics for me.

**Build optimization.** Asked Claude this morning if we could make my build faster so that I can get changes deployed faster. Yes… this too.

**Dependency management.** I already told you [my story](https://www.beyondwritingcode.com/2025/12/10/ai-and-i-built-a-website-yesterday/) of having to update most of the site’s packages all at once. Keeping packages up to date is important for maintaining a secure site.

But it’s only occurring to me just now as I type… have I got anything in place to make sure that happens _regularly_? Hmm.

Even now, when I think I’m “done,” I’m remembering that ongoing maintenance, even for a simple site like mine, is still necessary.

## And that’s a simple site

And all of the above is indeed for a simple website. Just text and photos, that’s it.

There’s no authentication or sign-on, not even an admin login. Because it’s entirely public, there are no privacy concerns. It doesn’t take input or store data; there’s no database or back end at all.

Given that it’s my personal site, with traffic only from a few people who know me, I don’t need analytics or a content delivery network. It isn’t serving ads or streaming videos; it just offers pictures of cute creatures.

![](/images/posts/2025/creature-feature-3.png)

## Organization of one

Furthermore, I’m an organization of one. The only stakeholder whose opinion of this site really matters is me. I don’t need to try to make sense of someone else’s requirements or design documents.

The site doesn’t need to conform to any corporate design standard. I’m also the entire architectural review board. Granted, my “architectural review” has mainly consisted of glancing at whatever Claude is proposing and hitting “yes” as long as it doesn’t seem patently ridiculous.

And likewise, the only stakeholder whose opinion of the code really matters is also me. The code only needs to meet my standards. In more complex applications, multiple perspectives will likely lead to better code and architectural design. But for something this simple, it’s okay for it to be just me.

I have no other developers to train or mentor, to review code for, or to answer questions from. I do still generate documentation, for the same primary reason I always have: for my own reference! And I’ve had Claude generate some for its own reference as well. But I don’t need to be concerned about whether that documentation will be clear and useful for others.

## I can code that in a weekend

I’ve written in the past about a stakeholder who suspected a developer was [deliberately overestimating](https://leafjessicaroy.kit.com/posts/deliberately-wrong-estimates) a task they “didn’t want to” do. The stakeholder said, as evidence that the developer’s estimate was too long, that the stakeholder just coded it themselves over the weekend.

Aside from the advantage of flexibility and uninterrupted time that developers don’t normally have, this stakeholder may or may not have had a clear and complete definition of done.

The satisfaction of getting something to work is immense. And it’s exciting to see something new come into existence quickly. Software development is such a fun profession.

But getting the code to work is far from the only job of the developer. It’s brutal, especially for novice developers who go through a lot of angst trying to get their code to do what we want with no errors. I have to test it, and make it secure, and make it performant… can’t someone else do all that boring stuff?

The good news is that AI may be able to take care of a lot of the “boring stuff” with some supervision, allowing us to enjoy more of the triumph of getting things done.

But we still need our experience, judgment, and knowledge of the bigger picture to help make sure that “95% done” isn’t just “95% coded.”

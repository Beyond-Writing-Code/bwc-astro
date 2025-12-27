---
title: 'Bug hunting'
date: '2025-04-26'
originalDate: '2025-04-26'
excerpt: 'I once had a colleague who (jokingly) left this comment on a code review, and not in reference to a specific line of code:  “Missing semicolon.”'
categories: ['AI', 'coding']
tags: ['debugging', 'manual vs. ai']
featuredImage: '/images/posts/2025/bug-hunting-laptop.jpeg'
---

Another post I made a while ago on Medium, but this one I updated today with some newer thoughts.

---

I once had a colleague who (jokingly) left this comment on a code review, and not in reference to a specific line of code:

“Missing semicolon.”

![person typing on a laptop](/images/posts/2025/bug-hunting-laptop.jpeg)

_Photo by Nubelson Fernandes on Unsplash_

# Case study two

I once had a QA colleague who reported a bug to me in some code I had just written.

I made a code fix, but he said it was still broken.

Another fix, still broken.

Another, still broken.

Then he messaged me: “Never mind! User error!” and explained what he’d done wrong.

I think of both of these case studies often.

This post originally ended here, with “Yeah, that’s the whole post :)” when I posted it as “Ghost errors” on [Medium](https://bouncingleaf.medium.com/ghost-errors-fb1202e41adc) on 24 August 2023. But I’m posting it again in 2025, and there’s more to say.

First of all…

What the above case studies have in common: reviewing something again, even if you’re not entirely sure what you’re looking for, can be a good thing.

My reviewer colleague was joking about the missing semicolon. I think. Maybe I should just look through the code one more time.

And my QA colleague was not joking, but the “bug” he was reporting was not actually a malfunction of the software (although it was arguably a design issue if even someone so knowledgeable about the product would be using it “wrong”). Regardless, it led to my finding and fixing three other problems that neither of us realized were there.

Case study three

A colleague recently was working on an application that had a bug that only happened at a certain time of day. He asked his AI coding assistant tool to write him a set of tests to test all the places in the code where time of day was a factor.

And one of those tests failed.

Questions

Have you ever gone into your code to look for a bug that wasn’t actually there – but in the process, you’ve found some other things that need fixing?

Wonder what happens if we send our AI assistants into our code to identify the bugs for us? Have you tried this? I’ve tried asking my coding assistant for suggestions on improving the code, but I haven’t said “there are some bugs in this code, please identify them and suggest fixes.”

And here’s the question most on my mind right now:

Do we lose something in using the AI tools? Is this the equivalent of using a dirt mover instead of using shovels – more powerful, less toil but also less exercise, probably better in some circumstances? What am I doing to keep myself in shape in case I need to pick up a (code debugging) “shovel” someday?

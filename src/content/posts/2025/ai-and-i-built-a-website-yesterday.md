---
title: 'AI and I built a website yesterday'
date: '2025-12-10'
originalDate: '2025-12-10'
excerpt: 'Early morning yesterday, I was wide awake at 4:30 a.m. for no clear reason. And I had one of those 4:30 a.m. thoughts: You know, I could move my personal website off of AWS, and save some money. In fa...'
categories: ['AI', 'learning', 'productivity']
tags:
  ['build a website in a day', 'building expertise', 'how AI changes things', 'junior developers']
featuredImage: '/images/posts/2025/ai-and-i-built-a-website-yesterday.jpg'
---

Early morning yesterday, I was wide awake at 4:30 a.m. for no clear reason. And I had one of those 4:30 a.m. thoughts:

> _You know, I could move my personal website off of AWS, and save some money._
>
> _In fact, I could rebuild my website_.

Now, the last time I did any serious web development was several years ago, and even then it was more back end development than front end. This is no longer “just what I do.”

**But… there’s AI.**

That emboldened me enough that I got out of bed and went to the laptop.

## Let’s plan

To draw up plans for the site, I started with Claude AI (the chat interface for the general public), rather than Claude Code (the AI tool specifically for writing code).

What I wanted to do: build a replacement website for [bouncingleaf.com](https://www.bouncingleaf.com/), deploy it somewhere, test it out, and then repoint my existing domain name to the new website with minimal downtime. I had Claude draw up a step-by-step migration plan.

![Screenshot of existing bouncingleaf.com website](/images/posts/2025/bouncingleaf-old.jpg)

Current bouncingleaf.com

I also described the website I wanted, including making it responsive (so it would look nice on mobile) and accessible. Claude tacked on some additional requirements: image optimization, lazy loading. After some clarifying questions (What did I like for a color scheme? How did I want to set up the photo gallery?), Claude created the requirements document.

## Executing the plan

Once I had both documents, I moved the website plan into an empty folder. From Visual Studio Code (my favorite code editing program), I opened a terminal window, and invoked Claude Code by typing:

`claude`

Then I told Claude Code to review the document and set up a basic code repository with sensible defaults.

I was expecting an empty git repo, maybe a nice .gitignore file. It built a fully functional React website with most of my requirements implemented.

Okay then!

**By 7 a.m., I had about 95% of the site working,** scanned for vulnerabilities, and built and deployed using GitHub actions. It looked great, maybe even better than my current site.

That 95% was the fast part.

Everything else took the rest of the day.

Also around 7 am, I ran out of Claude credits and needed to wait until 9 am for my credits to reset. No problem. It was time for breakfast anyway.

I had some Sourcegraph Amp credits (for AI, not for breakfast— that was oatmeal with apples, cinnamon, and walnuts). I asked Amp: Were there any tests, and did they pass? There were none. Always good to have a second AI review the first AI’s work. Amp wrote some tests, and I did some other cleanup while I waited for my next Claude window.

I didn’t know that I was about to put those tests to work.

Updates

Once I was back in motion with Claude Code, I noticed a warning in the build process about a deprecated version of Prettier, the code formatting tool. Oh really? Anything else need updating, Claude?

Claude checked. Yes. **We need major version updates of React, react-router, Tailwind CSS, ESLint… pretty much every package used in the application.**

For those of you who aren’t developers: this is like when your computer, phone, or some app asks you to update. And _packages_ are like apps that developers use in the products we create. Wait, software used inside other software? Yep, just like an engine is a machine used in a car, which is also a machine.

And if you’re starting to get the feeling that I just said, “So, I need new windshield wipers, anything else, Claude?” and Claude said, “yep, new engine, transmission, and braking system,” that’s about right. There isn’t a comparable cost, but it’s far from a 15-minute project.

My heart sank for a moment, just out of habit. Major updates usually break code. And fixing what broke may, in turn, break something else. Swap out the engine, and something that previously worked might not.

Furthermore, a major package update for something central like React almost always requires major updates to other packages too, so that they remain compatible. Update the whole braking system, and you might need to change the connectors that control the brake lights too.

And none of this is guaranteed to work out. Putting a 2025 transmission in a 2019 model of the same car… not guaranteed to fit.

Claude asked me if I wanted to take it slow, making the safest updates first, and carefully testing the functionality before deciding to proceed. That’s a great idea, and exactly how I’d proceed in a production application.

I said no. Just update it all.

I watched as Claude worked for maybe 10-15 minutes, upgrading a package, testing to find out what broke, troubleshooting, fixing, and moving on to the next package.

And when it was done, all the tests passed, and the website worked.

![Screenshot of newly rebuilt site, soon to be on bouncingleaf.com.](/images/posts/2025/bouncingleaf-new.jpg)

The future bouncingleaf.com.

A major upgrade process that would strike fear (or at least lots of dread) in the heart of a developer, done flawlessly in 15 minutes?

That’s not just time saved, that’s toil eliminated.

Reload

With that upgrade handled, I focused on cleaning up a bunch of small issues. Change the font here, add spacing there, make some text into a link.

Things were starting to look great. Then I noticed this bug:

1.  Load the site and click a link to go to the art page: fine
2.  Hard refresh on the art page: page not found.

Claude correctly concluded that there was something amiss with the .htaccess file. This was ringing a very faint bell for me, suggesting I’d seen this years ago…

However, Claude nearly led me on a wild goose chase about it. When an update to the file didn’t work, it continued to suggest other updates to the file.

Meanwhile, that faint ringing bell led me to check the web server. Sure enough, the file wasn’t there. But why not?

We confirmed it was on GitHub. Claude’s work here is done. Time to interview another AI.

GitHub Copilot suggested some diagnostic code we could use to confirm the file was there at the end of the build, right before the deploy is triggered. It was there, so the problem had to be in the deployment.

The deploy process uses something called rsync, a tool about which I know next to nothing. I did a little reading about rsync and tried a fix (a flag to specifically tell it “hey, include .htaccess”). That did not help.

Thankfully, GitHub Copilot had another idea: switch to using .tar.gz (I think it was using .zip earlier). This should hold onto dotfiles more reliably.

I gave it one last build and deploy before signing off for the night. The .htaccess file appeared on the server at last, and the refresh worked.

Expertise

It’s great that AI can take over a tedious and risky task like writing comprehensive tests and then using them to navigate major package updates. That frees me up to work on meeting more of the customer’s requirements.

But wow, Claude was ready to keep hammering on .htaccess. This is not the first time (this month) that I’ve seen this behavior.

I recently watched Zapier’s AI tool convince itself that a problem with my automation script was a bug I should report to Zapier. I reported the bug, but I revisited it the next morning. Within a few minutes, I realized the problem was in my script and fixed it myself.

You might say that, when we shut off our reasoning and judgment (as I had with Zapier, I just wanted their AI to do all the work for me), we can let AI lead us astray, and that’s true.

But how will developers build the expertise and skills that they need so that they have sound reasoning and judgment to apply?

I built my expertise over 20 years of doing annoying tasks like upgrading packages myself, trying to get a website to work, troubleshooting tools I’d never seen before.

For example, I had the confidence to edit the rsync command in my build script by hand because I know how command-line tools in general work, I have edited build scripts before, and I know some signs indicating the quality of coding advice online (citing official documentation, good; “oh I just do xyz and it works” without any explanation of what xyz does, bad).

If AI takes on tedious tasks that junior devs previously handled, how can developers continue to build that intuition that tells them “wait, that can’t be right,” when the AI makes a suggestion?

Those of you who are working as developers: what are you seeing out there? How are you, or your team, or your organization, developing that expertise?

I worked on other projects today, so the progress bar on the new website continues to hover somewhere around 99% until I can confirm that I don’t need any other changes before deploying.

But if you’d like a sneak preview, check it out, here on its temporary home:

[https://quietwoodspath.com](https://quietwoodspath.com)

And I’d love your feedback and thoughts on this topic of wisdom gained through experience. How is AI changing not just how we work, but how we learn and gain our expertise? What have you been doing to grow or maintain your skills or to help others develop their wisdom?

const { WebhookClient } = require("discord.js");
const { getWebHook } = require("../utils");

var uninterjectString1 = `No, $target, it's 'Linux', not 'GNU/Linux'. The most important contributions that the FSF made to Linux were the creation of the GPL and the GCC compiler. Those are fine and inspired products. GCC is a monumental achievement and has earned you, RMS, and the Free Software Foundation countless kudos and much appreciation.

Following are some reasons for you to mull over, including some already answered in your FAQ.

One guy, Linus Torvalds, used GCC to make his operating system (yes, Linux is an OS -- more on this later). He named it 'Linux' with a little help from his friends. Why doesn't he call it GNU/Linux? Because he wrote it, with more help from his friends, not you. You named your stuff, I named my stuff -- including the software I wrote using GCC -- and Linus named his stuff. The proper name is Linux because Linus Torvalds says so. Linus has spoken. Accept his authority. To do otherwise is to become a nag. You don't want to be known as a nag, do you? (An operating system) != (a distribution). Linux is an operating system. By my definition, an operating system is that software which provides and limits access to hardware resources on a computer. That definition applies wherever you see Linux in use. However, Linux is usually distributed with a collection of utilities and applications to make it easily configurable as a desktop system, a server, a development box, or a graphics workstation, or whatever the user needs. In such a configuration, we have a Linux (based) distribution. Therein lies your strongest argument for the unwieldy title 'GNU/Linux' (when said bundled software is largely from the FSF). Go bug the distribution makers on that one. Take your beef to Red Hat, Mandrake, and Slackware.At least there you have an argument. Linux alone is an operating system that can be used in various applications without any GNU software whatsoever. Embedded applications come to mind as an obvious example.||||| `;

var uninterjectString2 = `Next, even if we limit the GNU/Linux title to the GNU-based Linux distributions, we run into another obvious problem. XFree86 may well be more important to a particular Linux installation than the sum of all the GNU contributions. More properly, shouldn't the distribution be called XFree86/Linux? Or, at a minimum, XFree86/GNU/Linux? Of course, it would be rather arbitrary to draw the line there when many other fine contributions go unlisted. Yes, I know you've heard this one before. Get used to it. You'll keep hearing it until you can cleanly counter it.

You seem to like the lines-of-code metric. There are many lines of GNU code in a typical Linux distribution. You seem to suggest that (more LOC) == (more important). However, I submit to you that raw LOC numbers do not directly correlate with importance. I would suggest that clock cycles spent on code is a better metric. For example, if my system spends 90% of its time executing XFree86 code, XFree86 is probably the single most important collection of code on my system. Even if I loaded ten times as many lines of useless bloatware on my system and I never excuted that bloatware, it certainly isn't more important code than XFree86. Obviously, this metric isn't perfect either, but LOC really, really sucks. Please refrain from using it ever again in supporting any argument.

Last, I'd like to point out that we Linux and GNU users shouldn't be fighting among ourselves over naming other people's software. But what the heck, I'm in a bad mood now. I think I'm feeling sufficiently obnoxious to make the point that GCC is so very famous and, yes, so very useful only because Linux was developed. In a show of proper respect and gratitude, shouldn't you and everyone refer to GCC as 'the Linux compiler'? Or at least, 'Linux GCC'? Seriously, where would your masterpiece be without Linux? Languishing with the HURD?`;

module.exports = {
  name: "Uninterject",
  description: "did someone has just interjected?",
  usage: "Just `uninterject`",
  async execute(message) {
    if (
      message.content.toLowerCase().trim().startsWith("uninterject") ||
      message.content.toLowerCase().trim().startsWith("+uninterject")
    ) {
      const args = message.content.slice(this.name.length + 1).trim().split(/ +/);

      let who = args[0];
      who = who ? who : `<@${message.author.id}>`;

      const webhook = await getWebHook(message.client, message.channel.id)
      	.then((hookUrl) => (new WebhookClient({ url: hookUrl })));
      
      await webhook.send({
      	content: uninterjectString1.replace("$target", who),
        username: message.member.nickname || message.author.username,
        avatarURL: message.author.avatarURL(),
      })

      await webhook.send({
      	content: uninterjectString2.replace("$target", who),
        username: message.member.nickname || message.author.username,
        avatarURL: message.author.avatarURL(),
      })

      return await message.delete();
    }
  },
};

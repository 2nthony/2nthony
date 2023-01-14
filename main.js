const fs = require("fs/promises");
const Parser = require("rss-parser");
const parser = new Parser();

// blog
const blogUrl = "https://2nthony.com/";
const blogFeedUrl = `${blogUrl}/api/rss`;
const blogPostsLimit = 5;
const blogPostsFlag = "BLOG_POSTS";
const blogTemplateSlot = "{BLOG_POSTS}";
const blogTemplate = `
## Latest Posts

${blogTemplateSlot}

[👉 More posts](${blogUrl})
`;

main();

async function main() {
  let template = await fs.readFile("README.md", "utf8");

  const posts = await getBlogPosts();
  const blogPosts = blogTemplate.replace(
    blogTemplateSlot,
    posts.map((item) => `- [${item.title}](${item.link})`).join("\n")
  );

  if (blogFeedUrl) {
    template = replacer(template, blogPosts, blogPostsFlag);
  }

  await fs.writeFile("README.md", template, "utf8");
}

async function getBlogPosts() {
  const feed = await parser.parseURL(blogFeedUrl);
  return feed.items.slice(0, blogPostsLimit);
}

function replacer(template = "", content = "", flag = "") {
  const start = `<!-- ${flag}_START -->`;
  const end = `<!-- ${flag}_END -->`;
  const wrap = (str) => start + str + end;

  const regex = new RegExp(wrap("[\\w\\W]+"), "i");

  return template.replace(regex, wrap(content));
}

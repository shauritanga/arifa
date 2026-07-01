const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function scrapeProjects() {
  try {
    const res = await fetch("https://arifa.org/research/research-projects", { agent: httpsAgent });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const projectLinks = [];
    $("a").each((i, el) => {
      const href = $(el).attr("href");
      if (href && href.includes("/research/research-projects/") && href.includes("/project")) {
        projectLinks.push(href);
      }
    });
    
    // De-duplicate
    const uniqueLinks = [...new Set(projectLinks)];
    console.log("Found links:", uniqueLinks.length);
    
    const allProjects = [];
    
    for (const link of uniqueLinks) {
      try {
        const pRes = await fetch(link, { agent: httpsAgent });
        const pHtml = await pRes.text();
        const $p = cheerio.load(pHtml);
        
        let title = $p(".blog-title").first().text().trim() || $p("h2").first().text().trim();
        let image = $p(".blog-img img").attr("src") || $p(".project-details-image img").attr("src") || "/project-placeholder.jpg";
        if (image && !image.startsWith("http")) image = "https://arifa.org" + image;
        
        let content = $p(".blog-text").html() || $p(".blog-content p").parent().html() || "";
        
        // Sometimes the text is not wrapped in .blog-text but just next to .blog-title
        if (!content) {
             content = $p(".blog-content").html() || "";
        }
        
        // Clean up content
        if (content) {
          content = content.replace(/<img[^>]*>/g, ""); // Remove inline images that might break
          content = content.replace(/<h2 class="blog-title">.*?<\/h2>/g, ""); // remove title from content block
          content = content.replace(/<div class="blog-meta">.*?<\/div>/gs, ""); // remove meta from content
        }
        
        const idMatch = link.match(/\/(\d+)\/project/);
        const id = idMatch ? idMatch[1] : Date.now().toString();
        
        allProjects.push({
          id,
          title,
          image,
          content: content ? content.trim() : ""
        });
        console.log(`Scraped: ${title}`);
      } catch (err) {
        console.error(`Failed to scrape ${link}:`, err.message);
      }
    }
    
    fs.mkdirSync('./app/data', { recursive: true });
    fs.writeFileSync('./app/data/research_projects.json', JSON.stringify(allProjects, null, 2));
    console.log("Done writing research_projects.json!");
  } catch (error) {
    console.error(error);
  }
}

scrapeProjects();

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const newsDirectory = path.join(process.cwd(), 'data/news');
// Note: If running from root, it might need 'packages/lp/data/news'. 
// However, typically Next.js sets CWD to the app root. 
// If this fails, we can adjust.

export type NewsPost = {
    slug: string;
    title: string;
    date: string;
    description: string;
    content: string;
};

export function getAllNews(): NewsPost[] {
    // Create directory if it doesn't exist (though it should)
    if (!fs.existsSync(newsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(newsDirectory);
    const allNewsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            // Remove ".md" from file name to get id
            const slug = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(newsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            // Combine the data with the id
            return {
                slug,
                title: matterResult.data.title || '',
                date: matterResult.data.date || '',
                description: matterResult.data.description || '',
                content: matterResult.content,
            } as NewsPost;
        });

    // Sort posts by date
    return allNewsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getNewsBySlug(slug: string): NewsPost | null {
    try {
        const fullPath = path.join(newsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        return {
            slug,
            title: matterResult.data.title || '',
            date: matterResult.data.date || '',
            description: matterResult.data.description || '',
            content: matterResult.content,
        } as NewsPost;
    } catch (error) {
        return null;
    }
}

import { apiUrl } from './config/constant';

export default async function sitemap() {
    // Define an array to hold all sitemap entries
    let sitemapEntries = [
        {
            url: process.env.SITE_URL + "guide",
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        }
    ];

    try {
        const res = await fetch(`${apiUrl}/sitemap.php`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            // If the response is not ok, throw an error
            throw new Error('Failed to fetch data');
        }

        const data = await res.json(); // Make sure to await the json parsing
        const dynamicEntries = data.map(dt => ({
            url:  dt,
            lastModified: new Date().toISOString(), // Convert date to ISO string
        }));
        sitemapEntries = [...sitemapEntries, ...dynamicEntries];
    } catch (error) {
        console.error(error);
    }
    return sitemapEntries;
}

import { apiUrl } from './config/constant';

// SITE_URL has no trailing slash, so `SITE_URL + "about-us"` produced
// "https://medipedia-web.vercel.appabout-us". Normalise once, join properly.
const siteUrl = (process.env.SITE_URL || 'https://medipedia-web.vercel.app').replace(/\/+$/, '');
const url = (path = '') => (path ? `${siteUrl}/${path}` : siteUrl);

export default async function sitemap() {
    // Define an array to hold all sitemap entries
    let sitemapEntries = [
        {
            url: url(),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("about-us"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("contact-us"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("privacy-policy"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("dmca-policy"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("login"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("register"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("forgot-password"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("guide"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("feedback"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("saved-quiz"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("history"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("book-price"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("book-code"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("profile"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("change-email"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("change-password"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("change-profile-name"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
        {
            url: url("change-phone-number"),
            lastModified: new Date().toISOString(), // Convert date to ISO string for better compatibility
        },
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

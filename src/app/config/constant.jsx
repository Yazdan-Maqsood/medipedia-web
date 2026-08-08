// config/constant.js

// API base URL. Override per-environment with NEXT_PUBLIC_API_URL in Vercel.
// Trailing slashes are stripped so `${apiUrl}/login.php` never becomes a
// double slash (SiteGround 301-redirects those and drops the POST body).
export const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL || "https://medipedia-web-api.desired-techs.com"
).replace(/\/+$/, "");

// Profile data function
export const profiledata = async (id) => {
    try {
        if (!id) {
            console.error('No user ID provided');
            return { user_name: 'User', success: false };
        }

        const formData = new FormData();
        formData.append("user_id", id);
        
        const response = await fetch(`${apiUrl}/profile-data.php`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return { user_name: 'User', success: false };
    }
};

// Book code function
export const bookcode = async (id) => {
    try {
        if (!id) {
            return { success: false, error: 'No user ID provided' };
        }

        const formData = new FormData();
        formData.append("user_id", id);
        
        const response = await fetch(`${apiUrl}/book-code.php`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching book code:', error);
        return { success: false, error: error.message };
    }
};

export const SlugToTitle = (slug) => {
    const title = slug
        .split('-')
        .map(word => word.replace(/%26/g, '&'))
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return <>{title}</>;
};
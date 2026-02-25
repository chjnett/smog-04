const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqoabzrpbpsfvhebwjga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb2FienJwYnBzZnZoZWJ3amdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzIxNjgsImV4cCI6MjA4NzE0ODE2OH0.4JSp-mHRJkGuVi2lVYFhTRDrmmXTNVbnTB2bEStbE9s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function realignCategories() {
    console.log('Fetching all categories and products...');
    const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('name'),
        supabase.from('products').select('id, name, category')
    ]);

    if (catRes.error || prodRes.error) {
        console.error('Error fetching data:', catRes.error || prodRes.error);
        return;
    }

    const validCategoryNames = new Set(catRes.data.map(c => c.name));
    const productsToFix = prodRes.data.filter(p => p.category && !validCategoryNames.has(p.category));

    console.log(`Found ${productsToFix.length} products with orphaned categories.`);

    for (const prod of productsToFix) {
        console.log(`Product "${prod.name}" has orphaned category: "${prod.category}"`);
        // Try fuzzy match or default to a safe value? 
        // For now, let's just log them so the user is aware.
    }

    if (productsToFix.length === 0) {
        console.log('Data integrity check passed: All product categories match existing categories.');
    }
}

realignCategories();

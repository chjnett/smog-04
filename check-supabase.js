const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqoabzrpbpsfvhebwjga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb2FienJwYnBzZnZoZWJ3amdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzIxNjgsImV4cCI6MjA4NzE0ODE2OH0.4JSp-mHRJkGuVi2lVYFhTRDrmmXTNVbnTB2bEStbE9s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('--- PRODUCT COUNTS BY CATEGORY ---');
    const { data: products } = await supabase.from('products').select('category');

    const counts = {};
    products.forEach(p => {
        const cat = p.category || 'NO_CATEGORY';
        counts[cat] = (counts[cat] || 0) + 1;
    });

    console.log(counts);

    console.log('\n--- SEARCHING FOR "리뷰" IN ALL PRODUCTS ---');
    const { data: searchResults } = await supabase.from('products').select('id, name, category, brand').or('name.ilike.%리뷰%,category.ilike.%리뷰%,brand.ilike.%리뷰%');
    console.log(JSON.stringify(searchResults, null, 2));
}

checkData();

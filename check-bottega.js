const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqoabzrpbpsfvhebwjga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb2FienJwYnBzZnZoZWJ3amdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzIxNjgsImV4cCI6MjA4NzE0ODE2OH0.4JSp-mHRJkGuVi2lVYFhTRDrmmXTNVbnTB2bEStbE9s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBottega() {
    console.log('--- Checking Categories for "보테가" ---');
    const { data: categories } = await supabase.from('categories').select('*').ilike('name', '%보테가%');
    console.log('Categories matching "보테가":', categories);

    console.log('\n--- Checking Products for "보테가" ---');
    const { data: products } = await supabase.from('products').select('id, name, category, brand').or('category.ilike.%보테가%,brand.ilike.%보테가%');
    console.log('Products matching "보테가":', products);

    console.log('\n--- Unique Category Values in Products ---');
    const { data: allProducts } = await supabase.from('products').select('category');
    const uniqueCats = [...new Set(allProducts.map(p => p.category))];
    console.log('Unique categories in products:', uniqueCats.filter(c => c && c.includes('보테가')));
}

checkBottega();

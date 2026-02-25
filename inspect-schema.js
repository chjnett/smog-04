const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqoabzrpbpsfvhebwjga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb2FienJwYnBzZnZoZWJ3amdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzIxNjgsImV4cCI6MjA4NzE0ODE2OH0.4JSp-mHRJkGuVi2lVYFhTRDrmmXTNVbnTB2bEStbE9s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log('--- INSPECTING ONE PRODUCT OBJECT ---');
    const { data: products } = await supabase.from('products').select('*').limit(1);
    console.log(JSON.stringify(products[0], null, 2));

    console.log('\n--- INSPECTING ONE CATEGORY OBJECT ---');
    const { data: categories } = await supabase.from('categories').select('*').limit(1);
    console.log(JSON.stringify(categories[0], null, 2));
}

inspectSchema();

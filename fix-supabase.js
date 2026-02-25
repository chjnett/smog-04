const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqoabzrpbpsfvhebwjga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb2FienJwYnBzZnZoZWJ3amdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzIxNjgsImV4cCI6MjA4NzE0ODE2OH0.4JSp-mHRJkGuVi2lVYFhTRDrmmXTNVbnTB2bEStbE9s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixData() {
    console.log('Updating products from "°리뷰" to "☆리뷰"...');
    const { data, error } = await supabase
        .from('products')
        .update({ category: '☆리뷰' })
        .eq('category', '°리뷰');

    if (error) console.error('Error updating products:', error);
    else console.log('Successfully updated products.');
}

fixData();

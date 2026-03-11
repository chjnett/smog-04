const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mqoabzrpbpsfvhebwjga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xb2FienJwYnBzZnZoZWJ3amdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzIxNjgsImV4cCI6MjA4NzE0ODE2OH0.4JSp-mHRJkGuVi2lVYFhTRDrmmXTNVbnTB2bEStbE9s';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('--- TESTING INSERT INTO ORDERS ---');
    const { data, error } = await supabase.from('orders').insert([
        {
            name: "Test User",
            contact: "010-1234-5678",
            address: "Test Address",
            customs_id: "P123456789012",
            product_name: "Test Product",
            product_id: "b2b8e7bf-1a01-4459-bc10-ceeb26d6a021", // Valid UUID from inspect-schema results
            price: 1000
        }
    ]);

    if (error) {
        console.error('Insert Error Detail:', JSON.stringify(error, null, 2));
    } else {
        console.log('Insert Success:', data);
    }
}

testInsert();

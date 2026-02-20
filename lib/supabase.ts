import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Database features will be disabled.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data
}

export async function getProductById(id: string) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

    if (error) throw error
    return data
}

export async function getAbout() {
    const { data, error } = await supabase
        .from("about")
        .select("*")
        .single()

    if (error) throw error
    return data
}

export async function getBlogPosts() {
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data
}

export async function getNotices() {
    const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data
}

export async function getReviews() {
    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) throw error
    return data
}

export async function getCategories() {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true })

    if (error) throw error
    return data
}

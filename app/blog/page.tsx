import { supabase } from "@/lib/supabase"

async function getBlogPosts() {
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })
  return data || []
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="px-4 py-12">
      <h1 className="text-lg font-bold tracking-tight text-foreground">
        블로그
      </h1>
      <div className="mt-8 flex flex-col">
        {posts.map((post, idx) => (
          <article
            key={idx}
            className="border-b border-foreground/10 py-6 first:pt-0"
          >
            <time className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {post.date}
            </time>
            <h2 className="mt-2 text-base font-bold text-foreground">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

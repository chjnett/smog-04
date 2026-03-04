import { supabase } from "@/lib/supabase"

async function getNotices() {
  const { data, error } = await supabase.from("notices").select("*").order("created_at", { ascending: false })
  return data || []
}

export default async function NoticePage() {
  const notices = await getNotices()

  return (
    <div className="px-4 py-12">
      <h1 className="text-lg font-bold tracking-tight text-foreground">
        공지사항
      </h1>
      <div className="mt-8 flex flex-col">
        {notices.map((notice, idx) => (
          <div
            key={idx}
            className="border-b border-foreground/10 py-6 first:pt-0"
          >
            <time className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {notice.date}
            </time>
            <h2 className="mt-2 text-base font-bold text-foreground">
              {notice.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {notice.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

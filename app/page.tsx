"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Notice = { id: string; title: string; body: string; status: "Published" | "Draft" | "Scheduled"; section: string; date: string };
const SEED: Notice[] = [
  { id: "1", title: "The new project shelf is open", body: "Five product worlds have moved from starter shells into their own visual language.", status: "Published", section: "Studio", date: "23 Aug 2026" },
  { id: "2", title: "Maintenance window", body: "A short quiet period is planned while the next collection is prepared.", status: "Scheduled", section: "Operations", date: "29 Aug 2026" },
  { id: "3", title: "A note before the next release", body: "Draft the useful context before the launch day arrives.", status: "Draft", section: "Editorial", date: "—" },
];

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        // Hydrate local bulletin copy after the server-rendered seed.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValue(JSON.parse(saved) as T);
      }
    } catch { /* Keep the printed notices available. */ }
    setReady(true);
  }, [key]);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, value, ready]);
  return [value, setValue] as const;
}

async function copyNotice(notice: Notice) {
  try { await navigator.clipboard.writeText(`${notice.title}\n\n${notice.body}`); } catch { /* Clipboard is optional. */ }
}

export default function Home() {
  const [notices, setNotices] = useLocalStorage<Notice[]>("announcements-v2", SEED);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | Notice["status"]>("All");
  const [draft, setDraft] = useState({ title: "", body: "", section: "Studio", status: "Draft" as Notice["status"] });
  const visible = useMemo(() => notices.filter((notice) => (filter === "All" || notice.status === filter) && `${notice.title} ${notice.body} ${notice.section}`.toLowerCase().includes(query.toLowerCase())), [filter, notices, query]);

  const addNotice = () => {
    if (!draft.title.trim() || !draft.body.trim()) return;
    setNotices((current) => [{ id: crypto.randomUUID(), ...draft, date: draft.status === "Published" ? "23 Aug 2026" : "—" }, ...current]);
    setDraft({ title: "", body: "", section: "Studio", status: "Draft" });
  };

  return (
    <main className="bulletin-page">
      <span className="contract-mark" dangerouslySetInnerHTML={{ __html: "<!-- THESIS: announcements are public-facing copy on a civic bulletin; FINISH: compose, filter, publish state, honest local storage -->" }} />
      <div className="bulletin-shell">
        <header className="bulletin-topbar"><Link href="/" className="bulletin-mark">CIRCULAR / NOTICE DESK</Link><span>edition 01 · local publication room</span></header>
        <section className="bulletin-hero"><div><p className="bulletin-kicker">the public line / keep it legible</p><h1>Put the right note in the right hands.</h1></div><p className="bulletin-deck">A compact desk for writing updates, checking their state, and keeping a readable archive of what visitors are meant to know.</p></section>

        <section className="bulletin-layout" aria-labelledby="compose-heading">
          <div className="compose-column">
            <header className="bulletin-heading"><div><span>01</span><h2 id="compose-heading">Set the notice</h2></div><em>compose / revise</em></header>
            <div className="notice-form">
              <label><span>Headline</span><input value={draft.title} placeholder="A clear thing worth saying" onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} /></label>
              <label><span>Body copy</span><textarea value={draft.body} placeholder="Give the reader the useful context." rows={5} onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))} /></label>
              <div className="form-pair"><label><span>Desk</span><input value={draft.section} onChange={(event) => setDraft((current) => ({ ...current, section: event.target.value }))} /></label><label><span>State</span><select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as Notice["status"] }))}><option>Draft</option><option>Scheduled</option><option>Published</option></select></label></div>
              <button type="button" className="ink-button" onClick={addNotice}>Pin to the board</button>
              <p className="form-note">This desk stores notices in this browser. It does not send email, publish a feed, or speak for a live CMS.</p>
            </div>
          </div>

          <div className="board-column">
            <header className="bulletin-heading"><div><span>02</span><h2>On the board</h2></div><strong>{visible.length} notices</strong></header>
            <div className="board-tools"><input aria-label="Search notices" placeholder="Search the board" value={query} onChange={(event) => setQuery(event.target.value)} /><div className="state-tabs" role="group" aria-label="Filter notices">{["All", "Published", "Scheduled", "Draft"].map((state) => <button type="button" className={filter === state ? "active" : ""} key={state} onClick={() => setFilter(state as typeof filter)}>{state}</button>)}</div></div>
            <div className="notice-stack">{visible.map((notice, index) => <article className={`notice notice-${notice.status.toLowerCase()}`} key={notice.id}><div className="notice-meta"><span>0{index + 1} / {notice.section}</span><span>{notice.date}</span></div><h3>{notice.title}</h3><p>{notice.body}</p><div className="notice-actions"><span className="notice-status">{notice.status}</span><button type="button" onClick={() => copyNotice(notice)}>Copy notice</button><button type="button" onClick={() => setNotices((current) => current.filter((item) => item.id !== notice.id))}>Remove</button></div></article>)}{visible.length === 0 && <p className="empty-board">No notice matches this cut of the board.</p>}</div>
          </div>
        </section>
        <footer className="bulletin-footer">A local editorial instrument · the status labels describe this browser, not a public distribution system.</footer>
      </div>
    </main>
  );
}

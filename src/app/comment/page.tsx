import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageSquare, ArrowLeft, User, Clock } from "lucide-react";
import CommentForm from "@/components/CommentForm";

export const metadata = {
  title: "Feedback & Comments - ATM",
  description: "Share feedback or comments on the Agent Tool Matrix.",
};

export default async function CommentPage() {
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="relative min-h-screen bg-[#020203] text-[#ededed] font-sans overflow-x-hidden">
      {/* Top Banner Gradient glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-80 bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full filter blur-[100px] pointer-events-none" />

      {/* Header Container */}
      <nav className="sticky top-0 w-full z-40 backdrop-blur-lg bg-zinc-900/70 border-b border-white/5 py-4 px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-pink-500 via-blue-600 to-emerald-400 text-white flex items-center justify-center font-bold font-mono tracking-wider shadow-lg shadow-blue-500/10 select-none text-sm">
            ATM
          </div>
          <h1 className="font-bold text-xl leading-none tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent select-none">
            Agent Tool Matrix
          </h1>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition duration-200 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col gap-4 mb-10 text-left">
          <div className="flex items-center gap-2.5 text-blue-400 font-mono text-xs tracking-wider uppercase">
            <MessageSquare className="w-4 h-4" />
            <span>Developer Community Hub</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Feedback & Discussions
          </h2>
          <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
            Collaborate, report issues, and suggest new tools or integrations to expand the Agent Tool Matrix capabilities.
          </p>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <CommentForm />
          </div>

          {/* Comments List Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-semibold text-zinc-300 text-sm flex items-center gap-2">
                <span>Recent Activity</span>
                <span className="bg-blue-500/15 text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  {comments.length}
                </span>
              </h3>
            </div>

            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-900/20 rounded-2xl border border-white/5 border-dashed">
                <MessageSquare className="w-10 h-10 text-zinc-600 mb-4 stroke-[1.5]" />
                <h4 className="font-semibold text-zinc-300 mb-1 text-sm">No comments yet</h4>
                <p className="text-zinc-500 text-xs max-w-xs">
                  Be the first one to start the conversation! Submit your comment using the feedback form.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {comments.map((c) => {
                  const formattedDate = new Date(c.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div
                      key={c.id}
                      className="bg-zinc-900/20 hover:bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition duration-300 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                          <span className="font-semibold text-white text-sm">Anonymous Developer</span>
                          <span className="text-zinc-500 text-xs flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {c.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { createComment } from "@/app/actions";

export default function CommentForm() {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await createComment(commentText);
      if (res) {
        setCommentText("");
        setSuccess(true);
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError("Failed to submit comment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="comment" className="text-sm font-semibold text-zinc-300">
          Leave a Comment
        </label>
        <span className="text-xs text-zinc-500">
          Share your feedback, ideas, or tool suggestions.
        </span>
      </div>

      <textarea
        name="comment"
        id="comment"
        placeholder="Type your comment here..."
        required
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        disabled={loading}
        className="w-full min-h-[140px] bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition duration-200 resize-none text-sm text-zinc-100"
      />

      <button
        type="submit"
        disabled={loading || !commentText.trim()}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-4 py-3 font-semibold transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Comment...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Comment</span>
          </>
        )}
      </button>

      {success && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Comment submitted successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-fadeIn">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}

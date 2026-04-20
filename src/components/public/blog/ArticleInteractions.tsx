"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type VoteState = "like" | "dislike" | null;

interface ArticleInteractionsProps {
  articleId: string;
  initialLikes: number;
  initialDislikes: number;
}

export default function ArticleInteractions({
  articleId,
  initialLikes,
  initialDislikes,
}: ArticleInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [vote, setVote] = useState<VoteState>(null);
  const [loading, setLoading] = useState(false);

  // Track view once on mount (localStorage to prevent repeat counts)
  useEffect(() => {
    const key = `viewed_${articleId}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "1");
      fetch(`/api/public/articles/${articleId}/view`, { method: "POST" }).catch(() => {});
    }

    // Restore vote state from localStorage
    const stored = localStorage.getItem(`vote_${articleId}`) as VoteState | null;
    setVote(stored);
  }, [articleId]);

  const handleVote = async (action: "like" | "dislike") => {
    if (loading) return;
    setLoading(true);

    const prevVote = vote;

    // If toggling off the same vote
    if (prevVote === action) {
      const undoAction = action === "like" ? "unlike" : "undislike";
      try {
        await fetch(`/api/public/articles/${articleId}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: undoAction }),
        });
        if (action === "like") setLikes((v) => Math.max(0, v - 1));
        else setDislikes((v) => Math.max(0, v - 1));
        setVote(null);
        localStorage.removeItem(`vote_${articleId}`);
      } catch {}
      setLoading(false);
      return;
    }

    // If switching vote
    if (prevVote !== null) {
      const undoAction = prevVote === "like" ? "unlike" : "undislike";
      try {
        await fetch(`/api/public/articles/${articleId}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: undoAction }),
        });
        if (prevVote === "like") setLikes((v) => Math.max(0, v - 1));
        else setDislikes((v) => Math.max(0, v - 1));
      } catch {}
    }

    // Apply new vote
    try {
      await fetch(`/api/public/articles/${articleId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (action === "like") setLikes((v) => v + 1);
      else setDislikes((v) => v + 1);
      setVote(action);
      localStorage.setItem(`vote_${articleId}`, action);
    } catch {}

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleVote("like")}
        disabled={loading}
        className={[
          "flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all",
          vote === "like"
            ? "border-black bg-black text-white"
            : "border-gray-200 text-gray-600 hover:border-gray-400",
        ].join(" ")}
      >
        <ThumbsUp size={16} />
        <span>{likes}</span>
      </button>
      <button
        onClick={() => handleVote("dislike")}
        disabled={loading}
        className={[
          "flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all",
          vote === "dislike"
            ? "border-black bg-black text-white"
            : "border-gray-200 text-gray-600 hover:border-gray-400",
        ].join(" ")}
      >
        <ThumbsDown size={16} />
        <span>{dislikes}</span>
      </button>
    </div>
  );
}

import { useEffect } from "react";
import { AgentChat } from "@/components/agent/AgentChat";

const Agent = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "Guía · CanaryCarbon";
    return () => {
      document.title = prev;
    };
  }, []);

  return <AgentChat />;
};

export default Agent;

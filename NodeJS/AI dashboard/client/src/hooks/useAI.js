
import { useState } from 'react';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const askAI = async (prompt) => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    
    let reply = "I'm analyzing your data...";
    if (prompt.toLowerCase().includes("sales")) {
      reply = "Based on current trends, your sales are projected to grow by 12% next month.";
    } else if (prompt.toLowerCase().includes("risk")) {
      reply = "I've detected a 5% churn rate increase in the 'Enterprise' segment.";
    }
    
    setResponse(reply);
    setLoading(false);
  };

  return { askAI, loading, response };
};
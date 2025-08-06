// src/app/(auth-required)/ticketing/page.tsx
import { boardData } from "@/data/boardData";
import ClientTicketingList from "./ClientTicketingList";
import { fetchClient } from "@/api/clients/fetchClient";

export const dynamic = 'force-dynamic';


const TicketingPage = async () => {
  const board = boardData["ticketing"];
  const defaultTab = board.tabs[0]?.value || "default";

  const res = await fetchClient(`/ticketing/event?campus=${defaultTab}&page=0`);
  const json = await res.text();
  const data = json ? JSON.parse(json) : { content: [] };

  return (
    <ClientTicketingList
      board={board}
      initialPosts={data.content}
      defaultTab={defaultTab}
    />
  );
};

export default TicketingPage;

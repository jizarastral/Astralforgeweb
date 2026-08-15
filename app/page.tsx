import { ForgeChat } from "@/components/astral/forge-chat";
import { RabbitHole } from "@/components/astral/rabbit-hole";

export default function Home() {
  return (
    <div className="overflow-x-clip bg-[#0b0b0c] text-white">
      <ForgeChat />
      <RabbitHole />
    </div>
  );
}

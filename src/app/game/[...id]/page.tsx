import GamePage from "@/components/GamePage";

export default async function GamePageServer({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    return <GamePage gameId={id} />;
}
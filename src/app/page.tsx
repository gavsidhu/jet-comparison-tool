import Table from "@/components/Table";
import prisma from "@/lib/prisma";

async function getJets() {
    return await prisma.jet.findMany();
}

export default async function Home() {
    const data = await getJets();

    return (
        <section className="sm:max-w-5xl max-w-full px-4 mx-auto py-24">
            <Table initialJets={data} />
        </section>
    );
}


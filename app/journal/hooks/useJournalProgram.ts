import { useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram } from "../lib/journal-client";
import { Providers } from "@/app/components/providers";
import toast from "react-hot-toast";
import { title } from "process";



export function useJournalProgram(){
    const provider = useAnchorProvider();

    const program = useMemo(() => getProgram(provider), [provider]);

    const accounts = useQuery({
        queryKey: ["journal", "all"],
        queryFn: async () => {
            return await program.account.JournalState.all()

        },
    });

    const createEntry = useMutation({
        mutationFn: async ({
            title,
            description, 
            owner
        }: {
            title: string;
            description: string;
            owner: PublicKey;
        }) => {
            const [journalPda] = PublicKey.findProgramAddressSync(
                [Buffer.from(title), owner.toBuffer()],
                program.programId
            );
            return await program.methods.initializeJournal(title, description).accounts({
                journal: journalPda,
                owner,
                systemProgram: SystemProgram.programId,
            }).rpc();
        },
        onSuccess: () => {
            toast.success("Journal entry created successfully!");
            accounts.refetch();
        },
        onError: (err) => {
            toast.error(err.message || "Failed to create journal entry");
        }
    });

    return {
        program,
        accounts,
        createEntry,
    }



}
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Journal } from "../target/types/journal";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("journal", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Journal as Program<Journal>;
  const wallet = provider.wallet;

  const title = "test-" + Date.now();
  const description = "this is a test journal";

  let journalPda: PublicKey;

  before(async () => {
    // derive PDA
    [journalPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(title), wallet.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Create Journal", async () => {
    await program.methods
      .initializeJournal(title, description)
      .accounts({
        journal: journalPda,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.journalState.fetch(journalPda);

    assert.equal(account.title, title);
    assert.equal(account.description, description);
  });

  it("Update Journal", async () => {
    const newDescription = "updated journal";

    await program.methods
      .updateJournal(title, newDescription)
      .accounts({
        journal: journalPda,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.journalState.fetch(journalPda);

    assert.equal(account.description, newDescription);
  });

  it("Delete Journal", async () => {
    await program.methods
      .deleteJournal(title)
      .accounts({
        journal: journalPda,
        owner: wallet.publicKey,
      })
      .rpc();

    try {
      await program.account.journalState.fetch(journalPda);
      assert.fail("Account should be deleted");
    } catch (err) {
      assert.ok("Account deleted successfully");
    }
  });
});
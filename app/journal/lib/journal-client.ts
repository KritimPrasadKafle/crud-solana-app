"use client";

import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "@/anchor/target/idl/journal.json";



const PROGRAM_ID = new PublicKey(
  "9FWHk9NLMXZDJgxkpF4sWmpBD9UusHW3KwGoTzw3JaFR"
);

export function getProgram(provider: anchor.AnchorProvider) {
  return new anchor.Program(idl as anchor.Idl, PROGRAM_ID, provider);
}

export function getConnection() {
  return new Connection("https://api.devnet.solana.com");
}
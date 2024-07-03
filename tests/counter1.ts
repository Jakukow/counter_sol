import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { Counter1 } from "../target/types/counter1";

describe("counter1", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter1 as Program<Counter1>;
  const myAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    await program.methods
      .initialize()
      .accounts({
        myAccount: myAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([myAccount])
      .rpc();

    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    assert.strictEqual(account.data.toString(), "0");
  });
  it("It updates", async () => {
    await program.methods
      .update(new anchor.BN(3))
      .accounts({
        myAccount: myAccount.publicKey,
      })
      .rpc();

    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    assert.strictEqual(account.data.toString(), "3");
  });

  it("Increments", async () => {
    await program.methods
      .update(new anchor.BN(3))
      .accounts({ myAccount: myAccount.publicKey })
      .rpc();
    await program.methods
      .increment()
      .accounts({ myAccount: myAccount.publicKey })
      .rpc();
    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    assert.strictEqual(account.data.toString(), "4");
  });
  it("Decrements", async () => {
    await program.methods
      .update(new anchor.BN(3))
      .accounts({ myAccount: myAccount.publicKey })
      .rpc();
    await program.methods
      .decrement()
      .accounts({ myAccount: myAccount.publicKey })
      .rpc();
    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    assert.strictEqual(account.data.toString(), "2");
  });
});

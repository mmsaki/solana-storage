import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Storage } from '../target/types/storage';
import { expect } from 'chai';
import { before } from 'mocha';

// Configure the client to use the local cluster.
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.Storage as Program<Storage>;
const systemProgram = anchor.web3.SystemProgram.programId;
let storageDataPDA;

describe('storage', async () => {
	it('Intialize', async () => {
		const data = new anchor.BN(100);
		[storageDataPDA] = await anchor.web3.PublicKey.findProgramAddressSync(
			[provider.publicKey.toBuffer()],
			program.programId
		);
		const tx = await program.methods
			.initialize(data)
			.accounts({
				storageAccount: storageDataPDA,
				systemProgram: systemProgram,
			})
			.signers([])
			.rpc();
		console.log('🚀 Intialization transaction:', tx);
	});
	it('Account data is initialized to 100', async () => {
		// fetch data for pda
		const data = await program.account.storageData.fetch(storageDataPDA);
		// convert BN to decimal
		const value = parseInt(data.balance.toString('hex'), 16);
		expect(value).equal(100, 'Value is not 100');
	});
});

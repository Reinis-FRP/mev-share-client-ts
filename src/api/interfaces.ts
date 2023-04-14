import { LogParams } from 'ethers'

/**
 * Used to specify which type of event to listen for.
 */
export enum StreamEvent {
    Transaction = 'transaction',
}

/**
 * Configuration used to connect to the Matchmaker. Use [supportedNetworks](./networks.ts) for presets.
 */
export type MatchmakerNetwork = {
    /** Chain ID of the network. e.g. `1` */
    chainId: number,
    /** Lowercase name of network. e.g. "mainnet" */
    name: string,
    /** Matchmaker event stream URL. */
    streamUrl: string,
    /** Matchmaker bundle & transaction API URL. */
    apiUrl: string,
}

/**
 * Specifies what kind of data is parsed from a Matchmaker stream event.
*/
/// should be extended with additional types as they're created: `MatchmakerEvent = PendingTransaction | SomeOtherType | ...`
export type MatchmakerEvent = PendingTransaction

/**
 * Hints specify which data is shared with searchers on mev-share.
 */
export interface HintPreferences {
    /** Share the calldata of the transaction. (default=false) */
    calldata?: boolean,
    /** Share the contract address of the transaction. (default=true) */
    contractAddress?: boolean,
    /** Share the 4byte function selector of the transaction. (default=true) */
    functionSelector?: boolean,
    /** Share the logs emitted by the transaction. (default=true) */
    logs?: boolean,
}

/**
 * Parameters accepted by the `sendShareTransaction` function.
 */
export interface TransactionOptions {
    /** Hints define what data about a transaction is shared with searchers. */
    hints?: HintPreferences,
    /** Maximum block number for the transaction to be included in. */
    maxBlockNumber?: number,
}

// /**
//  * Parameters sent to eth_sendShareBundle.
//  */
// export interface BundleParams {
//     /** Smart bundle spec version. */
//     version?: number,
//     /** uuidv4. */
//     replacementUuid?: string,
//     /** Bundle will be assumed correct only for targetBlockNumber or until cancelled. */
//     targetBlock: number,
//     /** Array of signed txs that backrun each transaction in `shareTxs`. */
//     backrun: string[],
//     /** Array of mev-share tx hashes for the backrun to follow (currently only one tx hash is supported). */
//     shareTxs: string[]
// }

/**
 * Parameters sent to mev_sendBundle.
 */
export interface BundleParams {
    /** Smart bundle spec version. */
    version?: number | string,
    /** Conditions for the bundle to be considered for inclusion in a block, evaluated _before_ the bundle is placed in a block. */
    inclusion: {
        /** Target block number in which to include the bundle. */
        block: number,
    },
    /** Transactions that make up the bundle. `hash` refers to a transaction hash from the Matchmaker event stream. */
    body: Array<
        { hash: string } |
        { tx: string, canRevert: boolean }
    >,
    /** Conditions for bundle to be considered for inclusion in a block, evaluated _after_ the bundle is placed in the block. */
    validity: {
        /** Conditions for receiving MEV kickbacks. */
        refund: Array<
            {
                /** The address that receives the kickback. */
                address: string,
                /** The minimum percent of MEV kickback received to be eligible for inclusion. */
                percent: number
            }
        >
    },
    /** Bundle privacy parameters. */
    privacy: {
        /** Data fields from bundle transactions to be shared with searchers on MEV-Share. */
        hints: HintPreferences,
        /** Builders that are allowed to receive this bundle. */
        targetBuilders: Array<string>,
    },
}

/**
 * Data received from Flashbots when a new mev-share transaction is detected.
 */
export interface PendingTransaction {
    /** Transaction hash */
    txHash: string,
    /** address */
    to?: string,
    /** 4byte function selector */
    functionSelector?: string,
    /** bytes; logs emitted by the tx */
    logs?: LogParams[],
    /** bytes; calldata of the tx */
    callData?: string,
}

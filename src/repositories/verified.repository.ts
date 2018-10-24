import db from '../db'
import BilateralCreditRecord from '../dto/bilateral-credit-record'
import IssueCreditLog, { hashCreditLog } from '../dto/issue-credit-log'

export default {
    getCounterParties: (address: string) => {
        return db.any('SELECT creditor FROM verified_credits WHERE debtor = $1 UNION SELECT debtor FROM verified_credits WHERE creditor = $1', [address])
    },

    getTwoPartyBalance: (address: string, counterparty: string, ucac: string) => {
        const query = "SELECT ( \
            \  SELECT  \
            \      COALESCE(SUM(verified_credits.amount), 0) \
            \  FROM \
            \      verified_credits LEFT JOIN settlements USING(hash) \
            \  WHERE creditor = $1 AND debtor = $2 AND ucac = $3 AND verified IS DISTINCT FROM FALSE \
            \ ) - ( \
            \  SELECT \
            \      COALESCE(SUM(verified_credits.amount), 0) \
            \  FROM \
            \      verified_credits LEFT JOIN settlements USING(hash) \
            \  WHERE creditor = $2 AND debtor = $1 AND ucac = $3 AND verified IS DISTINCT FROM FALSE \
            \ )"
        
        return db.any(query, [address, counterparty, ucac])
    },

    getBalance: (address: string, ucac: string) => {
        const query = "SELECT ( \
            \  SELECT \
            \      COALESCE(SUM(verified_credits.amount), 0) \
            \  FROM \
            \      verified_credits LEFT JOIN settlements USING(hash) \
            \  WHERE \
            \      creditor = $1 AND ucac = $2 AND verified IS DISTINCT FROM FALSE \
            \ ) - ( \
            \  SELECT \
            \      COALESCE(SUM(verified_credits.amount), 0) \
            \  FROM \
            \      verified_credits LEFT JOIN settlements USING (hash) \
            \  WHERE \
            \      debtor = $1 AND ucac = $2 AND verified IS DISTINCT FROM FALSE \
            \ )"
        
        return db.any(query, [address, ucac])
    },

    getNonce: (address: string, counterparty: string) => {
        return db.any("SELECT COALESCE(MAX(nonce) + 1, 0) FROM verified_credits WHERE (creditor = $1 AND debtor = $2) OR (creditor = $2 AND debtor = $1)", [address, counterparty]).then(data => {
            return data[0].coalesce
        })
    },

    insertCredit: (record: BilateralCreditRecord) => {
        const {  } = record
        return db.any("INSERT INTO verified_credits (creditor, debtor, amount, memo, nonce, hash, creditor_signature, debtor_signature, ucac, submitter) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", )
    },

    insertCredits: (logs: [IssueCreditLog]) => {
        return Promise.all(logs.map(log => {
            const { ucac, creditor, debtor, amount, memo, nonce } = log
            const hash = hashCreditLog(log)
            db.any("INSERT INTO verified_credits (creditor, debtor, amount, memo, nonce, hash, creditor_signature, debtor_signature, ucac, submitter) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (hash) DO NOTHING", [creditor, debtor, amount, memo, nonce, hash, "", "", ucac, creditor])
        })) 
    },

    allCredits: () => {
        return db.any("SELECT ucac, creditor, debtor, amount, nonce, memo FROM verified_credits")
    },

    lookupCreditByAddress: (address: string) => {
        return db.any("SELECT ucac, creditor, debtor, verified_credits.amount, nonce, memo FROM verified_credits LEFT JOIN settlements USING(hash) WHERE (creditor = $1 OR debtor = $1) AND (settlements.hash IS NULL OR settlements.verified = TRUE) ORDER BY verified_credits.created_at DESC", [address])
    },

    deleteExpiredSettlementsAndAssociatedCredits: async() => {
        const hashes = await db.any("SELECT hash FROM settlements WHERE created_at < now() - interval '2 days' AND verified = FALSE").catch(err => console.log(err))
        if (hashes.length === 0) {
            return []
        }

        return Promise.all([ //TODO: fix this IN query language
            db.any("DELETE FROM verified_credits WHERE hash IN ($1:csv)", [hashes]),
            db.any("DELETE FROM pending_credits WHERE hash IN ($1:csv)", [hashes]),
            db.any("DELETE FROM settlements WHERE hash IN ($1:csv)", [hashes])
        ])
    },

    txHashesToVerify: () => {
        return db.any("SELECT tx_hash FROM settlements WHERE tx_hash IS NOT NULL AND verified = FALSE GROUP BY tx_hash")
    },

    txHashByCreditHash: (creditHash: string) => {
        return db.any("SELECT tx_hash FROM settlements WHERE hash = $1", [creditHash]).then(result => {
            if (result.length === 0) {
                return null
            } else {
                return result[0]
            }
        })
    },

    updateSettlementTxHash: (txHash: string, creditHash: string) => {
        return db.any("UPDATE settlements SET  tx_hash = $1 WHERE hash = $2", [txHash, creditHash])
    },

    lookupSettlementCreditByAddress: (address: string) => {
        return db.any("SELECT creditor, debtor, verified_credits.amount, memo, submitter, nonce, verified_credits.hash, ucac, creditor_signature, debtor_signature, settlements.amount, settlements.currency, settlements.blocknumber, settlements.tx_hash FROM verified_credits JOIN settlements USING(hash) WHERE (creditor = $1 OR debtor = $1) AND verified = FALSE", [address])
    },

    lookupCreditByHash: (hash: string) => {
        return db.any("SELECT creditor, debtor, verified_credits.amount, memo, submitter, nonce, verified_credits.hash, ucac, creditor_signature, debtor_signature, settlements.amount, settlements.currency, settlements.blocknumber, settlements.tx_hash FROM verified_credits JOIN settlements USING(hash) WHERE verified_credits.hash = $1", [hash]).then(result => {
            if (result.length === 0) {
                return null
            } else {
                return result[0]
            }
        })
    },

    lookupCreditsByTxHash: (txHash: string) => {
        return db.any("SELECT creditor, debtor, verified_credits.amount, memo, submitter, nonce, verified_credits.hash, ucac, creditor_signature, debtor_signature, settlements.amount, settlements.currency, settlements.blocknumber, settlements.tx_hash FROM settlements JOIN verified_credits USING(hash) WHERE settlements.tx_hash = $1", [txHash])
            .then(credits => {
                return new BilateralCreditRecord(credits[0])
            })
    },

    verifyCreditByHash: (hash: string) => {
        return db.any("UPDATE settlements SET verified = TRUE WHERE hash = $1", [hash])
    }
}

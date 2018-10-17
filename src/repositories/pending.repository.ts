import db from '../db'
import CreditRecord from '../dto/credit-record'

export default {
    lookupPending: (hash: string) => {
        return db.any("SELECT creditor, debtor, pending_credits.amount, memo, submitter, nonce, pending_credits.hash, signature, ucac, settlements.currency, settlements.amount, settlements.blocknumber FROM pending_credits LEFT JOIN settlements USING(hash) WHERE pending_credits.hash = $1", [hash])
    },

    lookupPendingByAddress: (address: string, settlement: boolean) => {
        if (settlement) {
            return db.any("SELECT creditor, debtor, pending_credits.amount, memo, submitter, nonce, pending_credits.hash, signature, ucac, settlements.currency, settlements.amount, settlements.blocknumber FROM pending_credits JOIN settlements USING(hash) WHERE (creditor = $1 OR debtor = $1)", [address])
        } else {
            return db.any("SELECT creditor, debtor, pending_credits.amount, memo, submitter, nonce, pending_credits.hash, signature, ucac, settlement_currency FROM pending_credits LEFT JOIN settlements USING(hash) WHERE (creditor = $1 OR debtor = $1) AND settlements.hash IS NULL", [address])
        }
    },

    lookupPendingSettlementByAddresses: (address1: string, address2: string) => {
        return db.any("SELECT verified_credits.hash FROM verified_credits JOIN settlements USING(hash) WHERE ((creditor = $1 AND debtor = $2) OR (creditor = $2 AND debtor = $1)) AND settlements.verified = FALSE", [address1, address2])
    },
    
    lookupPendingByAddresses: (address1: string, address2: string) => {
        return db.any("SELECT creditor, debtor, amount, memo, submitter, nonce, hash, signature, ucac, settlement_currency FROM pending_credits WHERE (creditor = $1 AND debtor = $2) OR (creditor = $2 AND debtor = $1)", [address1, address2])
    },

    deletePending: (hash: string, settlement: boolean) => {
        if (settlement) {
            return db.any("DELETE FROM settlements WHERE hash = $1", [hash])
        } else {
            return db.any("DELETE FROM pending_credits WHERE hash = $1", [hash])
        }
    },

    insertSettlementData: (record: CreditRecord) => {
        const { hash, amount, settlementCurrency, settlementBlocknumber } = record
        return db.any("INSERT INTO settlements (hash, amount, currency, blocknumber, verified) VALUES ($1,$2,$3,$4,FALSE)", [hash, amount, settlementCurrency, settlementBlocknumber])
    },

    insertPending: (record: CreditRecord) => {
        const { creditor, debtor, amount, memo, submitter, nonce, hash, signature, ucac, settlementCurrency } = record
        return db.any("INSERT INTO pending_credits (creditor, debtor, amount, memo, submitter, nonce, hash, signature, ucac, settlement_currency) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [creditor, debtor, amount, memo, submitter, nonce, hash, signature, ucac, settlementCurrency])
    },

    insertPayPalRequest: (friend: string, requestor: string) => {
        return db.any("INSERT INTO paypal_requests (friend, requestor) VALUES ($1,$2)", [friend, requestor])
    },

    deletePayPalRequest: (friend: string, requestor: string) => {
        return db.any("DELETE FROM paypal_requests WHERE (friend = $1 AND requestor = $2)", [friend, requestor])
    },

    lookupPayPalRequestsByAddress: (address: string) => {
        return db.any("SELECT paypal_requests.friend, paypal_requests.requestor, friends.nickname, requestors.nickname FROM paypal_requests LEFT JOIN nicknames requestors ON requestors.address = requestor LEFT JOIN nicknames friends ON friends.address = friend WHERE (friend = $1 OR requestor = $1)", [address])
    }
}

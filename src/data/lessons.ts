export interface Lesson {
  id: string; // matches placeholder image ids
  title: string;
  category: string;
  level: string;
  duration: string;
  points: number;
  description: string;
  sections: { heading: string; body: string }[];
}

export const LESSONS: Lesson[] = [
  {
    id: "academy-intro",
    title: "Blockchain Foundations",
    category: "Basics",
    level: "Beginner",
    duration: "5 min read",
    points: 100,
    description: "Master the basics of distributed ledger technology and consensus mechanisms.",
    sections: [
      { heading: "What a blockchain is", body: "A blockchain is a shared ledger copied across many computers. Transactions are grouped into blocks, and each block contains a cryptographic hash of the previous one. Changing old history would mean redoing every later block and convincing the network to accept it, which is what makes the record hard to tamper with." },
      { heading: "Consensus", body: "Nodes must agree on which block comes next. Bitcoin uses proof of work: miners spend energy hashing until they find a valid block. Ethereum uses proof of stake: validators lock up ETH as collateral and can lose part of it (slashing) if they act dishonestly." },
      { heading: "Wallets and keys", body: "A wallet holds a private key that proves ownership and signs transactions; your public address is derived from it. Whoever has your private key or seed phrase controls the funds. There is no password reset, so backups and secrecy matter." },
    ],
  },
  {
    id: "academy-defi",
    title: "DeFi Ecosystems",
    category: "DeFi",
    level: "Intermediate",
    duration: "6 min read",
    points: 250,
    description: "Learn about AMMs, liquidity pools, and yield farming strategies.",
    sections: [
      { heading: "Automated market makers", body: "Instead of an order book, an AMM trades against a liquidity pool. In a constant-product pool the product of the two reserves stays fixed (x * y = k), so each trade shifts the price. Larger trades relative to the pool cause more slippage." },
      { heading: "Liquidity and yield", body: "Liquidity providers deposit asset pairs and earn a share of trading fees. The main risks are impermanent loss (ending with less value than if you had simply held), smart-contract bugs, and token rewards that fade once incentives end." },
      { heading: "Lending and liquidation", body: "Lending protocols let you deposit collateral and borrow against it. If the collateral value falls below a required ratio, the position is liquidated automatically, usually with a penalty. Borrowing close to the limit is dangerous in volatile markets." },
    ],
  },
  {
    id: "academy-security",
    title: "On-Chain Security",
    category: "Security",
    level: "Advanced",
    duration: "5 min read",
    points: 200,
    description: "Best practices for cold storage, multisig wallets, and avoiding exploits.",
    sections: [
      { heading: "Protect the seed phrase", body: "Write your recovery phrase on paper or metal and keep it offline. Never photograph it, store it in cloud notes, or type it into a website. Legitimate support teams never ask for it." },
      { heading: "Hardware wallets and multisig", body: "Hardware wallets keep private keys on a separate device and sign transactions there. A multisig wallet needs M of N keys to approve a transfer, so one stolen key is not enough to empty it." },
      { heading: "Common scams", body: "Watch for phishing sites, fake airdrops, malicious token approvals and address poisoning (look-alike addresses in your history). Check URLs, review and revoke token approvals you no longer need, and verify the full address before sending." },
    ],
  },
  {
    id: "academy-trading",
    title: "Technical Analysis Basics",
    category: "Trading",
    level: "Intermediate",
    duration: "6 min read",
    points: 300,
    description: "Candlesticks, RSI and MACD, and why no indicator is a guarantee.",
    sections: [
      { heading: "Candlesticks", body: "Each candle shows the open, high, low and close for a period. The body shows direction and the wicks show prices that were rejected. Patterns describe what happened and suggest probabilities, not certainties." },
      { heading: "RSI", body: "The Relative Strength Index compares recent gains with recent losses on a 0 to 100 scale. Readings above 70 are often called overbought and below 30 oversold, but in strong trends it can stay at extremes for a long time." },
      { heading: "MACD and risk", body: "MACD compares two moving averages, and crossovers hint at changing momentum. No indicator predicts the future. Size positions so a loss is survivable, and never risk money you cannot afford to lose." },
    ],
  },
];

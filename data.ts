import { Prompt, Category } from './types';

export const PROMPTS: Prompt[] = [
  // PDF 1: I Built My Own Industry Analyst With AI
  {
    id: '1',
    title: 'Deep Research: Historical Analysis',
    description: 'Generates a detailed 30-page report on the history, evolution, and major players of an industry.',
    category: Category.INDUSTRY_ANALYSIS,
    tags: ['history', 'deep-research', 'macro', 'gemini'],
    rating: 4.8,
    ratingCount: 124,
    content: `ROLE
You are an economic historian and industry analyst.
Write a factual, data-based history of the [Industry Name] showing how it formed, evolved, and produced its major winners.
Use clear, analytical language focused on cause and effect.

OBJECTIVE
Create one detailed report (8 000–10 000 words) that explains:
- How the industry began and why it matters economically.
- What forces—technology, regulation, capital, competition—shaped it.
- How leading firms gained and kept advantage.
- What cycles or patterns repeat across time.
- What lessons guide long-term investors.

REPORT OUTLINE
1. Formation: Initial need and early solutions. First technologies, financing models, and institutions.
2. Expansion: Breakthroughs that enabled scale. Evolution of cost, productivity, and barriers to entry.
3. Crises and Regulation: Major shocks that reset structure. Policy shifts.
4. Competition: How leading firms built edge (cost, tech, brand). Failures and structural limits.
5. Industry Players: Main actors, why they dominated, key mergers.
6. Modern Transformation: Digital shifts, new entrants.
7. Capital and Returns: Financing evolution, leverage, return patterns.
8. Key Insights: Recurrent mechanisms of success/failure.`
  },
  {
    id: '2',
    title: 'Deep Research: Growth & Future Scenarios',
    description: 'A forward-looking report explaining current drivers, structural limits, and future scenarios.',
    category: Category.INDUSTRY_ANALYSIS,
    tags: ['growth', 'future', 'strategy', 'gemini'],
    rating: 4.7,
    ratingCount: 98,
    content: `ROLE
You are an industry analyst and strategist.
Write a factual, forward-looking report on the [Industry Name] explaining current growth drivers, structural limits, and plausible future scenarios.
Use analytical, quantitative, and cause-effect reasoning.

OBJECTIVE
Create one long report (≈ 8 000–10 000 words) that explains:
- Current state and growth momentum.
- Key demand and supply drivers.
- How regulation, technology, and capital cycles affect expansion.
- Long-term scenarios (Base, Upside, Downside).

REPORT OUTLINE
1. Current Structure: Market size, segmentation, profit pools.
2. Growth Drivers: Demand-side (demographics, adoption) and Supply-side (capacity, innovation).
3. Constraints and Headwinds: Regulation, resource limits, saturation.
4. Technological Evolution: Innovations with material economic impact.
5. Competitive Landscape: New entrants, consolidation, moats.
6. Scenarios (5-10 Years): Base case, Upside (faster adoption), Downside (shocks).
7. Financial Outlook: Revenue, margin, and ROCE expectations.
8. Strategic Implications: Capabilities defining winners.`
  },
  {
    id: '3',
    title: 'Deep Research: Operations & Economics',
    description: 'Technical report on the operating logic: value chain, cost drivers, cash flows, and efficiency.',
    category: Category.COMPANY_OPS,
    tags: ['economics', 'operations', 'margins', 'value-chain'],
    rating: 4.9,
    ratingCount: 156,
    content: `ROLE
You are an industry economist and operations analyst.
Write a precise, technical report explaining the complete operating logic of the [Industry Name]: its value chain, cost drivers, cash flows, and efficiency mechanics.
Use causal, quantitative reasoning throughout.

OBJECTIVE
Produce a full-length analytical document (≈8 000–10 000 words) that answers:
- How does the industry convert inputs into output and cash?
- What determines margins, returns, and scalability?
- How do firms organize capital, labor, and technology?
- Which metrics expose operational strength?

REPORT OUTLINE
1. Value Chain and Flow: From input to customer. Value added at each link.
2. Operating Models: Revenue logic, pricing mechanisms, fixed vs variable.
3. Cost Structure: Operating expenses breakdown, economies of scale.
4. Working Capital: Payment cycles (DSO, DPO), cash conversion.
5. Asset Base: Capex intensity, depreciation, operating leverage.
6. Labor and Productivity: Labor share, automation potential.
7. Technology: Core tech enabling efficiency.
8. Risks: Supply chain, single points of failure.
9. Metrics: Core KPIs (gross -> EBIT -> FCF), ROCE, utilization.`
  },
  {
    id: '4',
    title: 'Identify Industry Leaders',
    description: 'Identify the best public companies to analyze for a specific industry value chain.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['screening', 'public-companies', 'discovery'],
    rating: 4.5,
    ratingCount: 42,
    content: `List 5-7 public companies whose annual reports best represent the [Industry Name] value chain.

For each, include:
- Name + Ticker + Country
- Role in value chain
- Why it matters (scale, specialization, region, or disclosure depth)
- Key metrics disclosed

Then add:
- A brief value chain summary (how the selected firms cover the full system).
- The selection criteria: Publicly listed, clear business explanations, covers major value chain steps, mix of leaders/niche specialists, strong KPI disclosure, 5+ years of data.`
  },
  {
    id: '5',
    title: 'NotebookLM Analyst Persona',
    description: 'System prompt to turn an AI into a customized industry analyst using uploaded sources.',
    category: Category.WRITING,
    tags: ['persona', 'notebooklm', 'style'],
    rating: 4.6,
    ratingCount: 75,
    content: `Act as my industry analyst.
You will receive questions about this industry, specific companies, or recent developments.
Use the uploaded sources to explain for an investor the key economic drivers, business models, capital intensity, competitive forces, and key metrics from an investor’s perspective, with numbers, examples, and page citations.
When possible, present your answers in bullet points for clarity.`
  },
  {
    id: '6',
    title: 'Quarterly Results Analysis',
    description: 'Analyze new earnings results in the context of the broader industry.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['earnings', 'quarterly', 'analysis'],
    rating: 4.4,
    ratingCount: 38,
    content: `Here are [Company Name]’s Q3 results. Based on what you know about the company and the industry, explain what these numbers mean — especially the changes in margins, growth, and guidance.`
  },

  // PDF 2: $1M Masterclass
  {
    id: '7',
    title: 'Senior Small-Cap Analyst Persona',
    description: 'Sets the AI as a senior equity analyst specializing in high-quality small-caps.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['persona', 'small-cap', 'equity-research'],
    rating: 4.8,
    ratingCount: 210,
    content: `You are my senior equity analyst with 40+ years of experience in the field of small-cap investing, niche in high-quality small-caps. Your goal is to help me identify and understand high-quality small-cap businesses. Base all insights on verifiable facts and logic. Provide concise, data-driven reasoning.`
  },
  {
    id: '8',
    title: 'Quantitative Small-Cap Filter',
    description: 'Filter for high-potential small-cap stocks based on specific financial criteria.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['screening', 'quantitative', 'small-cap'],
    rating: 4.7,
    ratingCount: 185,
    content: `List 25 listed small-cap companies (< $1 B market cap) with:
- Revenue growth > 10% CAGR (5 yrs)
- ROIC > 12%
- Debt/Equity < 0.5
- Insider ownership > 8%
- Rank by stability of gross margins.

Pro Move: Ask AI to also explain why each meets criteria, pattern recognition beats data lists.`
  },
  {
    id: '9',
    title: 'Market Structure Scan',
    description: 'Identify industries with structural tailwinds and low institutional coverage.',
    category: Category.INDUSTRY_ANALYSIS,
    tags: ['market-structure', 'discovery', 'niche'],
    rating: 4.3,
    ratingCount: 25,
    content: `Which industries under €2 B total market size have structural tailwinds (digitalization, regulation, demographic change) and low institutional coverage?`
  },
  {
    id: '10',
    title: 'Company Autopsy: The Engine',
    description: 'Quickly understand a business model and revenue streams.',
    category: Category.COMPANY_OPS,
    tags: ['business-model', 'due-diligence'],
    rating: 4.5,
    ratingCount: 60,
    content: `Explain [Company]’s business model in 4 sentences.
Map revenue streams, customer concentration, and pricing power.`
  },
  {
    id: '11',
    title: 'Company Autopsy: Financial DNA',
    description: 'Extract and analyze key financial trends and anomalies.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['financials', 'trends', 'cash-flow'],
    rating: 4.9,
    ratingCount: 110,
    content: `Extract the last 5 years of revenue, EBITDA, FCF, ROIC, and debt levels.
Identify trends, anomalies, and capital allocation behavior.
Then: Compare FCF generation to net income. Any red flags in cash conversion?`
  },
  {
    id: '12',
    title: 'Moat Assessment',
    description: 'Evaluate the durability and type of a company\'s economic moat.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['moat', 'competitive-advantage', 'strategy'],
    rating: 4.7,
    ratingCount: 145,
    content: `Based on filings and customer data, which type of moat does [Company] have (Cost, Network, Brand, Process, Regulatory)?
Rate durability from 1–10 with justification.
List specific signals that the moat is strengthening or weakening.`
  },
  {
    id: '13',
    title: 'Red Flag Detection',
    description: 'Identify accounting or governance risks from filings.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['risk', 'forensic', 'accounting'],
    rating: 4.8,
    ratingCount: 95,
    content: `List any accounting or governance risks from the last 3 years of filings.
Highlight auditor changes, related-party transactions, or sudden margin shifts.
Identify anomalies between net income and cash flow.`
  },
  {
    id: '14',
    title: 'Investment Thesis Builder',
    description: 'Synthesize data into a concise 1-page investment memo.',
    category: Category.WRITING,
    tags: ['thesis', 'summary', 'memo'],
    rating: 4.6,
    ratingCount: 72,
    content: `Summarize [Company] in one page:
- Elevator pitch (3 sentences)
- Growth drivers
- Risks and mitigants
- Valuation range (Base, Bull, Bear)
- Why it can compound 15%+ for 5 yrs (Use only verifiable facts).`
  },
  {
    id: '15',
    title: 'Asymmetric Lens',
    description: 'Analyze probability vs payoff for a potential investment.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['risk-reward', 'probability', 'mental-model'],
    rating: 4.9,
    ratingCount: 130,
    content: `What must go right for this to 5× in 5 years?
What must go wrong for it to fail?
Quantify each.`
  },
  {
    id: '16',
    title: 'Valuation Range (DCF)',
    description: 'Run a scenario-based DCF analysis to find fair value range.',
    category: Category.VALUATION,
    tags: ['dcf', 'valuation', 'modeling'],
    rating: 4.7,
    ratingCount: 165,
    content: `Run a 10-year DCF with 3 scenarios:
- Base: 10% growth, 12% EBIT margin, 2% terminal
- Bull: 15% growth, 15% margin
- Bear: 5% growth, 8% margin
Show FCF, discount rate 10%, and fair-value range.

Then: Summarize what’s priced in at today’s valuation.`
  },
  {
    id: '17',
    title: 'Management Quality Check',
    description: 'Analyze management consistency and integrity via earnings calls.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['management', 'qualitative', 'earnings-calls'],
    rating: 4.5,
    ratingCount: 55,
    content: `Analyze all earnings call transcripts since 2020 for [Company].
Summarize tone, use of forward-looking language, and mentions of execution discipline.
Identify patterns of over- or under-promising.
Then cross-compare: Benchmark management commentary vs. actual results — quantify delivery rate.`
  },
  {
    id: '18',
    title: 'Weekly Small-Cap Scanner',
    description: 'Automated weekly scan for high-potential small caps.',
    category: Category.AUTOMATION,
    tags: ['weekly', 'scanner', 'workflow'],
    rating: 4.4,
    ratingCount: 88,
    content: `Every Monday, scan global small-caps under $1 B with:
- 10% YoY revenue growth
- Insider buying in last 90 days
- Expanding margins.
Summarize top 5 with 5-line thesis and valuation range.`
  },
  {
    id: '19',
    title: 'Meta-Level Feedback Loop',
    description: 'Use AI to audit your own investment thinking and biases.',
    category: Category.AUTOMATION,
    tags: ['self-improvement', 'psychology', 'bias'],
    rating: 4.8,
    ratingCount: 115,
    content: `Review my last 10 investment memos.
Identify recurring biases, overly optimistic assumptions, or ignored risk signs.
Summarize lessons and build a correction checklist.`
  },
  {
    id: '20',
    title: 'M&A Pattern Recognition',
    description: 'Analyze acquisition trends in a specific industry.',
    category: Category.INDUSTRY_ANALYSIS,
    tags: ['m&a', 'strategy', 'corporate-finance'],
    rating: 4.2,
    ratingCount: 30,
    content: `List all acquisitions in [industry] under $500 M since 2020.
Identify valuation multiples and strategic rationale.
What patterns do top acquirers target?`
  }
];

export const PROMPT_TEMPLATES: Partial<Prompt>[] = [
  {
    title: 'SWOT Analysis',
    description: 'A classic framework for analyzing a company\'s Strengths, Weaknesses, Opportunities, and Threats.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['swot', 'strategy', 'analysis'],
    content: `Conduct a detailed SWOT analysis for [Company Name].
    
STRENGTHS:
- What unique assets or capabilities does the company possess?
- Where do they have a competitive advantage?

WEAKNESSES:
- What areas are they underperforming in?
- What resources do they lack compared to competitors?

OPPORTUNITIES:
- What market trends could they exploit?
- Are there adjacent markets they can enter?

THREATS:
- Who are the emerging competitors?
- Are there regulatory or macro risks?

CONCLUSION:
- Weigh the strengths vs threats to determine the overall outlook.`
  },
  {
    title: 'Porter\'s Five Forces',
    description: 'Evaluate the competitive intensity and attractiveness of an industry.',
    category: Category.INDUSTRY_ANALYSIS,
    tags: ['strategy', 'industry', 'competition'],
    content: `Analyze the [Industry Name] using Porter's Five Forces framework.

1. Threat of New Entrants: How high are barriers to entry (capital, regulation, brand)?
2. Bargaining Power of Suppliers: Are suppliers concentrated? Can they dictate prices?
3. Bargaining Power of Buyers: Are customers fragmented or concentrated? heavily price-sensitive?
4. Threat of Substitute Products: Are there alternative solutions that offer better value?
5. Competitive Rivalry: Is it a price war or value-based competition?

Summary: Is this industry structurally attractive for long-term capital?`
  },
  {
    title: 'Earnings Call Sentiment Analysis',
    description: 'Analyze the tone and sentiment of executive leadership during earnings calls.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['sentiment', 'earnings', 'management'],
    content: `Analyze the transcript of the latest earnings call for [Company Name].

- What was the overall sentiment (Bullish, Cautious, Bearish)?
- Extract key quotes related to future guidance.
- Did management dodge any analyst questions? If so, which ones?
- Compare the tone of the CEO vs the CFO.
- Flag any words indicating uncertainty (e.g., "headwinds", "challenging", "transition").`
  },
  {
    title: 'Executive Team Audit',
    description: 'Assess the background, track record, and alignment of company leadership.',
    category: Category.COMPANY_OPS,
    tags: ['management', 'governance', 'leadership'],
    content: `Perform an audit on the executive team of [Company Name].

- CEO Track Record: Past successes/failures. Tenure at current company.
- Insider Ownership: Do executives hold significant stock? Have they been buying or selling recently?
- Compensation: Is pay aligned with shareholder value (ROIC, EPS) or just size (Revenue)?
- Board Composition: Are board members independent or insiders?`
  },
  {
    title: 'Product/Market Fit Check',
    description: 'Evaluate customer feedback and traction to assess product-market fit.',
    category: Category.INVESTMENT_RESEARCH,
    tags: ['product', 'customer', 'reviews'],
    content: `Analyze the product-market fit for [Company Name]'s core product.

- What problem does it solve for the customer?
- Summarize the top 3 positive and negative themes from recent customer reviews (G2, Capterra, Amazon, etc.).
- Is the product a "must-have" or "nice-to-have"?
- How high are the switching costs for customers?`
  }
];

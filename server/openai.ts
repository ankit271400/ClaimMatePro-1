import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface FlaggedClause {
  title: string;
  summary: string;
  originalText: string;
  riskLevel: 'high' | 'medium' | 'low';
  category: string;
}

interface PolicyAnalysis {
  riskScore: number; // 0-100
  riskLevel: 'high' | 'medium' | 'low';
  summary: string;
  flaggedClauses: FlaggedClause[];
  recommendations: string;
}

export async function analyzePolicy(policyText: string): Promise<PolicyAnalysis> {
  try {
    const prompt = `You are an expert insurance policy analyst. Analyze the following insurance policy text and provide a comprehensive risk assessment.

Policy Text:
${policyText}

Please provide your analysis in JSON format with the following structure:
{
  "riskScore": <number between 0-100, where 100 is highest risk>,
  "riskLevel": <"low", "medium", or "high">,
  "summary": "<2-3 sentence executive summary of the policy's overall risk profile and key characteristics>",
  "flaggedClauses": [
    {
      "title": "<concise title describing the clause concern>",
      "summary": "<plain English explanation of why this clause is concerning or favorable>",
      "originalText": "<exact text from the policy that contains this clause>",
      "riskLevel": "<high, medium, or low>",
      "category": "<type of clause, e.g., 'exclusion', 'limitation', 'coverage', 'deductible'>"
    }
  ],
  "recommendations": "<actionable advice for the policyholder based on the analysis>"
}

Focus on:
1. Pre-existing condition exclusions
2. Waiting periods
3. Coverage limitations
4. Deductible amounts
5. Claim filing requirements
6. Network restrictions
7. Coverage gaps
8. Favorable terms

Provide clear, consumer-friendly explanations that help policyholders understand their coverage.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert insurance policy analyst. Provide detailed, accurate analysis of insurance policies in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const analysis = JSON.parse(content) as PolicyAnalysis;

    // Validate and sanitize the response
    const sanitizedAnalysis: PolicyAnalysis = {
      riskScore: Math.max(0, Math.min(100, analysis.riskScore || 0)),
      riskLevel: ['low', 'medium', 'high'].includes(analysis.riskLevel) ? analysis.riskLevel : 'medium',
      summary: analysis.summary || "Analysis completed successfully.",
      flaggedClauses: (analysis.flaggedClauses || []).map(clause => ({
        title: clause.title || "Policy Clause",
        summary: clause.summary || "No summary available",
        originalText: clause.originalText || "",
        riskLevel: ['high', 'medium', 'low'].includes(clause.riskLevel) ? clause.riskLevel : 'medium',
        category: clause.category || "general"
      })),
      recommendations: analysis.recommendations || "Please review your policy carefully and consult with an insurance professional if you have questions."
    };

    return sanitizedAnalysis;

  } catch (error) {
    console.error("Error analyzing policy with OpenAI:", error);
    
    // Return a default analysis if OpenAI fails
    return {
      riskScore: 50,
      riskLevel: 'medium',
      summary: "Unable to complete automated analysis. Please review your policy manually or try uploading again.",
      flaggedClauses: [],
      recommendations: "We recommend having a qualified insurance professional review your policy to identify any potential concerns or coverage gaps."
    };
  }
}

// Alternative function for analyzing specific clauses
export async function analyzeSpecificClause(clauseText: string, context: string): Promise<FlaggedClause> {
  try {
    const prompt = `Analyze this specific insurance policy clause in the context provided.

Clause Text: "${clauseText}"
Context: "${context}"

Provide analysis in JSON format:
{
  "title": "<concise title>",
  "summary": "<plain English explanation>",
  "originalText": "${clauseText}",
  "riskLevel": "<high, medium, or low>",
  "category": "<clause type>"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert insurance policy analyst. Analyze specific clauses and explain their implications in consumer-friendly terms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const analysis = JSON.parse(content) as FlaggedClause;
    return analysis;

  } catch (error) {
    console.error("Error analyzing specific clause:", error);
    return {
      title: "Clause Analysis",
      summary: "Unable to analyze this clause automatically.",
      originalText: clauseText,
      riskLevel: 'medium',
      category: 'general'
    };
  }
}

// Function to generate claim preparation guidance
export async function generateClaimGuidance(policyText: string, claimType: string): Promise<string[]> {
  try {
    const prompt = `Based on this insurance policy, provide specific step-by-step guidance for filing a ${claimType} claim.

Policy Text: ${policyText}

Provide guidance as a JSON array of strings, each representing a specific step:
{
  "steps": [
    "Step 1 description",
    "Step 2 description",
    "..."
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert insurance claims specialist. Provide clear, actionable guidance for filing insurance claims."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return ["Contact your insurance company to begin the claims process."];
    }

    const result = JSON.parse(content);
    return result.steps || ["Contact your insurance company to begin the claims process."];

  } catch (error) {
    console.error("Error generating claim guidance:", error);
    return [
      "Contact your insurance company to report the claim",
      "Gather all relevant documentation",
      "Fill out required claim forms",
      "Submit your claim with supporting evidence",
      "Follow up on claim status regularly"
    ];
  }
}

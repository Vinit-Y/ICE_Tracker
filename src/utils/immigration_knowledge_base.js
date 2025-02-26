export class ImmigrationKnowledgeBase {
  constructor() {
    this.kb_data = {
      visa_categories: {
        "F-1 Student Visa": {
          keywords: ["f1", "student visa", "study", "college", "university"],
          content: "The F-1 visa is for academic students enrolled in US colleges, universities, or language training programs. Students must maintain a full course load and can work on-campus up to 20 hours per week while school is in session.",
          requirements: ["Acceptance at accredited institution", "Proof of financial support", "Intent to return to home country"],
          timeline: "Apply 120 days before program start date"
        },
        "H-1B Work Visa": {
          keywords: ["h1b", "work visa", "employment", "professional", "specialty"],
          content: "The H-1B visa is for foreign workers in specialty occupations that require theoretical or technical expertise. Employers must sponsor applicants and file a Labor Condition Application.",
          requirements: ["Bachelor's degree or equivalent", "Job offer from US employer", "Specialty occupation"],
          timeline: "Annual lottery in March, employment can begin October 1"
        }
      },
      legal_rights: {
        "Rights During ICE Encounters": {
          keywords: ["ice", "raid", "arrest", "detention", "rights"],
          content: "You have the right to remain silent and not answer questions about your immigration status. You can refuse to sign documents without speaking to an attorney. You have the right to speak to an attorney and to make a phone call if detained.",
          important_notes: ["Do not open the door without a judicial warrant", "Do not lie or provide false documents"]
        }
      },
      // Add more categories as needed
    };
  }

  search(query, maxResults = 3) {
    const results = [];
    const queryTerms = query.toLowerCase().split(' ');

    // Search through all categories
    for (const [category, items] of Object.entries(this.kb_data)) {
      for (const [key, item] of Object.entries(items)) {
        if (this._matchesKeywords(queryTerms, item.keywords)) {
          results.push({
            type: category,
            title: key,
            content: item.content,
            relevance: this._calculateRelevance(queryTerms, item.keywords)
          });
        }
      }
    }

    // Sort by relevance and limit results
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxResults);
  }

  _matchesKeywords(queryTerms, keywords) {
    return keywords.some(keyword => 
      queryTerms.some(term => keyword.includes(term))
    );
  }

  _calculateRelevance(queryTerms, keywords) {
    let matches = 0;
    for (const term of queryTerms) {
      for (const keyword of keywords) {
        if (keyword.includes(term)) matches++;
      }
    }
    return matches / keywords.length;
  }
} 
import React from 'react';
import { useState } from 'react';
import OpenAI from 'openai';
import { ImmigrationKnowledgeBase } from '../utils/immigration_knowledge_base';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, make API calls through your backend
});

// Initialize knowledge base
const kb = new ImmigrationKnowledgeBase();

// Fallback responses when API fails
const fallbackResponses = {
  laws: `1. Immigration and Nationality Act (1952): Cornerstone of US immigration law
        [Learn more](https://www.uscis.gov/laws-and-policy/legislation/immigration-and-nationality-act)

        2. REAL ID Act (2005): Sets standards for state-issued IDs
        [Learn more](https://www.dhs.gov/real-id)

        3. Immigration Reform and Control Act (1986): Employer verification system
        [Learn more](https://www.uscis.gov/i-9-central)

        4. Refugee Act (1980): Establishes asylum procedures
        [Learn more](https://www.acf.hhs.gov/orr/policy-guidance/refugee-act)

        5. DREAM Act: Pathway for young immigrants
        [Learn more](https://www.nilc.org/issues/immigration-reform-and-executive-actions/dreamact/basic-facts-dream-act)`,
  visas: `Common U.S. Immigration Visa Types:

1. Family-Based Visas
   - IR (Immediate Relative) Visas: For spouses, parents, and children of U.S. citizens
   - F1-F4: Family preference categories
   [Learn more](https://www.uscis.gov/family)

2. Employment-Based Visas
   - H-1B: Specialty occupations
   - L-1: Intracompany transfers
   - E-2: Treaty investors
   - O-1: Extraordinary ability
   [Learn more](https://www.uscis.gov/working-in-the-united-states)

3. Student Visas
   - F-1: Academic students
   - M-1: Vocational students
   - J-1: Exchange visitors
   [Learn more](https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors)

4. Humanitarian Visas
   - Asylum
   - U visa: Crime victims
   - T visa: Trafficking victims
   - TPS: Temporary Protected Status
   [Learn more](https://www.uscis.gov/humanitarian)

5. Diversity Visa Program
   - DV Lottery: Annual program for underrepresented countries
   [Learn more](https://www.uscis.gov/green-card/green-card-eligibility/green-card-through-the-diversity-immigrant-visa-program)

Contact an immigration attorney for specific visa eligibility and requirements.`
};

const isGreeting = (text) => {
  const greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"];
  return greetings.some(greeting => text.toLowerCase().includes(greeting));
};

const systemPrompt = `You are a specialized immigration law assistant focused on providing information about ICE enforcement and immigrant rights. 
Important guidelines:

- When someone greets you, respond with "Hello! How can I help you today?"

- Focus on key immigration laws and rights:
  * Know Your Rights during ICE encounters
  * Rights in immigration court proceedings
  * Rights during arrests and detentions
  * Sanctuary city policies in Massachusetts
  * TRUST Act provisions

- Provide specific information about:
  * ICE enforcement limitations
  * Warrant requirements
  * Right to remain silent
  * Right to attorney
  * Rights against unlawful searches
  * Rights of family members

Always end with: "This is general information. Please consult an immigration attorney for specific legal advice."`;

const ImmigrationBot = ({ mapData }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getDataSummary = () => {
    if (!mapData) return null;
    
    const incidents = mapData.incidents;
    const total = incidents.length;
    const courthouse = incidents.filter(i => i.type.includes('Courthouse')).length;
    const jail = incidents.filter(i => i.type.includes('Jail')).length;
    
    const statusCount = incidents.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      locations: { courthouse, jail },
      statusDistribution: statusCount
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Handle greetings directly
    if (isGreeting(userMessage)) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Hello! I'm your Immigration Law Assistant. How can I help you today? You can ask me about visa types, legal rights, application procedures, or finding resources."
      }]);
      setIsLoading(false);
      return;
    }

    // Try knowledge base first
    const kbResults = kb.search(userMessage);
    if (kbResults.length > 0) {
      // Format KB response
      const formattedKBResponse = formatKBResponse(kbResults);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: formattedKBResponse
      }]);
      setIsLoading(false);
      return;
    }

    // If no KB match, try OpenAI
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
          { role: "user", content: userMessage }
        ],
        max_tokens: 400,
        temperature: 0.7
      });

      const botResponse = response.choices[0].message.content;
      const formattedResponse = formatResponse(botResponse);
      setMessages(prev => [...prev, { role: 'assistant', content: formattedResponse }]);
    } catch (error) {
      console.error('Error:', error);
      // Use fallback responses as last resort
      if (userMessage.toLowerCase().includes('visa')) {
        const formattedResponse = formatResponse(fallbackResponses.visas);
        setMessages(prev => [...prev, { role: 'assistant', content: formattedResponse }]);
      } else if (userMessage.toLowerCase().includes('law')) {
        const formattedResponse = formatResponse(fallbackResponses.laws);
        setMessages(prev => [...prev, { role: 'assistant', content: formattedResponse }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I apologize, but I\'m having trouble processing your request. Please try again.'
        }]);
      }
    }

    setIsLoading(false);
  };

  const formatKBResponse = (results) => {
    let response = '';
    
    results.forEach(result => {
      if (result.type === 'faq') {
        response += `Q: ${result.question}\nA: ${result.answer}\n\n`;
      } else {
        response += `${result.title}\n${result.content}\n\n`;
      }
    });

    response += "\nThis is general information. Please consult an immigration attorney for specific legal advice.";
    return formatResponse(response);
  };

  const formatResponse = (response) => {
    return response
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="bot-interface">
      <div className="bot-header">
        <div className="bot-avatar">
          <svg viewBox="0 0 24 24">
            <path d="M12,2A2,2 0 0,1 14,4V6H16A2,2 0 0,1 18,8H20A2,2 0 0,1 22,10V12A2,2 0 0,1 20,14H18V16A2,2 0 0,1 16,18H14V20A2,2 0 0,1 12,22A2,2 0 0,1 10,20V18H8A2,2 0 0,1 6,16V14H4A2,2 0 0,1 2,12V10A2,2 0 0,1 4,8H6A2,2 0 0,1 8,6H10V4A2,2 0 0,1 12,2M12,8A2,2 0 0,0 10,10A2,2 0 0,0 12,12A2,2 0 0,0 14,10A2,2 0 0,0 12,8Z"/>
          </svg>
        </div>
        <h3>Immigration Law Assistant</h3>
        <a href="tel:8133430063" className="phone-link">📞 (813) 343-0063</a>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
            dangerouslySetInnerHTML={{ __html: message.content }}
          >
          </div>
        ))}
        {isLoading && <div className="loading">Bot is typing...</div>}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about immigration laws..."
          className="chat-input"
        />
        <button type="submit" className="chat-submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ImmigrationBot; 
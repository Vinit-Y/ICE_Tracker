
# ICE Tracker

  

ICE Tracker is a web application designed to enhance transparency and awareness of ICE enforcement activities across Massachusetts. It provides real-time updates through an interactive map, an AI-powered FAQ chatbot, and an Interactive Voice Response (IVR) system to ensure accessible legal guidance for all.

  

🛠️ Developed at #CivicHacks2025 Hackathon held at **Boston University**, hosted by **Major League Hacking (MLH)**.

  

---

  

## 📖 Project Story

  

### 🏆 Inspiration

The inspiration for ICE Tracker stemmed from the need for greater transparency and awareness around ICE enforcement activities. With immigration being a critical and often contentious issue, we wanted to create a tool that empowers communities with the information they need to stay informed and proactive. Our goal was to bridge the gap between data and action, providing a platform that not only informs but also engages users in meaningful ways.

  

### 🎓 What We Learned

Throughout the development of ICE Tracker, we learned the importance of integrating multiple technologies to create a seamless user experience. We explored the capabilities of interactive maps, chatbots, and automated call systems, gaining insights into how these tools can be leveraged to provide comprehensive support. Additionally, we deepened our understanding of immigration laws and the challenges faced by those affected by ICE activities, which informed the design and functionality of our platform.

  

### 🏗️ How We Built the Project

ICE Tracker was built using a combination of modern web technologies and APIs:

  

-  **Frontend**: We used React to create a dynamic and responsive user interface. The interactive map, built with a mapping library, displays real-time data on ICE enforcement activities.

-  **Backend**: Supabase was utilized for data storage and real-time updates, allowing users to report incidents and view the latest information.

-  **Chatbot**: An AI-powered chatbot was integrated into the web app to provide instant answers to immigration-related queries.

-  **Automated Call System**: We implemented a call feature using a language model to offer an automated FAQ service, ensuring users have access to information anytime.

  

### 🚧 Challenges We Faced

Building ICE Tracker presented several challenges:

  

-  **Data Accuracy**: Ensuring the accuracy and reliability of the data presented on the map was a top priority. We had to carefully source and verify information to maintain trust with our users.

-  **Integration**: Integrating various technologies, such as the chatbot and automated call system, required careful planning and execution to ensure a seamless user experience.

-  **User Engagement**: Designing features that not only inform but also engage users was a key focus. We wanted to create a platform that encourages active participation and reporting.

-  **Legal Considerations**: Navigating the complexities of immigration law and ensuring our platform complies with legal standards was an ongoing challenge.

  

## 🚀 Features

-  **📍 Interactive Map** – Displays real-time ICE enforcement activity reports.

-  **💬 AI-Powered Chatbot** – Answers immigration-related queries instantly.

-  **📞 Automated IVR System** – Provides voice-based access to critical information.

-  **📡 Real-Time Data Updates** – Users can report ICE activities for community awareness.

-  **📊 Data Visualization** – Presents complex data in an easy-to-understand format.

  

## 🛠️ Tech Stack

### **Frontend**

- React (for a dynamic and responsive UI)

- Leaflet / Mapbox (for the interactive map)

  

### **Backend**

- Supabase (for data storage and real-time updates)

- Node.js with Express (for API and backend logic)

  

### **AI & Automation**

- OpenAI GPT API (for chatbot functionality)

- Twilio (for the IVR system)

  

---

  

## 🏗️ How to Set Up Locally

1.  **Clone the repository**

```bash

git clone https://github.com/your-username/ice-tracker.git

cd ice-tracker

```

2.  **Install dependencies**

```bash

npm install

```

3.  **Set up environment variables**

Create a `.env` file in the root directory and add the required API keys:

```bash

REACT_APP_MAPBOX_KEY=your_mapbox_api_key

SUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_supabase_anon_key

OPENAI_API_KEY=your_openai_api_key

TWILIO_SID=your_twilio_sid

TWILIO_AUTH_TOKEN=your_twilio_auth_token

```

4.  **Start the development server**

```bash

npm run dev

```

  

---

  

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork the repository

```bash

git fork https://github.com/your-username/ice-tracker.git

```

2. Create a new branch

```bash

git checkout -b feature-name

```

3. Commit your changes

```bash

git commit -m "Added new feature"

```

4. Push to your branch

```bash

git push origin feature-name

```

5. Submit a pull request

  

---

  

## 📜 License

This project is licensed under the [MIT License](LICENSE).
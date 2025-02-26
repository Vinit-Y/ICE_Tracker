import streamlit as st
import pandas as pd
import folium



def main():
    st.set_page_config(page_title="Immigration Assistance System", layout="wide")
    st.title("Immigration Assistance System")

    # Create two columns for layout
    col1, col2 = st.columns([2, 3])
    
    with col1:
        # Chat interface
        st.header("Immigration Assistant")
        
        # Display chat history
        chat_container = st.container()
        with chat_container:
            for message in st.session_state.chat_history:
                if message["role"] == "user":
                    st.markdown(f"**You:** {message['content']}")
                else:
                    st.markdown(f"**Assistant:** {message['content']}")
                    if message.get("resources"):
                        st.markdown("**Relevant Resources:**")
                        for resource in message["resources"]:
                            st.markdown(f"- [{resource['name']}]({resource['url']})")
        
        # User input
        user_input = st.text_input("Ask a question about immigration:")
        if user_input:
            # Add user message to history
            st.session_state.chat_history.append({"role": "user", "content": user_input})
            
            # Get bot response
            response_data = st.session_state.bot.process_query(user_input)
            
            # Add bot response to history
            st.session_state.chat_history.append({
                "role": "assistant", 
                "content": response_data["text"],
                "resources": response_data.get("suggested_resources", [])
            })
            
            # Rerun to update the chat display
            st.experimental_rerun()
    
    with col2:
        # Tabs for different features
        tab1, tab2, tab3 = st.tabs(["Resource Map", "Report Form", "Case Analysis"])
        
        with tab1:
            st.header("Immigration Resources Near You")
            # Create map centered on US
            m = folium.Map(location=[37.0902, -95.7129], zoom_start=4)
            
            # Add sample resource markers
            resources = [
                {"name": "Legal Aid Society", "lat": 40.7128, "lon": -74.0060, "type": "legal"},
                {"name": "Community Support Center", "lat": 34.0522, "lon": -118.2437, "type": "community"},
                {"name": "Immigration Clinic", "lat": 41.8781, "lon": -87.6298, "type": "medical"}
            ]
            
            for resource in resources:
                folium.Marker(
                    [resource["lat"], resource["lon"]],
                    popup=resource["name"],
                    tooltip=f"{resource['name']} ({resource['type']})"
                ).add_to(m)
            
                # Form fields
                incident_date = st.date_input("Date of Incident")
                incident_time = st.time_input("Time of Incident")
                location = st.text_input("Location (address, city, state)")
                
                incident_type = st.selectbox(
                    "Type of Incident",
                    ["ICE Raid", "Checkpoint", "Workplace Enforcement", "Home Visit", "Other"]
                )
                
                description = st.text_area("Description of Incident")
                contact_info = st.text_input("Contact Information (optional)")
                
                st.markdown("**Your privacy is important.** This information is used only for community alerts and tracking patterns.")
                submit = st.form_submit_button("Submit Report")
                
                if submit:
                    st.success("Report submitted. Thank you for helping keep the community informed.")
        
        with tab3:
            st.header("Immigration Case Analysis")
            st.write("Get an assessment of your immigration situation and potential options.")
            
            # Case analysis form
            case_type = st.selectbox("Case Type", ["Visa Application", "Deportation Defense", "Asylum", "Family Petition"])
            nationality = st.text_input("Country of Origin")
            years_in_us = st.number_input("Years in the US", min_value=0, max_value=100)
            
            has_family = st.checkbox("Do you have immediate family members who are US citizens?")
            criminal_record = st.checkbox("Do you have any criminal history in the US?")
            
            analyze_button = st.button("Analyze My Case")
            
            if analyze_button:
                # In a real app, this would use the PredictiveAnalysis component
                st.markdown("### Case Assessment")
                st.markdown("Based on the information provided, here's an initial assessment:")
                
                # Sample analysis output
                st.markdown("- **Potential Pathways:** Family-based petition, Asylum claim")
                st.markdown("- **Success Probability:** Moderate")
                st.markdown("- **Recommended Next Steps:** Consult with an immigration attorney specializing in family petitions")
                
                st.warning("This is a preliminary assessment only. Immigration law is complex and case-specific. Always consult with a qualified immigration attorney.")

if __name__ == "__main__":
    main() 
import streamlit as st
import requests
from datetime import datetime

# ---------------- CONFIG ----------------
BASE_URL = "http://127.0.0.1:8000"  # Change if deployed

# ---------------- SESSION STATE ----------------
if "access_token" not in st.session_state:
    st.session_state.access_token = None
if "refresh_token" not in st.session_state:
    st.session_state.refresh_token = None

# ---------------- FUNCTIONS ----------------
def login(username, password):
    url = f"{BASE_URL}/auth/token/"
    response = requests.post(url, json={"username": username, "password": password})
    if response.status_code == 200:
        tokens = response.json()
        st.session_state.access_token = tokens["access"]
        st.session_state.refresh_token = tokens["refresh"]
        st.success("Logged in successfully!")
    else:
        st.error("Login failed! Check username/password.")

def get_tasks():
    url = f"{BASE_URL}/api/tasks/"
    headers = {"Authorization": f"Bearer {st.session_state.access_token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        st.error("Failed to fetch tasks.")
        return []

def create_task(title, description, reward):
    url = f"{BASE_URL}/api/tasks/"
    headers = {
        "Authorization": f"Bearer {st.session_state.access_token}",
        "Content-Type": "application/json"
    }
    data = {"title": title, "description": description, "reward": reward}
    response = requests.post(url, json=data, headers=headers)
    if response.status_code in [200, 201]:
        st.success("Task created successfully!")
    else:
        st.error(f"Failed to create task: {response.json()}")

def checkout_task(task_id):
    url = f"{BASE_URL}/api/tasks/{task_id}/checkout/"
    headers = {"Authorization": f"Bearer {st.session_state.access_token}"}
    response = requests.post(url, headers=headers)
    if response.status_code == 200:
        st.success("Task marked as paid!")
    else:
        st.error("Failed to mark task as paid.")

# ---------------- STREAMLIT UI ----------------
st.title("🚀 HUDRA Tasks Dashboard")

# --------------- Login Section ----------------
if st.session_state.access_token is None:
    st.subheader("Login")
    username = st.text_input("Username")
    password = st.text_input("Password", type="password")
    if st.button("Login"):
        login(username, password)
else:
    # ---------------- SIDEBAR NAV ----------------
    menu = st.sidebar.selectbox("Menu", ["Tasks List", "Create Task", "Logout"])

    # ---------------- TASKS LIST ----------------
    if menu == "Tasks List":
        st.subheader("Tasks List")
        tasks = get_tasks()
        
        # Filter options
        filter_option = st.selectbox("Filter Tasks", ["All", "Paid", "Unpaid"])
        
        for task in tasks:
            if filter_option == "Paid" and not task['is_paid']:
                continue
            if filter_option == "Unpaid" and task['is_paid']:
                continue

            # Color-coded
            if task['is_paid']:
                st.success(f"**{task['title']}**")
            else:
                st.warning(f"**{task['title']}**")
            
            st.write(f"Description: {task['description']}")
            st.write(f"Reward: {task['reward']}")
            st.write(f"Completed: {task['is_completed']}, Paid: {task['is_paid']}")
            st.write(f"Created by: {task['created_by']}, at {datetime.fromisoformat(task['created_at'][:-1])}")
            
            # Mark paid button
            if not task['is_paid']:
                if st.button(f"Mark Paid - {task['id']}", key=f"pay_{task['id']}"):
                    checkout_task(task['id'])
            st.markdown("---")

    # ---------------- CREATE TASK ----------------
    elif menu == "Create Task":
        st.subheader("Create New Task")
        new_title = st.text_input("Title")
        new_desc = st.text_area("Description")
        new_reward = st.text_input("Reward")
        if st.button("Create Task"):
            create_task(new_title, new_desc, new_reward)

    # ---------------- LOGOUT ----------------
    elif menu == "Logout":
        st.session_state.access_token = None
        st.session_state.refresh_token = None
        st.experimental_rerun()
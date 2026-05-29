# MediConnect – Healthcare Appointment, Video Consultation & Mental Health Support Platform

## Overview

MediConnect is a full-stack healthcare management platform developed using the MERN Stack, Python Flask, MongoDB, WebRTC, and AI technologies. The platform enables patients to discover doctors, book appointments, attend online video consultations, and receive mental health support through an AI-powered chatbot.

The system provides dedicated dashboards for Patients, Doctors, and Administrators, ensuring secure, efficient, and user-friendly healthcare management.

---

## Features

### Patient Module

* User Registration and Login
* Secure JWT-Based Authentication
* Browse Doctors by Specialization
* Book Appointments Online
* View Appointment History
* Manage User Profile
* Attend Video Consultations
* Access Mental Health Support Chatbot

### Doctor Module

* Doctor Dashboard
* Manage Profile Information
* View Scheduled Appointments
* Update Availability
* Conduct Online Consultations
* Manage Patient Interactions

### Admin Module

* Secure Admin Authentication
* Add, Update, and Remove Doctors
* Manage Appointments
* Monitor System Activities
* Dashboard-Based Administration

---

## Mental Health AI Chatbot

The platform integrates an AI-powered mental health chatbot developed using Python Flask and Groq API.

### Chatbot Features

* Conversational Mental Health Assistance
* Friendly and Empathetic Responses
* Emotional Distress Detection
* Severity Classification (Low, Medium, High)
* Stress and Anxiety Support
* Depression Awareness Assistance
* Crisis Detection Mechanism
* Personalized Mental Wellness Guidance
* Appointment Recommendation for Severe Cases

### Severity-Based Support

#### Low Severity

* Emotional support and wellness suggestions
* Healthy lifestyle and self-care recommendations

#### Medium Severity

* Coping strategies for stress and anxiety
* Encouragement to seek professional guidance

#### High Severity

* Crisis-related keyword detection
* Immediate professional support recommendations
* Appointment booking suggestions with healthcare professionals
* Emergency mental health support guidance

---

## Video Consultation System

MediConnect provides real-time doctor-patient video consultations using WebRTC technology.

### Features

* Real-Time Video Communication
* Secure Peer-to-Peer Connectivity
* Low-Latency Audio and Video Streaming
* Online Doctor Consultations
* Remote Healthcare Accessibility
* Appointment-Based Video Sessions

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* REST API Development
* JWT Authentication

### AI Chatbot Backend

* Python
* Flask
* Groq API
* Llama 3.1 Model

### Database

* MongoDB
* Mongoose

### Cloud Services

* Cloudinary

### Real-Time Communication

* WebRTC

---

## Core Functionalities

### Authentication & Authorization

* User Registration
* Login and Logout
* JWT-Based Authentication
* Role-Based Access Control

### Doctor Management

* Doctor Profile Creation
* Specialization Management
* Experience Tracking
* Availability Management
* Image Upload Support

### Appointment Management

* Online Appointment Scheduling
* Appointment Tracking
* Appointment History
* Appointment Cancellation

### Mental Health Support

* AI-Powered Chat Assistance
* Emotional Severity Analysis
* Mental Wellness Recommendations
* Healthcare Consultation Suggestions

### Video Consultation

* Secure Online Meetings
* Real-Time Doctor-Patient Interaction
* Remote Healthcare Delivery

---

## Database Design

The application uses MongoDB collections for:

* Users
* Doctors
* Appointments

### Database Constraints

* MongoDB ObjectId serves as the Primary Key (_id)
* Collection references maintain relationships between documents
* Required field validation ensures data integrity
* Unique constraints prevent duplicate user accounts

---

## Installation & Setup

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend (Clientside)

```bash
cd clientside
npm install
npm run dev
```

### Admin Panel

```bash
cd admin
npm install
npm run dev
```

### Mental Health Chatbot

```bash
cd chatbot
pip install -r requirements.txt
python chatbot_api.py
```

---

## Environment Variables

### Backend (.env)

```env
MONGODB_URI=
JWT_SECRET=
PORT=

ADMIN_EMAIL=
ADMIN_PASSWORD=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
```

### Client (.env)

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Admin (.env)

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Chatbot (.env)

```env
GROQ_API_KEY=
```

---

## Local URLs

| Service                   | URL                   |
| ------------------------- | --------------------- |
| Client Application        | http://localhost:5173 |
| Admin Dashboard           | http://localhost:5174 |
| Backend API               | http://localhost:4000 |
| Mental Health Chatbot API | http://localhost:8000 |

---

## Future Enhancements

* Online Payment Gateway Integration
* Electronic Prescription Management
* Medical Records Storage
* Appointment Reminder Notifications
* AI-Based Symptom Analysis
* Healthcare Analytics Dashboard
* Multi-Participant Video Consultations

---

## Learning Outcomes

* Full Stack MERN Development
* RESTful API Development
* MongoDB Database Design
* JWT Authentication and Authorization
* Cloudinary Integration
* WebRTC-Based Real-Time Communication
* Python Flask API Development
* AI Chatbot Integration
* React Component Architecture
* State Management
* Responsive UI Development
* Healthcare Application Design

---

## Authors

* Rahul Yadav
* Radhika Sikarwar
* Raj Gupta

### Project Title

**MediConnect – Smart Healthcare Appointment, Video Consultation & Mental Health Support Platform**

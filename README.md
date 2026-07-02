# 4Ps - LORO - Speech Progress Buddy

*This project was developed for SparkFest 2026.*

## 📖 Project Brief
**LORO** is an evidence-based, therapeutic AI companion designed to assist children experiencing speech delays and language confusion. In an era of increasing digital media consumption, many children experience language development hurdles, struggling to isolate and structure words correctly. LORO transforms screen time from passive, isolating consumption into an active, voice-driven interactive environment that helps children practice, structure, and master articulation with precision.

### The Problem
* **Speech Delay Crisis:** Speech delay is the most common developmental issue among preschoolers, affecting 5% to 8% of children at age 4.5. Up to 60% of affected children do not naturally catch up, leading to long-term academic and social risks.
* **Impact of Excessive Screen Time:** Research shows children exposed to more than 4 hours of screen time daily have a 40% prevalence rate of speech delay.
* **Environmental Confusion:** Inconsistent linguistic exposure, often exacerbated by passive media, causes children to experience speech blocks and vocabulary retrieval bottlenecks.
* **Lack of Accessible Intervention:** Existing speech therapy is often cost-prohibitive, and current digital tools lack the phoneme-level voice recognition and child-friendly interfaces required for effective intervention.

---

## 👥 Team Members
**Team Name:** 4Ps
* **John David G. Romero** - Full-Stack Integration & Scrum Master
* **Shiraine Mariaine Q. Bituin** - Frontend Development & UI/UX Design
* **Tomas Josh B. Flordeliza** - Frontend Development & UI/UX Design
* **Carl Ivan J. Ibias** - DevOps, Deployment, MySQL & QA Testing

---

## ☁️ Google Technologies Used
* **Gemini API:** Powers the core AI engine for multimodal audio processing, pedagogical response generation, and vocal sentiment analysis.
* **Google AI Studio:** Utilized for rapid prototyping, testing, and refining conversational prompt personas.

---

## ✨ Core Features
* 🧩 **Language Separation Guardrails:** Establishes a strict barrier between languages (e.g., "English Only" or "Tagalog Only" modes). Trains the child to structurally identify and comprehend exactly which language they are actively reading, speaking, and interacting with, preventing syntax mixing.
* 🗣️ **Stimulus-and-Response Scaffolding:** Operates on an automated "Walkie-Talkie" loop: the app listens, transcribes the child’s speech, processes the sentence integrity via Gemini, and provides immediate, empathetic structural feedback. Prevents "error fossilization" by providing real-time corrections.
* 📊 **Analytical Dashboard & Clinical Metrics (Linguistic Displacement Index):** Tracks phonological error heatmaps, words-per-minute (WPM), and prolonged hesitations to pinpoint vocabulary retrieval bottlenecks. Monitors vocal stress patterns to automatically "de-load" difficulty and prevent burnout.
* 🧠 **MBTI-Adaptive Tutoring:** Tailors pedagogical delivery to the child’s psychological archetype, dynamically adjusting pacing based on their comfort and frustration markers.

---

## 🛠️ Technologies Used
* **Frontend:** ReactJS, Tailwind CSS, HTML5, JavaScript (PWA Offline-First Architecture)
* **Backend:** Java, Spring Boot (Asynchronous Batching Pipeline)
* **Database:** MySQL (Relational mappings for MBTI profiles, tiers, and phonetic metrics)
* **AI Engine:** Gemini API 

---

## 🚀 Setup Instructions
### 1. Database Setup
1. Create a database in your local MySQL instance: `CREATE DATABASE sparkfest_db;`
2. Configure `application.properties` with your MySQL credentials.

### 2. Backend & Frontend
* **Backend:** Navigate to `/backend`, configure your `gemini.api.key` environment variable, and run `mvn spring-boot:run` (or `./mvnw spring-boot:run`).
* **Frontend:** Navigate to `/frontend`, run `npm install`, then start the server with `npm start`.

---

## 🤖 AI Disclosure
In accordance with hackathon submission rules:
* **Core AI Engine:** We utilize the Gemini API for multimodal audio processing, pedagogical response generation, and vocal sentiment analysis.
* **Development Assistance:** AI coding assistants were utilized for boilerplate code generation, debugging, and optimizing Spring Boot/React integration.
* **Prototyping:** Google AI Studio was used for testing and refining conversational prompt personas.

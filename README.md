# 🌟 Hisab.AI – Intelligent Receipt Processing Agent

**Hisab.AI** is a high-performance, **FastAPI-based AI microservice** designed for intelligent receipt processing. It leverages the power of Google Cloud services and the Gemini API to reliably extract, structure, and validate critical data from receipt images.

## 🚀 Features at a Glance

  * **✔ OCR Extraction:** Utilizes the **Google Cloud Vision API** for high-accuracy text extraction from uploaded images.
  * **✔ Multi-Pass Enhancement:** Improves initial OCR results through automated image cleaning, noise reduction, rotation correction, and text refinement.
  * **✔ LLM-Based Structuring:** **Google Gemini** processes the refined OCR text to generate consistent, structured **JSON output**.
  * **✔ Job-Based Async Processing:** Implements a robust background task system for scalable and non-blocking processing.
  * **✔ Tamper-Proof Hashing:** Generates a **SHA256 hash** of the processed receipt data, ensuring data integrity and tamper-proof records.
  * **✔ Cloud-Ready:** Optimized for seamless deployment on platforms like **GCP Cloud Run**, **Render**, and **Railway**.

-----

## 📁 Project Structure

```
HisabAIBackend/
│
├── app/
│   ├── main.py            # FastAPI application entry point
│   ├── service.py         # Core business logic
│   ├── jobs.py            # Asynchronous job handling
│   ├── agent_core.py      # Main orchestration logic
│   ├── ocr.py             # Google Cloud Vision wrapper
│   ├── ocr_utils.py       # Image processing utilities
│   ├── llm.py             # Gemini integration and structuring
│   ├── hashing.py         # SHA256 hashing utility
│   └── config.py          # Configuration loading
│
├── requirements.txt       # Python dependencies
├── Dockerfile             # Containerization instructions
└── .env.example           # Example environment variables
```

-----

## 🧪 API Endpoints

The API is designed around an asynchronous job model for handling large images and complex processing.

### 1\. Health Check

Checks the status of the service.
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Returns `{"status": "ok"}` if the service is running. |

### 2\. Start OCR + LLM Job

Initiates the asynchronous receipt processing.
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/start_job` | Uploads an image file (`FormData: file: <image>`) and starts the background job. |

**Example Response:**

```json
{
  "job_id": "a4c8e1b3-92a9-4b74-bc35-61f97e8a85b5"
}
```

### 3\. Check Job Status

Retrieves the results once the job is completed.
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/status/{job_id}` | Returns the current status and the results/hash if complete. |

**Example Completed Response:**

```json
{
  "status": "completed",
  "result": {
    "ocr_text": "...",
    "structured": {
      "vendor": "Starbucks",
      "date": "2025-11-30",
      "total": "5.50",
      "tax": "0.35",
      "category": "Food & Drink",
      "confidence": {
        "vendor": 0.95,
        "total": 0.99
      }
    }
  },
  "hash": "3c1b7d2c9d55f11dcc56340ab8417be34a72dec5336d87842161ccdb53aa6778"
}
```

-----

## 🔧 Local Installation and Setup

### 1\. Clone Repository

```bash
git clone <repo-url>
cd HisabAIBackend
```

### 2\. Create Virtual Environment

```bash
# For Windows
python -m venv env
.\env\Scripts\activate

# For Linux/Mac
python3 -m venv env
source env/bin/activate
```

### 3\. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4\. Configure Environment Variables

Create your environment file from the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```ini
GEMINI_API_KEY=your_google_ai_key
GEMINI_MODEL=gemini-2.0-flash
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
# ... other variables
```

**Note:** The `GOOGLE_APPLICATION_CREDENTIALS` points to your Google Cloud service account key file for the Vision API.

### 5\. Run Server

```bash
uvicorn app.main:app --reload --port 8000
```

The application will be accessible at `http://127.0.0.1:8000`.

-----

## ☁️ Cloud Deployment Options

### 🐳 Option 1: Docker Deployment

1.  **Build Image**
    ```bash
    docker build -t hisab-ai-agent .
    ```
2.  **Run Container**
    ```bash
    docker run -d -p 8000:8000 -e PORT=8000 hisab-ai-agent
    ```

### 🚀 Option 2: Deploy to Google Cloud Run (Recommended for Scalability)

1.  **Submit Docker Image to Google Container Registry (GCR)**

    ```bash
    gcloud builds submit --tag gcr.io/<project-id>/hisab-ai-agent
    ```

    *Replace `<project-id>` with your GCP Project ID.*

2.  **Deploy to Cloud Run**

    ```bash
    gcloud run deploy hisab-ai-agent \
      --image gcr.io/<project-id>/hisab-ai-agent:latest \
      --platform managed \
      --region asia-south1 \
      --allow-unauthenticated \
      --port=8000 \
      --set-env-vars GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json
    ```

### 🚀 Option 3: Deploy to Render

This is an easy-to-use option, perfect for quick deployments.

1.  Connect your **GitHub repository** to Render.
2.  Create a **New → Web Service**.
3.  Set the **Runtime** to `Python 3`.
4.  Set the **Start Command**:
    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port $PORT
    ```
5.  Add your environment variables (`GEMINI_API_KEY`, etc.) directly in the Render dashboard.

### 🚀 Option 4: Deploy to Railway

A simplified deployment workflow.

1.  Initialize Railway in the project directory:
    ```bash
    railway init
    ```
2.  Deploy the service:
    ```bash
    railway up
    ```
3.  Add the required secrets in the Railway dashboard or via CLI:
    ```bash
    GOOGLE_APPLICATION_CREDENTIALS=<json content>
    GEMINI_API_KEY=<your key>
    ```

-----

## 🔐 Security Notes

  * **Credentials:** **Never** commit your `service-account.json` file to the repository. Use environment variables and secrets management in production.
  * **CORS:** The current setup has **CORS enabled for all origins**. This should be restricted to your specific front-end domain(s) for a production environment.
  * **Validation:** Implement strict file validation and sanitization for uploaded images before passing them to the OCR service.
  * **Rate-Limiting:** Implement API **rate-limiting** before production rollout to protect against abuse.

-----

## 🤝 Contributing

Pull requests, feature suggestions, and bug reports are highly welcome. This service is designed to be **modular**, allowing easy addition of new extractors, LLM agents, and data validation steps.

## ⭐ Author

[Tarun Mangalampalli](https://www.google.com/search?q=link-to-your-profile)

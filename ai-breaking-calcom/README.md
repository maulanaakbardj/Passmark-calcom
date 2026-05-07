## 🔐 Environment Variables (.env)

The `.env` file is used to store sensitive configuration and environment-specific settings such as:

- API keys
- Access tokens
- Passmark AI credentials
- Base URLs for testing environments
- Other secret configuration values

⚠️ IMPORTANT:
- Never commit the `.env` file to GitHub or any public repository
- Make sure `.env` is added to `.gitignore`
- Each developer must create their own local `.env` file

---

### Example `.env` file

```bash
API_KEY=your_api_key_here
BASE_URL=https://cal.com
PASSMARK_TOKEN=your_token_here
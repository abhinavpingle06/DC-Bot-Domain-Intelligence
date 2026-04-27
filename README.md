# 🤖 Domain Metadata Fetcher (Discord Bot)

## 📌 Overview

Domain Metadata Fetcher is a Discord bot that retrieves and displays detailed metadata about any given domain. It helps users quickly access useful information such as domain registration details, hosting data, and technical insights directly within Discord.

---

## ⚡ Features

* 🌐 Fetch domain metadata instantly
* 🔍 WHOIS lookup support
* 📡 DNS information retrieval
* 🏢 Hosting & IP details
* ⚙️ Easy-to-use Discord commands
* 🚀 Fast and lightweight

---

## 🛠️ Tech Stack

* **Language:** Node.js
* **Framework:** Discord.js
* **APIs:** WHOIS, DNS lookup services

---

## ⚙️ Installation

1. Clone the repository

```bash id="p2l8zn"
git clone https://github.com/your-username/domain-metadata-bot.git
cd domain-metadata-bot
```

2. Install dependencies

```bash id="a7g4pt"
npm install
# or
pip install -r requirements.txt
```

3. Configure environment variables
   Create a `.env` file and add:

```env id="jv5m1c"
DISCORD_BOT_TOKEN=your_token_here
API_KEY=your_api_key_here
```

---

## 🚀 Usage

Start the bot:

```bash id="m1z8ld"
npm start
# or
python bot.py
```

### 💬 Example Commands

```bash id="u3s6kp"
!domain example.com
```

### 📊 Sample Output

* Domain Name
* Registrar
* Creation & Expiry Date
* IP Address
* DNS Records

---

## 🔐 Permissions

Make sure your bot has:

* Read Messages
* Send Messages
* Embed Links

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

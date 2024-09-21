
# Househole

![Alt text](https://thecyberpunker.com/wp-content/uploads/2024/09/househole-tool.gif)

**Househole** is a self-hosted solution designed to centralize your trashmail, disposable-emails or temporary email services, offering a robust alternative to public temporary email providers. Househole prioritizes privacy, security, and control, while helping users remain undetected by services that identify temporary emails.

## Key Features

- **Self-Hosted Privacy**: Complete control over your email services. All data remains within your infrastructure / hosting.
- **Undetectable Temporary Emails**: Househole helps bypass **almost all** temporary email detection systems, such as those employed by services like [Proxycurl](https://nubela.co/proxycurl/), check by yourself.
- **Data Recovery**: Centralized management allows you to retain control of your temporary emails, which is useful if you ever need to recover accounts created with them.
- **Security from Leaks**: Public trashmail services can expose sensitive information. Househole mitigates this risk by providing a private alternative.

![Alt text](https://thecyberpunker.com/wp-content/uploads/2024/09/japan-guy.gif)

## Why Househole?

Temporary email services are essential for maintaining Privacy online. However, many websites have learned to block these services to prevent abuse. Furthermore, public temporary email providers can leak critical data, as a result of temporary emails used in testing during a development, or accounts created using temporary emails that continue to be used over time and could cause account takeovers, leading to security breaches.

Househole offers a **self-hosted** solution, helping users:
- Register for websites that block temporary emails, without exposing their primary email addresses.
- Avoid using public services where emails are exposed, and data can be compromised.
- Control the email data used for registrations, ensuring it's recoverable in cases of account recovery.

## Installation Guide

Househole is easy to install and can be hosted on your own server or computer.

### Requirements:
- **Node.js** (for manual setup)
- **A main domain and several secondary domains** for managing your email service.

### Steps:

1. **Clone the repository**:

```bash
git clone https://github.com/TheCyberpunker/houseHole.git
cd houseHole
```
   
2. **Install dependencies**:
   
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
```

- Verify that nvm is installed:

```bash
nvm -v
nvm install 22.8.0
```

- Verify the installation:

```bash
node -v
npm -v
```

3. **Build and start the application**:

```bash
npm install
npm run dev
```

4. **Access Househole through your browser**:

```bash
http://localhost:3000
```

## Configuration
Configure your domains by editing or adding the file 
src/data/domains.json file.

```json
[
  "test.com",
  "hi.com"
]
```

Edit the .env.local file or create a new one in the root directory of househole with your email **IMAP** settings.
- example:
```sh
IMAP_HOST=imap.digitalocean.com
IMAP_PASSWORD=example123_123*
IMAP_PORT=993
IMAP_USER=test@example.com
```

For a **comprehensive guide** on installing and setting up **Househole** on a clean Linux environment, please refer to the full tutorial available on my website:

👉 **[Detailed Installation Guide for Househole](https://thecyberpunker.com/tools/househole-private-disposable-email/)** 👈

## Usage

Househole provides a simple dashboard for managing your temporary email addresses. The dashboard allows you to:

**View incoming emails**: All received emails are displayed in the admin panel.
**Organize and manage your data**: You can sort, filter, and delete emails as needed.
**Recover important accounts**: All temporary emails are stored securely and can be accessed later for account recovery purposes.

**Househole** comes with two main views to manage your temporary email service efficiently:

### 1. Email Management View:
   - View a list of all received emails.
   - **Search and Filter**: Easily search through your received emails and filter them by email address.
   - View detailed information about each email, including the sender, subject, and content.

### 2. Domain Management and Email Creation:
   - On the **right-hand menu**, you can:
     - **Add Domains**: Add domains you own or purchase new ones (**on your server or hosting provider**) to use for your email service.
     - **Create Emails**: Generate new temporary email addresses on the fly.
     - **Copy to Clipboard**: Conveniently copy newly created email addresses to your clipboard for quick use


## Evasion from Temporary Email Detection
Many services use API requests to check if an email belongs to a temporary provider. Househole is built with this in mind. By hosting your own service and configuring it properly, **you can go unnoticed by detection services**. Make sure to:

- Configure your domain to avoid appearing on temporary email blacklists.
- Regularly update your imap settings to stay ahead of detection services.
- Rotate or add new domains.

## Advantages of Househole

**Privacy and Security**: Unlike public trashmail services, with Househole use locally, or properly secured your temporary emails are never exposed to third parties.
**Undetectable (Not Always)**: Househole’s design makes it possible to use temporary emails even on services that typically block them.
**Data Control**: Store, manage, and recover temporary emails used for account registrations, giving you long-term control.
**No Dependency on Public Services**: As a self-hosted solution, you don’t rely on third-party services for your email privacy (**Clarification:** You need a service provider for the hosting, domains and imap accounts, but one that you can manage yourself).


## Can it be improved?

Integration with multiple domain support for even greater flexibility.
Advanced spam filtering to reduce unwanted email traffic.
Enhanced user management to allow multi-user environments with role-based access.

## Disclaimer

This project is something I developed to meet a personal need, and I won't be providing any support for it. However, I believe it could be useful to others. **Feel free to download, copy, fork, or modify it** as you see fit, but please understand that I won’t be able to offer help with issues or improvements.

This project is developed for **educational purposes only**, and I am not responsible for any misuse of the tool. Please use it responsibly and in accordance with all applicable laws and regulations. 

### Vulnerabilities

**Please do not search for vulnerabilities in this project.** I haven’t implemented input validation or many other security aspects, so there are likely to be vulnerabilities. However, this project is not designed for rigorous testing or production-level deployment. If you're looking for projects to explore security flaws, I recommend looking for larger, more sustainable projects with active contributors and community support. This is a small personal project with limited scope and doesn't warrant security scrutiny.

## Licence
This project is licensed under the MIT License. See the LICENSE file for more details.


**Househole**: Stay secure, stay private, stay undetected.

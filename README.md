
# Househole

**Househole** is a self-hosted solution designed to centralize your trashmail or temporary email services, offering a robust alternative to public temporary email providers. Househole prioritizes privacy, security, and control, while helping users remain undetected by services that identify temporary emails.

## Key Features

- **Self-Hosted Privacy**: Complete control over your email services. All data remains within your infrastructure.
- **Undetectable Temporary Emails**: Househole helps bypass temporary email detection systems, such as those employed by services like Proxycurl.
- **Data Recovery**: Centralized management allows you to retain control of your temporary emails, which is useful if you ever need to recover accounts created with them.
- **Security from Leaks**: Public trashmail services can expose sensitive information. Househole mitigates this risk by providing a private alternative.

## Why Househole?

Temporary email services are essential for maintaining anonymity online. However, many websites have learned to block these services to prevent abuse. Furthermore, public temporary email providers can leak critical data, as seen in numerous penetration tests where attackers retrieved sensitive information like administrator or developer emails, leading to security breaches.

Househole offers a **self-hosted** solution, helping users:
- Register for websites that block temporary emails, without exposing their primary email addresses.
- Avoid using public services where emails are exposed, and data can be compromised.
- Control the email data used for registrations, ensuring it's recoverable in cases of account recovery.

## Disclaimer

This project is something I developed to meet a personal need, and I won't be providing any support for it. However, I believe it could be useful to others. **Feel free to download, copy, fork, or modify it** as you see fit, but please understand that I won’t be able to offer help with issues or improvements.

### Vulnerabilities

**Please do not search for vulnerabilities in this project.** I haven’t implemented input validation or many other security aspects, so there are likely to be vulnerabilities. However, this project is not designed for rigorous testing or production-level deployment. If you're looking for projects to explore security flaws, I recommend looking for larger, more sustainable projects with active contributors and community support. This is a small personal project with limited scope and doesn't warrant security scrutiny.

## Installation

Househole is easy to install and can be hosted on your own server.

### Requirements:
- **Docker** (recommended)
- **Node.js** (for manual setup)
- **A domain or subdomain** for managing your email service

### Steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/househole.git
   cd househole
Run with Docker (preferred method):

```bash
Copy code
docker-compose up
```
2. **Run manually**:

3. **Install dependencies**:
```bash
Copy code
npm install
```

4. **Build and start the application**:
```bash
npm run build
npm start
```

5. **Access Househole through your browser**:

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
Edit the .env.local file with your email imap settings.

```sh
IMAP_HOST=imap.digitalocean.com
IMAP_PASSWORD=example123_123*
IMAP_PORT=993
IMAP_USER=test@example.com
```
# Usage

Househole provides a simple dashboard for managing your temporary email addresses. The dashboard allows you to:

**View incoming emails**: All received emails are displayed in the admin panel.
**Organize and manage your data**: You can sort, filter, and delete emails as needed.
**Recover important accounts**: All temporary emails are stored securely and can be accessed later for account recovery purposes.

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

I currently don't have the time to provide support or updates for this tool. However, **you're welcome to download, fork, or modify it as you see fit**. Please feel free to adapt it to your needs, but keep in mind that it is provided "as-is" without active maintenance or further development planned at this time.

Fork the repository.

## Licence
This project is licensed under the MIT License. See the LICENSE file for more details.


**Househole**: Stay secure, stay private, stay undetected.